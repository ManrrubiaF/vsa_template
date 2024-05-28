import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../Redux/Hooks";
import { useAppDispatch } from "../../Redux/Hooks";
import { setData } from '../../Redux/Slice/contactSlice';
import axios from 'axios';

import Styles from "./Home.module.css";

interface DataInfo {
  id: number;
  aboutText: string;
  phone: number;
  whatsapp: number;
  email: string;
  videos: string[];
  photos: string[];
  socialLinks: string[];
}

export default function Home() {
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const dataAbout = useAppSelector<DataInfo>((state) => state.data);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (dataAbout.videos?.length > 0) {
      const randomIndex = Math.floor(Math.random() * dataAbout.videos.length);
      setCurrentVideoIndex(randomIndex);
    }
  }, [dataAbout]);

  useEffect(() => {
    if (carouselRef.current.length > 0) {
      handleCarousel();
    }
  }, [carouselRef.current]);
  useEffect(() => {
    const hasInfo = Object.values(dataAbout).some(
      (data) => data === ("" || 0 || [])
    );
    if (!hasInfo) {
      getData();
    }
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/data`);
      dispatch(setData(response.data));
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    carouselRef.current = Array.from(
      document.querySelectorAll(`.${Styles.carousel}`)
    ) as HTMLDivElement[];
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={Styles.divMayor}>
      <div className={Styles.divContainer}>
        {dataAbout && dataAbout.photos.length > 0 && (
          <div className={Styles.carousel}>
            {dataAbout.photos.map((photo, index) => (
              <img
                key={index}
                className={Styles.Showimg}
                src={photo}
                alt="image"
              />
            ))}
          </div>
        )}
        {dataAbout && dataAbout.videos.length > 0 && (
          <div className={Styles.videoContainer}>
            <video controls>
              <source
                src={dataAbout.videos[currentVideoIndex]}
                type="video/mp4"
              />
              Tu navegador no admite la reproducción de videos.
            </video>
          </div>
        )}
        <div className={Styles.AboutContainer}>
          <div className={Styles.contentData}>
            <h1> Sobre Nosotros </h1>
            <p>
              En VSA, nos dedicamos a proporcionar soluciones integrales en
              seguridad y bienestar laboral. Con más de [X] años de experiencia
              en el sector, nos hemos consolidado como líderes en el mercado,
              brindando servicios de alta calidad y confiabilidad a nuestros
              clientes.
            </p>
            <h2>Nuestros Servicios</h2>
            <p>
              Ofrecemos una amplia gama de servicios especializados diseñados
              para satisfacer las necesidades específicas de cada cliente. Desde
              la higiene y seguridad industrial hasta el control de plagas y la
              seguridad contra incendios, nuestros expertos están capacitados
              para proporcionar soluciones efectivas y personalizadas.
            </p>
            <p>
              Ya sea que necesite evaluar y mitigar riesgos en su lugar de
              trabajo, proteger su propiedad contra plagas invasoras o
              implementar sistemas de seguridad contra incendios de vanguardia,
              estamos aquí para ayudarlo en cada paso del camino.
            </p>
            <h2>Promoviendo un Entorno Seguro</h2>
            <p>
              En VSA, nos comprometemos a promover una cultura de seguridad en
              la que la protección de la salud y el bienestar de nuestros
              clientes y sus empleados sea nuestra máxima prioridad. Trabajamos
              incansablemente para garantizar que cada proyecto se complete con
              los más altos estándares de calidad y seguridad.
            </p>
            <p>
              ¿Está listo para mejorar la seguridad y el bienestar en su lugar
              de trabajo o en su hogar? ¡Contáctenos hoy mismo para obtener más
              información sobre cómo podemos ayudarlo! Nuestro equipo de
              expertos está aquí para responder a todas sus preguntas y ayudarlo
              a encontrar la solución perfecta para sus necesidades.
            </p>
          </div>
          <div className={Styles.ubicacionContainer}>
            <h1> Data de ubicacion</h1>
            <div className={Styles.ubicacionDiv}>
              <p> Villa Dolores, Cordoba</p>
              <p> 25 de Mayo nº 390</p>
              <img src="/assets/imagenes/VDolores.jpg" alt="mapa" />
            </div>
            <div className={Styles.ubicacionDiv}>
              <p> ciudad </p>
              <p> direccion</p>
              <p> mapa de google</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
