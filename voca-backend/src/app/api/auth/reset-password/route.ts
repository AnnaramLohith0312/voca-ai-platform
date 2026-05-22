// src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { authService } from "@/services/authService";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await authService.resetPassword(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send password reset email" },
      { status: 500 }
    );
  }
}
