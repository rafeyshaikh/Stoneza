"use client";

import { createContext, useContext, useState } from "react";

const CategoriesContext = createContext();

export function CategoriesProvider({ children, initialCategories = [], initialCollections = null }) {
  const [categories, setCategories] = useState(initialCategories);
  const [collections, setCollections] = useState(initialCollections);

  return (
    <CategoriesContext.Provider value={{ categories, setCategories, collections, setCollections }}>
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
