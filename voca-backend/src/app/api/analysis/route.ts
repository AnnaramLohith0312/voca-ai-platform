// src/app/api/analysis/route.ts
import { NextResponse } from "next/server";
import { authService } from "@/services/authService";
import { onboardingService } from "@/services/onboardingService";
import { analysisService } from "@/services/analysisService";

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
    const progressData = await analysisService.getJobProgress(user.uid);
    return NextResponse.json(progressData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analysis progress" },
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
    const body = await request.json().catch(() => ({}));
    let answers = body.answers;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      // Fallback: try to fetch from onboarding session
      const session = await onboardingService.getSession(user.uid);
      if (session && session.answers && session.answers.length > 0) {
        answers = session.answers;
      } else {
        return NextResponse.json(
          { error: "No onboarding answers found. Complete onboarding before running analysis." },
          { status: 400 }
        );
      }
    }

    const job = await analysisService.startAnalysis(user.uid, answers);
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start analysis" },
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
    await analysisService.clearJob(user.uid);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to clear analysis job" },
      { status: 500 }
    );
  }
}
