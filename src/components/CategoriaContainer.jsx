import { useEffect, useState } from "react";
import categoriasData from "../data/categoria.json";  

const CategoriaContainer = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setCategorias(categoriasData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Error al cargar categorías");
      setLoading(false);
    }
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
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Categorías</h2>
        <ul className="space-y-2">
          {categorias.map((categoria, index) => (
            <li className="text-white" key={index}>
              <a href="#" className="hover:underline text-black dark:text-white">
                {categoria.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoriaContainer;
