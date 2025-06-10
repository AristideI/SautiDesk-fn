// @ts-nocheck
import { useAuthContext } from "store/auth.context";
import type { Route } from "../+types/homePage";
import HeroSection from "components/hero.section";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SautiDesk" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <article className="flex-1 w-full min-h-screen">
      <HeroSection />
    </article>
  );
}
