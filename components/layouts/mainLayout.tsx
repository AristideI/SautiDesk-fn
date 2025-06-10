import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuthContext } from "store/auth.context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
}
