/// <reference types="vite/client" />

// Typen für die Umgebungsvariablen aus .env-Dateien. Nur Variablen mit VITE_ sind im Frontend sichtbar.
interface ImportMetaEnv {
  // Adresse des Backends, z.B. http://localhost:8080. Optional, es gibt einen Standardwert.
  readonly VITE_API_URL?: string
}
