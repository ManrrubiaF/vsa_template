import Styles from "./PortfolioDetail.module.css";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../Redux/Hooks";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { setPortfolio } from "../../../Redux/Slice/PortfolioSlice";
import { useNavigate, useParams } from "react-router-dom";
import produce from "immer";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import _ from "lodash";

type OneDetail = {
  id: number;
  description: string;
  links: string[];
};

export default function PortfolioDetail() {
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const Portfolio_array = useAppSelector((state) => state.portfolio);
  const { id } = useParams();
  const token: string | null = sessionStorage.getItem("token");
  const maxCharCount = 1500;
  const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET || "";
  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
  const [picSelected, setPicSelected] = useState<OneDetail>();
  const [thisPic, setThisPic] = useState<OneDetail>({
    id: 0,
    description: "",
    links: [],
  });

  useEffect(() => {
    if (Portfolio_array.length == 0) {
      getPortfolio();
    }
    if (Portfolio_array.length > 0 && typeof id !== "undefined") {
      const filterPic = Portfolio_array.find(
        (onePortfolio) => onePortfolio.id === parseInt(id, 10)
      );
      if (filterPic) {
        setPicSelected(filterPic);
        setThisPic(filterPic)
      }
    }
  }, []);

  const getPortfolio = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/portfolio`);
      dispatch(setPortfolio(response.data));
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${BACK_URL}/portfolio/update/${thisPic.id}`,
        thisPic,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setPicSelected(response.data);
      toast.success("Portfolio Updated");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const deletePic = async () => {
    try {
      const response = await axios.delete(
        `${BACK_URL}/portfolio/delete/${thisPic.id}`
      );
      toast.success(response.data);
      navigate(-1);
    } catch (error: any) {
      toast.error(error.response.data);
    }
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

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    if (
      event.target instanceof HTMLTextAreaElement &&
      value.length <= maxCharCount
    ) {
      setThisPic({
        ...thisPic,
        [name]: value,
      });
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
    const detailIndex = thisPic.links.findIndex(
      (detail) => detail === thisPic.links[fromIndex]
    );
    if (detailIndex !== -1) {
      setThisPic((prevState) =>
        produce(prevState, (draft) => {
          const detailUpdate = draft.links;
          const [movedImage] = detailUpdate.splice(fromIndex, 1);
          detailUpdate.splice(toIndex, 0, movedImage);
        })
      );
    }
    setPicSelected((prevState) =>
      produce(prevState, (draft) => {
        const detailUpdate = draft;
        if (detailUpdate) {
          const [movedImage] = draft.links.splice(fromIndex, 1);
          draft.links.splice(toIndex, 0, movedImage);
        }
      })
    );
  };
  const handleDeleteImage = (index: number) => {
    const result = window.confirm(
      `¿Estás seguro que deseas eliminar esta imagen?`
    );
    if (result) {
      const detailIndex = thisPic.links.findIndex(
        (detail) => detail === thisPic.links[index]
      );

      if (detailIndex !== -1) {
        setThisPic((prevState) =>
          produce(prevState, (draft) => {
            const detailUpdate = draft;
            detailUpdate.links.splice(index, 1);
          })
        );
        setPicSelected((prevState) =>
          produce(prevState, (draft) => {
            const detailUpdate = draft;
            if (detailUpdate) {
              detailUpdate.links.splice(index, 1);
            }
          })
        );
      }
    }
  };
  const handleDelete = () => {
    const result = window.confirm(
      `¿Deseas eliminar el producto  ?`
    );
    if (result) {
      deletePic();
    }
  };

  const updateImg = (image: string) => {
    setPicSelected((prevState) =>
        produce(prevState, (draft) => {
          const detailUpdate = draft;
          if (detailUpdate) {
            detailUpdate.links.push(image);
          }
        })
      );
    
  };

  const handleBack = () => {
    if (!_.isEqual(thisPic, picSelected)) {
      const confirm = window.confirm("¿Estás seguro? Los cambios se perderán.");
      if (confirm) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  


  return (
    <div className={Styles.divMayor}>
      {picSelected && (
        <div className={Styles.containerAllDetails}>
          <div>
            <h3>Recuerde guardar todos los cambios.</h3>
          </div>
          <div className={Styles.divTextarea}>
            <label> Descripción: </label>
            <textarea
              name="description"
              value={thisPic.description}
              onChange={handleChange}
            />
            <p>
              Characteres restantes: {maxCharCount - thisPic.description.length}
              /{maxCharCount}
            </p>
          </div>
          <label className={Styles.imageLabel}> Imagenes </label>
          <div className={Styles.imagesContainer}>
            {picSelected &&
              picSelected.links.map((imageUrl, index) => (
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
                Eliminar{" "}
              </button>
            </div>
          </div>
          <Toaster />
        </div>
      )}
    </div>
  );
}
