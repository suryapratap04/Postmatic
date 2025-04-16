import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppContextProvider from "./context/AppContext.tsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppContextProvider>
);
