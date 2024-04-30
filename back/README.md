<h1 align="center"> Plantilla_server <h1>
<h4 align="center">Esta es una plantilla de servidor para e-commerce diseñada como modelo base, editable y reutilizable. Ofrece la capacidad de realizar una carga inicial rápida a la base de datos a través de un archivo JSON. Esta plantilla se ha desarrollado utilizando TypeScript (TS), JsonWebToken, Express y Sequelize V6, lo que la hace una elección sólida para la construcción de aplicaciones de comercio electrónico escalables y seguras.
</h4>

<h3 align="center" color="blue"> Paso a Paso </h3>
<ul>
  <li>Forkear repositorio y descargarlo.</li>
  <li>Editar el archivo .JSON en la carpeta "./api" y rellenarlo con los datos necesario acorde a la estructura de los modelos.</li>
  <li> en index.ts deben habilitar el 'force:true', descomentar la importación de firstLoad y su llamado a función.
    <pre><code>
    //import firstload from "./src/utils/firstload";
    server.use('/', routes);
    server.get('/', (req: Request, res: Response) => {
    res.send('¡Bienvenido al servidor estándar!');
    });    
    sequelize.sync({force:false}).then(() => {
    //firstload();
    </code></pre>
  </li>
  <li>Dentro de la carpeta del servidor, debe correr en consola los comandos:
    <pre><code>
      npm install
      npm install reflect-metadata
    </code></pre>
  </li>
  <li>Recuerde modificar su archivo .env de acuerdo a las variables declaradas en la carpeta /src/lib </li>
  <li>Ejecute 
    <pre><code>
      npm start
    </code></pre>
    y listo. Deberia estar corriendo.</li>
</ul>

<div>
  <h2>Recuerde respetar las estructuras de los modelos al cargar los datos:</h2>
  <pre><code>
    {
    "products":[
        {
            "price": "Precio del producto 1",
            "name": "Nombre del producto 1",
            "description": "Descripción del producto 1",
            "active": true,
            "category": "Categoría del producto 1",
            "details": [
              {
                "color": "color",
                "stock": 10,
                "image": ["url de imagen", "url de imagen"]
              },
              {
                "color": "Rojo",
                "stock": 5,
                "image": ["url de imagen", "url de imagen"]
              }
            ]
          }
    ]
}
  </code></pre>
  <p> Deben saber que por defecto 'price' puede ser nulo, y la propiedad 'active' por defecto es true</p>
</div>
