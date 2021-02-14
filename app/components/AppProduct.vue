<template>
  <section>
    <input type="radio" name="product-selection" :id="'product-selection-' + id" :value="id" v-model="selected">
    <input type="checkbox" name="active-products" :id="'active-products-' + id" v-model="active">
    {{ id }} {{ code }}
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
      'id': '',
      'code': '',
      'is_active': false
    }
  },

  props: [
    'initial_product',
    'selected_product_id',
    "initial_active_product_ids"
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
  },

  methods: {
    init: function() {
      this.id = String(this.initial_product.id),
      this.code = this.initial_product.code
    },
  },

  mounted() {
    this.init();
    if (this.initial_active_product_ids.includes(this.id)) {
      this.is_active = true;
      this.$emit("update:active_product", this.$data);
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
