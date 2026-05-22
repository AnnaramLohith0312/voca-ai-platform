// src/app/api/results/route.ts
import { NextResponse } from "next/server";
import { authService } from "@/services/authService";
import { resultsService } from "@/services/resultsService";
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
    const results = await resultsService.getLatestResult(user.uid);
    if (!results) {
      return NextResponse.json(
        { error: "Results not found. Please complete the onboarding and analysis first." },
        { status: 404 }
      );
    }
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch career results" },
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
    // Regenerate results using onboarding answers
    const onboarding = await onboardingService.getSession(user.uid);
    if (!onboarding || !onboarding.answers || onboarding.answers.length === 0) {
      return NextResponse.json(
        { error: "No onboarding answers found. Cannot generate results." },
        { status: 400 }
      );
    }

    const answersMap: Record<string, string> = {};
    onboarding.answers.forEach((ans) => {
      answersMap[ans.question] = ans.answer;
    });

    const results = await resultsService.generateResults(user.uid, answersMap);
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate career results" },
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
    await resultsService.clearResults(user.uid);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to clear career results" },
      { status: 500 }
    );
  }
}
