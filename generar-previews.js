const fs = require("fs");
const path = require("path");

const baseUrl = "https://malutstore.com";

const carpetaImagenes = path.join(__dirname, "images", "productos");
const carpetaPreview = path.join(__dirname, "preview");

if (!fs.existsSync(carpetaPreview)) {
    fs.mkdirSync(carpetaPreview);
}

function crearPreview(categoria, archivoImagen) {

    const nombreSinExtension = path.parse(archivoImagen).name;

    const archivoPreview = `${nombreSinExtension}.html`;

    const rutaPreview = path.join(carpetaPreview, archivoPreview);

    const urlImagen =
        `${baseUrl}/images/productos/${categoria}/${archivoImagen}`;

    const urlPreview =
        `${baseUrl}/preview/${archivoPreview}`;

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Malut Store | Producto</title>

    <meta property="og:type" content="website">
    <meta property="og:title" content="Malut Store | Producto">
    <meta property="og:description" content="Consulta este producto disponible en Malut Store.">

    <meta property="og:url" content="${urlPreview}">

    <meta property="og:image" content="${urlImagen}">
    <meta property="og:image:secure_url" content="${urlImagen}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:alt" content="Producto Malut Store">

</head>

<body>
    <h1>Producto Malut Store</h1>
</body>

</html>`;

    fs.writeFileSync(rutaPreview, html, "utf8");

    console.log("Creado:", archivoPreview);
}

const categorias = fs.readdirSync(carpetaImagenes);

categorias.forEach(categoria => {

    const rutaCategoria = path.join(carpetaImagenes, categoria);

    if (!fs.statSync(rutaCategoria).isDirectory()) return;

    const archivos = fs.readdirSync(rutaCategoria);

    archivos.forEach(archivo => {

        const extension = path.extname(archivo).toLowerCase();

        if (
            extension === ".jpg" ||
            extension === ".jpeg" ||
            extension === ".png" ||
            extension === ".webp"
        ) {
            crearPreview(categoria, archivo);
        }

    });

});

console.log("Previews generados correctamente.");