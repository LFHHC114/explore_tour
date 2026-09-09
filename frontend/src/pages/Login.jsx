import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch(
        "http://127.0.0.1:5000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: correo,
            password: password,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(
          datos.error ||
            datos.mensaje ||
            "Correo o contraseña incorrectos."
        );

        setCargando(false);
        return;
      }

      // =====================================================
      // GUARDAR USUARIO
      // =====================================================

      localStorage.setItem(
        "usuario",
        JSON.stringify(datos.usuario)
      );

      console.log(
        "Usuario guardado:",
        datos.usuario
      );

      // =====================================================
      // MENSAJE DE BIENVENIDA
      // =====================================================

      setMensaje(
        `Bienvenida/o ${datos.usuario.nombre}. Inicio de sesión exitoso.`
      );

      // =====================================================
      // REDIRECCIÓN SEGÚN EL ROL
      // =====================================================

      setTimeout(() => {

        if (
          datos.usuario.rol ===
          "administrador"
        ) {
          navigate("/admin");

        } else if (
          datos.usuario.rol ===
          "turista"
        ) {
          navigate("/turista");

        } else if (
          datos.usuario.rol ===
          "guia"
        ) {
          navigate("/guia");

        } else {
          // Si el rol no existe o no coincide
          navigate("/");
        }

      }, 1000);

    } catch (error) {
      console.error(error);

      setError(
        "No se pudo conectar con el servidor."
      );

      setCargando(false);
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section
          className="contacto"
          style={{
            paddingTop: "140px",
          }}
        >

          <div className="section-title">

            <h2>
              Iniciar sesión
            </h2>

            <p>
              Ingresa a tu cuenta de ExploreTour.
            </p>

          </div>

          <div className="contacto-container">

            {/* =================================================
                INFORMACIÓN
            ================================================== */}

            <div className="contacto-info">

              <h3>
                Bienvenido a ExploreTour
              </h3>

              <p>
                Inicia sesión para acceder a
                las funciones de tu cuenta y
                disfrutar de nuestras experiencias
                turísticas.
              </p>

              <div className="info-item">
                <i className="fas fa-route"></i>

                <span>
                  Descubre nuestros tours
                </span>
              </div>

              <div className="info-item">
                <i className="fas fa-calendar-check"></i>

                <span>
                  Gestiona tus reservas
                </span>
              </div>

            </div>

            {/* =================================================
                FORMULARIO
            ================================================== */}

            <form
              className="contact-form"
              onSubmit={iniciarSesion}
            >

              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) =>
                  setCorreo(e.target.value)
                }
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                className="btn-primary"
                type="submit"
                disabled={cargando}
              >
                {cargando
                  ? "Ingresando..."
                  : "Iniciar sesión"}
              </button>

              {mensaje && (
                <p
                  style={{
                    color: "green",
                    marginTop: "15px",
                  }}
                >
                  {mensaje}
                </p>
              )}

              {error && (
                <p
                  style={{
                    color: "red",
                    marginTop: "15px",
                  }}
                >
                  {error}
                </p>
              )}

            </form>

          </div>

        </section>
      </main>
    </>
  );
}

export default Login;