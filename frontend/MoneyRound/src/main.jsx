import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
//import LandingPage from "./page/LandingPage";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <LandingPage /> */}
    <App/>
    
  </StrictMode>
);
