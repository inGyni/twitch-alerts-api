// * This file is used to trigger and listen to events across the application.
// * This is useful for when we want to trigger an event from one file and listen to it in another.
// * We use this to send data to the frontend when an event is triggered.

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

async function TriggerEvent(event, data) {
    eventEmitter.emit(event, data);
}

function OnEvent(event, callback) {
    eventEmitter.on(event, callback);
}

module.exports = {
    TriggerEvent,
    OnEvent
};