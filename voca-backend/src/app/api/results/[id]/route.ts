import { NextResponse } from "next/server";
import { authService } from "@/services/authService";
import { resultsService } from "@/services/resultsService";

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resultId = params.id;
    const result = await resultsService.getResultById(user.uid, resultId);
    
    if (!result) {
      return NextResponse.json(
        { error: "Result not found or does not belong to user." },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch career result by ID" },
      { status: 500 }
    );
  }
}
