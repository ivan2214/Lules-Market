/** biome-ignore-all lint/suspicious/noExplicitAny: <necesario> */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { ZodType } from "zod";

export interface ActionResult {
  errorMessage?: string;
  successMessage?: string;
  data?: any;
}

export interface ActionOptions<TState extends ActionResult> {
  onSuccess?: (state: TState) => void;
  onError?: (state: TState) => void;
  redirectTo?: string;
  showToasts?: boolean;
}

const ESTADO_INICIAL_POR_DEFECTO = {
  errorMessage: undefined,
  successMessage: undefined,
  data: undefined,
} as const;

export function useAction<
  TInput extends FieldValues,
  TState extends ActionResult,
>({
  action,
  initialState = ESTADO_INICIAL_POR_DEFECTO as Awaited<TState>,
  options = {},
  defaultValues,
  formSchema,
}: {
  action: (prevState: TState, input: TInput) => Promise<TState>;
  initialState?: Awaited<TState>;
  // accept a ZodType parametrizado
  formSchema?: ZodType<TInput, any, any>;
  // defaultValues tipado adecuadamente
  defaultValues?: DefaultValues<TInput>;
  options: ActionOptions<TState>;
}) {
  const router = useRouter();
  const [state, execute, pending] = useActionState<TState, TInput>(
    action,
    initialState,
  );

  const optionsRef = useRef(options);
  const routerRef = useRef(router);
  const isFirstRender = useRef(true);

  useEffect(() => {
    optionsRef.current = options;
    routerRef.current = router;
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const {
      onSuccess,
      onError,
      redirectTo,
      showToasts = true,
    } = optionsRef.current;
    const currentRouter = routerRef.current;

    if (showToasts) {
      if (state.errorMessage) toast.error(state.errorMessage);
      if (state.successMessage) toast.success(state.successMessage);
    }

    if (state.successMessage) {
      if (redirectTo) currentRouter.push(redirectTo);
      onSuccess?.(state);
    }

    if (state.errorMessage) {
      onError?.(state);
    }
  }, [state]);

  // zodResolver tiene firmas que a veces no encajan exactamente con los genéricos de RHF,
  // así que creamos el resolver y casteamos al Resolver<TInput>.
  const resolver = formSchema
    ? (zodResolver(formSchema as any) as Resolver<TInput>)
    : undefined;

  const form = useForm<TInput>({
    resolver,
    defaultValues,
  }) as UseFormReturn<TInput>; // opcional, ayuda al inference en el return

  const executeForm = useCallback(
    (input: TInput) => {
      const isValid = formSchema?.safeParse(input);
      if (!isValid?.success) {
        toast.error(isValid?.error.message);
        return;
      }
      startTransition(() => execute(input));
    },
    [execute, formSchema?.safeParse],
  );

  return { state, execute: form.handleSubmit(executeForm), pending, form };
}
