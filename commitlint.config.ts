import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [0, "always", 100], // Desactiva la longitud máxima
    "subject-full-stop": [0, "never", "."], // Permite puntos al final
  },
};

export default Configuration;
