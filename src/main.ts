import { createApp } from 'vue';

import { createPinia } from 'pinia';

import './assets/styles/main.css';
import IndexedDB from '@/plugins/indexeddb.js';
import { vScrollReveal } from '@/directives/vScrollReveal';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(IndexedDB);

app.directive('scroll-reveal', vScrollReveal);

app.mount('#app');
