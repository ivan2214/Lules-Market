"use client";

import { useForm } from "@tanstack/react-form";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { twoFactor } from "@/lib/auth/auth-client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { otpSchema } from "@/shared/validators/auth";
import { typeboxValidator } from "@/shared/validators/form";
import { Field, FieldLabel } from "../ui/field";

export function OtpForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  // In a real app, this email would come from your authentication context
  const userEmail = "user@example.com";

  const form = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onSubmit: typeboxValidator(otpSchema),
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const res = await twoFactor.verifyOtp({
          code: value.code,
        });

        if (res.data) {
          setMessage("OTP validated successfully");
          setIsError(false);
          setIsValidated(true);
          router.refresh();
        } else {
          setIsError(true);
          setMessage("Invalid OTP");
        }
      });
    },
  });

  const requestOTP = async () => {
    startTransition(async () => {
      await twoFactor.sendOtp();
      setMessage("OTP sent to your email");
      setIsError(false);
      setIsOtpSent(true);
    });
  };

  return (
    <div className="grid w-full items-center gap-4">
      {!isOtpSent ? (
        <Button onClick={requestOTP} className="w-full" disabled={pending}>
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Send OTP to Email
        </Button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="flex flex-col space-y-1.5">
            <form.Field name="code">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>One-Time Password</FieldLabel>

                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                    />
                  </Field>
                );
              }}
            </form.Field>
            <p className="text-muted-foreground text-sm">
              Check your email at {userEmail} for the OTP
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={pending || isValidated}
          >
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Validate OTP
          </Button>
        </form>
      )}
      {message && (
        <div
          className={`mt-4 flex items-center gap-2 ${
            isError ? "text-red-500" : "text-primary"
          }`}
        >
          {isError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
}
