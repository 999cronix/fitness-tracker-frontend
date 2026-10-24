// Holt die Trainingseinträge vom Backend. Alle Aufrufe an die Workout-Route laufen über diese Datei.

import type { NewWorkoutEntry, WorkoutEntry } from '@/types/WorkoutEntry'

// Adresse des Backends. Kommt aus der Umgebungsvariable VITE_API_URL (siehe README).
// Ohne Variable wird http://localhost:8080 benutzt, also das lokal laufende Spring-Boot-Backend.
// Der Schrägstrich am Ende fehlt absichtlich, sonst entstünde "//workouts".
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

// Lädt alle Einträge per GET {API_URL}/workouts.
// Gibt ein Array mit Einträgen zurück. Wirft einen Fehler, wenn das Backend nicht mit 2xx antwortet.
export async function fetchWorkouts(): Promise<WorkoutEntry[]> {
  const response = await fetch(`${API_URL}/workouts`)

  // response.ok ist true bei Statuscodes 200 bis 299. Alles andere ist ein Fehler, z.B. 500.
  if (!response.ok) {
    throw new Error(`Backend antwortet mit Status ${response.status}`)
  }

  // json() liest den Text der Antwort und macht daraus ein JavaScript-Objekt (hier: das Array).
  return response.json()
}

// Übersetzt einen HTTP-Statuscode in eine Meldung für den Nutzer.
// Eingabe: der Statuscode (z.B. 400). Ausgabe: der deutsche Text für die Fehlermeldung.
function workoutErrorMessage(status: number): string {
  if (status === 400) return 'Die Eingabe ist ungültig.'
  if (status === 429) return 'Die Datenbank ist voll.'
  return `Backend antwortet mit Status ${status}`
}

// Schickt einen neuen Eintrag per POST an {API_URL}/workouts.
// Eingabe: die Felder ohne id. Ausgabe: der gespeicherte Eintrag inkl. id (Antwort mit Status 201).
// Wirft einen Fehler mit deutscher Meldung, wenn das Backend nicht mit 2xx antwortet.
export async function createWorkout(data: NewWorkoutEntry): Promise<WorkoutEntry> {
  // method legt die Art der Anfrage fest (POST = etwas neu anlegen).
  // Content-Type sagt dem Backend, dass der Body JSON ist.
  // JSON.stringify macht aus dem JavaScript-Objekt einen JSON-Text.
  const response = await fetch(`${API_URL}/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(workoutErrorMessage(response.status))
  }

  return response.json()
}
