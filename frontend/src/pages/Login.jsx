import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

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
        return;
      }

      // Guardar el usuario que inició sesión
      localStorage.setItem(
        "usuario",
        JSON.stringify(datos.usuario)
      );

      console.log("Usuario guardado:", datos.usuario);

      // Mostrar mensaje de bienvenida
      setMensaje(
        `Bienvenida/o ${datos.usuario.nombre}. Inicio de sesión exitoso.`
      );

      // Redirigir al inicio después de 1.5 segundos
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.error(error);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section
          className="contacto"
          style={{ paddingTop: "140px" }}
        >
          <div className="section-title">
            <h2>Iniciar sesión</h2>

            <p>
              Ingresa a tu cuenta de ExploreTour.
            </p>
          </div>

          <div className="contacto-container">

            <div className="contacto-info">
              <h3>Bienvenido a ExploreTour</h3>

              <p>
                Inicia sesión para acceder a tus reservas
                y disfrutar de nuestras experiencias turísticas.
              </p>

              <div className="info-item">
                <i className="fas fa-route"></i>
                <span>Descubre nuestros tours</span>
              </div>

              <div className="info-item">
                <i className="fas fa-calendar-check"></i>
                <span>Gestiona tus reservas</span>
              </div>
            </div>

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
              >
                Iniciar sesión
              </button>

              {mensaje && (
                <p style={{ color: "green" }}>
                  {mensaje}
                </p>
              )}

              {error && (
                <p style={{ color: "red" }}>
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