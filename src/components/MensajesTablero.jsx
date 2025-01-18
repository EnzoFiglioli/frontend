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
  const { session } = useSession();

  useEffect(() => {
    // Si hay sesión, obtenemos los tweets desde la API
    if (session) {
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
    } else {
      // Si no hay sesión, usa los datos locales de 'data.json'
      setMensajes(data);
      setLoading(false);
    }
  }, [session]); // Solo vuelve a ejecutar si el valor de 'session' cambia

  const agregarNuevoMensaje = (nuevoMensaje) => {
    setMensajes((prevMensajes) => [nuevoMensaje, ...prevMensajes]);
  };

  const formatearFecha = (fechaMensaje) => {
    const fechaActual = new Date();
    const fechaMsg = new Date(fechaMensaje);
    const diferencia = fechaActual - fechaMsg;
    const diasDiferencia = diferencia / (1000 * 3600 * 24);

    if (fechaActual.toDateString() === fechaMsg.toDateString()) {
      return "Hoy";
    }

    if (diasDiferencia < 7) {
      return fechaMsg.toLocaleDateString();
    } else {
      const semanas = Math.floor(diasDiferencia / 7);
      return `${semanas} semana(s) atrás`;
    }
  };

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
      {mensajes.length > 0 ? (
        mensajes.map((msg, index) => (
          msg.contenido ? (
            <Tweet
              key={`msg-${index}`}
              contenido={msg.contenido}
              fecha={formatearFecha(msg.fecha)}
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
        <div>No hay mensajes disponibles.</div>
      )}
    </div>
  );
};

export default MensajesTablero;
