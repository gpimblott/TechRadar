const debug = require('debug')('radar:mailer:sparkpost');
const nodeMailer = require('nodemailer');
const sparkPostTransport = require('nodemailer-sparkpost-transport');

const transport = nodeMailer.createTransport(sparkPostTransport());

const SparkPostMailer = function () {
};

SparkPostMailer.sendEmail = function(mailData, callback) {
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

module.exports = SparkPostMailer;