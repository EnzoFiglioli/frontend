import { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";
import { useSession } from "../context/SessionContext.jsx";
import { baseDir } from "../path.js";
import {Link} from "react-router-dom";

const Tweet = ({ contenido, usuario, categoria, fecha, avatar, id, liked, count }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [isRePost, setIsRePost] = useState(false);
  const [highlightedContent, setHighlightedContent] = useState("");
  const { openModal } = useModal();
  const { session } = useSession();
  const userActive = JSON.parse(localStorage.getItem("user")) || null;

  function handlerLike(e){
    e.preventDefault();
    fetch(`${baseDir}/api/like/create`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      credentials:"include",
      body:JSON.stringify({
        id_tweet:id,
      })
    })
      .then((res)=> res.json())
      .then((res)=> {
        console.log(res);
        setIsLiked(isLiked == true ? false : true);
      })
      .catch(err => console.log(err));
  }

  function toggleRePost() {
    if (!session) {
      openModal(true);
    } else {
      setIsRePost(!isRePost);
      openModal(false);
    }
  }

  async function handleDelete(id) {
    const response = await fetch(`${baseDir}/api/tweets/delete/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Error al eliminar mensaje del tablero");
    }
  }

  useEffect(() => {
    const regex = /#\w+/g;
    const result = contenido.replace(regex, (match) => {
      return `<span class="text-blue-500 cursor-pointer" hover:text-blue-200>${match}</span>`;
    });
    setHighlightedContent(result);
  }, [contenido]);

  return (
    <div className="dark:text-white h-auto block">
      <div className="flex flex-col bg-white dark:bg-black rounded-lg shadow-lg">
        <div className="flex p-4">
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
            <div style={{display:'flex', Width:'100%',gap:'3px', justifyContent:'space-between', paddingRight:'10px'}}>
            <div style={{width:'100%'}}>
            <h5 className="font-semibold">
              @{usuario} |{" "}
              <span className="text-gray-400">
                {categoria} · {fecha}{" "}
              </span>
                {session && (
                  <span style={{float:'right'}} className={`${isLiked ? "text-red-500" : "text-white"}`}>{count}<i className={`fa-solid fa-heart cursor-pointer pl-2 ${isLiked ? "text-red-500" : "text-white"}`}
                      onClick={(e)=> handlerLike(e)}></i>
                  </span>
                )}
                
            </h5>
            </div>
            </div>
            <p
              className="font-sans text-lg text-gray-800 dark:text-white break-words line-clamp-3"
              dangerouslySetInnerHTML={{ __html: highlightedContent }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center px-10 py-2 ml-20 text-gray-500">
          {usuario === userActive?.username && (
            <div className="flex gap-3 justify-end items-center w-full">
              <p className="text-gray-500">
                <i className="fa-solid fa-pen p-2"></i>Editar
              </p>
              <p
                onClick={() => handleDelete(id)}
                className="text-red-500 cursor-pointer"
              >
                <i className="fa-solid fa-close p-2"></i>Eliminar
              </p>
            </div>
          )}
        </div>
        <hr className="border-t border-gray-300 dark:border-gray-700" />
      </div>
    </div>
  );
};

export default Tweet;
