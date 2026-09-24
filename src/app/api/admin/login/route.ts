import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DURATION_MS,
  createAdminSessionToken,
  safeCompare,
} from "@/lib/admin-auth";

const LoginSchema = z.object({ password: z.string().min(1) });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("admin/login: ADMIN_PASSWORD is not configured");
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 500 }
    );
  }

  if (!safeCompare(parsed.data.password, adminPassword)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  let token: string;
  try {
    token = createAdminSessionToken();
  } catch (error) {
    console.error("admin/login: ADMIN_SESSION_SECRET is not configured", error);
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_MS / 1000,
  });
  return response;
}
