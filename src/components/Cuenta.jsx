import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const Cuenta = ({username, name, avatar}) => {
  const {session} = useSession
  return (
    <div className="flex justify-between py-2 gap-2">
      <div className="flex">
        {
          session ?
          <Link to={`/profile/${username}`}>
            <img src={avatar} alt={`avatar-${username}`} className="h-10 w-10 rounded-full" />
          </Link>
          :
          <img src={avatar} alt={`avatar-${username}`} className="h-10 w-10 rounded-full" />
        }
        <div className="px-1">
            <h4 className="dark:text-white">{name}</h4>
            <p className="text-gray-300">@{username}</p>
        </div>
      </div>
        <button className="bg-white dark:text-black font-bold py-1 px-2 pt-1 pb-1">Seguir</button>
    </div>
  )
}

export default Cuenta;
