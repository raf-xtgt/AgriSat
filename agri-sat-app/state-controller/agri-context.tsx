import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the schema for the report items
type ReportItems = {
    [key: string]: string;
  };

interface AgriContextType {
  ReportItems: ReportItems;
  setReport: (itemKey: string, delta: string) => void;
  emptyReports: () => void;
}

// Create a Cart Context (this is the state that is present in the different screens)
const AgriContext = createContext<AgriContextType | undefined>(undefined);

// Create a provider component
export const AgriProvider = ({ children }: { children: ReactNode }) => {
  const [ReportItems, setReportItems] = useState<ReportItems>({});

  const setReport = (itemKey: string, delta: string) => {
    setReportItems((prevItems) => ({
      ...prevItems,
      [itemKey]:  delta,
    }));
  };
  

  
  const emptyReports = () => {
    setReportItems({});
};

  return (
    <AgriContext.Provider value={{ ReportItems, emptyReports ,setReport }}>
      {children}
    </AgriContext.Provider>
  );
};

// Custom hook for using cart context
export const useCart = (): AgriContextType => {
  const context = useContext(AgriContext);
  if (!context) {
    throw new Error('useCart must be used within a AgriProvider');
  }
  return context;
};