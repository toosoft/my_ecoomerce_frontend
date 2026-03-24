// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { useRouter } from "next/navigation";

// interface AuthContextType {
//   loggedIn: boolean;
//   user: string | null;
//   login: (user: string, token: string, expiry: number) => void;
//   logout: () => void;
//   isTokenValid: () => boolean; // ✅ ADD THIS
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const router = useRouter();
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [user, setUser] = useState<string | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const expiry = localStorage.getItem("token_expiry");

//     if (storedUser && expiry && Date.now() < Number(expiry)) {
//       setUser(storedUser);
//       setLoggedIn(true);
//     }
//   }, []);

//   const login = (user: string, token: string, expiry: number) => {
//     localStorage.setItem("user", user);
//     localStorage.setItem("token", token);
//     localStorage.setItem("token_expiry", expiry.toString());

//     setUser(user);
//     setLoggedIn(true);

//     router.push("/");
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     localStorage.removeItem("token_expiry");

//     setUser(null);
//     setLoggedIn(false);

//     router.push("/login");
//   };

//   // ✅ ADD THIS FUNCTION
//   const isTokenValid = (): boolean => {
//     const expiry = localStorage.getItem("token_expiry");
//     return !!expiry && Date.now() < Number(expiry);
//   };

//   return (
//     <AuthContext.Provider value={{ loggedIn, user, login, logout, isTokenValid }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };


// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { useRouter } from "next/navigation";

// interface AuthContextType {
//   loggedIn: boolean;
//   user: string | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (user: string, token: string, expiry: number) => void;
//   logout: () => void;
//   isTokenValid: () => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const router = useRouter();

//   const [loggedIn, setLoggedIn] = useState(false);
//   const [user, setUser] = useState<string | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");
//     const expiry = localStorage.getItem("token_expiry");

//     if (
//       storedUser &&
//       storedToken &&
//       expiry &&
//       Date.now() < Number(expiry)
//     ) {
//       setUser(storedUser);
//       setToken(storedToken);
//       setLoggedIn(true);
//     }
//   }, []);

//   const login = (user: string, token: string, expiry: number) => {
//     localStorage.setItem("user", user);
//     localStorage.setItem("token", token);
//     localStorage.setItem("token_expiry", expiry.toString());

//     setUser(user);
//     setToken(token);
//     setLoggedIn(true);

//     router.push("/");
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     localStorage.removeItem("token_expiry");

//     setUser(null);
//     setToken(null);
//     setLoggedIn(false);

//     router.push("/login");
//   };

//   const isTokenValid = (): boolean => {
//       if (typeof window === "undefined") return false; // ✅ FIX

//     const expiry = localStorage.getItem("token_expiry");
//     return !!expiry && Date.now() < Number(expiry);
//   };

  
//     console.log("isTokenValid + ");
//     console.log(isTokenValid());
//     console.log(isTokenValid());

//   const isAuthenticated = loggedIn && isTokenValid();

//   return (
//     <AuthContext.Provider
//       value={{
//         loggedIn,
//         user,
//         token,
//         isAuthenticated,
//         login,
//         logout,
//         isTokenValid,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };


"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  loggedIn: boolean;
  user: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: string, token: string, expiry: number) => void;
  logout: () => void;
  isTokenValid: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔥 SAFE TOKEN CHECK
  const isTokenValid = (): boolean => {
    if (typeof window === "undefined") {
      console.log("⚠️ Running on server, no localStorage");
      return false;
    }

    const expiry = localStorage.getItem("token_expiry");

    console.log("🔍 TOKEN CHECK");
    console.log("Expiry from storage:", expiry);
    console.log("Current time:", Date.now());

    if (!expiry) {
      console.log("❌ No expiry found");
      return false;
    }

    const isValid = Date.now() < Number(expiry);

    console.log("✅ Token valid?", isValid);

    return isValid;
  };

  // 🔥 LOAD USER FROM STORAGE
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");

    console.log("🔄 INIT AUTH");
    console.log("User:", storedUser);
    console.log("Token:", storedToken);
    console.log("Expiry:", expiry);

    if (
      storedUser &&
      storedToken &&
      expiry &&
      Date.now() < Number(expiry)
    ) {
      console.log("✅ Restoring session");

      setUser(storedUser);
      setToken(storedToken);
      setLoggedIn(true);
    } else {
      console.log("❌ No valid session found");
    }
  }, []);

  // 🔥 COMPUTE AUTH STATE SAFELY
  useEffect(() => {
    const valid = isTokenValid();

    console.log("🔐 AUTH STATE UPDATE");
    console.log("loggedIn:", loggedIn); ///
    console.log("token valid:", valid);

    setIsAuthenticated(loggedIn && valid);
  }, [loggedIn]);

  // 🔥 LOGIN
  const login = (user: string, token: string, expiry: number) => {
    console.log("🚀 LOGIN CALLED");
    console.log("User:", user);
    console.log("Token:", token);
    console.log("Expiry:", expiry);

    localStorage.setItem("user", user);
    localStorage.setItem("token", token);
    localStorage.setItem("token_expiry", expiry.toString());

    setUser(user);
    setToken(token);
    setLoggedIn(true);

    router.push("/");
  };

  // 🔥 LOGOUT
  const logout = () => {
    console.log("🚪 LOGOUT");

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");

    setUser(null);
    setToken(null);
    setLoggedIn(false);
    setIsAuthenticated(false);

    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        user,
        token,
        isAuthenticated,
        login,
        logout,
        isTokenValid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};