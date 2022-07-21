import { createApp } from "vue";
import { createPinia } from "pinia";
import nextbillion from 'nbmap-gl'
import 'nbmap-gl/dist/nextbillion.css'
import "./assets/main.css";
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from "./App.vue";
import router from "./router";

nextbillion.setApiKey(process.env.NEXTBILLION_API_KEY);
nextbillion.setApiHost(process.env.NEXTBILLION_API_HOST);


const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
