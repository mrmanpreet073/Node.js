import express from "express";
import type { Request, Response } from "express";
import { usersTable } from "./db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import bcrypt from "bcrypt"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); //"Serve files from the public folder"


app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript Express Server Running");
});

const PORT = process.env.PORT ?? 5000;


// OIDC Endpoints
app.get("/.well-known/openid-configuration", (req: Request, res: Response) => {
  const ISSUER = `http://localhost:${PORT}`;
  return res.json({
    issuer: ISSUER,
    authorization_endpoint: `${ISSUER}/o/login`,
    userinfo_endpoint: `${ISSUER}/o/userinfo`,
    jwks_uri: `${ISSUER}/.well-known/jwks.json`,
  });
});

app.get("/home", (req: Request, res: Response) => {
  res.sendFile("home.html", { root: "./public" });
});
app.get("/signup", (req: Request, res: Response) => {
  res.sendFile("signup.html", { root: "./public" });
});
app.get("/login", (req: Request, res: Response) => {
  res.sendFile("login.html", { root: "./public" });
});




app.post("/signup", async (req: Request, res: Response) => {

  const { firstName, lastName, email, password } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }
  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing) {
    return res.send("User already exists");
  }
  const hashPassword = await bcrypt.hash(password, 10)  // In production, hash the password before storing
  await db.insert(usersTable).values({
    firstName,
    lastName,
    email,
    password: hashPassword, // In production, hash the password before storing
  });
  res.send("User Registered");
});


app.post("/o/login", async (req: Request, res: Response) => {

  const { email, password } = req.body;
  if (!email || !password) {
    res.send("Email or Password are required")
  }

  const [user] = await db.select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1)

  if (!user) {
    return res.send("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password!)

  if (!isMatch) {

    return res.send("Emanil and password are incorrect")
  }

  // res.json({
  //   success: true,
  //   message: "Login successful"
  // });

  res.redirect("/consent.html");

})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});