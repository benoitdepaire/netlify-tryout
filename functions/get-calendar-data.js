const {google} = require('googleapis');

exports.handler = async (event, context) => {
  const tokens = "COPY-TOKENS-HERE"// shoud hold the token object
  const CLIENT_ID = "COPY CLIENT ID HERE"
  const CLIENT_SECRET= "COPY SECRET HERE"

  const REDIRECT_URI= "http://localhost:9000/.netlify/functions/get-tokens"
  // const REDIRECT_URIS= "https://loving-dijkstra-1b1330.netlify.app/.netlify/functions/get-tokens"
  //Start and end of current date
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  var end = new Date();
  end.setHours(23, 59, 59, 999);

  //Create authentication client
  let oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  //Use access tokens to set credentials for making API calls
  oAuth2Client.setCredentials(tokens)
  //console.log(oAuth2Client);
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
