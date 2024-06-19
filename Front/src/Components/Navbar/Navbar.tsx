import Styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../Redux/Hooks";
import { useNavigate } from "react-router-dom";
import { resetPagination } from "../../Redux/Slice/PaginationSlice";

export default function NavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<Boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      console.log(width);
      if (width <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }

      console.log("ismobile", isMobile);
    };

    checkIsMobile();

    const handleResize = () => {
      checkIsMobile();
      setIsMobileMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleProductsClick = () => {
    dispatch(resetPagination());
    navigate("/products");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav>
      {isMobile ? (
        <div>
          <div className={Styles.mobileNav}>
            <img
              className={Styles.MenuIcon}
              src="/assets/icons/menu-icon.svg"
              alt="Menu icon"
              onClick={toggleMobileMenu}
            />
            <h1>Menu</h1>
            <img
              src="/assets/icons/vsaLOGO.jpg"
              alt="logo"
              className={Styles.MobileLogo}
            />
          </div>
          {isMobileMenuOpen && (
            <div className={Styles.mobileMenu}>
              <ul>
                <li onClick={() => navigate("/")}>Inicio</li>
                <li onClick={() => navigate("/HySLaboral")}>
                  Higiene y Seguridad laboral
                </li>
                <li onClick={() => navigate("/HySIndustrial")}>
                  Higiene y Seguridad industrial
                </li>
                <li onClick={() => navigate("/HySAmbiental")}>
                  Higiene y Seguridad ambiental
                </li>
                <li onClick={() => navigate("/ControlPlagas")}>
                  Control de Plagas
                </li>
                <li onClick={() => navigate("/Portfolio")}>
                  Portfolio
                </li>
                <li onClick={() => navigate("/SeguridadIncendios")}>
                  Seguridad contra incendios
                </li>
                <li onClick={handleProductsClick}>Productos</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className={Styles.divMayor}>
          <div className={Styles.divImg}>
            <img alt="Logo" src="/assets/icons/vsaLOGO.jpg" />
          </div>
          <div className={Styles.buttonContainer}>
            <button
              className={Styles.defaultButton}
              onClick={() => navigate("/")}
            >
              {" "}
              Inicio
            </button>
            <button
              className={Styles.defaultButton}
              onClick={() => navigate("/HySLaboral")}
            >
              {" "}
              Higiene y Seguridad laboral
            </button>
            <button
              className={Styles.defaultButton}
              onClick={() => navigate("/HySIndustrial")}
            >
              {" "}
              Higiene y Seguridad industrial
            </button>
            <button
              className={Styles.defaultButton}
              onClick={() => navigate("/HySAmbiental")}
            >
              {" "}
              Higiene y Seguridad ambiental
            </button>
            <button
              className={Styles.defaultButton}
              onClick={() => navigate("/ControlPlagas")}
            >
              {" "}
              Control de Plagas
            </button>
            <button
              className={Styles.defaultButton}
              onClick={() => navigate("/SeguridadIncendios")}
            >
              {" "}
              Seguridad contra incendios
            </button>
            <button 
              className={Styles.defaultButton}
              onClick={() => navigate("/Portfolio")}
            >
              {" "}
              Portfolio
            </button>
            <button
              className={Styles.defaultButton}
              onClick={handleProductsClick}
            >
              {" "}
              Productos{" "}
            </button>
          </div>
        </div>
      )}
    </nav>
    /*{isMobile ? (
        <div>
          <img src="/assets/icons/menu-icon.svg" alt="Menu" onClick={toggleMobileMenu} />
          {isMobileMenuOpen && (
            <div className={Styles.mobileMenu}>
              <button onClick={() => navigate("/")}>Inicio</button>
              <button onClick={() => navigate("/HySLaboral")}>Higiene y Seguridad laboral</button>
              <button onClick={() => navigate("/HySIndustrial")}>Higiene y Seguridad industrial</button>
              <button onClick={() => navigate("/HySAmbiental")}>Higiene y Seguridad ambiental</button>
              <button onClick={() => navigate("/ControlPlagas")}>Control de Plagas</button>
              <button onClick={() => navigate("/SeguridadIncendios")}>Seguridad contra incendios</button>
              <button onClick={handleProductsClick}>Productos</button>
            </div>
          )}
          </div>
      ):(
        <nav className={Styles.divMayor}>
      <div className={Styles.divImg}>
        <img alt="Logo" src="/assets/icons/vsaLOGO.jpg" />
      </div>
      <div className={Styles.buttonContainer}>
        <button className={Styles.defaultButton} onClick={() => navigate("/")}>
          {" "}
          Inicio
        </button>
        <button
          className={Styles.defaultButton}
          onClick={() => navigate("/HySLaboral")}
        >
          {" "}
          Higiene y Seguridad laboral
        </button>
        <button
          className={Styles.defaultButton}
          onClick={() => navigate("/HySIndustrial")}
        >
          {" "}
          Higiene y Seguridad industrial
        </button>
        <button
          className={Styles.defaultButton}
          onClick={() => navigate("/HySAmbiental")}
        >
          {" "}
          Higiene y Seguridad ambiental
        </button>
        <button
          className={Styles.defaultButton}
          onClick={() => navigate("/ControlPlagas")}
        >
          {" "}
          Control de Plagas
        </button>
        <button
          className={Styles.defaultButton}
          onClick={() => navigate("/SeguridadIncendios")}
        >
          {" "}
          Seguridad contra incendios
        </button>
        <button className={Styles.defaultButton} onClick={handleProductsClick}>
          {" "}
          Productos{" "}
        </button>
      </div>
      </nav>
      )}
    */
  );
}
