const express = require("express");
const { userRoutes } = require("./routes/user_routes");
const port = 8080;
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const DB = require("./database/client");

DB.init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server started on ${port}!`);
});
