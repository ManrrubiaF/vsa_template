import Styles from "./Admin.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsDashBoard from "../DashboardAdmin/Products/ProductsDashboard";
import BookingDashBoard from "../DashboardAdmin/Booking/BookingDashboard";
import toast, { Toaster } from "react-hot-toast";
import CreateProduct from "../DashboardAdmin/CreateProduct/CreateProduct";
import ResumeDashBoard from "../DashboardAdmin/ResumeDashboard/ResumeDashboard";
import DataUpdate from "../UserDashboard/DataUpdate";
import CreateUser from "../DashboardAdmin/CreateUser/CreateUser";
import DeleteUser from "../DashboardAdmin/DeleteUser/DeleteUser";
import CreateBooking from "../DashboardAdmin/CreateBooking/CreateBooking";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { resetUser, setUser } from "../../Redux/Slice/userSlice";
import { setRenderComponent } from "../../Redux/Slice/UserMenu";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PortfolioAdmin from "../DashboardAdmin/PortfolioAdmin/PortfolioAdmin";
import PortfolioCreate from "../DashboardAdmin/PortfolioCreate/PortfolioCreate";

export default function Admin() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessStatus = useAppSelector((state) => state.user.User.access);
  const optionSelected = useAppSelector(
    (state) => state.userMenu.renderSelected
  );
  const [renderComponent, setRenderOption] = useState<React.ReactNode>(null);
  const [loginData, setLoginData] = useState({
    email: "",
    pass: "",
  });
  const token: string | null = sessionStorage.getItem("token");
  const [showPassword, setShowPassword] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogOut = async () => {
    try {
      const response = await axios.post(`${BACK_URL}/user/logout`, {
        token: token,
      });
      window.sessionStorage.removeItem("token");
      dispatch(resetUser());
      navigate("/");
      toast.success(response.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BACK_URL}/user/login`, loginData);
      dispatch(setUser(response.data.payload));
      toast.success("Welcome");
      window.sessionStorage.setItem(
        "token",
        JSON.stringify(response.data.token)
      );
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (optionSelected === "products") {
      setRenderOption(<ProductsDashBoard />);
    } else if (optionSelected === "bookings") {
      setRenderOption(<BookingDashBoard />);
    } else if (optionSelected === "Create") {
      setRenderOption(<CreateProduct />);
    } else if (optionSelected === "Dashboard") {
      setRenderOption(<DataUpdate />);
    } else if (optionSelected === "Resume") {
      setRenderOption(<ResumeDashBoard />);
    } else if (optionSelected === "CreateUser") {
      setRenderOption(<CreateUser />);
    } else if (optionSelected === "Solded") {
      setRenderOption(<CreateBooking />);
    } else if (optionSelected === "DeleteUser") {
      setRenderOption(<DeleteUser />);
    } else if (optionSelected === "Portfolio") {
      setRenderOption(<PortfolioAdmin />);
    } else if (optionSelected === "CreatePortfolio") {
      setRenderOption(<PortfolioCreate />)
    } else {
      setRenderOption(<div>No se seleccionó ninguna opción.</div>);
    }
  }, [optionSelected]);

  return (
    <div className={Styles.divMayor}>
      {accessStatus === null ? (
        <div className={Styles.logginDiv}>
          <div className={Styles.inputContainer}>
            <span>Email: </span>
            <input
              type="text"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
            />
            <span>Contraseña: </span>
            <div className={Styles.password}>
              <input
                type={showPassword ? "text" : "password"}
                name="pass"
                value={loginData.pass}
                onChange={handleInputChange}
              />
              {showPassword ? (
                <FontAwesomeIcon
                  icon={faEyeSlash}
                  className={Styles.eyes}
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faEye}
                  className={Styles.eyes}
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>
          <div className={Styles.singupbuttons}>
            <button onClick={handleLogin}> Iniciar Sesión </button>
          </div>
        </div>
      ) : (
        <div>
          <div className={Styles.buttonContainer}>
            <div className={Styles.optionsContainer}>
              <button onClick={() => dispatch(setRenderComponent("Portfolio"))}>
                {" "}
                Portfolio{" "}
              </button>
            </div>
            <div className={Styles.optionsContainer}>
              <button
                onClick={() => dispatch(setRenderComponent("CreatePortfolio"))}
              >
                {" "}
                Nuevo Portfolio{" "}
              </button>
            </div>
            <div className={Styles.optionsContainer}>
              <button onClick={() => dispatch(setRenderComponent("products"))}>
                {" "}
                Productos{" "}
              </button>
            </div>
            <div className={Styles.optionsContainer}>
              <button onClick={() => dispatch(setRenderComponent("bookings"))}>
                {" "}
                Ventas{" "}
              </button>
            </div>
            <div className={Styles.optionsContainer}>
              <button onClick={() => dispatch(setRenderComponent("Create"))}>
                {" "}
                Crear producto{" "}
              </button>
            </div>
            <div className={Styles.optionsContainer}>
              <button onClick={() => dispatch(setRenderComponent("Resume"))}>
                {" "}
                Resumen{" "}
              </button>
            </div>
            {accessStatus === "Admin" && (
              <div className={Styles.optionsContainer}>
                <button
                  onClick={() => dispatch(setRenderComponent("CreateUser"))}
                >
                  {" "}
                  Crear usuario{" "}
                </button>
              </div>
            )}
            {accessStatus === "Admin" && (
              <div className={Styles.optionsContainer}>
                <button
                  onClick={() => dispatch(setRenderComponent("DeleteUser"))}
                >
                  {" "}
                  Eliminar usuario{" "}
                </button>
              </div>
            )}
            {accessStatus === "Admin" && (
              <div className={Styles.optionsContainer}>
                <button onClick={() => dispatch(setRenderComponent("Solded"))}>
                  {" "}
                  Cargar venta{" "}
                </button>
              </div>
            )}
            <div className={Styles.optionsContainer}>
              <button onClick={handleLogOut}> Cerrar Sesión </button>
            </div>
          </div>
          {renderComponent}
        </div>
      )}
      <Toaster />
    </div>
  );
}
