import express from "express";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import crypto from "crypto";
import JWT from "jsonwebtoken";
import jose from "node-jose";
import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { usersTable } from "./db/schema.js";
import { PRIVATE_KEY, PUBLIC_KEY } from "./utils/cert.js";
import type { JWTClaims } from "./utils/jwtTypes.js";
import { oauthClientsTable } from "./db/schema2.js";
import { log } from "console";



const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = process.env.PORT ?? 5000;

const ISSUER = `http://localhost:${PORT}`;

// ======================================================
// Types
// ======================================================

type AuthCode = {
  code: string;
  userId: string;
  clientId: string;
  redirectUri: string;
  expiresAt: number;
};
type PendingAuthorization = {
  userId: string;
  clientId: string;
  redirectUri: string;
  state?: string;
};

const pendingAuthorizations = new Map<string, PendingAuthorization>();

// ======================================================
// Temporary In-Memory Authorization Code Store
// ======================================================

const authorizationCodes = new Map<string, AuthCode>();

// ======================================================
// Home
// ======================================================

app.get("/", (_: Request, res: Response) => {
  res.send("OAuth2 + OIDC Provider Running");
});

// ======================================================
// OpenID Configuration
// ======================================================

app.get("/.well-known/openid-configuration", (_: Request, res: Response) => {

  return res.json({
    issuer: ISSUER,
    authorization_endpoint: `${ISSUER}/o/authorize`,
    token_endpoint: `${ISSUER}/o/token`,
    userinfo_endpoint: `${ISSUER}/o/userinfo`,
    refresh_token_endpoint: `${ISSUER}/o/refresh`,
    jwks_uri: `${ISSUER}/.well-known/jwks.json`,
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "profile", "email"],
    token_endpoint_auth_methods_supported: ["client_secret_post"]
  });
}
);

// ======================================================
// Pages
// ======================================================

app.get("/home", (_: Request, res: Response) => {
  res.sendFile("home.html", {
    root: "./public"
  });
});

app.get("/signup", (_: Request, res: Response) => {
  res.sendFile("signup.html", {
    root: "./public"
  });
});

// ======================================================
// Signup
// ======================================================

app.post("/signup", async (req: Request, res: Response) => {

  const {
    firstName,
    lastName,
    email,
    password,
    client_id,
    redirect_uri,
    state
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password
  ) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existingUser) {
    return res.status(400).send(
      "User already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await db.insert(usersTable).values({
    firstName,
    lastName,
    email,
    password: hashedPassword
  }).returning();


  const consentId = crypto.randomBytes(32).toString("hex");

  pendingAuthorizations.set(consentId, {
    userId: user?.id as string,
    clientId: client_id,
    redirectUri: redirect_uri,
    state
  });

  return res.redirect(`/o/consent?consent_id=${consentId}`);


}
);

// ======================================================
// OAuth2 Authorization Endpoint
// ======================================================

app.get("/o/authorize", async (req: Request, res: Response) => {

  const {
    client_id,
    redirect_uri,
    response_type
  } = req.query;

  // ============================
  // Basic Validation
  // ============================

  if (!client_id || !redirect_uri || response_type !== "code") {

    return res.status(400).send(
      "Invalid OAuth request"
    );
  }

  // ============================
  // Find Client
  // ============================

  const [client] = await db
    .select()
    .from(oauthClientsTable)
    .where(
      eq(
        oauthClientsTable.clientId,
        String(client_id)
      )
    )
    .limit(1);

  if (!client) {

    return res.status(400).send(
      "Invalid client"
    );
  }

  // ============================
  // Validate Redirect URI
  // ============================

  if (
    client.redirectUri !==
    redirect_uri
  ) {

    return res.status(400).send(
      "Invalid redirect URI"
    );
  }

  // ============================
  // Show Login Page
  // ============================

  return res.sendFile("login.html", { root: "./public" });
}
);

// ======================================================
// OAuth2 Login + Authorization Code Generation
// ======================================================

