# Fitness-Tracker Frontend

Vue.js-Frontend (TypeScript) für den Fitness-Tracker. Zeigt Trainingseinträge (`WorkoutEntry`) als Liste.

Modul Webtechnologien, Prof. Dr. Arif Wider, Übungsgruppe 1, HTW Berlin.

## Team

- Felix Härle
- Justin Miller

## Backend

Das Spring-Boot-Backend liegt in einem eigenen Repo: https://github.com/999cronix/fitness-tracker

Stand Milestone 2: Das Frontend nutzt feste Beispieldaten. Der Aufruf von `GET /workouts` folgt in Milestone 3.

## Voraussetzungen

- Node.js 24.x (entwickelt mit Node 26.7, ebenfalls lauffähig)
- npm, git

## Start

```sh
npm install
npm run dev
```

Die App läuft dann unter http://localhost:5173/.

## Weitere Befehle

```sh
npm run build        # Typprüfung und Produktions-Build
npm run test:unit    # Unit-Tests (Vitest, Watch-Modus)
npm run lint         # ESLint und Oxlint
npm run format       # Prettier
```

## Struktur

- `src/types/WorkoutEntry.ts`: Typ des Eintrags (id, date, exercise, weightKg, reps)
- `src/components/WorkoutList.vue`: Liste, rendert die Einträge mit `v-for`
- `src/components/WorkoutItem.vue`: eine Zeile pro Eintrag
- `src/App.vue`: bindet die Liste ein und übergibt die Beispieldaten
