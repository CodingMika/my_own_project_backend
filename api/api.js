const { Router } = require("express");
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "/uploads" });

router.get("/api", (req, res) => {
  res.send("Any text, doesn't matter.");
});

router.post(
  "/upload-avatar",
  (err, req, res, next) => {
    if (req.session.isAuthorized) {
      next();
    } else {
      res.status(401).send("<h1>Error! Log in first!</h1>");
    }
  },
  upload.single("avatar"),
  (req, res, next) => {
    console.log(req.file);
    next();
  },
  (req, res) => {
    res.end("Goodbye, world!");
  }
);

module.exports.router = router;
