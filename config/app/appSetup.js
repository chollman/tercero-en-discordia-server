const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const expressValidator = require("express-validator");
const bodyParser = require("body-parser");

exports.appSetup = () => {
    const app = express();
    app.use(morgan("combined"));
    app.use(cors());
    app.use(expressValidator());
    app.use(bodyParser.json());
    return app;
};
