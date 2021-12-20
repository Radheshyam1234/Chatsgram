import { StrictMode } from "react";
import ReactDOM from "react-dom";
import{ BrowserRouter} from "react-router-dom"
import { AuthProvider } from "./components/Context/AuthProvider";
import {DrawerProvider} from "./components/Context/DrawerProvider"

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <DrawerProvider>
      <App />
      </DrawerProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
  rootElement
);
