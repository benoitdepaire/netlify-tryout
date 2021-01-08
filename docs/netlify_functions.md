## Google API Calls with netlify functions

The purpose was to use Netlify Functions to make Google API Calls. This way, we can do authentication on the server side which is safer. In order to make this work, there are three main steps we need to implement.

1. We need to get a grant code from the user which will allow us to request to appropriate access tokens. This is the part where the user is redirected to the Google Login screen and where they accept that our app gets access to some of his Google Resources (in our case Google Calendar). When he does so, we will receive a grant code which we subsequently can use to retrieve access codes. (This is implemented in `functions/authenticate.js`)
2. Next we need to use the grant code to get an access code (and preferably also a refresh code such that we don't always have to go through the previous step). We would like to store this code somewhere (refresh code) for subsequent use. (This is implemented in `functions/get-tokens.js`)
3. Next we create a limited API that does the API call to Google for our application while using the refresh code that we have stored. (This is implemented in `functions/get-calendar-data.js`)



### References
- <https://dev.to/shortdiv/take-charge-of-your-meeting-schedule-with-the-google-calendar-api-and-netlify-functions-1dhp>
- <https://github.com/googleapis/google-api-nodejs-client#authorizing-and-authenticating>
- <https://developers.google.com/calendar/quickstart/nodejs>
- <https://googleapis.dev/nodejs/googleapis/latest/calendar/index.html>
- <https://github.com/googleworkspace/node-samples/blob/1f7ea57e34d88c43d0b7a3a9ab5c6f9446f74d50/calendar/quickstart/index.js#L49> !!! This one was very important
- <https://googleapis.dev/nodejs/google-auth-library/latest/index.html>
- <https://developers.google.com/identity/protocols/oauth2/openid-connect#response-type>
- <https://github.com/googleworkspace/node-samples/issues/63>