import { useModal } from "../context/ModalContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useSession } from "../context/SessionContext";
import { baseDir } from "../path.js";
import Cookies from "universal-cookie";

const Nav = () => {
  const { session, setSession } = useSession();
  const { openModal } = useModal();
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();
  const cookies = new Cookies();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = () => {
    localStorage.clear();
    setSession(false);
    sessionStorage.clear();
    fetch(`${baseDir}/api/usuarios/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(res => {
        cookies.remove("token");
        res?
          navigate("/") :
          console.log(res.error);
      })
      .catch(err => console.log(err));
  };

  return (
    <nav className="flex justify-between items-center p-4 text-white dark:bg-black">
      <h1 className="text-2xl font-bold dark:text-white text-black">Tabl3ro</h1>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} aria-label="Cambiar tema">
          <i className={`fa-solid fa-circle-half-stroke ${theme === "dark" ? "text-yellow-500" : "text-gray-500"}`}></i>
        </button>
        {session && user ? (
          <div className="flex gap-4 items-center">
            <Link to="/dashboard" aria-label="Inicio">
              <i className="fa-solid fa-house text-black dark:text-white"></i>
            </Link>
            <Link to={`/profile/${user.username}`} className="text-black dark:text-white" aria-label="Perfil">
              Perfil
            </Link>
            <button onClick={handleLogout} className="text-red-500" aria-label="Cerrar sesión">
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button
            className="bg-black dark:bg-white text-white dark:text-black font-bold py-2 px-4 rounded"
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
