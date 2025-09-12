import { createRoot } from "react-dom/client";
import App from "./App";
import "./global.css"
import AppProviders from "./components/app/AppProviders";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <AppProviders>
    <App />
  </AppProviders>,
);
