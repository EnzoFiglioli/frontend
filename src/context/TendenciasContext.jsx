import { createContext, useContext, useState } from "react";

const TendenciasContext = createContext();

export const TendenciasProvider = ({ children }) => {
  const [tendencias, setTendencias] = useState([]);
  return (
    <TendenciasContext.Provider value={{ tendencias, setTendencias }}>
      {children}
    </TendenciasContext.Provider>
  );
};

export const useTendencias = () => {
  const context = useContext(TendenciasContext);
  if (!context) {
    throw new Error("useTendencias must be used within a TendenciasProvider");
  }
  return context;
};
