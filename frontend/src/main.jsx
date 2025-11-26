import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import AppContextProvider from "./context/AppContext.jsx";
import { SocketContextProvider } from './context/SocketContext.jsx';

console.log('Environment Check:', {
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </AppContextProvider>
  </BrowserRouter>
);
