/**
 * Creates appropriate mailer module based on env variables. Modules should implement sendEmail function.
 * Sample email object format:
 * {
 *   from: 'me@here.com',
 *   to: 'you@there.com',
 *   subject: 'Very important stuff',
 *   text: 'Plain text',
 *   html: 'Rich taggery'
 * }
 *
 * More info: https://github.com/nodemailer/nodemailer#sending-mail
 *
 * @returns mailer module
 * @constructor
 */
const Mailer = function() {
    let type = process.env.MAILER || '';

    if (type.toLowerCase() === 'stub') {
        return require('./stubMailer');
    } else if (type.toLowerCase() === 'sparkpost') {
        if(!process.env.SPARKPOST_API_KEY) {
            throw 'Error: SparkPost API key not specified';
        }

        return require('./sparkPostMailer');
    } else if (type.toLowerCase() === 'smtp') {
        return require('./smtpMailer');
    }

    throw "Mailer type not specified";
};

const mailerImpl = Mailer();
module.exports.sendEmail = mailerImpl.sendEmail;