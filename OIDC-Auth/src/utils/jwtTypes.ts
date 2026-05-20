export type JWTClaims = {
  iss: string;
  sub: string;
  email: string;
  email_verified: string;
  exp: number;
  given_name: string;
  family_name?: string | undefined;  // add | undefined
  name: string;
  picture?: string | undefined;      // add | undefined
};
