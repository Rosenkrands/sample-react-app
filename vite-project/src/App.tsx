import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
