import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // Importing React Router
import App from "./App";  // Importing App component

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>  {/* Wrapping the app with BrowserRouter */}
    <App />
  </BrowserRouter>
);