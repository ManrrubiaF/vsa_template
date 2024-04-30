import Styles from "./Recovery.module.css";
import { FormEvent, ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function Recovery() {
  const [userData, setData] = useState({
    pass: "",
    confirm: "",
  });
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const [errors, setErrors] = useState({
    pass: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [buttonState, setButtonState] = useState(true);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmVisibility = () => {
    setShowConfirm(!showConfirm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
       await axios.post(`${BACK_URL}/user/change`, userData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      navigate('/someplace');
    } catch (error: any) {
      console.error(error)
    }
  };

  const validation = () => {
    const error = {} as typeof errors;

    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-_.])/.test(userData.pass)) {
      error.pass =
        "La contraseña debe contener al menos 1 mayúscula, 1 minúscula, 1 número,  1 un caracter (. - _) y ser mayor o igual a  8";
    } else if (userData.pass.length < 8) {
      error.pass = "Contraseña es requerida.";
    }
    if (userData.pass !== userData.confirm) {
      error.confirm = "Ambas claves deben coincidir";
    } else if (userData.confirm.length === 0) {
      error.confirm = "Ingrese nuevamente su nueva clave";
    }
    return error;
  };

  useEffect(() => {
    const resultError = validation();
    setErrors(resultError);
    if (!Object.values(resultError).some((error) => error !== "")) {
      setButtonState(false);
    } else {
      setButtonState(true);
    }
  }, [userData]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData({ ...userData, [name]: value });
  };

  return (
    <div className={Styles.divMayor}>
      <form className={Styles.form} onSubmit={handleSubmit}>
        <div>
          <h2> Establecer nueva contraseña</h2>
        </div>
        <div className={Styles.divLabel}>
          <label> Nueva contraseña: </label>
          <input
            type={showPassword ? "text" : "password"}
            name="pass"
            value={userData.pass}
            onChange={handleChange}
          />
          {showPassword ? (
            <FontAwesomeIcon
              icon={faEyeSlash}
              style={{ color: "#000000" }}
              onClick={togglePasswordVisibility}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEye}
              style={{ color: "#000000" }}
              onClick={togglePasswordVisibility}
            />
          )}
          {errors.pass && <label className={Styles.error}>{errors.pass}</label>}
        </div>
        <div className={Styles.divLabel}>
          <label> Confirmar contraseña </label>
          <input
            type={showConfirm ? "text" : "password"}
            name="confirm"
            value={userData.confirm}
            onChange={handleChange}
          />
          {showConfirm ? (
            <FontAwesomeIcon
              icon={faEyeSlash}
              style={{ color: "#000000" }}
              onClick={toggleConfirmVisibility}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEye}
              style={{ color: "#000000" }}
              onClick={toggleConfirmVisibility}
            />
          )}
          {errors.confirm && (
            <label className={Styles.error}>{errors.confirm}</label>
          )}
        </div>
        <button type="submit" disabled={buttonState}>
          Enviar
        </button>
      </form>
    </div>
  );
}
