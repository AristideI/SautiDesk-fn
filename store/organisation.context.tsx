import { API } from "api";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type { IOrganisation } from "types/organisation.type";
import type { ITicket } from "types/ticket.types";
import type { IUser } from "types/user.type";

interface OrganisationContextType {
  organisation: IOrganisation | null;
  tickets: ITicket[] | null;
  agents: IUser[] | null;
  loading: boolean;
  loadOrganisation: () => Promise<void>;
}

const OrganisationContext = createContext<OrganisationContextType>({
  organisation: null,
  tickets: null,
  agents: null,
  loading: false,
  loadOrganisation: async () => {
    return Promise.resolve();
  },
});

export function useOrganisationContext() {
  return useContext(OrganisationContext);
}

type ProviderProps = {
  children: React.ReactNode;
  organisationId?: string;
};

export default function OrganisationContextProvider({
  children,
  organisationId,
}: ProviderProps) {
  const [organisation, setOrganisation] = useState<IOrganisation | null>(null);
  const [tickets, setTickets] = useState<ITicket[] | null>(null);
  const [agents, setAgents] = useState<IUser[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!organisationId) return;

    setLoading(true);
    try {
      loadOrganisation();
    } catch (error) {
      console.error("Error loading organisation:", error);
      toast.error("Failed to load organisation data, please try again.");
    } finally {
      setLoading(false);
    }
  }, [organisationId]);

  async function loadOrganisation() {
    const organisation = await API.organisationHandler.findById(
      organisationId!
    );
    setOrganisation(organisation);
    setTickets(organisation.tickets || null);
    setAgents(organisation.agents || null);
  }

  const values = useMemo(() => {
    return {
      organisation,
      tickets,
      agents,
      loading: loading,
      loadOrganisation,
    };
  }, [organisationId, organisation, tickets, agents]);

  return (
    <OrganisationContext.Provider value={values}>
      {children}
    </OrganisationContext.Provider>
  );
}
