import { createApp } from "vue";

import "bootstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

import App from "./App.vue"
import router from "./router";
import "@/router/permission";

const app = createApp(App);
app.use(router);
app.mount("#app");
