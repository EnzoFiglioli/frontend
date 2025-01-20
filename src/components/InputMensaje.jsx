import {baseDir} from "../path.js";
import { useState, useEffect } from "react";
import  {useNewTweet} from "../context/TweetContex.jsx" 

const InputMensaje = ({agregarNuevoMensaje}) => {
  const [ message, setMessage ] = useState(""); 
  const [ categorias, setCategorias ] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const { sendTweet, setSendTweet } = useNewTweet();

  const [categoriaTweet, setCategoriaTweet] = useState("");
  const [hashtags, setHashtag] = useState([]);


  useEffect(()=>{
    fetch(`${baseDir}/api/categorias`)
      .then((res) => res.json())
      .then((res) => setCategorias(res))
      .catch(err => console.error(err));
  },[]);

  useEffect(() => {
    const regex = /#\w+/g;
    const result = message.match(regex);
     if(result) return setHashtag(result);
     setHashtag([]);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoriaTweet) {
      alert("Tienes que elegir una categoria para el mensaje");
      return;
    }
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
        credentials: "include",
        body: JSON.stringify({
          content: message,
          categoria: categoriaTweet
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Respuesta de la API:", result);
  
      const tweetIds = result.tweet || [];
  
      if (tweetIds.length > 0) {
        agregarNuevoMensaje({
          contenido: message,
          avatar: userData.avatar.startsWith(`/`) ? `${baseDir}${userData.avatar}`: userData.avatar,
          fecha: new Date().toISOString(),
          categoria: categoriaTweet,
          usuario: userData.username,
          id: tweetIds[0],
        });
  
        console.log("Tweet enviado con éxito.");
        setMessage("");
        setSendTweet((prev) => !prev);
      } else {
        console.error("No se recibió un tweet válido en la respuesta.");
      }
  
    } catch (error) {
      console.error("Error al enviar el tweet:", error.message);
    }
  };
  
   
    return (
      <div>
        <form 
          style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px", alignItems: "start" }}
          onSubmit={handleSubmit}>
          <div>
            <img
              src={userData.avatar.startsWith(`/`) ? 
                `${baseDir}${userData.avatar}`:
                userData.avatar
              }
              width="40"
              height="40"
              alt={`avatar-${userData.username.toLowerCase()}`}
              className="rounded-full"
            />
          </div>
  
          <div>
          <div style={{ textAlign: "right" }}>
            <select 
              className="bg-white dark:bg-black" 
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
              className="dark:text-white w-full dark:bg-black cursor-text rounded focus:outline-none"
              placeholder="¡¿Qué está pasando?!"
              style={{resize:"none", minHeight:"15vh"}}
              onChange={event => setMessage(event.target.value)}
              value={message}
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
        <div 
          className="mt-3 text-white"
          dangerouslySetInnerHTML={{
            __html: hashtags.map(i => `<span class="text-blue-500 cursor-pointer" hover:text-blue-200">${i}</span>`).join(' ')
          }}></div>
          </div>
    ); 
  }
  
  export default InputMensaje;
  