// =====================================
// MALUT STORE
// Catálogo dinámico
// =====================================

// URL de la API
const API_URL =
"https://script.google.com/macros/s/AKfycbyfPSoT3p0hdp1xgXcjP3v9ygMlICKAWPcPVvrI503qEOTuapOavm3NZDO19T4YQ_Sv/exec";

const numeroWhatsApp = "573107799993";

// =====================================
// Configuración
// =====================================

// Cantidad de productos por carga
const PRODUCTOS_POR_CARGA = 18;

// =====================================
// Variables globales
// =====================================

// Almacena todos los productos cargados
const catalogo = {};

// Cantidad de productos visibles por categoría
let productosVisibles = {};

// Controla el desplazamiento automático
let scrollRealizado = false;

// Filtros seleccionados
const filtrosActivos = {};

// Productos filtrados por categoría
const productosFiltrados = {};

// =====================================
// CONFIGURACIÓN DE FILTROS POR CATEGORÍA
// =====================================

const configuracionFiltros = {

    dama: [
        "Tipo",
        "Marca",
        "Talla"
    ],

    caballero: [
        "Tipo",
        "Marca",
        "Talla"
    ],

    zapatos: [
    "Tipo",
    "Genero",
    "Marca",
    "Talla"
],

    perfumes: [
        "Marca",
        "Genero",
        "Tipo"
    ],


    accesorios: [
    "Tipo",
    "Marca",
    "Genero",
    "Color"
],

    promociones: [
        "Tipo",
        "Genero",
        "Color"
    ]

};

document.addEventListener("DOMContentLoaded", async () => {

    await Promise.all([

        cargarCategoria("dama"),

        cargarCategoria("caballero"),

        cargarCategoria("zapatos"),

        cargarCategoria("perfumes"),

        cargarCategoria("accesorios"),

        cargarCategoria("promociones")

    ]);


});

// =====================================
// Cargar categoría
// =====================================

async function cargarCategoria(categoria){

    try{

        const respuesta = await fetch(API_URL + "?categoria=" + categoria);

        const datos = await respuesta.json();
        catalogo[categoria] = datos.productos;

console.log("Categoría:", categoria);
console.log(datos);
console.log(Array.isArray(datos));

mostrarProductos(datos.productos, categoria);
generarFiltro(categoria, "Tipo");
generarFiltro(categoria, "Marca");
generarFiltro(categoria, "Genero");
generarFiltroColor(categoria);

actualizarFiltroTallas(datos.productos, categoria);
generarPanelFiltros(categoria);

    }
    catch(error){

        console.error("Error al cargar productos:", error);

    }

}

// =====================================
// Mostrar productos
// =====================================

function mostrarProductos(productos, categoria){

    const seccion = document.getElementById(categoria);
    const contenedor = document.getElementById("productos-" + categoria);

    contenedor.innerHTML = "";

    // Si no hay productos, ocultar la sección
    if(productos.length === 0){

        seccion.style.display = "none";

        return;

    }

    // Mostrar la sección
    seccion.style.display = "block";

    // Si es la primera vez, mostrar solo los primeros productos
    if(!productosVisibles[categoria]){

        productosVisibles[categoria] = PRODUCTOS_POR_CARGA;

    }

    // Crear una copia de los productos
    let productosOrdenados = [...productos];

    // Solo Caballero: ordenar los productos por Tipo
if(categoria === "caballero"){

    const ordenTiposCaballero = [
        "Franela",
        "Camisa Polo",
        "Buso",
        "Conjunto deportivo",
        "Jean",
        "Bermuda",
        "Pantaloneta",
        "Tenis",
        "Zapatos",
        "Botas",
        "Sandalias",
        "Boxer",
        "Medias"
    ];

    productosOrdenados.sort((a, b) => {

        const tipoA = (a.Tipo || "").trim();
        const tipoB = (b.Tipo || "").trim();

        let indiceA = ordenTiposCaballero.indexOf(tipoA);
        let indiceB = ordenTiposCaballero.indexOf(tipoB);

        if(indiceA === -1) indiceA = ordenTiposCaballero.length;
        if(indiceB === -1) indiceB = ordenTiposCaballero.length;

        return indiceA - indiceB;

    });

}


// Solo Dama: ordenar los productos por Tipo
if(categoria === "dama"){

    const ordenTiposDama = [
        "Conjunto Deportivo",
        "Conjunto",
        "Enterizo",
        "Licra Deportiva",
        "Franela",
        "Body",
        "Camisa Polo",
        "Jean",
        "Short",
        "Tenis",
        "Sandalias"
    ];

    productosOrdenados.sort((a, b) => {

        const tipoA = (a.Tipo || "").trim();
        const tipoB = (b.Tipo || "").trim();

        let indiceA = ordenTiposDama.indexOf(tipoA);
        let indiceB = ordenTiposDama.indexOf(tipoB);

        if(indiceA === -1) indiceA = ordenTiposDama.length;
        if(indiceB === -1) indiceB = ordenTiposDama.length;

        return indiceA - indiceB;

    });

}
// Solo Accesorios: ordenar los productos por Tipo
if(categoria === "accesorios"){

    const ordenTiposAccesorios = [
        "Reloj",
        "Gorra",
        "Billetera",
        "Correa",
        "Bolso",
        "Lentes"
    ];

    productosOrdenados.sort((a, b) => {

        const tipoA = (a.Tipo || "").trim();
        const tipoB = (b.Tipo || "").trim();

        let indiceA = ordenTiposAccesorios.indexOf(tipoA);
        let indiceB = ordenTiposAccesorios.indexOf(tipoB);

        if(indiceA === -1) indiceA = ordenTiposAccesorios.length;
        if(indiceB === -1) indiceB = ordenTiposAccesorios.length;

        return indiceA - indiceB;

    });

}

// Solo Promociones: ordenar los productos por Tipo
if(categoria === "promociones"){

    const ordenTiposPromociones = [
        "Franela",
        "Camisa Polo",
        "Buso",
        "Body",
        "Conjunto Running",
        "Conjunto deportivo",
        "Jean",
        "Bermuda",
        "Short",
        "Pantaloneta",
        "Tenis",
        "Zapatos",
        "Sandalias",
        "Reloj",
        "Gorra",
        "Billetera",
        "Correa",
        "Bolso",
        "Lentes",
        "Perfume",
        "Boxer"
    ];

    productosOrdenados.sort((a, b) => {

        const tipoA = (a.Tipo || "").trim();
        const tipoB = (b.Tipo || "").trim();

        let indiceA = ordenTiposPromociones.indexOf(tipoA);
        let indiceB = ordenTiposPromociones.indexOf(tipoB);

        if(indiceA === -1) indiceA = ordenTiposPromociones.length;
        if(indiceB === -1) indiceB = ordenTiposPromociones.length;

        return indiceA - indiceB;

    });

}
// Solo Zapatos: ordenar los productos por Tipo
if(categoria === "zapatos"){

    const ordenTiposZapatos = [
        "Tenis",
        "Zapato Casual",
        "Botas",
        "Sandalias"
    ];

    productosOrdenados.sort((a, b) => {

        const tipoA = (a.Tipo || "").trim();
        const tipoB = (b.Tipo || "").trim();

        let indiceA = ordenTiposZapatos.indexOf(tipoA);
        let indiceB = ordenTiposZapatos.indexOf(tipoB);

        if(indiceA === -1) indiceA = ordenTiposZapatos.length;
        if(indiceB === -1) indiceB = ordenTiposZapatos.length;

        return indiceA - indiceB;

    });

}

    // Obtener únicamente los productos que deben verse
    const productosMostrar =
        productosOrdenados.slice(0, productosVisibles[categoria]);

    // Pintar tarjetas
    productosMostrar.forEach(producto => {

        contenedor.innerHTML += crearTarjeta(producto, categoria);

    });

    // Inicializar el estado de los botones
    contenedor.querySelectorAll(".producto-card").forEach(tarjeta => {

        actualizarBotonCompra(tarjeta);

    });

    // Crear botón "Ver más"
    crearBotonMostrarMas(categoria, productos.length);

}
// =====================================
// Agregar productos a una categoría
// =====================================

function agregarProductos(categoria, productos){

    const contenedor =
        document.getElementById("productos-" + categoria);

    productos.forEach(producto => {

        contenedor.innerHTML += crearTarjeta(producto, categoria);

        const tarjeta =
            contenedor.lastElementChild;

        actualizarBotonCompra(tarjeta);

    });

}

// =====================================
// Crear botón "Ver más productos"
// =====================================

function crearBotonMostrarMas(categoria, totalProductos){

    const contenedorBoton =
        document.getElementById("mostrar-mas-" + categoria);

    if(!contenedorBoton) return;

    // Limpiar contenido anterior
    contenedorBoton.innerHTML = "";

    // Si ya se muestran todos los productos,
    // no crear el botón
    if(productosVisibles[categoria] >= totalProductos){

        return;

    }

    contenedorBoton.innerHTML = `
    
        <button
            class="btn-mostrar-mas"
            onclick="mostrarMas('${categoria}')">

            Ver más productos

        </button>

    `;

}
// =====================================
// Mostrar más productos
// =====================================

