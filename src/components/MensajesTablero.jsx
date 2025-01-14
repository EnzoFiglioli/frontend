import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import InputMensaje from "./InputMensaje.jsx";
import { handlerMessage } from "../handler/manejadorMensajes";
import data from "../data/data.json";
import {useSession} from "../context/SessionContext.jsx"

const MensajesTablero = () => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {session} = useSession();


  useEffect(() => {
    handlerMessage(data)
      .then((data) => {
        setMensajes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("No se pudo cargar los mensajes.");
        setLoading(false);
      });
  }, []);

  const formatearFecha = (fechaMensaje) => {
    const fechaActual = new Date();
    const fechaMsg = new Date(fechaMensaje);
    const diferencia = fechaActual - fechaMsg;
    const diasDiferencia = diferencia / (1000 * 3600 * 24);

    if(fechaActual.getDate() == fechaMsg.getDate() && fechaActual.getDay() == fechaMsg.getDay &&
        fechaActual.getFullYear() == fechaMsg.getFullYear()){
        return "Hoy";
    }

    if (diasDiferencia < 7) {
      return fechaMsg.toLocaleDateString();
    }else {
      const semanas = Math.floor(diasDiferencia / 7);
      return `${semanas} semana(s) atrás`;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mt-4">
      { session ? 
      (
        <InputMensaje />
      ) 
      : 
      ("")}
      {mensajes.length > 0 ? (
        mensajes.map((msg, index) => (
          <Tweet
            key={msg.id || index}
            contenido={msg.contenido}
            fecha={formatearFecha(msg.fecha)}
            usuario={msg.usuario}
            categoria={msg.categoria}
            avatar={msg.avatar}
          />
        ))
      ) : (
        <img
          src="https://i.pinimg.com/originals/65/ba/48/65ba488626025cff82f091336fbf94bb.gif"
          alt="loader"
        />
      )}
    </div>
  );
};

export default MensajesTablero;
