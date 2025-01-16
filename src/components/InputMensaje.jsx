import {baseDir} from "../path.js";
import { useState, useEffect } from "react";
import  {useNewTweet} from "../context/TweetContex.jsx" 

const InputMensaje = () => {
  const [ message, setMessage ] = useState(""); 
  const [ categorias, setCategorias ] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const {sendTweet, setSendTweet} = useNewTweet
  const [categoriaTweet, setCategoriaTweet] = useState("");

  useEffect(()=>{
    fetch(`${baseDir}/api/categorias`)
      .then((res) => res.json())
      .then((res) => setCategorias(res))
      .catch(err => console.error(err));
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!message.trim()) {
      console.error("El mensaje está vacío.");
      return;
    }
  
    try {
      const response = await fetch(`${baseDir}/api/tweets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({
          content: message,
          categoria: categoriaTweet
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Tweet enviado con éxito:", result);
      setMessage("");
      setSendTweet(!sendTweet)
    } catch (error) {
      console.error("Error al enviar el tweet:", error.message);
    }
  };
  
    console.log({categoriaTweet})
    return (
      <div>
        <form 
          style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px", alignItems: "start" }}
          onSubmit={handleSubmit}>
          <div>
            <img
              src={userData.avatar}
              width="40"
              height="40"
              alt={userData.email}
              className="rounded-full"
            />
          </div>
  
          <div>
          <div style={{ textAlign: "right" }}>
            <select 
              className="dark:bg-black" 
              style={{ width: "auto", marginBottom: "10px" }}
              onChange={e =>setCategoriaTweet(e.target.value)}
              >
                <option value="" className="text-white">Seleccionar categoría</option>
              {
                categorias.map((i, index)=>(
                <option key={index} value={i.id_categoria}>{i.nombre}</option>
                ))
              }
            </select>
          </div>
            <textarea
              maxLength={140}
              className="text-white w-full bg-black cursor-text rounded focus:outline-none"
              placeholder="¡¿Qué está pasando?!"
              style={{resize:"none", minHeight:"15vh"}}
              onChange={event => setMessage(event.target.value)}
            ></textarea>
            
            <div className="min-w-full flex justify-end mt-3 align-center">
              <ul className="flex gap-3">
                <li>
                  <div>
                    <input
                      type="file"
                      name="avatar"
                      id="avatar"
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar"
                      className="text-white py-2 rounded cursor-pointer"
                    >
                      <i className="fa-solid fa-image"></i>
                    </label>
                  </div>
                </li>
                <li>
                  <div>
                    <input
                      type="file"
                      id="camera"
                      accept="image/*"
                      capture="camera"
                      className="hidden"
                    />
                    <label
                      htmlFor="camera"
                      className="text-white py-2 rounded cursor-pointer"
                    >
                      <i className="fa-solid fa-camera"></i>
                    </label>
                  </div>
                </li>
                <li><i className="fa-solid fa-location-dot"></i></li>
                <button className="bg-white text-black p-2 rounded font-bold">Crear post</button>
              </ul>
            </div>
          </div>
        </form>
        <hr className="border-gray-700 mt-3" />
      </div>
    );
  }
  
  export default InputMensaje;
  