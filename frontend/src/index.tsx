import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { I18nextProvider } from "react-i18next";
import i18next from "./i18n/config";
//import "azure-maps-control/dist/atlas.min.css";
import "../src/styles/global.css";
//import App from "./App.tsx";
//import "maplibre-gl/dist/maplibre-gl.css";
import "azure-maps-control/dist/atlas.min.css";

//import ChatPage from "./components/Chat/ChatPage.tsx";
//<ChatPage />
import AppRouter from "./routes/AppRouter.tsx";
import { QueryProvider } from "./providers/QueryProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryProvider>
            <I18nextProvider i18n={i18next}>
                <AppRouter />
            </I18nextProvider>
        </QueryProvider>
    </StrictMode>
);
