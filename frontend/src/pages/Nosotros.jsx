import Navbar from "../components/Navbar";

function Nosotros() {
return (
    <>
    <Navbar />

    <main>
        <section className="nosotros" style={{ paddingTop: "140px" }}>
        <div className="nosotros-container">

            <div className="nosotros-img">
            <img
                src="/img/nosotros.jpg"
                alt="ExploreTour Medellín"
            />
            </div>

            <div className="nosotros-content">

            <span>CONOCE EXPLORETOUR</span>

            <h2>
                Descubre Medellín como nunca antes
            </h2>

            <p>
                ExploreTour es una plataforma turística creada para
                conectar viajeros con experiencias auténticas en
                Medellín y sus alrededores.
            </p>

            <p>
                Nuestro objetivo es facilitar la búsqueda y reserva
                de tours mientras apoyamos el trabajo de guías
                turísticos locales.
            </p>

            <div className="nosotros-datos">

                <div className="dato">
                <h3>6+</h3>
                <p>Tours disponibles</p>
                </div>

                <div className="dato">
                <h3>100+</h3>
                <p>Viajeros</p>
                </div>

                <div className="dato">
                <h3>1</h3>
                <p>Guía profesional</p>
                </div>

            </div>

            </div>

        </div>
        </section>
    </main>
    </>
);
}

export default Nosotros;