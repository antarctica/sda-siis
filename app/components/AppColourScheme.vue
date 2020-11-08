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
    window.matchMedia("(prefers-color-scheme: light)").addListener(
      e => e.matches && document.body.classList.remove('dark-mode')
    );
    window.matchMedia("(prefers-color-scheme: dark)").addListener(
      e => e.matches && document.body.classList.add('dark-mode')
    );
  }
}
</script>