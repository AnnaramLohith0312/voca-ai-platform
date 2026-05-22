// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { authService } from "@/services/authService";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, displayName } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    await authService.signUp(email, password, displayName);
    const loginPayload = await authService.signIn(email, password);

    return NextResponse.json(loginPayload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    let status = 500;
    if (message.includes("email-already-in-use")) {
      status = 409;
    } else if (message.includes("invalid-email")) {
      status = 400;
    }
    return NextResponse.json({ error: message }, { status });
  }
}
