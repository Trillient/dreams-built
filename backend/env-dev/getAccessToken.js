const request = require('request');
const dotenv = require('dotenv');

dotenv.config();

const getToken = async () => {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const audience = process.env.AUTH0_AUDIENCE;

  const body = { client_id: clientId, client_secret: clientSecret, audience: audience, grant_type: 'client_credentials' };
  const bodyJson = JSON.stringify(body);
  const options = {
    method: 'POST',
    url: `https://${domain}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    body: `${bodyJson}`,
  };
  request(options, async (error, response, body) => {
    if (error) {
      throw new Error(error);
    }
    const jwt = await JSON.parse(body);
    console.log(jwt.access_token);
    return jwt.access_token;
  });
};
getToken();
