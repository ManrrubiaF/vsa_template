import Styles from './HySLaboral.module.css'

export default function HySLaboral() {
    return (
        <div className={Styles.divMayor}>
            <div className={Styles.imgContainer}>
                <img src='/assets/imagenes/laboral.jpg' alt='HySLaboral' />
            </div>
            <div className={Styles.textContainer}>
                <h2>Higiene y Seguridad Laboral</h2>
                <p>
                    En nuestra sección dedicada a la Higiene y Seguridad Laboral, nos comprometemos a garantizar un entorno de trabajo seguro y saludable para todos los empleados. Reconocemos que la seguridad laboral es un aspecto fundamental para el bienestar y la productividad de nuestro equipo.
                </p>
                <p>
                    En nuestra empresa, implementamos medidas preventivas y sistemas de gestión de seguridad laboral para identificar, evaluar y controlar los riesgos presentes en el lugar de trabajo. Nuestro objetivo es eliminar o minimizar los peligros potenciales y garantizar que se cumplan los estándares de seguridad más exigentes.
                </p>
                <p>
                    Nuestros servicios incluyen:
                    <ul>
                        <li>Elaboración de planes de seguridad: Desarrollamos planes de seguridad personalizados que se adaptan a las necesidades específicas de cada lugar de trabajo.</li>
                        <li>Formación en seguridad: Ofrecemos programas de formación en seguridad laboral para concienciar a los empleados sobre los riesgos laborales y enseñarles las mejores prácticas de prevención.</li>
                        <li>Equipamiento de protección: Proporcionamos equipos de protección personal (EPP) y dispositivos de seguridad adecuados para garantizar la protección de los trabajadores en todo momento.</li>
                        <li>Investigación de accidentes: Realizamos investigaciones exhaustivas sobre accidentes laborales para identificar las causas subyacentes y prevenir futuros incidentes.</li>
                    </ul>
                </p>
                <p>
                    En nuestra empresa, promovemos una cultura de seguridad en la que todos los empleados se sientan responsables de su propia seguridad y la de sus compañeros de trabajo. Nos esforzamos por mantenernos al día con las últimas regulaciones y mejores prácticas en materia de seguridad laboral para garantizar un ambiente de trabajo seguro y saludable para todos.
                </p>
                <p>
                    Confíe en nosotros para proporcionar soluciones efectivas que protejan la salud y la seguridad de su equipo. Contáctenos hoy mismo para obtener más información sobre cómo podemos ayudarlo a mejorar la seguridad laboral en su empresa.
                </p>
            </div>
        </div>
    )
}