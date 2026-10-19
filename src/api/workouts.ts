// Holt die Trainingseinträge vom Backend. Alle Aufrufe an die Workout-Route laufen über diese Datei.

import type { WorkoutEntry } from '@/types/WorkoutEntry'

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
