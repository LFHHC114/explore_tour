import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerTours } from "../services/api";

function Tours() {
  const [tours, setTours] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [tourSeleccionado, setTourSeleccionado] = useState(null);
  const [fechaReserva, setFechaReserva] = useState("");
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [mensajeReserva, setMensajeReserva] = useState("");

  // Datos de la reserva creada
  const [reservaCreada, setReservaCreada] = useState(null);

  // Mostrar formulario de pago
  const [mostrarPago, setMostrarPago] = useState(false);

  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [mensajePago, setMensajePago] = useState("");

  useEffect(() => {
    obtenerTours()
      .then((datos) => {
        setTours(datos);
      })
      .catch((error) => {
        console.error(error);
        setError("No se pudieron cargar los tours.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  // ================================
  // RESERVA
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
        "http://127.0.0.1:5000/reservas",
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

      // Guardamos la reserva creada
      setReservaCreada(datos.reserva);

      setMensajeReserva(
        "¡Reserva realizada correctamente!"
      );

      // Actualizar cupos
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
      console.error(error);

      setMensajeReserva(
        "No se pudo conectar con el servidor."
      );
    }
  };

  // ================================
  // PAGO
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
      "http://127.0.0.1:5000/pagos",
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
      console.error(error);

      setMensajePago(
        "No se pudo conectar con el servidor."
      );
    }
  };

  if (cargando) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Cargando tours...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 style={{ textAlign: "center", color: "red" }}>
        {error}
      </h2>
    );
  }

  return (
    <>
      <Navbar />

      <main>

        {/* ================================
            TOURS
        ================================= */}

        <section
          className="tours"
          style={{ paddingTop: "140px" }}
        >

          <div className="section-title">

            <h2>Tours disponibles</h2>

            <p>
              Descubre nuestras experiencias
              turísticas en Medellín y sus
              alrededores.
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
                    {tour.precio.toLocaleString("es-CO")}
                  </span>

                  <h3>{tour.titulo}</h3>

                  <p>{tour.descripcion}</p>

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
                      setMostrarPago(false);
                    }}
                  >
                    Reservar
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* ================================
            RESERVA
        ================================= */}

        {tourSeleccionado && (

          <section
            className="contacto"
            style={{ paddingTop: "40px" }}
          >

            <div className="section-title">

              <h2>Reservar tour</h2>

              <p>
                Estás reservando:{" "}
                <strong>
                  {tourSeleccionado.titulo}
                </strong>
              </p>

            </div>

            <div
              className="contacto-container"
              style={{ justifyContent: "center" }}
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
                    setCantidadPersonas(e.target.value)
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
                    setMostrarPago(false);
                  }}
                >
                  Cancelar
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

              <h2>💳 Pago de reserva</h2>

              <p>
                Reserva #{reservaCreada.id}
              </p>

            </div>

            <div
              className="contacto-container"
              style={{ justifyContent: "center" }}
            >

              <form
                className="contact-form"
                onSubmit={realizarPago}
              >

                <p>
                  <strong>Tour:</strong>{" "}
                  {tourSeleccionado.titulo}
                </p>

                <p>
                  <strong>Personas:</strong>{" "}
                  {reservaCreada.cantidad_personas}
                </p>

                <p>
                  <strong>Total:</strong>{" "}
                  $
                  {(
                    Number(tourSeleccionado.precio) *
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