const express = require("express");
const User = require("../database/models/user");
const { catchErrors, catchRedirect } = require("../utils/catch_errors");
const { isAutheticated } = require("./middleware/auth_middleware");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/profile", isAutheticated, (req, res) => {
  res.json(req.session.user);
});

router.post("/edit-profile", isAutheticated, async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  const image = req.files?.image;
  const name = req.body.name;
  const city = req.body.city;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const userId = req.session.user._id;

  const updateData = createUpdateData(name, city, phoneNumber, email);
  if (Object.keys(updateData).length == 0)
    return catchRedirect(
      res,
      "Our world is as empty as my cup of coffee.",
      "/profile"
    );

  if (image != null) {
    let fileName = image.name.split(".");
    fileName = fileName[fileName.length - 1];
    updateData.image = `/uploads/avatar_${userId}.${fileName}`;
    const savedPath = path.join(
      __dirname,
      "..",
      "uploads",
      `avatar_${userId}.${fileName}`
    );
    fs.writeFileSync(savedPath, image.data);
  }

  User.findByIdAndUpdate(userId, updateData, {
    returnDocument: "after",
  })
    .then((newData) => {
      req.session.user = newData;
      req.session.save((err) => {
        if (err) return catchRedirect(res, err);
        res.redirect("/profile");
      });
    })
    .catch((err) => catchRedirect(res, err));
});

router.get("/delete-account", isAutheticated, (req, res) => {
  User.findByIdAndRemove(req.session.user._id, (err) => {
    if (err) return catchErrors(res, err);

    req.session.user = null;
    req.session.save((err) => {
      if (err) return catchErrors(res, err);
      res.redirect("/");
    });
  });
});

function createUpdateData(name, city, phoneNumber, email) {
  let updateData = {};

  if (name != null && name != "") updateData.name = name;
  if (city != null && city != "") updateData.city = city;
  if (phoneNumber != null && phoneNumber != "")
    updateData.phoneNumber = phoneNumber;
  if (email != null && email != "") updateData.email = email;

  return updateData;
}

module.exports.userRoutes = router;
