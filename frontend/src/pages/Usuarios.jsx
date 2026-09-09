import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = "http://127.0.0.1:5000";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardandoRol, setGuardandoRol] = useState(null);
  const [eliminandoUsuario, setEliminandoUsuario] = useState(null);

  // =========================================================
  // CARGAR USUARIOS
  // =========================================================

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(
        `${API_URL}/usuarios`
      );

      if (!respuesta.ok) {
        throw new Error(
          "Error al consultar los usuarios"
        );
      }

      const datos = await respuesta.json();

      setUsuarios(datos);
      setUsuariosFiltrados(datos);

    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar los usuarios."
      );

    } finally {
      setCargando(false);
    }
  };

  // =========================================================
  // BUSCAR USUARIOS
  // =========================================================

  const buscarUsuarios = (e) => {
    const texto = e.target.value.toLowerCase();

    setBusqueda(texto);

    const resultados = usuarios.filter(
      (usuario) =>
        `${usuario.nombre} ${usuario.apellido}`
          .toLowerCase()
          .includes(texto) ||
        usuario.correo
          .toLowerCase()
          .includes(texto)
    );

    setUsuariosFiltrados(resultados);
  };

  // =========================================================
  // CAMBIAR ROL
  // =========================================================

  const cambiarRol = async (
    usuarioId,
    nuevoRol
  ) => {
    try {
      setGuardandoRol(usuarioId);

      // Buscar el usuario seleccionado
      const usuario = usuarios.find(
        (usuario) =>
          usuario.id === usuarioId
      );

      if (!usuario) {
        throw new Error(
          "Usuario no encontrado"
        );
      }

      // Enviar actualización al backend
      const respuesta = await fetch(
        `${API_URL}/usuarios/${usuarioId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            telefono: usuario.telefono,
            rol: nuevoRol,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No se pudo cambiar el rol"
        );
      }

      // Actualizar usuario en el estado
      const usuariosActualizados =
        usuarios.map((usuario) =>
          usuario.id === usuarioId
            ? {
                ...usuario,
                rol: datos.usuario.rol,
              }
            : usuario
        );

      setUsuarios(
        usuariosActualizados
      );

      // Mantener la búsqueda actual
      const resultados =
        usuariosActualizados.filter(
          (usuario) =>
            `${usuario.nombre} ${usuario.apellido}`
              .toLowerCase()
              .includes(busqueda) ||
            usuario.correo
              .toLowerCase()
              .includes(busqueda)
        );

      setUsuariosFiltrados(resultados);

      alert(
        "Rol actualizado correctamente."
      );

    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "No se pudo cambiar el rol del usuario."
      );

    } finally {
      setGuardandoRol(null);
    }
  };

  // =========================================================
  // ELIMINAR USUARIO
  // =========================================================

  const eliminarUsuario = async (usuarioId) => {
    const confirmar = window.confirm(
      "¿Está seguro de que desea eliminar este usuario?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setEliminandoUsuario(usuarioId);

      // Enviar petición DELETE al backend
      const respuesta = await fetch(
        `${API_URL}/usuarios/${usuarioId}`,
        {
          method: "DELETE",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No se pudo eliminar el usuario"
        );
      }

      // Eliminar el usuario de la lista principal
      const usuariosActualizados =
        usuarios.filter(
          (usuario) =>
            usuario.id !== usuarioId
        );

      setUsuarios(
        usuariosActualizados
      );

      // Actualizar también la lista filtrada
      const resultados =
        usuariosActualizados.filter(
          (usuario) =>
            `${usuario.nombre} ${usuario.apellido}`
              .toLowerCase()
              .includes(busqueda) ||
            usuario.correo
              .toLowerCase()
              .includes(busqueda)
        );

      setUsuariosFiltrados(
        resultados
      );

      alert(
        "Usuario eliminado correctamente."
      );

    } catch (error) {
      console.error(
        "Error al eliminar usuario:",
        error
      );

      alert(
        error.message ||
          "No se pudo eliminar el usuario."
      );

    } finally {
      setEliminandoUsuario(null);
    }
  };

  // =========================================================
  // CARGANDO
  // =========================================================

  if (cargando) {
    return (
      <>
        <Navbar />

        <main
          style={{
            padding: "140px 40px",
          }}
        >
          <h2>
            Cargando usuarios...
          </h2>
        </main>
      </>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <>
        <Navbar />

        <main
          style={{
            padding: "140px 40px",
          }}
        >
          <h2>{error}</h2>
        </main>
      </>
    );
  }

  // =========================================================
  // INTERFAZ
  // =========================================================

  return (
    <>
      <Navbar />

      <main
        style={{
          padding: "140px 40px",
        }}
      >

        {/* =====================================================
            TÍTULO
        ====================================================== */}

        <div className="section-title">

          <h2>
            Gestión de usuarios
          </h2>

          <p>
            Consulta y administra los usuarios
            registrados en ExploreTour.
          </p>

        </div>

        {/* =====================================================
            BUSCADOR
        ====================================================== */}

        <div
          style={{
            maxWidth: "500px",
            margin: "30px auto",
          }}
        >

          <label>
            <strong>
              Buscar usuario
            </strong>
          </label>

          <input
            type="text"
            value={busqueda}
            onChange={buscarUsuarios}
            placeholder="Buscar por nombre o correo..."
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />

        </div>

        {/* =====================================================
            RESULTADOS
        ====================================================== */}

        <section>

          <h3>
            Usuarios encontrados:{" "}
            {usuariosFiltrados.length}
          </h3>

          {usuariosFiltrados.length === 0 ? (

            <p>
              No se encontraron usuarios.
            </p>

          ) : (

            usuariosFiltrados.map(
              (usuario) => (

                <div
                  key={usuario.id}
                  style={{
                    border:
                      "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "15px",
                  }}
                >

                  {/* =================================================
                      INFORMACIÓN DEL USUARIO
                  ================================================== */}

                  <h3>
                    {usuario.nombre}{" "}
                    {usuario.apellido}
                  </h3>

                  <p>
                    <strong>
                      Correo:
                    </strong>{" "}
                    {usuario.correo}
                  </p>

                  <p>
                    <strong>
                      Teléfono:
                    </strong>{" "}
                    {usuario.telefono ||
                      "No registrado"}
                  </p>

                  <p>
                    <strong>
                      Rol actual:
                    </strong>{" "}
                    {usuario.rol}
                  </p>

                  {/* =================================================
                      CAMBIAR ROL
                  ================================================== */}

                  <div
                    style={{
                      marginTop: "15px",
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                      flexWrap:
                        "wrap",
                    }}
                  >

                    <label>
                      <strong>
                        Cambiar rol:
                      </strong>
                    </label>

                    <select
                      value={usuario.rol}
                      onChange={(e) =>
                        cambiarRol(
                          usuario.id,
                          e.target.value
                        )
                      }
                      disabled={
                        guardandoRol ===
                        usuario.id ||
                        eliminandoUsuario ===
                        usuario.id
                      }
                      style={{
                        padding:
                          "8px 12px",
                        borderRadius:
                          "6px",
                        border:
                          "1px solid #ccc",
                        cursor:
                          "pointer",
                      }}
                    >

                      <option value="turista">
                        Turista
                      </option>

                      <option value="guia">
                        Guía
                      </option>

                      <option value="administrador">
                        Administrador
                      </option>

                    </select>

                    {guardandoRol ===
                      usuario.id && (
                        <span>
                          Guardando...
                        </span>
                      )}

                  </div>

                  {/* =================================================
                      ELIMINAR USUARIO
                  ================================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      eliminarUsuario(
                        usuario.id
                      )
                    }
                    disabled={
                      eliminandoUsuario ===
                      usuario.id
                    }
                    style={{
                      marginTop: "15px",
                      padding: "10px 15px",
                      borderRadius: "6px",
                      border: "none",
                      cursor:
                        eliminandoUsuario ===
                        usuario.id
                          ? "not-allowed"
                          : "pointer",
                      backgroundColor: "#dc3545",
                      color: "white",
                      opacity:
                        eliminandoUsuario ===
                        usuario.id
                          ? 0.7
                          : 1,
                    }}
                  >
                    {eliminandoUsuario ===
                    usuario.id
                      ? "Eliminando..."
                      : "Eliminar usuario"}
                  </button>

                </div>

              )
            )

          )}

        </section>

      </main>
    </>
  );
}

export default Usuarios;