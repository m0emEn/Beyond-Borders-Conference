import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const getSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET env var is not set");
  return new TextEncoder().encode(secret);
};

// Extends JWTPayload to satisfy jose's index signature requirement
export interface AdminJWTPayload extends JWTPayload {
  memberId: string;
  role: string;
  department: string;
}

export async function signAdminJWT(payload: AdminJWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminJWT(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as AdminJWTPayload;
  } catch {
    return null;
  }
}
