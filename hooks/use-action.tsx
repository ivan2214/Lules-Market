"use client";

import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export interface ActionResult {
  errorMessage?: string;
  successMessage?: string;
  // biome-ignore lint/suspicious/noExplicitAny: necesario
  data?: any;
}

export interface ActionOptions<TState extends ActionResult> {
  onSuccess?: (state: TState) => void;
  onError?: (state: TState) => void;
  redirectTo?: string;
  showToasts?: boolean;
}

export function useAction<TInput, TState extends ActionResult>(
  action: (prevState: TState, input: TInput) => Promise<TState>,
  initialState: Awaited<TState>,
  options: ActionOptions<TState> = {},
) {
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

  const executeStable = useCallback(execute, []);

  return { state, execute: executeStable, pending };
}
