<template>
<section class="app-panel app-polarroute-controls">
    <h1>PolarRoute</h1>
    <span>Use PolarRoute to calculate the optimal route between two points.</span>
    
    <fieldset id="app-polarroute-control-request">
        <label for="start-point-select">Start</label>
        
        <button title="Choose on map"
        v-on:click="choose_polarroute_start = !choose_polarroute_start"
        :class="choose_polarroute_start ? 'activated': null"
        >Choose start on map</button>

        <select name="start" id="start-point-select"
        @input="event => polarroute_coords.start = locations.filter(obj => {return obj.name === event.target.value})[0]">
          <option value="">or from list</option>
          <option
            v-for="loc in locations"
            >{{ loc.name }}</option>
        </select>


        <!-- TODO reduce duplication here -->
        <label for="end-point-select">End</label>
        
        <button title="Choose on map"
        v-on:click="choose_polarroute_end = !choose_polarroute_end"
        :class="choose_polarroute_end ? 'activated': null"
        >Choose end on map</button>

        <select name="end" id="end-point-select"
        @input="event => polarroute_coords.end = locations.filter(obj => {return obj.name === event.target.value})[0]">
          <option value="">or from list</option>
          <option
            v-for="loc in locations"
            >{{ loc.name }}</option>
        </select>

      <button title="Request Route" v-on:click="requestRoute()">Get Route</button>
    </fieldset>
</section>
</template>

<script>
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Vue from 'vue';
import { DrawInteraction } from 'vuelayers';

Vue.use(DrawInteraction)

const status_client = axios.create({ baseURL: 'http://localhost:8000' });
axiosRetry(status_client, { retryDelay: axiosRetry.exponentialDelay });

export default {

    props: [
        'debug_mode',
        'polarroute_coords',
        'ship_position_lon',
        'ship_position_lat',
        'choose_polarroute_start',
        'choose_polarroute_end'
    ],

    data() {
        return {
            favourites: [
                {"name": "Falklands", "lat": -51.731, "lon": -57.706},
                {"name": "Signy", "lat": -60.720, "lon": -45.480},
                {"name": "Rothera", "lat": -67.764, "lon": -68.02},
        ]
        }
    },

    computed: {
      locations() {
        let l = JSON.parse(JSON.stringify(this.favourites)); // Hacky deep clone
        l.unshift({
          "name": "Ship Position",
          "lat": this.ship_position_lat,
          "lon": this.ship_position_lon
        })
        return l 
      }
    },

    watch: {
      
      choose_polarroute_start: function () {
        this.$emit('update:choose_polarroute_start', this.choose_polarroute_start);
      },
      choose_polarroute_end: function () {
        this.$emit('update:choose_polarroute_end', this.choose_polarroute_end);
      },
      polarroute_coords: function () {
          this.$emit('update:polarroute_coords', this.polarroute_coords);
        },
    },

    methods: {
      async startRequest(){
          status_url = this.requestRoute();
          this.requestStatus(status_url);
      },
      async requestRoute() {
        // Make initial post request to initiate route calculation
        await axios.post('http://localhost:8000/api/route',
        {
          "start": {"latitude": this.polarroute_coords.start.lat, "longitude": this.polarroute_coords.start.lon},
          "end": {"latitude": this.polarroute_coords.end.lat, "longitude": this.polarroute_coords.end.lon},
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        )
        .then(function (response) {
          console.log(response)
          return response.data["status-url"];
        }
        )
        .catch(function (error) {
          console.error(error);
        })

      },
      async requestStatus(status_url) {
        await status_client.get(status_url, {headers: {'Content-Type': 'application/json'}})
        .then(function (response) {
          console.log(response)
          return response.data.json
        }
        )
        .catch(function (error) {
          console.error(error);
        })

      }
    }
}
</script>

<style scoped>
  p, ul {
    margin-top: 0;
    margin-bottom: 0;
  }

  .app-polarroute-controls {
    grid-area: polarroute-controls;
    z-index: 10;
    font-size: 60%;
    padding: 5px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .debug {
    border: 1px solid red;
    padding: 4px;
  }

  .activated {
    box-shadow: inset 1px 1px 4px #777;
    transform: translateY(1px);
    background-color: #d5caca;
    border-style: double;
    border-radius: 4px;
  }
</style>