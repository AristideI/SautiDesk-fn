import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type { NotificationContextType } from "types/context.type";
import type {
  INotification,
  ICreateNotification,
} from "types/notification.type";
import { API } from "api";
import { useAuthContext } from "./auth.context";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationContextProvider"
    );
  }
  return context;
}

type ProviderProps = {
  children: ReactNode;
};

export default function NotificationContextProvider({
  children,
}: ProviderProps) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();
  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.isRead).length;
  }, [notifications]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.notificationHandler.findAll();
      const filteredNotifications = response.filter(
        (notification) =>
          notification.from.id === user?.id ||
          notification.agent.id === user?.id
      );
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await API.notificationHandler.markAsRead(notificationId.toString());
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      // Note: This would need the current user ID from auth context
      // await API.notificationHandler.markAllAsRead(userId);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setError("Failed to mark all notifications as read");
    }
  };

  const createNotification = async (notificationData: ICreateNotification) => {
    try {
      // TODO: Replace with actual API call when notification handler is created
      // const response = await API.notificationHandler.createNotification(notificationData);

      const newNotification = await API.notificationHandler.create(
        notificationData
      );

      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    } catch (error) {
      console.error("Error creating notification:", error);
      setError("Failed to create notification");
    }
  };

  const values = useMemo(() => {
    return {
      notifications,
      unreadCount,
      isLoading,
      error,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      createNotification,
    };
  }, [notifications, unreadCount, isLoading, error]);

  return (
    <NotificationContext.Provider value={values}>
      {children}
    </NotificationContext.Provider>
  );
}
