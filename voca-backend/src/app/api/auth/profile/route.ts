// src/app/api/auth/profile/route.ts
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/authMiddleware";
import { authService } from "@/services/authService";
import { DbUser } from "@/models/user";

export async function GET(request: Request) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await authService.getUserProfile(user.uid);
    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }
    return NextResponse.json({ user: profile });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    
    // Whitelist only allowed fields to be updated by the client
    const updates: Partial<DbUser> = {};
    if (body.displayName !== undefined) updates.displayName = body.displayName;
    if (body.role !== undefined) updates.role = body.role; // e.g. custom user role overrides

    const updatedProfile = await authService.updateUserProfile(user.uid, updates);
    return NextResponse.json({ user: updatedProfile });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user profile" },
      { status: 500 }
    );
  }
}
