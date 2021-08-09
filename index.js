const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const keys = require("./config/keys");
const cors = require("cors");

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const app = express();

const corsOptions = {
    origin: ["http://localhost:3000"],
    default: "http://localhost:3000",
};

app.all("*", function (req, res, next) {
    var origin =
        corsOptions.origin.indexOf(req.header("origin").toLowerCase()) > -1 ? req.headers.origin : corsOptions.default;
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));

require("./router")(app);
//require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
