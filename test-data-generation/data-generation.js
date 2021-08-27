const mongoose = require("mongoose");
const keys = require("../config/keys");
const Category = require("../src/models/category");
const Author = require("../src/models/author");
const Book = require("../src/models/book");
const BlogCategory = require("../src/models/blogCategory");
const BlogTag = require("../src/models/BlogTag");
const fs = require("fs");
const _ = require("lodash");

// RUN THE SCRIPT WITH NODE

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
            data: fs.readFileSync("images/authors/Nietzsche.jpg"),
        },
    },
    {
        name: "Stephen King",
        biography:
            "Stephen Edwin King, más conocido como Stephen King y ocasionalmente por su pseudónimo Richard Bachman, es un escritor estadounidense de novelas de terror, ficción sobrenatural, misterio, ciencia ficción y literatura fantástica.",
        photo: {
            data: fs.readFileSync("images/authors/King.jpg"),
        },
    },
    {
        name: "H.P. Lovecraft",
        biography:
            "Howard Phillips Lovecraft, más conocido como H. P. Lovecraft, fue un escritor estadounidense, autor de relatos y novelas de terror y ciencia ficción.",
        photo: {
            data: fs.readFileSync("images/authors/Lovecraft.jpg"),
        },
    },
    {
        name: "J.R.R Tolkien",
        biography:
            "John Ronald Reuel Tolkien, a menudo citado como J. R. R. Tolkien o JRRT, fue un escritor, poeta, filólogo, lingüista y profesor universitario británico, conocido principalmente por ser el autor de las novelas clásicas de fantasía heroica El hobbit, El Silmarillion y El Señor de los Anillos.",
        photo: {
            data: fs.readFileSync("images/authors/Tolkien.jpg"),
        },
    },
    {
        name: "J.K Rowling",
        biography:
            "Joanne Rowling, quien escribe bajo los seudónimos J. K. Rowling y Robert Galbraith, es una escritora, productora de cine y guionista británica, conocida por ser la autora de la serie de libros Harry Potter, que han superado los quinientos millones de ejemplares vendidos.",
        photo: {
            data: fs.readFileSync("images/authors/Rowling.jpg"),
        },
    },
    {
        name: "Marco Aurelio",
        biography:
            "Marco Aurelio Antonino, fue emperador del Imperio romano desde el año 161 hasta el año de su muerte en 180.",
        photo: {
            data: fs.readFileSync("images/authors/MarcoAurelio.jpg"),
        },
    },
    {
        name: "George R.R. Martin",
        biography:
            "George Raymond Richard Martin, conocido como George R. R. Martin y en ocasiones por sus seguidores como GRRM, es un escritor y guionista estadounidense de literatura fantástica, ciencia ficción y terror.",
        photo: {
            data: fs.readFileSync("images/authors/Martin.jpg"),
        },
    },
].map((author) => {
    author.photo.contentType = "image/jpg";
    author.twitterLink = `https://twitter.com/home/${author.name}`;
    author.instagramLink = `https://instagram.com/home/${author.name}`;
    author.facebookLink = `https://facebook.com/home/${author.name}`;
    return author;
});

const PATH_COVER_1 = "images/books/Comunidad.jpg";
const PATH_COVER_2 = "images/books/cover2.jpg";
const PATH_COVER_3 = "images/books/ejemploEbook.jpg";

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

