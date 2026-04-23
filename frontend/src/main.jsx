import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

import App from "./App.jsx";
import "./index.css";
import AppContextProvider from "./context/AppContext.jsx";
import { SocketContextProvider } from './context/SocketContext.jsx';

// Dev: always use relative URLs so `/api/*` goes through Vite's proxy
// (see vite.config.js). Prod: prefix every request with the Lambda API
// origin. `import.meta.env.DEV` is true on `npm run dev`, false on build
// — so this switch is safe regardless of what local .env files set.
if (!import.meta.env.DEV && import.meta.env.VITE_BACKEND_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </AppContextProvider>
  </BrowserRouter>
);
