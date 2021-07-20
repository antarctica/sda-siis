<template>
  <section class="product-wrapper">
    <input
      type="radio"
      name="product-selection"
      :id="'product-selection-' + id"
      :value="id"
      v-model="selected"
      class="selected-control"
    >
    <input
      type="checkbox"
      name="active-products"
      :id="'active-products-' + id"
      v-model="active"
      class="active-control"
    >
    <div class="granule-previous-control">
      <div v-if="has_granules && granules_selection_mode == 'single'">
        <button v-on:click="selectPreviousGranule" :disabled="can_select_previous_granule">&lt;&lt;</button>
      </div>
    </div>
    <div class="granule-next-control">
      <div v-if="has_granules && granules_selection_mode == 'single'">
        <button v-on:click="selectNextGranule" :disabled="can_select_next_granule">&gt;&gt;</button>
      </div>
    </div>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      :id="'product-opacity-' + id"
      :name="'product-opacity-' + id"
      v-model.number="opacity"
      class="opacity-control"
    >
    <span class="name-control">{{ label }}</span>
    <div class="debug" v-if="debug_mode">
      <p>Code: {{ code }}</p>
      <p>Selected: {{ is_selected }}</p>
      <p>Active: {{ is_active }}</p>
      <p>Opacity: {{ opacity }}</p>
      <p>Value at pixel supported: {{ supports_value_at_pixel }}</p>
      <p>Has granules?: {{ has_granules }}</p>
      <div v-if="has_granules">
        <p>Granule selection mode: {{ granules_selection_mode }}</p>
        <p>Enable prev granule control {{ can_select_previous_granule }}</p>
        <p>Enable next granule control {{ can_select_next_granule }}</p>
        <p>Selected granules (indexes: {{ selected_granule_indexes }}):</p>
        <pre v-for="selected_granule in selected_granules" :key="selected_granule.id">{{ selected_granule }}</pre>
        <p>Granules:</p>
        <pre>{{ granules }}</pre>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      'id': '',
      'code': '',
      'label': '',
      'status': '',
      'ogc_protocol': '',
      'ogc_protocol_url': '',
      'ogc_layer_name': '',
      'ogc_format': '',
      'ogc_style': '',
      'legend_url': '',
      'attribution': '',
      'opacity': 0,
      'is_active': false,
      'granules': [],
      'selected_granule_indexes': [],
      'has_granules': false,
      'granules_selection_mode': '',
      'supports_value_at_pixel': false
    }
  },

  props: [
    'debug_mode',
    'api_endpoint',
    'ogc_endpoint',
    'time_filter',
    'initial_product',
    "initial_active_product_ids",
    'selected_product_id',
    "selected_footprints"
  ],

  computed: {
    selected: {
      get: function() {
        return this.selected_product_id;
      },
      set: function() {
        this.$emit("update:selected_product", this.$data);
      }
    },
    active: {
      get: function() {
        return this.is_active;
      },
      set: function() {
        this.is_active = !this.is_active;
        this.$emit("update:active_product", this.$data);
      }
    },
    is_selected: function () {
      if (this.selected_product_id == this.id) {
        return true;
      }
      return false;
    },
    selected_granules: function () {
      let _selected_granules = [];
      this.selected_granule_indexes.forEach((selected_granule_index) => {
        _selected_granules.push(this.granules[selected_granule_index]);
      });
      return _selected_granules;
    },
    can_select_previous_granule: function() {
      if (!this.has_granules) {
        return false;
      }
      if (this.granules_selection_mode === 'multiple') {
        return false;
      }
      if (this.selected_granule_indexes[0] > 0) {
        return false;
      }
      return true;
    },
    can_select_next_granule: function() {
      if (!this.has_granules) {
        return false;
      }
      if (this.granules_selection_mode === 'multiple') {
        return false;
      }
      if ((this.selected_granule_indexes[0] + 1) < this.granules.length) {
        return false;
      }
      return true;
    }
  },

  watch: {
    time_filter: async function () {
      if (this.has_granules && this.granules_selection_mode === 'single') {
        // as we don't know how many granules there will be the current selected index may be out of range,
        // we therefore set the index to 0 first and then update it the new array length after getting granules.
        this.selected_granule_indexes = [0];
        this.granules = await this.getGranules();
        this.selected_granule_indexes = [this.granules.length - 1];
      }
    },
    initial_active_product_ids: function () {
      this.checkIfActiveProduct();
    },
    selected_granules: function () {
      if (this.is_selected) {
        this.$emit("update:selected_granules", this.$data);
      }
    },
    selected_footprints: function () {
      if (this.has_granules && this.granules_selection_mode === 'multiple') {
        this.selectGranulesFromFootprints();
      }
    }
  },

  methods: {
    init: async function() {
      this.id = String(this.initial_product.id);
      this.code = this.initial_product.code;
      this.label = this.initial_product.label;
      this.status = this.initial_product.status;
      this.ogc_protocol = this.determinePreferredOGCProtocol(this.initial_product.types);
      this.ogc_protocol_url = this.determineOGCProtocolEndpoint();
      this.ogc_layer_name = this.initial_product.gs_layername,
      this.ogc_format = this.determineOGCFormat(this.initial_product.formats);
      this.ogc_style = this.initial_product.style;
      this.legend_url = this.determineLegendUrl();
      this.attribution = this.initial_product.attribution;
      this.opacity = 1;
      this.has_granules = !this.initial_product.static;
      this.supports_value_at_pixel = this.determineValueAtPixelSupported(this.code);

      if (this.has_granules) {
        this.granules_selection_mode = this.determineGranuleSelectionMode(this.initial_product.render_exclusive);
        this.granules = await this.getGranules();
        if (this.granules_selection_mode === 'single') {
          this.selected_granule_indexes = [this.granules.length - 1];
        }
      }
    },
    determinePreferredOGCProtocol: function(protocols) {
      if (protocols.includes('WMTS')) {
        // Treat all WMTS layers as WMS until https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/51 is resolved
        return 'wms';
      } else if (protocols.includes('WMS')) {
        return 'wms';
      } else if (protocols.includes('WFS')) {
        return 'wfs';
      }
    },
    determineOGCProtocolEndpoint: function() {
      if (this.ogc_protocol === 'wmts') {
        return `${this.ogc_endpoint}${this.initial_product.gs_tempwmtsendpoint}`;
      } else if (this.ogc_protocol === 'wms') {
        return `${this.ogc_endpoint}${this.initial_product.gs_tempwmsendpoint}`;
      } else if (this.ogc_protocol === 'wfs') {
        return `${this.ogc_endpoint}${this.initial_product.gs_tempwfsendpoint}`;
      }
    },
    determineOGCFormat: function(formats) {
      if (formats.includes('image/png')) {
        return 'image/png';
      } else if (formats.includes('image/jpeg')) {
        return 'image/jpeg';
      }
    },
    determineLegendUrl: function() {
      return `${this.ogc_endpoint}${this.initial_product.gs_tempwmsendpoint}/?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${this.ogc_layer_name}`;
    },
    determineGranuleSelectionMode: function(mode) {
      if (mode) {
        return 'single';
      }
      return 'multiple';
    },
    determineValueAtPixelSupported: function(code) {
      // Currently determined based on hard-coded layers - see https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/84
      if (code === 'siis.ic-nor.s' || code === 'siis.sic.n' || code === 'siis.sic.s') {
        return true;
      }
      return false;
    },
    checkIfActiveProduct: function() {
      if (this.initial_active_product_ids.includes(this.id)) {
        this.is_active = true;
        this.$emit("update:active_product", this.$data);
      }
    },
    getGranules: async function() {
      let request_endpoint = this.api_endpoint + `/products/${this.code}/granules`;
      let request_config = {'params': {}};

      if (this.time_filter > 0) {
        request_config['params']['maxage'] = this.time_filter;
      }

      try {
        const response = await axios.get(request_endpoint, request_config);
        let granules = [];
        response.data.forEach((granule) => {
          granules.push({
            'id': granule.id,
            'label': granule.productname,
            'status': granule.status,
            'timestamp': this.formatGranuleTimestamp(granule.timestamp)
          });
        });
        return granules;
      } catch (error) {
        console.error('Granules could not be retrieved');
        console.error(error);
      }
    },
    formatGranuleTimestamp: function(timestamp) {
      // convert `2021-06-14T13:24:51.009896` into `2021-06-14`
      // see https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/90 for long term fix
      return timestamp.split('T')[0];
    },
    selectPreviousGranule: function() {
      if (this.granules_selection_mode === 'single') {
        this.selected_granule_indexes = [this.selected_granule_indexes[0] -1];
      }
    },
    selectNextGranule: function() {
      if (this.granules_selection_mode === 'single') {
        this.selected_granule_indexes = [this.selected_granule_indexes[0] +1];
      }
    },
    selectGranulesFromFootprints: function() {
      let _selected_granule_indexes = [];
      this.selected_footprints.forEach((footprint) => {
        if (footprint.product_id === this.code) {
          _selected_granule_indexes.push(this.granules.findIndex(granule => granule.id === footprint.granule_id));
        }
      });
      this.selected_granule_indexes = _selected_granule_indexes;
    }
  },

  mounted() {
    this.init();
    this.checkIfActiveProduct();
  }
}
</script>

<style scoped>
  .product-wrapper {
    display: grid;
    grid-template-columns: 5% 5% 5% 5% 20% 44% 10%;
    grid-template-areas: "selected enabled previous-granule next-granule opacity name availability";
    column-gap: 1%;
  }
  .selected-control {
    grid-area: selected;
  }
  .active-control {
    grid-area: enabled;
  }
  .granule-previous-control {
    grid-area: previous-granule;
  }
  .granule-next-control {
    grid-area: next-granule;
  }
  .opacity-control {
    grid-area: opacity;
  }
  .name-control {
    grid-area: name;
  }
  .status-control {
    grid-area: availability;
  }

  .debug {
    border: 2px solid red;
    padding: 4px;
    grid-area: span;
  }
</style>
