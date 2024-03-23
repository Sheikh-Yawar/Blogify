import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { AuthContextProvider } from "./contexts/authContext";

const el = document.getElementById("root");

const root = ReactDOM.createRoot(el);

root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
