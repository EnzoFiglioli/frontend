import { createContext } from "react";

// Crear el contexto
export const NameContext = createContext();

// Componente proveedor del contexto
export const NameProvider = ({ children }) => {
  const name = "React Context"; // El valor que quieres compartir a través del contexto

  return (
    // Proveer el contexto a los componentes hijos
    <NameContext.Provider value={name}>
      {children}
    </NameContext.Provider>
  );
};

export default {NameProvider, NameContext};
