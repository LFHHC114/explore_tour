import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = "http://127.0.0.1:5000";

function AdminTours() {
  const [tours, setTours] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [editando, setEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    duracion: "",
    ubicacion: "",
    imagen: "",
    categoria_id: "",
    guia_id: "",
    cupos: "",
    estado: "activo",
  });

  // =========================================
  // CARGAR TOURS
  // =========================================

  const cargarTours = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(`${API_URL}/tours`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los tours");
      }

      const datos = await respuesta.json();

      setTours(datos);
      setError("");
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los sitios turísticos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTours();
  }, []);

  // =========================================
  // CAMBIAR FORMULARIO
  // =========================================

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  // =========================================
  // LIMPIAR FORMULARIO
  // =========================================

  const limpiarFormulario = () => {
    setFormulario({
      titulo: "",
      descripcion: "",
      precio: "",
      duracion: "",
      ubicacion: "",
      imagen: "",
      categoria_id: "",
      guia_id: "",
      cupos: "",
      estado: "activo",
    });

    setEditando(null);
  };

  // =========================================
  // CREAR TOUR
  // =========================================

  const crearTour = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/tours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: formulario.titulo,
          descripcion: formulario.descripcion,
          precio: Number(formulario.precio),
          duracion: formulario.duracion,
          ubicacion: formulario.ubicacion,
          imagen: formulario.imagen || null,
          categoria_id: formulario.categoria_id
            ? Number(formulario.categoria_id)
            : null,
          guia_id: formulario.guia_id
            ? Number(formulario.guia_id)
            : null,
          cupos: formulario.cupos
            ? Number(formulario.cupos)
            : 0,
          estado: formulario.estado,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(
          datos.mensaje ||
            datos.error ||
            "No se pudo crear el sitio turístico."
        );
        return;
      }

      setMensaje("Sitio turístico creado correctamente.");

      limpiarFormulario();

      cargarTours();
    } catch (error) {
      console.error(error);

      setError("No se pudo conectar con el servidor.");
    }
  };

  // =========================================
  // EDITAR TOUR
  // =========================================

  const comenzarEdicion = (tour) => {
    setEditando(tour.id);

    setFormulario({
      titulo: tour.titulo || "",
      descripcion: tour.descripcion || "",
      precio: tour.precio || "",
      duracion: tour.duracion || "",
      ubicacion: tour.ubicacion || "",
      imagen: tour.imagen || "",
      categoria_id: tour.categoria_id || "",
      guia_id: tour.guia_id || "",
      cupos: tour.cupos || "",
      estado: tour.estado || "activo",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const actualizarTour = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(
        `${API_URL}/tours/${editando}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: formulario.titulo,
            descripcion: formulario.descripcion,
            precio: Number(formulario.precio),
            duracion: formulario.duracion,
            ubicacion: formulario.ubicacion,
            imagen: formulario.imagen || null,
            categoria_id: formulario.categoria_id
              ? Number(formulario.categoria_id)
              : null,
            guia_id: formulario.guia_id
              ? Number(formulario.guia_id)
              : null,
            cupos: formulario.cupos
              ? Number(formulario.cupos)
              : 0,
            estado: formulario.estado,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(
          datos.mensaje ||
            datos.error ||
            "No se pudo actualizar el sitio turístico."
        );
        return;
      }

      setMensaje(
        "Sitio turístico actualizado correctamente."
      );

      limpiarFormulario();

      cargarTours();
    } catch (error) {
      console.error(error);

      setError("No se pudo conectar con el servidor.");
    }
  };

  // =========================================
  // ELIMINAR TOUR
  // =========================================

  const eliminarTour = async (id) => {
    const confirmar = window.confirm(
      "¿Está seguro de que desea eliminar este sitio turístico?"
    );

    if (!confirmar) {
      return;
    }

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(
        `${API_URL}/tours/${id}`,
        {
          method: "DELETE",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(
          datos.mensaje ||
            datos.error ||
            "No se pudo eliminar el sitio turístico."
        );
        return;
      }

      setMensaje(
        "Sitio turístico eliminado correctamente."
      );

      cargarTours();
    } catch (error) {
      console.error(error);

      setError("No se pudo conectar con el servidor.");
    }
  };

  // =========================================
  // CARGANDO
  // =========================================

  if (cargando) {
    return (
      <>
        <Navbar />

        <main style={{ paddingTop: "140px" }}>
          <h2 style={{ textAlign: "center" }}>
            Cargando sitios turísticos...
          </h2>
        </main>
      </>
    );
  }

  // =========================================
  // INTERFAZ
  // =========================================

  return (
    <>
      <Navbar />

      <main
        style={{
          paddingTop: "130px",
          paddingBottom: "60px",
        }}
      >
        {/* =====================================
            TÍTULO
        ====================================== */}

        <div className="section-title">
          <h2>Administrar sitios turísticos</h2>

          <p>
            Crea, edita y elimina los sitios turísticos
            disponibles en ExploreTour.
          </p>
        </div>

        {/* =====================================
            MENSAJES
        ====================================== */}

        {mensaje && (
          <p
            style={{
              textAlign: "center",
              color: "green",
              fontWeight: "bold",
            }}
          >
            {mensaje}
          </p>
        )}

        {error && (
          <p
            style={{
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
            }}
          >
            {error}
          </p>
        )}

        {/* =====================================
            FORMULARIO
        ====================================== */}

        <section
          style={{
            maxWidth: "900px",
            margin: "30px auto",
            padding: "30px",
            background: "#f5f5f5",
            borderRadius: "12px",
          }}
        >
          <h3>
            {editando
              ? "Editar sitio turístico"
              : "Crear sitio turístico"}
          </h3>

          <form
            onSubmit={
              editando ? actualizarTour : crearTour
            }
          >
            <label>Título</label>

            <input
              type="text"
              name="titulo"
              value={formulario.titulo}
              onChange={manejarCambio}
              placeholder="Ej: Tour Comuna 13"
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
              }}
            />

            <label>Descripción</label>

            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Descripción del sitio turístico"
              required
              rows="4"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
              }}
            />

            <label>Precio</label>

            <input
              type="number"
              name="precio"
              value={formulario.precio}
              onChange={manejarCambio}
              min="0"
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
              }}
            />

            <label>Duración</label>

            <input
              type="text"
              name="duracion"
              value={formulario.duracion}
              onChange={manejarCambio}
              placeholder="Ej: 4 horas"
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
              }}
            />

            <label>Ubicación</label>

            <input
              type="text"
              name="ubicacion"
              value={formulario.ubicacion}
              onChange={manejarCambio}
              placeholder="Ej: Medellín"
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
              }}
            />

            <label>Imagen</label>

            <input
              type="text"
              name="imagen"
              value={formulario.imagen}
              onChange={manejarCambio}
              placeholder="Ej: comuna13.jpg"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
              }}
            />

            <label>Categoría</label>

            <select
              name="categoria_id"
              value={formulario.categoria_id}
              onChange={manejarCambio}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
              }}
            >
              <option value="">
                Seleccione una categoría
              </option>

              <option value="1">Cultura</option>
              <option value="2">Historia</option>
              <option value="3">Naturaleza</option>
              <option value="4">Aventura</option>
              <option value="5">Gastronomía</option>
              <option value="6">Arte Urbano</option>
            </select>

            <label>ID del guía</label>

            <input
              type="number"
              name="guia_id"
              value={formulario.guia_id}
              onChange={manejarCambio}
              min="1"
              placeholder="Ej: 1"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
              }}
            />

            <label>Cupos disponibles</label>

            <input
              type="number"
              name="cupos"
              value={formulario.cupos}
              onChange={manejarCambio}
              min="0"
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
              }}
            />

            <label>Estado</label>

            <select
              name="estado"
              value={formulario.estado}
              onChange={manejarCambio}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
              }}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>

            <button
              type="submit"
              className="btn-tour"
            >
              {editando
                ? "ACTUALIZAR SITIO"
                : "CREAR SITIO"}
            </button>

            {editando && (
              <button
                type="button"
                className="btn-tour"
                onClick={limpiarFormulario}
                style={{ marginLeft: "10px" }}
              >
                CANCELAR EDICIÓN
              </button>
            )}
          </form>
        </section>

        {/* =====================================
            LISTADO
        ====================================== */}

        <section
          style={{
            maxWidth: "1100px",
            margin: "40px auto",
          }}
        >
          <div className="section-title">
            <h2>Sitios turísticos registrados</h2>

            <p>
              Total de sitios: {tours.length}
            </p>
          </div>

          <div className="tour-container">
            {tours.map((tour) => (
              <div
                className="tour-card"
                key={tour.id}
              >
                <img
                  src={`/img/${tour.imagen}`}
                  alt={tour.titulo}
                />

                <div className="tour-info">
                  <span className="precio">
                    $
                    {Number(
                      tour.precio
                    ).toLocaleString("es-CO")}
                  </span>

                  <h3>{tour.titulo}</h3>

                  <p>{tour.descripcion}</p>

                  <p>
                    <strong>
                      Ubicación:
                    </strong>{" "}
                    {tour.ubicacion}
                  </p>

                  <p>
                    <strong>
                      Duración:
                    </strong>{" "}
                    {tour.duracion}
                  </p>

                  <p>
                    <strong>
                      Cupos:
                    </strong>{" "}
                    {tour.cupos}
                  </p>

                  <p>
                    <strong>
                      Estado:
                    </strong>{" "}
                    {tour.estado}
                  </p>

                  <button
                    className="btn-tour"
                    onClick={() =>
                      comenzarEdicion(tour)
                    }
                  >
                    EDITAR
                  </button>

                  <button
                    className="btn-tour"
                    onClick={() =>
                      eliminarTour(tour.id)
                    }
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    ELIMINAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminTours;