const crypto = require("crypto");

function generateOTP() {

    return crypto
        .randomInt(100000, 1000000)
        .toString();

}

function getOTPExpiryTime() {

    const expiry = new Date();

    expiry.setMinutes(
        expiry.getMinutes() + 10
    );

    return expiry;

}

function isOTPExpired(expiresAt) {

    return new Date() > new Date(expiresAt);

}

module.exports = {

    generateOTP,

    getOTPExpiryTime,

    isOTPExpired

};