const express = require("express");
const flash = require("connect-flash");
const exphbs = require("express-handlebars");
const multer = require("multer");
const path = require("path");
const session = require("express-session");

const app = express();

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: false }));

// Configure Connect-flash
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

// use the session middleware
app.use(
  session({
    secret: "phenomenal",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 6000 },
  })
);
const viewsPath = path.join(__dirname, "views");
const uploadPath = path.join(__dirname, "public", "uploads");

// Configure Handlebars as the template engine
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    extname: ".handlebars",
  })
);
app.set("view engine", "handlebars");
app.set("views", viewsPath);

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single("image");

// Define a single route to render the template
app.get("/", (req, res) => {
  res.render("upload", {
    msg: req.flash("success"),
  });
});

// Handle the file upload
app.post("/upload", upload, (req, res) => {
  req.flash("success", req.file.filename);
  res.redirect("/");
});

app.get("/pagination", (req, res) => {
  res.render("pagination");
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
