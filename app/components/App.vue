<template>
  <div id="app-wrapper">
    <app-colour-scheme :colour_scheme=preferences.colour_scheme></app-colour-scheme>
    <header>
        <h1>SIIS</h1>
    </header>
    <main>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value (default)</th>
            <th>Value (instant)</th>
            <th>Persisted</th>
            <th>Control</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>environment</code></td>
            <td>development</td>
            <td><output>{{ environment }}</output></td>
            <td>False</td>
            <td><em>N/A</em></td>
          </tr>
          <tr>
            <td><code>preferences.colour_scheme</code></td>
            <td>system</td>
            <td><output>{{ preferences.colour_scheme }}</output></td>
            <td>False</td>
            <td>
              <select v-model="preferences.colour_scheme">
                <option value="system">System (Automatic)</option>
                <option value="light">Light (Day)</option>
                <option value="dark">Dark (Night)</option>
              </select>
            </td>
          </tr>
          <tr>
            <td><code>settings.season</code></td>
            <td><em>N/A</em></td>
            <td><output>{{ settings.season }}</output></td>
            <td>True</td>
            <td>
              <input v-model="settings.season">
            </td>
          </tr>
          <tr>
            <td>Zoom</td>
            <td><output>{{ map_defaults.zoom }}</output></td>
            <td><output>{{ map_instant.zoom }}</output></td>
            <td>False</td>
            <td>
              <button v-on:click="setMapZoomIn">+</button>
              <button v-on:click="setMapZoomOut">-</button>
              </td>
          </tr>
          <tr>
            <td>Map rotation (radians)</td>
            <td><output>{{ map_defaults.rotation_radians }}</output></td>
            <td><output>{{ map_instant.rotation_radians }}</output></td>
            <td>False</td>
            <td>
              <input type="number" step="any" v-model.number="map_update.rotation_radians">
              <button v-on:click="setRotationRadians">Set</button>
            </td>
          </tr>
          <tr>
            <td>Map rotation (degrees)</td>
            <td><output>{{ map_defaults.rotation_degrees }}</output></td>
            <td><output>{{ map_instant.rotation_degrees }}</output></td>
            <td>False</td>
            <td>
              <input type="number" min="-180" max="180" v-model.number="map_update.rotation_degrees">
              <button v-on:click="setRotationDegrees">Set</button>
            </td>
          </tr>
          <tr>
            <td>Map centre</td>
            <td><output>{{ map_defaults.centre }}</output></td>
            <td><output>{{ map_instant.centre }}</output></td>
            <td>False</td>
            <td>
              Lon (X) <input type="number" min="-180" max="180" step="any" v-model.number="map_update.centre[0]" style="width:80px">
              Lat (Y) <input type="number" min="-90" max="90" step="any" v-model.number="map_update.centre[1]" style="width:80px">
              <button v-on:click="setMapCentre">Set</button>
            </td>
          </tr>
          <tr>
            <td><code>Extent</code></td>
            <td><output>{{ map_defaults.extent }}</output></td>
            <td><output>{{ map_instant.extent }}</output></td>
            <td>False</td>
            <td><em>N/A</em></td>
          </tr>
          <tr>
            <td>Map CRS</td>
            <td><output>{{ map_defaults.crs }}</output></td>
            <td><output>{{ map_instant.crs }}</output></td>
            <td>False</td>
            <td>
              <select v-model="map_update.crs" @change="setMapBaselayer($event)">
                <option value="EPSG:3031">WGS84 Antarctic Polar Stereographic</option>
                <option value="EPSG:3413">WGS84 NSIDC Sea Ice Polar Stereographic North</option>
                <option value="EPSG:3857">WGS84 Pseudo-Mercator</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />

      <button v-on:click="persistState">Persist State</button>
      <button v-on:click="retrieveState">Retrieve State</button>
      <hr />

      <app-map
        ref="AppMap"
        :initial_projection=map_defaults.crs
        :initial_zoom=map_defaults.zoom
        :initial_centre=map_defaults.centre
        :initial_rotation_radians=map_defaults.rotation_radians
        :layers=active_layers
        v-on:updateAppMapExtent="onMapExtentUpdated"
        v-on:updateAppMapCentre="onMapCentreUpdated"
        v-on:updateAppMapZoom="onMapZoomUpdated"
        v-on:updateAppMapRotationRadians="onMapRotationRadiansUpdated"
        v-on:updateAppMapRotationDegrees="onMapRotationDegreesUpdated"
        v-on:updateAppMapProjection="onMapProjectionChange"
      ></app-map>
    </main>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

