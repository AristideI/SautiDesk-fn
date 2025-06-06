import { NavLink } from "react-router";
import Button from "./button";
import Logo from "./logo";

export default function GeneralHeader() {
  return (
    <article className="flex justify-between items-center sticky top-0 border-b-2 border-dark-green/20 padd py-4 bg-white">
      <Logo />
      <section className="flex gap-6 font-semibold">
        <HeaderLink to="/" text="Home" />
        <HeaderLink to="/pricing" text="Pricing" />
        <HeaderLink to="/resources" text="Resources" />
        <HeaderLink to="/help" text="Help" />
        <HeaderLink to="/contact" text="Contact" />
      </section>
      <section className="flex gap-6">
        <Button
          buttonText="Try SautiDesk"
          onPress={() => {}}
          variant="primary"
        />
        <Button
          buttonText="View Demo"
          onPress={() => {}}
          variant="quaternary"
        />
      </section>
    </article>
  );
}

interface NavLinkProps {
  to: string;
  text: string;
}

function HeaderLink({ to, text }: NavLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${isActive ? "border-b-2 border-green text-green font-bold" : ""}`
      }
    >
      {text}
    </NavLink>
  );
}