app.post("/o/authorize", async (req: Request, res: Response) => {

  const {
    email,
    password,
    client_id,
    redirect_uri,
    state
  } = req.body;

  if (
    !email ||
    !password ||
    !client_id ||
    !redirect_uri
  ) {
    return res.status(400).send(
      "Missing required fields"
    );
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) {
    return res.status(401).send(
      "User not found"
    );
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password!
  );

  if (!isMatch) {
    return res.status(401).send(
      "Invalid credentials"
    );
  }
  const consentId = crypto.randomBytes(32).toString("hex");

  pendingAuthorizations.set(consentId, {
    userId: user.id,
    clientId: client_id,
    redirectUri: redirect_uri,
    state
  });

  return res.redirect(`/o/consent?consent_id=${consentId}`);

}
);

app.get("/o/consent", async (req, res) => {

  const consentId =
    req.query.consent_id as string;

  const pending =
    pendingAuthorizations.get(consentId);

  if (!pending) {
    return res.status(400).send(
      "Invalid consent request"
    );
  }

  const [client] = await db
    .select()
    .from(oauthClientsTable)
    .where(
      eq(
        oauthClientsTable.clientId,
        pending.clientId
      )
    )
    .limit(1);

  if (!client) {
    return res.status(400).send(
      "Client not found"
    );
  }

  return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Consent</title>

<style>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Inter,Segoe UI,sans-serif;
}

body{
  min-height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  background:#0f172a;
  color:#f8fafc;
}

.card{
  width:100%;
  max-width:500px;
  background:#1e293b;
  border:1px solid #334155;
  border-radius:18px;
  padding:32px;
  box-shadow:0 20px 40px rgba(0,0,0,.35);
}

.logo{
  width:70px;
  height:70px;
  margin:0 auto 20px;
  border-radius:50%;
  background:#2563eb;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:30px;
  font-weight:bold;
}

h2{
  text-align:center;
  margin-bottom:10px;
}

.subtitle{
  text-align:center;
  color:#94a3b8;
  line-height:1.6;
  margin-bottom:25px;
}

.app{
  color:#60a5fa;
  font-weight:600;
}

.permissions{
  margin-top:20px;
}

.permissions h3{
  margin-bottom:15px;
}

.permission{
  display:flex;
  align-items:center;
  gap:12px;
  padding:14px;
  background:#0f172a;
  border:1px solid #334155;
  border-radius:12px;
  margin-bottom:12px;
}

.permission-icon{
  font-size:20px;
}

.permission-text{
  color:#cbd5e1;
}

.warning{
  margin-top:20px;
  padding:14px;
  border-radius:12px;
  background:#172554;
  border:1px solid #1d4ed8;
  color:#bfdbfe;
  font-size:14px;
}

.actions{
  display:flex;
  gap:12px;
  margin-top:25px;
}

button{
  flex:1;
  border:none;
  border-radius:12px;
  padding:12px;
  font-size:15px;
  font-weight:600;
  cursor:pointer;
  transition:.2s;
}

.allow{
  background:#2563eb;
  color:white;
}

.allow:hover{
  background:#1d4ed8;
}

.deny{
  background:#334155;
  color:white;
}

.deny:hover{
  background:#475569;
}

.footer{
  text-align:center;
  color:#64748b;
  margin-top:20px;
  font-size:13px;
}

</style>
</head>

<body>

<div class="card">

  <div class="logo">O</div>

  <h2>Authorize Application</h2>

  <p class="subtitle">
    <span class="app">${client.appName}</span>
    is requesting permission to access your account.
  </p>

  <div class="permissions">

    <h3>Requested Access</h3>

    <div class="permission">
      <div class="permission-icon">👤</div>
      <div class="permission-text">
        View your profile information
      </div>
    </div>

    <div class="permission">
      <div class="permission-icon">📧</div>
      <div class="permission-text">
        Access your email address
      </div>
    </div>

    <div class="permission">
      <div class="permission-icon">🔐</div>
      <div class="permission-text">
        Sign you in using OpenID Connect
      </div>
    </div>

  </div>

  <div class="warning">
    Only continue if you trust this application.
  </div>

  <form action="/o/consent" method="POST">

    <input
      type="hidden"
      name="consent_id"
      value="${consentId}"
    >

    <div class="actions">

      <button
        type="submit"
        name="decision"
        value="deny"
        class="deny"
      >
        Deny
      </button>

      <button
        type="submit"
        name="decision"
        value="allow"
        class="allow"
      >
        Allow Access
      </button>

    </div>

  </form>

  <div class="footer">
    OAuth 2.0 Authorization Request
  </div>

</div>

</body>
</html>
`);
});
app.post("/o/consent", async (req, res) => {

  const { consent_id, decision } = req.body;

  const pending = pendingAuthorizations.get(consent_id);

  if (!pending) {
    return res.status(400).send(
      "Invalid consent"
    );
  }

  pendingAuthorizations.delete(consent_id);

  if (decision === "deny") {

    return res.redirect(`${pending.redirectUri}?error=access_denied`
    );
  }

  const code = crypto.randomBytes(32).toString("hex");

  authorizationCodes.set(code, {
    code,
    userId: pending.userId,
    clientId: pending.clientId,
    redirectUri: pending.redirectUri,
    expiresAt:
      Date.now() + 1000 * 60 * 5
  });

  return res.redirect(`${pending.redirectUri}?code=${code}&state=${pending.state}`);
});

// ======================================================
// OAuth2 Token Endpoint + Refresh Endpoint
// ======================================================

app.post("/o/token", async (req: Request, res: Response) => {

  const {
    code,
    client_id,
    redirect_uri,
    grant_type,
    refresh_token
  } = req.body;


  if (grant_type !== "authorization_code" && grant_type !== "refresh_token") {
    return res.status(400).json({
      error: "unsupported_grant_type"
    });
  }

  if (grant_type === "authorization_code") {


    const storedCode = authorizationCodes.get(code);// code apna hi he ??


    if (!storedCode) {
      return res.status(400).json({ error: "invalid_code" });
    }

    // Expired

    if (storedCode.expiresAt < Date.now()) {

      authorizationCodes.delete(code);

      return res.status(400).json({ error: "authorization_code_expired" });

    }

    // Validate Client

    if (storedCode.clientId !== client_id || storedCode.redirectUri !== redirect_uri) {
      return res.status(400).json({
        error: "invalid_client"
      });
    }

    // One Time Use

    authorizationCodes.delete(code);

    // Fetch User

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, storedCode.userId))
      .limit(1);

    if (!user) return res.status(404).send("User not found");


    // JWT Claims

    const now = Math.floor(
      Date.now() / 1000
    );

    const claims: JWTClaims = {
      iss: ISSUER,
      sub: user.id,
      aud: client_id,
      email: user.email,
      email_verified: String(user.emailVerified),
      iat: now,
      exp: now + 3600,
      given_name: user.firstName ?? "",
      family_name: user.lastName ?? undefined,
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
      picture: user.profileImageURL ?? undefined
    };

    // Access Token

    const accessToken = JWT.sign(claims, PRIVATE_KEY, { algorithm: "RS256" });

    // ID Token

    const idToken = JWT.sign(claims, PRIVATE_KEY, { algorithm: "RS256" });

    const refreshToken = crypto.randomBytes(64).toString("hex");

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await db.update(usersTable)
      .set({
        refreshToken: hashedRefreshToken,
        refreshTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
      })
      .where(eq(usersTable.id, user.id));


console.log("Generated Refresh Token:", refreshToken);

    return res.json({
      access_token: accessToken,
      token_type: "Bearer",
      id_token: idToken,
      refresh_token: refreshToken,
      expires_in: 3600,
    });

  }

  // . Verify client ownership (future improvement)
  if (grant_type === "refresh_token") {

    

   if (!refresh_token) {
  return res.status(400).json({
    error: "invalid_request"
  });
}
    if (!client_id) {

      return res.status(401).json({
        error:
          "Client ID missing"
      });
    }

    const [client] = await db
      .select()
      .from(oauthClientsTable)
      .where(eq(oauthClientsTable.clientId, client_id))
      .limit(1);

    if (!client) {
      return res.status(400).json({
        error: "Invalid client"
      });
    }


    const ISSUER = `http://localhost:${PORT}`;

    const now = Math.floor(Date.now() / 1000);

   

    const hashedToken = crypto.createHash("sha256")
      .update(refresh_token)
      .digest("hex");


    const [user] = await db.select()
      .from(usersTable)
      .where(eq(usersTable.refreshToken, hashedToken))
      .limit(1);



    if (!user) {

      return res.status(401).json({
        error:
          "invalid_grant"
      });
    }

  if(user.refreshTokenExpiry && user.refreshTokenExpiry < new Date()) {

      return res.status(401).json({
        error: "invalid_grant"
      });
    }

    const claims: JWTClaims = {

      iss: ISSUER,
      sub: user.id,
      aud: client_id,
      email: user.email,
      email_verified: String(user.emailVerified),
      iat: now,
      exp: now + 3600,
      given_name: user.firstName ?? "",
      family_name: user.lastName ?? undefined,
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
      picture: user.profileImageURL ?? undefined
    };

    // ============================
    // Create New Access Token 
    // ============================

    const accessToken = JWT.sign(claims, PRIVATE_KEY, { algorithm: "RS256" });

    

    // ============================
    // Return New Access Token
    // ============================

    return res.json({
      access_token: accessToken,
      token_type: "Bearer",
      // refresh_token: newRefreshToken,
      expires_in: 3600,
    });
  }

}
);

