import GeneralHeader from "components/utils/generalHeader";
import { Outlet, useLocation, useMatches } from "react-router";

export default function GeneralLayout() {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <article className="">
      {!hideHeader && (
        <div className="h-20 bg-black">
          <GeneralHeader />
        </div>
      )}
      <Outlet />
    </article>
  );
}
