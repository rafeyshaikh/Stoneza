"use client";

import { createContext, useContext, useState } from "react";

const ContactContext = createContext();

export function ContactProvider({ children, initialContactDetails = {} }) {
  const [customContactDetails, setCustomContactDetails] = useState(null);
  const contactDetails = customContactDetails ?? initialContactDetails;

  return (
    <ContactContext.Provider
      value={{
        contactDetails,
        setContactDetails: setCustomContactDetails,
      }}
    >
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
