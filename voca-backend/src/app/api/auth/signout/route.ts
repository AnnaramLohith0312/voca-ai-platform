// src/app/api/auth/signout/route.ts
import { NextResponse } from "next/server";
import { authService } from "@/services/authService";

export async function POST() {
  try {
    await authService.signOutUser();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sign out" },
      { status: 500 }
    );
  }
}
