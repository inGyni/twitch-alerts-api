# Twitch Alerts API

Have your own Twitch Alerts API running in minutes, that comunicates directly with the Twitch API.
Instead of using a third party service for twitch alerts, you can have your own custom service.

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About The Project

I created this project because I wanted to have my own Twitch Alerts API running in my own server, instead of using a third party service like Streamlabs or StreamElements.
This gives me more control over the alerts and allows me to customize them to my liking.

This project is still in development, but it already has the basic functionality to work, and I will be adding more features in the future.

This also gave me the opportunity to learn more about how to use and create APIs with Node.js and Express.js.
And gave me a better understanding of how to design and structure a project.
Obviously, there is still a lot to learn, but I'm happy with the result so far.

### Built With

[Express.js](https://www.npmjs.com/package/express)

[Axios](https://www.npmjs.com/package/axios)

[Events](https://www.npmjs.com/package/events)

[Twitch API](https://dev.twitch.tv/docs/api)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Twitch Developer Account](https://dev.twitch.tv/login)

### Installation
To get a local copy up and running follow these simple steps.

#### Clone the repository

```bash
git clone https://github.com/inGyni/twitch-alerts-api.git
```

#### Install NPM packages

```bash
npm install express axios events http crypto
```

### Creating a Twitch Developer Application

1. Go to the [Twitch Developer Console](https://dev.twitch.tv/console/apps/create)
2. Fill in the required fields
3. Set the OAuth Redirect URL to `http://localhost:3000/oauth/callback`
4. Click on the Create button
5. Copy the Client ID and Client Secret into the `configuration.json` file.

## Usage

To use the Twitch Alerts API, you need to have a Twitch Developer Application, and you need to have the Client ID and Client Secret in the `configuration.json` file.

### Starting the API

To start the API, run the following command in the terminal:

```bash
node index.js
```

### Using the API

#### Authorization

To authorize the application, you need to go to the following URL in your browser:


https://id.twitch.tv/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/oauth/callback&response_type=code&scope=analytics:read:extensions+analytics:read:games+bits:read+channel:edit:commercial+channel:manage:broadcast+channel:manage:extensions+channel:manage:polls+channel:manage:predictions+channel:manage:redemptions+channel:manage:schedule+channel:manage:videos+channel:read:editors+channel:read:goals+channel:read:hype_train+channel:read:polls+channel:read:predictions+channel:read:redemptions+channel:read:stream_key+channel:read:subscriptions+clips:edit+moderation:read+moderator:manage:banned_users+moderator:read:blocked_terms+moderator:manage:blocked_terms+moderator:manage:automod+moderator:read:automod_settings+moderator:manage:automod_settings+moderator:read:chat_settings+moderator:manage:chat_settings+user:edit+user:edit:follows+user:manage:blocked_users+user:read:blocked_users+user:read:broadcast+user:read:email+user:read:follows+user:read:subscriptions+channel:moderate+chat:edit+chat:read+whispers:read+whispers:edit+channel:read:charity+moderator:read:shield_mode+moderator:manage:shield_mode+moderator:read:shoutouts+moderator:manage:shoutouts+moderator:read:followers

Replace `YOUR_CLIENT_ID` with your Application's Client ID.

This will redirect you to the Twitch login page, where you will login to the account which you want to authorize this api to, and then you will be redirected to the `http://localhost:3000/oauth/callback` page.

If everything went well, you should see a message saying that you can close the window.

### Alerts

All alerts from twitch are sent to the `/stream-webhook` endpoint. Then it will be verified and handled by the `HandleEvent` function in `event_handler.js`, where the data will be processed and sent to the `/events` endpoint. The `/events` endpoint will then send the data to the client using Server-Sent Events (SSE).

To edit the alerts, you can edit the `event_handler.js` file and the `index.html` file.
There you can add, remove, edit and customize the alerts to your liking.

## Using the API with OBS

To use the API with OBS, you need to add a Browser Source to your scene, and set the URL to `http://localhost:3000/alerts`.

## Roadmap

Currently no updates are planned, but this may change in the future.

## Contributing

You can contribute to this project by forking the repository and creating a pull request with your changes.

Contributions are always welcome and appreciated, Thank you.

## License

Distributed under the MIT License. See `LICENSE` file for more information.