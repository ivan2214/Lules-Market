import { Skeleton } from "@/shared/components/ui/skeleton";

export function SignInFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Label email */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Input email */}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" /> {/* Label password */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Input password */}
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <Skeleton className="h-10 w-24 rounded-md" /> {/* Botón cancelar */}
        <Skeleton className="h-10 w-32 rounded-md" />{" "}
        {/* Botón iniciar sesión */}
      </div>
    </div>
  );
}
