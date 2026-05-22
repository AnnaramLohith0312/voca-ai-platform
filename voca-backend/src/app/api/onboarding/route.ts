// src/app/api/onboarding/route.ts
import { NextResponse } from "next/server";
import { authService } from "@/services/authService";
import { onboardingService } from "@/services/onboardingService";

async function authenticate(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return null;
  }
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  if (!token) {
    return null;
  }
  try {
    return await authService.verifyIdToken(token);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const session = await onboardingService.getSession(user.uid);
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch onboarding session" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Answers must be a valid array" }, { status: 400 });
    }

    const session = await onboardingService.submitSession(user.uid, answers);
    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit onboarding session" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { answers, currentStep } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Answers must be a valid array" }, { status: 400 });
    }
    
    if (typeof currentStep !== 'number') {
      return NextResponse.json({ error: "currentStep must be a number" }, { status: 400 });
    }

    const session = await onboardingService.saveDraft(user.uid, answers, currentStep);
    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save onboarding draft" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await onboardingService.clearSession(user.uid);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to clear onboarding session" },
      { status: 500 }
    );
  }
}
