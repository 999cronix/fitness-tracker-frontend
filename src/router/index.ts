// Router-Setup. Legt fest, welche Seite zu welcher Adresse (URL) gehört.
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Die Startseite. Aufruf unter "/" zeigt HomeView an.
    { path: '/', name: 'home', component: HomeView },
  ],
})

export default router
