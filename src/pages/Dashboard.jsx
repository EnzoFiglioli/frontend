import Nav from '../components/Nav';
import MensajesTablero from '../components/MensajesTablero';
import Sugerencias from '../components/Sugerencias';
import CategoriaContainer from '../components/CategoriaContainer';
import { SessionProvider } from '../context/SessionContext';
import Tendencias from '../components/Tendencias';
import LoginModal from '../components/LoginModal';


const Dashboard = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
      <Nav />
      <hr className="border-gray-600" />
      <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <div className="hidden md:block md:col-span-1 border-r-2 border-gray-300 dark:border-gray-700 p-4">
          <CategoriaContainer />
        </div>
        <div className="col-span-1 md:col-span-2 border-gray-300 dark:border-gray-700 p-4">
          <SessionProvider>
            <MensajesTablero />
          </SessionProvider>
        </div>
        <div className="hidden md:flex flex-col md:col-span-1 border-l-2 border-gray-300 dark:border-gray-700 p-4">
          <div className="mb-4">
            <Tendencias />
          </div>
          <div className="rounded border-gray-300 dark:border-gray-700 p-4">
            <Sugerencias />
          </div>
        </div>
      </div>
      <LoginModal />
    </div>
    </div>
  )
}

export default Dashboard
