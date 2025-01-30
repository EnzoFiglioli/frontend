import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ModalProvider } from "./context/ModalContext";
import { SessionProvider } from "./context/SessionContext";
import { TweetProvider } from "./context/TweetContex.jsx";

import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import {Profile} from "./pages/Profile.jsx"
import Notificaciones from "./pages/Notifications.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <SessionProvider>
    <BrowserRouter>
      <ModalProvider>
        <TweetProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />}/>
              <Route path="/profile/:username" element={<Profile />}/>
              <Route path="/notifications" element={<Notificaciones />} />
            </Routes>
          </TweetProvider>
      </ModalProvider>
    </BrowserRouter>
  </SessionProvider>
);
                