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

module.exports = {
    generateOTP,
    getOTPExpiryTime
};