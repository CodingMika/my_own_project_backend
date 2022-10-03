module.exports.catchErrors = (res, err) => {
  console.log(err);
  res.status(400).json({ error: err });
};

module.exports.catchRedirect = (res, err, redirectTo = "/") => {
  console.log(err);
  res.redirect(redirectTo);
};
