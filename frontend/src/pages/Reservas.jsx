import { useEffect, useState } from "react";

function Reservas() {
const [reservas, setReservas] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    cargarReservas();
}, []);

const cargarReservas = async () => {
    try {
    const respuesta = await fetch("http://127.0.0.1:5000/reservas");

    if (!respuesta.ok) {
        throw new Error("Error al consultar las reservas");
    }

    const datos = await respuesta.json();
    setReservas(datos);
    } catch (error) {
    console.error(error);
    setError("No se pudieron cargar las reservas");
    } finally {
    setCargando(false);
    }
};

if (cargando) {
    return <h2>Cargando reservas...</h2>;
}

if (error) {
    return <h2>{error}</h2>;
}

return (
    <div>
    <h1>Reservas de ExploreTour</h1>

    {reservas.length === 0 ? (
        <p>No hay reservas registradas.</p>
    ) : (
        reservas.map((reserva) => (
        <div key={reserva.id}>
            <h2>Reserva #{reserva.id}</h2>

            <p>
            <strong>Usuario:</strong> {reserva.usuario_id}
            </p>

            <p>
            <strong>Tour:</strong> {reserva.tour_id}
            </p>

            <p>
            <strong>Fecha:</strong> {reserva.fecha_reserva}
            </p>

            <p>
            <strong>Personas:</strong> {reserva.cantidad_personas}
            </p>

            <p>
            <strong>Estado:</strong> {reserva.estado}
            </p>

            <hr />
        </div>
        ))
    )}
    </div>
);
}

export default Reservas;