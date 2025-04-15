import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
