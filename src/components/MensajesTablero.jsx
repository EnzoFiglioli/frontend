import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import InputMensaje from "./InputMensaje.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { baseDir } from "../path.js";
import data from "../data/data.json";

const MensajesTablero = () => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Para ti");

  const { session } = useSession();
  const { username } = JSON.parse(localStorage.getItem("user")) || {};

  const handleFocus = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    if (session) {
      fetch(`${baseDir}/api/tweets`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          const sortedMessages = res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMensajes(
            sortedMessages.map((i) => ({
              contenido: i.content,
              avatar: i.avatar.startsWith("/uploads") ? `${baseDir}${i.avatar}` : i.avatar,
              fecha: i.createdAt,
              categoria: i.categoria,
              usuario: i.username,
              id: i.id_tweet,
            }))
          );
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setMensajes(data);
      setLoading(false);
    }
  }, [session]);



  const agregarNuevoMensaje = (nuevoMensaje) => {
    setMensajes((prevMensajes) => [nuevoMensaje, ...prevMensajes]);
  };

  function handlerForYou(e){
    e.preventDefault();
    fetch(`${baseDir}/api/tweets`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        // Ordena los mensajes por fecha
        const sortedMessages = res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMensajes(
          sortedMessages.map((i) => ({
            contenido: i.content,
            avatar: i.avatar.startsWith("/uploads") ? `${baseDir}${i.avatar}` : i.avatar,
            fecha: i.createdAt,
            categoria: i.categoria,
            usuario: i.username,
            id: i.id_tweet,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  function handlerForFollowing(e){
    e.preventDefault();
    
    fetch(`${baseDir}/api/tweets/tweets/following/${username}`,{
      method:"GET",
      credentials:"include"
    })
      .then(res => res.json())
      .then(res => {
        setMensajes(res.map(i=>({
          id: i.id_tweet,
          usuario: i.username,
          contenido: i.content,
          avatar: i.avatar.startsWith("/uploads") ? `${baseDir}${i.avatar}` : i.avatar,
          fecha: i.createdAt,
          categoria: i.categoria
        })) || []);
        console.log(mensajes);
        
        return setLoading(false);
      })
      .catch(err => console.error(err))
    }

  if (loading) {
    return (
      <div className="loader-container">
        <img
          src="https://i.pinimg.com/originals/65/ba/48/65ba488626025cff82f091336fbf94bb.gif"
          alt="loader"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => setLoading(true)}>Intentar de nuevo</button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {session && <InputMensaje agregarNuevoMensaje={agregarNuevoMensaje} />}
      {session && 
      <ul className="flex w-full justify-center items-center gap-8">
      <li
        className={`border-b-2 px-4 py-2 font-semibold cursor-pointer transition-all ${
          activeTab === "Para ti" ? "border-b-blue-500 text-blue-500" : "border-b-transparent text-white"
        }`}
        onClick={(e) => {handleFocus("Para ti"), handlerForYou(e)}}
        tabIndex="0"
      >
        Para ti
      </li>
      <li
        className={`px-4 py-2 font-semibold cursor-pointer transition-all ${
          activeTab === "Seguidos" ? "border-b-2 border-b-blue-500 text-blue-500" : "text-black dark:text-white"
        }`}
        onClick={(e) => {handlerForFollowing(e), handleFocus("Seguidos")}}
        tabIndex="0"
      >
        Seguidos
      </li>
    </ul> }
      {mensajes.length > 0 ? (
        mensajes.map((msg, index) => (
          msg.contenido ? (
            <Tweet
              key={`msg-${index}`}
              contenido={msg.contenido}
              fecha={msg.fecha}
              usuario={msg.usuario}
              categoria={msg.categoria}
              avatar={msg.avatar}
              id={msg.id}
            />
          ) : (
            <div key={`msg-${index}`}>Contenido no disponible</div>
          )
        ))
      ) : (
        <div className="flex justify-center mt-3">
          <p>No hay mensajes disponibles.</p>
        </div>
      )}
    </div>
  );
};

export default MensajesTablero;
