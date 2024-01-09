const passport = require("passport");
const nodemailer = require("nodemailer");

//Emails

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "girishmuley1998@gmail.com",
    pass: process.env.MAIL_PASSWORD,
  },
});

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

  return token;
};

exports.sendMail = async function ({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: '"E-commerce 🛒" <girishmuley1998@gmail.com>', // sender address
    to,
    subject,
    text,
    html,
  });
  return info;
};
