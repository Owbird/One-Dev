import { ChakraProvider } from "@chakra-ui/react";
import { render } from "react-dom";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App";
import RepoView from "./pages/git/RepoView";

const container = document.getElementById("root");

render(
  <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/repo/view" element={<RepoView />} />
      </Routes>
    </Router>
  </ChakraProvider>,
  container
);
