// src/models/user.ts

export interface DbUser {
  uid: string;
  email: string;
  displayName: string | null;
  role?: string;
  createdAt: string;
  updatedAt: string;
}
