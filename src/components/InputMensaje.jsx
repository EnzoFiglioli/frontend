import { baseDir } from "../path.js";
import { useState, useEffect } from "react";
import { useNewTweet } from "../context/TweetContex.jsx";
import categoriasData from "../data/categoria.json";
import Modal from "react-modal";
import {X} from "lucide-react"

Modal.setAppElement('#root');

const InputMensaje = ({ agregarNuevoMensaje }) => {
  const [message, setMessage] = useState(""); 
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const { sendTweet, setSendTweet } = useNewTweet();
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaTweet, setCategoriaTweet] = useState("");
  const [hashtags, setHashtag] = useState([]);
  const [memes, setMemes] = useState([]); 
  const [memeReq, setMemeReq] = useState("");

  useEffect(() => {
    try {
      setCategorias(categoriasData);
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log("meme",memeReq);
  

  // Extraer hashtags del mensaje
  useEffect(() => {
    const regex = /#\w+/g;
    const result = message.match(regex);
    if (result) return setHashtag(result);
    setHashtag([]);
  }, [message]);

  // Obtener memes cuando el modal se abre
  useEffect(() => {
    if (isModalOpen) {
      const fetchMemes = async () => {
        try {
          const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=LZaPolBv7OIlskxlkHVFZz3DsfzBmZMd&q=memes&limit=5`);
          const data = await response.json();
          setMemes(data.data);
        } catch (error) {
          console.error('Error al obtener los memes:', error);
        }
      };
      
      fetchMemes();
    }
  }, [isModalOpen]);

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
          categoria: categoriaTweet,
          image: memeReq
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

  // Función para abrir el modal cuando se hace clic en el ícono de imagen
  const openMemeModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <form 
        style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px", alignItems: "start" }}
        onSubmit={handleSubmit}
      >
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
              onChange={e => setCategoriaTweet(e.target.value)}
            >
              <option value="" className="text-white">Seleccionar categoría</option>
              {categorias.map((i, index) => (
                <option key={index} value={i.id_categoria}>{i.nombre}</option>
              ))}
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
          
          {memeReq && (
            <div className="relative w-1/4"> {/* Contenedor con clase relative */}
              <picture>
                <img src={memeReq} alt="image-tweet" className="w-full rounded" /> {/* Asegúrate de que la imagen ocupe todo el espacio del contenedor */}
              </picture>
              <X
                className="text-white absolute top-0 right-0 p-2 cursor-pointer  rounded-full text-4xl opacity-75"
                onClick={() => setMemeReq("")} 
              />
            </div>
          )}

          <div className="min-w-full flex justify-end mt-3 align-center">
            <ul className="flex gap-3">
              <li>
                <div>
                  <button type="button" onClick={openMemeModal}>
                    <label
                      htmlFor="avatar"
                      className="text-white py-2 rounded cursor-pointer"
                    >
                      <i className="fa-solid fa-image"></i>
                    </label>
                  </button>
                </div>
              </li>
              <li><i className="fa-solid fa-location-dot"></i></li>
              <button className="bg-white text-black p-2 rounded font-bold">Crear post</button>
            </ul>
          </div>
        </div>
      </form>

      <div 
        className="mt-3 text-blue-500"
        dangerouslySetInnerHTML={{
          __html: hashtags.map(i => `<span className="text-blue-500 cursor-pointer">${i}</span>`).join(' ')
        }} 
      ></div>
      <div className="dark:bg-black">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Seleccionar Meme"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            zIndex: 1000,
          },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            width: '80%',
            maxWidth: '500px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          },
        }}
        >
        <div className="relative">
          <h1 className="text-black">Selecciona un meme</h1>
          <button className="absolute top-0 right-0 bg-black text-white dark:bg-white dark:text-black p-2 rounded cursor-pointer" onClick={() => setIsModalOpen(false)}>Cerrar</button>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {memes.length > 0 ? memes.map((meme) => (
              <img key={meme.id} src={meme.images.fixed_height.url} alt={meme.title} className="rounded cursor-pointer" onClick={(e)=> setMemeReq(e.target.src)} />
            )) : <p>No se encontraron memes.</p>}
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
}

export default InputMensaje;
