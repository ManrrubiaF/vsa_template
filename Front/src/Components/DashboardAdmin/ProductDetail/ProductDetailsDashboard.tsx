import axios from "axios";
import Styles from "./ProductDetailsDashboard.module.css";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../Redux/Hooks";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import produce from "immer";
import _ from "lodash";

type Product = {
  id: number;
  name: string;
  price: string;
  description: string;
  active: boolean;
  category: string;
  details: Detail[];
};
type Detail = {
  color: string | null;
  stock: number;
  image: string[];
  size: string[];
};

export default function DashboardProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET || "";
  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
  const token: string | null = sessionStorage.getItem("token");
  const products = useAppSelector((state) => state.products);
  const [detailSelected, setDetailSelected] = useState<Detail>();
  const [showInput, setShowInput] = useState(false);
  const [newColor, setNewColor] = useState("");
  const accessStatus = useAppSelector((state) => state.user.User.access);
  const maxCharCount = 1500;
  const [thisProduct, setThisProduct] = useState<Product>({
    id: 0,
    name: "",
    price: "",
    description: "",
    active: false,
    category: "",
    details: [],
  });
  const [dataUpdate, setDataUpdate] = useState<Product>({
    id: 0,
    name: "",
    price: "",
    description: "",
    active: false,
    category: "",
    details: [],
  });

  useEffect(() => {
    chargeProduct();
    if (accessStatus !== "Admin") {
      toast.error(`You don't have access`);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, []);

  const chargeProduct = () => {
    if (typeof id !== "undefined") {
      const filterProduct = products.find(
        (oneProduct) => oneProduct.id === parseInt(id, 10)
      );

      if (filterProduct) {
        setDataUpdate(filterProduct);
        setThisProduct(filterProduct);
        setDetailSelected(filterProduct.details[0]);
      }
    }
  };

  const handleChange = (
    event:
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (
      event.target instanceof HTMLTextAreaElement &&
      value.length <= maxCharCount
    ) {
      setDataUpdate({
        ...dataUpdate,
        [name]: value,
      });
    } else if (event.target instanceof HTMLInputElement) {
      setDataUpdate({
        ...dataUpdate,
        [name]: value,
      });
    } else if (event.target instanceof HTMLSelectElement) {
      if (name === "active" && value === "true") {
        setDataUpdate({
          ...dataUpdate,
          [name]: true,
        });
      } else if (name === "active" && value === "false") {
        setDataUpdate({
          ...dataUpdate,
          [name]: false,
        });
      } else {
        const currentDetail = dataUpdate.details.find(
          (detail) => detail.color === value
        );
        setDetailSelected(currentDetail);
      }
    }
  };

  const handleStockChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const updatedDetail = {
      ...detailSelected,
      stock: parseInt(value, 10),
    } as Detail;
    const detailIndex = thisProduct.details.findIndex(
      (detail) => detail.color === detailSelected?.color
    );
    const updatedDetails = [...dataUpdate.details];
    updatedDetails[detailIndex] = updatedDetail;
    setDetailSelected(updatedDetail);
    setDataUpdate({ ...dataUpdate, details: updatedDetails });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${BACK_URL}/product/update/${dataUpdate.id}`,
        dataUpdate,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setThisProduct(response.data);
      toast.success("Product Updated");
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
    const detailIndex = thisProduct.details.findIndex(
      (detail) => detail.color === detailSelected?.color
    );
    if (detailIndex !== -1) {
      setDataUpdate((prevState) =>
        produce(prevState, (draft) => {
          const detailUpdate = draft.details[detailIndex].image;
          const [movedImage] = detailUpdate.splice(fromIndex, 1);
          detailUpdate.splice(toIndex, 0, movedImage);
        })
      );
    }
    setDetailSelected((prevState) =>
      produce(prevState, (draft) => {
        const detailUpdate = draft;
        if (detailUpdate) {
          const [movedImage] = draft.image.splice(fromIndex, 1);
          draft.image.splice(toIndex, 0, movedImage);
        }
      })
    );
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

  const handleNewColor = () => {
    const newDetail = {
      color: newColor,
      stock: 0,
      image: [],
      size: [],
    } as Detail;
    setNewColor("");
    setDetailSelected(newDetail);
    setDataUpdate((prevState) =>
      produce(prevState, (draft) => {
        const detailUpdate = draft;
        detailUpdate.details.push(newDetail);
      })
    );
  };

  const handleBack = () => {
    if (
      !_.isEqual(thisProduct, dataUpdate) &&
      !_.isEqual(thisProduct.details, dataUpdate.details)
    ) {
      const confirm = window.confirm("¿Estás seguro? Los cambios se perderán.");
      if (confirm) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const updateImg = (image: string) => {
    const detailIndex = dataUpdate.details.findIndex(
      (detail) => detail.color === detailSelected?.color
    );

    if (detailIndex !== -1) {
      setDataUpdate((prevState) =>
        produce(prevState, (draft) => {
          const detailUpdate = draft;
          detailUpdate.details[detailIndex].image.push(image);
        })
      );
      setDetailSelected((prevState) =>
        produce(prevState, (draft) => {
          const detailUpdate = draft;
          if (detailUpdate) {
            detailUpdate.image.push(image);
          }
        })
      );
    }
  };

  const handleDeleteColor = () => {
    const confirm = window.confirm(
      "¿Estás seguro? Si eliminas este color se eliminará su stock e imagenes."
    );
    if (confirm) {
      const detailIndex = dataUpdate.details.findIndex(
        (detail) => detail.color === detailSelected?.color
      );
      if (detailIndex !== -1) {
        setDataUpdate((prevState) =>
          produce(prevState, (draft) => {
            const detailUpdate = draft;
            detailUpdate.details.splice(detailIndex, 1);
          })
        );
      }
      if (
        dataUpdate.details.length > 0 &&
        detailIndex !== -1 &&
        detailIndex !== 0
      ) {
        setDetailSelected(dataUpdate.details[0]);
      } else if (
        dataUpdate.details.length > 0 &&
        detailIndex !== -1 &&
        detailIndex === 0
      ) {
        setDetailSelected({
          color: "",
          stock: 0,
          image: [],
          size: [],
        });
      }
    }
  };

  const handleDeleteImage = (index: number) => {
    const result = window.confirm(
      `¿Estás seguro que deseas eliminar esta imagen?`
    );
    if (result) {
      const detailIndex = dataUpdate.details.findIndex(
        (detail) => detail.color === detailSelected?.color
      );

      if (detailIndex !== -1) {
        setDataUpdate((prevState) =>
          produce(prevState, (draft) => {
            const detailUpdate = draft;
            detailUpdate.details[detailIndex].image.splice(index, 1);
          })
        );
        setDetailSelected((prevState) =>
          produce(prevState, (draft) => {
            const detailUpdate = draft;
            if (detailUpdate) {
              detailUpdate.image.splice(index, 1);
            }
          })
        );
      }
    }
  };

  const deleteProduct = async () => {
    try {
      const response = await axios.delete(
        `${BACK_URL}/product/delete/${thisProduct.id}`
      );
      toast.success(response.data);
      navigate(-1);
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const handleDelete = () => {
    const result = window.confirm(
      `¿Deseas eliminar el producto ${thisProduct.name} ?`
    );
    if (result) {
      deleteProduct();
    }
  };

  return (
    <div className={Styles.divMayor}>
      {thisProduct && (
        <div className={Styles.containerAllDetails}>
          <div>
            <h3>Recuerde guardar todos los cambios.</h3>
          </div>
          <div className={Styles.divInputs}>
            <label> Nombre: </label>
            <input
              name="name"
              type="text"
              value={dataUpdate.name}
              onChange={handleChange}
            />
          </div>
          <div className={Styles.divInputs}>
            <label> Categoria: </label>
            <input
              name="category"
              type="text"
              value={dataUpdate.category}
              onChange={handleChange}
            />
          </div>
          <div className={Styles.divInputs}>
            <label> Precio: </label>
            <input
              name="price"
              min={0}
              type="number"
              step="0.01"
              value={parseFloat(dataUpdate.price)}
              onChange={handleChange}
            />
          </div>
          <div className={Styles.divInputs}>
            <label> Estado: </label>
            <select
              name="active"
              value={dataUpdate.active ? "true" : "false"}
              onChange={handleChange}
            >
              <option value="true">Activo</option>
              <option value="false">Desactivado</option>
            </select>
          </div>
          <div className={Styles.divInputs}>
            <label>Colores:</label>
            {detailSelected?.color !== null && (
              <div>
                <select
                  name="color"
                  value={detailSelected?.color}
                  onChange={handleChange}
                >
                  <option key="default" value="" disabled>
                    {" "}
                    Elija un color
                  </option>
                  {dataUpdate.details.map((Colors) => (
                    <option key={Colors.color} value={Colors.color ? (Colors.color) :  "No hay colores"}>
                      {Colors.color}
                    </option>
                  ))}
                </select>
                <button
                  className={Styles.addColor}
                  onClick={() => setShowInput(!showInput)}
                >
                  {" "}
                  Agregar color{" "}
                </button>
                <button
                  className={Styles.deleteColor}
                  onClick={handleDeleteColor}
                >
                  {" "}
                  Eliminar Color{" "}
                </button>
              </div>
            )}
          </div>
          {showInput && (
            <div className={Styles.addInputandButton}>
              <input
                name="newColor"
                value={newColor}
                placeholder={"Escriba el nombre del color"}
                onChange={(event) => setNewColor(event.target.value)}
              />
              <button onClick={handleNewColor}> Agregar </button>
            </div>
          )}
          <div className={Styles.divInputs}>
            <label> Stock: </label>
            <input
              type="number"
              min={0}
              name="Stock"
              value={detailSelected?.stock}
              onChange={handleStockChange}
            />
          </div>
          <div className={Styles.divTextarea}>
            <label> Descripción: </label>
            <textarea
              name="description"
              value={dataUpdate.description}
              onChange={handleChange}
            />
            <p>
              Characteres restantes:{" "}
              {maxCharCount - dataUpdate.description.length}/{maxCharCount}
            </p>
          </div>
          <label className={Styles.imageLabel}> Imagenes </label>
          <div className={Styles.imagesContainer}>
            {detailSelected &&
              detailSelected.image.map((imageUrl, index) => (
                <div
                  key={index}
                  className={Styles.imageItem}
                  draggable
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(event, index)}
                >
                  <img src={imageUrl} alt={`Image ${index}`} />
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
          <div>
            <div className={Styles.DivbuttonsFoot}>
              <button className={Styles.backAndUpdate} onClick={handleSubmit}>
                {" "}
                Guardar{" "}
              </button>
              <button className={Styles.backAndUpdate} onClick={handleBack}>
                {" "}
                Volver{" "}
              </button>
              <button className={Styles.buttonDelete} onClick={handleDelete}>
                {" "}
                Eliminar producto{" "}
              </button>
            </div>
          </div>
          <Toaster />
        </div>
      )}
    </div>
  );
}
