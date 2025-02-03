import Nav from "../components/Nav";
import { baseDir } from "../path";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet.jsx";
import { useParams } from "react-router-dom";
import { useSession } from "../context/SessionContext.jsx";
import { handlerDate } from "../handler/handlerDate.js";
import Modal from "react-modal";
import ProfileNotFound from "../components/ProfileNotFound.jsx";
import Verification from "../components/Verification.jsx";

Modal.setAppElement('#root');

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
        avatar: "",
        verification: false,
        bio: "",
        image: "",
        link:""
    });
    const [loading, setLoading] = useState(true);
    const { username } = useParams();
    const userActive = JSON.parse(localStorage.getItem("user"));
    if (userActive == null) return window.location.href = "/"; 

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetch(`${baseDir}/api/usuarios/${username}`, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            setUsuario(res);
            setLoading(false);
        })
        .catch((err) => console.error(err));
    }, [username]);

    useEffect(() => {
        fetch(`${baseDir}/api/tweets/profile/${username}`, {
            method: "GET"
        })
        .then((res) => res.json())
        .then((res) => {
            setTweets(res);
        })
        .catch((err) => console.error(err));
        
    }, [username]);

    useEffect(() => {
        fetch(`${baseDir}/api/usuarios/follow/info/${username}`, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(res => {
            setFollowers(res.Seguidores);
            setFollowing(res.Seguidos);
            setSiguiendo(res.seSiguen === 0 ? false : true);
        })
        .catch(err => console.log(err));
    }, [username]);

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

    const handleDeleteAccount = () => {
        fetch(`${baseDir}/api/usuarios/${userActive.id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                console.log("Cuenta eliminada exitosamente");
                window.location.href = "/";
                
            } else {
                console.error("Error al eliminar la cuenta:", res);
            }
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
        });

        setIsDeleteModalOpen(false);  
    };

    const handleEditProfile = () => {
        fetch(`${baseDir}/api/usuarios/editar`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id:userActive.id,
                name: usuario.name,
                lastname: usuario.lastname,
                email: usuario.email
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                console.log("Perfil actualizado correctamente");
            } else {
                console.error("Error al actualizar el perfil:", res.message);
            }
        })
        .catch((err) => console.error("Error en la solicitud:", err));

        setIsEditModalOpen(false);  
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center dark:bg-black bg-white bg-opacity-80">
                <img
                    src="https://i.pinimg.com/originals/65/ba/48/65ba488626025cff82f091336fbf94bb.gif"
                    alt="loader"
                    className="w-1/4 h-1/4 opacity-80"
                />
            </div>
        );
    }
    

   return (
        <div className="min-h-screen dark:bg-black dark:text-white bg-gray-100">
            {usuario ? (
                <>
                    <title>{`${usuario.name} ${usuario.lastname} | Perfil`}</title>
                    <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-rounded/css/uicons-solid-rounded.css'></link>
                    <Nav />
                    <div className="flex flex-col justify-center items-center gap-6 py-4 relative">
                    <picture className="w-full h-40 bg-cover bg-center" style={{ backgroundImage: "url(https://4kwallpapers.com/images/walls/thumbs_3t/3086.jpg)" }}></picture>

                        <img
                            src={usuario.avatar.startsWith("/") ? `${baseDir}${usuario.avatar}` : usuario.avatar}
                            alt={`avatar-${usuario.username.toLowerCase()}`}
                            className="size-40 rounded-full object-cover border-2 border-blue-500"
                        />
                        <div>
                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col items-center p-6">
                                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                                {usuario.name} {usuario.lastname} {usuario.verification ?
                                <Verification /> : ""}
                                </h2>
                                <h4 className="text-xl text-gray-400 font-medium">@{usuario.username}</h4>
                            </div>
                            </div>
                            <div className="flex justify-center items-center">    
                            {userActive.username !== usuario.username && (
                                <button
                                    className={`px-4 py-2 rounded-full text-white font-semibold transition-all duration-300 ${siguiendo ? 'bg-blue-500' : 'bg-green-500'}`}
                                    onClick={handlerFollow}
                                >
                                    {siguiendo ? "Siguiendo" : "Seguir"}
                                </button>
                            )}
                            </div>
                        </div>
                        <p>{usuario.bio}</p>
                        <h5 className="text-gray-400 text-md">Olavarria,Buenos Aires, Argentina.</h5>
                        {usuario.link?<a href={usuario.link}>{usuario.link}</a> :""}
                        <ul className="flex space-x-8">
                            <li className="text-lg font-semibold text-gray-400"><i className="text-white pr-2">{followers}</i>Seguidores</li>
                            <li className="text-lg font-semibold text-gray-400"><i className="text-white pr-2">{following}</i>Seguidos</li>
                        </ul>
                        {userActive.username === usuario.username && (
                            <div>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition duration-300"
                                >
                                    Eliminar cuenta
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition duration-300"
                                >
                                    Editar perfil
                                </button>
                            </div>
                        )}
                        <h3 className="text-xl font-semibold mt-6">Tweets:</h3>
                        <div className="px-5 mt-4 space-y-4 w-full max-w-3xl">
                            {tweets.length > 0 ? (
                                tweets.map((i, ix) => (
                                    <Tweet
                                        key={i.id_tweet || ix}
                                        avatar={i.avatar.startsWith("/") ? `${baseDir}${i.avatar}` : i.avatar}
                                        fecha={handlerDate(i.createdAt)}
                                        usuario={i.username}
                                        contenido={i.content}
                                        name={usuario.name}
                                        lastname={usuario.lastname}
                                        count={i.likes}
                                        liked={i.likesActive}
                                        verfication={i.verfication}
                                        image={i.image}
                                    />
                                ))
                            ) : (
                                <h3 className="text-gray-400 text-center">Aún no tienes ningún mensaje en tu tablero</h3>
                            )}
                        </div>
                    </div>
                    <Modal
                        isOpen={isDeleteModalOpen}
                        onRequestClose={() => setIsDeleteModalOpen(false)}
                        contentLabel="Confirmación de eliminación"
                        className="modal dark:bg-gray-900"
                        overlayClassName="overlay"
                    >
                        <h2 className="text-2xl">¿Estás seguro de que deseas eliminar tu cuenta?</h2>
                        <p className="text-lg text-red-500">Esta acción es irreversible.</p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded-full"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-red-500 text-white px-6 py-2 rounded-full"
                            >
                                Eliminar
                            </button>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={isEditModalOpen}
                        onRequestClose={() => setIsEditModalOpen(false)}
                        contentLabel="Editar perfil"
                        className="modal dark:bg-gray-900"
                        overlayClassName="overlay"
                    >
                        <h2 className="text-2xl dark:text-white text-black">Editar tu perfil</h2>
                        <form className="text-black">
                            <label htmlFor="name" className="dark:text-white text-black block mt-4">Nombre:</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="w-full p-2 border-2 border-gray-300 rounded-md"
                                value={usuario.name}
                                onChange={(e) => setUsuario({...usuario, name: e.target.value})}
                            />
                            <label htmlFor="lastname" className="dark:text-white text-black block mt-4">Apellido:</label>
                            <input
                                type="text"
                                name="lastname"
                                id="lastname"
                                className="w-full p-2 border-2 border-gray-300 rounded-md"
                                value={usuario.lastname}
                                onChange={(e) => setUsuario({...usuario, lastname: e.target.value})}
                            />
                            <label htmlFor="email" className="dark:text-white text-black block mt-4">Correo electrónico:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="w-full p-2 border-2 border-gray-300 rounded-md"
                                value={usuario.email}
                                onChange={(e) => setUsuario({...usuario, email: e.target.value})}
                            />
                        </form>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded-full"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEditProfile}
                                className="bg-yellow-500 text-white px-6 py-2 rounded-full"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </Modal>
                </>
            ) : (
                <ProfileNotFound />
            )}
        </div>
    );
}