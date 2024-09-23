<template>
<section class="app-panel app-polarroute-controls">
    <h1>PolarRoute</h1>
    <span>Use PolarRoute to calculate the optimal route between two points.</span>
    
    <fieldset id="app-polarroute-control-request">
        <label for="point-select">Start</label>
        
        <button title="Choose on map"
        v-on:click="choose_polarroute_start = !choose_polarroute_start"
        :class="choose_polarroute_start ? 'activated': null"
        >Choose start on map</button>

        <select name="start" id="point-select"
        @input="event => polarroute_coords.start = favourites.filter(obj => {return obj.name === event.target.value})[0]">
          <option value="">or from list</option>
          <option
            v-for="loc in locations"
            >{{ loc.name }}</option>
        </select>
      <button title="Request Route">Get Route</button>
    </fieldset>
</section>
</template>

<script>
import Vue from 'vue';
import { DrawInteraction } from 'vuelayers';

Vue.use(DrawInteraction)

export default {

    props: [
        'debug_mode',
        'polarroute_coords',
        'ship_position_lon',
        'ship_position_lat'
    ],

    data() {
        return {
            choose_polarroute_start: false,
            favourites: [
                {"name": "Falklands", "lat": -51.731, "lon": -57.706},
                {"name": "Signy", "lat": -60.720, "lon": -45.480},
                {"name": "Rothera", "lat": -67.764, "lon": -68.02},
        ]
        }
    },

    computed: {
        locations: function() {
          let _this = this;
          let l = _this.favourites;
          l.unshift({
            "name": "Ship Position",
            "lat": this.ship_position_lat,
            "lon": this.ship_position_lon
          })
          return l 
      }
    },

    watch: {
      choose_polarroute_start: function () {
        this.$emit('update:choose_polarroute_start', this.choose_polarroute_start);
      },
      polarroute_coords: function () {
          this.$emit('update:polarroute_coords', this.polarroute_coords);
        },
    },
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
</style>