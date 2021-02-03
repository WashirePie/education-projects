import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import equal from 'equal-vue'
import 'equal-vue/dist/style.css'

createApp(App)
  .use(store)
  .use(router)
  .use(equal)
  .mount('#app')
