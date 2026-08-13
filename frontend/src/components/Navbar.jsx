import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header>
      <div className="navbar">

        {/* LOGO */}
        <Link to="/" className="logo">
          <h2>
            Explore<span>Tour</span>
          </h2>
        </Link>

        {/* MENÚ */}
        <nav>
          <ul className="menu">
            <li>
              <Link to="/">Inicio</Link>
            </li>

            <li>
              <Link to="/tours">Tours</Link>
            </li>

            <li>
              <Link to="/nosotros">Nosotros</Link>
            </li>

            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;