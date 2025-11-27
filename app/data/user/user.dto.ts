import type { Admin, User as UserPrisma } from "@/app/generated/prisma/client";
import type { BusinessDTO } from "../business/business.dto";

export interface UserDTO extends UserPrisma {
  business?: BusinessDTO | null;
  admin?: Admin | null;
}
