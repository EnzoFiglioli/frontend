import { useEffect, useState } from "react";
import { baseDir } from "../path.js";
// import {useSession} from "../context/SessionContext.jsx"

const Tendencias = () => {
  const [hashtags, setHashtags] = useState([]);
  const [session] = useState(true);

  useEffect(() => {
    fetch(`${baseDir}/api/tweets/hashtags`)
      .then(response => response.json())
      .then(response => {
        setHashtags(response.flat() || []);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2 className="text-2xl font-bold dark:text-white">Tendencias</h2>
      <ul style={{ display: 'flex', flexWrap: 'wrap', flexDirection:"column"}}>
        {session ? (
          hashtags.length > 0 ? (
            hashtags.map((i, ix) => (
              <li key={ix} className="text-blue-500 cursor-pointer hover:text-blue-300">{i}</li>
            ))
          ) : (
            <li>No hay hashtags</li>
          )
        ) : (
          <>
            <li className="text-blue-500 hover:text-blue-300">#React</li>
            <li className="text-blue-500 hover:text-blue-300">#Node</li>
            <li className="text-blue-500 hover:text-blue-300">#Express</li>
            <li className="text-blue-500 hover:text-blue-300">#Tailwind</li>
            <li className="text-blue-500 hover:text-blue-300">#MongoDB</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Tendencias;
