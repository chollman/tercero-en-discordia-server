const mongoose = require("mongoose");
const keys = require("./config/keys");
const Category = require("./models/category");
const fs = require("fs");

// DECLARE OBJECTS TO INSERT IN THE DB

const categoriesArray = [
    { name: "Acción" },
    { name: "Bélicas" },
    { name: "Drama" },
    { name: "Terror" },
    { name: "Amor" },
    { name: "Historia" },
    { name: "Filosofía" },
    { name: "Física" },
    { name: "Ingeniería" },
    { name: "Matemáticas" },
    { name: "Autoayuda" },
];

let authorsArray = [
    {
        name: "Friedich Nietzche",
        biography:
            "Friedrich Wilhelm Nietzsche fue un filósofo, poeta, músico y filólogo alemán del siglo XIX, considerado uno de los filósofos más importantes de la filosofía occidental, cuya obra ha ejercido una profunda influencia tanto en la historia como en la cultura occidental.",
        photo: {
            data: fs.readFileSync("imagesForTest/Nietzsche.jpg"),
        },
    },
    {
        name: "Stephen King",
        biography:
            "Stephen Edwin King, más conocido como Stephen King y ocasionalmente por su seudónimo Richard Bachman, es un escritor estadounidense de novelas de terror, ficción sobrenatural, misterio, ciencia ficción y literatura fantástica.",
        photo: {
            data: fs.readFileSync("imagesForTest/King.jpg"),
        },
    },
    {
        name: "H.P. Lovecraft",
        biography:
            "Howard Phillips Lovecraft, más conocido como H. P. Lovecraft, fue un escritor estadounidense, autor de relatos y novelas de terror y ciencia ficción.",
        photo: {
            data: fs.readFileSync("imagesForTest/Lovecraft.jpg"),
        },
    },
    {
        name: "J.R.R Tolkien",
        biography:
            "John Ronald Reuel Tolkien, a menudo citado como J. R. R. Tolkien o JRRT, fue un escritor, poeta, filólogo, lingüista y profesor universitario británico, conocido principalmente por ser el autor de las novelas clásicas de fantasía heroica El hobbit, El Silmarillion y El Señor de los Anillos.",
        photo: {
            data: fs.readFileSync("imagesForTest/Tolkien.jpg"),
        },
    },
    {
        name: "J.K Rowling",
        biography:
            "Joanne Rowling, quien escribe bajo los seudónimos J. K. Rowling y Robert Galbraith, es una escritora, productora de cine y guionista británica, conocida por ser la autora de la serie de libros Harry Potter, que han superado los quinientos millones de ejemplares vendidos.",
        photo: {
            data: fs.readFileSync("imagesForTest/Rowling.jpg"),
        },
    },
    {
        name: "Marco Aurelio",
        biography:
            "Marco Aurelio Antonino, fue emperador del Imperio romano desde el año 161 hasta el año de su muerte en 180.",
        photo: {
            data: fs.readFileSync("imagesForTest/MarcoAurelio.jpg"),
        },
    },
    {
        name: "George R.R. Martin",
        biography:
            "George Raymond Richard Martin, conocido como George R. R. Martin y en ocasiones por sus seguidores como GRRM, es un escritor y guionista estadounidense de literatura fantástica, ciencia ficción y terror.",
        photo: {
            data: fs.readFileSync("imagesForTest/Martin.jpg"),
        },
    },
].map((author) => {
    author.photo.contentType = "image/jpg";
    author.twitterLink = `https://twitter.com/home/${author.name}`;
    author.instagramLink = `https://instagram.com/home/${author.name}`;
    author.facebookLink = `https://facebook.com/home/${author.name}`;
    return author;
});

const PATH_COVER_1 = "imagesForBooksTest/Comunidad.jpg";
const PATH_COVER_2 = "imagesForBooksTest/cover2.jpg";
const PATH_COVER_3 = "imagesForBooksTest/ejemploEbook.jpg";

const randomizeCoverPath = () => {
    const random = Math.random();
    if (random < 0.33) {
        return PATH_COVER_1;
    }
    if (random >= 0.66) {
        return PATH_COVER_2;
    }
    return PATH_COVER_3;
};

const PATH_BACKCOVER_1 = "imagesForBooksTest/backCover.jpg";
const PATH_BACKCOVER_2 = "imagesForBooksTest/backCover2.jpg";

const randomizeBackCoverPath = () => {
    const random = Math.random();
    if (random < 0.5) {
        return PATH_BACKCOVER_1;
    }
    return PATH_BACKCOVER_2;
};

let booksArray = [
    {
        title: "El Señor de los Anillos",
        description:
            "La Comunidad del Anillo es el primero de los tres volúmenes que forman la novela El Señor de los Anillos, secuela de El hobbit, del escritor británico J. R. R. Tolkien. La obra fue escrita para ser publicada en un solo tomo, pero debido a su longitud y coste, la editorial Allen & Unwin decidió dividirla.",
    },
    {
        title: "La Torre Oscura",
        description:
            'La Torre Oscura es una saga de libros escrita por el autor estadounidense Stephen King, que incorpora temas de múltiples géneros, incluyendo fantasía, fantasía científica, terror y wéstern. Describe a un "pistolero" y su búsqueda de una torre, cuya naturaleza es tanto física como metafórica.',
    },
].map((book) => {
    book.coverImage.data = fs.readFileSync(randomizeCoverPath());
    book.backCoverImage.data = fs.readFileSync(randomizeBackCoverPath());
    book.coverImage.contentType = "image/jpg";
    book.backCoverImage.contentType = "image/jpg";
    book.isbn = "0-943396-04-2";
    book.numberOfPages = 500;
    book.linkToEbook = `https://google.com/${book.isbn}`;
    book.linkToPaperBook = `https://google.com/${book.isbn}`;
    return book;
});

console.log(categoriesArray);
console.log(authorsArray);
console.log(booksArray);

// CONNECT TO DB AND DO STUFF
mongoose
    .connect(keys.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connected");
        const category = new Category({
            name: "testingfromdataScript",
        });

        // Crear cats
        // Crear authors
        // Crear books, parametrizando por nombre de cat y author una funcion que traiga el id.
    });
