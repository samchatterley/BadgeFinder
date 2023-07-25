import * as React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

const root = document.getElementById("root");
const container = ReactDOM.createRoot(root);

container.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