function mostrarMas(categoria){

    // Obtener todos los productos de la categoría
    let productos = productosFiltrados[categoria] || catalogo[categoria];

// Mantener el mismo orden especial de Caballero
if(categoria === "caballero"){

    const ordenTiposCaballero = [
        "Franela",
        "Camisa Polo",
        "Buso",
        "Conjunto deportivo",
        "Jean",
        "Bermuda",
        "Pantaloneta",
        "Tenis",
        "Zapatos",
        "Botas",
        "Sandalias",
        "Boxer",
        "Medias"
    ];

    productos = [...productos].sort((a, b) => {

        const tipoA = (a.Tipo || "").trim();
        const tipoB = (b.Tipo || "").trim();

        let indiceA = ordenTiposCaballero.indexOf(tipoA);
        let indiceB = ordenTiposCaballero.indexOf(tipoB);

        if(indiceA === -1) indiceA = ordenTiposCaballero.length;
        if(indiceB === -1) indiceB = ordenTiposCaballero.length;

        return indiceA - indiceB;

    });

}
// Solo Dama: ordenar los productos por Tipo
if(categoria === "dama"){

    const ordenTiposDama = [
        "Conjunto Deportivo",
        "Conjunto",
        "Enterizo",
        "Licra Deportiva",
        "Franela",
        "Body",
        "Camisa Polo",
        "Jean",
        "Short",
        "Tenis",
        "Sandalias"
    ];

    productos = [...productos].sort((a, b) => {

        const tipoA = (a.Tipo || "").trim();
        const tipoB = (b.Tipo || "").trim();

        let indiceA = ordenTiposDama.indexOf(tipoA);
        let indiceB = ordenTiposDama.indexOf(tipoB);

        // Si aparece un Tipo nuevo, enviarlo al final
        if(indiceA === -1) indiceA = ordenTiposDama.length;
        if(indiceB === -1) indiceB = ordenTiposDama.length;

        return indiceA - indiceB;

    });

}
// Solo Accesorios: ordenar los productos por Tipo
if(categoria === "accesorios"){

    const ordenTiposAccesorios = [
        "Reloj",
        "Gorra",
        "Billetera",
        "Correa",
        "Bolso",
        "Lentes"
    ];

    productos = [...productos].sort((a, b) => {

        const tipoA = (a.Tipo || "").trim();
        const tipoB = (b.Tipo || "").trim();

        let indiceA = ordenTiposAccesorios.indexOf(tipoA);
        let indiceB = ordenTiposAccesorios.indexOf(tipoB);

        if(indiceA === -1) indiceA = ordenTiposAccesorios.length;
        if(indiceB === -1) indiceB = ordenTiposAccesorios.length;

        return indiceA - indiceB;

    });

}
// Solo Promociones: ordenar los productos por Tipo
if(categoria === "promociones"){

    const ordenTiposPromociones = [
        "Franela",
        "Camisa Polo",
        "Buso",
        "Body",
        "Conjunto Running",
        "Conjunto deportivo",
        "Jean",
        "Bermuda",
        "Short",
        "Pantaloneta",
        "Tenis",
        "Zapatos",
        "Sandalias",
        "Reloj",
        "Gorra",
        "Billetera",
        "Correa",
        "Bolso",
        "Lentes",
        "Perfume",
        "Boxer"
    ];

    productos = [...productos].sort((a, b) => {

        const tipoA = (a.Tipo || "").trim();
        const tipoB = (b.Tipo || "").trim();

        let indiceA = ordenTiposPromociones.indexOf(tipoA);
        let indiceB = ordenTiposPromociones.indexOf(tipoB);

        if(indiceA === -1) indiceA = ordenTiposPromociones.length;
        if(indiceB === -1) indiceB = ordenTiposPromociones.length;

        return indiceA - indiceB;

    });

}

// Solo Zapatos: ordenar los productos por Tipo
if(categoria === "zapatos"){

    const ordenTiposZapatos = [
        "Tenis",
        "Zapato Casual",
        "Botas",
        "Sandalias"
    ];

    productos.sort((a, b) => {

        const tipoA = (a.Tipo || "").trim();
        const tipoB = (b.Tipo || "").trim();

        let indiceA = ordenTiposZapatos.indexOf(tipoA);
        let indiceB = ordenTiposZapatos.indexOf(tipoB);

        if(indiceA === -1) indiceA = ordenTiposZapatos.length;
        if(indiceB === -1) indiceB = ordenTiposZapatos.length;

        return indiceA - indiceB;

    });

}

    // Desde dónde empezar
    const inicio = productosVisibles[categoria];

    // Hasta dónde llegar
    const fin = inicio + PRODUCTOS_POR_CARGA;

    // Obtener únicamente los siguientes productos
    const nuevosProductos = productos.slice(inicio, fin);

    // Agregarlos al catálogo
    agregarProductos(categoria, nuevosProductos);

    // Actualizar el contador
    productosVisibles[categoria] += nuevosProductos.length;

    // Actualizar el botón
    crearBotonMostrarMas(categoria, productos.length);

}

// =====================================
// Crear tarjeta
// =====================================

function crearTarjeta(producto, categoria){

    const precioOriginal = Number(producto.Precio);

let htmlPrecio = "";

if(producto.Oferta && producto.Oferta !== "N/A"){

    const descuento = Number(producto.Oferta);

    const precioFinal = precioOriginal - (precioOriginal * descuento / 100);

    htmlPrecio = `

        <p class="precio-anterior">

            $${precioOriginal.toLocaleString("es-CO")}

        </p>

        <p class="precio">

            $${precioFinal.toLocaleString("es-CO")}

        </p>

    `;

}
else{

    htmlPrecio = `

        <p class="precio">

            $${precioOriginal.toLocaleString("es-CO")}

        </p>

    `;

}

    return `

<div
    class="producto-card"
    onclick="activarTarjeta(this, event)">

    <div class="producto-imagen">

    ${crearBadges(producto)}

    <img
class="imagen-producto ${!producto.Disponible ? 'imagen-agotada' : ''}"
data-categoria="${categoria}"
data-archivo="${producto.ArchivoImagen}"
src="images/productos/${categoria}/${producto.ArchivoImagen}"
alt="${producto.Nombre}"
onclick="abrirImagenProducto(this)"
>

    ${crearEstado(producto)}

</div>

<div class="producto-info">

    <h4>${producto.Nombre}</h4>

    ${crearMarca(producto)}

    ${crearInformacionProducto(producto, categoria)}

    ${htmlPrecio}

${categoria === "perfumes" ? `

<button
    type="button"
    class="boton-notas"
    onclick="mostrarNotas(this)">

    <i class="fa-solid fa-spray-can-sparkles"></i>
    Ver notas

</button>

` : ""}

<a
href="#"
class="boton-producto"
    onclick="abrirWhatsApp(event,'${categoria}','${producto.ID}')">

    <i class="fa-brands fa-whatsapp"></i> Comprar

</a>

</div>

</div>

`;

}
// =====================================
// Abrir imagen del producto
// =====================================

function abrirImagenProducto(imagen){

    const visor = document.getElementById("visor-imagen");

    const imagenGrande = document.getElementById("imagen-ampliada");

    imagenGrande.src = imagen.src;

    visor.classList.add("activo");

}
// =====================================
// Cerrar imagen del producto
// =====================================

function cerrarImagenProducto(){

    const visor = document.getElementById("visor-imagen");

    visor.classList.remove("activo");

}
// =====================================
// Mostrar / ocultar notas del perfume
// =====================================

function mostrarNotas(boton){

    const tarjeta = boton.closest(".producto-card");

    const imagen = tarjeta.querySelector(".imagen-producto");

    const categoria = imagen.dataset.categoria;

    const archivo = imagen.dataset.archivo;

    // Solo funciona para perfumes
    if(categoria !== "perfumes") return;

    // Nombre del archivo sin extensión
    const nombreBase = archivo.substring(
        0,
        archivo.lastIndexOf(".")
    );

    // Extensión original
    const extension = archivo.substring(
        archivo.lastIndexOf(".")
    );

    // Si ya estamos mostrando las notas,
// volver a la imagen original
if(boton.dataset.mostrandoNotas === "true"){

    imagen.style.opacity = "0";

    setTimeout(() => {

        imagen.src =
            `images/productos/${categoria}/${archivo}`;

        imagen.style.opacity = "1";

        boton.innerHTML =
            `<i class="fa-solid fa-spray-can-sparkles"></i> Ver notas`;

        boton.dataset.mostrandoNotas = "false";

    }, 150);

    return;

}

// Crear nombre de la imagen de notas
const archivoNotas =
    `${nombreBase}-notas${extension}`;

    // Ruta de la imagen de notas
    const rutaNotas =
        `images/productos/${categoria}/${archivoNotas}`;

    // Comprobar si existe
    const prueba = new Image();

    prueba.onload = function(){

        imagen.style.opacity = "0";

        setTimeout(() => {

            imagen.src = rutaNotas;

            imagen.style.opacity = "1";

            boton.innerHTML =
                `<i class="fa-solid fa-arrow-left"></i> Ver perfume`;

            boton.dataset.mostrandoNotas = "true";

        }, 150);

    };

    prueba.onerror = function(){

        alert("Este perfume todavía no tiene una imagen de notas.");

    };

    prueba.src = rutaNotas;

}
// =====================================
// Crear badges (Nuevo / Oferta / Destacado)
// =====================================

