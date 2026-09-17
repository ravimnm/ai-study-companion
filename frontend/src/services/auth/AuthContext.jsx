import { createContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  login,
  register,
} from "../api/auth";
import {
  getToken,
  removeToken,
  setToken,
} from "./authStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        removeToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function signIn(credentials) {
    const result = await login(credentials);

    const token = result?.access_token || result?.token;

    if (!token) {
      throw new Error("Login succeeded but no access token was returned.");
    }

    setToken(token);

    if (result?.user) {
      setUser(result.user);
      return result.user;
    }

    const currentUser = await getCurrentUser();
    setUser(currentUser);

    return currentUser;
  }

  async function signUp(data) {
    const result = await register(data);

    const token = result?.access_token || result?.token;

    if (token) {
      setToken(token);

      if (result?.user) {
        setUser(result.user);
        return result.user;
      }
    }

    return signIn({
      email: data.email,
      password: data.password,
    });
  }

  function signOut() {
    removeToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
