// * Here we will handle the events we receive from Twitch.
// * We will check what type of event we received, and then handle it accordingly.
// * You can change the content variable to whatever you want to send to the overlay.
// * You can also add more events to this file.

// * You can also add javascript to the html file, and use the event data to change the content dynamically.
// * For example, instead of sending a static message, you can send data and use javascript in the html file to display it.

const { TriggerEvent } = require('./events.js');

async function HandleEvent(event) {
    let eventType = event.subscription.type;
    let eventData = event.event;
    let eventUsername = eventData.user_name ? eventData.user_name : '';

    var content = "";

    if (eventType === "channel.follow") {
        const followerName = eventData.user_name;
        content = `<h1>${followerName} just followed, thanks!</h1>`;
        console.log(content);
    }
    else if (eventType === "channel.subscribe") {
        const subscriberName = eventData.user_name;
        const subTier = eventData.tier;

        if (eventData.is_gift === true) {
            content = `<h1>${subscriberName} was gifted a sub at tier ${subTier}</h1>`;
            console.log(content);
        }
        else {
            content = `<h1>${subscriberName} just subscribed at tier ${subTier}, thanks!</h1>`;
            console.log(content);
        }
    }
    else if (eventType === "channel.subscription.message") {
        const subscriberName = eventData.user_name;
        const subTier = eventData.tier;
        const message = eventData.message;
        content = `<h1>${subscriberName} just resubscribed at tier ${subTier}\n ${message}</h1>`;
        console.log(content);
    }
    else if (eventType === "channel.subscription.gift") {
        const gifterName = eventData.is_anonymous === true ? "Anonymous" : eventUsername;
        const giftCount = eventData.total;
        content = `<h1>${gifterName} gifted ${giftCount} subs!</h1>`;
        console.log(content);
    }
    else if (eventType === "channel.cheer") {
        const cheererName = eventData.is_anonymous === true ? "Anonymous" : eventUsername;
        const cheerAmount = eventData.bits;
        content = `<h1>${cheererName} cheered ${cheerAmount} bits!</h1>`;
        console.log(content);
    }
    else if (eventType === "channel.raid") {
        const raiderName = eventData.from_broadcaster_user_name;
        const raiderCount = eventData.viewers;
        content = `<h1>${raiderName} raided with ${raiderCount} viewers!</h1>`;
        console.log(content);
    }
    else {
        console.log(`Unknown subscription type: ${eventType}`);
    }


    // * Here we will trigger the event that is being listened to that will send the content to the overlay.
    TriggerEvent('alert', content);
}

module.exports = {
    HandleEvent
};