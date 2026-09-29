/**
 * One fixed background layer for the whole page: a masked grid plus three slowly drifting colour fields.
 * It replaces the per-section animated backgrounds (blurred orbs, 3D cubes, particles) that were
 * mounted seven times over and caused most of the scroll lag.
 */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />
      <div className="absolute inset-0 backdrop-grid" />
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ backgroundImage: 'linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-violet), transparent)' }}
      />
    </div>
  );
}
