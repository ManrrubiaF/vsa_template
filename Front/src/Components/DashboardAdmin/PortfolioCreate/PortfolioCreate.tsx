import Styles from "./PortfolioCreate.module.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useState, ChangeEvent, FormEvent } from "react";

type Pic = {
  description: string;
  links: string[];
};

export default function PortfolioCreate() {
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const [newPic, setNewPic] = useState<Pic>({
    description: "",
    links: [],
  });
  const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET || "";
  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
  const token: string | null = sessionStorage.getItem("token");
  const maxCharCount = 1500;

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


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await axios.post(
        `${BACK_URL}/portfolio/create`,
        newPic,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setNewPic({
        description: "",
        links: [],
      });
      toast.success(response.data);
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (
      event.target instanceof HTMLTextAreaElement &&
      value.length <= maxCharCount
    ) {
      setNewPic({
        ...newPic,
        [name]: value,
      });
    }
  };
  const handleDeleteImage = (index: number) => {
    const newImagesCopy = { ...newPic };
    newImagesCopy.links.splice(index, 1);
    setNewPic(newImagesCopy);
  };

  const handleImage = (imageUpdated: string) => {
    const newImagesCopy = { ...newPic };
    newImagesCopy.links.push(imageUpdated);
    setNewPic(newImagesCopy);
  };

  return (
    <div className={Styles.divMayor}>
      <Toaster />
      <div className={Styles.formDiv}>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <div>
            <h2> Agregar nuevo item</h2>
          </div>
          <div className={Styles.inputContainers}>
            <textarea
              name="description"
              value={newPic.description}
              onChange={handleChange}
            />
          </div>
          <label className={Styles.imageLabel}> Imagenes </label>
          <div className={Styles.ImagesDiv}>
            {newPic &&
              newPic.links.length > 0 &&
              newPic.links.map((imageUrl, index) => (
                <div key={index} className={Styles.imagesContainer}>
                  <img src={imageUrl} alt={`Image ${index}`} />
                  <FontAwesomeIcon
                    icon={faX}
                    className={Styles.iconX}
                    onClick={() => handleDeleteImage(index)}
                  />
                </div>
              ))}
            <label htmlFor="file-upload" className={Styles.fileLabel}>
              <div className={Styles.iconUpload}>
                <span>+</span>
                <span>Click para adjuntar imagen</span>
              </div>
              <div className={Styles.textUpload}></div>
            </label>
            <input
              className={Styles.inputUpload}
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  upload(file)
                    .then((imageUpdated) => {
                      handleImage(imageUpdated);
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              }}
            />
          </div>
          <button className={Styles.CreateButton} type="submit">
            {" "}
            Agregar a portfolio{" "}
          </button>
        </form>
      </div>
    </div>
  );
}
