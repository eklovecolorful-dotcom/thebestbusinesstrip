import { getSupabaseServerClient } from "@/lib/supabase-server";
import AdminCollectDepositButton from "@/components/admin-collect-deposit-button";
import { DEPOSIT_AMOUNT_USD } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const PARTY_SIZE_LABELS: Record<string, string> = {
  solo: "單獨旅行",
  couple: "兩人同行",
  family: "親子家庭",
  unspecified: "未提供（精選行程直接預訂）",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "待確認",
  confirmed: "已確認",
  cancelled: "已取消",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold/15 text-[#8a6a1f]",
  confirmed: "bg-forest/15 text-forest",
  cancelled: "bg-charcoal/10 text-charcoal/50",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment } = await searchParams;

  let supabase: ReturnType<typeof getSupabaseServerClient>;
  try {
    supabase = getSupabaseServerClient();
  } catch (error) {
    return (
      <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-6 text-terracotta">
        Supabase 尚未設定：{error instanceof Error ? error.message : "未知錯誤"}
      </div>
    );
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-6 text-terracotta">
        讀取訂單失敗：{error.message}
      </div>
    );
  }

  return (
    <div>
      {payment === "success" && (
        <div className="mb-6 rounded-xl border border-forest/20 bg-forest/5 px-4 py-3 text-sm text-forest">
          訂金已收款，訂單狀態將於數秒內更新為「已確認」。
        </div>
      )}
      {payment === "cancelled" && (
        <div className="mb-6 rounded-xl border border-charcoal/15 bg-charcoal/5 px-4 py-3 text-sm text-charcoal/60">
          付款流程已取消，訂單仍為待確認狀態。
        </div>
      )}

      <h1 className="font-display text-2xl font-medium text-charcoal">
        訂單列表
      </h1>
      <p className="mt-1 text-sm text-charcoal/60">
        共 {orders?.length ?? 0} 筆訂單，依建立時間排序。訂金金額 ${DEPOSIT_AMOUNT_USD} USD。
      </p>

      <div className="mt-8 space-y-4">
        {orders?.length === 0 && (
          <p className="text-sm text-charcoal/50">目前還沒有任何訂單。</p>
        )}

        {orders?.map((order) => {
          const itinerary = order.itinerary_details as {
            title?: string;
            summary?: string;
            morning?: { time: string; title: string; description: string }[];
            afternoon?: { time: string; title: string; description: string }[];
            evening?: { time: string; title: string; description: string }[];
          } | null;

          return (
            <details
              key={order.id}
              className="group rounded-2xl border border-charcoal/10 bg-white p-6 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-lg font-medium text-charcoal">
                    {order.customer_name}
                    <span className="ml-2 text-sm font-normal text-charcoal/50">
                      {order.customer_email}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-charcoal/60">
                    {itinerary?.title ?? "（無行程標題）"} · 出發日期{" "}
                    {order.tour_date} ·{" "}
                    {PARTY_SIZE_LABELS[order.party_size] ?? order.party_size}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {order.status === "pending" && (
                    <AdminCollectDepositButton orderId={order.id} />
                  )}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      STATUS_STYLES[order.status] ?? "bg-charcoal/10 text-charcoal/60"
                    }`}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span className="text-xs text-charcoal/40">
                    {formatDateTime(order.created_at)}
                  </span>
                </div>
              </summary>

              {itinerary && (
                <div className="mt-6 space-y-5 border-t border-charcoal/8 pt-5">
                  {itinerary.summary && (
                    <p className="text-sm leading-relaxed text-charcoal/70">
                      {itinerary.summary}
                    </p>
                  )}

                  {(
                    [
                      ["上午", itinerary.morning],
                      ["下午", itinerary.afternoon],
                      ["晚上", itinerary.evening],
                    ] as const
                  ).map(([label, stops]) =>
                    stops && stops.length > 0 ? (
                      <div key={label}>
                        <p className="text-xs font-medium uppercase tracking-[0.1em] text-terracotta">
                          {label}
                        </p>
                        <div className="mt-2 space-y-2">
                          {stops.map((stop, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium text-charcoal">
                                {stop.time} · {stop.title}
                              </span>
                              <p className="text-charcoal/60">{stop.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}
