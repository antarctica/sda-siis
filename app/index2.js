import Vue from 'vue';
import App2 from './components/App2.vue';

new Vue({ render: createElement => createElement(App2) }).$mount('#app');
