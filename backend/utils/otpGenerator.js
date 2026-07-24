function generateOTP() {

    return Math.floor(
        100000 +
        Math.random() * 900000
    ).toString();

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
