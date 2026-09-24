import "server-only";
import { createClient } from "@supabase/supabase-js";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  tour_date: string;
  party_size: string;
  itinerary_details: Json;
  status: string;
  created_at: string;
  stripe_checkout_session_id: string | null;
  deposit_amount_cents: number | null;
  deposit_paid_at: string | null;
};

type OrderInsert = Omit<
  OrderRow,
  | "id"
  | "status"
  | "created_at"
  | "stripe_checkout_session_id"
  | "deposit_amount_cents"
  | "deposit_paid_at"
> & {
  id?: string;
  status?: string;
  created_at?: string;
  stripe_checkout_session_id?: string | null;
  deposit_amount_cents?: number | null;
  deposit_paid_at?: string | null;
};

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: OrderRow;
        Insert: OrderInsert;
        Update: Partial<OrderInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseServerClient() {
  if (client) return client;

  const rawUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  // The client appends /rest/v1 itself — strip it if pasted from the API URL field.
  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  client = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}
