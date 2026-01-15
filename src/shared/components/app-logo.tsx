import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

export function AppLogo({ path }: { path?: Route }) {
  return (
    <Link
      href={path ?? "/"}
      className="flex items-center gap-2 self-center font-medium"
    >
      <div className="w-24">
        <Image src="/logo.webp" alt="Logo" width={128} height={128} />
      </div>
    </Link>
  );
}
