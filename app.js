const { clearImage } = require("./utils/file");
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const graphqlHttp = require("express-graphql");
const gqSchema = require("./graphql/schema");
const gqResolver = require("./graphql/resolver");
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const auth = require("./middleware/auth");
require("custom-env").env("staging");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  }
  cb(null, false);
};

app.use(bodyParser.json()); //this will make incoming data be parsed to json .
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(helmet());
app.use(compression());
app.use((req, res, next) => {
  // here i want to add headers so i can allow requests from different servers to be allowed in the app
  res.setHeader("Access-Control-Allow-Origin", "*"); // here we allow specific origins to allow our data, the * makes evreyone able to acces it
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, DELETE, GET, POST, PUT"
  ); // here we specify which methods are allowed from the request
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); //specifies which header types are allowed
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(auth); //wil return is auth, which can be used for authorization in graphql

app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not authorized!");
  }
  if (!req.file) {
    return res.status(200).json({ message: "No file provided!" });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res
    .status(200)
    .json({ message: "File stored succesfully", filePath: req.file.path });
});

app.use(
  "/graphql",
  graphqlHttp({
    schema: gqSchema,
    rootValue: gqResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured";
      const code = err.originalError.code || 500;
      return { message, data, status: code };
    },
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message; //can be set globally in script by setting error.message
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));

