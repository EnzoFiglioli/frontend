import { useState, createContext, useContext } from "react";
import Cookies from "universal-cookie";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const cookies = new Cookies();
  const user = localStorage.getItem("user")

  const [session, setSession] = useState(()=> !user ? false : true);

  const handleSessionChange = (newSession) => {
    setSession(newSession);
    if (!newSession) {
      localStorage.clear();
      cookies.remove("token", { path: "/" });
    }
  };

  return (
    <SessionContext.Provider value={{ session, setSession: handleSessionChange }}>
      {children}
    </SessionContext.Provider>
  );
};


export const useSession = () => {
  const context = useContext(SessionContext);
  
  if (!context) {
    throw new Error("useSession debe ser usado dentro de un SessionProvider");
  }
  
  return context;
};
