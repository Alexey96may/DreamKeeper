import '@/assets/styles/tailwind.css';
import './assets/styles/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import IndexedDB from '@/plugins/indexeddb';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(IndexedDB);

app.mount('#app');
