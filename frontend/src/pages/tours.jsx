import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerTours } from "../services/api";

function Tours() {
  const [tours, setTours] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <>
      <Navbar />

      <main>
        <section
          className="tours"
          style={{ paddingTop: "140px" }}
        >
          <div className="section-title">
            <h2>Tours disponibles</h2>

            <p>
              Descubre nuestras experiencias turísticas en
              Medellín y sus alrededores.
            </p>
          </div>

          {cargando && (
            <p style={{ textAlign: "center" }}>
              Cargando tours...
            </p>
          )}

          {error && (
            <p style={{ textAlign: "center", color: "red" }}>
              {error}
            </p>
          )}

          {!cargando && !error && (
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
                      ${tour.precio.toLocaleString("es-CO")}
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

                    <a
                      href="#"
                      className="btn-tour"
                    >
                      Ver tour
                    </a>

                  </div>
                </div>
              ))}

            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Tours;