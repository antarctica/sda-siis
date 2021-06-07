<template></template>

<script>
export default {
  data: function () {
    return {}
  },

  props: ['colour_scheme'],

  watch: {
  	colour_scheme () {
      this.setColourScheme(this.colour_scheme)
    }
  },

  methods: {
    setColourScheme (context) {
      if (context === 'light') {
        document.body.classList.remove('dark-mode');
      }
      else if (context === 'dark') {
        document.body.classList.add('dark-mode');
      }
      else if (context === 'system') {
        if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
          if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.classList.remove('dark-mode');
          }
          else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
          }
        }
      }
    }
  },

  mounted() {
    this.setColourScheme(this.colour_scheme);

    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.$emit('update:system_colour_scheme', 'light');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.$emit('update:system_colour_scheme', 'dark');
    }
    let _this = this;
    window.matchMedia("(prefers-color-scheme: light)").addListener(
      e => {
        if (e.matches) {
          _this.$emit('update:system_colour_scheme', 'light');
          _this.setColourScheme('system');
        }
      }
    );
    window.matchMedia("(prefers-color-scheme: dark)").addListener(
      e => {
        if (e.matches) {
          _this.$emit('update:system_colour_scheme', 'dark');
          _this.setColourScheme('system');
        }
      }
    );
  }
}
</script>