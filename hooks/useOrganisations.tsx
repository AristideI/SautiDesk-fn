import { API } from "api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { IOrganisation } from "types/organisation.type";

export default function useOrganisations(ownerId?: string) {
  const [organisations, setOrganisations] = useState<IOrganisation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganisations();
  }, []);

  async function fetchOrganisations() {
    setLoading(true);
    setError(null);

    try {
      const organisations = await API.organisationHandler.findByPersonId(
        ownerId || ""
      );
      setOrganisations(organisations);
    } catch (error) {
      toast.error("Failed to fetch organisations, Please refresh the page!");
    } finally {
      setLoading(false);
    }
  }

  return {
    organisations,
    setOrganisations,
    loading,
    error,
  };
}
