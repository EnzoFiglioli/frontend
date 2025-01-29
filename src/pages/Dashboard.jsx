import Nav from '../components/Nav';
import {LikeProvider} from "../context/LikesContext.jsx"
import MensajesTablero from '../components/MensajesTablero';
import Sugerencias from '../components/Sugerencias';
import CategoriaContainer from '../components/CategoriaContainer';
import { SessionProvider } from '../context/SessionContext';
import Tendencias from '../components/Tendencias';
import LoginModal from '../components/LoginModal';
import {TendenciasProvider} from "../context/TendenciasContext.jsx";

const Dashboard = () => {
  return (
    <SessionProvider> 
      <div>
        <title>Dashboard</title>
        <div className="flex flex-col min-h-screen">
          <Nav />
          <hr className="border-gray-600" />
          
          <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            
            <div className="hidden md:block md:col-span-1 border-r-2 border-gray-300 dark:border-gray-700 p-4">
              <CategoriaContainer />
            </div>

            <div className="col-span-1 md:col-span-2 border-gray-300 dark:border-gray-700 p-4">
              <LikeProvider>
                <MensajesTablero />
              </LikeProvider>
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
        </div>
      </div>
    </SessionProvider> 
  );
};

export default Dashboard;
