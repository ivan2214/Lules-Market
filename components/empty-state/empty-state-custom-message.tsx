import type { LucideIcon } from "lucide-react";
import { EmptyState } from "./empty-state";

type EmptyStateCustomMessageProps = {
  title: string;
  description: string;
  icons?: LucideIcon[];
};

export const EmptyStateCustomMessage: React.FC<
  EmptyStateCustomMessageProps
> = ({ title, description, icons }) => {
  return <EmptyState title={title} description={description} icons={icons} />;
};
