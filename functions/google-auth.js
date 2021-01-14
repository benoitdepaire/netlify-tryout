const { google } = require("googleapis");
require("dotenv").config();

exports.handler = async (event, context) => {

  const CLIENT_ID_HERE = process.env.CLIENT_ID
  const CLIENT_SECRET_HERE = process.env.CLIENT_SECRET
  //const REDIRECT_URIS_HERE = "http://localhost:9000/.netlify/functions/fetch-calendar"
  const REDIRECT_URIS_HERE = "https://loving-dijkstra-1b1330.netlify.app/.netlify/functions/fetch-calendar"

  let googleConsentURL;
  try{
    googleConsentURL = await authorize()
  } catch(e){
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(
        {
          error: e.message
        }
      )
    };
  }
    

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "no-cache",
       "Content-Type": "text/html"
    },
    body: JSON.stringify({ googleConsentURL })
  };
  
  /**
  * Create an OAuth2 client with the given credentials, and then execute 
  * the given callback function.
  * @param {Object} credentials The authorization client credentials.
  * @param {function} callback The callback to call with the authorized
  * client.
  */
  function authorize() {
    const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
    oAuth2Client = new google.auth.OAuth2(
      `${CLIENT_ID_HERE}`,
      `${CLIENT_SECRET_HERE}`,
      `${REDIRECT_URIS_HERE}`
    );
    //generate
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
  
    return authUrl;
  }
}
