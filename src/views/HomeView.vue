<script setup lang="ts">
// Startseite der App (Route "/"). Lädt die Trainingseinträge vom Backend und zeigt sie an.
import { ref, onMounted } from 'vue'
import WorkoutList from '@/components/WorkoutList.vue'
import WorkoutForm from '@/components/WorkoutForm.vue'
import { fetchWorkouts } from '@/api/workouts'
import type { WorkoutEntry } from '@/types/WorkoutEntry'

// ref macht den Wert reaktiv: Ändert sich der Wert, aktualisiert sich die Ansicht automatisch.
const entries = ref<WorkoutEntry[]>([])
// Solange true ist, zeigt die Seite "Lade Einträge...".
const loading = ref(true)
// Hier steht die Fehlermeldung, falls das Laden fehlschlägt. Sonst null.
const error = ref<string | null>(null)

// onMounted läuft, sobald die Seite im Browser angezeigt wird. Dort starten wir den Abruf.
// try: versuchen die Daten zu laden. catch: falls das fehlschlägt, Fehler merken.
// finally: läuft immer am Ende, egal ob es geklappt hat. Damit verschwindet die Ladeanzeige sicher.
onMounted(async () => {
  try {
    entries.value = await fetchWorkouts()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unbekannter Fehler'
  } finally {
    loading.value = false
  }
})

// Wird aufgerufen, wenn das Formular einen Eintrag erfolgreich gespeichert hat.
// Eingabe: der gespeicherte Eintrag (mit id). Er kommt vorne in die Liste, weil die Liste neueste zuerst zeigt.
function onCreated(entry: WorkoutEntry) {
  entries.value.unshift(entry)
}
</script>

<template>
  <h1>Fitness-Tracker</h1>
  <!-- @created hört auf das Ereignis "created" aus dem Formular und ruft dann onCreated auf. -->
  <!-- Das Formular erscheint erst nach dem Laden. Sonst könnte die geladene Liste einen neuen Eintrag überschreiben. -->
  <WorkoutForm v-if="!loading" @created="onCreated" />
  <!-- v-if zeigt den Text nur, solange die Daten geladen werden. -->
  <p v-if="loading">Lade Einträge...</p>
  <!-- v-else-if zeigt die Fehlermeldung, wenn das Laden fehlgeschlagen ist. -->
  <p v-else-if="error">Fehler beim Laden: {{ error }}</p>
  <!-- v-else-if zeigt den Leer-Hinweis, wenn es noch keine Einträge gibt. -->
  <p v-else-if="entries.length === 0">Noch keine Einträge.</p>
  <!-- v-else zeigt die Liste, wenn Einträge da sind. -->
  <WorkoutList v-else :entries="entries" />
</template>
