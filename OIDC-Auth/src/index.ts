import express from "express";
import type { Request, Response } from "express";
import { usersTable } from "./db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import bcrypt from "bcrypt"
import { PRIVATE_KEY, PUBLIC_KEY } from "./utils/cert.js";
import JWT from "jsonwebtoken";
import type { JWTClaims } from "./utils/jwtTypes.js";
import cookieParser from "cookie-parser";
import jose from "node-jose";

const app = express();

app.use(cookieParser());
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
    authorization_endpoint: `${ISSUER}/o/authorize`,
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


app.get("/o/authorize", (req: Request, res: Response) => {
  res.sendFile("login.html", { root: "./public" });
});

app.post("/o/authorize", async (req: Request, res: Response) => {

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

  const ISSUER = `http://localhost:${PORT}`;
  const now = Math.floor(Date.now() / 1000);

  const claims: JWTClaims = {
    iss: ISSUER,
    sub: user.id,
    email: user.email,
    email_verified: String(user.emailVerified),
    exp: now + 3600,
    given_name: user.firstName ?? "",
    family_name: user.lastName ?? undefined,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    picture: user.profileImageURL ?? undefined,
  };
  const token = JWT.sign(claims, PRIVATE_KEY, { algorithm: "RS256" });
  //            -asymmetric cryptography: -->                ========  
  //               Private Key ->	Sign
  //               Public  Key ->	Verify


  // Store token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60
  });

  // Redirect to consent page
  res.redirect("/consent.html");


  // res.json({ token });
  // return res.redirect("/consent");

})


app.get("/o/userinfo", (req: Request, res: Response) => {

  // Read Authorization header
  const authHeader = req.headers.authorization;

  // Check if header exists
  if (!authHeader) {
    return res.status(401).send("Authorization header missing");
  }

  // Check Bearer format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Invalid authorization format");
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  if(!token){
    return res.status(401).send("Token missing");
  }
  try {

    // Verify JWT using PUBLIC KEY
    const decoded = JWT.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    });

    // Return user info
    return res.json(decoded);

  } catch (error) {

    return res.status(401).send("Invalid token");

  }
});

app.get("/.well-known/jwks.json", async (_, res) => {
  const key = await jose.JWK.asKey(PUBLIC_KEY, "pem");
  //                         👆          👆      👆
  //                    converts it   your key  tells jose
  //                    to JWK format  (Buffer   the format
  //
  return res.json({ keys: [key.toJSON()] });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});