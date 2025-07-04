import Logo from "components/utils/logo";
import { OrgUserButton } from "components/utils/userButton";
import { Power, X, Phone } from "lucide-react";
import { NavLink, Outlet, useMatch, useParams } from "react-router";
import OrganisationContextProvider from "store/organisation.context";
import { navLinks } from "constants/navLinks";
import { useAuthContext } from "store/auth.context";
import { useNotificationContext } from "store/notification.context";
import { useState } from "react";

export default function OrganisationLayout() {
  const { organisationId } = useParams();
  const { logout } = useAuthContext();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const { notifications, isLoading } = useNotificationContext();

  function openNotificationModal() {
    setIsNotificationModalOpen(true);
  }

  function closeNotificationModal() {
    setIsNotificationModalOpen(false);
  }

  return (
    <OrganisationContextProvider organisationId={organisationId}>
      <main className="flex justify-end relative w-full min-h-screen">
        <aside className="w-1/6 fixed h-screen top-0 left-0 bg-black p-4 flex flex-col justify-between">
          <OrgUserButton />
          <section className="flex flex-col gap-6 h-full py-8">
            <section className="flex flex-col gap-2 h-fit">
              {navLinks(organisationId || "").map((page) => (
                <AsideLink
                  key={page.name}
                  name={page.name}
                  Icon={page.Icon}
                  path={page.path}
                  onClick={
                    page.name === "Notifications"
                      ? openNotificationModal
                      : undefined
                  }
                />
              ))}
            </section>

            {/* Conversation */}
            <div className="">
              <h3 className="text-sm text-white/70 mb-3 font-medium">
                Conversation
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-green transition-colors rounded-lg w-full">
                <Phone size={20} />
                +12346573106
              </button>
            </div>

            {/* Favorites */}
            <div>
              <h3 className="text-sm text-white/70 mb-3 font-medium">
                Favorites
              </h3>

              {/* Pinned Tickets */}
              <div className="mb-4">
                <h4 className="text-xs text-white/50 mb-2">Pinned Tickets</h4>
                <div className="space-y-2">
                  <div className="px-3 py-2 text-xs text-white/60 bg-white/5 rounded-lg">
                    Ticket #1234 - Login Issue
                  </div>
                  <div className="px-3 py-2 text-xs text-white/60 bg-white/5 rounded-lg">
                    Ticket #5678 - Payment Error
                  </div>
                </div>
              </div>

              {/* Pinned Knowledge Base */}
              <div className="mb-4">
                <h4 className="text-xs text-white/50 mb-2">
                  Pinned Knowledge Base
                </h4>
                <div className="space-y-2">
                  <div className="px-3 py-2 text-xs text-white/60 bg-white/5 rounded-lg">
                    How to Reset Password
                  </div>
                  <div className="px-3 py-2 text-xs text-white/60 bg-white/5 rounded-lg">
                    API Documentation
                  </div>
                </div>
              </div>

              {/* Pinned Conversations */}
              <div className="mb-4">
                <h4 className="text-xs text-white/50 mb-2">
                  Pinned Conversations
                </h4>
                <div className="space-y-2">
                  <div className="px-3 py-2 text-xs text-white/60 bg-white/5 rounded-lg">
                    Support Chat #1
                  </div>
                  <div className="px-3 py-2 text-xs text-white/60 bg-white/5 rounded-lg">
                    General Discussion
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50">Powered By</p>
              <Logo notClickable isSmall />
            </div>
            <div>
              <button
                className="text-white/70 rounded-lg p-2 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={logout}
              >
                <Power size={20} />
              </button>
            </div>
          </section>
        </aside>

        {/* Notification Modal */}
        {isNotificationModalOpen && (
          <div className="fixed inset-0 z-50 flex left-[17%] rounded-2xl">
            <div
              className="w-1/4 bg-black border-r border-green/20 flex flex-col"
              style={{ left: "17%" }} // Position it at 17% from the left
            >
              <div className="flex items-center justify-between p-4 border-b border-green/20">
                <h2 className="text-lg font-semibold text-white">
                  Notifications
                </h2>
                <button
                  onClick={closeNotificationModal}
                  className="text-white/70 hover:text-green transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:bg-white/5 ${
                          notification.isRead
                            ? "bg-white/5 border-white/10"
                            : "bg-green/10 border-green/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Profile Image */}
                          <div className="flex-shrink-0">
                            {notification.from.profile?.url ? (
                              <img
                                src={notification.from.profile.url}
                                alt={notification.from.username}
                                className="w-10 h-10 rounded-full object-cover border border-white/20"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green/50 to-green/30 border border-green/30 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {notification.from.username
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-white">
                                {notification.from.username}
                              </span>
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-green animate-pulse"></div>
                              )}
                            </div>

                            <p className="text-sm text-white/80 mb-2">
                              {notification.content}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/50">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>

                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  notification.type === "TICKET"
                                    ? "text-blue-400 bg-blue-500/20"
                                    : notification.type === "MESSAGE"
                                    ? "text-green-400 bg-green-500/20"
                                    : "text-purple-400 bg-purple-500/20"
                                }`}
                              >
                                {notification.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-white/50">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-5 5v-5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No notifications</p>
                    <p className="text-xs text-white/30 mt-1">
                      You&apos;re all caught up!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Overlay */}
            <div
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={closeNotificationModal}
            />
          </div>
        )}

        <article className="w-5/6 bg-red-100/5">
          <Outlet />
        </article>
      </main>
    </OrganisationContextProvider>
  );
}

interface NavLinkProps {
  path: string;
  name: string;
  Icon: React.ElementType;
  onClick?: () => void;
}

export function AsideLink({ path, name, Icon, onClick }: NavLinkProps) {
  const activeStyle = "bg-white/10 text-white font-bold";
  const baseStyle =
    "text-white/70 flex items-center gap-2 px-4 py-2 text-sm hover:text-red transition-colors rounded-lg";

  const isActive = useMatch(path);

  // if it is Notifications, it should not be navlink, instead it should be a button
  if (name === "Notifications") {
    return (
      <button onClick={onClick} className={baseStyle}>
        <Icon size={20} />
        {name}
      </button>
    );
  }

  return (
    <NavLink
      to={path}
      className={() => `${baseStyle} ${isActive ? activeStyle : ""}`}
    >
      <Icon size={20} />
      {name}
    </NavLink>
  );
}
