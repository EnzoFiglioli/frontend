import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext.jsx";
import { baseDir } from "../path.js";
import Verification from "./Verification.jsx";

const Tweet = ({ contenido, usuario, categoria, fecha, avatar, id, liked, count, name, lastname, image, verification }) => {
  const [isLiked, setIsLiked] = useState(() => {
    const storedLike = sessionStorage.getItem(`liked-${id}`);
    try {
      return storedLike ? JSON.parse(storedLike) : liked;
    } catch {
      return liked;
    }
  });

  const [likeCount, setLikeCount] = useState(() => {
    const storedLikeCount = sessionStorage.getItem(`likeCount-${id}`);
    try {
      return storedLikeCount ? JSON.parse(storedLikeCount) : count;
    } catch {
      return count;
    }
  });

  const [highlightedContent, setHighlightedContent] = useState(contenido);
  const { session } = useSession();
  const userActive = JSON.parse(sessionStorage.getItem("user")) || null;

  useEffect(() => {
    const regex = /#\w+/g;
    setHighlightedContent(contenido.replace(regex, (match) => `<span class='text-blue-500 cursor-pointer hover:text-blue-200'>${match}</span>`));
  }, [contenido]);

  useEffect(() => {
    sessionStorage.setItem(`liked-${id}`, JSON.stringify(isLiked));
    sessionStorage.setItem(`likeCount-${id}`, JSON.stringify(likeCount));
  }, [isLiked, likeCount, id]);

  const handlerLike = (e) => {
    e.preventDefault();
    fetch(`${baseDir}/api/like/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id_tweet: id })
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Error en la respuesta del servidor"))
      .then(() => {
        setIsLiked((prevState) => !prevState);
        setLikeCount((prevState) => (isLiked ? prevState - 1 : prevState + 1));
      })
      .catch(console.error);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${baseDir}/api/tweets/delete/${id}`, { method: "DELETE", credentials: "include" });
    if (!response.ok) return;
    const data = await response.json();
    if (data.success) window.location.href = "/dashboard";
  };

  return (
    <div className="dark:text-white h-auto block">
      <div className="flex flex-col bg-white dark:bg-black rounded-lg shadow-lg">
        <div className="flex p-4 w-full items-start">
          <Link to={`/profile/${usuario}`} className="flex-shrink-0">
            <img src={avatar} alt="avatar" className="rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover" />
          </Link>
          <div className="flex flex-col pl-4 w-full">
            <div className="flex justify-between items-center w-full">
              <h5 className="font-semibold flex items-center text-base sm:text-lg md:text-xl">
                {name} {lastname} {verification && <Verification />} 
                <span className="ml-2 dark:text-gray-300 text-xs sm:text-sm md:text-base whitespace-nowrap">@{usuario} | {categoria} · {fecha}</span>
              </h5>
            </div>
            {usuario === userActive?.username && (
              <div className="flex justify-end items-center gap-4 mt-2">
                <span className="cursor-pointer text-sm md:text-base">Editar</span>
                <span onClick={() => handleDelete(id)} className="cursor-pointer text-gray-500 text-sm md:text-base">Eliminar</span>
              </div>
            )}
            <p className="font-sans text-lg text-gray-800 dark:text-white break-words line-clamp-3" dangerouslySetInnerHTML={{ __html: highlightedContent }} />
            {image && <img src={image} alt="meme" className="px-4 py-4 rounded w-full h-64 object-cover" />}
          </div>
        </div>
        {session && (
          <div className="flex justify-end pr-4">
            <span className={`${isLiked ? "text-red-500" : "text-white"}`}>
              {likeCount}
              <i className={`fa-solid fa-heart cursor-pointer pl-2 transition-colors duration-300 ${isLiked ? "text-red-500" : "text-white"}`} onClick={handlerLike}></i>
            </span>
          </div>
        )}
        <hr className="border-t border-gray-300 dark:border-gray-700" />
      </div>
    </div>
  );
};

export default Tweet;
