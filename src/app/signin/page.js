import { signInAction } from "@/app/actions";

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : "/";
  const error = params?.error;

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Sign in to Adis Eats</h1>

      {error === "invalid" && (
        <p className="mb-4 text-red-600">Invalid email or password.</p>
      )}

      <form action={signInAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <label className="block">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border p-3"
          />
        </label>

        <label className="block">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded border p-3"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded bg-[#244b36] p-3 text-white"
        >
          Sign in
        </button>
      </form>

      <div className="mt-6 rounded-xl border border-[#dce5da] bg-[#f5f8f2] p-4">
        <h2 className="mb-3 text-lg font-semibold text-[#244b36]">
          Demo Accounts
        </h2>

        <div className="mb-4 rounded-lg bg-white p-3">
          <p className="font-semibold">Customer Account</p>
          <p className="text-sm">Email: customer@adis-eats.test</p>
          <p className="text-sm">Password: Customer123!</p>
          <p className="mt-1 text-xs text-gray-500">Role: Customer</p>
        </div>

        <div className="rounded-lg bg-white p-3">
          <p className="font-semibold">Staff Account</p>
          <p className="text-sm">Email: staff@adis-eats.test</p>
          <p className="text-sm">Password: Staff123!</p>
          <p className="mt-1 text-xs text-gray-500">Role: Staff</p>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          These credentials are for development and testing only.
        </p>
      </div>
    </main>
  );
}
