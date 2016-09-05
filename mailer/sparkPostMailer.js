var nodemailer = require('nodemailer');
var sparkPostTransport = require('nodemailer-sparkpost-transport');

var transport = nodemailer.createTransport(sparkPostTransport());

var SparkPostMailer = function () {
};

SparkPostMailer.sendEmail = function(mailData, callback) {
    transport.sendMail(mailData, function(err, info){
        if (err) {
            console.log("Error while sending email:");
            console.log(err);
        } else {
            console.log("EMAIL SENT:");
            console.log(info.response);
        }

        if (callback) {
            callback(err, info);
        }
    });
};

module.exports = SparkPostMailer;