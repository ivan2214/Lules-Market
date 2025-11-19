import { Store } from "lucide-react";
import Link from "next/link";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center">
      <Link
        href="/"
        className="mb-6 flex items-center justify-center space-x-2"
      >
        <Store className="h-8 w-8 text-primary" />
        <span className="font-bold text-2xl">LulesMarket</span>
      </Link>
      <h2 className="font-bold text-3xl">{title}</h2>
      <p className="mt-2 text-muted-foreground text-sm">{subtitle}</p>
    </div>
  );
};
