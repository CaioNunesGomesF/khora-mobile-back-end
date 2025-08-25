import express from "express";

const app = express();

// Middlewares
app.use(express.json());

// Rotas de exemplo
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

export default app; // ← ESSENCIAL
