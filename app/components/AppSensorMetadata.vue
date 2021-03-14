<template>
  <section>
    <header><h4>Sensor Metadata</h4></header>
    <p>Lat: {{ lat.value }} <span :class="'status-indicator status-' + lat.available"></span></p>
    <p>Lon: {{ lon.value }} <span :class="'status-indicator status-' + lon.available"></span></p>
    <p>Speed: {{ speed.value }} kt <span :class="'status-indicator status-' + speed.available"></span></p>
    <p>Heading: {{ heading.value }}° <span :class="'status-indicator status-' + heading.available"></span></p>
    <p>Depth: {{ depth.value }} m <span :class="'status-indicator status-' + depth.available"></span></p>
    <p>Time: {{ time }}</p>
  </section>
</template>

<script>
import axios from 'axios';

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
      'time': ''
    }
  },

  props: [
    'ogc_endpoint'
  ],

  computed: {
    lat: function () {
      let value = '-'
      if (this.latitude_value !== false) {
        value = this.latitude_value;
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
      } catch (error) {
        console.error('Sensor data could not be retrieved');
        console.error(error);
      }
    },
    setTime: function () {
      const now = new Date();
      this.time = `${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}`
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
.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
}

.status-true {
  background-color: green;
}
.status-false {
  background-color: red;
}
</style>