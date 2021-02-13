<template>
  <section>
    <header><h4>Granule Metadata</h4></header>
    <p v-if="product">Product: <output>{{ product.id }}</output></p>
    <p v-if="granule">Granule: <output>{{ granule.id }}</output></p>
  </section>
</template>

<script>
export default {
  data() {
    return {}
  },

  props: [
    'selected_product_granule'
  ],

  computed: {
    product: function () {
      return this.selected_product_granule.product;
    },
    granule: function () {
      return this.selected_product_granule.granule;
    },
  },
}
</script>
