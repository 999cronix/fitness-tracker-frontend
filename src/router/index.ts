// Router-Setup. Aktuell ohne Routen, die Liste wird direkt in App.vue gezeigt.
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})

export default router
