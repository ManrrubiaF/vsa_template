import { ChangeEvent, FormEvent, DragEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Styles from "./DataUpdate.module.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { setData } from "../../Redux/Slice/contactSlice";
import produce from "immer";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

interface Data {
  id: number;
  aboutText: string;
  phone: number;
  whatsapp: number;
  email: string;
  photos: string[];
  videos: string[];
  socialLinks: string[];
}

export default function DataUpdate() {
  const currentData = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();
  const [newData, setNewData] = useState<Data>(currentData);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const token: string | null = sessionStorage.getItem("token");
  const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET || "";
  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
  const navigate = useNavigate();

  useEffect(() => {
    setNewData(currentData);
  }, [currentData]);

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (event.target.name !== "socialLinks") {
      setNewData({
        ...newData,
        [name]: value,
      });
    } else if (name === "socialLinks") {
      const updatedSocialLinks = [...newData.socialLinks];

      if (value.toLowerCase().includes("facebook")) {
        updatedSocialLinks[0] = value;
      } else if (value.toLowerCase().includes("instagram")) {
        updatedSocialLinks[1] = value;
      }

      setNewData({
        ...newData,
        socialLinks: updatedSocialLinks,
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${BACK_URL}/data/update/${currentData.id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          newData,
        }
      );
      dispatch(setData(response.data));
      toast.success("Actualizacion exitosa");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData("index", index.toString());
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, toIndex: number) => {
    event.preventDefault();
    const fromIndex = parseInt(event.dataTransfer.getData("index"), 10);
    const photosUpdate = [...newData.photos];

    const movedPhoto = photosUpdate.splice(fromIndex, 1)[0];

    photosUpdate.splice(toIndex, 0, movedPhoto);

    setNewData((prevState) => ({
      ...prevState,
      photos: photosUpdate,
    }));
  };

  const upload = async (file: string | Blob) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", UPLOAD_PRESET);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      { method: "POST", body: formdata }
    );
    const data = await response.json();
    return data.secure_url;
  };

  const handleBack = () => {
    if (!_.isEqual(newData, currentData)) {
      const confirm = window.confirm("¿Estás seguro? Los cambios se perderán.");
      if (confirm) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const updateImg = (image: string) => {
    setNewData((prevState) =>
      produce(prevState, (draft) => {
        const detailUpdate = draft;
        detailUpdate.photos.push(image);
      })
    );
  };
  const handleDeleteImage = (index: number) => {
    const result = window.confirm(
      `¿Estás seguro que deseas eliminar esta imagen?`
    );
    if (result) {
      setNewData((prevState) =>
        produce(prevState, (draft) => {
          const detailUpdate = draft;
          detailUpdate.photos.splice(index, 1);
        })
      );
    }
  };

  return (
    <div className={Styles.divMayor}>
      <Toaster />
      <form className={Styles.form} onSubmit={handleSubmit}>
        <div className={Styles.dataContainer}>
          <label> Teléfono</label>
          <input
            type="number"
            name="phone"
            value={newData.phone}
            onChange={handleChange}
          ></input>
        </div>
        <div className={Styles.dataContainer}>
          <label>Whatsapp</label>
          <input
            type="number"
            name="whatsapp"
            value={newData.whatsapp}
            onChange={handleChange}
          ></input>
        </div>
        <div className={Styles.dataContainer}>
          <label>email</label>
          <input
            type="text"
            name="email"
            value={newData.email}
            onChange={handleChange}
          ></input>
        </div>
        <div className={Styles.socialContainer}>
          <label>Redes sociales</label>
          <label>Facebook</label>
          <input
            type="text"
            name="socialLinks"
            value={newData.socialLinks[0]}
            onChange={handleChange}
          ></input>
          <label>Instagram</label>
          <input
            type="text"
            name="socialLinks"
            value={newData.socialLinks[1]}
            onChange={handleChange}
          ></input>
        </div>
        <div className={Styles.imagesContainer}>
          <label>Imagenes</label>
          {newData.photos.map((imageUrl, index) => (
            <div
              key={index}
              className={Styles.imageItem}
              draggable
              onDragStart={(event) => handleDragStart(event, index)}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, index)}
            >
              <img src={imageUrl} alt={`pic ${index}`} />
              <FontAwesomeIcon
                icon={faX}
                className={Styles.iconX}
                onClick={() => handleDeleteImage(index)}
              />
            </div>
          ))}
          <div className={Styles.uploadContainer}>
            <label htmlFor="file-upload" className={Styles.fileLabel}>
              <div className={Styles.iconUpload}>
                <span>+</span>
                <span>Click para adjuntar imagen</span>
              </div>
              <div className={Styles.textUpload}></div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  upload(file)
                    .then((image) => {
                      updateImg(image);
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              }}
            />
          </div>
        </div>
        <div className={Styles.DivbuttonsFoot}>
          <button className={Styles.backAndUpdate} type="submit">
            {" "}
            Guardar{" "}
          </button>
          <button className={Styles.backAndUpdate} onClick={handleBack}>
            {" "}
            Volver{" "}
          </button>
        </div>
      </form>
    </div>
  );
}