function crearBadges(producto){

    let html = '<div class="badges-superiores">';

    if(producto.Oferta && producto.Oferta !== "N/A"){

        html += `<span class="badge oferta">-${producto.Oferta}% OFF</span>`;

    }

    else if(producto.Nuevo === "SI"){

        html += '<span class="badge nuevo">Nuevo</span>';

    }

    else if(producto.Destacado === "SI"){

        html += '<span class="badge destacado">Destacado</span>';

    }

    html += '</div>';

    return html;

}

// =====================================
// Marca
// =====================================

function crearMarca(producto){

    if(!producto.Marca){

        return "";

    }

    return `<p class="marca">${producto.Marca}</p>`;

}

// =====================================
// Estado del producto
// =====================================

function crearEstado(producto){

    // Si está disponible, no mostrar nada
    if(producto.Disponible){

        return "";

    }

    // Solo mostrar cuando esté agotado
    return `
        <p class="estado agotado">
            <i class="fa-solid fa-xmark"></i>
            Agotado
        </p>
    `;

}
function crearTallas(tallas){

    if(!tallas) return "";

    const lista = tallas.split(/[,;-]/);

    let html = '<div class="tallas-container">';

    lista.forEach(talla=>{

        html += `
    <span
        class="talla-chip"
        onclick="seleccionarTalla(this)"
        data-talla="${talla.trim()}">

        ${talla.trim()}

    </span>
`;

    });

    html += "</div>";

    return html;

}
function crearColores(colores){

    if(!colores) return "";

    const variantes = colores.split(";");

    let html = '<div class="colores-container">';

    variantes.forEach(variante=>{

        html += crearColor(variante.trim());

    });

    html += "</div>";

    return html;

}
function crearColor(color){
    // Color especial: Multicolor
if(color.trim().toLowerCase() === "multicolor"){

    return `
        <span
        class="color-chip"
        title="Multicolor"
        data-color="Multicolor"
        onclick="seleccionarColor(this)"
        style="
            background:linear-gradient(
                90deg,
                #ff0000 0%,
                #ff9800 20%,
                #ffeb3b 40%,
                #4caf50 60%,
                #2196f3 80%,
                #9c27b0 100%
            );
        ">
    </span>
`;

}
// Color especial: Transparente
if(color.trim().toLowerCase() === "transparente"){

    return `
        <span
        class="color-chip"
        title="Transparente"
        data-color="Transparente"
        onclick="seleccionarColor(this)"
        style="
            background:#ffffff;
            border:2px solid #bdbdbd;
            box-sizing:border-box;
        ">
    </span>
`;

}
 // Colores dobles
    if(color.includes("+")){

        const partes = color.split("+");

        const color1 = obtenerColor(partes[0].trim());

        const color2 = obtenerColor(partes[1].trim());

        return `
             <span
        class="color-chip"
        title="${partes[0]} / ${partes[1]}"
        data-color="${partes[0].trim()}+${partes[1].trim()}"
        onclick="seleccionarColor(this)"
        style="background:linear-gradient(
            90deg,
            ${color1} 0%,
            ${color1} 50%,
            ${color2} 50%,
            ${color2} 100%
        );">
    </span>
`;

    }

    return `
    <span
        class="color-chip"
        title="${color}"
        data-color="${color.trim()}"
        onclick="seleccionarColor(this)"
        style="background:${obtenerColor(color.trim())}">
    </span>
`;

}
 // Colores normales
function obtenerColor(color){
    color = color.toLowerCase().trim();

    const colores = {

        negro:"#000000",
        blanco:"#ffffff",
        gris:"#808080",
        plata:"#c0c0c0",
        dorado:"#d4af37",
        beige:"#e8d3b3",
        cafe:"#6f4e37",
        marron:"#6f4e37",
        crema:"#f5f5dc",
        militar:"#4b5320",
"verde militar":"#4b5320",
        azul:"#1565c0",
"azul claro":"#4fc3f7",
"azul oscuro":"#0b3d91",
celeste:"#4fc3f7",
        camel:"#c19a6b",
        grisclaro:"#d3d3d3",
        grisoscuro:"#555555",
        azulmarino:"#0b3d91",
        celeste:"#4fc3f7",
        rojo:"#d32f2f",
        vinotinto:"#800020",
        rosado:"#ec407a",
"rosado claro":"#f8bbd0",
"palo rosa":"#f8bbd0",
fucsia:"#ff1493",
        morado:"#8e24aa",
        lila:"#b39ddb",
        verde:"#43a047",
        oliva:"#556b2f",
        lima:"#bfff00",
        amarillo:"#fdd835",
        naranja:"#fb8c00",
        
        

    };

    return colores[color] || "#cccccc";

}
// =====================================
// SELECCIONAR TALLA
// =====================================

function seleccionarTalla(elemento){

    const contenedor = elemento.parentElement;

    // Si ya estaba seleccionada, quitar selección
    if(elemento.classList.contains("seleccionada")){

        elemento.classList.remove("seleccionada");

    }else{

        // Quitar selección de las demás
        contenedor.querySelectorAll(".talla-chip").forEach(talla=>{

            talla.classList.remove("seleccionada");

        });

        // Seleccionar la nueva
        elemento.classList.add("seleccionada");

    }

    const tarjeta = elemento.closest(".producto-card");

    // Esta tarjeta pasa a ser la activa
    activarTarjeta(tarjeta);

    // Actualizar el estado del botón
    actualizarBotonCompra(tarjeta);

    // Si el usuario ya intentó comprar,
    // actualizar el mensaje
    if(tarjeta.dataset.validando === "true"){

        actualizarEstadoSeleccion(tarjeta);

    }

}
// =====================================
// SELECCIONAR COLOR
// =====================================

function seleccionarColor(elemento){

    const contenedor = elemento.parentElement;

    // Si ya estaba seleccionado, quitar selección
    if(elemento.classList.contains("seleccionado")){

        elemento.classList.remove("seleccionado");

    }else{

        // Quitar selección de los demás
        contenedor.querySelectorAll(".color-chip").forEach(color=>{

            color.classList.remove("seleccionado");

        });

        // Seleccionar el nuevo
        elemento.classList.add("seleccionado");

    }

    const tarjeta = elemento.closest(".producto-card");

    // Cambiar la imagen del producto
    cambiarImagenColor(elemento, elemento.dataset.color);

    // Activar esta tarjeta
    activarTarjeta(tarjeta);

    // Actualizar el estado del botón
    actualizarBotonCompra(tarjeta);

    // Si el usuario ya intentó comprar,
    // actualizar el mensaje
    if(tarjeta.dataset.validando === "true"){

        actualizarEstadoSeleccion(tarjeta);

    }

}
// =====================================
// CAPITALIZAR TEXTO
// =====================================

function capitalizar(texto){

    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

}
// =====================================
// NORMALIZAR COLOR
// =====================================

function normalizarColor(color){

    color = color.trim().toLowerCase();

    const equivalencias = {

        "azul claro": "Azul",
        "azul oscuro": "Azul",
        "celeste": "Azul",

        "verde militar": "Verde",
        "oliva": "Verde",

        "rosado claro": "Rosado",
        "fucsia": "Rosado",
        "palo rosa": "Rosado",

        "cafe": "Marrón",
        "café": "Marrón",
        "marron": "Marrón",
        "marrón": "Marrón",

        "beige": "Crema"

    };

    return equivalencias[color] || capitalizar(color);

}

// =====================================
// Información del producto
// =====================================

