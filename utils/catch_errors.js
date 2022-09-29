module.exports.catchErrors = (res, err) => {
  console.log(err);
  res.status(400).json({ error: err });
};
