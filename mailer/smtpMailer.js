"use strict";

const debug = require('debug')('radar:mailer:smtp');
const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const options = {
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

debug(options);

const transport = nodeMailer.createTransport(smtpTransport(options));

const SmtpMailer = function () {
};

SmtpMailer.sendEmail = function(mailData, callback) {
    transport.sendMail(mailData, function(err, info){
        if (err) {
            debug("Error while sending email:");
            debug(err);
        } else {
            debug("Email Sent: %s" , info.response.toString());
        }

        if (callback) {
            callback(err, info);
        }
    });
};

module.exports = SmtpMailer;