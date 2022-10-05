const express = require("express");
const Add = require("../database/models/add");
const { catchErrors, catchRedirect } = require("../utils/catch_errors");
const { isAutheticated } = require("./middleware/auth_middleware");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const User = require("../database/models/user");

router.post("/add", (req, res) => {
  const addId = req.body.addId;
  if (addId == null) {
    return catchErrors(res, "There is no such add.");
  }
  Add.findById(addId).exec((err, add) => {
    if (err) return catchErrors(res, err);
    User.findById(add.userId).exec((err, user) => {
      if (err) return catchErrors(res, err);
      res.json({
        ...add._doc,
        user: {
          ...user._doc,
          password: undefined,
          phoneNumber: undefined,
        },
      });
    });
  });
});

router.post("/adds", (req, res) => {
  console.log(req.body);
  const userId = req.body.userId;
  const limit = req.body.limit;
  const page = req.body.page;
  let filterData = {};
  if (userId != null && userId != "") {
    filterData = { userId: userId };
  }
  let findProcess = Add.find(filterData);
  if (page != null) findProcess = findProcess.skip((page - 1) * (limit ?? 10));
  if (limit != null) findProcess = findProcess.limit(limit);
  findProcess.exec((err, list) => {
    if (err) return catchErrors(res, err);
    res.json(list);
  });
});

router.post("/make-add", isAutheticated, async (req, res) => {
  const image = req.files?.image;
  const title = req.body.title;
  const city = req.body.city;
  const description = req.body.description;
  const addImageId = randomUUID();

  if (image == null) {
    return catchRedirect(res, "Please, add anpicture", "/make-add");
  }

  const addData = createAddData(city, title, description);
  if (Object.keys(addData).length == 0)
    return catchRedirect(res, "Please, provide some information.", "/add");

  addData.userId = req.session.user._id;

  let fileName = image.name.split(".");
  fileName = fileName[fileName.length - 1];
  addData.image = `/uploads/add_${addImageId}.${fileName}`;
  const savedPath = path.join(
    __dirname,
    "..",
    "uploads",
    `add_${addImageId}.${fileName}`
  );
  fs.writeFileSync(savedPath, image.data);

  Add.create(addData)
    .then((newData) => {
      res.redirect("/add/" + newData._id);
    })
    .catch((err) => catchRedirect(res, err));
});

router.post("/delete-add", isAutheticated, async (req, res) => {
  const addId = req.body.addId;
  const userId = req.session.user._id;
  const findAdd = await Add.findById(addId).exec();
  if (userId != findAdd.userId) {
    return catchErrors(res, "It is not your add.");
  }
  Add.findByIdAndRemove(addId, (err) => {
    if (err) return catchErrors(res, err);
    res.json();
  });
});

function createAddData(title, city, description) {
  let updateData = {};

  if (title != null && title != "") updateData.title = title;
  if (city != null && city != "") updateData.city = city;
  if (description != null && description != "")
    updateData.description = description;

  return updateData;
}

module.exports.addRoutes = router;
