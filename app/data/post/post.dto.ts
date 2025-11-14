import type {
  Answer,
  Image,
  Post,
  Profile,
  User,
} from "@/app/generated/prisma";

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
