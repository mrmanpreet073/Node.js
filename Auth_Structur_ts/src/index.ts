import type { Application, Request, Response } from "express";
import express from 'express'
import "dotenv/config";
import { db } from "./db/index.js";
import { users } from "./db/schema.js";
import authRouter from "./modules/auth/auth.routes.js";

const app: Application = express();
app.use(express.json());


// Routers 
app.use("/auth",authRouter);



app.get("/users", async (req: Request, res: Response): Promise<void> => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});