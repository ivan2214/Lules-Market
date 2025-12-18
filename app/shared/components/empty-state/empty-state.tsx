import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/app/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icons: LucideIcon[];
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

export function EmptyState({
  title,
  description,
  icons = [],
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-background text-center",
        "w-full max-w-[620px] rounded-xl p-14",
        className,
      )}
    >
      <div className="isolate flex justify-center">
        {icons.length === 3 ? (
          <>
            <div className="-rotate-6 relative top-1.5 left-2.5 grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200">
              {React.createElement(icons[0], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>
            <div className="relative z-10 grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200">
              {React.createElement(icons[1], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>
            <div className="relative top-1.5 right-2.5 grid size-12 rotate-6 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:translate-x-5 group-hover:rotate-12 group-hover:duration-200">
              {React.createElement(icons[2], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>
          </>
        ) : (
          <div className="grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200">
            {icons[0] &&
              React.createElement(icons[0], {
                className: "w-6 h-6 text-muted-foreground",
              })}
          </div>
        )}
      </div>
      <h2 className="mt-6 font-medium text-foreground">{title}</h2>
      <p className="mt-1 whitespace-pre-line text-muted-foreground text-sm">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className={cn("mt-4", "shadow-sm active:shadow-none")}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
