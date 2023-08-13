// * This file contains the functions that are used to subscribe to the events that are defined in the event_templates.json file.
// * The event_templates.json file contains the templates for the events that we want to subscribe to.
// * When deleting subscriptions, we delete all subscriptions that the app has created. Since this app is only used by one user, this is fine.

const axios = require('axios');

const { DOMAIN, CLIENT_ID, SUBSCRIBE_URL, CALLBACK_URL, WEBHOOK_SECRET, USER_ID } = require("../configuration.json")
const { EVENTS } = require("../event_templates.json")

const { GetEventTemplate } = require('./event_configuration.js');
const { Sleep } = require('./utils.js');

async function CreateSubscriptions(ACCESS_TOKEN) {
    for (const eventType in EVENTS) {
        Sleep(100);
        if (EVENTS.hasOwnProperty(eventType)) {
            console.log(`Subscribing to the '${eventType}' event..`)
            try {
                await axios.post(SUBSCRIBE_URL, {
                    ...GetEventTemplate(eventType, USER_ID),
                    transport: {
                        method: 'webhook',
                        callback: DOMAIN + CALLBACK_URL,
                        secret: WEBHOOK_SECRET
                    }
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Client-ID': CLIENT_ID,
                        Authorization: "Bearer " + ACCESS_TOKEN
                    }
                })
                .then(response => {
                    if (response === undefined) {
                        console.log("Response is undefined");
                        return;
                    }
                    else if (response.status != 202) {
                        console.log(response.status, response.data);
                        return;
                    }
                    else {
                        console.log(`Subscribed to the '${eventTypeKey}' event.`);
                    }
                })
                .catch(error => {
                    console.log(`Error while trying to subscribe to the '${eventTypeKey}' event: ` + error.data === undefined ? error : error.data);
                });
            } catch (error) {
                console.log('Error subscribing to Twitch event:', error);
            }
        }
    };
}


async function DeleteSubscriptions(ACCESS_TOKEN) {
    await axios.get("https://api.twitch.tv/helix/eventsub/subscriptions", {
        headers: {
            "Client-ID": CLIENT_ID,
            Authorization: "Bearer " + ACCESS_TOKEN
        }
    })
    .then(response => {
        if (response.status != 200) {
            console.log(response.status, response.data);
            return;
        }

        const subscribedEvents = response.data;
        if (subscribedEvents.total === 0) {
            console.log("No events to unsubscribe");
            return;
        }
        console.log(`Unsubscribing from ${subscribedEvents.total} events...`);

        subscribedEvents.data.forEach(event => {
            Sleep(100);
            console.log(`Unsubscribing from the '${event.type}' event..`)
            axios.delete("https://api.twitch.tv/helix/eventsub/subscriptions?id=" + event.id, {
                headers: {
                    "Client-ID": CLIENT_ID,
                    Authorization: "Bearer " + ACCESS_TOKEN
                }
            })
            .then(() => {
                console.log(`Unsubscribed from the '${event.type}' event`);
            })
            .catch(error => {
                console.log("Unsubscribe error: " + error);
            });
        });
    })
    .catch(error => {
        console.log(error);
    });
}


module.exports = {
    CreateSubscriptions: CreateSubscriptions,
    DeleteSubscriptions: DeleteSubscriptions
}