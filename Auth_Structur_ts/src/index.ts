import type { Application, Request, Response } from "express";
import express from 'express'
import "dotenv/config";
import { db } from "./db/index.js";
import { users } from "./db/schema.js";
import authRouter from "./modules/auth/auth.routes.js";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the "public" directory

// Routers 
app.use("/auth",authRouter);



const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});