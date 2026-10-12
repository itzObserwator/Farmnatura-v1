import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
// Vite has installed the live stylesheet before this module runs.
// Remove the initial inline copy so removed CSS rules do not survive hot reload.
if (import.meta.env.DEV)
  document.getElementById("development-first-paint-styles")?.remove();
const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
