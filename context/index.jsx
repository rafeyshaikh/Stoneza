"use client";

// import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CategoriesProvider } from "./CategoriesContext";
import { ContactProvider } from "./ContactContext";

export default function Providers({ children, initialCategories = [], initialContactDetails = {} }) {
  return (
    // <ThemeProvider>
      <CategoriesProvider initialCategories={initialCategories}>
        <ContactProvider initialContactDetails={initialContactDetails}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ContactProvider>
      </CategoriesProvider>
    // </ThemeProvider>
  );
}