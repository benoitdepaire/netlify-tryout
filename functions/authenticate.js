const {google} = require('googleapis');

exports.handler = async (event, context) => {
  const CLIENT_ID = "1089282576141-mv6t45022af9o865qmnr9g7qsov2asb6.apps.googleusercontent.com"
  const CLIENT_SECRET= "..."
  const REDIRECT_URIS= "http://localhost:9000/.netlify/functions/get-tokens"
  const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];


  //First create an authentication client
  const AUTH_CLIENT = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS);
  //Retrieve the URL where the user can grant access
  const AUTH_URL = AUTH_CLIENT.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  //In this case, just show this URL. (should become: redirect or popup or something)
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "no-cache",
       "Content-Type": "text/html"
    },
    body: JSON.stringify({ AUTH_URL })
  };
}