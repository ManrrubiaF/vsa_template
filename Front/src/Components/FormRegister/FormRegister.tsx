import axios from "axios";
import toast, { Toaster } from 'react-hot-toast'
import Styles from './FormRegister.module.css'
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useAppDispatch } from "../../Redux/Hooks";
import { setUser } from "../../Redux/Slice/userSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";


export default function FormRegister() {
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [buttonState, setButtonState] = useState(false);
    
    const [errors, setErrors] = useState({
        email: '',
        pass: '',
        name: '',
        lastName: '',
        phone: '',
    })
    const [userData, setUserData] = useState({
        email: '',
        pass: '',
        name: '',
        lastName: '',
        phone: '',
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validation = () => {
        const error = {} as typeof errors;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (userData.email.length < 3) {
            error.email = " Email es requerido"
        } else if (!emailRegex.test(userData.email)) {
            error.email = "Debe ser un formato de email válido"
        }
        if (userData.name.trim().length < 4) {
            error.name = "El nombre es requerido.";
        } else if (!/^([A-Za-z]+\s*)+$/.test(userData.name)) {
            error.name = "El nombre solo puede contener letras";
        }
        if (userData.lastName.trim().length < 4) {
            error.lastName = "Apellido requerido"
        }
        if (userData.phone.length < 1) {
            error.phone = "Teléfono requerido.";
        }else if ( userData.phone.length !== 10 || !/^\d+$/.test(userData.phone)) {
            error.phone = "Teléfono solo puede contener 10 números";
        }
        if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-_.])/.test(userData.pass)) {
            error.pass =
                "La contraseña debe contener al menos 1 mayúscula, 1 minúscula, 1 número,  1 un caracter (. - _) y ser mayor o igual a  8";
        } else if (userData.pass.length < 8) {
            error.pass = "Contraseña es requerida.";
        }

        return error;

    }

    useEffect(() => {
        const resultError = validation();
        setErrors(resultError);
        if (!Object.values(resultError).some(error => error !== "")) {
            setButtonState(true);
        } else {
            setButtonState(false)
        }

    }, [userData])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${BACK_URL}/user/create`, userData);
            dispatch(setUser(response.data.payload))
            window.sessionStorage.setItem("token",JSON.stringify(response.data.token))
            toast.success('Bienvenid@')
            navigate(-1)

        } catch (error: any) {
            toast.error(error.response.data)
        }
    };

    return (
        <div className={Styles.divMayor}>
            <Toaster />

            <form className={Styles.form} onSubmit={handleSubmit}>
                <div>
                    <h2> Formulario de registro </h2>
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
                    <label>Contraseña:</label>
                    <div className={Styles.inputPass}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="pass"
                            value={userData.pass}
                            onChange={handleChange}
                        />
                        {showPassword ? (
                            <FontAwesomeIcon icon={faEyeSlash} style={{ color: "#000000", }} onClick={togglePasswordVisibility} />
                        ) : (
                            <FontAwesomeIcon icon={faEye} style={{ color: "#000000", }} onClick={togglePasswordVisibility} />
                        )}
                    </div>
                    {errors.pass && (
                        <label className={Styles.error}>{errors.pass}</label>
                    )}
                </div>
                <div className={Styles.divLabel}>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                    />
                    {errors.name && (
                        <label className={Styles.error}>{errors.name}</label>
                    )}
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
                <div className={Styles.divLabel}>
                    <label>Teléfono:</label>
                    <input
                        type="number"
                        name="phone"
                        step="0.01"
                        value={userData.phone}
                        onChange={handleChange}

                    />
                    {errors.phone && (
                        <label className={Styles.error}>{errors.phone}</label>
                    )}
                </div>
                {buttonState && (
                    <button type="submit">Enviar</button>
                )}
            </form>
        </div>
    )
}