import { createContext, useContext, useState, useEffect } from "react";
import { api, getToken, setToken, removeToken } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { user } = await api.getMe();
      setUser(user);
    } catch {
      removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const { user, token } = await api.login(email, password);
    setToken(token);
    setUser(user);
    return user;
  };

  const register = async (email, password, name) => {
    const { user, token } = await api.register(email, password, name);
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
