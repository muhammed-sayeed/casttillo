var nodemailer = require("nodemailer");

module.exports.mailer = nodemailer.createTransport({
    host: process.env.host,
    port: process.env.PORTs,
    auth: {
      user: process.env.user,
      pass: process.env.password,
    },
  });