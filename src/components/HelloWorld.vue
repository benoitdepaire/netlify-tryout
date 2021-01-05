<template>
  <div class="hello">
    Hello {{name}}
    <div v-if="!token">
        <button @click="authenticate">Sign me in</button>
    </div>
    <div v-if="events.length > 0" class="events-list">
        <ul>
          <li v-for="event in events" :key="event">
            {{event}}
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: 'Benoit',
      token: null,
      url: null,
      events: []
    }
  },
  methods: {
    geturlparams(name) {
      // courtesy of https://stackoverflow.com/a/5158301/3216524 //
      var match = RegExp("[?&]" + name + "=([^&]*)").exec(
        window.location.search
      );
      return match && decodeURIComponent(match[1].replace(/\+/g, " "));
    },
    getCalendarEvents() {
      //  https://www.googleapis.com/calendar/v3/calendars/primary/events?key={YOUR_API_KEY}
      var start = new Date();
      start.setHours(0, 0, 0, 0);
      var end = new Date();
      end.setHours(23, 59, 59, 999);
      axios
        .get(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&timeMax=${end.toISOString()}&timeMin=${start.toISOString()}&orderBy=startTime`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        )
        .then(res => {
          console.log(res.data.items);
          this.owner = res.data.summary.split("@")[0];
          this.events = res.data.items;
        });
    },
    authenticate() {
      window.location.href = this.url;
    }
  },
  mounted() {
    console.log("is mounted");
    if (window.location.search.indexOf("token") > -1) {
      this.token = this.geturlparams("token");
      this.getCalendarEvents();
    } else {
      console.log("call axios google-auth");
      //authURL = "http://localhost:9000/.netlify/functions/google-auth"
      let authURL = "https://loving-dijkstra-1b1330.netlify.app/.netlify/functions/google-auth";
      axios.get(authURL).then(res => {
        console.log(res);
        this.url = res.data.googleConsentURL;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
