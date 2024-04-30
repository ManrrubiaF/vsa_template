import Styles from "./Navbar.module.css";
import  { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { useNavigate } from "react-router-dom";
import { resetPagination } from "../../Redux/Slice/PaginationSlice";
import { setIsLogged } from "../../Redux/Slice/UserMenu";

export default function NavBar() {
  const isLogged = useAppSelector((state) => state.userMenu.islogged);
  const token: string | null = sessionStorage.getItem("token");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !isLogged) {
      dispatch(setIsLogged(true));
    } else {
      dispatch(setIsLogged(false));
    }
  }, []);
  useEffect(() => {
    if (token && !isLogged) {
      dispatch(setIsLogged(true));
    }
  }, [token]);

  
 
  const handleProductsClick = () => {
    dispatch(resetPagination());
    navigate("/products");
  };

  return (
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
  );
}
