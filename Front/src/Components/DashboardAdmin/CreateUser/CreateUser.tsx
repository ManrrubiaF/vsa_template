import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Styles from "./CreateUser.module.css";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

export default function CreateUser() {
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const navigate = useNavigate();
  const [buttonState, setButtonState] = useState(false);
  const token: string | null = sessionStorage.getItem("token");
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    lastName: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const validation = () => {
    const error = {} as typeof errors;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (userData.email.length < 3) {
      error.email = " Email es requerido";
    } else if (!emailRegex.test(userData.email)) {
      error.email = "Debe ser un formato de email válido";
    }
    if (userData.name.trim().length < 4) {
      error.name = "El nombre es requerido.";
    } else if (!/^([A-Za-z]+\s*)+$/.test(userData.name)) {
      error.name = "El nombre solo puede contener letras";
    }
    if (userData.lastName.trim().length < 4) {
      error.lastName = "Apellido requerido";
    }

    return error;
  };

  useEffect(() => {
    const resultError = validation();
    setErrors(resultError);
    if (!Object.values(resultError).some((error) => error !== "")) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  }, [userData]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axios.post(`${BACK_URL}/user/createAdmin`, userData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setUserData({
        email: "",
        name: "",
        lastName: "",
      });
      setErrors({
        email: "",
        name: "",
        lastName: "",
      });
      navigate("/someplace");
      toast.success("Usuario Registrado");
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  return (
    <div className={Styles.divMayor}>
      <Toaster />

      <form className={Styles.form} onSubmit={handleSubmit}>
        <div>
          <h2> Alta nuevo usuario </h2>
        </div>
        <div className={Styles.divLabel}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
          <label className={Styles.error}>{errors.email}</label>
        </div>
        <div className={Styles.divLabel}>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
          {errors.name && <label className={Styles.error}>{errors.name}</label>}
        </div>
        <div className={Styles.divLabel}>
          <label>Apellido:</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <label className={Styles.error}> {errors.lastName}</label>
          )}
        </div>
        {buttonState && <button type="submit">Enviar</button>}
      </form>
    </div>
  );
}
