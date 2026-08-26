"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { EnquiryContextData } from "@/types/enquiry";

interface EnquiryModalContextType {
  isOpen: boolean;
  contextData: EnquiryContextData;
  openEnquiryModal: (data?: EnquiryContextData) => void;
  closeEnquiryModal: () => void;
}

const EnquiryModalContext = createContext<EnquiryModalContextType | undefined>(undefined);

export function EnquiryModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contextData, setContextData] = useState<EnquiryContextData>({});

  const openEnquiryModal = (data?: EnquiryContextData) => {
    setContextData(data || {});
    setIsOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsOpen(false);
  };

  return (
    <EnquiryModalContext.Provider
      value={{
        isOpen,
        contextData,
        openEnquiryModal,
        closeEnquiryModal,
      }}
    >
      {children}
    </EnquiryModalContext.Provider>
  );
}

export function useEnquiryModal() {
  const context = useContext(EnquiryModalContext);
  if (!context) {
    throw new Error("useEnquiryModal must be used within an EnquiryModalProvider");
  }
  return context;
}
