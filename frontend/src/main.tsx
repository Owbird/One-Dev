import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App";
import { GitRoutes } from "./data/constants/routes";
import ViewLocalRepo from "./pages/git/localRepo/ViewLocalRepo";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path={GitRoutes.LocalRepoView} element={<ViewLocalRepo />} />
      </Routes>
    </Router>
  </ChakraProvider>
);
