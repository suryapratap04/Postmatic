import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppContextProvider from "./Context/AppContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <AppContextProvider>
      <App />
      {/* <ToastContainer /> */}
    </AppContextProvider>
);
