import { randomBytes } from "node:crypto";

export function generateEmailVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

export function generatePasswordResetToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}
