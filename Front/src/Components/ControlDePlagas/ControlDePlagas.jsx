import Styles from './ControlDePlagas.module.css'

export default function ControlPlagas() {
    return (
        <div className={Styles.divMayor}>
            <div className={Styles.imgContainer}>
                <img src='/assets/imagenes/plagas.jpg' alt='HyS Control de Plagas' />
            </div>
            <div className={Styles.textContainer}>
                <h2>Control de Plagas</h2>
                <p>
                    En nuestra sección dedicada al Control de Plagas, nos especializamos en proteger su hogar, empresa o establecimiento de infestaciones de plagas no deseadas. Reconocemos la importancia de mantener un ambiente limpio y seguro, libre de cualquier tipo de plagas que puedan representar un riesgo para la salud y el bienestar.
                </p>
                <p>
                    En nuestra empresa, contamos con un equipo de expertos en control de plagas que utiliza métodos efectivos y respetuosos con el medio ambiente para eliminar y prevenir la presencia de plagas. Nuestros servicios están diseñados para adaptarse a las necesidades específicas de cada cliente, garantizando resultados duraderos y satisfactorios.
                </p>
                <p>
                    Nuestros servicios de control de plagas incluyen:
                    <ul>
                        <li>Inspección y evaluación: Realizamos inspecciones exhaustivas para identificar el tipo de plagas presentes y evaluar el alcance del problema.</li>
                        <li>Tratamientos personalizados: Desarrollamos planes de control de plagas personalizados que se adaptan a las necesidades específicas de cada cliente y tipo de infestación.</li>
                        <li>Control y eliminación: Utilizamos métodos seguros y efectivos para controlar y eliminar las plagas presentes en su propiedad, minimizando el riesgo de daños y enfermedades.</li>
                        <li>Prevención: Implementamos medidas preventivas para evitar futuras infestaciones y mantener su propiedad protegida a largo plazo.</li>
                    </ul>
                </p>
                <p>
                    En nuestra empresa, nos comprometemos a utilizar productos y técnicas de control de plagas que sean seguros para usted, su familia y el medio ambiente. Nuestro objetivo es brindarle tranquilidad y protección contra las plagas, para que pueda disfrutar de un ambiente limpio y saludable en todo momento.
                </p>
                <p>
                    Confíe en nosotros para proporcionar soluciones efectivas y confiables en el control de plagas. Contáctenos hoy mismo para obtener más información sobre cómo podemos ayudarlo a mantener su propiedad libre de plagas.
                </p>
            </div>
        </div>
    )
}