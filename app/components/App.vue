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
            <td><output>development</output></td>
            <td><output>{{ environment }}</output></td>
            <td>False</td>
            <td><em>N/A</em></td>
          </tr>
          <tr>
            <td><code>preferences.colour_scheme</code></td>
            <td><output>system</output></td>
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
            <td><code>map.zoom</code></td>
            <td>2</td>
            <td><output>{{ map.zoom }}</output></td>
            <td>False</td>
            <td>
              <button v-on:click="setMapZoomIn">+</button>
              <button v-on:click="setMapZoomOut">-</button>
              </td>
          </tr>
          <tr>
            <td><code>map.rotation_radians</code></td>
            <td>0</td>
            <td><output>{{ map.rotation_radians }}</output></td>
            <td>False</td>
            <td>
              <input type="number" step="any" v-model.number="map.rotation_radians">
              <button v-on:click="setRotationRadians">Set</button>
            </td>
          </tr>
          <tr>
            <td><code>map.rotation_degrees</code></td>
            <td>0</td>
            <td><output>{{ map.rotation_degrees }}</output></td>
            <td>False</td>
            <td>
              <input type="number" min="0" max="360" v-model.number="map.rotation_degrees">
              <button v-on:click="setRotationDegrees">Set</button>
            </td>
          </tr>
          <tr>
            <td><code>map.centre</code></td>
            <td>[0, 0]</td>
            <td><output>{{ map.centre }}</output></td>
            <td>False</td>
            <td>
              Lon (X) <input type="number" min="-180" max="180" step="any" v-model.number="map.centre[0]" style="width:80px">
              Lat (Y) <input type="number" min="-90" max="90" step="any" v-model.number="map.centre[1]" style="width:80px">
              <button v-on:click="setMapCentre">Set</button>
            </td>
          </tr>
          <tr>
            <td><code>map.extent</code></td>
            <td>[-180, -45, 180, 45]</td>
            <td><output>{{ map.extent }}</output></td>
            <td>False</td>
            <td><em>N/A</em></td>
          </tr>
        </tbody>
      </table>
      <hr />

      <button v-on:click="persistState">Persist State</button>
      <button v-on:click="retrieveState">Retrieve State</button>
      <hr />

      <app-map
        ref="AppMap"
        :zoom=map.zoom
        :initial_centre=map.centre
        :initial_rotation_radians=map.rotation_radians
        :ogc_endpoint=siis_ogc_endpoint
        v-on:updateAppMapExtent="onMapExtentUpdated"
        v-on:updateAppMapCentre="onMapCentreUpdated"
        v-on:updateAppMapZoom="onMapZoomUpdated"
        v-on:updateAppMapRotationRadians="onMapRotationRadiansUpdated"
        v-on:updateAppMapRotationDegrees="onMapRotationDegreesUpdated"
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
      map: {
        centre: [2705644, -7843636],
        zoom: 3,
        extent: [0,0,0,0],
        rotation_radians: 0,
        rotation_degrees: 0
      }
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
      this.map.zoom += 1;
    },
    setMapZoomOut (context) {
      this.map.zoom -= 1;
    },
    setMapCentre (context) {
      this.$refs.AppMap.setCentre(this.map.centre);
    },
    setRotationRadians (context) {
      this.$refs.AppMap.setRotationRadians(this.map.rotation_radians)
    },
    setRotationDegrees (context) {
      this.$refs.AppMap.setRotationDegrees(this.map.rotation_degrees)
    },
    onMapExtentUpdated: function (event) {
    	this.map.extent = event;
    },
    onMapCentreUpdated: function (event) {
    	this.map.centre = event;
    },
    onMapZoomUpdated: function (event) {
    	this.map.zoom = event;
    },
    onMapRotationRadiansUpdated: function (event) {
      this.map.rotation_radians = event;
    },
    onMapRotationDegreesUpdated: function (event) {
      this.map.rotation_degrees = event;
    }
  },

  mounted() {
    this.retrieveState();
  }
});
</script>
