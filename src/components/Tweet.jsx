import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext.jsx";
import { baseDir } from "../path.js";

const Tweet = ({ contenido, usuario, categoria, fecha, avatar, id, liked, count }) => {
  const [isLiked, setIsLiked] = useState(() => {
    // Intenta obtener el estado del like desde sessionStorage
    const storedLike = sessionStorage.getItem(`liked-${id}`);
    try {
      return storedLike ? JSON.parse(storedLike) : liked;
    } catch (e) {
      console.error('Error al parsear isLiked desde sessionStorage:', e);
      return liked; // Valor por defecto en caso de error
    }
  });
  
  const [likeCount, setLikeCount] = useState(() => {
    // Intenta obtener la cantidad de likes desde sessionStorage
    const storedLikeCount = sessionStorage.getItem(`likeCount-${id}`);
    try {
      return storedLikeCount ? JSON.parse(storedLikeCount) : count; // Si no hay en sessionStorage, usa el valor pasado como prop
    } catch (e) {
      console.error('Error al parsear likeCount desde sessionStorage:', e);
      return count; // Valor por defecto en caso de error
    }
  });
  

  const [highlightedContent, setHighlightedContent] = useState(contenido);

  const { session } = useSession();
  const userActive = JSON.parse(sessionStorage.getItem("user")) || null;

  // Resalta los hashtags en el contenido
  useEffect(() => {
    const regex = /#\w+/g;
    const result = contenido.replace(regex, (match) => {
      return `<span class="text-blue-500 cursor-pointer" hover:text-blue-200>${match}</span>`;
    });
    setHighlightedContent(result);
  }, [contenido]);

  useEffect(() => {
    sessionStorage.setItem(`liked-${id}`, JSON.stringify(isLiked));
    sessionStorage.setItem(`likeCount-${id}`, JSON.stringify(likeCount));
  }, [isLiked, likeCount, id]);

  const handlerLike = (e) => {
    e.preventDefault();
  
    fetch(`${baseDir}/api/like/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id_tweet: id }),
    })
      .then((res) => {
        // Verifica que la respuesta es un JSON válido
        if (!res.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return res.json(); // Solo parsea si la respuesta es OK
      })
      .then((res) => {
        setIsLiked((prevState) => !prevState);
        setLikeCount((prevState) => (isLiked ? prevState - 1 : prevState + 1));
      })
      .catch((err) => console.error("Like failed:", err));
  };
  

  const handleDeleteClick = () => {
    confirm({
      message: 'Are you sure you want to delete this tweet?',
      onConfirm: () => handleDelete(id),
      onCancel: () => {},
    });
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${baseDir}/api/tweets/delete/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
  
    if (!response.ok) {
      console.error("Error al eliminar el tweet");
      return;
    }
  
    const data = await response.json(); // Asegúrate de que la respuesta sea un JSON
    if (data.success) {
      window.location.href = "/dashboard";
    } else {
      alert("Error al eliminar mensaje del tablero");
    }
  };
  

  return (
    <div className="dark:text-white h-auto block">
      <div className="flex flex-col bg-white dark:bg-black rounded-lg shadow-lg">
        <div className="flex p-4 w-full">
          <Link to={`/profile/${usuario}`}>
            <picture className="flex justify-center items-center bg-no-repeat bg-center object-content">
              <img
                src={avatar}
                width="100"
                height="100"
                alt="avatar"
                className="rounded-full w-22 h-22"
              />
            </picture>
          </Link>

          <div className="flex-col justify-between w-full pl-4">
            <div style={{ display: 'flex', gap: '3px', justifyContent: 'space-between', paddingRight: '10px', width:"100%" }}>
              <div style={{ width: '100%', display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                <h5 className="font-semibold">
                  @{usuario} |{" "}
                  <span className="text-gray-400">
                    {categoria} · {fecha}
                  </span>
                </h5>
              </div>
              {usuario === userActive?.username && (
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItems: "flex-end" }}>
                  <span>Editar</span>
                  <span onClick={handleDeleteClick} className="cursor-pointer text-gray-500">Eliminar</span>
                </div>
              )}
            </div>
            <p
              className="font-sans text-lg text-gray-800 dark:text-white break-words line-clamp-3"
              dangerouslySetInnerHTML={{ __html: highlightedContent }} // Usa highlightedContent
            />
          </div>
        </div>
        <div>
          {session && (
            <span
              style={{ float: 'right' }}
              className={`pr-4 ${isLiked ? "text-red-500" : "text-white"}`}
            >
              {likeCount}
              <i
                className={`fa-solid fa-heart cursor-pointer pl-2 ${isLiked ? "text-red-500" : "text-white"}`}
                onClick={(e) => handlerLike(e)}
              ></i>
            </span>
          )}
        </div>
        <hr className="border-t border-gray-300 dark:border-gray-700" />
      </div>
    </div>
  );
};

export default Tweet;
