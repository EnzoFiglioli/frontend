import { useState } from "react";

const Tweet = ({ contenido, usuario, categoria, fecha, avatar}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isRePost, setIsRePost] = useState(false);

  function toggleLike() {
    setIsLiked(!isLiked);
  }

  function toggleRePost() {
    setIsRePost(!isRePost);
  }

  return (
    <div className="dark:text-white h-auto block hover:backdrop-brightness-125">
      <div className="flex flex-col bg-white dark:bg-black rounded-lg shadow-lg">
        <div className="flex p-4">
          <picture className="flex justify-center items-center">
            <img 
              src={avatar} 
              width="100" 
              height="100" 
              alt="avatar" 
              className="rounded-full object-cover w-24 h-24" 
            />
          </picture>

          <div className="flex-col justify-between w-full pl-4">
            <h5 className="font-semibold">{usuario} - @{usuario} | <span className="text-gray-400">{categoria} · {fecha}</span></h5>
            <p className="font-sans text-lg text-gray-800 dark:text-white break-words line-clamp-3">{contenido}</p>
          </div>
        </div>
        <div className="flex justify-between items-center px-10 py-2 ml-20 text-gray-500">
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
        <hr className="border-t border-gray-300 dark:border-gray-700" />
      </div>
    </div>
  );
};

export default Tweet;
