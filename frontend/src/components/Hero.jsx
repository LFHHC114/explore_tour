import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <h1>
          Descubre Medellín
        </h1>

        <p>
          Vive experiencias únicas, conoce lugares increíbles
          y descubre la magia de Medellín con ExploreTour.
        </p>

        <div className="hero-buttons">

          <Link to="/tours" className="btn-primary">
            Explorar tours
          </Link>

          <Link to="/nosotros" className="btn-secondary">
            Conoce ExploreTour
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Hero;