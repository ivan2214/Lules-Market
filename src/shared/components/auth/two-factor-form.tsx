import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { type TotpSchema, totpSchema } from "@/shared/validators/auth";

export function TwoFactorForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const form = useForm<TotpSchema>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(totpSchema),
  });

  const onSubmit = async (data: TotpSchema) => {
    startTransition(async () => {
      const res = await authClient.twoFactor.verifyTotp({
        code: data.code,
      });

      if (res.data?.token) {
        setSuccess(true);
        router.refresh();
      } else {
        form.setError("code", { message: "Invalid TOTP code" });
      }
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <p className="font-semibold text-lg">Verification Successful</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TOTP Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Verify"
          )}
        </Button>
      </form>
    </Form>
  );
}
