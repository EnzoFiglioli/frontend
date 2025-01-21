import Nav from "../components/Nav";
import { baseDir } from "../path";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet.jsx";
import { useParams } from "react-router-dom";

export const Profile = () => {
    const [tweets, setTweets] = useState([]);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [siguiendo, setSiguiendo] = useState(false);
    const [usuario, setUsuario] = useState({
        username: "",
        name: "",
        lastname: "",
        email: "",
        avatar: ""
    });
    const [loading, setLoading] = useState(true);
    const { username } = useParams();
    const userActive = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetch(`${baseDir}/api/usuarios/${username}`, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => res.json())
        .then((res) => {
            setUsuario(res);
            setLoading(false);
        })
        .catch((err) => console.error(err));
    }, [username]);

    // Obtener los tweets de este usuario
    useEffect(() => {
        fetch(`${baseDir}/api/tweets/profile/${username}`, {
            method: "GET"
        })
        .then((res) => res.json())
        .then((res) => setTweets(res))
        .catch((err) => console.error(err));
    }, [username]);

    // Obtener la información sobre los seguidores y seguidos
    useEffect(() => {
        fetch(`${baseDir}/api/usuarios/follow/info/${username}`, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setFollowers(res.Seguidores);
            setFollowing(res.Seguidos);
            setSiguiendo(res.seSiguen == 0 ? false : true);
        })
        .catch(err => console.log(err));
    }, [username]);

    // Manejo de la acción de seguir / dejar de seguir
    const handlerFollow = (e) => {
        e.preventDefault();
        fetch(`${baseDir}/api/usuarios/follow`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: usuario.id
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.msg.startsWith("Ya no")) {
                setSiguiendo(false);
                setFollowers((prevFollowers) => prevFollowers - 1); 
            } else {
                setSiguiendo(true);
                setFollowers((prevFollowers) => prevFollowers + 1);
            }
        })
        .catch((error) => console.error(error));
    };

    // Renderizar la pantalla de carga mientras se obtienen los datos
    if (loading) {
        return (
            <div className="w-full h-full m-auto flex flex-col justify-center">
                <img
                    src="https://i.pinimg.com/originals/65/ba/48/65ba488626025cff82f091336fbf94bb.gif"
                    alt="loader"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-black dark:text-white bg-gray-100">
            <title>{`${usuario.name} ${usuario.lastname} | Perfil`}</title>
            <div>
                <Nav />
                <hr className="text-gray-300 my-6" />
            </div>
            <div className="flex flex-col justify-center items-center gap-6 py-4">
                <img
                    src={usuario.avatar.startsWith("/") ? `${baseDir}${usuario.avatar}` : usuario.avatar}
                    alt={`avatar-${usuario.username.toLowerCase()}`}
                    className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
                />
                <div className="flex gap-4 items-center">
                    <h4 className="text-xl font-semibold">@{usuario.username}</h4>
                    {userActive.username !== usuario.username && (
                        <button
                            className={`px-4 py-2 rounded-full text-white font-semibold transition-all duration-300 ${siguiendo ? 'bg-blue-500' : 'bg-green-500'}`}
                            onClick={handlerFollow}
                        >
                            {siguiendo ? "Siguiendo" : "Seguir"}
                        </button>
                    )}
                </div>
                <h5 className="text-gray-600 text-md">{usuario.email}</h5>
                {userActive.username == usuario.username && <button className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition duration-300">Eliminar cuenta</button>}
                <ul className="flex space-x-8 mt-6">
                    <li className="text-lg font-semibold">Seguidores: <i className="text-gray-500">{followers}</i></li>
                    <li className="text-lg font-semibold">Seguidos: <i className="text-gray-500">{following}</i></li>
                </ul>

                <h3 className="text-xl font-semibold mt-6">Tweets:</h3>
                <div className="px-5 mt-4 space-y-4 w-full max-w-3xl">
                    {tweets.length > 0 ? (
                        tweets.map((i, ix) => (
                            <Tweet
                                key={i.id_tweet || ix}
                                avatar={i.avatar.startsWith("/") ? `${baseDir}${i.avatar}` : i.avatar}
                                fecha={i.createdAt}
                                usuario={i.username}
                                contenido={i.content}
                            />
                        ))
                    ) : (
                        <h3 className="text-gray-600 text-center">Aún no tienes ningún mensaje en tu tablero</h3>
                    )}
                </div>
            </div>
        </div>
    );
};
