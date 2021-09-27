import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import "bootstrap-vue/dist/bootstrap-vue.css";
import { router } from "./router";
import { store } from "./store/store";

require("./assets/main.css");
Vue.use(BootstrapVue);

Vue.use(IconsPlugin);

Vue.mixin({
  data(){
    return{
      voteNumbers: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, "?"],
    }
  },
  methods: {
    GetDeveloperPoint: function(name) {
      return this.ActiveStory.voters.find(x => x.voterName === name).voterPoint;
    }
  },
  computed: {
    isAllVoted() {
      return (
        this.ActiveStory.voters.every(x => x.voterPoint > 0) &&
        this.ActiveStory.scrumMasterScore > 0
      );
    }
  }
});

new Vue({
  el: "#app",
  router,
  store,

  render: h => h(App)
});
