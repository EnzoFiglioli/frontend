import { useState } from "react";
import { useModal } from "../context/ModalContext";
import { useNavigate } from "react-router-dom";
import { baseDir } from "../path.js";
 
const LoginModal = () => {
  const { isModalOpen, closeModal } = useModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch(`${baseDir}/api/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Error al iniciar sesión");
      }
  
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.usuario)); // Guardar correctamente los datos del usuario
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    }
  };
  

  if (!isModalOpen) return null;

  return (
    <div
      className="modal-overlay fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center"
      aria-hidden={!isModalOpen}
    >
      <form
        className="modal-content dark:bg-black bg-white p-8 rounded shadow-lg relative"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className="absolute top-4 right-4 p-2 text-black dark:text-white font-bold"
          onClick={closeModal}
        >
          X
        </button>
        <h2 className="dark:text-white text-xl font-bold">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <label htmlFor="email" className="block dark:text-white mt-4">
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          placeholder="ejemplo@correo.com"
          className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <label htmlFor="password" className="block dark:text-white mt-4">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="********"
          className="w-full p-2 border border-gray-300 rounded mt-2 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-4 w-full p-2 bg-blue-500 dark:text-white rounded hover:bg-blue-600 transition"
        >
          Iniciar Sesión
        </button>
        <p className="dark:text-white mt-4 text-sm">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Regístrate aquí
          </a>.
        </p>
        <a className="text-blue-500" href="/reset_password">¿Olvidaste tu constraseña?</a>
      </form>
    </div>
  );
};

export default LoginModal;
