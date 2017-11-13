var wellknown = require('nodemailer-wellknown');

var config = wellknown('Zoho');
config.auth = {
  user: 'admin@lafournee.com.co',
  pass: 'FpFfbt64oT'
}

module.exports.email = {
  service: "Zoho",
  transporter: config,
  templateDir: "api/emailTemplates",
  from: "admin@lafournee.com.co",
  testMode: false,
  ssl: true
};
