import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";
import { NoticeProvider } from "./components/NoticeProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NoticeProvider>
      <App />
    </NoticeProvider>
  </StrictMode>
);
