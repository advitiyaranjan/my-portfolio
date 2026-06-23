import { useEffect, useState } from 'react';

/** Loads a list endpoint (`{ data: [...] }`) once on mount. */
export function useApiList<T = any>(load: () => Promise<any>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    load()
      .then((response) => {
        const data = response?.data ?? response;
        if (active) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // `load` is a stable API function reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error };
}
