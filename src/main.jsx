import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { ModalProvider } from "./context/ModalContext";
import { SessionProvider } from "./context/SessionContext";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

createRoot(document.getElementById("root")).render(
  <SessionProvider>
    <BrowserRouter>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="register" element={<Register />} />
            <Route path="dashboard" element={
              <ModalProvider>
                <Dashboard />
              </ModalProvider>
              }/>
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  </SessionProvider>
);