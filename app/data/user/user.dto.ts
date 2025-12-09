import type { Admin, User } from "@/db";
import type { BusinessDTO } from "../business/business.dto";

export interface UserDTO extends User {
  business?: BusinessDTO | null;
  admin?: Admin | null;
}
