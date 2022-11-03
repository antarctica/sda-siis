<template>
  <div class="date-time-filter-control">
    <fieldset class="time-filters">
      <template v-if="granules_selection_mode == 'multiple'">
        <button
          v-on:click="time_filter = -1"
          :disabled="time_filter == 'disabled' ? 'disabled' : null"
          :class="time_filter == -1 ? 'activated': null"
        >
          All
        </button>
        <button
          v-on:click="time_filter = 72"
          :disabled="time_filter == 'disabled' ? 'disabled' : null"
          :class="time_filter == 72 ? 'activated': null"
        >
          72 H
        </button>
        <button
          v-on:click="time_filter = 48"
          :disabled="time_filter == 'disabled' ? 'disabled' : null"
          :class="time_filter == 48 ? 'activated': null"
        >
          48 H
        </button>
        <button
          v-on:click="time_filter = 24"
          :disabled="time_filter == 'disabled' ? 'disabled' : null"
          :class="time_filter == 24 ? 'activated': null"
        >
          24 H
        </button>
      </template>
    </fieldset>
    <fieldset class="date-filters">
      <input type="date" v-model="date_filter" :min="min_date" :max="max_date" />
    </fieldset>
  </div>
</template>

<script>
export default {
  data() {
    return {
      'time_filter': 0,
      'date_filter': '',
    }
  },

  props: [
    'granules_selection_mode',
    'default_time_filter',
    'min_date',
    'max_date'
  ],

  watch: {
    date_filter: function () {
      if (this.date_filter !== "") {
        this.time_filter = 'disabled';
      } else {
        this.time_filter = this.default_time_filter;
        this.$emit("update:time_filter", this.time_filter);
      }

      this.$emit("update:date_filter", this.date_filter);
    },
    time_filter: function () {
      if (this.time_filter !== 'disabled') {
        this.$emit("update:time_filter", this.time_filter);
      }
    }
  },

  methods: {
    init: function() {
      if (this.default_time_filter != 0 && [24, 48, 72].includes(this.default_time_filter)) {
        this.time_filter = this.default_time_filter;
      }
    }
  },

  mounted() {
    this.init();
  }
}
</script>

<style scoped>
  fieldset {
    border: none;
    padding: 0;
  }

  .time-filters button {
    font-size: 80%;
    padding: 3px;
  }

  .time-filters,
  .date-filters {
    display: inline-block;
  }
  .date-filters input {
    font-size: 100%;
    padding: 0;
  }

  .dark-mode .date-filters input {
    color: var(--color);
    background-color: var(--bg);
    border-color: var(--border-color);
  }

  .activated {
    box-shadow: inset 1px 1px 4px #777;
    transform: translateY(1px);
    background-color: #d5caca;
    border-style: double;
    border-radius: 4px;
  }
</style>