// src/app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import { authService } from "@/services/authService";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const payload = await authService.signIn(email, password);
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    let status = 401;
    if (message.includes("user-not-found")) {
      status = 404;
    }
    return NextResponse.json({ error: message }, { status });
  }
}
