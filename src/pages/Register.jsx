import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import {baseDir} from "../path.js";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    lastname: '',
    avatar: null
  });

  baseDir.startsWith("http://tabl3ro") && useEffect(()=>{
    fetch("../data/profile.json")
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  },[]) 

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      
      if (files && files[0]) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          setFormData((prevData) => ({
            ...prevData,
            avatar: file,
          }));
        } else {
          alert('Por favor, selecciona un archivo de imagen.');
        }
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    fetch(`${baseDir}/api/usuarios/`, {
      method: "POST",
      body: formDataToSend,
    })
      .then((response) => {
        console.log({response, formData});
        return window.location.href = "/";
      })
      .then((data) => {
        console.log("Registro exitoso:", data);
      })
      .catch((error) => {
        console.error("Error al registrar el usuario:", error);
      });
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen text-black dark:text-white dark:bg-black">
      <title>Registrate | Tabl3ro</title>
      <Link to="/" className="absolute top-0 left-0 px-3 py-1">
        <i className="fa-solid fa-arrow-right origin-bottom -rotate-180 text-2xl"></i>
      </Link>
      <div className="p-7 rounded-lg shadow-md w-full max-w-md min-h-full border border-solid border-2 border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center white dark:text-white">Registro</h2>
        <form onSubmit={handleSubmit} >
          <div className="mb-4">
            <label htmlFor="username" className="block white dark:text-white">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block white dark:text-white">Nombre</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block">Apellido</label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="file" className="block">Imagen</label>
            {
              baseDir.startsWith("http://localhost") ?
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-white"
                required
                /> 
                :
                <div>
                  
                </div>
              
            }
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-black"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
