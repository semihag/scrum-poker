import Vue from "vue";
import VueRouter from "vue-router";

import AddStories from "./components/AddStories";
import ViewPlaningDev from "./components/ViewPlaningDev";
import ViewPlaningMaster from "./components/ViewPlaningMaster";


Vue.use(VueRouter);
 

const routes = [
    { path: "/poker-planing-add-story-list", component: AddStories },
    { path: "/poker-planing-view-as-developer", component: ViewPlaningDev },
    { path: "/poker-planing-view-as-a-scrum-master", component: ViewPlaningMaster },
    { path: "*", redirect: "/poker-planing-add-story-list" }
];


export const router = new VueRouter({
    mode: "history",
    routes,
})
