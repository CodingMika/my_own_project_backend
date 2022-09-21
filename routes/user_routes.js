const express = require("express");
const User = require("../database/models/user");
const router = express.Router();

router.post("/registration", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
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
module.exports.userRoutes = router;
