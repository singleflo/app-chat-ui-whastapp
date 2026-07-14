import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ChatDataProvider } from "./data/chat-data";
import "./i18n";
import "./index.css";

const root = document.getElementById("root");
if (root === null) {
    throw new Error("Root element not found");
}

createRoot(root).render(
    <StrictMode>
        <ChatDataProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ChatDataProvider>
    </StrictMode>
);
