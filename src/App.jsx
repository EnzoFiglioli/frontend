import MensajesTablero from "./components/MensajesTablero";
import CategoriaContainer from "./components/CategoriaContainer";
import Nav from "./components/Nav";
import Tendencias from "./components/Tendencias.jsx";
import Sugerencias from "./components/Sugerencias.jsx";
import LoginModal from "./components/LoginModal.jsx";
import { TendenciasProvider } from "./context/TendenciasContext.jsx";
import { useSession } from "./context/SessionContext.jsx";

const App = () => {
  const {session} = useSession();

  return (
    <div className="flex flex-col min-h-screen">
    { !session ? 
    <div>
      <title>Tabl3ro - Tu sitio de mensajes favorito</title>
      <Nav />
      <hr className="border-gray-600" />
      <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <div className="hidden md:block md:col-span-1 border-r-2 border-gray-300 dark:border-gray-700 p-4">
          <CategoriaContainer />
        </div>
        <div className="col-span-1 md:col-span-2 border-gray-300 dark:border-gray-700 p-4">
          <MensajesTablero />
        </div>
        <div className="hidden md:flex flex-col md:col-span-1 border-l-2 border-gray-300 dark:border-gray-700 p-4">
          <div className="mb-4">
          <TendenciasProvider>
            <Tendencias />
          </TendenciasProvider>
          </div>
          <div className="rounded border-gray-300 dark:border-gray-700 p-4">
            <Sugerencias />
          </div>
        </div>
      </div>
      <LoginModal />
      </div> : <div>{window.location.href = "/dashboard"}</div>
    }
    </div>
  );
};

export default App;
