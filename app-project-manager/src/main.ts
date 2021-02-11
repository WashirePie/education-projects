import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimerModal from '@/components/global/PrimerModal.vue'
import Loadingbar from '@/components/global/primerLoadingbar'
import '@primer/css/dist/primer.css'

const app = createApp(App)
  .use(store)
  .use(router)
  
// Register globally accessible components
app.component('PrimerModal', PrimerModal)
app.config.globalProperties.$Loadingbar = Loadingbar

app.mount('#app')