import type { Image, Profile } from "@/app/generated/prisma";
import type { AnswerDTO } from "../answer/answer.dto";
import type { PostDTO } from "../post/post.dto";
import type { ReviewDTO } from "../review/review.dto";
import type { UserDTO } from "../user/user.dto";

export interface ProfileDTO extends Profile {
  user?: UserDTO | null;
  reviews?: ReviewDTO[] | null;
  avatar?: Image | null;
  posts?: PostDTO[] | null;
  answers?: AnswerDTO[] | null;
}