function crearInformacionProducto(producto, categoria){

    let html = '<div class="badges">';

    // Solo Perfumes
    if(categoria === "perfumes"){

        if(producto.Tipo){

    const tipo = producto.Tipo.toLowerCase().trim();

    let claseTipo = "badge-tipo";

    if(tipo === "original"){

        claseTipo += " tipo-original";

    }

    if(tipo === "versión 1.1"){

        claseTipo += " tipo-1-1";

    }

    html += `
        <span class="${claseTipo}">
            ${producto.Tipo}
        </span>
    `;

}

        if(producto.Genero){

    const genero = producto.Genero.toLowerCase().trim();

    let claseGenero = "badge-genero";

    if(genero === "hombre"){

        claseGenero += " genero-hombre";

    }

    if(genero === "mujer"){

        claseGenero += " genero-mujer";

    }

    if(genero === "unisex"){

        claseGenero += " genero-unisex";

    }

    html += `
        <span class="${claseGenero}">
            ${producto.Genero}
        </span>
    `;

}

    }

    html += '</div>';

    // Dama y Caballero
    if(
    categoria === "dama" ||
    categoria === "caballero" ||
    categoria === "zapatos"
){

        if(producto.Tallas){

            html += crearTallas(producto.Tallas);
        }

        if(producto.Colores){

    html += crearColores(producto.Colores);

}


    }

    // Accesorios
    if(categoria === "accesorios"){

        if(producto.Genero){

            html += `
            <p class="detalle-producto">
                <strong>Género:</strong> ${producto.Genero}
            </p>`;
        }

        if(producto.Colores){

    html += crearColores(producto.Colores);

}

    }
    // Promociones
if(categoria === "promociones"){

    if(producto.Tallas){

        html += crearTallas(producto.Tallas);

    }

    if(producto.Colores){

        html += crearColores(producto.Colores);

    }

}

    // Mensaje de validación
if(categoria !== "perfumes"){

    html += `
        <div class="mensaje-seleccion"></div>
    `;

}
    return html;

}

// =====================================
// WhatsApp
// =====================================

function abrirWhatsApp(event, categoria, id){

    event.preventDefault();

    const boton = event.currentTarget;
    const tarjeta = boton.closest(".producto-card");

    // Si el botón está deshabilitado,
    // comenzar la validación
    if(boton.classList.contains("deshabilitado")){

        tarjeta.dataset.validando = "true";

        actualizarEstadoSeleccion(tarjeta);

        return;

    }

    // Buscar el producto
    const producto = catalogo[categoria].find(p => p.ID === id);

    if(!producto){

        alert("No se encontró el producto.");

        return;

    }

    const tallaSeleccionada = tarjeta.querySelector(".talla-chip.seleccionada");
    const colorSeleccionado = tarjeta.querySelector(".color-chip.seleccionado");

    let mensaje = `Hola 👋

Estoy interesado(a) en este producto de Malut Store.

🆔 ID: ${producto.ID}
🛍 Producto: ${producto.Nombre}
🏷 Marca: ${producto.Marca}
📂 Categoría: ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}
`;

    if(tallaSeleccionada){

        mensaje += `📏 Talla: ${tallaSeleccionada.dataset.talla}\n`;

    }

    if(colorSeleccionado){

        mensaje += `🎨 Color: ${colorSeleccionado.dataset.color}\n`;

    }

    // Precio
    if(producto.Oferta && producto.Oferta !== "N/A"){

        const precioFinal =
            Number(producto.Precio) -
            (Number(producto.Precio) * Number(producto.Oferta) / 100);

        mensaje += `💲 Precio: $${precioFinal.toLocaleString("es-CO")}\n`;

    }else{

        mensaje += `💲 Precio: $${Number(producto.Precio).toLocaleString("es-CO")}\n`;

    }

    mensaje += `\n¿Podrían confirmarme la disponibilidad?`;

    const url =
`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");

    // Limpiar la tarjeta para dejarla como nueva
    limpiarTarjeta(tarjeta);

}
// =====================================
// FILTRO DE CATEGORÍAS
// =====================================

document.querySelectorAll(".categoria-card").forEach(card => {

    card.addEventListener("click", () => {

        const categoria = card.dataset.categoria;

        filtrarCategoria(categoria);

    });

});
function filtrarCategoria(categoria){

    const secciones = document.querySelectorAll(".categoria-productos");

    if(categoria === "todos"){

        secciones.forEach(seccion =>{

            seccion.style.display = "block";

        });

    }else{

        secciones.forEach(seccion =>{

            if(seccion.id === categoria){

                seccion.style.display = "block";

            }else{

                seccion.style.display = "none";

            }

        });

    }
    // Resaltar la tarjeta seleccionada

document.querySelectorAll(".categoria-card").forEach(card=>{

    card.classList.remove("activa");

    if(card.dataset.categoria===categoria){

        card.classList.add("activa");

    }

});

    // Baja automáticamente al catálogo
    document.getElementById("catalogo").scrollIntoView({

        behavior:"smooth"

    });

}
// =====================================
// BUSCADOR V2.0
// =====================================

// Buscar con Enter
document.getElementById("buscador").addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        buscarProductos();

    }

});

// Buscar con la lupa
document.getElementById("btnBuscar").addEventListener("click", function(){

    buscarProductos();

});

// Limpiar búsqueda
document.getElementById("limpiarBusqueda").addEventListener("click", function(){

    // Mostrar todo el catálogo
    Object.keys(catalogo).forEach(categoria => {

        mostrarProductos(catalogo[categoria], categoria);

    });

    // Limpiar buscador
    document.getElementById("buscador").value = "";

    this.style.display = "none";

    // Ocultar sugerencias
    const contenedor = document.getElementById("sugerencias");

    contenedor.innerHTML = "";

    contenedor.style.display = "none";

    // Volver al inicio
    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

// =====================================
// Buscar productos
// =====================================

function buscarProductos(){

    const texto = document
        .getElementById("buscador")
        .value
        .trim()
        .toLowerCase();

    if(texto.length < 3){

        alert("Escribe mínimo 3 caracteres.");

        return;

    }

    // Ocultar sugerencias
    const contenedor = document.getElementById("sugerencias");
    contenedor.innerHTML = "";
    contenedor.style.display = "none";

    // Filtrar productos
    filtrarProductos(texto);

    // Desplazar suavemente hasta "Nuestros Productos"
    const destino = document.getElementById("nuestros-productos");

    window.scrollTo({

        top: destino.offsetTop - 90,

        behavior: "smooth"

    });

}
// =====================================
// Filtrar productos
// =====================================

function filtrarProductos(texto){

    Object.keys(catalogo).forEach(categoria=>{

        const productos = catalogo[categoria];

        const filtrados = productos.filter(producto=>{

            return Object.values(producto).some(valor=>{

                if(valor == null) return false;

                return valor
                    .toString()
                    .toLowerCase()
                    .includes(texto);

            });

        });

        mostrarProductos(filtrados,categoria);

    });

}
// =====================================
// SUGERENCIAS DE BÚSQUEDA
// =====================================

document.getElementById("buscador").addEventListener("input", function(){

    const texto = this.value.trim().toLowerCase();

    const contenedor = document.getElementById("sugerencias");

    // Mostrar u ocultar la X
    document.getElementById("limpiarBusqueda").style.display =
        texto.length > 0 ? "block" : "none";

    // Ocultar sugerencias si escribe menos de 3 caracteres
    if(texto.length < 3){

        contenedor.style.display = "none";
        contenedor.innerHTML = "";

        return;

    }

    mostrarSugerencias(texto);

});
function mostrarSugerencias(texto){

    const contenedor = document.getElementById("sugerencias");

    contenedor.innerHTML = "";

    let sugerencias = [];

    Object.keys(catalogo).forEach(categoria=>{

        catalogo[categoria].forEach(producto=>{

            if(

                producto.Nombre &&
                producto.Nombre.toLowerCase().includes(texto)

            ){

                sugerencias.push(producto);

            }

        });

    });

    // Eliminar repetidos
    sugerencias = sugerencias.filter((producto,index,self)=>

        index===self.findIndex(p=>p.Nombre===producto.Nombre)

    );

    // Máximo 6 sugerencias
    sugerencias = sugerencias.slice(0,6);

    if(sugerencias.length===0){

        contenedor.style.display="none";

        return;

    }

    sugerencias.forEach(producto=>{

    contenedor.innerHTML += `

    <div class="sugerencia-item"
     onclick="seleccionarSugerencia('${producto.Nombre.replace(/'/g,"\\'")}')">

    <span>🔍 ${producto.Nombre}</span>

    <span class="flecha-sugerencia">

        <i class="fa-solid fa-arrow-right"></i>

    </span>

