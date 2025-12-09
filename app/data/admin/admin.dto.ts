import type { Admin } from "@/db";
import type { UserDTO } from "../user/user.dto";

export interface AdminDTO extends Admin {
  user: UserDTO;
}
