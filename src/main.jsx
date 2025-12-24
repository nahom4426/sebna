import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import { ModalProvider } from "@/context/ModalContext";   // ✅ add this
import { I18nProvider } from "@/i18n/I18nContext";
import "../public/css/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <I18nProvider>
            <ModalProvider>         {/* ✅ wrap App with ModalProvider */}
              <App />
            </ModalProvider>
          </I18nProvider>
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);