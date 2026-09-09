import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = "http://127.0.0.1:5000";

function AdminDashboard() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [tours, setTours] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuarioGuardado =
      localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      navigate("/login");
      return;
    }

    const usuarioActual =
      JSON.parse(usuarioGuardado);

    if (usuarioActual.rol !== "administrador") {
      navigate("/");
      return;
    }

    setUsuario(usuarioActual);
    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [
        respuestaUsuarios,
        respuestaTours,
      ] = await Promise.all([
        fetch(`${API_URL}/usuarios`),
        fetch(`${API_URL}/tours`),
      ]);

      if (respuestaUsuarios.ok) {
        const datosUsuarios =
          await respuestaUsuarios.json();

        setUsuarios(datosUsuarios);
      }

      if (respuestaTours.ok) {
        const datosTours =
          await respuestaTours.json();

        setTours(datosTours);
      }
    } catch (error) {
      console.error(
        "Error al cargar información:",
        error
      );
    } finally {
      setCargando(false);
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

    navigate("/login");
  };

  if (cargando || !usuario) {
    return (
      <>
        <Navbar />

        <main
          style={{
            padding: "140px 40px",
            textAlign: "center",
          }}
        >
          <h2>
            Cargando panel de administración...
          </h2>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main
        style={{
          padding: "140px 40px 70px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* =====================================
            ENCABEZADO
        ====================================== */}

        <section
          style={{
            marginBottom: "50px",
          }}
        >
          <p
            style={{
              marginBottom: "10px",
              color: "#777",
              fontSize: "15px",
            }}
          >
            Panel de administración
          </p>

          <h1
            style={{
              marginBottom: "12px",
              fontSize: "32px",
            }}
          >
            ¡Bienvenida, {usuario.nombre}! 👋
          </h1>

          <p
            style={{
              color: "#666",
              fontSize: "16px",
            }}
          >
            Desde aquí puedes administrar
            ExploreTour y consultar la
            información de la plataforma.
          </p>
        </section>


        {/* =====================================
            TARJETAS DE ESTADÍSTICAS
        ====================================== */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "25px",
            marginBottom: "65px",
          }}
        >

          {/* USUARIOS */}

          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "14px",
              padding: "28px",
              backgroundColor: "#fff",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "12px",
              }}
            >
              👥
            </div>

            <h3
              style={{
                marginBottom: "8px",
              }}
            >
              Usuarios
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: "8px 0",
              }}
            >
              {usuarios.length}
            </p>

            <p
              style={{
                color: "#777",
                margin: 0,
              }}
            >
              Usuarios registrados
            </p>
          </div>


          {/* TOURS */}

          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "14px",
              padding: "28px",
              backgroundColor: "#fff",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "12px",
              }}
            >
              🗺️
            </div>

            <h3
              style={{
                marginBottom: "8px",
              }}
            >
              Tours
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: "8px 0",
              }}
            >
              {tours.length}
            </p>

            <p
              style={{
                color: "#777",
                margin: 0,
              }}
            >
              Tours disponibles
            </p>
          </div>


          {/* RESERVAS */}

          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "14px",
              padding: "28px",
              backgroundColor: "#fff",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "12px",
              }}
            >
              📅
            </div>

            <h3
              style={{
                marginBottom: "8px",
              }}
            >
              Reservas
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: "8px 0",
              }}
            >
              —
            </p>

            <p
              style={{
                color: "#777",
                margin: 0,
              }}
            >
              Gestión de reservas
            </p>
          </div>


          {/* PAGOS */}

          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "14px",
              padding: "28px",
              backgroundColor: "#fff",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "12px",
              }}
            >
              💳
            </div>

            <h3
              style={{
                marginBottom: "8px",
              }}
            >
              Pagos
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: "8px 0",
              }}
            >
              —
            </p>

            <p
              style={{
                color: "#777",
                margin: 0,
              }}
            >
              Gestión de pagos
            </p>
          </div>

        </section>


        {/* =====================================
            ADMINISTRACIÓN
        ====================================== */}

        <section>

          <div
            style={{
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                marginBottom: "8px",
                fontSize: "26px",
              }}
            >
              Administración
            </h2>

            <p
              style={{
                color: "#777",
                margin: 0,
              }}
            >
              Selecciona una opción para
              gestionar ExploreTour.
            </p>
          </div>


          {/* TARJETAS DE ADMINISTRACIÓN */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >

            {/* ADMINISTRAR USUARIOS */}

            <Link
              to="/usuarios"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  border: "1px solid #e1e1e1",
                  borderRadius: "16px",
                  padding: "30px",
                  backgroundColor: "#fff",
                  minHeight: "190px",
                  boxShadow:
                    "0 5px 18px rgba(0,0,0,0.07)",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
              >

                <div
                  style={{
                    fontSize: "38px",
                    marginBottom: "15px",
                  }}
                >
                  👥
                </div>

                <h3
                  style={{
                    marginBottom: "12px",
                    fontSize: "20px",
                  }}
                >
                  Administrar usuarios
                </h3>

                <p
                  style={{
                    color: "#666",
                    lineHeight: "1.6",
                    marginBottom: "22px",
                  }}
                >
                  Consultar, buscar, cambiar
                  roles y eliminar usuarios.
                </p>

                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Gestionar usuarios →
                </span>

              </div>
            </Link>


            {/* ADMINISTRAR TOURS */}

            <Link
              to="/admin/tours"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  border: "1px solid #e1e1e1",
                  borderRadius: "16px",
                  padding: "30px",
                  backgroundColor: "#fff",
                  minHeight: "190px",
                  boxShadow:
                    "0 5px 18px rgba(0,0,0,0.07)",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
              >

                <div
                  style={{
                    fontSize: "38px",
                    marginBottom: "15px",
                  }}
                >
                  🗺️
                </div>

                <h3
                  style={{
                    marginBottom: "12px",
                    fontSize: "20px",
                  }}
                >
                  Administrar tours
                </h3>

                <p
                  style={{
                    color: "#666",
                    lineHeight: "1.6",
                    marginBottom: "22px",
                  }}
                >
                  Crear, consultar, modificar
                  y eliminar los tours.
                </p>

                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Gestionar tours →
                </span>

              </div>
            </Link>


            {/* RESERVAS */}

            <div
              style={{
                border: "1px solid #e1e1e1",
                borderRadius: "16px",
                padding: "30px",
                backgroundColor: "#fff",
                minHeight: "190px",
                boxShadow:
                  "0 5px 18px rgba(0,0,0,0.07)",
              }}
            >

              <div
                style={{
                  fontSize: "38px",
                  marginBottom: "15px",
                }}
              >
                📅
              </div>

              <h3
                style={{
                  marginBottom: "12px",
                  fontSize: "20px",
                }}
              >
                Reservas
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: "1.6",
                  marginBottom: "22px",
                }}
              >
                Consultar y gestionar las
                reservas realizadas.
              </p>

              <span
                style={{
                  color: "#888",
                  fontSize: "14px",
                }}
              >
                Próximamente
              </span>

            </div>


            {/* PAGOS */}

            <div
              style={{
                border: "1px solid #e1e1e1",
                borderRadius: "16px",
                padding: "30px",
                backgroundColor: "#fff",
                minHeight: "190px",
                boxShadow:
                  "0 5px 18px rgba(0,0,0,0.07)",
              }}
            >

              <div
                style={{
                  fontSize: "38px",
                  marginBottom: "15px",
                }}
              >
                💳
              </div>

              <h3
                style={{
                  marginBottom: "12px",
                  fontSize: "20px",
                }}
              >
                Pagos
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: "1.6",
                  marginBottom: "22px",
                }}
              >
                Consultar los pagos realizados
                en ExploreTour.
              </p>

              <span
                style={{
                  color: "#888",
                  fontSize: "14px",
                }}
              >
                Próximamente
              </span>

            </div>

          </div>

        </section>


        {/* =====================================
            CERRAR SESIÓN
        ====================================== */}

        <section
          style={{
            marginTop: "65px",
            paddingTop: "30px",
            borderTop: "1px solid #eee",
            textAlign: "center",
          }}
        >
          <button
            type="button"
            onClick={cerrarSesion}
            style={{
              padding: "13px 28px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#dc3545",
              color: "white",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            Cerrar sesión
          </button>
        </section>

      </main>
    </>
  );
}

export default AdminDashboard;