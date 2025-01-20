import Nav from "../components/Nav";
import { baseDir } from "../path";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet.jsx";
import { useParams } from "react-router-dom";

export const Profile = () => {
    const [ tweets, setTweets ] = useState([]);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [ usuario, setUsuario] = useState({
        username : "",
        name: "",
        lastname: "",
        email: "",
        avatar: ""
    });
    const [loading, setLoading] = useState(true);
    const {username} = useParams();
    const userActive = JSON.parse(localStorage.getItem("user"));

    
    useEffect(()=>{
        fetch(`${baseDir}/api/usuarios/${username}`,{
            method:"GET",
            credentials:"include"
        })
        .then((res) => res.json())
        .then((res) => {
            setLoading(!loading);
            return setUsuario(res);
        })
        .catch((err) => console.error(err))
    },[username]);

    useEffect(()=>{
        fetch(`${baseDir}/api/tweets/profile/${username}`,{
            method:"GET"
        })
        .then((res) => res.json())
        .then((res) => (setTweets(res)))
        .catch((err) => console.error(err))
    },[username,loading]);
    
    useEffect(()=>{
        fetch(`${baseDir}/api/usuarios/follow/info/${username}`,{
            method:"GET",
            credentials:"include"
        })
        .then(res => res.json())
        .then(res => {
            if(!res){
                console.log("Fallo en la respuesta del server",res.message);
            }
            console.log(res);
            setFollowers(res.Seguidores);
            setFollowing(res.Seguidos)            
        })
        .catch(err => console.log(err))
    },[])

    function handlerFollow(e){
        e.preventDefault();
        fetch(`${baseDir}/api/usuarios/follow/${usuario.id}`,{
            method:"GET",
            credentials:"include"
        })
            .then((res) => res.json())
            .then((res) => {
                if(!res.ok){
                    console.log("Error al crear seguimiento(front)");
                }
                setFollowers(prevFollowers => prevFollowers ? prevFollowers - 1 : prevFollowers + 1);
                console.log("Seguimiento creado exitosamente!");
            })
            .catch(error => console.error(error))
    }

    if(loading){
        return (
            <div className="loader-container m-auto absolute ">
              <img
                src="https://i.pinimg.com/originals/65/ba/48/65ba488626025cff82f091336fbf94bb.gif"
                alt="loader"
              />
            </div>
          );
    }

  return (
    <div className="min-h-screen">
        <title>{usuario.name} {usuario.lastname} | Perfíl</title>
        <div>
            <Nav />
            <hr className="text-gray-300" />
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
                <img 
                    src={usuario.avatar.startsWith("/") ? `${baseDir}${usuario.avatar}` : usuario.avatar}
                alt={`avatar-${usuario.username.toLowerCase()}`}
                />
                <h4>@{usuario.username} {userActive.username != usuario.username && <button className="bg-white px-2 py-2 text-black rounded" onClick={e => handlerFollow(e)}>Seguir</button>}</h4>
                <h4>Email: {usuario.email}</h4>
                <button className="bg-red-500 px-3 py-3 rounded">Eliminar cuenta</button>
                <ul className="flex w-full justify-center items-center gap-8">
                    <li className="border-b-2 px-4 py-2 font-semibold transition-all">Seguidores: <i className="text-gray-500">{followers}</i></li>
                    <li className="border-b-2 px-4 py-2 font-semibold transition-all">Seguidos: <i className="text-gray-500">{following}</i></li>
                </ul>
                <h3>Tweets:</h3>
                <div className="px-40">
                    {tweets ?
                    tweets.map((i,ix)=>(
                     <Tweet 
                        key={i.id_tweet || ix}
                        avatar={i.avatar.startsWith("/") ? `${baseDir}${i.avatar}` : i.avatar} 
                        fecha={i.createdAt} 
                        usuario={i.username} 
                        contenido={i.content} />   
                    ))
                    :
                    <h3>Aún no tienes ningun mensaje en tu tablero</h3>
                    }
                </div>
        </div>
    </div>
  )
}

