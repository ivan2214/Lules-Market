import { DynamicIcon } from "@/app/shared/components/dynamic-icon";
import { Button } from "@/app/shared/components/ui/button";

type Props = {
  label: string;
  href?: string | null;
  icon: string;
};

export function ContactButton({ label, href, icon }: Props) {
  if (!href) return null;
  return (
    <Button asChild variant="outline" className="justify-start bg-transparent">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <DynamicIcon name={icon} className="mr-2 h-4 w-4" />
        {label}
      </a>
    </Button>
  );
}
