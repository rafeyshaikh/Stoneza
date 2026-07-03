"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  async function logout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        setUser(null);
        setUserRole(null);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setUserRole(data.data.role);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isLoggedIn: !!user,
        logout,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);