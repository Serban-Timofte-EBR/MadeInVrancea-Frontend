/* eslint-disable react-hooks/set-state-in-effect -- this data-loading hook intentionally manages loading/error/data around an async effect */
/* eslint-disable react-hooks/refs -- the loader ref is kept current on purpose without re-subscribing the effect */ import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Runs an async loader whenever `deps` change, exposing loading/error state and
 * a manual `reload`. The loader receives an AbortSignal so stale requests are
 * cancelled on unmount or dependency change.
 */
export function useAsync<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
): AsyncState<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    loaderRef
      .current(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setError(err instanceof Error ? err.message : "A apărut o eroare.");
        setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { data, loading, error, reload };
}
