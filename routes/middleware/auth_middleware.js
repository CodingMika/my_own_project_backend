const { catchRedirect } = require("../../utils/catch_errors");

module.exports.isAutheticated = (req, res, next) => {
  if (req.session.user) return next();
  catchRedirect(res, "notAuth", "/login");
};
