<template>
  <section class="app-sensor-metadata">
    <header><h4>Sensor Metadata</h4></header>
    <p>Lat: <code>{{ lat.value }}</code> <span :class="'status-indicator status-' + lat.available"></span></p>
    <p>Lon: <code>{{ lon.value }}</code> <span :class="'status-indicator status-' + lon.available"></span></p>
    <p>Speed: <code>{{ speed.value }} kt</code> <span :class="'status-indicator status-' + speed.available"></span></p>
    <p>Heading: <code>{{ heading.value }}°</code> <span :class="'status-indicator status-' + heading.available"></span></p>
    <p>Depth: <code>{{ depth.value }} m</code> <span :class="'status-indicator status-' + depth.available"></span></p>
    <p>Time: <code>{{ time }}</p>
    <div class="debug" v-if="debug_mode">
      <p>Latitude (dd): <output>{{ latitude_value }}</output></p>
      <p>Longitude (dd): <output>{{ longitude_value }}</output></p>
      <p>Last update: <output>{{ last_update }}</output></p>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import {padNumber} from 'ol/string.js';
import {modulo} from 'ol/math.js';

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
      'last_update': ''
    }
  },

  props: [
    'debug_mode',
    'ogc_endpoint'
  ],

  computed: {
    lat: function () {
      let value = '-'
      if (this.latitude_value !== false) {
        value = this.latitude_value;
        value = this.degreesToStringHDDM('NS', this.latitude_value, 3)
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
        value = this.degreesToStringHDDM('EW', this.longitude_value, 3)
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
    }
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
      this.time = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}:${String(now.getUTCSeconds()).padStart(2, "0") }`
    },
    decimalMinutes: function(decimalDegrees, opt_fractionDigits) {
      const degrees = decimalDegrees | 0;
      const decimalMinutes = Math.abs((decimalDegrees - degrees)*60)
      return padNumber(decimalMinutes, 2, opt_fractionDigits);
    },
    degreesToStringHDDM: function(hemispheres, degrees, opt_fractionDigits) {
      const normalizedDegrees = modulo(degrees + 180, 360) - 180;
      const x = Math.abs(3600 * normalizedDegrees);
      const dflPrecision = opt_fractionDigits || 0;
      const precision = Math.pow(10, dflPrecision);
      let deg = Math.floor(x / 3600);
      let min = Math.floor((x - deg * 3600) / 60);
      let sec = x - deg * 3600 - min * 60;
      sec = Math.ceil(sec * precision) / precision;

      if (sec >= 60) {
        sec = 0;
        min += 1;
      }
      if (min >= 60) {
        min = 0;
        deg += 1;
      }

      return (
        deg +
        '\u00b0 ' +
        this.decimalMinutes(degrees, dflPrecision) +
        '\u2032 ' +
        (normalizedDegrees == 0 ? '' : ' ' + hemispheres.charAt(normalizedDegrees < 0 ? 1 : 0))
      );
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