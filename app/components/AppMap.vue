<template>
  <vl-map
    ref="AppMap"
    :data-projection=projection
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    :defaultControls="controls"
  >
    <vl-view
      ref="AppMapView"
      :projection=projection
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
import proj4 from 'proj4';
import {Attribution, ScaleLine, defaults as defaultControls} from 'ol/control';
import {transform, transformExtent, addProjection} from 'ol/proj'
import {register} from 'ol/proj/proj4';
import Projection from 'ol/proj/Projection';
import VueLayers from 'vuelayers';
import 'vuelayers/dist/vuelayers.css';

Vue.use(VueLayers);

proj4.defs(
  'EPSG:3413',
  '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);
proj4.defs(
  'EPSG:3031',
  '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);
register(proj4);

const projection3413 = new Projection({
  code: 'EPSG:3413',
  extent: [-4194304, -4194304, 4194304, 4194304]
});
const projection3031 = new Projection({
  code: 'EPSG:3031',
  extent: [-12367396.2185, -12367396.2185, 12367396.2185, 12367396.2185]
});
addProjection(projection3413);
addProjection(projection3031);

export default {
  data: function () {
    return {
      wms_layers: [
        "siis:ic_nor_s"
      ],
      rotation_radians: 0,
      centre: [0,0],
      extent: [0,0,0,0],
      zoom: 0,
      projection: "EPSG:3857",
      controls: {
        attribution: false,
        rotate: true,
        zoom: true
      }
    }
  },

  props: ['initial_projection', 'initial_centre', 'initial_zoom', 'initial_rotation_radians'],

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
    },
    projection () {
      this.projectionUpdated()
    }
  },

  methods: {
    centreUpdated: function () {
      this.extentUpdated();
      this.$emit('updateAppMapCentre', transform(this.centre, this.projection, 'EPSG:4326'));
    },
    zoomUpdated: function () {
      this.extentUpdated();
      this.$emit('updateAppMapZoom', this.zoom);
    },
    extentUpdated: function () {
      if (this.$refs.AppMapView.$view == null) return;
      this.extent = transformExtent(this.$refs.AppMapView.$view.calculateExtent(), this.projection, 'EPSG:4326');
      this.$emit('updateAppMapExtent', this.extent);
    },
    rotationUpdated: function () {
      this.$emit('updateAppMapRotationRadians', this.rotation_radians);
      this.$emit('updateAppMapRotationDegrees', this.rotation_degrees);
    },
    projectionUpdated: function () {
      this.$emit('updateAppMapProjection', this.projection);
    },
    setRotationRadians: function(event) {
      this.rotation_radians = event;
    },
    setRotationDegrees: function(event) {
      this.rotation_degrees = event;
    },
    setCentre: function(event) {
      this.centre = transform(event, 'EPSG:4326', this.projection);
    },
    setZoom: function(event) {
      this.zoom = event;
    },
    setProjection: function(event) {
      this.projection = event;
    }
  },

  mounted () {
    this.centre = this.initial_centre;
    this.projection = this.initial_projection;
    this.zoom = this.initial_zoom;
    this.rotation_radians = this.initial_rotation_radians;

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
