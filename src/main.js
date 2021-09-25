import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import "bootstrap-vue/dist/bootstrap-vue.css";
import { router } from "./router";
import { store } from "./store/store";

Vue.use(BootstrapVue);

Vue.use(IconsPlugin);

new Vue({
  el: "#app",
  router,
  store,

  render: h => h(App)
});