import AppMap from './AppMap.vue';
import AppColourScheme from './AppColourScheme.vue';
import '../assets/main.css'

export default Vue.extend({
  data() {
    return {
      environment: 'development',
      settings: {
        season: null,
        cruise: null
      },
      preferences: {
        colour_scheme: 'system'
      },
      map_defaults: {
        centre: [0,0],
        zoom: 3,
        extent: [0,0,0,0],
        rotation_radians: 0,
        rotation_degrees: 0,
        crs: "EPSG:3413"
      },
      map_instant: {
        centre: [0,0],
        zoom: 0,
        extent: [0,0,0,0],
        rotation_radians: 0,
        rotation_degrees: 0,
        crs: "EPSG:3413"
      },
      map_update: {
        centre: [0,0],
        rotation_radians: 0,
        rotation_degrees: 0,
        crs: "EPSG:3413"
      },
    }
  },

  computed: {
    siis_api_endpoint: function () {
      return process.env.SERVICE_API_ENDPOINT;
    },
    siis_api_kv_endpoint: function () {
      return process.env.SERVICE_API_KV_ENDPOINT;
    },
    siis_ogc_endpoint: function () {
      return process.env.SERVICE_API_OGC_ENDPOINT;
    }
  },

  components: {
    AppColourScheme,
    AppMap
  },

  methods: {
    async persistState (context) {
      try {
        const _state = {
          settings: {}
        }
        if (typeof(this.settings?.season) !== 'undefined') {
          _state.settings.season = this.settings.season;
        }
        await axios.put(this.siis_api_kv_endpoint, {data: _state});
        alert('State persisted');
      } catch (error) {
        console.error(error);
        alert('State could not be persisted');
      }
    },
    async retrieveState (context) {
      try {
        const response = await axios.get(this.siis_api_kv_endpoint);
        const data = response.data.data;
        if (typeof(data.settings?.season) !== 'undefined') {
          this.settings.season = data.settings.season;
        }
      } catch (error) {
        console.error('State could not be retrieved');
        console.error(error);
      }
    },
    setMapZoomIn (context) {
      this.$refs.AppMap.setZoom(this.map_instant.zoom += 1);
    },
    setMapZoomOut (context) {
      this.$refs.AppMap.setZoom(this.map_instant.zoom -= 1);
    },
    setMapCentre (context) {
      this.$refs.AppMap.setCentre(this.map_update.centre);
    },
    setRotationRadians (context) {
      this.$refs.AppMap.setRotationRadians(this.map_update.rotation_radians)
    },
    setRotationDegrees (context) {
      this.$refs.AppMap.setRotationDegrees(this.map_update.rotation_degrees)
    },
    onMapExtentUpdated: function (event) {
    	this.map_instant.extent = event;
    },
    onMapCentreUpdated: function (event) {
      this.map_instant.centre = event;
    },
    onMapZoomUpdated: function (event) {
    	this.map_instant.zoom = event;
    },
    onMapRotationRadiansUpdated: function (event) {
      this.map_instant.rotation_radians = event;
    },
    onMapRotationDegreesUpdated: function (event) {
      this.map_instant.rotation_degrees = event;
    onMapProjectionChange: function (event) {
      this.map_instant.projection = event;
    },
    }
  },

  mounted() {
    this.retrieveState();
  }
});
</script>
