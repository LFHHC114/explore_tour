import { useState } from "react";
import Navbar from "../components/Navbar";

function Registro() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    telefono: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(
        "http://127.0.0.1:5000/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formulario),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.mensaje || "No se pudo registrar el usuario.");
        return;
      }

      setMensaje("Usuario registrado correctamente.");

      setFormulario({
        nombre: "",
        apellido: "",
        correo: "",
        password: "",
        telefono: "",
      });

    } catch (error) {
      console.error(error);
      setError(
        "No se pudo conectar con el servidor."
      );
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
            <h2>Crear cuenta</h2>

            <p>
              Regístrate en ExploreTour y comienza a descubrir
              nuevas experiencias.
            </p>
          </div>

          <div className="contacto-container">

            <div className="contacto-info">
              <h3>Únete a ExploreTour</h3>

              <p>
                Crea tu cuenta para consultar nuestros tours
                y realizar reservas.
              </p>

              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Medellín, Colombia</span>
              </div>

              <div className="info-item">
                <i className="fas fa-route"></i>
                <span>Descubre nuestros tours</span>
              </div>

              <div className="info-item">
                <i className="fas fa-calendar-check"></i>
                <span>Realiza tus reservas</span>
              </div>
            </div>

            <form
              className="contact-form"
              onSubmit={registrarUsuario}
            >

              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
              />

              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formulario.apellido}
                onChange={manejarCambio}
                required
              />

              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={formulario.correo}
                onChange={manejarCambio}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formulario.password}
                onChange={manejarCambio}
                required
              />

              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formulario.telefono}
                onChange={manejarCambio}
              />

              <button
                className="btn-primary"
                type="submit"
              >
                Registrarme
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

export default Registro;