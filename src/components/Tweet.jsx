import { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";
import { useSession } from "../context/SessionContext.jsx";
import { baseDir } from "../path.js";

const Tweet = ({ contenido, usuario, categoria, fecha, avatar, id}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isRePost, setIsRePost] = useState(false);
  const [likes, setLikes] = useState(0);
  const [highlightedContent, setHighlightedContent] = useState("");
  const { openModal } = useModal();
  const { session } = useSession();
  const userActive = JSON.parse(localStorage.getItem("user")) || [];

  function toggleLike() {
    setIsLiked(!isLiked);
  }

  function toggleRePost() {
    setIsRePost(!isRePost);
    if(!session){
      openModal(true)
    }else{
      openModal(false)
    }
  }

  async function handleDelete(id){
    const response = await fetch(`${baseDir}/api/tweets/delete/${id}`,{
      method:"DELETE"
    });
    if(response.ok){
      window.location.href = "/dashboard";
    }    
    alert("Error al eliminar mensaje del tablero:")
  }

  useEffect(() => {
    const regex = /#\w+/g;
    const result = contenido.replace(regex, (match) => {
      return `<span class="text-blue-500 cursor-pointer" hover:text-blue-200>${match}</span>`}
    );
    setHighlightedContent(result);
  }, [contenido]);
  
  return (
    <div className="dark:text-white h-auto block">
      <div className="flex flex-col bg-white dark:bg-black rounded-lg shadow-lg">
        <div className="flex p-4">
          <picture className="flex justify-center items-center bg-no-repeat bg-center object-content">
            <img 
              src={avatar} 
              width="100" 
              height="100" 
              alt="avatar" 
              className="rounded-full w-22 h-22" 
            />
          </picture>

          <div className="flex-col justify-between w-full pl-4">
            <h5 className="font-semibold">{usuario} - @{usuario} | <span className="text-gray-400">{categoria} · {fecha}</span></h5>
            <p
              className="font-sans text-lg text-gray-800 dark:text-white break-words line-clamp-3"
              dangerouslySetInnerHTML={{ __html: highlightedContent }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center px-10 py-2 ml-20 text-gray-500">
          { likes > 0 ? 
            <div>
              <a href="#" className="hover:text-blue-500 flex items-center text-sm">
                <i className="fa-regular fa-comment"></i> 2k
              </a>
              <span 
                className={`p-1 ${isRePost ? 'text-green-500' : 'text-gray-500'} hover:text-green-700 flex items-center text-sm`} 
                onClick={toggleRePost}
              >
                <i className="fa-solid fa-repeat"></i> 20k
              </span>

              <span
                className={`p-1 ${isLiked ? 'text-red-500' : ''} flex items-center text-sm`} 
                onClick={toggleLike}
              >
                <i className={`${isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}`}></i> 144k
              </span>
            </div>
          : ""}
          {usuario === userActive.username && (
            <div className="flex gap-3 justify-end items-center w-full">
              <p className="text-gray-500"><i className="fa-solid fa-pen p-2"></i>Editar</p>
              <p onClick={() => handleDelete(id)} className="text-red-500 cursor-pointer"><i className="fa-solid fa-close p-2"></i>Eliminar</p>
            </div>
          )}
        </div>
        <hr className="border-t border-gray-300 dark:border-gray-700" />
      </div>
    </div>
  );
};

export default Tweet;
