import Cuenta from "./Cuenta.jsx";

const Sugerencias = () => {
  return (
    <div>
        <h3 className="dark:text-white font-bold">A quien seguir</h3>      
        <div>
            <Cuenta name={"Juan Fernando quintero"} avatar={"https://pbs.twimg.com/profile_images/1510967332746809351/QLBexyDO_400x400.jpg"} username={"juanferquinte10"} />
            <Cuenta name={"Leo Messi Site"} avatar={"https://pbs.twimg.com/profile_images/1859337072814727168/uqtdn4id_400x400.jpg"} username={"leomessisite"} />
            <Cuenta name={"Juan Fernando quintero"} avatar={"https://pbs.twimg.com/profile_images/1510967332746809351/QLBexyDO_400x400.jpg"} username={"juanferquinte10"} />
        </div>
    </div>
  )
}

export default Sugerencias
