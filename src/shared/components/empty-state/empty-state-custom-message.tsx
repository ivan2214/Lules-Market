import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { EmptyState } from "./empty-state";

type EmptyStateCustomMessageProps = {
  title: string;
  description: string;
  icons: LucideIcon[];
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

export const EmptyStateCustomMessage: React.FC<
  EmptyStateCustomMessageProps
> = ({ title, description, icons, className }) => {
  return (
    <EmptyState
      title={title}
      description={description}
      icons={icons}
      className={className}
    />
  );
};
