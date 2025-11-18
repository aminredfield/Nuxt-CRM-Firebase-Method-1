import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator, type Firestore, } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator, type Functions, } from 'firebase/functions'
import { defineNuxtPlugin } from 'nuxt/app'

const firebaseConfig = {
  apiKey: "AIzaSyDXvywos3OomDRHWXDTDYxGkihkXuV_8p8",
  authDomain: "nuxt-crm-test.firebaseapp.com",
  projectId: "nuxt-crm-test",
  storageBucket: "nuxt-crm-test.firebasestorage.app",
  messagingSenderId: "637777245302",
  appId: "1:637777245302:web:ce56876eebd4f8c8249b57",
  measurementId: "G-YL92V99ZPZ"
};

let app: FirebaseApp
let db: Firestore
let functions: Functions

export default defineNuxtPlugin(() => {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]!
  }

  db = getFirestore(app)
  functions = getFunctions(app)

  if (import.meta.dev) {
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectFunctionsEmulator(functions, 'localhost', 5001)
  }

  return {
    provide: {
      firestore: db,
      functions,
    },
  }
})
