import Cuenta from "./Cuenta.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { useEffect, useState } from "react";
import { baseDir } from "../path.js";

const Sugerencias = () => {
    const { session } = useSession();
    const [usuarios, setUsuarios] = useState([]);
    const userActive = JSON.parse(localStorage.getItem("user")) || [];
    

    useEffect(() => {
        if(session){
        fetch(`${baseDir}/api/usuarios`,{
            method:"GET",
            credentials:"include"
        })
        .then(res => res.json())
        .then(res => {
            const filteredUsuarios = res.filter(user => user.username !== userActive.username);
            setUsuarios(filteredUsuarios);
        })
        .catch(err => console.error(err));
    }
    }, []);

    return (
        <div>
            <h3 className="dark:text-white font-bold">A quien seguir</h3>
            <div>
                {session ? (
                    usuarios.map((user,ix) => (
                        <Cuenta
                            key={user.id_usuario || ix}
                            name={user.nombre}
                            avatar={user.avatar.startsWith("/uploads")?`${baseDir}${user.avatar}`: user.avatar }
                            username={user.username}
                        />
                    ))
                ) : (
                    <div>
                        <Cuenta name={"Juan Fernando quintero"} avatar={"https://pbs.twimg.com/profile_images/1510967332746809351/QLBexyDO_400x400.jpg"} username={"juanferquinte10"} />
                        <Cuenta name={"Leo Messi Site"} avatar={"https://pbs.twimg.com/profile_images/1859337072814727168/uqtdn4id_400x400.jpg"} username={"leomessisite"} />
                        <Cuenta name={"Juan Fernando quintero"} avatar={"https://pbs.twimg.com/profile_images/1510967332746809351/QLBexyDO_400x400.jpg"} username={"juanferquinte10"} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sugerencias;
