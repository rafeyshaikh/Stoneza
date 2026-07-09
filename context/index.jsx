"use client";

// import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CategoriesProvider } from "./CategoriesContext";

export default function Providers({ children, initialCategories = [] }) {
  return (
    // <ThemeProvider>
      <CategoriesProvider initialCategories={initialCategories}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </CategoriesProvider>
    // </ThemeProvider>
  );
}