<script setup lang="ts">
// Zeigt genau einen Trainingseintrag als Listenpunkt (<li>) an.
import type { WorkoutEntry } from '@/types/WorkoutEntry'

// defineProps legt fest, welche Daten die Komponente von außen bekommt.
// "entry" ist die Eingabe, die der Elternteil (WorkoutList) mitgibt.
defineProps<{
  entry: WorkoutEntry
}>()
</script>

<template>
  <li>{{ entry.exercise }}: {{ entry.weightKg }} kg, {{ entry.reps }} Wdh. ({{ entry.date }})</li>
</template>
