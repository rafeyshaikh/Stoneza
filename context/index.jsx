"use client";

// import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CategoriesProvider } from "./CategoriesContext";
// import { CartProvider } from "./CartContext";

export default function Providers({ children, initialCategories = [] }) {
  return (
    // <ThemeProvider>
      <CategoriesProvider initialCategories={initialCategories}>
        <AuthProvider>
          {/* <CartProvider>*/}
            {children}
          {/*</CartProvider>*/}
        </AuthProvider>
      </CategoriesProvider>
    // </ThemeProvider>
  );
}