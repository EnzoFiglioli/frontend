import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import InputMensaje from "./InputMensaje.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { baseDir } from "../path.js";
import data from "../data/data.json";
import { handlerDate } from "../handler/handlerDate.js";
import { useLike } from "../context/LikesContext.jsx";

const MensajesTablero = () => {
  const [mensajes, setMensajes] = useState([]);
  const [likesContainer, setLikesContainer] = useState([]);
  const [likesCount, setLikesCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(sessionStorage.getItem("section") || "Para ti");
  const {likesContainerContext, setLikesContainerContext, likesCountContext, setLikesCountContext} = useLike();  
  const { session } = useSession();
  const { username } = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (session) {
      if (likesCountContext.length === 0 && likesContainerContext.length === 0) {
        fetch(`${baseDir}/api/like/info`, { method: "GET", credentials: "include" })
          .then(res => res.json())
          .then(res => {
            console.log("Likes info from API:", res); // Asegúrate de que estamos recibiendo los datos correctos
            setLikesCount(res.likesCount); // Esto tiene la cantidad de likes por tweet
            setLikesCountContext(res.likesCount);
            setLikesContainerContext(res.likesUser); // Esto tiene la lista de usuarios que dieron like
            setLikesContainer(res.likesUser);
          })
          .catch(err => console.error("Error fetching likes:", err));
      } else {
        setLikesContainer(likesContainerContext);
        setLikesCount(likesCountContext);
      }
    }
  }, [session]);

  useEffect(() => {
    if (activeTab === "Para ti") {
      handlerForYou();
    } else {
      handlerForFollowing();
    }
  }, [activeTab]);

  const handleFocus = (tabName) => {
    sessionStorage.setItem("section", tabName);
    setActiveTab(tabName);
  };

  const agregarNuevoMensaje = (nuevoMensaje) => {
    setMensajes((prevMensajes) => [nuevoMensaje, ...prevMensajes]);
  };

  function handlerForYou() {
    if (session) {
      fetch(`${baseDir}/api/tweets`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          const sortedMessages = res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setMensajes(
            sortedMessages.map((i) => {
              return {
                contenido: i.content,
                avatar: i.avatar.startsWith("/uploads") ? `${baseDir}${i.avatar}` : i.avatar,
                fecha: i.createdAt,
                categoria: i.categoria,
                usuario: i.username,
                id: i.id_tweet,
              };
            })
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
  }

  function handlerForFollowing() {
    if(!session){
      setLoading(false);
      return setMensajes(data);
    }
    fetch(`${baseDir}/api/tweets/tweets/following/${username}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setMensajes(
          res.map((i) => ({
            id: i.id_tweet,
            usuario: i.username,
            contenido: i.content,
            avatar: i.avatar.startsWith("/uploads") ? `${baseDir}${i.avatar}` : i.avatar,
            fecha: i.createdAt,
            categoria: i.categoria,
          })) || []
        );
        setLoading(false);
      })
      .catch((err) => console.error(err));
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
      {session && (
        <ul className="flex w-full justify-center items-center gap-8">
          <li
            className={`border-b-2 px-4 py-2 font-semibold cursor-pointer transition-all ${
              activeTab === "Para ti" ? "border-b-blue-500 text-blue-500" : "border-b-transparent text-white"
            }`}
            onClick={() => handleFocus("Para ti")}
            tabIndex="0"
          >
            Para ti
          </li>
          <li
            className={`px-4 py-2 font-semibold cursor-pointer transition-all ${
              activeTab === "Seguidos" ? "border-b-2 border-b-blue-500 text-blue-500" : "text-black dark:text-white"
            }`}
            onClick={() => handleFocus("Seguidos")}
            tabIndex="0"
          >
            Seguidos
          </li>
        </ul>
      )}
      {mensajes.length > 0 ? (
  mensajes.map((msg, index) => {
    // Verificar si el tweet tiene un like
    const isLiked = likesContainer.some(like => like.id_tweet == msg.id); 
    const cantidad = likesCount.find(i => i.id_tweet == msg.id)?.cantidad || 0; // Encontrar la cantidad de likes

    return msg.contenido ? (
      <Tweet
        key={`msg-${index}`}
        contenido={msg.contenido}
        fecha={handlerDate(msg.fecha)}
        usuario={msg.usuario}
        categoria={msg.categoria}
        avatar={msg.avatar}
        id={msg.id}
        liked={isLiked}
        count={cantidad}
        />
    ) : (
      <div key={`msg-${index}`}>Contenido no disponible</div>
    );
  })
) : (
  <div className="flex justify-center mt-3">
    <p>No hay mensajes disponibles.</p>
  </div>
)}

    </div>
  );
};

export default MensajesTablero;
