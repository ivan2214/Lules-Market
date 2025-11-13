import type {
  Answer,
  Business,
  Question,
  Review,
  User,
} from "@/app/generated/prisma";

export interface AnswerDTO extends Answer {
  user?: User | null;
  question?: Question | null;
  review?: Review | null;
  business?: Business | null;
}
