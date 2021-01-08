const {google} = require('googleapis');

exports.handler = async (event, context) => {
  const tokens = {}

  const CLIENT_ID = "1089282576141-mv6t45022af9o865qmnr9g7qsov2asb6.apps.googleusercontent.com";
  const CLIENT_SECRET = "...";
  const REDIRECT_URI= "https://localhost:9000/.netlify/functions/get-tokens";
  const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];      
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  var end = new Date();
  end.setHours(23, 59, 59, 999);

  let oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  oAuth2Client.setCredentials(tokens)
  console.log(oAuth2Client);
  const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
  const res = await calendar.events.list(
    {
      calendarId: 'primary',
      singleEvents: true,
      timeMax: end.toISOString(),
      timeMin: start.toISOString(),
      orderBy: 'startTime'
    }
  )

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
