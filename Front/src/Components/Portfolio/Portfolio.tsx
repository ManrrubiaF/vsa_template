import Styles from "./Portfolio.module.css";
import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import axios from "axios";
import { setData } from "../../Redux/Slice/contactSlice";
import { useEffect, useRef } from "react";

export default function Portfolio() {
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const Portfolio_array = useAppSelector((state) => state.portfolio);
  const dispatch = useAppDispatch();
  const carouselRef = useRef<HTMLDivElement[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!Portfolio_array) {
      getData();
    }
    carouselRef.current = Array.from(
      document.querySelectorAll(`.${Styles.carousel}`)
    ) as HTMLDivElement[];
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (carouselRef.current.length > 0) {
      handleCarousel();
    }
  }, [carouselRef.current]);

  const handleCarousel = () => {
    carouselRef.current.forEach((carousel) => {
      const images = Array.from(
        carousel.querySelectorAll("img")
      ) as HTMLImageElement[];
      let currentIndex = 0;

      function updateSlider() {
        images.forEach((image, imgIndex) => {
          if (imgIndex === currentIndex) {
            image.style.display = "block";
            image.style.transform = "translateX(0)";
          } else {
            image.style.display = "none";
            image.style.transform = "translateX(100%)";
          }
        });
      }

      function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateSlider();
      }

      updateSlider();
      intervalRef.current = setInterval(nextImage, 3000);
    });
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/portfolio`);
      dispatch(setData(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={Styles.divMayor}>
        <div className={Styles.HeadContainer}>
            <h1> Portfolio </h1>
        </div>
      
      <div className={Styles.gridContainer}>
        {Portfolio_array.length > 0 ? (
          Portfolio_array.map((onePic) => (
            <div key={onePic.id} className={Styles.picContainer}>
              <div className={Styles.carousel}>
              {onePic!.links.map((photo, index) => (
                <img
                  key={index}
                  className={Styles.Showimg}
                  src={photo}
                  alt="image carousel"
                  />
              ))}
              </div>
              <p>{onePic.description}</p>
            </div>
          ))
        ) : (
          <div>
            <h3> Cargando imagenes</h3>
          </div>
        )}
      </div>
    </div>
  );
}
