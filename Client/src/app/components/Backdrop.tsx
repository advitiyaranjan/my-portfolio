/**
 * A single flat background layer keeps the portfolio crisp and distraction free.
 */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 backdrop-grid" />
    </div>
  );
}
