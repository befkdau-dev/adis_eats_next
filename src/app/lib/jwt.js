import { SignJWT, jwtVerify } from "jose";

const secert = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function encypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secert);
}

export async function decrypt(token) {
  if (!token) return null;
  try {
    const payload = jwtVerify(token, secert, { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}
