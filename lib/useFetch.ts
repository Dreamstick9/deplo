import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

// loads data every time the screen comes into focus
export function useFetch<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fn());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, deps);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { data, error, loading, reload: load };
}
