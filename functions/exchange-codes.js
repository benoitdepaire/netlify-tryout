const {OAuth2Client} = require('google-auth-library');

exports.handler = async (event, context) => {
  console.log(event);
  let grantcode = event.queryStringParameters.code;
  console.log(`grantcode: ${grantcode}`)


  let token = await getAccessToken(grantcode);
  console.log('accestoken');
  console.log(token);


  async function getAccessToken(code){
    const CLIENT_ID_HERE = "1089282576141-mv6t45022af9o865qmnr9g7qsov2asb6.apps.googleusercontent.com";
    const CLIENT_SECRET_HERE = "bbkIBdgwv7wAHbd05DlvYDpa";
    const REDIRECT_URIS_HERE = "http://localhost:9000/.netlify/functions/exchange-codes";
    //const REDIRECT_URIS_HERE = "https://loving-dijkstra-1b1330.netlify.app/.netlify/functions/fetch-calendar";

    let oAuth2Client = new OAuth2Client({
      clientSecret: CLIENT_SECRET_HERE
    });

    let accessToken = await oAuth2Client.getToken({
      client_id: CLIENT_ID_HERE,
      code: code,
      redirect_uri: REDIRECT_URIS_HERE
    });
    return accessToken;
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify("Yay again")
  }
}