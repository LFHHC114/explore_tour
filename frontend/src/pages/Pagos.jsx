import { useEffect, useState } from "react";

function Pagos() {
const [pagos, setPagos] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    fetch("http://127.0.0.1:5000/pagos")
    .then((respuesta) => {
        if (!respuesta.ok) {
        throw new Error("Error al consultar los pagos");
        }

        return respuesta.json();
    })
    .then((datos) => {
        setPagos(datos);
    })
    .catch((error) => {
        console.error(error);
        setError("No se pudieron cargar los pagos");
    })
    .finally(() => {
        setCargando(false);
    });
}, []);

if (cargando) {
    return <h2>Cargando pagos...</h2>;
}

if (error) {
    return <h2>{error}</h2>;
}

return (
    <div>
    <h1>Pagos de ExploreTour</h1>

    {pagos.length === 0 ? (
        <p>No hay pagos registrados.</p>
    ) : (
        pagos.map((pago) => (
        <div key={pago.id}>
            <h2>Pago #{pago.id}</h2>

            <p>
            <strong>Reserva:</strong> {pago.reserva_id}
            </p>

            <p>
            <strong>Monto:</strong>{" "}
            ${Number(pago.monto).toLocaleString("es-CO")}
            </p>

            <p>
            <strong>Método:</strong> {pago.metodo_pago}
            </p>

            <p>
            <strong>Estado:</strong> {pago.estado}
            </p>

            <p>
            <strong>Fecha:</strong>{" "}
            {pago.fecha_pago || "Pendiente"}
            </p>

            <hr />
        </div>
        ))
    )}
    </div>
);
}

export default Pagos;