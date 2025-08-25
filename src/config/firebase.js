import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";

import serviceAccountKey from "./serviceAccountKey.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccountKey)
});

console.log("Firebase initialized!");
