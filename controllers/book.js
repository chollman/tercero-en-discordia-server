const formidable = require("formidable");
const fs = require("fs");
const Book = require("../models/book");

exports.getAllBooks = (req, res, next) => {
    res.send({
        books: [{ name: "Test" }, { name: "Test2" }],
        numberOfBooks: 2,
    });
};

exports.read = (req, res, next) => {
    return res.json(req.book);
};

// Middleware to instantiate the book each time it is used
exports.getBookById = (req, res, next, id) => {
    console.log(id);
    Book.findById(id)
        .populate("category")
        .exec((err, book) => {
            if (err || !book) {
                console.log(err);
                return res.status(400).json({
                    error: "Book not found",
                });
            }
            req.book = book;
            next();
        });
};

exports.createBook = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }
        //check fields
        const { title, author, description, category } = fields;

        // TODO: Do we need regex validation for fields?
        if (!title || !author || !description || !category) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        let book = new Book(fields);

        if (files.coverImage) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.coverImage.size > 4000000) {
                return res.status(400).json({
                    error: "Image should be less than 4mb in size",
                });
            }
            book.coverImage.data = fs.readFileSync(files.coverImage.path);
            book.coverImage.contentType = files.coverImage.type;
        }
        if (files.backCoverImage) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.backCoverImage.size > 4000000) {
                return res.status(400).json({
                    error: "Image should be less than 4mb in size",
                });
            }
            book.backCoverImage.data = fs.readFileSync(files.backCoverImage.path);
            book.backCoverImage.contentType = files.backCoverImage.type;
        }

        book.save((err, result) => {
            if (err) {
                console.error("Book creation error", err);
                return res.status(400).json({
                    error: err,
                });
            }
            res.json(result);
            // TODO: No devolver las imagenes en la response para mejor performance
        });
    });
};

exports.updateBook = (req, res, next) => {
    res.send("WIP");
};

exports.deleteBook = (req, res, next) => {
    res.send("WIP");
};
