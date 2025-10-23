import type { User as UserPrisma } from "@/app/generated/prisma";
import type { BusinessDTO } from "../business/business.dto";

export interface UserDTO extends UserPrisma {
  business: BusinessDTO | null;
}
