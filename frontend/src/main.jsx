import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { AudioProvider } from "./context/AudioContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
   <AudioProvider> 
    <App />
    </AudioProvider>
  </AuthProvider>
);
