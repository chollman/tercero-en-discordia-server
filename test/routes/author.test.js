const authorRoutes = require("src/routes/author");
const { preConfigureApp } = require("src/index");
const mongoose = require("mongoose");

const request = require("supertest");
const express = require("express");
const app = express();

preConfigureApp(app, mongoose);
app.use("/api", authorRoutes);

test("testing route works", (done) => {
    request(app).get("/").expect(200, done);
});
