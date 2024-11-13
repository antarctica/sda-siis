<template>
<section class="app-panel app-polarroute-controls" :class="{hidden: hide_ui}">
    <h1>PolarRoute</h1>
    <span>Use PolarRoute to calculate the optimal route between two points.</span>
    
    <fieldset id="app-polarroute-control-request">
        <div><label for="start-point-select">Start</label></div>
        
        <div>
          <button title="Choose on map"
          v-on:click="choose_polarroute_start = !choose_polarroute_start"
          :class="choose_polarroute_start ? 'activated': null"
          >Choose start on map</button>

          <input
          placeholder="Name (optional)"
          title="Give points chosen from map a convenient name."
          v-model="polarroute_coords.start.name"
          >
        </div>

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
        
      
        <div>
          <button title="Choose on map"
          v-on:click="choose_polarroute_end = !choose_polarroute_end"
          :class="choose_polarroute_end ? 'activated': null"
          >Choose end on map</button></div>

          <input
          placeholder="Name (optional)"
          title="Give points chosen from map a convenient name."
          v-model="polarroute_coords.end.name"
          >

        <div>
        <select name="end" id="end-point-select"
        @input="event => polarroute_coords.end = locations.filter(obj => {return obj.name === event.target.value})[0]">
          <option value="">or from list</option>
          <option
            v-for="loc in locations"
            >{{ loc.name }}</option>
        </select>
      </div>

      <div v-if="devMode">
        <input
        v-model="polarroute_server_endpoint"
        title="Custom PolarRouteServer endpoint URL"
        />
      </div>

      <div><button title="Request Route" v-on:click="requestRoute()">Get Route</button></div>
      </fieldset>
      
      <div><button title="Refresh Routes" v-on:click="requestRecentRoutes()">Refresh Routes</button></div>

      <div>
      <table v-if="routes.length > 0">
        <tr>
          <td><strong>Start</strong></td>
          <td><strong>End</strong></td>
          <td><strong>Status</strong></td>
          <td><strong>Optimal Time (hrs)</strong></td>
          <td><strong>Optimal Fuel</strong></td>
        </tr>

        <tr v-for="route in routes" :key="route.id"  v-on:click="route.show=!route.show" :class="route.show ? 'shown-route' : ''">
          <td><span :title="route.start_name ? getRouteCoordText(route.start_lat, route.start_lon) : ''">{{ route.start_name ? route.start_name : getRouteCoordText(route.start_lat, route.start_lon) }}</span></td>
          <td><span :title="route.end_name ? getRouteCoordText(route.end_lat, route.end_lon) : ''">{{ route.end_name ? route.end_name : getRouteCoordText(route.end_lat, route.end_lon) }}</span></td>
          <td><span :title="getRouteInfoText(route)">{{ route.info ? route.status + ' (!)' : route.status}}</span></td>
          <td><span :title="getTimeFuelTooltipText(route)">{{ getTimeOptimisedTraveltimeText(route) }}</span></td> <!-- Show time from time-optimised route (0)-->
          <td><span :title="getTimeFuelTooltipText(route)">{{ getFuelOptimisedFuelText(route)}}</span></td> <!-- Show fuel from fuel-optimised route (0)-->
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
          devMode: false,
          statusUpdateFrequency: 10, // seconds
          polarroute_server_endpoint: null,
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

    mounted(){
      this.setDevMode();
      this.setPolarRouteServerEndpoint();
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

      setDevMode () {
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('polarRouteDevMode')){
          urlParams.get('polarRouteDevMode')
        }
      },

      setPolarRouteServerEndpoint(){
        this.polarroute_server_endpoint = process.env.POLARROUTE_SERVER_ENDPOINT;
      },

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
        let route_json = [];
        if (route.hasOwnProperty('json')) {
          route_json = route.json;
        }else if (route.hasOwnProperty('json_unsmoothed')){
          route_json = route.json_unsmoothed;
        }
        if (route_json == null || route_json[idx] == undefined){
          return null
        }else{
          return route_json[idx][0]['features'][0]['properties'];
        }
      },

      getTimeFuelTooltipText(route) {
        if (!route.hasOwnProperty('json') || !route.hasOwnProperty('json_unsmoothed') || this.getRouteProperties(route, 0) == null){
          return null
        }else{
          let t_route_t = this.formatNumber(this.getRouteProperties(route, 0).total_traveltime);
          let t_route_f = this.formatNumber(this.getRouteProperties(route, 0).total_fuel);
          let f_route_t = this.formatNumber(this.getRouteProperties(route, 1).total_traveltime);
          let f_route_f = this.formatNumber(this.getRouteProperties(route, 1).total_fuel);
          return `Time-optimised route (green)\nTime: ${t_route_t} hrs; Fuel: ${t_route_f}\n\nFuel-optimised route (red)\nTime: ${f_route_t} hrs; Fuel: ${f_route_f}`
        }
      },

      getTimeOptimisedTraveltimeText(route){
        let route_properties = this.getRouteProperties(route, 0);
        if (route_properties == null){
          return '-'
        }else{
          return this.formatNumber(route_properties.total_traveltime)
        }
      },

      getFuelOptimisedFuelText(route){
        let route_properties = this.getRouteProperties(route, 1);
        if (route_properties == null){
          return '-'
        }else{
          return this.formatNumber(route_properties.total_fuel)
        }
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
        // Make initial post request to initiate route calculation
        let _this = this;
        let route = _this.routeRequestConfig();
        await axios.post(_this.polarroute_server_endpoint + '/api/route', route,
          {headers: {'Content-Type': 'application/json'}})
        .then(function (response) {
          route.id = response.data.id;
          if (Object.hasOwn(response.data, 'json')){
            route.json = response.data.json;
            route.status = "SUCCESS";
            route.show = true;
          }else if (Object.hasOwn(response.data, "status-url")){
            let status_url = response.data["status-url"];
            route.status_url = status_url;
            route.status = "PENDING";
            
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
        await axios.get(route.status_url)
          .then(function (response){
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
            _this.routes = response.data;

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