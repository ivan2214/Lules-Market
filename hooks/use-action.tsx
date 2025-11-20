/** biome-ignore-all lint/suspicious/noExplicitAny: <necesario> */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
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

const EMPTY_STATE = {
  errorMessage: undefined,
  successMessage: undefined,
  data: undefined,
} as const;

export function useAction<
  TInput extends FieldValues,
  TState extends ActionResult,
>({
  action,
  initialState = EMPTY_STATE as Awaited<TState>,
  options = {},
  defaultValues,
  formSchema,
}: {
  action: (prevState: TState, input: TInput) => Promise<TState>;
  initialState?: Awaited<TState>;
  formSchema?: ZodType<TInput, any, any>;
  defaultValues?: DefaultValues<TInput>;
  options?: ActionOptions<TState>;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [state, execute, pending] = useActionState<TState, TInput>(
    action,
    initialState,
  );

  const optionsRef = useRef(options);
  const routerRef = useRef(router);
  const lastStateRef = useRef<TState>(state);
  const firstRender = useRef(true);
  const prevPathRef = useRef(pathname);

  /* ---------------------------------------------------------
   * Sync mutable refs (router + options)
   * --------------------------------------------------------- */
  useEffect(() => {
    optionsRef.current = options;
    routerRef.current = router;
  });

  /* ---------------------------------------------------------
   * Reset state when navigating to another page
   * (evita toasts duplicados + estado sucio)
   * --------------------------------------------------------- */
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      // reset state al volver a la página
      startTransition(() => {
        execute(initialState as TInput);
      });
    }
  }, [pathname, initialState, execute]);

  /* ---------------------------------------------------------
   * Handle side effects only when state changes *realmente*
   * --------------------------------------------------------- */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      lastStateRef.current = state;
      return;
    }

    // evitar dobles disparos por renders fantasma
    if (JSON.stringify(lastStateRef.current) === JSON.stringify(state)) return;
    lastStateRef.current = state;

    const {
      onSuccess,
      onError,
      redirectTo,
      showToasts = true,
    } = optionsRef.current;

    if (showToasts) {
      if (state.errorMessage) toast.error(state.errorMessage);
      if (state.successMessage) toast.success(state.successMessage);
    }

    if (state.successMessage) {
      if (redirectTo) routerRef.current.push(redirectTo);
      onSuccess?.(state);
    }

    if (state.errorMessage) {
      onError?.(state);
    }
  }, [state]);

  /* ---------------------------------------------------------
   * Resolver de Zod
   * --------------------------------------------------------- */
  const resolver = formSchema
    ? (zodResolver(formSchema as any) as Resolver<TInput>)
    : undefined;

  const form = useForm<TInput>({
    resolver,
    defaultValues,
  }) as UseFormReturn<TInput>;

  /* ---------------------------------------------------------
   * Ejecutar action con validación Zod
   * --------------------------------------------------------- */
  const executeForm = useCallback(
    (input: TInput) => {
      const parsed = formSchema?.safeParse(input);

      if (parsed && !parsed.success) {
        toast.error(parsed.error.message);
        return;
      }

      startTransition(() => execute(input));
    },
    [execute, formSchema],
  );

  return {
    state,
    pending,
    form,
    executeRaw: executeForm,
    execute: form.handleSubmit(executeForm),
  };
}
