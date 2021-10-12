const http = require("http");
const { mongooseConnect } = require("../config/mongoose/mogooseSetup");
const { appSetup } = require("../config/app/appSetup");

// IMPORT ROUTES
const authRoutes = require("./routes/authentication");
const booksRoutes = require("./routes/book");
const categoryRoutes = require("./routes/category");
const userRoutes = require("./routes/user");
const authorRoutes = require("./routes/author");
const blogCategoryRoutes = require("./routes/blogCategory");
const blogTagRoutes = require("./routes/blogTag");
const blogPostRoutes = require("./routes/blogPost");
const keys = require("../config/keys");

// RUN SETUP OF APP
mongooseConnect();
const app = appSetup();

// SET ROUTES
app.use("/api", authRoutes);
app.use("/api", booksRoutes);
app.use("/api", categoryRoutes);
app.use("/api", userRoutes);
app.use("/api", authorRoutes);
app.use("/api", blogCategoryRoutes);
app.use("/api", blogTagRoutes);
app.use("/api", blogPostRoutes);

// RUN SERVER
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
