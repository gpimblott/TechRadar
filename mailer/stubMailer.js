const debug = require('debug')('radar:mailer:stub');
const nodMailer = require('nodemailer');
const stubTransport = require('nodemailer-stub-transport');

const transport = nodMailer.createTransport(stubTransport());

const StubMailer = function () {
};

StubMailer.sendEmail = function(mailData, callback) {
    transport.sendMail(mailData, function(err, info){
        if (err) {
            debug("Error while sending email:");
            debug(err);
        } else {
            debug("Email sent: %s", info.response.toString());
        }

        if (callback) {
            callback(err, info);
        }
    });
};

module.exports = StubMailer;