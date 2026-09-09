import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = "http://127.0.0.1:5000";

function Tours() {
  const [tours, setTours] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // BÚSQUEDA Y FILTROS
  // ================================

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [ubicacionFiltro, setUbicacionFiltro] = useState("");

  // ================================
  // RESERVA
  // ================================

  const [tourSeleccionado, setTourSeleccionado] = useState(null);
  const [fechaReserva, setFechaReserva] = useState("");
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [mensajeReserva, setMensajeReserva] = useState("");
  const [reservaCreada, setReservaCreada] = useState(null);

  // ================================
  // PAGO
  // ================================

  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [mensajePago, setMensajePago] = useState("");

  // ================================
  // CARGAR TOURS
  // ================================

  useEffect(() => {
    cargarTours();
  }, []);

  const cargarTours = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(`${API_URL}/tours`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los tours");
      }

      const datos = await respuesta.json();

      setTours(datos);
    } catch (error) {
      console.error("Error al cargar tours:", error);
      setError("No se pudieron cargar los tours.");
    } finally {
      setCargando(false);
    }
  };

  // ================================
  // FILTRAR TOURS
  // ================================

  const toursFiltrados = tours.filter((tour) => {
    const coincideNombre = (tour.titulo || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaFiltro === "" ||
      String(tour.categoria_id) === String(categoriaFiltro);

    const coincideUbicacion =
      ubicacionFiltro === "" ||
      (tour.ubicacion || "")
        .toLowerCase()
        .includes(ubicacionFiltro.toLowerCase());

    return (
      coincideNombre &&
      coincideCategoria &&
      coincideUbicacion
    );
  });

  // ================================
  // LIMPIAR FILTROS
  // ================================

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaFiltro("");
    setUbicacionFiltro("");
  };

  // ================================
  // REALIZAR RESERVA
  // ================================

  const realizarReserva = async (e) => {
    e.preventDefault();

    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      setMensajeReserva(
        "Debes iniciar sesión para realizar una reserva."
      );
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    try {
      const respuesta = await fetch(
        `${API_URL}/reservas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario_id: usuario.id,
            tour_id: tourSeleccionado.id,
            fecha_reserva: fechaReserva,
            cantidad_personas: Number(cantidadPersonas),
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensajeReserva(
          datos.error ||
            datos.mensaje ||
            "No se pudo realizar la reserva."
        );
        return;
      }

      setReservaCreada(datos.reserva);

      setMensajeReserva(
        "¡Reserva realizada correctamente!"
      );

      setTours((toursActuales) =>
        toursActuales.map((tour) =>
          tour.id === tourSeleccionado.id
            ? {
                ...tour,
                cupos:
                  tour.cupos -
                  Number(cantidadPersonas),
              }
            : tour
        )
      );

      setFechaReserva("");
      setCantidadPersonas(1);

    } catch (error) {
      console.error("Error en reserva:", error);

      setMensajeReserva(
        "No se pudo conectar con el servidor."
      );
    }
  };

  // ================================
  // REALIZAR PAGO
  // ================================

  const realizarPago = async (e) => {
    e.preventDefault();

    if (!reservaCreada) {
      setMensajePago(
        "No existe una reserva para pagar."
      );
      return;
    }

    const monto =
      Number(tourSeleccionado.precio) *
      Number(reservaCreada.cantidad_personas);

    try {
      const respuesta = await fetch(
        `${API_URL}/pagos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reserva_id: reservaCreada.id,
            monto: monto,
            metodo_pago: metodoPago,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensajePago(
          datos.mensaje ||
            datos.error ||
            "No se pudo registrar el pago."
        );
        return;
      }

      setMensajePago(
        "¡Pago realizado correctamente!"
      );

    } catch (error) {
      console.error("Error en pago:", error);

      setMensajePago(
        "No se pudo conectar con el servidor."
      );
    }
  };

  // ================================
  // CARGANDO
  // ================================

  if (cargando) {
    return (
      <>
        <Navbar />

        <main
          style={{
            paddingTop: "140px",
            textAlign: "center",
          }}
        >
          <h2>Cargando tours...</h2>
        </main>
      </>
    );
  }

  // ================================
  // ERROR
  // ================================

  if (error) {
    return (
      <>
        <Navbar />

        <main
          style={{
            paddingTop: "140px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "red",
            }}
          >
            {error}
          </h2>
        </main>
      </>
    );
  }

  // ================================
  // INTERFAZ
  // ================================

  return (
    <>
      <Navbar />

      <main>

        {/* ================================
            CATÁLOGO
        ================================= */}

        <section
          className="tours"
          style={{
            paddingTop: "140px",
          }}
        >

          <div className="section-title">

            <h2>Tours disponibles</h2>

            <p>
              Descubre nuestras experiencias
              turísticas en Medellín y sus
              alrededores.
            </p>

          </div>

          {/* ================================
              BÚSQUEDA Y FILTROS
          ================================= */}

          <section
            style={{
              maxWidth: "1100px",
              margin: "0 auto 40px auto",
              padding: "25px",
              background: "#f5f5f5",
              borderRadius: "12px",
            }}
          >

            <h3>
              Buscar y filtrar tours
            </h3>

            {/* BUSCAR POR NOMBRE */}

            <input
              type="text"
              placeholder="Buscar por nombre del sitio..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
              }}
            />

            {/* CATEGORÍA */}

            <select
              value={categoriaFiltro}
              onChange={(e) =>
                setCategoriaFiltro(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
              }}
            >

              <option value="">
                Todas las categorías
              </option>

              <option value="1">
                Cultura
              </option>

              <option value="2">
                Historia
              </option>

              <option value="3">
                Naturaleza
              </option>

              <option value="4">
                Aventura
              </option>

              <option value="5">
                Gastronomía
              </option>

              <option value="6">
                Arte Urbano
              </option>

            </select>

            {/* UBICACIÓN */}

            <select
              value={ubicacionFiltro}
              onChange={(e) =>
                setUbicacionFiltro(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
              }}
            >

              <option value="">
                Todas las ubicaciones
              </option>

              <option value="Medellín">
                Medellín
              </option>

              <option value="Guatapé">
                Guatapé
              </option>

            </select>

            {/* LIMPIAR */}

            <button
              type="button"
              className="btn-tour"
              onClick={limpiarFiltros}
            >
              LIMPIAR FILTROS
            </button>

            <p style={{ marginTop: "15px" }}>
              <strong>
                Tours encontrados:
              </strong>{" "}
              {toursFiltrados.length}
            </p>

          </section>

          {/* ================================
              LISTADO DE TOURS
          ================================= */}

          <div className="tour-container">

            {toursFiltrados.length === 0 ? (

              <p
                style={{
                  textAlign: "center",
                  width: "100%",
                }}
              >
                No se encontraron tours con los
                filtros seleccionados.
              </p>

            ) : (

              toursFiltrados.map((tour) => (

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

                    <h3>
                      {tour.titulo}
                    </h3>

                    <p>
                      {tour.descripcion}
                    </p>

                    <div className="tour-details">

                      <span>
                        <i className="fas fa-clock"></i>{" "}
                        {tour.duracion}
                      </span>

                      <span>
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        {tour.ubicacion}
                      </span>

                    </div>

                    <p>
                      <strong>
                        Cupos disponibles:
                      </strong>{" "}
                      {tour.cupos}
                    </p>

                    <button
                      className="btn-tour"
                      onClick={() => {
                        setTourSeleccionado(tour);
                        setMensajeReserva("");
                        setMensajePago("");
                        setReservaCreada(null);
                      }}
                    >
                      Reservar
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>

        {/* ================================
            RESERVA
        ================================= */}

        {tourSeleccionado && (

          <section
            className="contacto"
            style={{
              paddingTop: "40px",
            }}
          >

            <div className="section-title">

              <h2>
                Reservar tour
              </h2>

              <p>
                Estás reservando:{" "}
                <strong>
                  {tourSeleccionado.titulo}
                </strong>
              </p>

            </div>

            <div
              className="contacto-container"
              style={{
                justifyContent: "center",
              }}
            >

              <form
                className="contact-form"
                onSubmit={realizarReserva}
              >

                <label>
                  Fecha de la reserva
                </label>

                <input
                  type="date"
                  value={fechaReserva}
                  onChange={(e) =>
                    setFechaReserva(e.target.value)
                  }
                  required
                />

                <label>
                  Cantidad de personas
                </label>

                <input
                  type="number"
                  min="1"
                  max={tourSeleccionado.cupos}
                  value={cantidadPersonas}
                  onChange={(e) =>
                    setCantidadPersonas(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="submit"
                  className="btn-tour"
                >
                  RESERVAR AHORA
                </button>

                <button
                  type="button"
                  className="btn-tour"
                  onClick={() => {
                    setTourSeleccionado(null);
                    setReservaCreada(null);
                  }}
                >
                  CANCELAR
                </button>

                {mensajeReserva && (

                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "15px",
                    }}
                  >
                    {mensajeReserva}
                  </p>

                )}

              </form>

            </div>

          </section>

        )}

        {/* ================================
            PAGO
        ================================= */}

        {reservaCreada && (

          <section
            className="contacto"
            style={{
              paddingTop: "40px",
              paddingBottom: "60px",
            }}
          >

            <div className="section-title">

              <h2>
                💳 Pago de reserva
              </h2>

              <p>
                Reserva #{reservaCreada.id}
              </p>

            </div>

            <div
              className="contacto-container"
              style={{
                justifyContent: "center",
              }}
            >

              <form
                className="contact-form"
                onSubmit={realizarPago}
              >

                <p>
                  <strong>
                    Tour:
                  </strong>{" "}
                  {tourSeleccionado.titulo}
                </p>

                <p>
                  <strong>
                    Personas:
                  </strong>{" "}
                  {reservaCreada.cantidad_personas}
                </p>

                <p>
                  <strong>
                    Total:
                  </strong>{" "}
                  $
                  {(
                    Number(
                      tourSeleccionado.precio
                    ) *
                    Number(
                      reservaCreada.cantidad_personas
                    )
                  ).toLocaleString("es-CO")}
                </p>

                <label>
                  Método de pago
                </label>

                <select
                  value={metodoPago}
                  onChange={(e) =>
                    setMetodoPago(e.target.value)
                  }
                >

                  <option value="tarjeta">
                    Tarjeta
                  </option>

                  <option value="efectivo">
                    Efectivo
                  </option>

                  <option value="transferencia">
                    Transferencia
                  </option>

                </select>

                <button
                  type="submit"
                  className="btn-tour"
                >
                  REALIZAR PAGO
                </button>

                {mensajePago && (

                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "15px",
                    }}
                  >
                    {mensajePago}
                  </p>

                )}

              </form>

            </div>

          </section>

        )}

      </main>
    </>
  );
}

export default Tours;