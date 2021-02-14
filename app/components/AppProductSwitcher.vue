<template>
  <section>
    <header><h4>Products</h4></header>
    <app-product
      v-for="product in raw_products"
      :key="product.id"
      :initial_product="product"
      :initial_active_product_ids="initial_active_product_ids"
      :selected_product_id="selected_product_id"
      v-on:update:selected_product="whenSelectedProductChange"
      v-on:update:active_product="whenActiveProductChange"
    ></app-product>
    <div class="debug">
      <p>Selected product: {{ selected_product.id }} - {{ selected_product.code }}<p>
      <p>Active products:</p>
      <ul>
        <li v-for="product in active_products" :key="product.id">{{ product.id }} - {{ product.code }}</li>
      </ul>
    </div>
    <hr />
    <label for="time-filter">Time filter</label>
    <select id="time-filter" v-model="time_filter">
      <option value=0>0 (No Limit)</option>
      <option value=72>Last 72 hours</option>
      <option value=48>Last 48 hours</option>
      <option value=24>Last 24 hours</option>
    </select>
    <div class="debug">
      <p>Hemisphere: <output>{{ hemisphere }}</output></p>
      <p>Time filter: <output>{{ time_filter }}</output><p>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

import AppProduct from './AppProduct.vue';

export default {
  data() {
    return {
      'raw_products': [],
      'selected_product': {},
      'active_products': [],
      'initial_active_product_ids': ['4'],
      'time_filter': 0
    }
  },

  props: [
    'api_endpoint',
    'crs'
  ],

  computed: {
    selected_product_id: {
      get: function() {
        return this.selected_product.id;
      }
    },
    selected_product_granule: function () {
      return {
        'product': this.selected_product,
        'granule': {
          'id': false
        }
      }
    },
    hemisphere: function () {
      if (this.crs == 'EPSG:3413') {
        return 'n';
      } else if (this.crs == 'EPSG:3031') {
        return 's';
      }
      return false;
    }
  },

  components: {
    AppProduct,
  },

  methods: {
    getProducts: async function () {
      let request_endpoint = this.api_endpoint + '/products';
      let request_config = {'params': {}};

      if (this.hemisphere) {
        request_config.params.hemi = this.hemisphere;
      }

      try {
        const response = await axios.get(request_endpoint, request_config);
        this.raw_products = response.data;
      } catch (error) {
        console.error('Products could not be retrieved');
        console.error(error);
      }
    },
    whenSelectedProductChange: function ($event) {
      this.selected_product = $event;
      this.$emit("update:selected_product_granule", this.selected_product_granule);
    },
    whenActiveProductChange: function ($event) {
      if ($event.is_active && !this.active_products.includes($event.id)) {
        this.active_products.push($event);
      }

      if (!$event.is_active && this.active_products.some(product => product.id === $event.id)) {
        let _index = this.active_products.findIndex(product => product.id === $event.id);
        this.active_products.splice(_index, 1);
      }
    }
  },

  async mounted() {
    await this.getProducts();
  }
}
</script>

<style scoped>
  .debug {
    border: 1px solid red;
    padding: 4px;
  }
</style>
