import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || new TextEncoder().encode(secret).length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 bytes.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user) {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function verifySessionToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      !["customer", "staff"].includes(payload.role)
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
