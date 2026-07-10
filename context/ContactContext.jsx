"use client";

import { createContext, useContext, useState } from "react";

const ContactContext = createContext();

export function ContactProvider({ children, initialContactDetails = {} }) {
  const [contactDetails, setContactDetails] = useState(initialContactDetails);

  return (
    <ContactContext.Provider value={{ contactDetails, setContactDetails }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within a ContactProvider");
  }
  return context;
}
