import GeneralHeader from "components/utils/generalHeader";
import { Outlet } from "react-router";

export default function GeneralLayout() {
  return (
    <article className="">
      <GeneralHeader />
      <Outlet />
    </article>
  );
}
