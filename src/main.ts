import { createApp } from 'vue';
import '@fontsource-variable/rubik';
import './styles/main.css';
import App from './App.vue';
import router from './router';
import { installViewTransitions } from './lib/viewTransitions';

installViewTransitions(router);
createApp(App).use(router).mount('#app');
