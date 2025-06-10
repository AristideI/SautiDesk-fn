import GeneralHeader from "components/utils/generalHeader";
import { useEffect } from "react";
import {
  Outlet,
  redirect,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router";
import { useAuthContext } from "store/auth.context";
import { UserRole } from "types/user.type";

export default function GeneralLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user?.userRole === UserRole.ADMIN) {
      navigate("/o/dashboard");
    }
  }, [user, navigate]);

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
