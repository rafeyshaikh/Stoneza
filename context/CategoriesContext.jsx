"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CategoriesContext = createContext();

export function CategoriesProvider({ children, initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    if (categories.length === 0) {
      try {
        const cached = localStorage.getItem("categories");
        if (cached) {
          setCategories(JSON.parse(cached));
        }
      } catch (e) {
        console.warn("Failed to load cached categories:", e);
      }
    } else {
      try {
        localStorage.setItem("categories", JSON.stringify(categories));
      } catch (e) {
        console.warn("Failed to cache categories:", e);
      }
    }
  }, [categories]);

  const updateCategories = (data) => {
    setCategories(data);
    try {
      localStorage.setItem("categories", JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to cache categories:", e);
    }
  };

  return (
    <CategoriesContext.Provider value={{ categories, setCategories: updateCategories }}>
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
