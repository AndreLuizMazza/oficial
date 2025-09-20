import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { initTheme } from "@/lib/theme";

// aplica tema ANTES de montar o React (evita flash)
initTheme();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
