import Navbar from "../components/Navbar";

function Contacto() {
  return (
    <>
      <Navbar />

      <main style={{ paddingTop: "120px" }}>
        <section className="contacto">
          <div className="section-title">
            <h2>Contáctanos</h2>

            <p>
              Estamos aquí para ayudarte a planear tu próxima experiencia.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Contacto;