// * Here we will monitor if the goes offline, and if it does, we will delete all subscriptions and stop the stream monitor.
// * This is done to avoid having to manually delete subscriptions and stop the stream monitor.
// * The stream monitor is started when we receive a post request at the /start-stream endpoint, see index.js for more info.

const axios = require('axios');

const { DeleteSubscriptions } = require('./subscription.js');

var streamStarted = false;

function StartStream(CLIENT_ID, ACCESS_TOKEN) {
    streamStarted = true;
    const interval = setInterval(() => {
        if (streamStarted === true) {
            axios.get("https://api.twitch.tv/helix/streams?user_login=mrgyni", {
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": "Bearer " + ACCESS_TOKEN,
                }
            })
            .then(response => {
                if (response.status != 200) {
                    console.log(response.status, response.data);
                    return;
                }

                const stream = response.data;
                if (stream.data.length === 0) {
                    console.log("Stream offline");
                    streamStarted = false;
                    DeleteSubscriptions(ACCESS_TOKEN);
                    return;
                }

                
            });
        } else {
            clearInterval(interval);
        }
    }, 300000);
}

function StopStream() {
    streamStarted = false;
    DeleteSubscriptions(ACCESS_TOKEN);
}

module.exports = { 
    StartStream: StartStream,
    StopStream: StopStream
}