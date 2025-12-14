import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [0, "always", 100], // Desactiva la longitud máxima
    "subject-full-stop": [0, "never", "."], // Permite puntos al final
    "body-max-line-length": [0, "always", 200], // Permite líneas más largas en el cuerpo
    // 🔓 Permite mayúscula o minúscula
    "subject-case": [0],
    "header-case": [0],
    "body-case": [0],
    "type-case": [0],
  },
};

export default Configuration;
