import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import { useAuth } from './store/auth'

// Ionic core and basic CSS
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

// Optional Ionic utility CSS
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

// Theme variables
import './theme/variables.css'

const app = createApp(App)
app.use(IonicVue)
app.use(createPinia())
app.component('apexchart', VueApexCharts)
app.use(router)

router.isReady().then(async () => {
  const { loadUserIfAuthenticated } = useAuth()
  await loadUserIfAuthenticated()
  app.mount('#app')
})
