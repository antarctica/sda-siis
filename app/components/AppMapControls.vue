<template>
  <section class="app-map-controls">
    <fieldset id="app-map-control-zoom"></fieldset>
    <fieldset id="app-map-control-fullscreen">
      <button
        v-on:click="makeAppFullscreen"
        title="Make full screen"
      >X
    </fieldset>
    <fieldset>
      <button
        v-on:click="display_ui = !display_ui"
        :class="!display_ui ? 'activated': null"
        title="Hide control panels"
      >O
      </button>
    </fieldset>
    <fieldset>
      <button v-on:click="updateMapCentre" title="Pan to vessel position">C</button>
      <button
        v-on:click="follow_sensor_position = !follow_sensor_position"
        :class="follow_sensor_position ? 'activated': null"
        title="Follow vessel position"
        >F
        </button>
    </fieldset>
    <fieldset>
      <button
        v-on:click="rotation_source = 'reset'"
        :class="rotation_source === 'reset' ? 'activated': null"
        title="Default map rotation"
      >Pr
      </button>
      <button
        v-on:click="rotation_source = 'heading'"
        :class="rotation_source === 'heading' ? 'activated': null"
        title="Vessel heading up rotation"
      >Hd
      </button>
      <button
        v-on:click="rotation_source = 'longitude'"
        :disabled="crs == 'EPSG:3857' ? 'disabled' : null"
        :class="rotation_source === 'longitude' ? 'activated': null"
        title="Vessel longitude up rotation"
      >Ln
      </button>
    </fieldset>
    <fieldset>
      <button
        v-on:click="crs = 'EPSG:3413'"
        :class="crs === 'EPSG:3413' ? 'activated': null"
        title="Arctic Polar Stereographic"
      >Ar
      </button>
      <button
        v-on:click="crs = 'EPSG:3031'"
        :class="crs === 'EPSG:3031' ? 'activated': null"
        title="Antarctic Polar Stereographic"
      >An
      </button>
      <button
        v-on:click="crs = 'EPSG:3857'"
        :class="crs === 'EPSG:3857' ? 'activated': null"
        title="Mercator Projection"
      >Mc
      </button>
    </fieldset>
    <fieldset>
      <button
        v-on:click="changePostionFormat"
        :class="position_format === 'xy' ? 'activated': null"
        title="Mouse cursor position: Lat/Lon - Projection"
      >DD
      </button>
      <button
        v-on:click="changeScaleBarUnit"
        :class="scale_bar_unit === 'metric' ? 'activated': null"
        title="Mouse cursor position: Metric - Nautical distances"
      >NM
      </button>
    </fieldset>
    <fieldset>
      <button
        v-on:click="changeDayNightMode"
        :class="day_night_mode === 'night' ? 'activated': null"
        title="Dark/Night mode"
        >D</button>
    </fieldset>
    <fieldset>
      <button
        v-on:click="show_graticule = !show_graticule"
        :class="show_graticule ? 'activated': null"
        title="Graticule on/off"
      >G
      </button>
    </fieldset>
    <fieldset>
      <button
        v-on:click="show_measure_tool = !show_measure_tool"
        :class="show_measure_tool ? 'activated': null"
        title="Measure route"
      >M
      </button>
      <div
        class="measure-tool-feature-tool-feature-count"
        :class="measure_tool_feature_count == 0 ? 'disabled' : null"
        title="Measured route - number of waypoints"
      >{{ measure_tool_feature_count }}
      </div>
      <div
        class="measure-tool-feature-tool-feature-length"
        :class="measure_tool_feature_length == 0 ? 'disabled' : null"
        title="Measured route - length (metres)"
      >{{ measure_tool_feature_length_formatted }}km
      </div>
      <button
        v-on:click="exportDrawnFeature"
        :disabled="measure_tool_feature_count == 0 || measure_tool_feature_count >= this.measure_tool_max_features ? 'disabled' : null"
        title="Measured route - export to ECDIS"
      >E
      </button>
      <input
        ref="referenceFeatureEcdisFileUpload"
        @change="handleImportReferenceFeatureEcdis"
        type="file"
        hidden
      >
      <button
        title="Import route from ECDIS"
        v-on:click="importReferenceFeatureEcdis"
      >Ie
      </button>
      <input
        ref="referenceFeatureAIRoutePlannerFileUpload"
        @change="handleImportReferenceFeatureAIRoutePlanner"
        type="file"
        hidden
      >
      <button
        title="Import route from AI Lab Route Planner"
        v-on:click="importReferenceFeatureAIRoutePlanner"
      >Ia
      </button>
      <button
        v-on:click="resetDrawnFeature"
        :disabled="measure_tool_feature_count == 0 ? 'disabled' : null"
        title="Clear measured route"
      >Rm
      </button>
      <button
        v-on:click="resetReferenceFeature"
        :disabled="reference_feature_count == 0 ? 'disabled' : null"
        title="Clear imported/reference route"
      >Ri
      </button>
    </fieldset>
    <fieldset>
      <button
        v-on:click="show_ship_position = !show_ship_position" :class="show_ship_position ? 'activated': null"
        title="Show ship position"
      >Sp
      </button>
      <button
        v-on:click="show_ship_track = !show_ship_track" :class="show_ship_track ? 'activated': null"
        title="Show ship track"
      >St
      </button>
    </fieldset>
    <div class="debug" v-if="debug_mode">
      <p>Debug mode: <output>{{ debug_control }}</output></p>
      <p>Day/Night mode: <output>{{ day_night_mode }}</output></p>
      <p>CRS: <output>{{ crs }}</output><p>
      <p>Rotation source: <output>{{ rotation_source }}</output></p>
      <p>Rotation value (degrees): <output>{{ rotation_degrees }}</output></p>
      <p>Rotation value (radians): <output>{{ rotation_radians }}</output></p>
      <p>Position format: <output>{{ position_format }}</output></p>
      <p>Scale bar units: <output>{{ scale_bar_unit }}</output></p>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      'crs': 'EPSG:3413',
      'display_ui': true,
      'debug_control': false,
      'day_night_mode': 'day',
      'rotation_source': 'manual',
      'rotation_degrees': 0,
      'position_format': 'latlon',
      'scale_bar_unit': 'nautical',
      'follow_sensor_position': false,
      'map_centre_4326': [0,0],
      'show_graticule': true,
      'show_measure_tool': false,
      'show_ship_position': false,
      'show_ship_track': false,
      'reference_feature_count': 0,
    }
  },

  props: [
    'debug_mode',
    'api_endpoint',
    'initial_crs',
    'initial_day_night_mode',
    'rotation_heading',
    'rotation_longitude',
    'sensor_position',
    'measure_tool_feature_count',
    'measure_tool_feature_length',
    'measure_tool_feature_geojson',
    'measure_tool_max_features'
  ],

  computed: {
    rotation_control_disabled: function() {
      if (this.rotation_source == 'manual') {
        return false;
      }
      return true;
    },
    rotation_radians: function() {
      return this.rotation_degrees * Math.PI / 180;
    },
    measure_tool_feature_length_formatted: function() {
      let length_km = this.measure_tool_feature_length / 1000;
      return Math.floor(length_km * 100) / 100; // round down to 2 decimal places
    },
  },

  watch: {
    crs: function () {
      this.$emit("update:crs", this.crs);

      if (this.crs === 'EPSG:3857') {
        this.rotation_source = 'manual';
      }
    },
    rotation_source: function () {
      this.$emit('update:rotation_source', this.rotation_source);
      this.updateRotation();
    },
    display_ui: function () {
      this.$emit('update:display_ui', this.display_ui);
    },
    debug_control: function () {
      this.$emit('update:debug_mode', this.debug_control);
    },
    rotation_heading: function () {
      this.updateRotation();
    },
    rotation_longitude: function () {
      this.updateRotation();
    },
    rotation_degrees: function () {
      this.$emit('update:rotation_radians', this.rotation_radians);
    },
    sensor_position: function () {
      if (this.follow_sensor_position) {
        this.map_centre_4326 = this.sensor_position;
      }
    },
    map_centre_4326: function () {
      this.$emit('update:map_centre', this.map_centre_4326);
    },
    show_graticule: function () {
      this.$emit('update:show_graticule', this.show_graticule);
    },
    show_measure_tool: function () {
      this.$emit('update:show_measure_tool', this.show_measure_tool);
    },
    show_ship_position: function () {
      this.$emit('update:show_ship_position', this.show_ship_position);
    },
    show_ship_track: function () {
      this.$emit('update:show_ship_track', this.show_ship_track);
    },
    measure_tool_feature_geojson: function () {
      this.exportDrawnFeatureGeoJSON();
    },
  },

  methods: {
    changeDayNightMode: function ($event) {
      if (this.day_night_mode == 'day') {
        this.day_night_mode = 'night';
      } else if (this.day_night_mode == 'night') {
        this.day_night_mode = 'day';
      }
      this.$emit('update:day_night', this.day_night_mode);
    },
    changePostionFormat: function ($event) {
      if (this.position_format == 'latlon') {
        this.position_format = 'xy';
      } else if (this.position_format == 'xy') {
        this.position_format = 'latlon';
      }
      this.$emit('update:position_format', this.position_format);
    },
    changeScaleBarUnit: function ($event) {
      if (this.scale_bar_unit == 'nautical') {
        this.scale_bar_unit = 'metric';
      } else if (this.scale_bar_unit == 'metric') {
        this.scale_bar_unit = 'nautical';
      }
      this.$emit('update:scale_bar_unit', this.scale_bar_unit);
    },
    updateRotation: function() {
      // see https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/111#note_72883 for where this logic came from.
      if (this.rotation_source === 'heading') {
        if (this.crs === 'EPSG:3857') {
          this.rotation_degrees = this.invertSign(this.rotation_heading);
        } else if (this.crs === 'EPSG:3031') {
          this.rotation_degrees = this.invertSign(this.rotation_heading + this.rotation_longitude);
        } else if (this.crs === 'ESPG:3413') {
          this.rotation_degrees = this.invertSign(this.rotation_heading - this.rotation_longitude - 45);
        }
      } else if (this.rotation_source === 'longitude') {
        if (this.crs === 'EPSG:3857') {
          this.rotation_degrees = this.rotation_longitude;
        } else if (this.crs === 'EPSG:3031') {
          this.rotation_degrees = this.invertSign(this.rotation_longitude);
        } else if (this.crs === 'ESPG:3413') {
          this.rotation_degrees = this.rotation_longitude + 45;
        }
      } else if (this.rotation_source === 'reset') {
        this.rotation_degrees = 0
      }
    },
    invertSign: function (value) {
      if (Math.sign(value) === 1) {
        return -Math.abs(value);
      } else if (Math.sign(value) === -1) {
        return Math.abs(value);
      }
    },
    updateMapCentre: function() {
      this.map_centre_4326 = this.sensor_position;
    },
    resetDrawnFeature: function() {
      this.$emit('update:reset_drawn_feature');
    },
    exportDrawnFeature: function() {
      this.$emit('update:export_drawn_feature');
    },
    prepareDrawnFeatureGeoJSON: function(feature) {
      const name_free_text_regex = /^[a-zA-Z0-9-_]+$/;
      let name_free_text = prompt("Route name (no spaces or special characters, except '-' or '_')");
      let timestamp = Math.floor(Date.now() / 1000);

      if (!name_free_text_regex.test(name_free_text)) {
        return false;
    }

      feature.properties = {};
      feature.properties.route_name = `siis-${name_free_text}-${timestamp}`;
      return feature;
    },
    exportDrawnFeatureGeoJSON: function() {
      let data = this.prepareDrawnFeatureGeoJSON(JSON.parse(this.measure_tool_feature_geojson))
      if (data === false) {
        alert('Route name is invalid - aborting.');
        return false;
      }

      axios({
        url: this.api_endpoint + '/routes/convert',
        method: 'POST',
        responseType: 'blob',
        headers: {
          'content-type': 'application/geo+json',
          'accept': 'application/rtzp',
        },
        data: data,
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'siis-route.rtzp');
        document.body.appendChild(link);
        link.click();
      })
      .catch(function(){
        alert('Failed to export route.');
      });
    },
    importReferenceFeatureEcdis: function() {
      this.$refs.referenceFeatureEcdisFileUpload.click();
    },
    importReferenceFeatureAIRoutePlanner: function() {
      this.$refs.referenceFeatureAIRoutePlannerFileUpload.click();
    },
    handleImportReferenceFeatureEcdis: function(event) {
      axios({
        url: this.api_endpoint + '/routes/convert',
        method: 'POST',
        headers: {
          'content-type': 'application/rtzp',
          'accept': 'application/geo+json',
        },
        data: event.target.files[0]
      })
      .then((response) => {
        this.determineReferenceFeatureCount(response.data);
        this.$emit('update:import_reference_feature', response.data);
      })
      .catch(function(){
        alert('Failed to import route.');
      });
    },
    handleImportReferenceFeatureAIRoutePlanner: function(event) {
      const reader = new FileReader()
      reader.addEventListener("load", event => {
        let feature = JSON.parse(reader.result)['features'][0];
        this.determineReferenceFeatureCount(feature);
        this.$emit('update:import_reference_feature', feature);
      });
      reader.readAsText(event.target.files[0]);
    },
    determineReferenceFeatureCount: function(feature) {
      let feature_vertex_count = 0;

      if (Array.isArray(feature?.geometry?.coordinates)) {
        feature_vertex_count = feature.geometry.coordinates.length;
      }

      this.reference_feature_count = feature_vertex_count;
    },
    resetReferenceFeature: function() {
      let feature = {};
      this.determineReferenceFeatureCount(feature);
      this.$emit('update:import_reference_feature', feature);
    },
    makeAppFullscreen: function() {
      // this should be `document.fullscreenElement` but this always seems to be undefined
      if (document.mozFullScreenElement) {
        document.exitFullscreen();
      } else {
        const appElement = document.getElementById("app-wrapper");
        appElement.requestFullscreen();
      }
    },
  },

  mounted() {
    this.crs = this.initial_crs;
    this.day_night_mode = this.initial_day_night_mode;
  }
}
</script>

<style scoped>
  .app-map-controls {
    grid-area: map-controls;
    z-index: 10;
  }

  fieldset {
    display: inline-flex;
    padding: 0 6px;
    border: none;
  }
  fieldset:first-of-type {
    padding-left: 0;
  }

  fieldset select, button,
  fieldset div button {
    height: 30px;
    width: 30px;
  }

  .activated {
    box-shadow: inset 1px 1px 4px #777;
    transform: translateY(1px);
    background-color: #d5caca;
    border-style: double;
    border-radius: 4px;
  }

  .measure-tool-feature-tool-feature-count,
  .measure-tool-feature-tool-feature-length {
    width: 28px;
    height: 25px;
    background-color: #e9e9ed;
    border: 1px solid #8f8f9d;
    border-radius: 4px;
    text-align: center;
    padding-top: 3px;
  }
  .measure-tool-feature-tool-feature-count.disabled,
  .measure-tool-feature-tool-feature-length.disabled {
    opacity: 60%;
  }
  .measure-tool-feature-tool-feature-length {
    width: 100px;
  }
</style>
