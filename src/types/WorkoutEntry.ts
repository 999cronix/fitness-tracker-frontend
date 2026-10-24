// Typ für einen einzelnen Trainingseintrag (eine Übung an einem Tag).
export interface WorkoutEntry {
  id: number
  // Datum im ISO-Format, z.B. "2026-10-05"
  date: string
  exercise: string
  weightKg: number
  reps: number
}

// Typ für einen neuen Eintrag, den wir ans Backend schicken. Die "id" vergibt die Datenbank, also fehlt sie hier.
export type NewWorkoutEntry = Omit<WorkoutEntry, 'id'>
