import {
    StrictMode
} from "react";

import {
    createRoot
} from "react-dom/client";

import App
    from "./App";

import {
    AppErrorBoundary
} from "./app/AppErrorBoundary";

import "./styles/tokens.css";
import "./index.css";
import "./styles/ui.css";

createRoot(
    document.getElementById(
        "root"
    )!
).render(

    <StrictMode>

        <AppErrorBoundary>

            <App />

        </AppErrorBoundary>

    </StrictMode>

);