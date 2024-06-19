import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Styles from "./CreateProduct.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

type newProduct = {
  name: string;
  price: string;
  description: string;
  category: string;
  details: Detail[];
};

type Detail = {
  color: string;
  stock: number;
  image: string[];
};

export default function CreateProduct() {
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const [newProduct, setNewProduct] = useState<newProduct>({
    name: "",
    description: "",
    price: "",
    category: "",
    details: [],
  });
  const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET || "";
  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
  const token: string | null = sessionStorage.getItem("token");
  const maxCharCount = 1500;
  const [currentDetail, setCurrentDetail] = useState<Detail>({
    color: "",
    stock: 0,
    image: [],
  });
  const [imagesUploaded, setImagesUploaded] = useState<string[]>([]);
  const [ uploaded, setUploaded] = useState<Boolean>(false);

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

  useEffect(()=>{
    if(uploaded){
        handleSubmit()
    }    
  },[newProduct.details])

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${BACK_URL}/product/create`,
        newProduct,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        details: [],
      });
      setImagesUploaded([]);
      setUploaded(false)
      toast.success(response.data);
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (
      event.target instanceof HTMLTextAreaElement &&
      value.length <= maxCharCount
    ) {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    } else if (event.target instanceof HTMLInputElement) {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    }
  };

  const handleDetailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCurrentDetail({
      ...currentDetail,
      [name]: value,
    });
  };

  const handleDeleteImage = (index: number) => {
    const newImagesCopy = [...imagesUploaded];
    newImagesCopy.splice(index, 1);
    setImagesUploaded(newImagesCopy);
  };

  const handleImage = (imageUpdated: string) => {
    const newImagesCopy = [...imagesUploaded];
    newImagesCopy.push(imageUpdated);
    setImagesUploaded(newImagesCopy);
  };

  const handleSaveDetail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const detailWithOutImg = { ...currentDetail };
    detailWithOutImg.image = imagesUploaded;
    const updatedNewProduct = { ...newProduct };
    const updatedDetails = [...updatedNewProduct.details];
    updatedDetails.push(detailWithOutImg);
    updatedNewProduct.details = updatedDetails;
    setNewProduct(updatedNewProduct);
    setUploaded(true)
  };

  return (
    <div className={Styles.divMayor}>
      <Toaster />
      <div className={Styles.formDiv}>
        <form className={Styles.form} onSubmit={handleSaveDetail}>
          <div>
            <h2>Crear nuevo producto</h2>
          </div>
          <div className={Styles.inputContainers}>
            <label> Nombre </label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
            />
          </div>
          <div className={Styles.inputContainers}>
            <label>Precio</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
            />
          </div>
          <div className={Styles.inputContainers}>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleChange}
            />
          </div>
          <div className={Styles.inputContainers}>
            <label>Categoria</label>
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={handleChange}
            />
          </div>
          <div>
            <h2> Cargar detalles (guardar antes de cargar producto)</h2>
          </div>
          <div className={Styles.inputContainers}>
            <label> Color </label>
            <input
              type="text"
              name="color"
              value={currentDetail.color}
              onChange={handleDetailChange}
            />
          </div>
          <div className={Styles.inputContainers}>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={currentDetail.stock}
              onChange={handleDetailChange}
            />
          </div>
          <label className={Styles.imageLabel}> Imagenes </label>
          <div className={Styles.ImagesDiv}>
            {imagesUploaded &&
              imagesUploaded.length > 0 &&
              imagesUploaded.map((imageUrl, index) => (
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
            Crear producto{" "}
          </button>
        </form>
      </div>
    </div>
  );
}
