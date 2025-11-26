import { z } from "zod";
import type {
  Answer,
  Image,
  Post,
  Profile,
  User,
} from "@/app/generated/prisma";
import { ImageCreateInputSchema } from "../image/image.dto";

export interface PostDTO extends Post {
  author: AuthorDTO;
  answers?: AnswerDTO[];
  images?: Image[];
}

export interface AuthorDTO extends Profile {
  user?: User;
  avatar?: Image | null;
  posts?: PostDTO[];
  answers?: AnswerDTO[];
}

export interface AnswerDTO extends Answer {
  post?: PostDTO | null;
  author: AuthorDTO;
}

// Schemas
export const PostCreateSchema = z.object({
  content: z
    .string()
    .min(10, "El contenido debe tener al menos 10 caracteres")
    .max(1000, "El contenido no puede exceder los 1000 caracteres"),
  images: z.array(ImageCreateInputSchema).optional(),
  isAnon: z.boolean().default(false),
  isQuestion: z.boolean().default(false),
});

export type PostCreateInput = z.infer<typeof PostCreateSchema>;

export const AnswerCreateSchema = z.object({
  content: z
    .string()
    .min(5, "La respuesta debe tener al menos 5 caracteres")
    .max(500, "La respuesta no puede exceder los 500 caracteres"),
  postId: z.string(),
  isAnon: z.boolean().default(false),
  images: z.array(ImageCreateInputSchema).optional(),
});

export type AnswerCreateInput = z.infer<typeof AnswerCreateSchema>;
