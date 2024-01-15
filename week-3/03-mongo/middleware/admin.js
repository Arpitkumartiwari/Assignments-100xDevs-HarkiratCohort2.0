// Middleware for handling auth
const { Admin } = require("../db/index");
function adminMiddleware(req, res, next) {
  const username = req.headers.username;
  const password = req.headers.password;
  Admin.findOne({ username: username, password: password }).then((value) => {
    if (value) {
      next();
    } else {
      res.status(403).json({
        msg: "Admin Doesn't Exist!",
      });
    }
  });
}

module.exports = adminMiddleware;
