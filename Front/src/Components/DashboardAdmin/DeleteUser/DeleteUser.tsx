import { useEffect, useState } from "react";
import Styles from "./DeleteUser.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

type OneUser = {
  id: number;
  name: string;
  lastName: string;
  email: string;
};

export default function DeleteUser() {
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const token: string | null = sessionStorage.getItem("token");
  const [usersData, setUsersData] = useState<OneUser[]>([]);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/user/all`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setUsersData(response.data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleDelete = (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );

    if (confirmacion) {
      deleteUser(id);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const response = await axios.delete(`${BACK_URL}/user/delete/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      getUsers();
      toast.success(response.data);
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={Styles.divMayor}>
      <div className={Styles.userDataDiv}>
        <div className={Styles.titles}>
          <label>Nombre</label>
          <label className={Styles.lastName}>Apellido</label>
          <label>Email</label>
        </div>
        {usersData.length > 0 &&
          usersData.map((oneUser) => (
            <div key={oneUser.id} className={Styles.oneUser}>
              <div className={Styles.details}>
                <p>{oneUser.name}</p>
              </div>
              <div className={Styles.details}>
                <p>{oneUser.lastName}</p>
              </div>
              <div className={Styles.details}>
                <p>{oneUser.email}</p>
              </div>
              <FontAwesomeIcon
                icon={faX}
                className={Styles.iconX}
                onClick={() => handleDelete(oneUser.id)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
