import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        {/* ESTADÍSTICAS */}
        <section className="stats">
          <div className="stat">
            <i className="fas fa-map-marked-alt"></i>
            <h2>6+</h2>
            <p>Destinos turísticos</p>
          </div>

          <div className="stat">
            <i className="fas fa-route"></i>
            <h2>6</h2>
            <p>Tours disponibles</p>
          </div>

          <div className="stat">
            <i className="fas fa-users"></i>
            <h2>100+</h2>
            <p>Viajeros felices</p>
          </div>

          <div className="stat">
            <i className="fas fa-star"></i>
            <h2>5.0</h2>
            <p>Experiencia turística</p>
          </div>
        </section>

        {/* TOURS */}
        <section className="tours">
          <div className="section-title">
            <h2>Explora nuestros tours</h2>
            <p>
              Descubre los lugares más increíbles de Medellín y sus
              alrededores.
            </p>
          </div>

          <div className="tour-container">

            <div className="tour-card">
              <img src="/img/comuna13.jpg" alt="Comuna 13" />

              <div className="tour-info">
                <span className="precio">$120.000</span>

                <h3>Tour Comuna 13</h3>

                <p>
                  Recorrido por el arte urbano, historia y cultura
                  de la Comuna 13.
                </p>

                <div className="tour-details">
                  <span>
                    <i className="fas fa-clock"></i> 4 horas
                  </span>

                  <span>
                    <i className="fas fa-map-marker-alt"></i> Medellín
                  </span>
                </div>

                <a href="#" className="btn-tour">
                  Ver tour
                </a>
              </div>
            </div>

            <div className="tour-card">
              <img src="/img/guatape.jpg" alt="Guatapé" />

              <div className="tour-info">
                <span className="precio">$150.000</span>

                <h3>Tour Guatapé</h3>

                <p>
                  Visita Guatapé, disfruta del paisaje y conoce
                  la Piedra del Peñol.
                </p>

                <div className="tour-details">
                  <span>
                    <i className="fas fa-clock"></i> 8 horas
                  </span>

                  <span>
                    <i className="fas fa-map-marker-alt"></i> Guatapé
                  </span>
                </div>

                <a href="#" className="btn-tour">
                  Ver tour
                </a>
              </div>
            </div>

            <div className="tour-card">
              <img src="/img/citytour.jpg" alt="City Tour Medellín" />

              <div className="tour-info">
                <span className="precio">$100.000</span>

                <h3>City Tour Medellín</h3>

                <p>
                  Recorrido por los principales lugares turísticos
                  de Medellín.
                </p>

                <div className="tour-details">
                  <span>
                    <i className="fas fa-clock"></i> 5 horas
                  </span>

                  <span>
                    <i className="fas fa-map-marker-alt"></i> Medellín
                  </span>
                </div>

                <a href="#" className="btn-tour">
                  Ver tour
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="beneficios">

          <div className="section-title">
            <h2>¿Por qué elegir ExploreTour?</h2>
            <p>
              Queremos que disfrutes Medellín de una manera segura,
              cómoda y auténtica.
            </p>
          </div>

          <div className="beneficios-container">

            <div className="beneficio-card">
              <i className="fas fa-user-tie"></i>
              <h3>Guías profesionales</h3>
              <p>
                Conoce Medellín acompañado por guías con experiencia
                y conocimiento de la ciudad.
              </p>
            </div>

            <div className="beneficio-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Turismo seguro</h3>
              <p>
                Disfruta tus experiencias turísticas con tranquilidad
                y confianza.
              </p>
            </div>

            <div className="beneficio-card">
              <i className="fas fa-heart"></i>
              <h3>Experiencias únicas</h3>
              <p>
                Descubre lugares y experiencias que harán especial
                tu visita a Medellín.
              </p>
            </div>

            <div className="beneficio-card">
              <i className="fas fa-calendar-check"></i>
              <h3>Reserva fácil</h3>
              <p>
                Encuentra tu tour y realiza tu reserva de manera
                rápida y sencilla.
              </p>
            </div>

          </div>
        </section>

        {/* NOSOTROS */}
        <section className="nosotros">

          <div className="nosotros-container">

            <div className="nosotros-img">
              <img src="/img/comuna13.jpg" alt="ExploreTour Medellín" />
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
                  <p>Tours</p>
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

              <a href="/nosotros" className="btn-primary">
                Conocer más
              </a>

            </div>

          </div>

        </section>

        {/* CONTACTO */}
        <section className="contacto">

          <div className="section-title">
            <h2>Contáctanos</h2>
            <p>
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
            </p>
          </div>

          <div className="contacto-container">

            <div className="contacto-info">

              <h3>Hablemos</h3>

              <p>
                Comunícate con nosotros para conocer más sobre
                nuestros tours y experiencias.
              </p>

              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Medellín, Colombia</span>
              </div>

              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <span>info@exploretour.com</span>
              </div>

              <div className="info-item">
                <i className="fas fa-phone"></i>
                <span>+57 300 000 0000</span>
              </div>

            </div>

            <form className="contact-form">

              <input
                type="text"
                placeholder="Nombre"
              />

              <input
                type="email"
                placeholder="Correo electrónico"
              />

              <select defaultValue="">
                <option value="" disabled>
                  Selecciona un asunto
                </option>

                <option>Información sobre tours</option>
                <option>Reservas</option>
                <option>Guías turísticos</option>
                <option>Otro</option>
              </select>

              <textarea
                rows="6"
                placeholder="Escribe tu mensaje..."
              ></textarea>

              <button className="btn-primary" type="submit">
                Enviar mensaje
              </button>

            </form>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-container">

          <div className="footer-box">

            <h2>
              Explore<span>Tour</span>
            </h2>

            <p>
              Descubre Medellín, vive nuevas experiencias y conoce
              los lugares más increíbles de Colombia.
            </p>

          </div>

          <div className="footer-box">

            <h3>Enlaces</h3>

            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/tours">Tours</a></li>
              <li><a href="/nosotros">Nosotros</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>

          </div>

          <div className="footer-box">

            <h3>Contacto</h3>

            <p>Medellín, Colombia</p>
            <p>info@exploretour.com</p>
            <p>+57 300 000 0000</p>

          </div>

          <div className="footer-box">

            <h3>Síguenos</h3>

            <div className="sociales">

              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>

              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>

              <a href="#">
                <i className="fab fa-tiktok"></i>
              </a>

            </div>

          </div>

        </div>

        <div className="footer-copy">
          <p>
            © 2026 ExploreTour. Todos los derechos reservados.
          </p>
        </div>

      </footer>
    </>
  );
}

export default Home;