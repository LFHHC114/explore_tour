import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Tours from "../pages/tours";
import Nosotros from "../pages/Nosotros";
import Contacto from "../pages/Contacto";
import Usuarios from "../pages/Usuarios";
import AdminTours from "../pages/AdministrarTours";
import AdminDashboard from "../pages/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>

      {/* Página principal */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Inicio de sesión */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Registro */}
      <Route
        path="/registro"
        element={<Registro />}
      />

      {/* Tours */}
      <Route
        path="/tours"
        element={<Tours />}
      />

      {/* Información */}
      <Route
        path="/nosotros"
        element={<Nosotros />}
      />

      {/* Contacto */}
      <Route
        path="/contacto"
        element={<Contacto />}
      />

      {/* Administración de usuarios */}
      <Route
        path="/usuarios"
        element={<Usuarios />}
      />

      {/* Panel principal del administrador */}
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      {/* Administración de tours */}
      <Route
        path="/admin/tours"
        element={<AdminTours />}
      />

    </Routes>
  );
}

export default AppRoutes;