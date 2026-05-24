import express from "express";
import dotenv from "dotenv";
import { db } from "./db/index.js";
import { users } from "./db/schema.js";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});