
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
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (!cancelled) {
          setUser(currentUser);
          setAuthError(false);
        }
      } catch (error) {
        if (cancelled) return;

        // Remove the token only when the API explicitly
        // reports that the token is invalid or expired.
        const status =
          error?.response?.status ??
          error?.status;

        if (status === 401) {
          removeToken();
          setUser(null);
        } else {
          // Preserve the token on network/server errors.
          setAuthError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  async function signIn(credentials) {
    const result = await login(credentials);
    const token = result?.access_token || result?.token;

    if (!token) {
      throw new Error(
        "Login succeeded but no access token was returned."
      );
    }

    setToken(token);

    try {
      const currentUser =
        result?.user || await getCurrentUser();

      setUser(currentUser);
      setAuthError(false);
      return currentUser;
    } catch (error) {
      // Do not leave a partially established login behind.
      removeToken();
      setUser(null);
      throw error;
    }
  }

  async function signUp(data) {
    const result = await register(data);
    const token = result?.access_token || result?.token;

    if (token) {
      setToken(token);

      if (result?.user) {
        setUser(result.user);
        setAuthError(false);
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
    setAuthError(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
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
