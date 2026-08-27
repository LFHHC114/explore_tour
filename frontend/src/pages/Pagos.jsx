import { useEffect, useState } from "react";

function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [reservaId, setReservaId] = useState("");
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [mensaje, setMensaje] = useState("");

  const cargarPagos = async () => {
    try {
      const respuesta = await fetch(
        "http://127.0.0.1:5000/pagos"
      );

      if (!respuesta.ok) {
        throw new Error("Error al consultar los pagos");
      }

      const datos = await respuesta.json();
      setPagos(datos);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los pagos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPagos();
  }, []);

  const realizarPago = async (e) => {
    e.preventDefault();

    setMensaje("");

    try {
      const respuesta = await fetch(
        "http://127.0.0.1:5000/pagos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reserva_id: Number(reservaId),
            monto: Number(monto),
            metodo_pago: metodoPago,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(
          datos.mensaje ||
            datos.error ||
            "No se pudo registrar el pago."
        );
        return;
      }

      setMensaje("¡Pago registrado correctamente!");

      setReservaId("");
      setMonto("");
      setMetodoPago("tarjeta");

      cargarPagos();

    } catch (error) {
      console.error(error);
      setMensaje(
        "No se pudo conectar con el servidor."
      );
    }
  };

  if (cargando) {
    return <h2>Cargando pagos...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>

      <h1>Pagos de ExploreTour</h1>

      {/* FORMULARIO DE PAGO */}

      <section style={{ marginBottom: "40px" }}>

        <h2>Realizar pago</h2>

        <form
          onSubmit={realizarPago}
          style={{
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >

          <label>
            ID de la reserva
          </label>

          <input
            type="number"
            min="1"
            value={reservaId}
            onChange={(e) =>
              setReservaId(e.target.value)
            }
            placeholder="Ejemplo: 4"
            required
          />

          <label>
            Monto
          </label>

          <input
            type="number"
            min="1"
            value={monto}
            onChange={(e) =>
              setMonto(e.target.value)
            }
            placeholder="Ejemplo: 100000"
            required
          />

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

          {mensaje && (
            <p style={{ marginTop: "15px" }}>
              {mensaje}
            </p>
          )}

        </form>

      </section>

      {/* PAGOS REGISTRADOS */}

      <section>

        <h2>Pagos registrados</h2>

        {pagos.length === 0 ? (
          <p>
            No hay pagos registrados.
          </p>
        ) : (
          pagos.map((pago) => (
            <div
              key={pago.id}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >

              <h3>
                Pago #{pago.id}
              </h3>

              <p>
                <strong>
                  Reserva:
                </strong>{" "}
                {pago.reserva_id}
              </p>

              <p>
                <strong>
                  Monto:
                </strong>{" "}
                $
                {Number(
                  pago.monto
                ).toLocaleString("es-CO")}
              </p>

              <p>
                <strong>
                  Método:
                </strong>{" "}
                {pago.metodo_pago}
              </p>

              <p>
                <strong>
                  Estado:
                </strong>{" "}
                {pago.estado}
              </p>

              <p>
                <strong>
                  Fecha:
                </strong>{" "}
                {pago.fecha_pago || "Pendiente"}
              </p>

            </div>
          ))
        )}

      </section>

    </div>
  );
}

export default Pagos;