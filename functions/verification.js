// * Here we verify the signature of the request to make sure it's from Twitch and not a malicious third party.
// * This is done by comparing the signature in the request header with a signature we generate using the request body and the secret.

const crypto = require('crypto');
const { WEBHOOK_SECRET } = require('../configuration.json');

function VerifySignature(request, response, buffer, encoding) {
    // check if header exists
    if (!request.headers['Twitch-Eventsub-Message-Signature'.toLowerCase()]) {
        console.log('Twitch signature header missing, ignoring request.');
        return false;
    }

    // check if timestamp is valid
    if (Math.abs(Math.floor(new Date().getTime() / 1000) - request.headers['Twitch-Eventsub-Message-Timestamp'.toLowerCase()]) > 600) {
        console.log("Signature is older than 10 minutes. Ignore this request.");
        return false;
    }

    // check if signature is valid
    const expectedSignature = "sha256=" + crypto.createHmac("sha256", WEBHOOK_SECRET)
        .update(request.header("Twitch-Eventsub-Message-Id") + request.header("Twitch-Eventsub-Message-Timestamp") + buffer)
        .digest("hex");

    const receivedSignature = request.header("Twitch-Eventsub-Message-Signature");

    if (crypto.timingSafeEqual(Buffer.from(expectedSignature, 'utf-8'), Buffer.from(receivedSignature, 'utf-8')) === true) {
        console.log("Signature verified");
        return true;
    }
    else {
        console.log("Invalid signature");
        return false;
    }
}

module.exports = {
    VerifySignature: VerifySignature
}