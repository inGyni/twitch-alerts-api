const axios = require('axios');

async function GetAccessToken(TOKEN_URL, CLIENT_ID, CLIENT_SECRET) {
    console.log('Getting access token...');
    const response = await axios.post(TOKEN_URL, {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials'
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.status != 200) {
        console.log(response.status, response.data);
        return null;
    }
    
    return response.data.access_token;
}

module.exports = {
    GetAccessToken: GetAccessToken
}