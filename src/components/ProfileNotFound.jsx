export default function ProfileNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold mb-4">Perfil no encontrado</h1>
            <p className="text-lg text-gray-600 mb-6">El usuario que buscas no existe o ha sido eliminado.</p>
            <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                Volver al inicio
            </a>
        </div>
    );
}