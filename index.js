const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const keys = require("./config/keys");
const cors = require("cors");
const router = require("./router");

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const app = express();

// middlewares
app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());

// routes middleware
app.use("/api", router);
//require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
