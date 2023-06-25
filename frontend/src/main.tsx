import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App";
import RepoView from "./pages/git/RepoView";
const container = document.getElementById("root");

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/repo/view" element={<RepoView />} />
      </Routes>
    </Router>
  </ChakraProvider>
);
