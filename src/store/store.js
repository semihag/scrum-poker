import Vue from "vue";
import Vuex from "vuex";
import storyStore from "./modules/storyStore";

Vue.use(Vuex);

export const store = new Vuex.Store({
modules:{
    storyStore,
}
})
