import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard | Adis Eats",
  description: "View Adis Eats order and revenue summaries.",
};

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;

  if (params?.error === "1") {
    throw new Error("Forced dashboard error for testing.");
  }

  return (
    <DashboardClient
      forceEmpty={params?.empty === "1"}
      simulateDelay={params?.slow === "1"}
    />
  );
}
