import Navbar from "../components/Navbar";

function Contacto() {
  return (
    <>
      <Navbar />

      <main>
        <section className="contacto" style={{ paddingTop: "140px" }}>

          <div className="section-title">
            <h2>Contáctanos</h2>

            <p>
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
            </p>
          </div>

          <div className="contacto-container">

            {/* INFORMACIÓN */}
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

            {/* FORMULARIO */}
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

                <option>
                  Información sobre tours
                </option>

                <option>
                  Reservas
                </option>

                <option>
                  Guías turísticos
                </option>

                <option>
                  Otro
                </option>
              </select>

              <textarea
                rows="6"
                placeholder="Escribe tu mensaje..."
              ></textarea>

              <button
                className="btn-primary"
                type="submit"
              >
                Enviar mensaje
              </button>

            </form>

          </div>

        </section>
      </main>
    </>
  );
}

export default Contacto;