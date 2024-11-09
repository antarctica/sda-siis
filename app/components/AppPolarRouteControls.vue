<template>
<section class="app-panel app-polarroute-controls" :class="{hidden: hide_ui}">
    <h1>PolarRoute</h1>
    <span>Use PolarRoute to calculate the optimal route between two points.</span>
    
    <fieldset id="app-polarroute-control-request">
        <div><label for="start-point-select">Start</label></div>
        
        <div><button title="Choose on map"
        v-on:click="choose_polarroute_start = !choose_polarroute_start"
        :class="choose_polarroute_start ? 'activated': null"
        >Choose start on map</button></div>

        <div>
        <select name="start" id="start-point-select"
        @input="event => polarroute_coords.start = locations.filter(obj => {return obj.name === event.target.value})[0]">
          <option value="">or from list</option>
          <option
            v-for="loc in locations"
            >{{ loc.name }}</option>
        </select>
      </div>

        <!-- TODO reduce duplication here -->
        <div><label for="end-point-select">End</label></div>
        
      
        <div><button title="Choose on map"
        v-on:click="choose_polarroute_end = !choose_polarroute_end"
        :class="choose_polarroute_end ? 'activated': null"
        >Choose end on map</button></div>

        <div>
        <select name="end" id="end-point-select"
        @input="event => polarroute_coords.end = locations.filter(obj => {return obj.name === event.target.value})[0]">
          <option value="">or from list</option>
          <option
            v-for="loc in locations"
            >{{ loc.name }}</option>
        </select>
      </div>

      <div><button title="Request Route" v-on:click="requestRoute()">Get Route</button></div>
      </fieldset>

      <div>
      <table v-if="routes.length > 0">
        <tr>
          <td><strong>Start</strong></td>
          <td><strong>End</strong></td>
          <td><strong>Status</strong></td>
          <td><strong>Info</strong></td>
        </tr>

        <tr v-for="route in routes" :key="route.id"  v-on:click="route.show=!route.show" :class="route.show ? 'shown-route' : ''">
          <td><span :title="route.start_name ? getRouteCoordText(route.start_lat, route.start_lon) : ''">{{ route.start_name ? route.start_name : getRouteCoordText(route.start_lat, route.start_lon) }}</span></td>
          <td><span :title="route.end_name ? getRouteCoordText(route.end_lat, route.end_lon) : ''">{{ route.end_name ? route.end_name : getRouteCoordText(route.end_lat, route.end_lon) }}</span></td>
          <td><span :title="getRouteInfoText(route)">{{ route.status }}</span></td>
          <td><span :title="getRouteInfoText(route)">{{ route.info ? '!' : '' }}</span></td>
        </tr>
      </table>

      <span v-else>{{ serviceStatusText }}</span>
       </div>
</section>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import { DrawInteraction } from 'vuelayers';

Vue.use(DrawInteraction)

