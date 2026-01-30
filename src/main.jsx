import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import FloatingHelpGuide from "./components/layout/FloatingHelpGuide";
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// 🔹 Add this at the very top for iPhone JS error debugging
window.onerror = function(message, source, lineno, colno, error) {
  alert(`Error: ${message}\nAt: ${source}:${lineno}:${colno}`);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
      <FloatingHelpGuide />
    </BrowserRouter>
  </React.StrictMode>
);
