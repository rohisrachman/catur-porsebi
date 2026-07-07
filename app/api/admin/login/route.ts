import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminPasscode } from "@/lib/auth";

export async function POST(request: Request) {
  const configuredPasscode = getAdminPasscode();
  if (!configuredPasscode) {
    return NextResponse.json({ ok: false, message: "ADMIN_PASSCODE belum dikonfigurasi." }, { status: 500 });
  }

  const body = (await request.json().catch(() => ({}))) as { passcode?: string };
  if (!body.passcode || body.passcode !== configuredPasscode) {
    return NextResponse.json({ ok: false, message: "Passcode admin tidak valid." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return response;
}
