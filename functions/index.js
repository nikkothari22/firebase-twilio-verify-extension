const functions = require("firebase-functions");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = require("twilio")(accountSid, authToken);

const twilioVerifySID = process.env.TWILIO_VERIFY_SID;


const requireAuthentication = process.env.USER_AUTHENTICATION_REQUIRED;

/**
 * @typedef {Object} Response
 * @property {string} status - Status of the verification: "pending" or "approved"
 */

/**
`* Function called from app with parameters number and channel
 * @param {string} data.number - A phone number in E.164 format
 * @param {string} [data.channel=sms] - Channel you want to send the verification code to : 'sms' or 'call' (Default: 'sms')
 * @returns {Response} - Status of the verification: "pending" or "approved"
 */
exports.twilioSendOTP = functions.handler.https.onCall((data, context) => {

    // Checking that the user is authenticated.
    if (!context.auth && requireAuthentication) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    let { number, channel } = data;
    if (channel == null) {
        channel = "sms"
    }
    return twilioClient.verify.services(twilioVerifySID)
        .verifications
        .create({ to: number, channel })
        .then(verification => {
            return { status: verification.status }
        })
        .catch(error => {
            functions.logger.error(error)
            throw new functions.https.HttpsError("unknown", error.message);
        })

});

/**
`* Function called from app with parameters number and channel
 * @param {string} data.number - A phone number in E.164 format
 * @param {string} data.code - The verification code to validate the phone number
 * @returns {Response} - Status of the verification: "pending" or "approved"
 */
exports.twilioCheckOTP = functions.handler.https.onCall((data, context) => {

    // Checking that the user is authenticated.
    if (!context.auth && requireAuthentication) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    let { number, code } = data;
    return twilioClient.verify.services(twilioVerifySID)
        .verificationChecks
        .create({ to: number, code: code })
        .then(verification_check => {
            return { status: verification_check.status }
        })
        .catch(error => {
            functions.logger.error(error)
            throw new functions.https.HttpsError("failed-precondition", error.message);
        })

});
