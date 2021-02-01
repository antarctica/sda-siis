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

      <button v-on:click="persistState" :disabled=controls.persistState.disabled>Persist State</button>
      <button v-on:click="retrieveState" :disabled=controls.retrieveState.disabled>Retrieve State</button>
      <button v-on:click="retrieveLayers" :disabled=controls.retrieveLayers.disabled>Retrieve Layers</button>
      <button v-on:click="retrieveGranules" :disabled=controls.retrieveGranules.disabled>Retrieve Granules</button>
      <hr />

      <table>
        <thead>
          <tr>
            <th>Layer (Label)</th>
            <th>Granules</th>
            <th>Controls</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="layer_granule in layers_granules" :key="layer_granule.granule.uuid">
            <td>{{ layer_granule.layer.label }}</td>
            <td>{{ layer_granule.granule.uuid }} - {{ layer_granule.granule.timestamp }}</td>
            <td>
              <button v-on:click="displayGranule(layer_granule.layer.code, layer_granule.granule.uuid)">Display</button>
              <button v-on:click="hideGranule(layer_granule.layer.code, layer_granule.granule.uuid)">Hide</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Raw output (temporary, enable as needed) -->
      <!-- <table>
        <thead>
          <tr>
            <th>Layer (Label)</th>
            <th>Granules</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="layer_granule in layers_granules" :key="layer_granule.granule.uuid">
            <td>{{ layer_granule.layer }}</td>
            <td>{{ layer_granule.granule }}</td>
          </tr>
        </tbody>
      </table> -->

      <p>Active layers</p>
      <ul>
        <li v-for="layer in active_layers">
          {{ layer }}
        </li>
      </ul>
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
  name: "App",

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
      controls: {
        persistState: {
          disabled: false
        },
        retrieveState: {
          disabled: false
        },
        retrieveLayers: {
          disabled: false
        },
        retrieveGranules: {
          disabled: true
        }
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
      layers: {},
      active_layers: []
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
    },
    layers_granules: function () {
      const _layers_granules = [];
      for (const layer of Object.values(this.layers)) {
        for (const granule of Object.values(layer.granules)) {
          _layers_granules.push({'layer': layer, 'granule': granule})
        }
      }
      return _layers_granules;
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
    async retrieveLayers (context) {
      try {
        const response = await axios.get(this.siis_api_endpoint + '/products');
        const data = response.data;
        const layers = {};
        data.forEach((layer) => {
          layer.granules = {};
          layers[layer.code] = layer;
        });
        this.layers = layers;
        this.controls.retrieveGranules.disabled = false;
      } catch (error) {
        console.error('Layers could not be retrieved');
        console.error(error);
      }
    },
    async retrieveGranules (context) {
      try {
        const response = await axios.get(this.siis_api_endpoint + '/granules');
        const data = response.data;
        const _layers = this.layers;
        data.forEach((granule) => {
          if (!(granule.productcode in _layers)) {
            console.warn("Layer [" + granule.productcode + "] used in Granule [" + granule.uuid + "] does not exist, skipping granule");
            console.info("Available layers IDs:");
            console.info(Object.keys(_layers));
            return;
          }
          this.$set(_layers[granule.productcode]['granules'], granule.uuid, granule);
        });
      } catch (error) {
        console.error('Granules could not be retrieved');
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
    async setMapBaselayer (context) {
      // reset layers as we assume they will only apply to one hemisphere
      this.active_layers.length = 0;

      await this.$refs.AppMap.setProjection(this.map_update.crs);

      if (this.map_update.crs == 'EPSG:3413') {
        this.active_layers.push({
          'protocol': 'wms',
          'endpoint': this.siis_ogc_endpoint,
          'attribution': 'BAS',
          'layer': 'base_n'
        });
      } else if (this.map_update.crs == 'EPSG:3031') {
        this.active_layers.push({
          'protocol': 'wms',
          'endpoint': this.siis_ogc_endpoint,
          'attribution': 'BAS',
          'layer': 'base_s'
        });
      } else if (this.map_update.crs == 'EPSG:3857') {
        this.active_layers.push({
          'protocol': 'wms',
          'endpoint': this.siis_ogc_endpoint,
          'attribution': 'BAS',
          'layer': 'base_n'
        });
        this.active_layers.push({
          'protocol': 'wms',
          'endpoint': this.siis_ogc_endpoint,
          'attribution': 'BAS',
          'layer': 'base_s'
        });
      }
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
    },
    onMapProjectionChange: function (event) {
      this.map_instant.projection = event;
    },
    displayGranule: function (layer_id, granule_id) {
      const layer = this.layers[layer_id];
      const granule = layer.granules[granule_id];

      this.active_layers.push({
        'protocol': 'wms',
        'layer_id': layer_id,
        'granule_id': granule_id,
        //'endpoint': this.layers[layer].gs_tempwmsendpoint,  // disabled due to #45
        'endpoint': this.siis_ogc_endpoint,
        'layer': layer.gs_layername,
        'attribution': layer.attribution,
        'time': granule.timestamp.split('T')[0]
      });
    },
    hideGranule: function (layer_id, granule_id) {
      let granule_index = this._determineIfLayerIsActive(layer_id, granule_id);
      if (granule_index > -1) {
        this.active_layers.splice(granule_index, 1);
      }
    },
    _determineIfLayerIsActive(layer_id, granule_id) {
      return this.active_layers.findIndex(function(active_layer) {
        return active_layer.layer_id === layer_id && active_layer.granule_id === granule_id;
      });
    }
  },

  async mounted() {
    await this.retrieveState();
    await this.retrieveLayers();
    await this.retrieveGranules();

    this.setMapBaselayer();
  }
});
</script>
