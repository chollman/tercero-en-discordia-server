const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// app
const app = express();

// routes middleware
app.use("/", (req, res) => {
    res.send({ hi: "there" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
