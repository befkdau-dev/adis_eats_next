import { promises as fs, readFile } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const USERS_FILE = path.join(process.cwd(), "src", "app", "data", "users.json");

export async function readUsers() {
  try {
    const users = JSON.parse(await fs.readFile(USERS_FILE, "utf8"));
    return users;
  } catch {
    return [];
  }
}

export async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function createUsers(name, email, password) {
  const users = await readUsers();
  const normalized = email.trim().toLowerCase();
  if (users.some((usr) => usr.email === normalized)) {
    return null;
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalized,
    passwordHash: await bcrypt.hash(password, 10),
  };

  users.push(user);
  await writeUsers(users);
  return user;
}
export async function verifyUser({ email, password }) {
  const users = await readUsers();
  const user = users.find((usr) => usr.email === email.trim().toLowerCase());
  if (!user) return null;
  const matches = await bcrypt.compare(password, user.passwordHash);
  return matches ? user : null;
}
