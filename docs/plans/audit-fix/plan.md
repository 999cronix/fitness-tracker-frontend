# Plan: npm-audit-Meldung (braces) beheben

Stand: 2026-10-15. Repo: fitness-tracker-frontend. Branch: `fix/npm-audit-braces`.

## 1. Befund (belegt durch Befehlsausgaben)

- `npm audit`: 4 Meldungen "high", alle dieselbe Ursache: GHSA-vfj7-8cjw-p6xm in `braces` (CWE-674, CVSS 7.5, Stack-Überlauf bei tief verschachtelten Brace-Mustern, Prozess stürzt ab).
- Betroffene Versionen: `braces <= 3.0.3`. `first_patched_version` ist `null`. Die neueste Version auf npm ist 3.0.3. **Es gibt aktuell keinen Fix.** Advisory veröffentlicht am 2026-09-18.
- Abhängigkeitskette (`npm ls`): `@vue/eslint-config-typescript@14.9.0` → `fast-glob@3.3.3` → `micromatch@4.0.8` → `braces@3.0.3`.
- Nur diese eine Kette zieht `braces` ins Projekt. Alles ist `devDependency` (Linting). Es landet nicht im Build und nicht auf Render.
- Der Vorschlag von `npm audit fix --force` (Downgrade auf `@vue/eslint-config-typescript@14.0.1`) ist **keine Lösung**: Er ist eine Breaking Change und die Meldung zeigt nur, dass ältere Versionen die Kette nicht in dieser Form hatten. Nicht verwenden.

## 2. Wie so etwas entsteht

- Wir haben `braces` nie selbst installiert. Es ist eine transitive Abhängigkeit: Paket A braucht B, B braucht C, usw.
- Die Lücke wurde nach unserer Installation veröffentlicht und betrifft die letzte vorhandene Version. Der Code war beim Installieren nicht "falsch", der Datenbestand von `npm audit` hat sich geändert.
- `create-vue` fügt ESLint-Pakete in die Vorlage ein. Die Vorlage selbst ist bei neuen Meldungen nicht sofort aktuell.

## 3. Lösungsoptionen

| Option | Wirkung | Risiko | Urteil |
|---|---|---|---|
| A: Nichts tun, beobachten | Meldung bleibt | keins fürs Laufzeitverhalten | nur als Übergang |
| B: `npm audit fix --force` | Downgrade auf 14.0.1 | Breaking Change, ESLint-Config evtl. defekt | nein |
| C: `overrides` auf eine gepatchte `braces`-Version | nicht möglich, es gibt keine | – | nicht umsetzbar |
| D: `@vue/eslint-config-typescript` entfernen, `typescript-eslint` und `eslint-plugin-vue` direkt nutzen | Kette verschwindet, `fast-glob` wird nicht mehr gebraucht | mittel: ESLint-Config muss umgebaut werden | **empfohlen** |
| E: Warten, bis `braces` ein Patch-Release hat | sauber, aber Zeitpunkt unbekannt | – | zusätzlich beobachten |

Empfehlung: D umsetzen. Falls D nicht sauber läuft: A und E (siehe Task T05).

Hinweis zu D: Der Vue-Wrapper bündelt `typescript-eslint` mit dem Vue-Parser. Wir müssten `typescript-eslint` (`tseslint.configs.recommended`) und `eslint-plugin-vue` (Flat-Config) selbst verdrahten und `parserOptions.parser` für `.vue`-Dateien setzen. `typescript-eslint` und `vue-eslint-parser` sind schon installiert.

## 4. Tasks

Reihenfolge fest. Executor: Sonnet (Config-Umbau, Fehlersuche), geprüft durch die Hauptsession.

- [x] **T01** [Hauptsession] Branch `fix/npm-audit-braces` anlegen. Ausgangsstand festhalten: `npm run lint`, `npm run build`, `npx vitest run` laufen grün. Ausgaben im Bericht.
- [x] **T02** [Executor] `eslint.config.ts` umbauen: Import von `@vue/eslint-config-typescript` entfernen. Stattdessen `typescript-eslint` (`tseslint.config`/`configs.recommended`) und `pluginVue.configs['flat/essential']` mit `languageOptions.parserOptions.parser = tseslint.parser` für `**/*.vue`. Übrige Einträge (Vitest, Oxlint, Prettier, `globalIgnores`) unverändert lassen.
- [x] **T03** [Executor] `npm uninstall @vue/eslint-config-typescript`, danach `npm install`. `npm ls braces fast-glob micromatch` muss leer sein oder nur noch Pakete zeigen, die nicht von uns kommen. Falls `braces` über ein anderes Paket wieder auftaucht: Bericht mit Kette, abbrechen (`BLOCKED`).
- [x] **T04** [Hauptsession] Abnahme: `npm audit` ohne "high" aus dieser Kette, `npm run lint`, `npm run build`, `npx vitest run`, `npm run format` ohne Fehler. Frischer Klon: `npm install`, `npm run dev` startet. Lint-Regeln prüfen: absichtlich einen Fehler einbauen (z. B. ungenutzte Variable in einer `.vue`-Datei), lint muss ihn melden. Danach Fehler wieder entfernen.
- [ ] **T05** [Hauptsession] Fallback, nur wenn T02 bis T04 scheitern: Branch verwerfen, Meldung im README unter "Bekannte Hinweise" dokumentieren (Dev-only, kein Patch verfügbar). Alle 2 bis 4 Wochen `npm audit` und `npm view braces version` prüfen. Sobald eine Version > 3.0.3 erscheint: `npm update braces`.
- [ ] **T06** [Hauptsession] Commit `chore: Lint-Setup ohne @vue/eslint-config-typescript (braces-Meldung)`, Push, Pull Request oder Merge nach `main` durch einen Menschen.

## 5. Vorbeugen

- **Dependabot oder `npm audit` in GitHub Actions.** Milestone-Vorgabe nennt GitHub Actions ohnehin. Ein Workflow `npm ci`, `npm audit --omit=dev --audit-level=high`, `npm run build`, `npm run test:unit -- --run`. `--omit=dev` meldet nur Probleme, die in die Auslieferung gelangen.
- **`.github/dependabot.yml`** mit wöchentlichem Update für `npm`. Dann kommt ein Pull Request, sobald ein Patch existiert.
- **`package-lock.json` immer committen** (ist es schon) und im CI `npm ci` statt `npm install` nutzen. So bauen wir genau das, was getestet wurde.
- **Weniger Abhängigkeiten.** Jedes Paket zusätzlich bringt eine Kette mit. Vor `npm install` prüfen, ob wir es wirklich brauchen.
- **Meldungen einordnen statt `--force`.** Erst `npm audit` lesen: dev oder prod? Gibt es einen Patch? Erst danach handeln.
- **Updates nach Milestones**, nicht mitten in einer Abgabe. Nach jedem Update Build, Lint und Tests laufen lassen.

## 6. Risiko

Betroffen ist nur `npm run lint`. Im schlimmsten Fall bricht der Lint-Lauf ab. Kein Einfluss auf Build, Tests, Render oder Nutzer der App.
