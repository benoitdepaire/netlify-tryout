const {OAuth2Client} = require('google-auth-library');

exports.handler = async (event, context) => {
  console.log('test');
  let googleConsentURL = await getAuthURL();
  console.log(`Google Consent URL: ${googleConsentURL}`);


  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "no-cache",
       "Content-Type": "text/html"
    },
    body: JSON.stringify( {googleConsentURL})
  };

  function getAuthURL() {

    const CLIENT_ID_HERE = "1089282576141-mv6t45022af9o865qmnr9g7qsov2asb6.apps.googleusercontent.com"
    const CLIENT_SECRET_HERE = "bbkIBdgwv7wAHbd05DlvYDpa"
    const REDIRECT_URIS_HERE = "http://localhost:9000/.netlify/functions/exchange-codes"

    const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
    oAuth2Client = new OAuth2Client();
    //generate
    const authUrl = oAuth2Client.generateAuthUrl({
      client_id: CLIENT_ID_HERE,
      access_type: "offline",
      scope: SCOPES,
      redirect_uri: REDIRECT_URIS_HERE
    });
  
    return authUrl;
  }
}