// * This is the main entry point for the application
// * This is where we will start the server and listen for incoming requests.
// * We will also handle the authorization code and start the stream monitor.

const { DOMAIN, REDIRECT_ENDPOINT, CLIENT_ID, CLIENT_SECRET, WEBHOOK_ENDPOINT, START_STREAM_ENDPOINT, TOKEN_URL, SERVER_ACCESS_KEY, APP_PORT } = require("./configuration.json");

const express = require('express');
const http = require('http');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);

const { GetAccessToken } = require('./functions/authorization.js');
const { StartStream, StopStream } = require('./functions/monitor.js');
const { CreateSubscriptions } = require('./functions/subscription.js');
const { VerifySignature } = require('./functions/verification.js');
const { OnEvent } = require('./functions/events.js');
const { HandleEvent } = require('./functions/event_handler.js');

app.use(express.json({ limit: '1mb', verify: VerifySignature}));

server.listen(APP_PORT, () => {
    console.log(`Listening on port 3000`);
});

// * This is the endpoint that will receive the Twitch event notifications.
app.post(WEBHOOK_ENDPOINT, (request, response) => {
    try {
        let notification = request.body;

        // * Here we first check what type of message we received.
        // * If it's a verification request, we will respond with the challenge.
        // * If it's a notification, we will handle it.
        // * If it's a revocation, we will delete all subscriptions and stop the stream monitor.

        const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();
        if (request.headers[MESSAGE_TYPE] === 'webhook_callback_verification') {
            response.send(notification.challenge);
            response.end();
            return;
        }
        else if (request.headers[MESSAGE_TYPE] === 'revocation') {
            response.sendStatus(204);
            response.end();
            
            // Calling with no arguments will stop the stream monitor and delete all subscriptions.
            StopStream();
            console.log(`${notification.subscription.type} notifications revoked!`);
            console.log(`reason: ${notification.subscription.status}`);
            console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
            return;
        }
        else if (request.headers[MESSAGE_TYPE] !== 'notification') {
            response.sendStatus(204);
            response.end();
            console.log(`Unknown message type: ${request.headers[MESSAGE_TYPE]}`);
            return;
        }

        // Handle the notification
        HandleEvent(notification);
    
        response.status(200).end();
    } catch (error) {
        console.error('Error parsing JSON:', error);
        response.status(400).send('Bad Request');
    }
});

// * This is to start the stream monitor, which will check if the stream is live every 5 minutes.
// * If the stream is offline, it will stop the stream monitor and delete all subscriptions.
// * When this endpoint is called, we will also create the subscriptions for the events we want to listen to.
app.post(START_STREAM_ENDPOINT, async function (request, response) {
    try {
        // confirm who is calling this endpoint
        const encryptedClientKey = request.headers['access-key'];
        const encryptedServerKey = crypto.createHash('sha256').update(SERVER_ACCESS_KEY).digest('hex');
        
        // Compare client and server key hashes
        if (encryptedClientKey === encryptedServerKey) {
            response.status(200).send('200 OK');

            // Get access token
            const access_token = await GetAccessToken(TOKEN_URL, CLIENT_ID, CLIENT_SECRET);
            if (access_token === null) {
                console.log("Error getting access token");
                return;
            }

            // Create subscriptions
            CreateSubscriptions(access_token);

            // Start stream monitor
            StartStream(CLIENT_ID, access_token);
        } else {
            response.status(401).send('401 Unauthorized');
        }
    } catch (error) {
        console.log(error);
    }
});

// * This is the endpoint that will be called by Twitch to authorize our application.
// * Once the user has authorized our application, we can use the app access token to subscribe to events on the user's channel.
app.get(REDIRECT_ENDPOINT, async (req, res) => {
    // Extract the authorization code from the query parameters
    const authorizationCode = req.query.code;

    // Handle the authorization code as needed
    console.log('Received authorization code:', authorizationCode);

    // Try exchanging the code for an access token
    try {
        // Make a request to the Twitch API for the token exchange
        const response = await axios.post(TOKEN_URL, null, {
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: authorizationCode,
                grant_type: 'authorization_code',
                redirect_uri: DOMAIN + REDIRECT_ENDPOINT,
            },
        });

        // If the response status is not "OK", return early
        if (response.status != 200) {
            console.log(response.status, response.data);
            return;
        }

        // * We only need to authorize our application once, and then we can use the app access token to subscribe to events on the user's channel.
        if (response.data.access_token !== undefined) {
            console.log('Authorized.');
        }

        // Send a response to the client
        res.send('You can now close this window.');


    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error.message);
        // Send an error response to the client
        res.status(500).send('Error exchanging authorization code for access token');
    }
});

// * This is the page that will display the alerts.
// * It will connect to the event stream and listen for incoming events.
app.get('/alerts', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

// * This is the endpoint that will send the events to the client.
// * It will send the initial welcome page and then listen for incoming events.
app.get('/events', (req, res) => {
    console.log('Client connected');
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial data
    res.write(`data: ${JSON.stringify({ content: "<h1>Welcome to the event stream!</h1>" })}\n\n`);

    OnEvent('alert', (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    res.on('close', () => {
        console.log('Client disconnected');
    });
});