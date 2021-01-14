## Fauna DB

### Getting started
We followed the quick tutorial on <https://docs.fauna.com/fauna/current/start/cloud>. 
This required the installation of the fauna shell (`npm install -g fauna-shell`)
Next, log in to Fauna with the command `fauna cloud-login`.
To create a new database, run the command `fauna create-database my_test_db`.
But you can also just work from the browser. :)

### Setup Fauna DB to store credentials (and retrieve them as needed)
Here we will discuss how we did set up Fauna DB to store Google API credentials (tokens). To get this to work, we had to do following steps:

- Create a collection on FaunaDB to store the credentials. For this, we created a GraphQL Scheme (`fauna_db/schema.gql`). We also created to queries such that we can easily retrieve credentials by credentialID.
- You should run this scheme on the website of FaunaDB. Fauna will create the collection(s), but also the indexes corresponding to the queries.
- Create a `utils/query.js` script in the functions folder. This script contains a function to send a GraphQL JSON query to the Fauna DB server. To get this work we use two javascript libraries:
  - Axios: this library creates an HTTP client which can be used to send the query to faunadb api asynchronuously
  - dotenv: this library allows you to store sensitive keys in a separate file in your folder which are entered in your script when you run them.
    - In our case we created an .env file in the root folder of the project, which we also added to .gitignore file such that it is not uploaded to the remote git location.
    - The .env file contains the FAUNA_DB_SECRET which gives allows us to send queries to our fauna DB server.
    - while dotenv makes our query script work locally, we need to setup Netlify appropriately such that it also works when deployed on Netlify. 
  - The query sends a JSON object containing two attributes to the faunadb_graphql API endpoint (<https://graphql.fauna.com/graphql>):
    - query: this contains a GraphQL Query JSON object
    - variables: this contains the variables to be passed into the GraphQL Query JSON Object
- Update `get-tokens.js` to 
  - first fetch the credentials from fauna db
  - if these do not exist retrieve new tokens from Google and store them in Fauna
  - if these exist use these instead of asking new ones from Google
- Update `get-calendar_data.js` to
  - no longer contact Google, but get tokens directly from faunaDB

The flow is now as follows:
- First call `authenticate.js` to get the URL to authenticate yourself with Google and grant access to calendar
- Next this authentication screen calls `get-tokens.js` to get a set of credential tokens to make API calls
- Finally, call `get-calendar-data.js` to get the data from the calendar for today
### Relevant resources 
- <https://css-tricks.com/how-to-create-a-client-serverless-jamstack-app-using-netlify-gatsby-and-fauna/>
- <https://graphql.org/learn/>
- <https://myaccount.google.com/permissions>
- <https://console.cloud.google.com/apis/>
- <https://docs.fauna.com/fauna/current/start/graphql>
- <https://www.howtographql.com/basics/0-introduction/>
- <https://dashboard.fauna.com/>
- <https://app.netlify.com/teams/benoitdepaire/overview>
- <https://community.netlify.com/t/support-guide-using-environment-variables-on-netlify-correctly/267>