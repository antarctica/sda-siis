<template>
  <section>
    <input type="radio" name="product-selection" :id="'product-selection-' + product.id" :value="product.id" v-model="selected">
    <input type="checkbox" name="active-products" :id="'active-products-' + product.id" v-model="active">
    {{ product.id }}
    <div class="debug">
      <p>Selected: {{ is_selected }}</p>
      <p>Active: {{ is_active }}</p>
    </div>
    </section>
</template>

<script>
export default {
  data() {
    return {
      'is_active': false
    }
  },

  props: [
    'product',
    'selected_product',
    "initial_active_products"
  ],

  computed: {
    selected: {
      get: function() {
        return this.selected_product;
      },
      set: function() {
        this.$emit("update:selected_product", this.product.id);
      }
    },
    active: {
      get: function() {
        return this.is_active;
      },
      set: function() {
        this.is_active = !this.is_active;
        this.$emit("update:active_product", {'product_id': this.product.id, 'is_active': this.is_active});
      }
    },
    is_selected: function () {
      if (this.selected_product == this.product.id) {
        return true;
      }
      return false;
    },
  },

  mounted() {
    if (this.initial_active_products.includes(this.product.id)) {
      this.is_active = true;
    }
  }
}
</script>

<style scoped>
  .debug {
    border: 2px solid red;
    padding: 4px;
  }
</style>
