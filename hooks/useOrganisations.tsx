import { API } from "api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "store/auth.context";
import type { IOrganisation } from "types/organisation.type";

export default function useOrganisations(ownerId?: string) {
  const [organisations, setOrganisations] = useState<IOrganisation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthContext();

  useEffect(() => {
    if (!ownerId && !user?.documentId) return; // Don't run if we don't have a valid ID

    fetchOrganisations();
  }, [ownerId, user?.documentId]);

  async function fetchOrganisations() {
    setLoading(true);
    setError(null);

    try {
      const organisations = await API.organisationHandler.findByPersonId(
        ownerId || user?.documentId || ""
      );
      console.log(organisations);
      setOrganisations(organisations);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch organisations, Please refresh the page!");
    } finally {
      setLoading(false);
    }
  }

  async function loadOrganisations() {
    await fetchOrganisations();
  }

  return {
    organisations,
    setOrganisations,
    loading,
    error,
    loadOrganisations,
  };
}
