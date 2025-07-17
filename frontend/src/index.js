// frontend/src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // App.jsx dosyanı otomatik olarak tanır
import "./index.css"; // Eğer CSS dosyan varsa, yoksa bu satırı silebilirsin

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
