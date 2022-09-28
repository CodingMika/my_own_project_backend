const express = require("express");
const User = require("../database/models/user");
const { isAutheticated } = require("./middleware/auth_middleware");
const router = express.Router();

router.get("/profile", isAutheticated, (req, res) => {
  res.json(req.session.user);
});

router.get("/logout", isAutheticated, (req, res) => {
  req.session.user = null;
  req.session.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: err });
      return;
    }
    res.json();
  });
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = handleValidationLogin(email, password);
  if (errors.length > 0) {
    console.log(errors);
    res.status(400).json({ error: errors });
    return;
  }
  const findUser = await User.findOne({
    email: email,
    password: password,
  }).exec();
  if (findUser == null) {
    res.status(400).json({ error: "Your email or password is invalid." });
    return;
  }
  console.log([req.body, findUser]);
  req.session.regenerate((err) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: err });
      return;
    }
    req.session.user = findUser;
    req.session.save((err) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: err });
        return;
      }
      res.json(findUser);
    });
  });
});

router.post("/registration", async (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const errors = handleValidationRegistration(name, email, password);
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
    .then((newUser) => {
      req.session.regenerate((err) => {
        if (err) {
          console.log(err);
          res.status(400).json({ error: err });
          return;
        }
        req.session.user = newUser;
        req.session.save((err) => {
          if (err) {
            console.log(err);
            res.status(400).json({ error: err });
            return;
          }
          res.json(newUser);
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(["unable to save to database;" + err]);
    });
});

router.get("/delete-account", isAutheticated, (req, res) => {
  User.findByIdAndRemove(req.session.user._id, (err) => {
    if (err) {
      return res.redirect("/");
    }
    return res.redirect("/");
  });
});

function handleValidationLogin(email, password) {
  let errors = [];
  if (email == "") {
    errors.push("Please, provide your email.");
  }
  if (password.length !== 64) {
    errors.push("The password is invalid.");
  }
  return errors;
}

function handleValidationRegistration(name, email, password) {
  let errors = handleValidationLogin(email, password);
  if (name.length < 1 || name.length > 10) {
    errors.push("Your name should be min 1 letter and max 10 letters.");
  }
  return errors;
}

module.exports.userRoutes = router;
