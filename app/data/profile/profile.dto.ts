import type { Image, Profile } from "@/db";

import type { UserDTO } from "../user/user.dto";

export interface ProfileDTO extends Profile {
  user?: UserDTO | null;
  avatar?: Image | null;
}
