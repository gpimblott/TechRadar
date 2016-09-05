var nodemailer = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');

var transport = nodemailer.createTransport(stubTransport());

var StubMailer = function () {
};

StubMailer.sendEmail = function(mailData, callback) {
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

module.exports = StubMailer;