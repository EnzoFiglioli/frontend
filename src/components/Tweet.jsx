import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext.jsx";
import { baseDir } from "../path.js";
import Verification from "./Verification.jsx";

const Tweet = ({ contenido, usuario, categoria, fecha, avatar, id, liked, count, name, lastname, image, verfication }) => {
  const [isLiked, setIsLiked] = useState(() => {
    const storedLike = sessionStorage.getItem(`liked-${id}`);
    try {
      return storedLike ? JSON.parse(storedLike) : liked;
    } catch (e) {
      console.error('Error al parsear isLiked desde sessionStorage:', e);
      return liked;
    }
  });
  
  const [likeCount, setLikeCount] = useState(() => {
    const storedLikeCount = sessionStorage.getItem(`likeCount-${id}`);
    try {
      return storedLikeCount ? JSON.parse(storedLikeCount) : count;
    } catch (e) {
      console.error('Error al parsear likeCount desde sessionStorage:', e);
      return count;
    }
  });
  

  const [highlightedContent, setHighlightedContent] = useState(contenido);

  const { session } = useSession();
  const userActive = JSON.parse(sessionStorage.getItem("user")) || null;

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
        if (!res.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return res.json();
      })
      .then((res) => {
        console.log(res)
        setIsLiked((prevState) => !prevState);
        setLikeCount((prevState) => (isLiked ? prevState - 1 : prevState + 1));
      })
      .catch((err) => console.error("Like failed:", err));
  };

  const handleDeleteClick = () => {
    confirm({
      message: 'Estas seguro que quieres eliminar este mensaje en el tablero?',
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
  
    const data = await response.json();
    if (data.success) {
      window.location.href = "/dashboard";
    } else {
      alert("Error al eliminar mensaje del tablero");
    }
  };
  

  return (
  <div>
    <div className="dark:text-white h-auto block">
      <div className="flex flex-col bg-white dark:bg-black rounded-lg shadow-lg">
        <div className="flex p-4 w-full">
        <Link to={`/profile/${usuario}`}>
          <div className="flex justify-center items-center w-24 h-24">
            <img
              src={avatar}
              alt="avatar"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        </Link>
          <div className="flex-col pl-4">
            <div className="flex-col justify-between w-full">
              <div style={{ display: 'flex', gap: '3px', justifyContent: 'space-between', paddingRight: '10px', width: "100%" }}>
                <div style={{ width: '100%', display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h5 className="font-semibold" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {name} {lastname}
                    <span>{verfication ? <Verification /> : ""} </span> 
                    
                    <i className="ml-2 dark:text-gray-300">@{usuario} |</i>
                    <span className="text-gray-400 pl-2"> {categoria} · {fecha}
                    </span>
                  </h5>
                </div>
              </div>
            </div>
            {usuario === userActive?.username && (
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                <span className="mr-4 cursor-pointer">Editar</span>
                <span onClick={handleDeleteClick} className="cursor-pointer text-gray-500">Eliminar</span>
              </div>
            )}
            <p
              className="font-sans text-lg text-gray-800 dark:text-white break-words line-clamp-3"
              dangerouslySetInnerHTML={{ __html: highlightedContent }}
            />
            {image && 
              <img src={image} alt="meme" className="px-4 py-4 rounded w-full h-64 object-cover" />
            }
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
                style={{ transition: 'color 0.3s' }}
              ></i>
            </span>
          )}
        </div>
        <hr className="border-t border-gray-300 dark:border-gray-700" />
      </div>
    </div>
  </div>
  );
}

export default Tweet;
