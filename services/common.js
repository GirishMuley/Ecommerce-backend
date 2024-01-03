const passport = require("passport");
exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  //TODO: this is temporary token for testing without cookie
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OTU3NTIyYjhkNTcwNDlmODM1ODNlNiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA0Mjk0MjAwfQ.nAGCrHMvkK8JwUBYsrRV08wdHb2jglVJf06Ay8uzF-w";
  return token;
};
