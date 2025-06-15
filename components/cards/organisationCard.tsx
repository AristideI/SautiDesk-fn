import { Boxes } from "lucide-react";
import type { IOrganisation } from "types/organisation.type";

interface OrganisationCardProps {
  organisation: IOrganisation;
  onClick?: () => void;
}

export default function OrganisationCard({
  organisation,
  onClick,
}: OrganisationCardProps) {
  return (
    <button
      className="flex gap-3 p-4 bg-white/10 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:bg-black transition-all border border-white/60"
      onClick={onClick}
    >
      <div className="bg-black w-fit h-fit p-2 rounded-full">
        <Boxes color="#ffffff70" />
      </div>
      <div className="flex flex-col justify-start items-start">
        <p className="font-semibold text-sm">{organisation.name}</p>
        <p className="text-sm text-gray-400">{organisation.agents?.length || 0} Agents.</p>
      </div>
    </button>
  );
}
