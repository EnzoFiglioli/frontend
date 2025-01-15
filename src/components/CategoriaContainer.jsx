import { useEffect, useState } from "react";
import { baseDir } from "../path";

const CategoriaContainer = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseDir}/api/categorias`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setCategorias(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <nav aria-label="Categorías">
      <div className="my-2 border-l-4 border-gray-300 dark:border-gray-700 pl-4">
        <h2 className="text-2xl font-semibold text-white mb-4">Categorías</h2>
        <ul className="space-y-2">
          {categorias.map((i, ix) => (
            <li className="text-white" key={ix}>
              <a href="#" className="hover:underline">
                {i.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoriaContainer;
