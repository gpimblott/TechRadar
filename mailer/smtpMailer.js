var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var options = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    requireTLS: process.env.SMTP_TLS === '1'
};

if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
    options.auth = {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
}
console.log(options);

var transport = nodemailer.createTransport(smtpTransport(options));

var SmtpMailer = function () {
};

SmtpMailer.sendEmail = function(mailData, callback) {
    transport.sendMail(mailData, function(err, info){
        if (err) {
            console.log("Error while sending email:");
            console.log(err);
        } else {
            console.log("EMAIL SENT:");
            console.log(info.response.toString());
        }

        if (callback) {
            callback(err, info);
        }
    });
};

module.exports = SmtpMailer;