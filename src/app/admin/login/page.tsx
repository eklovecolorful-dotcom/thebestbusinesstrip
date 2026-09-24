"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? "登入失敗，請再試一次。");
        return;
      }

      router.push("/admin/orders");
      router.refresh();
    } catch {
      setError("登入失敗，請再試一次。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-charcoal/10 bg-white p-8 shadow-sm"
      >
        <p className="font-display text-xl font-medium text-forest">
          Taiwan Local Host
        </p>
        <p className="mt-1 text-sm text-charcoal/60">後台管理登入</p>

        <label htmlFor="admin-password" className="mt-6 block text-sm font-medium text-charcoal">
          管理密碼
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
          className="mt-2 w-full rounded-xl border border-charcoal/15 px-3.5 py-2.5 text-[15px] text-charcoal focus:border-forest focus:outline-none"
        />

        {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "登入中..." : "登入"}
        </button>
      </form>
    </div>
  );
}
