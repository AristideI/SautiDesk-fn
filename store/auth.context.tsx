import { API } from "api";
import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useMemo,
  useEffect,
} from "react";
import type {
  ILoginResponse,
  ILogInUser,
  IRegisterUser,
  IUser,
  UserRole,
} from "types/user.type";

interface AuthContextType {
  user: IUser | null;
  userRole: UserRole | null;
  token: string | null;
  loadUserInfo: () => Promise<void>;
  login: (user: ILogInUser) => Promise<IUser | void>;
  logout: () => void;
  register: (user: IRegisterUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  token: null,
  loadUserInfo: async () => {},
  login: async () => {
    return;
  },
  logout: () => {},
  register: async () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

type ProviderProps = {
  children: ReactNode;
};

export default function AuthContextProvider({ children }: ProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");

    if (token && currentUser && userRole) {
      setToken(token);
      setUser(JSON.parse(currentUser));
      setUserRole(userRole as UserRole);
    } else {
      setUser(null);
      setToken(null);
      setUserRole(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    }
  }, []);

  async function loadUserInfo() {
    try {
      const response = await API.userHandler.getLoginUser(user?.id || 0);
      setUser(response);
      setUserRole(response.userRole);
      localStorage.setItem("user", JSON.stringify(response));
      localStorage.setItem("userRole", response.userRole);
      console.log("User info loaded:", response);
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  }

  async function login(userInfo: ILogInUser) {
    try {
      const response = await API.userHandler.logIn(userInfo);
      setToken(response.jwt);
      localStorage.setItem("token", response.jwt);
      const user = await API.userHandler.getLoginUser(response.user.id);
      setUser(user);
      setUserRole(user.userRole);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.userRole);
      return user;
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("An error occurred. Please try again later");
    }
  }

  async function logout() {
    setUser(null);
    setToken(null);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
  }

  async function register(userInfo: IRegisterUser) {
    try {
      const response = await API.userHandler.register(userInfo);
      setUser(response.user);
      setToken(response.jwt);
      setUserRole(response.user.userRole);
      localStorage.setItem("token", response.jwt);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("userRole", response.user.userRole);
    } catch (error) {
      console.error("Error during registration:", error);
      throw new Error("An error occurred. Please try again later!");
    }
  }

  const values = useMemo(() => {
    return {
      user,
      userRole,
      token,
      loadUserInfo,
      login,
      logout,
      register,
    };
  }, [user]);
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