export default {

    props: [
        'debug_mode',
        'display_ui',
        'polarroute_coords',
        'ship_position_lon',
        'ship_position_lat',
        'choose_polarroute_start',
        'choose_polarroute_end'
    ],

    data() {
        return {
          statusUpdateFrequency: 10, // seconds
          routes: [],
          serviceStatusText: "Contacting route server..",
          favourites: [
            {"name": "Bird Island", "lat": -54.025, "lon": -38.044},
            {"name": "Falklands", "lat": -51.731, "lon": -57.706},
            {"name": "Halley", "lat": -75.059, "lon": -25.84},
            {"name": "Harwich", "lat": 51.949, "lon": 1.255},
            {"name": "King Edward Point", "lat": -54.22, "lon": -36.433},
            {"name": "Ny-Ålesund", "lat": 78.929, "lon": 11.928},
            {"name": "Rosyth", "lat": 56.017, "lon": -3.44},
            {"name": "Rothera", "lat": -67.764, "lon": -68.02},
            {"name": "Signy", "lat": -60.72, "lon": -45.48},
          ]
        }
    },

    computed: {
      hide_ui: function() {
        return !this.display_ui;
      },
      polarroute_server_endpoint: function () {
        return process.env.POLARROUTE_SERVER_ENDPOINT;
      },
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

    beforeMount(){
      this.requestRecentRoutes();
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
      routes: function () {
        this.$emit('update:routes', this.routes);
      }
    },

    methods: {

      formatNumber (num) {
        return parseFloat(num).toFixed(2)
      },

      addRoute (route) {
        this.routes.push(route);
      },

      updateServiceStatusText (text) {
        this.serviceStatusText = text;
      },

      getRouteCoordText (lat, lon) {
        return this.formatNumber(lat) + ", " + this.formatNumber(lon);
      },

      getRouteInfoText(route) {
        let text = ""
        if (route.info){
          if (route.info.info){
            text += "INFO: " + route.info.info;
          } else if (route.info.error) {
            text += "ERROR: " + route.info.error;
          }
          return text
        }
      },

      getRouteProperties(route, idx){
        let features = [];
        if (route.hasOwnProperty('json')) {
            route_json = route.json;
        }else if (route.hasOwnProperty('json_unsmoothed')){
          route_json = route.json_unsmoothed;
        }
        return route_json[idx][0]['features'][0]['properties'];
      },

      routeRequestConfig(){
        return {
          "start_lat": this.polarroute_coords.start.lat,
          "start_lon": this.polarroute_coords.start.lon,
          "end_lat": this.polarroute_coords.end.lat,
          "end_lon": this.polarroute_coords.end.lon,
          "start_name": this.polarroute_coords.start.name,
          "end_name": this.polarroute_coords.end.name,
        }
      },


      requestRoute: async function() {
        console.debug("requesting route")
        // Make initial post request to initiate route calculation
        let _this = this;
        let route = _this.routeRequestConfig();
        await axios.post(_this.polarroute_server_endpoint + '/api/route', route,
          {headers: {'Content-Type': 'application/json'}})
        .then(function (response) {
          console.debug(response)
          route.id = response.data.id;
          if (Object.hasOwn(response.data, 'json')){
            console.debug(response)
            route.json = response.data.json;
            route.status = "SUCCESS";
            route.show = true;
            console.debug("Route status: "+ route.status)
          }else if (Object.hasOwn(response.data, "status-url")){
            let status_url = response.data["status-url"];
            route.status_url = status_url;
            route.status = "PENDING";
            
            console.debug("Setting interval")

            // set up periodic status request if route pending
            route.status_handle = setInterval(function(){_this.requestStatus(route)}, _this.statusUpdateFrequency*1000);
          }else{
            route.status = response.data.status;
          }
          route.info = response.data.info;
          _this.addRoute(route); // add route to list
        })
        .catch(function (error) {
          console.error(error);
        })
      },


      requestStatus: async function (route) {
        console.debug("requesting route status: " + route.status_url)
        await axios.get(route.status_url)
          .then(function (response){
            console.debug(response.data)
            route.status = response.data.status;
            route.show = true;
            if (Object.hasOwn(response.data, "json") && response.data.status == "SUCCESS"){
              route.json = response.data.json;
            }

            if (Object.hasOwn(response.data, "json_unsmoothed")){
              route.json = response.data.json_unsmoothed;
            }

            if (Object.hasOwn(response.data, "error") && response.data.status == "FAILURE"){
              route.error = response.data.error;
              route.show = false;
            }

            // stop polling for status if it isn't still calculating
            if (response.data.status != "PENDING"){
              clearInterval(route.status_handle);
            }
          })
          .catch(error => console.error(error))
      },


      requestRecentRoutes: async function () {
        let _this = this;
        console.debug("requesting recent routes")
        await axios.get(_this.polarroute_server_endpoint + '/api/recent_routes')
        .then(function (response){
            console.debug(response.data)
            _this.routes = response.data;

            console.debug('routes')
            console.debug(_this.routes)
            
            _this.routes.forEach(route => {
              Vue.set(route, 'show', false); // set watchers
            });

            if (_this.routes.length == 0) {
              _this.updateServiceStatusText("No routes from last day.");
            }
          })
        .catch(function(error) {
          console.error(error);
          _this.updateServiceStatusText("An error occurred.\nRoute server may be unavailable.");
        })
      },
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

  .shown-route {
    background-color: #999;
  }

</style>