import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";

export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=%2Fkitchen");
  }

  if (session.role !== "staff") {
    redirect("/");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Kitchen dashboard</h1>
      <p>Welcome, {session.email}.</p>
    </main>
  );
}
