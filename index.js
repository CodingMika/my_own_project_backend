const express = require("express");
const { userRoutes } = require("./routes/user_routes");
const port = 8000;
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const DB = require("./database/client");
const { authRoutes } = require("./routes/auth_routes");
const fileUpload = require("express-fileupload");
const { addRoutes } = require("./routes/add_routes");

DB.init();

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
  })
);
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: "pumpkin",
  })
);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api", [authRoutes, userRoutes, addRoutes]);

app.listen(port, () => {
  console.log(`Server started on ${port}!`);
});
