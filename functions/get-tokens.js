const {google} = require('googleapis');

exports.handler = async (event, context) => {
  // This function is called by Google after the user granted access. We retreive the grant code from the 
  // GET Header
  let params = event.queryStringParameters;
  const GRANT_CODE = params.code;


  const CLIENT_ID = "1089282576141-mv6t45022af9o865qmnr9g7qsov2asb6.apps.googleusercontent.com"
  const CLIENT_SECRET= "..."
  const REDIRECT_URIS= "http://localhost:9000/.netlify/functions/get-tokens"
  const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
  //Create an authentication client
  const AUTH_CLIENT = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS);
  //Request access and refresh code from Google with the authentication client
  let tokenObject = await AUTH_CLIENT.getToken(GRANT_CODE);
  //console.log(tokenObject)

  // In this case, show the access token object. Should become: store the access token object
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "no-cache",
       "Content-Type": "text/html"
    },
    body: JSON.stringify({ tokenObject })
  };
}