</div>

    `;

});

    contenedor.style.display="block";

}
// =====================================
// SELECCIONAR SUGERENCIA
// =====================================

function seleccionarSugerencia(nombre){

    // Colocar el nombre en el buscador
    document.getElementById("buscador").value = nombre;

    // Ocultar sugerencias
    const sugerencias = document.getElementById("sugerencias");

    sugerencias.innerHTML = "";

    sugerencias.style.display = "none";

    // Ejecutar búsqueda
    filtrarProductos(nombre.toLowerCase());

    // Mostrar la X
    document.getElementById("limpiarBusqueda").style.display = "block";

    // Ir a nuestros productos
    const destino = document.getElementById("nuestros-productos");

    window.scrollTo({

        top: destino.offsetTop - 90,

        behavior:"smooth"

    });

}
// =====================================
// MENÚ CON SCROLL SUAVE
// =====================================

document.querySelectorAll(".menu a[data-seccion]").forEach(enlace => {

    enlace.addEventListener("click", function(e){

        e.preventDefault();

        const seccion = this.dataset.seccion;

        // Solo Inicio hace scroll
        if(seccion === "inicio"){

            reiniciarFiltros();

            const destino = document.getElementById("inicio");

            if(destino){

                window.scrollTo({

                    top: destino.offsetTop - 80,

                    behavior:"smooth"

                });

            }

        }

    });

});
// Evitar que el navegador recuerde el scroll
if ("scrollRestoration" in history) {

    history.scrollRestoration = "manual";

}

window.addEventListener("load", () => {

    window.scrollTo({

        top: 0,

        left: 0,

        behavior: "instant"

    });

});

// =====================================
// HEADER INTELIGENTE
// =====================================

const menu = document.querySelector(".menu");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        menu.classList.add("scrolled");

    } else {

        menu.classList.remove("scrolled");

    }

});
// =====================================
// FILTROS
// =====================================

// =====================================
// OBTENER VALORES ÚNICOS
// =====================================

function obtenerValoresUnicos(productos, campo){

    const valores = [];

    productos.forEach(producto=>{

        if(
            producto[campo] &&
            !valores.includes(producto[campo])
        ){

            valores.push(producto[campo]);

        }

    });

    return valores.sort();

}
// =====================================
// GENERAR FILTRO GENÉRICO
// =====================================

function generarFiltro(categoria, campo){

    const contenedor = document.getElementById(
        "filtro-" + campo.toLowerCase() + "-" + categoria
    );

    if(!contenedor) return;

    contenedor.innerHTML = "";

    const valores = obtenerValoresUnicos(
    catalogo[categoria],
    campo
);

// Mostrar máximo 6 opciones
const visibles = valores.slice(0,6);

visibles.forEach(valor=>{

    contenedor.innerHTML += `

        <div
            class="item-filtro"
            data-${campo.toLowerCase()}="${valor}"
        >

            ${valor}

        </div>

    `;

});

// Si existen más opciones...
if(valores.length > 6){

    contenedor.innerHTML += `

        <div
            class="item-filtro ver-mas"
            data-categoria="${categoria}"
            data-campo="${campo}"
        >

            Ver más...

        </div>

    `;

}
// Eventos de clic
contenedor.querySelectorAll(".item-filtro").forEach(item=>{

    item.addEventListener("click", function(){

        // Si es "Ver más..."
        if(this.classList.contains("ver-mas")){

            return;

        }

        actualizarFiltro(
            categoria,
            campo,
            this.dataset[campo.toLowerCase()]
        );

    });

});

}
// =====================================
// ACTUALIZAR FILTRO TALLAS
// =====================================

function actualizarFiltroTallas(productos, categoria){

    const contenedor = document.getElementById("filtro-tallas-" + categoria);

    if(!contenedor) return;

    contenedor.innerHTML = "";

    const tallas = [];

    productos.forEach(producto=>{

        if(producto.Tallas){

            producto.Tallas.split("-").forEach(talla=>{

                talla = talla.trim();

                if(!tallas.includes(talla)){

                    tallas.push(talla);

                }

            });

        }

    });

    const ordenRopa = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL"
];

tallas.sort((a,b)=>{

    const aNumero = !isNaN(a);
    const bNumero = !isNaN(b);

    // Primero las tallas de ropa
    if(!aNumero && bNumero) return -1;

    if(aNumero && !bNumero) return 1;

    // Si ambos son números
    if(aNumero && bNumero){

        return Number(a) - Number(b);

    }

    // Si ambos son tallas de ropa
    const indiceA = ordenRopa.indexOf(a);
    const indiceB = ordenRopa.indexOf(b);

    if(indiceA !== -1 && indiceB !== -1){

        return indiceA - indiceB;

    }

    return a.localeCompare(b);

});

    // Mostrar máximo 6 tallas
const tallasVisibles = tallas.slice(0,6);

tallasVisibles.forEach(talla=>{

    contenedor.innerHTML += `

        <div
            class="item-filtro"
            data-talla="${talla}"
        >

            ${talla}

        </div>

    `;

});

// Si hay más tallas...
if(tallas.length > 6){

    contenedor.innerHTML += `

        <div
            class="item-filtro ver-mas"
            data-categoria="${categoria}"
            data-campo="Talla"
        >

            Ver más...

        </div>

    `;

}
   // Eventos de clic
contenedor.querySelectorAll(".item-filtro").forEach(item=>{

    item.addEventListener("click", function(){

        // Si es "Ver más..."
        if(this.classList.contains("ver-mas")){

            return;

        }

        actualizarFiltro(
            categoria,
            "Talla",
            this.dataset.talla
        );

    });

});

}
// =====================================
// GENERAR FILTRO COLOR
// =====================================

function generarFiltroColor(categoria){

    const contenedor = document.getElementById("filtro-color-" + categoria);

    if(!contenedor) return;

    contenedor.innerHTML = "";

    const colores = [];

    catalogo[categoria].forEach(producto=>{

        if(!producto.Colores) return;

        const variantes = producto.Colores.split(";");

        variantes.forEach(variante=>{

            const partes = variante.split("+");

            partes.forEach(color=>{

                const colorNormalizado = normalizarColor(color);

                if(!colores.includes(colorNormalizado)){

                    colores.push(colorNormalizado);

                }

            });

        });

    });

    colores.sort();

// Mostrar máximo 6 colores
const coloresVisibles = colores.slice(0,6);

coloresVisibles.forEach(color=>{

    contenedor.innerHTML += `

        <div
            class="item-filtro"
            data-color="${color}">

            ${crearColor(color)}

            <span>${color}</span>

        </div>

    `;

});

// Si existen más colores...
if(colores.length > 6){

    contenedor.innerHTML += `

        <div
            class="item-filtro ver-mas"
            data-categoria="${categoria}"
            data-campo="Color">

            Ver más...

        </div>

    `;

}
   // Eventos de clic
contenedor.querySelectorAll(".item-filtro").forEach(item=>{

    item.addEventListener("click", function(){

        // Si es "Ver más..."
        if(this.classList.contains("ver-mas")){

            return;

        }

        actualizarFiltro(
            categoria,
            "Color",
            this.dataset.color
        );

    });

});

}


// =====================================
// ACTUALIZAR FILTRO
// =====================================

function actualizarFiltro(categoria, nombreFiltro, valor){
    

    if(filtrosActivos[nombreFiltro] === valor){

    delete filtrosActivos[nombreFiltro];

}
else{

    filtrosActivos[nombreFiltro] = valor;

}

    aplicarFiltros(categoria);
    actualizarEstadoVisual(categoria);
    actualizarContadoresFiltros(categoria);
    actualizarBotonLimpiar(categoria);
    // Ocultar las demás categorías
Object.keys(catalogo).forEach(cat => {

    if(cat !== categoria){

        document.getElementById(cat).style.display = "none";

    }

});
// Desplazar hasta los productos
    const destino = document.getElementById("nuestros-productos");

    window.scrollTo({

        top: destino.offsetTop - 90,

        behavior: "smooth"

    });
    // Cerrar todos los mega menús
cerrarMegaMenus();

}
// =====================================
// APLICAR FILTROS
// =====================================

function aplicarFiltros(categoria){

    let resultado = catalogo[categoria];

    // Filtrar por Tipo
    if(filtrosActivos.Tipo){

        resultado = resultado.filter(producto => {

    return producto.Tipo === filtrosActivos.Tipo;

});

    }
    // Filtrar por Marca
if(filtrosActivos.Marca){

    resultado = resultado.filter(producto => {

        return producto.Marca === filtrosActivos.Marca;

    });

}
// Filtrar por Género
if(filtrosActivos.Genero){

    resultado = resultado.filter(producto => {

        return producto.Genero === filtrosActivos.Genero;

    });

}
// Filtrar por Color
if(filtrosActivos.Color){

    resultado = resultado.filter(producto => {

        if(!producto.Colores) return false;

        const colores = [];

        producto.Colores.split(";").forEach(variante=>{

            variante.split("+").forEach(color=>{

                colores.push(
                    normalizarColor(color)
                );

            });

        });

        return colores.includes(filtrosActivos.Color);

    });

}
// Filtrar por Talla
if(filtrosActivos.Talla){

    resultado = resultado.filter(producto => {

        return producto.Tallas &&
               producto.Tallas
                    .split("-")
                    .map(t => t.trim())
                    .includes(filtrosActivos.Talla);

    });

}

    // Guardar los productos filtrados
productosFiltrados[categoria] = resultado;

// Mostrar resultados
mostrarProductos(resultado, categoria);

// Actualizar las tallas disponibles
actualizarFiltroTallas(resultado, categoria);

}

// =====================================
// ACTUALIZAR VISUAL DE UN FILTRO
// =====================================

function actualizarVisualFiltro(
    categoria,
    idFiltro,
    dataFiltro,
    nombreFiltro
){

    const elementos = [

    ...document.querySelectorAll(
        "#filtro-" + idFiltro + "-" + categoria + " .item-filtro"
    ),

    ...document.querySelectorAll(
        "#lista-panel-" + idFiltro + "-" + categoria + " .item-filtro-panel"
    )

];

elementos.forEach(item=>{

        item.classList.remove("activo");

        if(item.dataset[dataFiltro] === filtrosActivos[nombreFiltro]){

            item.classList.add("activo");

        }

    });

}

    // =====================================
// ACTUALIZAR ESTADO VISUAL
// =====================================

function actualizarEstadoVisual(categoria){

    actualizarVisualFiltro(
        categoria,
        "tipo",
        "tipo",
        "Tipo"
    );

    actualizarVisualFiltro(
        categoria,
        "marca",
        "marca",
        "Marca"
    );

    actualizarVisualFiltro(
        categoria,
        "genero",
        "genero",
        "Genero"
    );

    actualizarVisualFiltro(
    categoria,
    "talla",
    "talla",
    "Talla"
);

    actualizarVisualFiltro(
        categoria,
        "color",
        "color",
        "Color"
    );

}

// =====================================
// ACTUALIZAR CONTADORES DE FILTROS
// =====================================

function actualizarContadoresFiltros(categoria){

    const filtros = [
        "Tipo",
        "Marca",
        "Genero",
        "Talla",
        "Color"
    ];

    filtros.forEach(filtro=>{

        const contador = document.getElementById(
            "contador-" + filtro.toLowerCase() + "-" + categoria
        );

        if(!contador) return;

        if(filtrosActivos[filtro]){

            contador.textContent = "(1)";

        }
        else{

            contador.textContent = "";

        }

    });

}

// =====================================
// REINICIAR FILTROS
// =====================================

function reiniciarFiltros(categoria = null){
    // Limpiar filtros activos
filtrosActivos.Tipo = "";
filtrosActivos.Marca = "";
filtrosActivos.Genero = "";
filtrosActivos.Talla = "";
filtrosActivos.Color = "";

// Quitar selección visual de todos los filtros
document.querySelectorAll(".item-filtro").forEach(item => {

    item.classList.remove("activo");

});
// Mostrar todas las categorías solo si es un reinicio general
if(categoria === null){

    Object.keys(catalogo).forEach(cat => {

        document.getElementById(cat).style.display = "block";

    });

}
// Reiniciar productos filtrados
if(categoria === null){

    Object.keys(catalogo).forEach(cat=>{

        productosFiltrados[cat] = [...catalogo[cat]];

    });

}else{

    productosFiltrados[categoria] = [...catalogo[categoria]];

}
// Volver a mostrar productos
if(categoria === null){

    Object.keys(catalogo).forEach(cat => {

        mostrarProductos(catalogo[cat], cat);

    });

}else{

    mostrarProductos(
        catalogo[categoria],
        categoria
    );

}
if(categoria === null){

    Object.keys(catalogo).forEach(cat => {

        generarPanelFiltros(cat);

        actualizarContadoresFiltros(cat);

        actualizarBotonLimpiar(cat);

    });

}else{

    generarPanelFiltros(categoria);

    actualizarContadoresFiltros(categoria);

    actualizarBotonLimpiar(categoria);

}

// Limpiar buscador
document.getElementById("buscador").value = "";
// Quitar categoría activa del menú
document.querySelectorAll(".menu a[data-seccion]").forEach(enlace => {

    enlace.classList.remove("activo");

});

}
// =====================================
// CERRAR MEGA MENÚS
// =====================================

function cerrarMegaMenus(){

    document.querySelectorAll(".mega-menu").forEach(menu=>{

        menu.classList.remove("abierto");

    });

}

// =====================================
// MEGA MENÚ
// =====================================

const menuDama = document.querySelector(".menu-dama");

const megaDama = document.getElementById("mega-dama");

menuDama.addEventListener("mouseenter", function(){

    megaDama.classList.add("abierto");

});

menuDama.addEventListener("mouseleave", function(){

    megaDama.classList.remove("abierto");

});
const menuCaballero = document.querySelector(".menu-caballero");

const megaCaballero = document.getElementById("mega-caballero");

menuCaballero.addEventListener("mouseenter", function(){

    megaCaballero.classList.add("abierto");

});

menuCaballero.addEventListener("mouseleave", function(){

    megaCaballero.classList.remove("abierto");

});

const menuZapatos = document.querySelector(".menu-zapatos");

const megaZapatos = document.getElementById("mega-zapatos");

menuZapatos.addEventListener("mouseenter", function(){

    megaZapatos.classList.add("abierto");

});

menuZapatos.addEventListener("mouseleave", function(){

    megaZapatos.classList.remove("abierto");

});

const menuPerfumes = document.querySelector(".menu-perfumes");

const megaPerfumes = document.getElementById("mega-perfumes");

menuPerfumes.addEventListener("mouseenter", function(){

    megaPerfumes.classList.add("abierto");

});

menuPerfumes.addEventListener("mouseleave", function(){

    megaPerfumes.classList.remove("abierto");

});
const menuAccesorios = document.querySelector(".menu-accesorios");

const megaAccesorios = document.getElementById("mega-accesorios");

menuAccesorios.addEventListener("mouseenter", function(){

    megaAccesorios.classList.add("abierto");

});
const menuPromociones = document.querySelector(".menu-promociones");

const megaPromociones = document.getElementById("mega-promociones");

menuPromociones.addEventListener("mouseenter", function(){

    megaPromociones.classList.add("abierto");

});

menuPromociones.addEventListener("mouseleave", function(){

    megaPromociones.classList.remove("abierto");

});

menuAccesorios.addEventListener("mouseleave", function(){

    megaAccesorios.classList.remove("abierto");

});
document.getElementById("logo-malut").addEventListener("click", function(e){

    e.preventDefault();

    // Reiniciar completamente la tienda
    reiniciarFiltros();

    // Ocultar botón limpiar
    document.getElementById("limpiarBusqueda").style.display = "none";

    // Ocultar sugerencias
    const contenedor = document.getElementById("sugerencias");

    contenedor.innerHTML = "";
    contenedor.style.display = "none";

    // Ir a las categorías
window.scrollTo({

    top: document.getElementById("categorias").offsetTop - 80,

    behavior: "smooth"

});

});
// =====================================
// BANNER HERO AUTOMÁTICO
// =====================================

const imagenesHero = [

    "images/hero/hero1.jpg",
    "images/hero/hero2.jpg",
    "images/hero/hero3.jpg",
    "images/hero/hero4.jpg",
    "images/hero/hero5.jpg",
    "images/hero/hero6.jpg",
    "images/hero/hero7.jpg",
    "images/hero/hero8.jpg",
    "images/hero/hero9.jpg",
    "images/hero/hero10.jpg",
    "images/hero/hero11.jpg",
    "images/hero/hero12.jpg",
    "images/hero/hero13.jpg",
    "images/hero/hero14.jpg",
    "images/hero/hero15.jpg",
    "images/hero/hero16.jpg",
    "images/hero/hero17.jpg",
    "images/hero/hero18.jpg",
    "images/hero/hero19.jpg",
    "images/hero/hero20.jpg"
    

];

const imagenIzquierda = document.getElementById("hero-img-izquierda");
const imagenDerecha = document.getElementById("hero-img-derecha");

const imagenMovilIzquierda = document.getElementById("hero-mobile-izquierda");
const imagenMovilDerecha = document.getElementById("hero-mobile-derecha");

let indiceIzquierda = Math.floor(Math.random() * imagenesHero.length);

let indiceDerecha;

do{

    indiceDerecha = Math.floor(Math.random() * imagenesHero.length);

}while(indiceDerecha === indiceIzquierda);
imagenIzquierda.src = imagenesHero[indiceIzquierda];
imagenDerecha.src = imagenesHero[indiceDerecha];

if(imagenMovilIzquierda){
    imagenMovilIzquierda.src = imagenesHero[indiceIzquierda];
}

if(imagenMovilDerecha){
    imagenMovilDerecha.src = imagenesHero[indiceDerecha];
}
function cambiarImagen(elemento, nuevoIndice){

    // Quitar el zoom de la imagen actual
    elemento.classList.remove("zoom");

    // Iniciar el fundido
    elemento.classList.add("oculta");

    setTimeout(() => {

        // Cambiar la imagen
        elemento.src = imagenesHero[nuevoIndice];

        // Si existe la versión móvil, actualizarla también
        if(elemento.id === "hero-img-izquierda" && imagenMovilIzquierda){

    imagenMovilIzquierda.classList.add("oculta");

    setTimeout(()=>{

        imagenMovilIzquierda.src = imagenesHero[nuevoIndice];

        imagenMovilIzquierda.classList.remove("oculta");

        imagenMovilIzquierda.style.animation = "none";
imagenMovilIzquierda.offsetHeight;
imagenMovilIzquierda.style.animation = "";

    },600);

}

if(elemento.id === "hero-img-derecha" && imagenMovilDerecha){

    imagenMovilDerecha.classList.add("oculta");

    setTimeout(()=>{

        imagenMovilDerecha.src = imagenesHero[nuevoIndice];

        imagenMovilDerecha.classList.remove("oculta");

        imagenMovilDerecha.style.animation = "none";
imagenMovilDerecha.offsetHeight;
imagenMovilDerecha.style.animation = "";

    },600);

}

        // Reiniciar la animación
        elemento.style.animation = "none";
        elemento.offsetHeight;
        elemento.style.animation = "";

        elemento.classList.remove("oculta");
        elemento.style.transform = "scale(1)";

        setTimeout(() => {

            elemento.classList.add("zoom");

        },50);

    },600);

}
// =====================================
// CAMBIO AUTOMÁTICO DEL HERO
// =====================================

let cambiarIzquierda = true;
function obtenerIndiceAleatorio(indiceProhibido1, indiceProhibido2){

    let nuevoIndice;

    do{

        nuevoIndice = Math.floor(Math.random() * imagenesHero.length);

    }while(
        nuevoIndice === indiceProhibido1 ||
        nuevoIndice === indiceProhibido2
    );

    return nuevoIndice;

}

setInterval(() => {

    if(cambiarIzquierda){

        indiceIzquierda = obtenerIndiceAleatorio(
    indiceIzquierda,
    indiceDerecha
);

        cambiarImagen(imagenIzquierda, indiceIzquierda);

    }else{

       indiceDerecha = obtenerIndiceAleatorio(
    indiceDerecha,
    indiceIzquierda
);

        cambiarImagen(imagenDerecha, indiceDerecha);

    }

    cambiarIzquierda = !cambiarIzquierda;

}, 4000);


// =====================================
// VER MÁS
// =====================================

document.addEventListener("click", function(e){

    const boton = e.target.closest(".ver-mas");

    if(!boton) return;

    // Cerrar todos los mega menús
    document.querySelectorAll(".mega-menu").forEach(menu=>{

        menu.classList.remove("abierto");

    });

    const categoria = boton.dataset.categoria;
const filtro = boton.dataset.campo.toLowerCase();

reiniciarFiltros();

scrollAlPanel(categoria);

setTimeout(()=>{

    abrirAcordeon(categoria, filtro);

    resaltarAcordeon(categoria, filtro);

},300);

});
// =====================================
// CREAR BLOQUE DE FILTRO
// =====================================

function crearBloqueFiltro(categoria, filtro){

    return `

        <div class="grupo-filtro-panel">

            <h5 class="titulo-filtro">

    <span class="flecha-filtro">▶</span>

    <span>${filtro}</span>

    <span
        class="contador-filtro"
        id="contador-${filtro.toLowerCase()}-${categoria}">
    </span>

