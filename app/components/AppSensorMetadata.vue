<template>
  <section class="app-sensor-metadata" :class="{hidden: hide_ui}">
    <header><h4>Sensor Metadata</h4></header>
    <p>Lat: <code>{{ lat.value }}</code> <span :class="'status-indicator status-' + lat.available"></span></p>
    <p>Lon: <code>{{ lon.value }}</code> <span :class="'status-indicator status-' + lon.available"></span></p>
    <p>Speed: <code>{{ speed.value }} kt</code> <span :class="'status-indicator status-' + speed.available"></span></p>
    <p>Heading: <code>{{ heading.value }}°</code> <span :class="'status-indicator status-' + heading.available"></span></p>
    <p>Depth: <code>{{ depth.value }} m</code> <span :class="'status-indicator status-' + depth.available"></span></p>
    <div>
      <span>Time:</span>
      <code>{{ time }}
      <button v-on:click="time_hours_offset += 1">+</button>
      <button v-on:click="time_hours_offset -= 1">-</button>
      <span>{{ time_hours_offset_description }}</span>
    </div>
    <div class="debug" v-if="debug_mode">
      <p>Latitude (dd): <output>{{ latitude_value }}</output></p>
      <p>Longitude (dd): <output>{{ longitude_value }}</output></p>
      <p>Last update: <output>{{ last_update }}</output></p>
      <p>Time offset: <output>{{ time_hours_offset }}</output></p>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import {degreesToStringHDDM} from '../mixins.js';

export default {
  data() {
    return {
      'latitude_value': false,
      'longitude_value': false,
      'velocity_value': false,
      'heading_degrees_value': false,
      'vertical_depth_value': false,
      'latitude_online': false,
      'longitude_online': false,
      'velocity_online': false,
      'heading_degrees_online': false,
      'vertical_depth_online': false,
      'time': '',
      'time_hours_offset': 0,
      'last_update': ''
    }
  },

  props: [
    'display_ui',
    'debug_mode',
    'ogc_endpoint'
  ],

  computed: {
    hide_ui: function() {
      return !this.display_ui;
    },
    lat: function () {
      let value = '-'
      if (this.latitude_value !== false) {
        value = this.latitude_value;
        value = degreesToStringHDDM('NS', this.latitude_value, 3)
      }
      return {
        'value': value,
        'available': this.latitude_online
      };
    },
    lon: function () {
      let value = '-'
      if (this.longitude_value !== false) {
        value = this.longitude_value;
        value = degreesToStringHDDM('EW', this.longitude_value, 3)
      }
      return {
        'value': value,
        'available': this.longitude_online
      };
    },
    speed: function () {
      let value = '-'
      if (this.velocity_value !== false) {
        // assumed this is in knots already
        value = this.velocity_value;
      }
      return {
        'value': value,
        'available': this.velocity_online
      };
    },
    heading: function () {
      let value = '-'
      if (this.heading_degrees_value !== false) {
        value = this.heading_degrees_value;
      }
      return {
        'value': value,
        'available': this.heading_degrees_online
      };
    },
    depth: function () {
      let value = '-'
      if (this.vertical_depth_value !== false) {
        value = this.heading_degrees_value;
      }
      return {
        'value': value,
        'available': this.vertical_depth_value
      };
    },
    time_hours_offset_description: function () {
      let prefix = '';
      if (Math.sign(this.time_hours_offset) === 1) {
        prefix = '+';
      }
      return `UTC${prefix}${this.time_hours_offset}`;
    },
    position: function () {
      return [this.longitude_value, this.latitude_value];
    },
  },

  watch: {
    position: function () {
      this.$emit("update:sensor_position", this.position);
    },
  },

  methods: {
    getSensorReading: async function () {
      let request_endpoint = this.ogc_endpoint + '/geoserver/siis/ows';
      let request_config = {'params': {
        'service': 'WFS',
        'version': '1.0.0',
        'request': 'GetFeature',
        'typeName': 'siis:vw_sensor',
        'maxFeatures': '1',
        'outputFormat': 'application/json'
      }};

      try {
        const response = await axios.get(request_endpoint, request_config);
        let sensorData = response.data.features[0];
        if (sensorData.geometry.coordinates[1] !== null) {
          this.latitude_value = sensorData.geometry.coordinates[1];
        }
        if (sensorData.geometry.coordinates[0] !== null) {
          if (this.longitude_value != sensorData.geometry.coordinates[0]) {
            this.$emit("update:sensor_rotation_longitude", sensorData.geometry.coordinates[0]);
          }
          this.longitude_value = sensorData.geometry.coordinates[0];
        }
        if (sensorData.properties.speed !== null) {
          this.velocity_value = sensorData.properties.speed;
        }
        if (sensorData.properties.heading !== null) {
          if (this.heading_degrees_value != sensorData.properties.heading) {
            this.$emit("update:sensor_rotation_heading", sensorData.properties.heading);
          }
          this.heading_degrees_value = sensorData.properties.heading;
        }
        if (sensorData.properties.depth !== null) {
          this.depth_value = sensorData.properties.depth;
        }
        if (sensorData.properties.pos_online === true) {
          this.latitude_online = true;
          this.longitude_online = true;
        }
        if (sensorData.properties.speed_online === true) {
          this.velocity_online = true;
        }
        if (sensorData.properties.heading_online === true) {
          this.heading_degrees_online = true;
        }
        if (sensorData.properties.depth_online === true) {
          this.vertical_depth_online = true;
        }
        const now = new Date();
        this.last_update = now.toISOString();
      } catch (error) {
        console.error('Sensor data could not be retrieved');
        console.error(error);
      }
    },
    setTime: function () {
      const now = new Date();
      let hours = now.getUTCHours() + this.time_hours_offset;
      this.time = `${String(hours).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}:${String(now.getUTCSeconds()).padStart(2, "0") }`
    }
  },

  async mounted() {
    await this.getSensorReading();
    this.setTime();

    let _this = this;
    setInterval(async function () {
      await _this.getSensorReading();
    }, 5000);
    setInterval(function () {
      _this.setTime();
    }, 1000);
  }
}
</script>

<style scoped>
  .app-sensor-metadata {
    grid-area: sensor-metadata;
    border-top: 1px solid green;
    border-left: 1px solid green;
    border-bottom: 1px solid green;
    z-index: 10;
  }

  .debug {
    border: 2px solid red;
    padding: 4px;
  }

  .status-indicator {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 100%;
  }

  .status-true {
    background-color: #379245;
  }
  .status-false {
    background-color: #B10E1E;
  }
</style>