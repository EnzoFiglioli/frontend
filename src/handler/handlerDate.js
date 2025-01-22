export const handlerDate = (fechaMensaje) => {
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


