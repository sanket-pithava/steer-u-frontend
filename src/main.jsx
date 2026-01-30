import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import FloatingHelpGuide from "./components/layout/FloatingHelpGuide";
import 'core-js/stable';
import 'regenerator-runtime/runtime';

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
