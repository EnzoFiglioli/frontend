const CrearTweet = () => {
  return (
    <div>
        <h2 className="text-2xl font-bold text-center">Crear Tweet</h2>
        <form>
            <textarea className="w-full p-2 rounded dark:dark:bg-gray-800 dark:text-white" placeholder="Escribe tu tweet"></textarea>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Enviar</button>
        </form>
    </div>
  )
}

export default CrearTweet
