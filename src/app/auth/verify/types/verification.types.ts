export type VerificationStatus =
  | "pending"
  | "verified"
  | "error"
  | "expired"
  | "verifying";

export interface VerificationState {
  status: VerificationStatus;
  email?: string;
  error?: string;
}

export interface ResendEmailFormValues {
  email: string;
}

export interface TokenFormValues {
  token: string;
}
