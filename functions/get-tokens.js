const {google} = require('googleapis');

exports.handler = async (event, context) => {
  let params = event.queryStringParameters;
  const GRANT_CODE = params.code;


  const CLIENT_ID = "1089282576141-mv6t45022af9o865qmnr9g7qsov2asb6.apps.googleusercontent.com"
  const CLIENT_SECRET= "..."
  const REDIRECT_URIS= "http://localhost:9000/.netlify/functions/get-tokens"
  const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

  const AUTH_CLIENT = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS);
  let tokenObject = await AUTH_CLIENT.getToken(GRANT_CODE);
  console.log(tokenObject)

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