// ======================================================
// UserInfo Endpoint
// ======================================================

app.get("/o/userinfo", (req: Request, res: Response) => {

  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send(
      "Authorization header missing"
    );
  }

  if (
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).send(
      "Invalid authorization format"
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send(
      "Token missing"
    );
  }

  try {

    const decoded = JWT.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });

    return res.json(decoded);

  } catch (error) {

    return res.status(401).send(
      "Invalid token"
    );
  }
}
);

// ======================================================
// JWKS Endpoint
// ======================================================

app.get("/.well-known/jwks.json", async (_: Request, res: Response) => {

  const key = await jose.JWK.asKey(PUBLIC_KEY, "pem");

  return res.json({ keys: [key.toJSON()] });
}


  //   or====================================================

  //   app.get("/.well-known/jwks.json", (_, res) => {
  //   const key = crypto.createPublicKey(PUBLIC_KEY);
  //   const jwk = key.export({ format: "jwk" });
  //   return res.json({ keys: [jwk] });
  // });



);

app.get("/o/register-client", async (req: Request, res: Response) => {
  return res.sendFile("register.html", {
    root: "./public"
  });
})
app.post("/o/register-client", async (req: Request, res: Response) => {

  try {

    const {
      appName,
      redirectUri,
      scope,
      responseType
    } = req.body;

    // ====================================
    // Validation
    // ====================================

    if (!appName || !redirectUri) {

      return res.status(400).json({
        message:
          "App name and redirect URI are required"
      });
    }

    // ====================================
    // Generate Client Credentials
    // ====================================

    const clientId = crypto.randomBytes(16).toString("hex");

    const clientSecret = crypto.randomBytes(32).toString("hex");

    // ====================================
    // Save Client In Database
    // ====================================

    await db.insert(oauthClientsTable)
      .values({
        appName,
        clientId,
        clientSecret,
        redirectUri,
        scope: scope || "openid profile email",
        responseType: responseType || "code"
      });

    // ====================================
    // Return Credentials
    // ====================================

    return res.status(201).json({

      message: "OAuth client registered successfully",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      scope: scope || "openid profile email",
      response_type: responseType || "code"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}
);

app.post("/o/refresh", async (req: Request, res: Response) => {

  // ============================
  // Read Refresh Token Cookie
  // ============================

  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {

    return res.status(401).json({
      error:
        "Refresh token missing"
    });
  }


  const ISSUER = `http://localhost:${PORT}`;

  const now = Math.floor(Date.now() / 1000);

  // Example demo user
  // Replace with DB lookup

  const [user] = await db
    .select()
    .from(usersTable)
    .limit(1);

  if (!user) {

    return res.status(404).json({
      error:
        "User not found"
    });
  }

  const claims: JWTClaims = {

    iss: ISSUER,
    sub: user.id,
    aud: "client-app",
    email: user.email,
    email_verified: String(user.emailVerified),
    iat: now,
    exp: now + 3600,
    given_name: user.firstName ?? "",
    family_name: user.lastName ?? undefined,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    picture: user.profileImageURL ?? undefined
  };

  // ============================
  // Create New Access Token
  // ============================

  const accessToken = JWT.sign(claims, PRIVATE_KEY, { algorithm: "RS256" });

  // ============================
  // Return New Access Token
  // ============================

  return res.json({

    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600
  });
}
);

// ======================================================
// Start Server
// ======================================================

app.listen(PORT, () => {
  console.log(
    `OIDC Provider running on ${ISSUER}`
  );
});