/** Public collections are imported from the build-time snapshot so SSR and hydration agree. */
export function useApiList<T = any>(items: T[]) {
  return { items, loading: false, error: false };
}
