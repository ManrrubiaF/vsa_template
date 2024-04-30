import Styles from './HySAmbiental.module.css'

export default function HySAmbiental() {
    return (
        <div className={Styles.divMayor}>
            <div className={Styles.imgContainer}>
                <img src='/assets/imagenes/ambiental.jpg' alt='HyS Ambiental' />
            </div>
            <div className={Styles.textContainer}>
                <h2>Higiene y Seguridad Ambiental</h2>
                <p>
                    En nuestra sección dedicada a la Higiene y Seguridad Ambiental, nos comprometemos a proteger y preservar el medio ambiente mientras mantenemos entornos de trabajo seguros y saludables. Reconocemos la importancia de minimizar el impacto ambiental de las operaciones industriales y adoptar prácticas sostenibles.
                </p>
                <p>
                    En nuestra empresa, ofrecemos una amplia gama de servicios y soluciones diseñadas para cumplir con los más altos estándares de protección ambiental y seguridad. Trabajamos en estrecha colaboración con nuestros clientes para identificar y mitigar los riesgos ambientales asociados con sus actividades.
                </p>
                <p>
                    Nuestros servicios incluyen:
                    <ul>
                        <li>Evaluación ambiental: Realizamos evaluaciones exhaustivas para identificar posibles impactos ambientales y desarrollar estrategias de mitigación.</li>
                        <li>Gestión de residuos: Ofrecemos soluciones integrales para la gestión adecuada de residuos, incluida la reducción, reutilización y reciclaje.</li>
                        <li>Monitoreo ambiental: Implementamos sistemas de monitoreo para controlar la calidad del aire, agua y suelo, garantizando el cumplimiento de los estándares ambientales.</li>
                        <li>Formación en prácticas sostenibles: Capacitamos al personal en prácticas ambientales responsables y sostenibles para promover una cultura de respeto por el medio ambiente.</li>
                    </ul>
                </p>
                <p>
                    En nuestra empresa, nos comprometemos a cumplir con todas las regulaciones y normativas ambientales aplicables, así como a buscar constantemente oportunidades para mejorar nuestro desempeño ambiental.
                </p>
                <p>
                    Confíe en nosotros para brindar soluciones ambientales efectivas que protejan el medio ambiente y promuevan la sostenibilidad a largo plazo. Contáctenos hoy mismo para obtener más información sobre cómo podemos ayudarlo a cumplir con sus objetivos ambientales y de seguridad.
                </p>
            </div>
        </div>
    )
}