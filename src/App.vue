<script setup lang="ts">
// Hauptkomponente der App. Zeigt den Titel und die Trainingsliste mit festen Demo-Daten.
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import WorkoutList from './components/WorkoutList.vue'
import type { WorkoutEntry } from './types/WorkoutEntry'

// ref macht das Array reaktiv: Änderungen daran würden in der Ansicht sofort sichtbar.
const entries = ref<WorkoutEntry[]>([
  { id: 1, date: '2026-10-05', exercise: 'Bench Press', weightKg: 60, reps: 8 },
  { id: 2, date: '2026-10-05', exercise: 'Squat', weightKg: 80, reps: 5 },
  { id: 3, date: '2026-10-07', exercise: 'Deadlift', weightKg: 100, reps: 5 },
])
</script>

<template>
  <h1>Fitness-Tracker</h1>
  <WorkoutList :entries="entries" />
  <!-- Platz für Unterseiten des Routers; aktuell gibt es keine. -->
  <RouterView />
</template>
