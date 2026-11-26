import { initializeApp } from 'firebase/app'
import { connectDatabaseEmulator, getDatabase } from 'firebase/database'
import type { Database } from 'firebase/database'

let database: Database | undefined

export function getWeatherDatabase() {
  if (database) return database

  const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.trim()
  if (!databaseURL) {
    throw new Error('Configura VITE_FIREBASE_DATABASE_URL para conectar ClimaAU con Firebase.')
  }

  const app = initializeApp({ databaseURL })
  const instance = getDatabase(app)
  const emulatorURL = import.meta.env.DEV && import.meta.env.VITE_FIREBASE_DATABASE_EMULATOR_URL
  if (emulatorURL) {
    const { hostname, port } = new URL(emulatorURL)
    connectDatabaseEmulator(instance, hostname, Number(port))
  }

  database = instance
  return instance
}
