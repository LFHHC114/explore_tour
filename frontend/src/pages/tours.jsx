```jsx
import Navbar from "../components/Navbar";

function Tours() {
  const tours = [
    {
      id: 1,
      titulo: "Tour Comuna 13",
      descripcion:
        "Recorrido por el arte urbano, historia y cultura de la Comuna 13.",
      precio: 120000,
      duracion: "4 horas",
      ubicacion: "Medellín",
      cupos: 8,
      imagen: "/img/comuna13.jpg",
    },
    {
      id: 2,
      titulo: "Tour Guatapé",
      descripcion:
        "Visita Guatapé, disfruta del paisaje y conoce la Piedra del Peñol.",
      precio: 150000,
      duracion: "8 horas",
      ubicacion: "Guatapé",
      cupos: 10,
      imagen: "/img/guatape.jpg",
    },
    {
      id: 3,
      titulo: "City Tour Medellín",
      descripcion:
        "Recorrido por los principales lugares turísticos de Medellín.",
      precio: 100000,
      duracion: "5 horas",
      ubicacion: "Medellín",
      cupos: 10,
      imagen: "/img/citytour.jpg",
    },
    {
      id: 4,
      titulo: "Tour Pueblito Paisa",
      descripcion:
        "Conoce uno de los lugares turísticos más representativos de Medellín.",
      precio: 80000,
      duracion: "3 horas",
      ubicacion: "Medellín",
      cupos: 10,
      imagen: "/img/pueblitopaisa.jpg",
    },
    {
      id: 5,
      titulo: "Tour de Café",
      descripcion:
        "Experiencia para conocer la cultura y tradición cafetera.",
      precio: 130000,
      duracion: "4 horas",
      ubicacion: "Medellín",
      cupos: 10,
      imagen: "/img/cafe.jpg",
    },
    {
      id: 6,
      titulo: "Tour de Historia de Medellín",
      descripcion:
        "Recorrido por lugares históricos y representativos de Medellín.",
      precio: 110000,
      duracion: "4 horas",
      ubicacion: "Medellín",
      cupos: 10,
      imagen: "/img/pabloescobar.jpg",
    },
  ];

  return (
    <>
      <Navbar />

      <main>
        <section className="tours" style={{ paddingTop: "140px" }}>
          <div className="section-title">
            <h2>Tours disponibles</h2>
            <p>
              Descubre nuestras experiencias turísticas en Medellín y sus
              alrededores.
            </p>
          </div>

          <div className="tour-container">
            {tours.map((tour) => (
              <div className="tour-card" key={tour.id}>
                <img src={tour.imagen} alt={tour.titulo} />

                <div className="tour-info">
                  <span className="precio">
                    ${tour.precio.toLocaleString("es-CO")}
                  </span>

                  <h3>{tour.titulo}</h3>

                  <p>{tour.descripcion}</p>

                  <div className="tour-details">
                    <span>
                      <i className="fas fa-clock"></i> {tour.duracion}
                    </span>

                    <span>
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {tour.ubicacion}
                    </span>
                  </div>

                  <p>
                    <strong>Cupos disponibles:</strong> {tour.cupos}
                  </p>

                  <a href="#" className="btn-tour">
                    Ver tour
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Tours;
```
