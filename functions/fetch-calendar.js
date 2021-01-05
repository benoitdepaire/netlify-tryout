const { google } = require("googleapis");

exports.handler = async (event, context) => {
  console.log(event);
  let referer = event.headers.referer;
  //referer = "http://localhost:8080";
  referer = "http://loving-dijkstra-1b1330.netlify.app";
  let params = event.queryStringParameters;
  const code = params.code;
  let token 
  try {
    token = await getAccessToken(code);
  }catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        error: "I AM AN ERROR MESSAGE"
      })
    };
  }

  async function getAccessToken(code){
    const CLIENT_ID_HERE = "1089282576141-mv6t45022af9o865qmnr9g7qsov2asb6.apps.googleusercontent.com";
    const CLIENT_SECRET_HERE = "bbkIBdgwv7wAHbd05DlvYDpa";
    //const REDIRECT_URIS_HERE = "http://localhost:9000/.netlify/functions/fetch-calendar";
    const REDIRECT_URIS_HERE = "http://loving-dijkstra-1b1330.netlify.app/.netlify/functions/fetch-calendar";

    let oAuth2Client = new google.auth.OAuth2(
      `${CLIENT_ID_HERE}`,
      `${CLIENT_SECRET_HERE}`,
      `${REDIRECT_URIS_HERE}`
    );

    const accessToken = await oAuth2Client.getToken(code);
    return accessToken;
  }

  return {
    statusCode: 302,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "no-cache",
      Location: `${referer}?token=${token.tokens.access_token}`
    },
    body: JSON.stringify({})
  }
}