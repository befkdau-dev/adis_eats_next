// scripts/create-staff.mjs
import { createUsers } from "../lib/users.js";
async function createStaff() {
  const user = await createUsers(
    "Kitchen Staff",
    "kitchen@email.com",
    "kitchen1234",
    "staff",
  );

  console.log(
    user ? "Staff user created" : "Email already exists — not created",
  );
}

createStaff();
