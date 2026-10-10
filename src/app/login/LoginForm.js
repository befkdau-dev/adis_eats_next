// app/login/LoginForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/app/lib/auth-actions";
import { useAuth } from "../context/AuthContext";
export default function LoginForm({ next }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const action = mode === "login" ? login : register;
    const result = await action({ ...form, next });

    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    setUser(result.user);
    router.push(result.redirectTo);
    router.refresh();
  };

  return (
    <div className="max-w-sm mx-auto py-12">
      {/* mode switch */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-6">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
          }}
          className={
            mode === "login"
              ? "flex-1 py-2 text-sm font-medium bg-orange-600 text-white"
              : "flex-1 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          }
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError("");
          }}
          className={
            mode === "register"
              ? "flex-1 py-2 text-sm font-medium bg-orange-600 text-white"
              : "flex-1 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          }
        >
          Create account
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "register" && (
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
          />
        )}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {submitting
            ? "Please wait..."
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
