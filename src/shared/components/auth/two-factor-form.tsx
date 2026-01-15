import { useForm } from "@tanstack/react-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { twoFactor } from "@/lib/auth/auth-client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { totpSchema } from "@/shared/validators/auth";
import { typeboxValidator } from "@/shared/validators/form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

export function TwoFactorForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onChange: typeboxValidator(totpSchema),
      onSubmit: typeboxValidator(totpSchema),
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const res = await twoFactor.verifyTotp({
          code: value.code,
        });

        if (res.data?.token) {
          setSuccess(true);
          router.refresh();
        }
      });
    },
  });

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <p className="font-semibold text-lg">Verification Successful</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field name="code">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Código de verificación
                </FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  disabled={pending}
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify"}
      </Button>
    </form>
  );
}
