import type { Admin } from "@/app/generated/prisma/client";
import type { UserDTO } from "../user/user.dto";

export interface AdminDTO extends Admin {
  user: UserDTO;
}
