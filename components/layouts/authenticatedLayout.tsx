import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router";
import { useAuthContext } from "store/auth.context";
import { ArrowLeft, User, Settings, LogOut } from "lucide-react";
import Button from "components/utils/button";

export default function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleBackToDashboard = () => {
    if (user?.userRole === "ADMIN") {
      navigate("/o/organisations");
    } else {
      navigate("/");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <User size={16} />
                <span>{user.username}</span>
              </div>
              <Button
                buttonText="Logout"
                onPress={handleLogout}
                variant="secondary"
                icon={<LogOut size={16} />}
                className="!px-3 !py-1 !text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
} 