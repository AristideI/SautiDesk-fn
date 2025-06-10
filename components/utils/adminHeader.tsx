import { LogoIcon } from "./logo";
import UserButton from "./userButton";

export default function AdminHeader() {
  return (
    <article className="py-2 border-b border-green/10 px-8 flex justify-between">
      <section className="flex items-center gap-4">
        <LogoIcon />
        <p className="text-2xl font-extralight text-white/20">/</p>
        <p className="text-sm">Organisations</p>
      </section>
      <UserButton />
    </article>
  );
}
