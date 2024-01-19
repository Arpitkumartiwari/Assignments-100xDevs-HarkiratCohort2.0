const jsonwebtoken = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const jwtToken = token.split(" ")[1];
  const decodedValue = jsonwebtoken.verify(jwtToken, JWT_SECRET);
  if (decodedValue.username) {
    next();
  } else {
    res.status(401).json({
      msg: "UnAuthorized !!",
    });
  }
}

module.exports = adminMiddleware;
