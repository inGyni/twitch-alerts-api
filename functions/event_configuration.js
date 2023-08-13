// * This file contains functions that are used to configure the event templates with the user's id since the event templates are static.
// * This is done to avoid having to manually configure the event templates with the user's id.
// * The event templates are used to create subscriptions to Twitch events.
// * The event templates are located in the event_templates.json file.
// * If you want to add more events, get the template from the twitch api, and create a new entry in the event event_templates.json file.

const { EVENTS } = require("../event_templates.json")

function GetEventTemplate(eventType, broadcasterId) {
    newEvent = EVENTS[eventType];
    if (newEvent.condition.organization_id) newEvent.condition.organization_id = broadcasterId;
    if (newEvent.condition.extension_client_id) newEvent.condition.extension_client_id = broadcasterId;
    if (newEvent.condition.user_id) newEvent.condition.user_id = broadcasterId;
    if (newEvent.condition.broadcaster_user_id) newEvent.condition.broadcaster_user_id = broadcasterId;
    if (newEvent.condition.moderator_user_id) newEvent.condition.moderator_user_id = broadcasterId;

    return newEvent;
}

module.exports = {
    GetEventTemplate: GetEventTemplate,
}