const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const expressValidator = require("express-validator");
const keys = require("./config/keys");
const cors = require("cors");

// IMPORT ROUTES
const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");
const categoryRoutes = require("./routes/category");
const userRoutes = require("./routes/user");
const app = express();

mongoose
    .connect(keys.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"));

app.use(morgan("combined"));
app.use(cors());
app.use(expressValidator());
app.use(bodyParser.json());

app.use("/api", authRoutes);
app.use("/api", booksRoutes);
app.use("/api", categoryRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