</h5>

            <div
                class="lista-filtro"
                id="lista-panel-${filtro.toLowerCase()}-${categoria}">

            </div>

        </div>

    `;

}

// =====================================
// LLENAR FILTRO GENÉRICO DEL PANEL
// =====================================

function llenarFiltroGenerico(categoria, campo){

    const lista = document.getElementById(
        "lista-panel-" + campo.toLowerCase() + "-" + categoria
    );

    if(!lista) return;

    lista.innerHTML = "";

    const valores = obtenerValoresUnicos(
        productosFiltrados[categoria] || catalogo[categoria],
        campo
    );

    valores.forEach(valor=>{

    lista.innerHTML += `

        <div
            class="item-filtro-panel"
            data-${campo.toLowerCase()}="${valor}"
            onclick="actualizarFiltro('${categoria}','${campo}','${valor}')">

            ${valor}

        </div>

    `;

});

}

// =====================================
// LLENAR FILTRO TALLAS DEL PANEL
// =====================================

function llenarFiltroTallas(categoria){

    const lista = document.getElementById(
        "lista-panel-talla-" + categoria
    );

    if(!lista) return;

    const tallas = [];

const productos = productosFiltrados[categoria] || catalogo[categoria];

productos.forEach(producto=>{

    if(!producto.Tallas) return;

    producto.Tallas.split("-").forEach(talla=>{

        talla = talla.trim();

        if(!tallas.includes(talla)){

            tallas.push(talla);

        }

    });

});

const ordenRopa = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL"
];

tallas.sort((a,b)=>{

    const aNumero = !isNaN(a);
    const bNumero = !isNaN(b);

    // Primero ropa
    if(!aNumero && bNumero) return -1;

    if(aNumero && !bNumero) return 1;

    // Ambos números
    if(aNumero && bNumero){

        return Number(a) - Number(b);

    }

    // Ambos letras
    const indiceA = ordenRopa.indexOf(a);
    const indiceB = ordenRopa.indexOf(b);

    if(indiceA !== -1 && indiceB !== -1){

        return indiceA - indiceB;

    }

    return a.localeCompare(b);

});

tallas.forEach(talla=>{

    lista.innerHTML += `

        <div
            class="item-filtro-panel"
            data-talla="${talla}"
            onclick="actualizarFiltro('${categoria}','Talla','${talla}')">

            ${talla}

        </div>

    `;

});


}

// =====================================
// OBTENER COLORES ÚNICOS
// =====================================

function obtenerColoresUnicos(productos){

    const colores = [];

    productos.forEach(producto=>{

        if(!producto.Colores) return;

        producto.Colores.split(";").forEach(grupo=>{

            grupo.split("+").forEach(color=>{

                color = normalizarColor(color);

                if(
                    color &&
                    !colores.includes(color)
                ){

                    colores.push(color);

                }

            });

        });

    });

    return colores.sort();

}

// =====================================
// LLENAR FILTRO COLOR DEL PANEL
// =====================================

function llenarFiltroColor(categoria){

    const lista = document.getElementById(
        "lista-panel-color-" + categoria
    );

    if(!lista) return;

    lista.innerHTML = "";

    const productos = productosFiltrados[categoria] || catalogo[categoria];

    const colores = obtenerColoresUnicos(productos);

    colores.forEach(color=>{

    lista.innerHTML += `

        <div
            class="item-filtro-panel"
            data-color="${color}"
            onclick="actualizarFiltro('${categoria}','Color','${color}')">

            ${crearColor(color)}

            <span>${color}</span>

        </div>

    `;

});

}
// =====================================
// LLENAR FILTRO DEL PANEL
// =====================================

function llenarFiltro(categoria, filtro){

    switch(filtro){

        case "Tipo":

    llenarFiltroGenerico(
        categoria,
        "Tipo"
    );

    break;


        case "Marca":

    llenarFiltroGenerico(
        categoria,
        "Marca"
    );

    break;

        case "Genero":

    llenarFiltroGenerico(
        categoria,
        "Genero"
    );

    break;

       case "Talla":

    llenarFiltroTallas(categoria);

    break;

        case "Color":

    llenarFiltroColor(categoria);

    break;

    }

}
// =====================================
// PANEL LATERAL DE FILTROS
// =====================================

function generarPanelFiltros(categoria){

    const panel = document.getElementById("panel-filtros-" + categoria);

    if(!panel) return;
let filtros = [...configuracionFiltros[categoria]];

// Solo en la versión móvil de Accesorios
if (
    categoria === "accesorios" &&
    window.innerWidth <= 992
){

    filtros.unshift("Tipo");

}
   // Obtener todos los tipos únicos
const tipos = obtenerValoresUnicos(
    catalogo[categoria],
    "Tipo"
);

// Obtener las marcas según los productos filtrados
const marcas = obtenerValoresUnicos(
    productosFiltrados[categoria] || catalogo[categoria],
    "Marca"
);

    panel.innerHTML = "";

filtros.forEach(filtro=>{

    panel.innerHTML += crearBloqueFiltro(
        categoria,
        filtro
    );

});


    filtros.forEach(filtro=>{

    llenarFiltro(
        categoria,
        filtro
    );

});
activarAcordeones(categoria);
}

// =====================================
// ACTIVAR ACORDEONES DEL PANEL
// =====================================

function activarAcordeones(categoria){

    const panel = document.getElementById(
        "panel-filtros-" + categoria
    );

    if(!panel) return;

    panel.querySelectorAll(".titulo-filtro").forEach(titulo=>{

    titulo.addEventListener("click", function(){

        const lista = this.nextElementSibling;

        if(!lista) return;

        const flecha = this.querySelector(".flecha-filtro");

        const abierto = lista.style.display === "block";

        lista.style.display = abierto ? "none" : "block";

        flecha.textContent = abierto ? "▶" : "▼";

    });

});

}
// =====================================
// ABRIR ACORDEÓN
// =====================================

function abrirAcordeon(categoria, filtro){

    const titulo = document.querySelector(
        "#panel-filtros-" + categoria +
        " #lista-panel-" + filtro + "-" + categoria
    )?.previousElementSibling;

    if(!titulo) return;

    const lista = titulo.nextElementSibling;

    lista.style.display = "block";

    const flecha = titulo.querySelector(".flecha-filtro");

    if(flecha){

        flecha.textContent = "▼";

    }

}
// =====================================
// SCROLL AL PANEL
// =====================================

function scrollAlPanel(categoria){

    const panel = document.querySelector(
        "#" + categoria + " .panel-filtros"
    );

    if(!panel) return;

    panel.scrollIntoView({

        behavior:"smooth",
        block:"start"

    });

}
// =====================================
// RESALTAR ACORDEÓN
// =====================================

function resaltarAcordeon(categoria, filtro){

    const bloque = document.querySelector(
        "#lista-panel-" + filtro + "-" + categoria
    )?.parentElement;

    if(!bloque) return;

    bloque.classList.add("resaltar");

    setTimeout(()=>{

        bloque.classList.remove("resaltar");

    },800);

}
// =====================================
// MOSTRAR / OCULTAR BOTÓN LIMPIAR
// =====================================

function actualizarBotonLimpiar(categoria){

    const boton = document.getElementById(
        "limpiar-" + categoria
    );

    if(!boton) return;

    const hayFiltros = Object.values(filtrosActivos)
        .some(valor => valor);

    boton.style.display = hayFiltros
        ? "block"
        : "none";

}
// =====================================
// BOTÓN LIMPIAR FILTROS
// =====================================

document.addEventListener("click", function(e){

    const boton = e.target.closest(".btn-limpiar-filtros");

    if(!boton) return;

    const categoria = boton.id.replace("limpiar-", "");

reiniciarFiltros(categoria);

});
// =====================================
// Limpiar selección de una tarjeta
// =====================================

function limpiarTarjeta(tarjeta){

    if(!tarjeta) return;

    tarjeta.querySelectorAll(".talla-chip.seleccionada").forEach(talla=>{

        talla.classList.remove("seleccionada");

    });

    tarjeta.querySelectorAll(".color-chip.seleccionado").forEach(color=>{

        color.classList.remove("seleccionado");

    });

    const mensaje = tarjeta.querySelector(".mensaje-seleccion");

    if(mensaje){

        mensaje.textContent = "";

    }
    // Restaurar la imagen original
const imagen = tarjeta.querySelector(".imagen-producto");

if(imagen){

    imagen.src =
`images/productos/${imagen.dataset.categoria}/${imagen.dataset.archivo}`;

}

    // Reiniciar el estado de validación
    tarjeta.dataset.validando = "false";

// Volver a deshabilitar el botón
actualizarBotonCompra(tarjeta);
// Reiniciar botón de notas si es un perfume
const botonNotas = tarjeta.querySelector(".boton-notas");

if(botonNotas){

    botonNotas.innerHTML =
        `<i class="fa-solid fa-spray-can-sparkles"></i> Ver notas`;

    botonNotas.dataset.mostrandoNotas = "false";

}

tarjeta.classList.remove("activa");

}

// =====================================
// Activar una tarjeta
// =====================================

function activarTarjeta(tarjetaActual){

    document.querySelectorAll(".producto-card").forEach(tarjeta => {

        if(tarjeta !== tarjetaActual){

            limpiarTarjeta(tarjeta);

        }

    });

    tarjetaActual.classList.add("activa");

}
// =====================================
// Actualizar estado de selección
// =====================================

function actualizarEstadoSeleccion(tarjeta){

    const mensaje = tarjeta.querySelector(".mensaje-seleccion");

    if(!mensaje) return;

    // Si el usuario aún no ha intentado comprar,
    // no mostrar mensajes
    if(tarjeta.dataset.validando !== "true"){

        mensaje.textContent = "";

        return;

    }

    const tieneTallas = tarjeta.querySelectorAll(".talla-chip").length > 0;
    const tieneColores = tarjeta.querySelectorAll(".color-chip").length > 0;

    const tallaSeleccionada = tarjeta.querySelector(".talla-chip.seleccionada");
    const colorSeleccionado = tarjeta.querySelector(".color-chip.seleccionado");

    mensaje.textContent = "";

    if(tieneTallas && !tallaSeleccionada){

        mensaje.textContent = "📏 Ahora selecciona una talla.";

        return;

    }

    if(tieneColores && !colorSeleccionado){

        mensaje.textContent = "🎨 Ahora selecciona un color.";

        return;

    }

}
// =====================================
// Cambiar imagen según el color
// =====================================

function cambiarImagenColor(elemento, color){
   

    const tarjeta = elemento.closest(".producto-card");

    const imagen = tarjeta.querySelector(".imagen-producto");

    const categoria = imagen.dataset.categoria;

    const archivo = imagen.dataset.archivo;

    // Nombre sin extensión
    const nombreBase = archivo.substring(0, archivo.lastIndexOf("."));

    // Extensión (.jpg, .jpeg, .png...)
    const extension = archivo.substring(archivo.lastIndexOf("."));

    // Convertir el color a formato de archivo
const nombreColor = color.toLowerCase().trim();

    const nuevaRuta =
`images/productos/${categoria}/${nombreBase}-${nombreColor}${extension}`;

    // Comprobar si existe
    const prueba = new Image();

    prueba.onload = function(){

    imagen.style.opacity = "0";

    setTimeout(() => {

        imagen.src = nuevaRuta;

        imagen.style.opacity = "1";

    }, 150);

};

    prueba.onerror = function(){

    imagen.style.opacity = "0";

    setTimeout(() => {

        imagen.src = `images/productos/${categoria}/${archivo}`;

        imagen.style.opacity = "1";

    }, 250);

};

    prueba.src = nuevaRuta;

}

// =====================================
// Actualizar botón de compra
// =====================================

function actualizarBotonCompra(tarjeta){

    const boton = tarjeta.querySelector(".boton-producto");

    if(!boton) return;

    const tieneTallas = tarjeta.querySelectorAll(".talla-chip").length > 0;
    const tieneColores = tarjeta.querySelectorAll(".color-chip").length > 0;

    const tallaSeleccionada = tarjeta.querySelector(".talla-chip.seleccionada");
    const colorSeleccionado = tarjeta.querySelector(".color-chip.seleccionado");

    let habilitado = true;

    if(tieneTallas && !tallaSeleccionada){

        habilitado = false;

    }

    if(tieneColores && !colorSeleccionado){

        habilitado = false;

    }

    if(habilitado){

        boton.classList.remove("deshabilitado");

    }else{

        boton.classList.add("deshabilitado");

    }

}

// =====================================
// Cerrar tarjeta al hacer clic fuera
// =====================================

document.addEventListener("click", function(event){

    // Si el clic fue dentro de una tarjeta,
    // no hacer nada
    if(event.target.closest(".producto-card")){

        return;

    }

    // Limpiar la tarjeta activa
    const tarjetaActiva =
        document.querySelector(".producto-card.activa");

    if(tarjetaActiva){

        limpiarTarjeta(tarjetaActiva);

    }

});
// =====================================
// MENÚ MÓVIL
// =====================================

const btnMenuMobile = document.getElementById("btnMenuMobile");
const menuMobile = document.getElementById("menuMobile");

btnMenuMobile.addEventListener("click", function(){

    menuMobile.classList.toggle("activo");

});
// Cerrar el menú al seleccionar una opción
menuMobile.querySelectorAll("a").forEach(enlace => {

    enlace.addEventListener("click", function(){

        menuMobile.classList.remove("activo");

    });

});
// Cerrar al tocar fuera del menú
document.addEventListener("click", function(e){

    if(
        menuMobile.classList.contains("activo") &&
        !menuMobile.contains(e.target) &&
        !btnMenuMobile.contains(e.target)
    ){

        menuMobile.classList.remove("activo");

    }

});

// =====================================
// FILTROS MÓVIL
// =====================================

if (window.innerWidth <= 768) {

    document.querySelectorAll(".btn-filtros-mobile").forEach(boton => {

        boton.addEventListener("click", function () {

            const contenido = this.nextElementSibling;

            contenido.classList.toggle("activo");

        });

    });

}
// =====================================
// HISTORIA MALUT - UNA VEZ POR SESIÓN
// =====================================

document.addEventListener("DOMContentLoaded", function(){

    const modalHistoria = document.getElementById("modalHistoria");
    const cerrarHistoria = document.getElementById("cerrarHistoria");

    if(!modalHistoria) return;

    // Si ya se mostró durante esta sesión, no volver a mostrarla
    if(sessionStorage.getItem("historiaMalutMostrada") === "true"){

        modalHistoria.style.display = "none";

    }

    function cerrarModalHistoria(){

        modalHistoria.style.display = "none";

        sessionStorage.setItem("historiaMalutMostrada", "true");

    }

    // Cerrar con la X
    if(cerrarHistoria){

        cerrarHistoria.addEventListener("click", function(){

            cerrarModalHistoria();

        });

    }

    // Cerrar haciendo clic en el fondo oscuro
    modalHistoria.addEventListener("click", function(event){

        if(event.target === modalHistoria){

            cerrarModalHistoria();

        }

    });

});