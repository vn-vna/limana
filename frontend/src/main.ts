import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import testStore from '@/stores/store'


const app = createApp(App)

const routes = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/", component: () => import("@/pages/Home.vue")
    }
  ]
})

app.use(routes)
app.use(testStore)

app.mount(document.getElementById("app")!)