const PATH_BACKCOVER_1 = "images/books/backCover.jpg";
const PATH_BACKCOVER_2 = "images/books/backCover2.jpg";

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
    {
        title: "Meditaciones",
        description:
            'La Torre Oscura es una saga de libros escrita por el autor estadounidense Stephen King, que incorpora temas de múltiples géneros, incluyendo fantasía, fantasía científica, terror y wéstern. Describe a un "pistolero" y su búsqueda de una torre, cuya naturaleza es tanto física como metafórica.',
    },
    {
        title: "Así habló Zaratrustra",
        description:
            'La Torre Oscura es una saga de libros escrita por el autor estadounidense Stephen King, que incorpora temas de múltiples géneros, incluyendo fantasía, fantasía científica, terror y wéstern. Describe a un "pistolero" y su búsqueda de una torre, cuya naturaleza es tanto física como metafórica.',
    },
    {
        title: "Harry Potter",
        description:
            'La Torre Oscura es una saga de libros escrita por el autor estadounidense Stephen King, que incorpora temas de múltiples géneros, incluyendo fantasía, fantasía científica, terror y wéstern. Describe a un "pistolero" y su búsqueda de una torre, cuya naturaleza es tanto física como metafórica.',
    },
    {
        title: "Juego de Tronos",
        description:
            'La Torre Oscura es una saga de libros escrita por el autor estadounidense Stephen King, que incorpora temas de múltiples géneros, incluyendo fantasía, fantasía científica, terror y wéstern. Describe a un "pistolero" y su búsqueda de una torre, cuya naturaleza es tanto física como metafórica.',
    },
    {
        title: "Matemática Superior",
        description:
            'La Torre Oscura es una saga de libros escrita por el autor estadounidense Stephen King, que incorpora temas de múltiples géneros, incluyendo fantasía, fantasía científica, terror y wéstern. Describe a un "pistolero" y su búsqueda de una torre, cuya naturaleza es tanto física como metafórica.',
    },
    {
        title: "Física aplicada",
        description:
            'La Torre Oscura es una saga de libros escrita por el autor estadounidense Stephen King, que incorpora temas de múltiples géneros, incluyendo fantasía, fantasía científica, terror y wéstern. Describe a un "pistolero" y su búsqueda de una torre, cuya naturaleza es tanto física como metafórica.',
    },
    {
        title: "Drácula",
        description:
            'La Torre Oscura es una saga de libros escrita por el autor estadounidense Stephen King, que incorpora temas de múltiples géneros, incluyendo fantasía, fantasía científica, terror y wéstern. Describe a un "pistolero" y su búsqueda de una torre, cuya naturaleza es tanto física como metafórica.',
    },
    {
        title: "El fantasma de Canterville",
        description:
            'La Torre Oscura es una saga de libros escrita por el autor estadounidense Stephen King, que incorpora temas de múltiples géneros, incluyendo fantasía, fantasía científica, terror y wéstern. Describe a un "pistolero" y su búsqueda de una torre, cuya naturaleza es tanto física como metafórica.',
    },
    {
        title: "El llamado de Cthulu",
        description:
            'La Torre Oscura es una saga de libros escrita por el autor estadounidense Stephen King, que incorpora temas de múltiples géneros, incluyendo fantasía, fantasía científica, terror y wéstern. Describe a un "pistolero" y su búsqueda de una torre, cuya naturaleza es tanto física como metafórica.',
    },
].map((book) => {
    book.coverImage = {
        data: fs.readFileSync(randomizeCoverPath()),
        contentType: "image/jpg",
    };
    book.backCoverImage = {
        data: fs.readFileSync(randomizeBackCoverPath()),
        contentType: "image/jpg",
    };
    book.isbn = "0-943396-04-2";
    book.numberOfPages = 500;
    book.linkToEbook = `https://google.com/${book.isbn}`;
    book.linkToPaperBook = `https://google.com/${book.isbn}`;
    return book;
});

// CONNECT TO DB AND DO STUFF
mongoose
    .connect(keys.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("DB Connected");
        console.log("==! Start dropping Collections !==");

        try {
            await mongoose.connection.db.dropCollection("books");
            await mongoose.connection.db.dropCollection("categories");
            await mongoose.connection.db.dropCollection("authors");
            await mongoose.connection.db.dropCollection("blog-categories");
        } catch (e) {
            console.error(e);
        }

        console.log("==! Done dropping Collections !==");

        console.log("===== Start saving categories =====");
        for (let category of categoriesArray) {
            let dbCategory = new Category(category);
            await dbCategory.save();
        }
        console.log("===== Done saving categories =====");

        console.log("===== Start saving authors =====");
        for (let author of authorsArray) {
            let dbAuthor = new Author(author);
            await dbAuthor.save();
        }
        console.log("===== Done saving authors =====");

        const authors = await Author.find();
        const categories = await Category.find();

        console.log("===== Start saving books =====");

        for (let book of booksArray) {
            book.authors = getSomeIds(authors);
            book.categories = getSomeIds(categories);
            let dbBook = new Book(book);
            await dbBook.save();
        }
        console.log("===== Done saving books =====");

        console.log("===== Start saving Blog categories =====");
        for (let blogCategory of categoriesArray) {
            let dbBlogCategory = new BlogCategory(blogCategory);
            await dbBlogCategory.save();
        }
        console.log("===== Done saving Blog categories =====");

        console.log("===== Start saving Blog tags =====");
        for (let blogTag of categoriesArray) {
            let dbBlogTag = new BlogTag(blogTag);
            await dbBlogTag.save();
        }
        console.log("===== Done saving Blog tags =====");

        await mongoose.disconnect();
        console.log("DONE!");
    });

// Aux functions

const getSomeIds = (array) => {
    const random = Math.random();
    const n = random < 0.7 ? 1 : random > 0.9 ? 3 : 2;
    const shuffledArray = _.shuffle(array).slice(0, n);
    return shuffledArray.map((elem) => elem.id);
};
