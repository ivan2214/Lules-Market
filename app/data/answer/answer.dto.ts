import type {
  Answer,
  Business,
  Review,
  User,
} from "@/app/generated/prisma/client";

export interface AnswerDTO extends Answer {
  user?: User | null;
  review?: Review | null;
  business?: Business | null;
}
