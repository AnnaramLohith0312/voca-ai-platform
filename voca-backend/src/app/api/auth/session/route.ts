// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { authService } from "@/services/authService";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }

    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return NextResponse.json({ error: "Invalid authorization token format" }, { status: 401 });
    }

    const user = await authService.verifyIdToken(token);
    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: error instanceof Error ? error.message : "Authentication failed" },
      { status: 401 }
    );
  }
}
