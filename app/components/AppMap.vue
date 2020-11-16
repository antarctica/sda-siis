<template>
  <vl-map
    ref="AppMap"
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    :defaultControls="controls"
  >
    <vl-view
      ref="AppMapView"
      :center.sync=centre
      :zoom.sync=zoom
      :rotation.sync="rotation_radians"
    ></vl-view>
    <vl-layer-tile id="osm">
      <vl-source-osm></vl-source-osm>
    </vl-layer-tile>
    <vl-layer-tile id="ice">
      <vl-source-tile-wms :url=wms_endpoint :layers=wms_layers[0]></vl-source-tile-wms>
    </vl-layer-tile>
  </vl-map>
</template>

<script>
import Vue from 'vue'
import {Attribution, ScaleLine, defaults as defaultControls} from 'ol/control';
import {transform, transformExtent} from 'ol/proj'
import VueLayers from 'vuelayers'
import 'vuelayers/dist/vuelayers.css'

Vue.use(VueLayers)

export default {
  data: function () {
    return {
      wms_layers: [
        "siis:ic_nor_s"
      ],
      rotation_radians: 0,
      centre: [0,0],
      extent: [0,0,0,0],
      controls: {
        attribution: false,
        rotate: true,
        zoom: true
      }
    }
  },

  props: ['initial_centre', 'zoom', 'initial_rotation_radians', 'ogc_endpoint'],

  computed: {
    rotation_degrees: {
      get () {
        return Math.floor(this.rotation_radians * 180/ Math.PI)
      },
      set (value) {
        this.rotation_radians = value * Math.PI / 180
      }
    },
    wms_endpoint: function () {
      return this.ogc_endpoint + "?version=1.3.0"
    }
  },

  watch: {
  	centre () {
      this.centreUpdated();
    },
    zoom () {
      this.zoomUpdated();
    },
    rotation_radians () {
      this.rotationUpdated()
    },
    rotation_degrees () {
      this.rotationUpdated()
    }
  },

  methods: {
    centreUpdated: function () {
      this.extentUpdated();
      this.$emit('updateAppMapCentre', transform(this.centre, 'EPSG:3857', 'EPSG:4326'));
    },
    zoomUpdated: function () {
      this.extentUpdated();
      this.$emit('updateAppMapZoom', this.zoom);
    },
    extentUpdated: function () {
      if (this.$refs.AppMapView.$view == null) return;
      this.extent = transformExtent(this.$refs.AppMapView.$view.calculateExtent(), 'EPSG:3857', 'EPSG:4326');
      this.$emit('updateAppMapExtent', this.extent);
    },
    rotationUpdated: function () {
      this.$emit('updateAppMapRotationRadians', this.rotation_radians);
      this.$emit('updateAppMapRotationDegrees', this.rotation_degrees);
    },
    setRotationRadians: function(event) {
      this.rotation_radians = event;
    },
    setRotationDegrees: function(event) {
      this.rotation_degrees = event;
    },
    setCentre: function(event) {
      this.centre = transform(event, 'EPSG:4326', 'EPSG:3857');
    }
  },

  mounted () {
    const attribution = new Attribution({
      collapsible: true,
    });
    const scaleLine = new ScaleLine();

    this.$refs.AppMapView.$createPromise.then(() => {
      this.centreUpdated();
      this.extentUpdated();
    });

    this.$refs.AppMap.$createPromise.then(() => {
      this.$refs.AppMap.$map.addControl(scaleLine);
      this.$refs.AppMap.$map.addControl(attribution);
    });

    this.centre = this.initial_centre
  }
}
</script>

<style scoped>
  .vl-map {
    width: 100%;
    height: 500px;
  }
  .vl-map .ol-rotate {
    top: 3em;
  }
</style>
