import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Nav from '../components/Nav';
import MensajesTablero from '../components/MensajesTablero';
import Sugerencias from '../components/Sugerencias';
import CategoriaContainer from '../components/CategoriaContainer';
import Tendencias from '../components/Tendencias';
import LoginModal from '../components/LoginModal';
import { TendenciasProvider } from "../context/TendenciasContext.jsx";
import { Menu, X } from "lucide-react"; 
import { useSession } from "../context/SessionContext.jsx";

const Dashboard = () => {
  const { session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      window.location.href = "/";
    }
  }, [session]);

  return (
    <div>
          <title>Dashboard</title>
          <div className="flex flex-col min-h-screen">
            <Nav />
            <hr className="border-gray-600" />

            <div className="md:hidden flex justify-between items-center p-4">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <button onClick={() => setMenuOpen(true)} className="text-gray-600 dark:text-white">
                <Menu size={28} />
              </button>
            </div>

            {menuOpen && (
              <motion.div
                initial={{ x: "-100%" }} 
                animate={{ x: 0 }} 
                exit={{ x: "-100%" }} 
                transition={{ type: "tween", duration: 0.3 }} 
                className="fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900 shadow-lg p-4 z-50"
                style={{overflowY:"scroll"}}
              >
                <div className="flex justify-end">
                  <button onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-white">
                    <X size={28} />
                  </button>
                </div>

                <TendenciasProvider>
                  <Tendencias />
                </TendenciasProvider>
                <div className="mt-4">
                  <Sugerencias />
                </div>
              </motion.div>
            )}

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
          </div>
        </div>
  );
};

export default Dashboard