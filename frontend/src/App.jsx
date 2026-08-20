import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Tours from "./pages/Tours";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Registro from "./pages/Registro";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/tours" element={<Tours />} />

      <Route path="/nosotros" element={<Nosotros />} />

      <Route path="/contacto" element={<Contacto />} />

      <Route path="/registro" element={<Registro />} />

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;