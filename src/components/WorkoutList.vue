<script setup lang="ts">
// Zeigt eine Liste von Trainingseinträgen an. Jeder Eintrag wird mit WorkoutItem gerendert.
import WorkoutItem from './WorkoutItem.vue'
import type { WorkoutEntry } from '@/types/WorkoutEntry'

// Die Liste bekommt alle Einträge vom Elternteil über die Prop "entries".
defineProps<{
  entries: WorkoutEntry[]
}>()
</script>

<template>
  <ul>
    <!-- v-for wiederholt den Listenpunkt für jeden Eintrag. -->
    <!-- :key gibt jedem Eintrag eine feste ID, damit Vue die Punkte beim Umsortieren richtig zuordnet. -->
    <WorkoutItem v-for="entry in entries" :key="entry.id" :entry="entry" />
  </ul>
</template>
