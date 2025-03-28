import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes"; // Importando as rotas de "routes/index.jsx"
import "./index.css"; // Estilos globais

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
