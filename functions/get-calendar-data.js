//This method retrieves the tokens from Fauna DB and makes a call to the Google Calendar API
const {google} = require('googleapis');
require("dotenv").config();

const query = require("./utils/query");

// A query to get the tokens corresponding to a specific credientialID (which is our own ID)
// To indicate this string represents a query, we start by : query <name>(<variablename>:<variabletype>){}
// You can see this as the construction of a specific type of query function
// Do note that the variablename should start with a dollar sign
// Inside this function we call the query as it is defined by the GraphQL Scheme in our fauna db database. 
// This query receives one argument credentialId. We use our $-variable to pass in the value for which we are searching
// the credential. 
// We do need to change the labels of some the parts of the json object which is returned to match the correct names
// expected by Google
// Next, within curly brackets, we defined which parts of the output (a credential) we want to return (only the _id will suffice)
const GET_CREDENTIALS = `
query getToken($credentialId: String!){
  credentialByCredentialId(credentialId: $credentialId){
    access_token : accessToken,
    refresh_token : refreshToken,
    scope,
    token_type : tokenType,
    expiry_date : expiryDate
  }
}
`;

exports.handler = async (event, context) => {
  const CLIENT_ID = process.env.CLIENT_ID
  const CLIENT_SECRET= process.env.CLIENT_SECRET
  const credentialId = "dummy2";

  // const REDIRECT_URI= "http://localhost:9000/.netlify/functions/get-tokens"
  const REDIRECT_URI= "https://loving-dijkstra-1b1330.netlify.app/.netlify/functions/get-tokens"


  const {data, errors} = await query(GET_CREDENTIALS, {credentialId})
  let tokens = data.credentialByCredentialId
  //console.log(tokens);

  //Start and end of current date
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  var end = new Date();
  end.setHours(23, 59, 59, 999);

  //Create authentication client
  let oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  //Use access tokens to set credentials for making API calls
  oAuth2Client.setCredentials(tokens);
  // Create an object to make API calls to google calendar
  const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
  //Make an API call to get all events from the primary calendar for the current date
  const res = await calendar.events.list(
    {
      calendarId: 'primary',
      singleEvents: true,
      timeMax: end.toISOString(),
      timeMin: start.toISOString(),
      orderBy: 'startTime'
    }
  )

  //In this case: show this result.
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "no-cache",
       "Content-Type": "text/html"
    },
    body: JSON.stringify({ res })
  };

}
