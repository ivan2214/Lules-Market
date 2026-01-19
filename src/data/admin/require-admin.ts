import "server-only";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getCurrentAdmin } from "./get-current-admin";

export const requireAdmin = async () => {
  const { admin } = await getCurrentAdmin();

  if (!admin) {
    redirect(pathsConfig.auth.signIn);
  }
};
