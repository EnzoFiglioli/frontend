import { useSession } from "./context/SessionContext.jsx";
import LoginModal from "./components/LoginModal.jsx";
import { useModal } from "./context/ModalContext.jsx";
import { useState, useEffect } from "react";

const Navbar = ({openModal}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full py-4 px-6 transition-all duration-300 ${scrolled ? 'bg-black text-white' : 'bg-transparent text-white'} z-50`}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-white font-bold">Tabl3ro</h1>
        <button className="text-lg font-semibold bg-transparent py-2 px-6 rounded-full" onClick={openModal}>
          Iniciar sesión
        </button>
      </div>
    </nav>
  );
};

const App = () => {
  const { session } = useSession();
  const { openModal } = useModal();

  return (
    <div>
    <Navbar openModal={openModal} />
    {!session ? (
        <div className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596865249308-2472dc5807d7?q=80&w=1506&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
          <h1 className="text-6xl font-extrabold text-center text-white mb-4 drop-shadow-lg">
            Bienvenido a Tabl3ro
          </h1>
          <p className="text-xl text-center mb-8 drop-shadow-lg">Conéctate, comparte y descubre lo que está pasando</p>
          
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold py-3 px-10 rounded-full transition duration-300 transform hover:scale-105"
            onClick={openModal}
          >
            Empieza Ahora
          </button>
        </div>
      ) : (
        <div>{(window.location.href = "/dashboard")}</div>
      )}

      {/* Info Section */}
      <div className="bg-black text-white py-16">
        <div className="min-h-screen max-w-screen-lg mx-auto text-center px-4">
          <h2 className="text-3xl font-semibold mb-4">¿Qué es Tabl3ro?</h2>
          <p className="text-lg mb-8">Una plataforma diseñada para compartir tus ideas, descubrir lo último en tendencias y conectar con personas de todo el mundo.</p>
          <div className="flex justify-center space-x-8">
            <div className="w-32 h-32 bg-gray-800 rounded-full flex justify-center items-center shadow-lg">
              <img src="https://via.placeholder.com/100" alt="icono 1" className="w-16 h-16" />
            </div>
            <div className="w-32 h-32 bg-gray-800 rounded-full flex justify-center items-center shadow-lg">
              <img src="https://via.placeholder.com/100" alt="icono 2" className="w-16 h-16" />
            </div>
            <div className="w-32 h-32 bg-gray-800 rounded-full flex justify-center items-center shadow-lg">
              <img src="https://via.placeholder.com/100" alt="icono 3" className="w-16 h-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="min-h-screen bg-gray-900 py-12 text-white text-center">
        <h2 className="text-3xl font-semibold mb-6">Únete a la conversación</h2>
        <p className="text-lg mb-8">Comienza a compartir tus pensamientos y conecta con miles de usuarios ahora mismo.</p>
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold py-3 px-10 rounded-full transition duration-300 transform hover:scale-105"
          onClick={() => window.location.href = "/register"}
        >
          Regístrate
        </button>
      </div>

      <LoginModal />
    </div>
  );
};

export default App;
