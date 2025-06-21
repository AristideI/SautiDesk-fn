import OrganisationCard from "components/cards/organisationCard";
import AdminHeader from "components/utils/adminHeader";
import Button from "components/utils/button";
import useOrganisations from "hooks/useOrganisations";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthContext } from "store/auth.context";
import { LoadingSection } from "components/utils/loadings";

export default function OrganisationsPage() {
  const { user } = useAuthContext();
  const { organisations, loading } = useOrganisations(user?.documentId);
  const navigate = useNavigate();

  function HandleOnCreate() {}

  function handleOpenOrganisation(id: string) {
    navigate(`/o/organisations/${id}`);
  }

  return (
    <article>
      <AdminHeader />
      <main className="bg-red-100/5 min-h-screen w-full padd py-20">
        <article className="flex flex-col gap-10">
          <h1 className="text-[1.5vw] font-semibold">Your Organisations</h1>
          <section className="flex gap-6">
            <Button
              buttonText="Create Organisation"
              variant="primary"
              onPress={HandleOnCreate}
              className="py-2 bg-green/50 border border-green"
            />
            <label className="w-1/4 relative">
              <input
                type="text"
                className="border border-white/30 rounded-lg w-full px-4 pl-8 py-2 outline-none"
                placeholder=""
              />
              <Search
                className="absolute top-1/4 left-2"
                color="#ffffff60"
                size={20}
              />
            </label>
          </section>
          {loading ? (
            <LoadingSection />
          ) : (
            <section>
              {organisations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organisations.map((org) => (
                    <OrganisationCard
                      key={org.id}
                      organisation={org}
                      onClick={() => handleOpenOrganisation(org.documentId)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No organisations found.</p>
              )}
            </section>
          )}
        </article>
      </main>
    </article>
  );
}
