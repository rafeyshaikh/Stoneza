"use client";

import { createContext, useContext, useState } from "react";

const CategoriesContext = createContext();

export function CategoriesProvider({ children, initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);

  return (
    <CategoriesContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
}
