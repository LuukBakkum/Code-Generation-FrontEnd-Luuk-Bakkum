// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';
// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router';
// import './assets/main.css';
// import express from 'express';
// import cors from 'cors';

// const app = express();

// // Enable CORS requests from http://localhost:5173
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
// }));

// // Your API routes
// app.get('/transactions', (req, res) => {
//   // ... handle the request and send the response
// });

// // Mount the app
// createApp(App).use(router).mount('#app');

//------------------    OUD    ------------------
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.js'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')