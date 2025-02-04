import { useState,useEffect } from "react";
import {ArrowLeft, Sun} from "lucide-react";
import {baseDir} from "../path.js";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("dark");


  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${baseDir}/api/usuarios/reset-password`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response.status === 200){
        alert("Se ha enviado un mail a tu correo para cambiar la contraseña");
      }
    })
    .catch((error) => {console.error('Error:', error)});
  }

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

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
		<title>¿Has olvidado la contraseña?</title>
		<a href="/" className="absolute top-4 left-4 text-blue-500">
			<ArrowLeft></ArrowLeft>
		</a>
		<Sun className="absolute top-4 right-4 cursor-pointer" onClick={()=>toggleTheme()}></Sun>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6 dark:text-white">
          Introduce tu mail para cambiar tu contraseña
        </h2>
        <form className="space-y-4" onSubmit={(e)=> handleSubmit(e)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 dark:text-gray-200"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="Aqui va tu mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-black"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;