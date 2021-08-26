const Author = require("../models/author");
const Book = require("../models/book");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { setImageInObject } = require("../helpers/utils");
const _ = require("lodash");

const MAX_NUMBER_OF_FETCHED_AUTHORS = 20;

exports.getAllAuthors = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : MAX_NUMBER_OF_FETCHED_AUTHORS;

    Author.find()
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(data.map(createAuthorForResponse));
        });
};

exports.authorById = (req, res, next, id) => {
    Author.findById(id).exec((err, author) => {
        if (err || !author) {
            return res.status(404).json({
                error: "El autor no existe",
            });
        }
        req.author = author;
        next();
    });
};

exports.getAuthor = (req, res) => res.json(createAuthorForResponse(req.author));

exports.createAuthor = (req, res) => {
    const { fields, files } = req;
    let author = new Author(fields);
    setPhotoOfAuthor(author, files);
    author.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.status(201).json(createAuthorForResponse(result));
    });
};

exports.updateAuthor = (req, res) => {
    const { fields, files } = req;
    let author = _.extend(req.author, fields);
    setPhotoOfAuthor(author, files);
    author.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.status(200).json(createAuthorForResponse(result));
    });
};

exports.deleteAuthor = async (req, res) => {
    let author = req.author;
    const authorIdsInUse = await Book.distinct("authors", {});
    const authorsInUse = await Author.find({ _id: { $in: authorIdsInUse } });
    for (let authorInUse of authorsInUse) {
        if (authorInUse.id === author.id) {
            return res.status(400).json({
                error: "No se puede borrar el autor ya que está referenciando al menos un libro",
            });
        }
    }
    author.remove((err, deletedAuthor) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        console.log(`author: ${deletedAuthor.id} was deleted by user: ${req.profile.email} `);
        res.json({
            message: "El autor fue borrado correctamente",
        });
    });
};

exports.getAuthorPhoto = (req, res, next) => {
    if (req.author.photo.data) {
        res.set("Content-Type", req.author.photo.contentType);
        return res.send(req.author.photo.data);
    }
    next();
};

const createAuthorForResponse = (author) => {
    let authorForResponse = author.toObject();
    setPhotoStatus(authorForResponse);
    removePhoto(authorForResponse);
    return authorForResponse;
};

const removePhoto = (author) => (author.photo = undefined);

const setPhotoStatus = (author) => (author.hasPhoto = !!author.photo);

const setPhotoOfAuthor = (author, files) => setImageInObject(author.photo, files.photo);
