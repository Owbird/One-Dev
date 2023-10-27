import { createRoot } from "react-dom/client";
import App from "./App";
import AppProviders from "./components/app/AppProviders";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <AppProviders>
    <App />
  </AppProviders>,
);
