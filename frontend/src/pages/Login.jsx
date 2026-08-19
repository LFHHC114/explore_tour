import { useState } from "react";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo,
          password: password,
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensaje(`Bienvenida, ${datos.usuario.nombre}`);

        console.log("Usuario autenticado:", datos.usuario);

        // Guardamos los datos del usuario
        localStorage.setItem(
          "usuario",
          JSON.stringify(datos.usuario)
        );
      } else {
        setMensaje(datos.mensaje);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h1>Iniciar sesión</h1>

      <form onSubmit={iniciarSesion}>
        <div>
          <label>Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Ingresa tu correo"
            required
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <button type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Login;