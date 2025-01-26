import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import RecorderPage from "@/views/RecorderPage.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/recorder", name: "Recorder", component: RecorderPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
