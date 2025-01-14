import { useModal } from "../context/ModalContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";  // Importa useNavigate
import { useSession } from "../context/SessionContext";
import { baseDir } from "../path.js";

const Nav = () => {
  const { session, setSession } = useSession();
  const { openModal } = useModal();
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();  // Crea una instancia de useNavigate

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.clear();
    setSession(false);

    fetch(`${baseDir}/api/usuarios/logout`, {
      method: "GET",
      credentials: "include",  // Esto asegura que se envíe la cookie con la solicitud
    })
      .then(res => res.json())
      .then(res => {
        res?
          navigate("/") :
          console.log(res.error);
      })
      .catch(err => console.log(err));
  };

  return (
    <nav className="flex justify-between items-center p-4 text-white bg-gray-800">
      <h1 className="text-2xl font-bold">Tabl3ro</h1>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} aria-label="Cambiar tema">
          <i className={`fa-solid fa-circle-half-stroke ${theme === "dark" ? "text-yellow-500" : "text-gray-500"}`}></i>
        </button>
        {session ? (
          <div className="flex gap-4 items-center">
            <Link to="dashboard" aria-label="Inicio">
              <i className="fa-solid fa-house"></i>
            </Link>
            <Link to="notifications" aria-label="Notificaciones">
              <i className="fa-solid fa-bell"></i>
            </Link>
            <Link to="profile" aria-label="Perfil">
              Perfil
            </Link>
            <button onClick={handleLogout} className="text-red-500" aria-label="Cerrar sesión">
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button
            className="bg-white dark:text-black font-bold py-2 px-4 rounded"
            onClick={openModal}
            aria-label="Iniciar sesión"
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
