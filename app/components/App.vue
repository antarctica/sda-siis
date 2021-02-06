<template>
  <div id="app-wrapper">
    <app-colour-scheme :colour_scheme=preferences.colour_scheme></app-colour-scheme>
    <header>
        <h1>SIIS</h1>
    </header>
    <main>
      <h2>Properties</h2>
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
          <tr>
            <td>Granules max age (hours)</td>
            <td>0</td>
            <td>{{ preferences.granule_max_age_hours }}</td>
            <td>False</td>
            <td>
              <select v-model="preferences.granule_max_age_hours">
                <option value=0>0 (No Limit)</option>
                <option value=72>Last 72 hours</option>
                <option value=48>Last 48 hours</option>
                <option value=24>Last 24 hours</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Granules max age (datetime)</td>
            <td><em>N/A</em></td>
            <td>{{ granule_max_age_datetime }}</td>
            <td>False</td>
            <td><em>N/A</em></td>
          </tr>
          <tr>
            <td>Map position format</td>
            <td><output>{{ map_defaults.position_format }}</output></td>
            <td><output>{{ map_instant.position_format }}</output></td>
            <td>False</td>
            <td>
              <select v-model="map_update.position_format">
                <option value=latlon>Lat Lon</option>
                <option value=xy>XY (Projected)</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Scale bar units</td>
            <td><output>{{ map_defaults.scale_bar_unit }}</output></td>
            <td><output>{{ map_instant.scale_bar_unit }}</output></td>
            <td>False</td>
            <td>
              <select v-model="map_update.scale_bar_unit">
                <option value=nautical>Nautical miles (nm)</option>
                <option value=metric>Metric (m, km)</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />

      <button v-on:click="persistState" :disabled=controls.persistState.disabled>Persist State</button>
      <button v-on:click="retrieveState" :disabled=controls.retrieveState.disabled>Retrieve State</button>
      <button v-on:click="retrieveProducts" :disabled=controls.retrieveProducts.disabled>Retrieve Products</button>
      <button v-on:click="retrieveGranules" :disabled=controls.retrieveGranules.disabled>Retrieve Granules</button>
      <hr />

      <h2>Available layers</h2>
      <table>
        <thead>
          <tr>
            <th>Product (Label)</th>
            <th>Product (Legend)</th>
            <th>Granule (ID)</th>
            <th>Granule (Timestamp)</th>
            <th>Controls</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product_granule in products_granules" :key="product_granule.granule.id">
            <td>{{ product_granule.product.label }}</td>
            <td><img v-bind:src="product_granule.product.legend_url"></td>
            <td>{{ product_granule.granule.id }}</td>
            <td>{{ product_granule.granule.timestamp }}</td>
            <td>
              <button v-on:click="displayGranule(product_granule.product.code, product_granule.granule.id)">Display</button>
              <button v-on:click="hideGranule(product_granule.product.code, product_granule.granule.id)">Hide</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Raw output (temporary, enable as needed) -->
      <!-- <table>
        <thead>
          <tr>
            <th>Product (Label)</th>
            <th>Granules</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product_granule in products_granules" :key="product_granule.granule.id">
            <td>{{ product_granule.product }}</td>
            <td>{{ product_granule.granule }}</td>
          </tr>
        </tbody>
      </table> -->

      <h2>Active layers</h2>
      <table>
        <thead>
          <tr>
            <th>Layer (object)</th>
            <th>Layer (controls)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="layer in active_layers" :key="layer.granule_id">
            <td>{{ layer }}</td>
            <td>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                :name="'opacity-' + layer.product_id + '-' + layer.granule_id"
                v-model.number="layer.opacity"
              >
              <label :for="'opacity-' + layer.product_id + '-' + layer.granule_id">Opacity</label>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />

      <h2>Active granules</h2>
      <table>
        <thead>
          <tr>
            <th>Granule (ID)</th>
            <th>Granule (Product Name)</th>
            <th>Granule (Name)</th>
            <th>Granule (Timestamp)</th>
            <th>Granule (Legend)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="granule in active_granules" :key="granule.granule_id">
            <td>{{ granule.granule_id }}</td>
            <td>{{ granule.product_label }}</td>
            <td>{{ granule.granule_label }}</td>
            <td>{{ granule.datetime }}</td>
           <td><img v-bind:src="granule.legend_url"></td>
        </tbody>
      </table>
      <hr />

      <app-map
        ref="AppMap"
        :initial_projection=map_defaults.crs
        :initial_zoom=map_defaults.zoom
        :initial_centre=map_defaults.centre
        :initial_rotation_radians=map_defaults.rotation_radians
        :layers=active_layers
        :mouse_position_format=map_update.position_format
        :scale_bar_unit=map_update.scale_bar_unit
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
      preferences: {
        colour_scheme: 'system',
        granule_max_age_hours: 0
      },
      controls: {
        persistState: {
          disabled: false
        },
        retrieveState: {
          disabled: false
        },
        retrieveProducts: {
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
        crs: "EPSG:3413",
        position_format: "latlon",
        scale_bar_unit: "nautical"
      },
      map_instant: {
        centre: [0,0],
        zoom: 0,
        extent: [0,0,0,0],
        rotation_radians: 0,
        rotation_degrees: 0,
        crs: "EPSG:3413",
        position_format: "latlon",
        scale_bar_unit: "nautical"
      },
      map_update: {
        centre: [0,0],
        rotation_radians: 0,
        rotation_degrees: 0,
        crs: "EPSG:3413",
        position_format: "latlon",
        scale_bar_unit: "nautical"
      },
      products: {},
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
    products_granules: function () {
      const _products_granules = [];
      for (const product of Object.values(this.products)) {
        for (const granule of Object.values(product.granules)) {
          _products_granules.push({'product': product, 'granule': granule})
        }
      }
      return _products_granules;
    },
    granule_max_age_datetime: function () {
      const date = new Date();
      date.setHours(date.getHours() - this.preferences.granule_max_age_hours)
      return date.toISOString();
    },
    active_granules: function () {
      return this.active_layers.filter(layer => layer.granule_id.includes('base'));
    },
  },

  components: {
    AppColourScheme,
    AppMap
  },

  watch: {
  	'preferences.granule_max_age_hours': function () {
      this.retrieveGranules();
    }
  },

  methods: {
    async persistState (context) {
      try {
        const _state = {
          settings: {}
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
      } catch (error) {
        console.error('State could not be retrieved');
        console.error(error);
      }
    },
    async retrieveProducts (context) {
      let request_endpoint = this.siis_api_endpoint + '/products';
      let request_config = {'params': {}};

      if (this.map_update.crs == 'EPSG:3413') {
        request_config['params']['hemi'] = 'n';
      } else if (this.map_update.crs == 'EPSG:3031') {
        request_config['params']['hemi'] = 's';
      }

      try {
        const response = await axios.get(request_endpoint, request_config);
        const data = response.data;
        const products = {};
        data.forEach((product) => {
          product.granules = {};
          product.legend_url = this.siis_ogc_endpoint + product.gs_tempwmsendpoint + "/?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=" + product.gs_layername;
          products[product.code] = product;
        });
        this.products = products;
        this.controls.retrieveGranules.disabled = false;
      } catch (error) {
        console.error('Products could not be retrieved');
        console.error(error);
      }
    },
    async retrieveGranules (context) {
      let request_endpoint = this.siis_api_endpoint + '/granules';
      let request_config = {'params': {}};

      if (this.preferences.granule_max_age_hours != 0) {
        request_config['params']['maxage'] = this.preferences.granule_max_age_hours;
      }

      try {
        const response = await axios.get(request_endpoint, request_config);
        const data = response.data;
        const _products = this.products;

        // reset granules in products
        for (const _product in _products) {
          this.$set(_products[_product], 'granules', {});
        }

        data.forEach((granule) => {
          if (!(granule.productcode in _products)) {
            console.warn("Product [" + granule.productcode + "] used in Granule [" + granule.id + "] does not exist, skipping granule");
            console.info("Available product IDs:");
            console.info(Object.keys(_products));
            return;
          }
          this.$set(_products[granule.productcode]['granules'], granule.id, granule);
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

      // set this from a product definition in future #64
      const _common = {
        'protocol': 'wmts',
        'endpoint': this.siis_ogc_endpoint + '/geoserver/gwc/service/wmts',
        'attribution': 'BAS',
        'style': 'line',
        'opacity': 1
      }

      if (this.map_update.crs == 'EPSG:3413') {
        this.active_layers.push({...{
          'layer': 'siis:base_n',
          'granule_id': 'base-n',
        }, ..._common});
      } else if (this.map_update.crs == 'EPSG:3031') {
        this.active_layers.push({...{
          'layer': 'siis:base_s',
          'granule_id': 'base-s',
        }, ..._common});
      } else if (this.map_update.crs == 'EPSG:3857') {
        this.active_layers.push({...{
          'layer': 'siis:base_n',
          'granule_id': 'base-n',
        }, ..._common});
        this.active_layers.push({...{
          'layer': 'siis:base_s',
          'granule_id': 'base-s',
        }, ..._common});
      }

      await this.retrieveProducts();
      await this.retrieveGranules();
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
    displayGranule: function (product_id, granule_id) {
      const product = this.products[product_id];
      const granule = product.granules[granule_id];
      let protocol = this._determinePreferableOGCProtocol(product.types);
     let endpoint = false;

      // overriding result due to mismatches between WMS and WMTS (see #51 for details)
      protocol = 'wms';

      if (protocol === 'wmts') {
        endpoint = `${this.siis_ogc_endpoint}${product.gs_tempwmtsendpoint}`;
      }
      else if (protocol === 'wms') {
        endpoint = `${this.siis_ogc_endpoint}${product.gs_tempwmsendpoint}`;
      }

      this.active_layers.push({
        'product_id': product_id,
        'granule_id': granule_id,
        'product_label': product.label,
        'granule_label': granule.productname,
        'protocol': protocol,
        'endpoint': endpoint,
        'layer': product.gs_layername,
        'legend_url': product.legend_url,
        'style': product.style,
        'attribution': product.attribution,
        'datetime': granule.timestamp,
        'time': granule.timestamp.split('T')[0],
        'opacity': 1
      });
    },
    hideGranule: function (product_id, granule_id) {
      let granule_index = this._determineIfProductGranuleIsActive(product_id, granule_id);
      if (granule_index > -1) {
        this.active_layers.splice(granule_index, 1);
      }
    },
    _determinePreferableOGCProtocol: function (protocols) {
      if (protocols.includes('WMTS')) {
        return 'wmts';
      } else if (protocols.includes('WMS')) {
        return 'wms';
      }
    },
    _determineIfProductGranuleIsActive(product_id, granule_id) {
      return this.active_layers.findIndex(function(active_layer) {
        return active_layer.product_id === product_id && active_layer.granule_id === granule_id;
      });
    }
  },

  async mounted() {
    await this.retrieveState();

    this.setMapBaselayer();
  }
});
</script>
