import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    cargarUsuario();
  }, [location]);

  const cargarUsuario = () => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
      try {
        const usuarioActual = JSON.parse(usuarioGuardado);
        setUsuario(usuarioActual);
      } catch (error) {
        console.error("Error al leer usuario:", error);
        localStorage.removeItem("usuario");
        setUsuario(null);
      }
    } else {
      setUsuario(null);
    }
  };

  const cerrarSesion = () => {
    const confirmar = window.confirm(
      "¿Deseas cerrar sesión?"
    );

    if (!confirmar) {
      return;
    }

    localStorage.removeItem("usuario");

    setUsuario(null);

    navigate("/login");
  };

  return (
    <header>
      <div className="navbar">

        {/* LOGO */}
        <Link to="/" className="logo">
          <h2>
            Explore<span>Tour</span>
          </h2>
        </Link>

        {/* MENÚ */}
        <nav>
          <ul className="menu">

            {/* =========================
                OPCIONES PÚBLICAS
            ========================== */}

            <li>
              <Link to="/">
                Inicio
              </Link>
            </li>

            <li>
              <Link to="/tours">
                Tours
              </Link>
            </li>

            <li>
              <Link to="/nosotros">
                Nosotros
              </Link>
            </li>

            <li>
              <Link to="/contacto">
                Contacto
              </Link>
            </li>


            {/* =========================
                ADMINISTRADOR
            ========================== */}

            {usuario &&
              usuario.rol === "administrador" && (
                <>
                  <li>
                    <Link to="/admin">
                      Panel administrativo
                    </Link>
                  </li>

                  <li>
                    <Link to="/usuarios">
                      Administrar usuarios
                    </Link>
                  </li>

                  <li>
                    <Link to="/admin/tours">
                      Administrar tours
                    </Link>
                  </li>
                </>
              )}


            {/* =========================
                TURISTA
            ========================== */}

            {usuario &&
              usuario.rol === "turista" && (
                <li>
                  <Link to="/turista">
                    Mi espacio
                  </Link>
                </li>
              )}


            {/* =========================
                VISITANTE
            ========================== */}

            {!usuario && (
              <>
                <li>
                  <Link to="/login">
                    Iniciar sesión
                  </Link>
                </li>

                <li>
                  <Link to="/registro">
                    Registrarse
                  </Link>
                </li>
              </>
            )}


            {/* =========================
                USUARIO LOGUEADO
            ========================== */}

            {usuario && (
              <li>
                <button
                  type="button"
                  onClick={cerrarSesion}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    font: "inherit",
                    padding: 0,
                  }}
                >
                  Cerrar sesión
                </button>
              </li>
            )}

          </ul>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;