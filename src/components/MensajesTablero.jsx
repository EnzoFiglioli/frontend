import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import InputMensaje from "./InputMensaje.jsx";
import { handlerMessage } from "../handler/manejadorMensajes";
import data from "../data/data.json";
import { useSession } from "../context/SessionContext.jsx";
import { baseDir } from "../path.js";

const MensajesTablero = () => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      fetch(`${baseDir}/api/tweets`, { 
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then(res => res.flat())
        .then((res) => {
          setMensajes(res.map(i=>({
            contenido: i.content,
            avatar: i.fecha.startsWith("/uploads")? `${baseDir}${i.fecha}` : i.fecha,
            fecha: i.createdAt,
            categoria: i.categoria,
            usuario: i.username,
          })));
          setLoading(false);
          console.log({ mensajes });
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      handlerMessage(data)
        .then((data) => {
          setMensajes(data);
          setLoading(false);
        })
        .catch(() => {
          setError("No se pudo cargar los mensajes.");
          setLoading(false);
        });
    }
  }, [session]);

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
    return <div>{error}</div>;
  }

  return (
    <div className="mt-4">
      {session && <InputMensaje />}
      {mensajes.length > 0 ? (
        mensajes.map((msg, index) => (
          <Tweet
            key={msg.id || `msg-${index}`}
            contenido={msg.contenido}
            fecha={formatearFecha(msg.fecha)}
            usuario={msg.usuario}
            categoria={msg.categoria}
            avatar={msg.avatar}
          />
        ))
      ) : (
        <div>No hay mensajes disponibles.</div>
      )}
    </div>
  );
};

export default MensajesTablero;
