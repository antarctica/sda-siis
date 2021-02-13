<template>
  <section>
    <header><h4>Products</h4></header>
    <app-product
      v-for="product in products"
      :key="product.id"
      :product="product"
      :initial_active_products="initial_active_products"
      :selected_product="selected_product"
      v-on:update:selected_product="whenSelectedProductChange"
      v-on:update:active_product="whenActiveProductChange"
    ></app-product>
    <div class="debug">
      <p>Selected product: {{ selected_product }}<p>
      <p>Active products:</p>
      <ul>
        <li v-for="product_id in active_products" :key="product_id">{{ product_id }}</li>
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
import AppProduct from './AppProduct.vue';

export default {
  data() {
    return {
      products: [
        {
          'id': 'apple',
        },
        {
          'id': 'banana',
        },
        {
          'id': 'cherry',
        }
      ],
      'active_products': [],
      'initial_active_products': ['apple', 'banana'],
      'selected_product': 'apple',
      'time_filter': 0
    }
  },

  props: [
    'crs'
  ],

  computed: {
    selectedProductGranule: function () {
      return {
        'product': {
          'id': this.selected_product
        },
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
    whenSelectedProductChange: function ($event) {
      this.selected_product = $event;
      this.$emit("update:selected_product_granule", this.selectedProductGranule);
    },
    whenActiveProductChange: function ($event) {
      if ($event.is_active && !this.active_products.includes($event.product_id)) {
        this.active_products.push($event.product_id);
      }
      if (!$event.is_active && this.active_products.includes($event.product_id)) {
        // is it too much to ask for a pop index by value method :/
        let _index = this.active_products.indexOf($event.product_id);
        this.active_products.splice(_index, 1);
      }
      console.log($event);
    }
  },

  mounted() {
    this.active_products = this.initial_active_products;
  }
}
</script>

<style scoped>
  .debug {
    border: 1px solid red;
    padding: 4px;
  }
</style>
