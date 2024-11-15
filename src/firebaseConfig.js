// Importa las funciones necesarias de los SDK de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Asegúrate de tener esta línea
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCo1pJdUtc1EJKMP771eKqsFHmQ_mnfzqU",
  authDomain: "crudproductos-77d3f.firebaseapp.com",
  projectId: "crudproductos-77d3f",
  storageBucket: "crudproductos-77d3f.firebasestorage.app",
  messagingSenderId: "1086596456597",
  appId: "1:1086596456597:web:8c21875d2b828c46b9fb9c",
  measurementId: "G-TG3T4NS5H4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Configura Firestore

export { db };
