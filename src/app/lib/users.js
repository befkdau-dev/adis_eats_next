// app/lib/users.js
import bcrypt from "bcryptjs";

// In-memory store — resets whenever the server restarts / on each
// serverless cold start. Good enough for demoing without a database.
let users = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Befkadu Teshome",
    email: "customer@example.com",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "customer",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Admin Staff",
    email: "kitchen@email.com",
    passwordHash: bcrypt.hashSync("kitchen1234", 10),
    role: "staff",
  },
];

export async function createUsers({
  name,
  email,
  password,
  role = "customer",
}) {
  const normalized = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalized)) return null;

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalized,
    passwordHash: await bcrypt.hash(password, 10),
    role,
  };

  users.push(user);
  return user;
}

export async function verifyUser({ email, password }) {
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user) return null;

  const matches = await bcrypt.compare(password, user.passwordHash);
  return matches ? user : null;
}
