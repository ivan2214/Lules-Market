import { cacheLife, cacheTag } from "next/cache";

const cacheYearInSeconds = 365 * 24 * 60 * 60;

export async function getCurrentYear() {
  "use cache";
  cacheTag("year");
  cacheLife({
    revalidate: cacheYearInSeconds,
    expire: cacheYearInSeconds,
  });
  return await new Date().getFullYear();
}
