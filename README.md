# Fitness-Tracker Frontend

Das Frontend für unseren Fitness-Tracker, gebaut mit Vue 3 und TypeScript. Aktuell zeigt es eine Liste von Trainingseinträgen an.

Projekt im Modul Webtechnologien (Prof. Dr. Arif Wider, Übungsgruppe 1, HTW Berlin).

## Team

- [999cronix](https://github.com/999cronix)
- [JustinM27](https://github.com/JustinM27)

## Backend

Das Spring-Boot-Backend liegt in einem eigenen Repo: https://github.com/999cronix/fitness-tracker

Stand Milestone 2: Die Liste benutzt feste Beispieldaten direkt in `App.vue`. Das Frontend ruft das Backend noch nicht auf. Das kommt in Milestone 3 (`GET /workouts`).

## Starten

Voraussetzungen: Node.js (24.x empfohlen), npm und git.

```sh
git clone https://github.com/999cronix/fitness-tracker-frontend.git
cd fitness-tracker-frontend
npm install
npm run dev
```

Danach ist die App unter http://localhost:5173/ erreichbar.

## Befehle

| Befehl              | Wofür                                    |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Entwicklungsserver                       |
| `npm run build`     | Typprüfung und Produktions-Build         |
| `npm run test:unit` | Unit-Tests mit Vitest (läuft im Watch-Modus) |
| `npm run lint`      | ESLint und Oxlint                        |
| `npm run format`    | Code formatieren mit Prettier            |

## Aufbau

- `src/types/WorkoutEntry.ts`: Typ für einen Eintrag (`id`, `date`, `exercise`, `weightKg`, `reps`)
- `src/components/WorkoutList.vue`: bekommt die Einträge als Prop `entries` und zeigt sie mit `v-for` an
- `src/components/WorkoutItem.vue`: eine Zeile in der Liste
- `src/App.vue`: bindet die Liste ein und übergibt die Beispieldaten

## Geplant

- Milestone 3: Deployment auf Render, Daten per `GET /workouts` vom Backend laden
- Milestone 4: Datenbank und `POST`-Route zum Anlegen neuer Einträge
