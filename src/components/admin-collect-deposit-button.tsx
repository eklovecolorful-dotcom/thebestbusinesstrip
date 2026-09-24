"use client";

import { useState } from "react";

export default function AdminCollectDepositButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;

      if (!response.ok || !data?.url) {
        setError(data?.error ?? "無法建立付款連結。");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("無法建立付款連結。");
      setLoading(false);
    }
  }

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-full bg-gold px-4 py-1.5 text-xs font-medium text-forest-dark transition-colors hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "建立中..." : "收訂金"}
      </button>
      {error && <p className="mt-1 text-xs text-terracotta">{error}</p>}
    </div>
  );
}
