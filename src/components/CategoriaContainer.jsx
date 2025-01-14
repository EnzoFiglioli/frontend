const CategoriaContainer = () => {
  return (
    <nav aria-label="Categorías">
  <div className="my-2 border-l-4 border-gray-300 dark:border-gray-700 pl-4">
    <h2 className="text-2xl font-semibold text-white mb-4">Categorías</h2>
    <ul className="space-y-2">
      <li className="text-white">
        <a href="#" className="hover:underline">Política</a>
      </li>
      <li className="text-white">
        <a href="#" className="hover:underline">Economía</a>
      </li>
      <li className="text-white">
        <a href="#" className="hover:underline">Deportes</a>
      </li>
      <li className="text-white">
        <a href="#" className="hover:underline">IRL</a>
      </li>
    </ul>
  </div>
</nav>

  )
}

export default CategoriaContainer;