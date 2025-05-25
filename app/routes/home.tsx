import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { toast } from "react-toastify";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const notify = () => toast("Wow so easy !");

  return (
    <article>
      <button onClick={notify}>Notify !</button>
      <Welcome />
    </article>
  );
}
