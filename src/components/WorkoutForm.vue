<script setup lang="ts">
// Formular zum Anlegen eines neuen Trainingseintrags. Schickt die Eingaben per createWorkout ans Backend.
// Nach dem Speichern meldet es den gespeicherten Eintrag per "emit" an die Elternseite (HomeView).
import { ref } from 'vue'
import { createWorkout } from '@/api/workouts'
import type { WorkoutEntry } from '@/types/WorkoutEntry'

// emit schickt ein Ereignis nach oben an die Elternseite. Hier: "created" mit dem gespeicherten Eintrag.
const emit = defineEmits<{
  created: [entry: WorkoutEntry]
}>()

// Gibt das heutige Datum als Text "YYYY-MM-DD" zurück, passend zu <input type="date">.
// Wir nehmen das lokale Datum. toISOString() rechnet auf UTC um und liefert abends oft den falschen Tag.
// Ausgabe: z.B. "2026-10-24".
function todayIso(): string {
  const now = new Date()
  const year = now.getFullYear()
  // getMonth() beginnt bei 0 (Januar), deshalb +1. padStart füllt einstellige Zahlen mit einer 0 auf.
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Heute ist der Standardwert im Datumsfeld und zugleich der späteste erlaubte Tag.
const today = todayIso()

// ref speichert einen Wert, der sich ändern kann. v-model verbindet ihn mit einem Eingabefeld:
// tippt der Nutzer, ändert sich der Wert, und ändert sich der Wert, ändert sich das Feld.
// Bei Zahlenfeldern steht hier meist eine Zahl. Ist das Feld leer, bleibt der Wert ein leerer Text.
const exercise = ref('')
const weightKg = ref<number | string>('')
const reps = ref<number | string>('')
const date = ref(today)

// Meldungen für den Nutzer: successMessage bei Erfolg, errorMessage bei Fehler.
const successMessage = ref('')
const errorMessage = ref('')
// true, solange gerade gespeichert wird. Dann ist der Button gesperrt, damit nichts doppelt gesendet wird.
const sending = ref(false)

// Prüft, ob ein Wert eine echte Zahl im erlaubten Bereich ist.
// Eingabe: der Wert aus dem Feld und die untere und obere Grenze. Ausgabe: true oder false.
function isNumberInRange(value: number | string, min: number, max: number): boolean {
  return typeof value === 'number' && !Number.isNaN(value) && value >= min && value <= max
}

// Prüft alle Eingaben vor dem Senden. Ausgabe: true, wenn alles passt.
// Die Übung darf nicht nur aus Leerzeichen bestehen. Wiederholungen müssen ganze Zahlen sein.
function isInputValid(): boolean {
  return (
    exercise.value.trim() !== '' &&
    isNumberInRange(weightKg.value, 0, 1000) &&
    isNumberInRange(reps.value, 1, 1000) &&
    Number.isInteger(reps.value)
  )
}

// Speichert den Eintrag. Ablauf: prüfen, senden, bei Erfolg melden und Felder leeren.
// Bei Fehler bleiben die Eingaben stehen, damit der Nutzer sie korrigieren kann.
async function save() {
  successMessage.value = ''
  errorMessage.value = ''

  // Ungültige Eingaben stoppen hier. Dann geht gar keine Anfrage ans Backend.
  if (!isInputValid()) {
    errorMessage.value = 'Bitte alle Felder korrekt ausfüllen.'
    return
  }

  sending.value = true
  try {
    // Number(...) macht aus dem Feldtext eine Zahl. Die Prüfung oben stellt sicher, dass es eine gültige Zahl ist.
    const saved = await createWorkout({
      exercise: exercise.value.trim(),
      date: date.value,
      weightKg: Number(weightKg.value),
      reps: Number(reps.value),
    })
    // Die Elternseite bekommt den gespeicherten Eintrag (inkl. id) und zeigt ihn in der Liste.
    emit('created', saved)
    exercise.value = ''
    weightKg.value = ''
    reps.value = ''
    date.value = today
    successMessage.value = 'Eintrag gespeichert.'
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Unbekannter Fehler'
  } finally {
    // finally läuft immer, auch bei Fehlern. So ist der Button sicher wieder frei.
    sending.value = false
  }
}
</script>

<template>
  <!-- @submit.prevent: Beim Absenden ruft Vue "save" auf. .prevent verhindert, dass der Browser die Seite neu lädt. -->
  <form @submit.prevent="save">
    <div>
      <!-- for im label und id im Feld gehören zusammen. So ist die Beschriftung mit dem Feld verbunden. -->
      <label for="workout-exercise">Übung</label>
      <input id="workout-exercise" v-model="exercise" type="text" maxlength="100" required />
    </div>
    <div>
      <label for="workout-weight">Gewicht in kg</label>
      <!-- .number bei v-model wandelt den Text des Feldes in eine Zahl um. -->
      <input
        id="workout-weight"
        v-model.number="weightKg"
        type="number"
        min="0"
        max="1000"
        step="0.5"
        required
      />
    </div>
    <div>
      <label for="workout-reps">Wiederholungen</label>
      <input
        id="workout-reps"
        v-model.number="reps"
        type="number"
        min="1"
        max="1000"
        step="1"
        required
      />
    </div>
    <div>
      <label for="workout-date">Datum</label>
      <!-- :max="today" sperrt Tage in der Zukunft im Kalender. -->
      <input id="workout-date" v-model="date" type="date" :max="today" required />
    </div>
    <!-- Der Button ist gesperrt, solange gerade gespeichert wird. -->
    <button type="submit" :disabled="sending">
      {{ sending ? 'Speichere...' : 'Speichern' }}
    </button>
    <!-- role="status" wird von Bildschirmlesern beim Erscheinen vorgelesen (Erfolg). -->
    <p v-if="successMessage" role="status">{{ successMessage }}</p>
    <!-- role="alert" meldet Fehler sofort und laut an Bildschirmleser. -->
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
  </form>
</template>
