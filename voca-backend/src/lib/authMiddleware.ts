// src/lib/authMiddleware.ts
import { authService } from "@/services/authService";
import { DbUser } from "@/models/user";

/**
 * Authenticates an incoming Next.js Request using the authorization bearer token.
 * Returns the decoded DbUser profile if successful, or null otherwise.
 */
export async function authenticateRequest(request: Request): Promise<DbUser | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return null;
  }

  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.slice(7) 
    : authHeader;

  if (!token) {
    return null;
  }

  try {
    return await authService.verifyIdToken(token);
  } catch (error) {
    console.error("Token verification failed in authMiddleware:", error);
    return null;
  }
}
