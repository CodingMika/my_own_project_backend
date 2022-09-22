const express = require("express");
const User = require("../database/models/user");
const router = express.Router();

router.post("/registration", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const errors = handleValidation(name, email, password);

  if (errors.length > 0) {
    console.log(errors);
    res.status(400).json({ error: errors });
    return;
  }

  const findUser = await User.findOne({
    email: email,
  }).exec();
  if (findUser != null) {
    console.log(findUser);
    res.status(400).json({ error: "This user already exists." });
    return;
  }

  User.create({
    name: name,
    email: email,
    password: password,
  })
    .then((newUser) => res.json(newUser))
    .catch((err) => {
      console.log(err);
      res.status(400).json(["unable to save to database;" + err]);
    });
});

function handleValidation(name, email, password) {
  let errors = [];
  if (name.length < 1 || name.length > 10) {
    errors.push("Your name should be min 1 letter and max 10 letters.");
  }
  if (email == "") {
    errors.push("Please, provide your email.");
  }
  if (password.length !== 60) {
    errors.push(
      "Please enter a password that contains from 6 to 12 characters."
    );
  }
  return errors;
}

module.exports.userRoutes = router;
