import { useEffect, useRef } from 'react';

/**
 * Interactive "quantum grid" effects for the portfolio page.
 *
 * - The background grid lights up and bends toward the cursor (gravity lens).
 * - Clicking sends a shockwave through the grid plus sparks, a ring and a spinning hexagon.
 * - Small data packets travel along the grid lines.
 * - A HUD reticle replaces the mouse cursor and grows over interactive elements.
 * - Cards get a cursor-following spotlight; elements with [data-magnetic] lean toward the cursor.
 *
 * Everything is drawn on two canvases (one behind the content, one above it) with plain 2D strokes,
 * no blur filters, so it stays cheap. Touch devices only get the tap shockwave; users who prefer
 * reduced motion get nothing.
 */

const GRID = 56; // matches .backdrop-grid background-size so the effect lines up with the visible grid
const LENS_RADIUS = 220;
const RIPPLE_SPEED = 950; // px per second
const RIPPLE_LIFE = 1.15; // seconds
const RIPPLE_BAND = 48;
const PACKETS = 6;
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary, [data-magnetic]';
const TEXT_FIELDS = 'input, textarea, [contenteditable="true"]';

interface Ripple { x: number; y: number; t: number }
interface Burst { x: number; y: number; t: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string }
interface Packet { x: number; y: number; dx: number; dy: number; speed: number; travelled: number; color: 0 | 1; trail: { x: number; y: number }[] }

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

export function FxLayer() {
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const field = fieldRef.current;
    const overlay = overlayRef.current;
    const fctx = field?.getContext('2d');
    const octx = overlay?.getContext('2d');
    if (!field || !overlay || !fctx || !octx) return;

    const root = document.documentElement;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (finePointer) root.classList.add('fx-cursor', 'fx-spotlight');

    /* ---------- sizing & theme ---------- */
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0;
    let H = 0;
    let cols = 0;
    let rows = 0;
    let intensity = new Float32Array(0);
    let offX = new Float32Array(0);
    let offY = new Float32Array(0);

    const colors = { cyan: '#22d3ee', violet: '#a78bfa', pink: '#f472b6', dark: true };
    const readColors = () => {
      const cs = getComputedStyle(root);
      colors.cyan = cs.getPropertyValue('--neon-cyan').trim() || colors.cyan;
      colors.violet = cs.getPropertyValue('--neon-violet').trim() || colors.violet;
      colors.pink = cs.getPropertyValue('--neon-pink').trim() || colors.pink;
      colors.dark = root.classList.contains('dark');
    };

    const resize = () => {
      W = root.clientWidth;
      H = window.innerHeight;
      for (const canvas of [field, overlay]) {
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
      }
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / GRID) + 1;
      rows = Math.ceil(H / GRID) + 1;
      intensity = new Float32Array(cols * rows);
      offX = new Float32Array(cols * rows);
      offY = new Float32Array(cols * rows);
    };

    /* ---------- state ---------- */
    const pointer = { x: -9999, y: -9999, active: false, down: false, onText: false, hovering: false };
    const lens = { x: -9999, y: -9999 };
    const ring = { x: -9999, y: -9999, r: 15, rot: 0 };
    const trail: { x: number; y: number }[] = [];
    let ripples: Ripple[] = [];
    let bursts: Burst[] = [];
    let sparks: Spark[] = [];

    const spawnPacket = (): Packet => {
      const horizontal = Math.random() < 0.5;
      const dir = Math.random() < 0.5 ? 1 : -1;
      return {
        x: Math.floor(Math.random() * cols) * GRID,
        y: Math.floor(Math.random() * rows) * GRID,
        dx: horizontal ? dir : 0,
        dy: horizontal ? 0 : dir,
        speed: 90 + Math.random() * 90,
        travelled: 0,
        color: Math.random() < 0.5 ? 0 : 1,
        trail: [],
      };
    };
    let packets: Packet[] = [];

    /* ---------- interaction helpers ---------- */
    let lastPanel: HTMLElement | null = null;
    let lastMagnet: HTMLElement | null = null;

    const updateSpotlight = (target: Element | null, x: number, y: number) => {
      const panel = (target?.closest('.panel') as HTMLElement | null) ?? null;
      if (panel !== lastPanel) {
        lastPanel?.style.removeProperty('--mx');
        lastPanel?.style.removeProperty('--my');
        lastPanel = panel;
      }
      if (panel) {
        const r = panel.getBoundingClientRect();
        panel.style.setProperty('--mx', `${x - r.left}px`);
        panel.style.setProperty('--my', `${y - r.top}px`);
      }
    };

    const updateMagnet = (target: Element | null, x: number, y: number) => {
      const magnet = (target?.closest('[data-magnetic]') as HTMLElement | null) ?? null;
      if (magnet !== lastMagnet) {
        if (lastMagnet) lastMagnet.style.translate = '';
        lastMagnet = magnet;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = Math.max(-10, Math.min(10, (x - (r.left + r.width / 2)) * 0.28));
        const dy = Math.max(-8, Math.min(8, (y - (r.top + r.height / 2)) * 0.35));
        magnet.style.translate = `${dx}px ${dy}px`;
      }
    };

    const burstAt = (x: number, y: number) => {
      const now = performance.now() / 1000;
      ripples.push({ x, y, t: now });
      bursts.push({ x, y, t: now });
      const palette = [colors.cyan, colors.violet, colors.pink];
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.5;
        const speed = 180 + Math.random() * 380;
        const max = 0.45 + Math.random() * 0.4;
        sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: max, max, color: palette[i % 3] });
      }
      if (ripples.length > 6) ripples = ripples.slice(-6);
      kick();
    };

    /* ---------- events ---------- */
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (!pointer.active) {
        lens.x = ring.x = e.clientX;
        lens.y = ring.y = e.clientY;
      }
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      const target = e.target instanceof Element ? e.target : null;
      pointer.hovering = Boolean(target?.closest(INTERACTIVE));
      pointer.onText = Boolean(target?.closest(TEXT_FIELDS));
      updateSpotlight(target, e.clientX, e.clientY);
      updateMagnet(target, e.clientX, e.clientY);
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pointer.down = true;
      burstAt(e.clientX, e.clientY);
    };
    const onUp = () => {
      pointer.down = false;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      pointer.active = false;
      updateSpotlight(null, 0, 0);
      updateMagnet(null, 0, 0);
      kick();
    };
    const onResize = () => {
      resize();
      kick();
    };

    /* ---------- drawing ---------- */
    const drawField = (now: number) => {
      fctx.clearRect(0, 0, W, H);
      intensity.fill(0);
      offX.fill(0);
      offY.fill(0);

      if (pointer.active) {
        const i0 = Math.max(0, Math.floor((lens.x - LENS_RADIUS) / GRID));
        const i1 = Math.min(cols - 1, Math.ceil((lens.x + LENS_RADIUS) / GRID));
        const j0 = Math.max(0, Math.floor((lens.y - LENS_RADIUS) / GRID));
        const j1 = Math.min(rows - 1, Math.ceil((lens.y + LENS_RADIUS) / GRID));
        for (let j = j0; j <= j1; j++) {
          for (let i = i0; i <= i1; i++) {
            const dx = i * GRID - lens.x;
            const dy = j * GRID - lens.y;
            const d = Math.hypot(dx, dy);
            if (d >= LENS_RADIUS) continue;
            const k = 1 - d / LENS_RADIUS;
            const k2 = k * k;
            const n = j * cols + i;
            intensity[n] += k2;
            if (d > 0.001) {
              offX[n] -= (dx / d) * k2 * 9;
              offY[n] -= (dy / d) * k2 * 9;
            }
          }
        }
      }

      if (ripples.length) {
        for (const rp of ripples) {
          const age = now - rp.t;
          const radius = age * RIPPLE_SPEED;
          const fade = 1 - age / RIPPLE_LIFE;
          for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
              const dx = i * GRID - rp.x;
              const dy = j * GRID - rp.y;
              const d = Math.hypot(dx, dy);
              const band = Math.abs(d - radius);
              if (band >= RIPPLE_BAND) continue;
              const k = (1 - band / RIPPLE_BAND) * fade;
              const n = j * cols + i;
              intensity[n] += k * 0.95;
              if (d > 0.001) {
                offX[n] += (dx / d) * k * 12;
                offY[n] += (dy / d) * k * 12;
              }
            }
          }
        }
      }

      // Packets energise the node they are passing.
      for (const p of packets) {
        const i = Math.round(p.x / GRID);
        const j = Math.round(p.y / GRID);
        if (i >= 0 && i < cols && j >= 0 && j < rows) intensity[j * cols + i] += 0.3;
      }

      // Grid segments, bucketed by brightness so each bucket is a single stroke call.
      const BUCKETS = 8;
      const paths = Array.from({ length: BUCKETS }, () => new Path2D());
      const used = new Array(BUCKETS).fill(false);
      const px = (n: number, i: number) => i * GRID + offX[n];
      const py = (n: number, j: number) => j * GRID + offY[n];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const n = j * cols + i;
          const a = intensity[n];
          if (i + 1 < cols) {
            const m = n + 1;
            const v = (a + intensity[m]) / 2;
            if (v > 0.02) {
              const b = Math.min(BUCKETS - 1, Math.floor(Math.min(1, v) * BUCKETS));
              paths[b].moveTo(px(n, i), py(n, j));
              paths[b].lineTo(px(m, i + 1), py(m, j));
              used[b] = true;
            }
          }
          if (j + 1 < rows) {
            const m = n + cols;
            const v = (a + intensity[m]) / 2;
            if (v > 0.02) {
              const b = Math.min(BUCKETS - 1, Math.floor(Math.min(1, v) * BUCKETS));
              paths[b].moveTo(px(n, i), py(n, j));
              paths[b].lineTo(px(m, i), py(m, j + 1));
              used[b] = true;
            }
          }
        }
      }
      const lineAlpha = colors.dark ? 0.85 : 0.6;
      fctx.lineWidth = 1;
      fctx.strokeStyle = colors.cyan;
      for (let b = 0; b < BUCKETS; b++) {
        if (!used[b]) continue;
        fctx.globalAlpha = ((b + 1) / BUCKETS) * lineAlpha;
        fctx.stroke(paths[b]);
      }

      // Nodes
      fctx.fillStyle = colors.violet;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const n = j * cols + i;
          const v = intensity[n];
          if (v < 0.08) continue;
          const s = 1 + Math.min(1, v) * 2.2;
          fctx.globalAlpha = Math.min(1, v) * (colors.dark ? 1 : 0.8);
          fctx.fillRect(px(n, i) - s / 2, py(n, j) - s / 2, s, s);
        }
      }

      // Packets: glowing head with a fading tail that follows the grid.
      fctx.lineCap = 'round';
      for (const p of packets) {
        const color = p.color === 0 ? colors.cyan : colors.violet;
        const t = p.trail;
        for (let k = 1; k < t.length; k++) {
          fctx.globalAlpha = (k / t.length) * (colors.dark ? 0.8 : 0.55);
          fctx.strokeStyle = color;
          fctx.lineWidth = 1.6;
          fctx.beginPath();
          fctx.moveTo(t[k - 1].x, t[k - 1].y);
          fctx.lineTo(t[k].x, t[k].y);
          fctx.stroke();
        }
        fctx.globalAlpha = colors.dark ? 1 : 0.8;
        fctx.fillStyle = color;
        fctx.beginPath();
        fctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        fctx.fill();
      }
      fctx.globalAlpha = 1;
    };

    const drawOverlay = (now: number, dt: number) => {
      octx.clearRect(0, 0, W, H);
      octx.globalCompositeOperation = colors.dark ? 'lighter' : 'source-over';
      octx.lineCap = 'round';

      // Click bursts: expanding ring + rotating hexagon
      for (const b of bursts) {
        const age = now - b.t;
        const ringT = age / 0.5;
        if (ringT < 1) {
          octx.globalAlpha = 1 - ringT;
          octx.strokeStyle = colors.cyan;
          octx.lineWidth = 2;
          octx.beginPath();
          octx.arc(b.x, b.y, easeOut(ringT) * 70, 0, Math.PI * 2);
          octx.stroke();
        }
        const hexT = age / 0.65;
        if (hexT < 1) {
          const r = 8 + easeOut(hexT) * 44;
          const rot = age * 2.2;
          octx.globalAlpha = 1 - hexT;
          octx.strokeStyle = colors.violet;
          octx.lineWidth = 1.5;
          octx.beginPath();
          for (let k = 0; k <= 6; k++) {
            const a = rot + (Math.PI / 3) * k;
            const x = b.x + Math.cos(a) * r;
            const y = b.y + Math.sin(a) * r;
            if (k === 0) octx.moveTo(x, y);
            else octx.lineTo(x, y);
          }
          octx.stroke();
        }
      }

      // Sparks
      const drag = Math.pow(0.9, dt * 60);
      for (const s of sparks) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= drag;
        s.vy *= drag;
        s.life -= dt;
        const a = Math.max(0, s.life / s.max);
        octx.globalAlpha = a;
        octx.strokeStyle = s.color;
        octx.lineWidth = 1.8;
        octx.beginPath();
        octx.moveTo(s.x, s.y);
        octx.lineTo(s.x - s.vx * 0.035, s.y - s.vy * 0.035);
        octx.stroke();
      }

      if (finePointer && pointer.active) {
        // Comet trail
        trail.push({ x: pointer.x, y: pointer.y });
        if (trail.length > 16) trail.shift();
        for (let k = 1; k < trail.length; k++) {
          const f = k / trail.length;
          octx.globalAlpha = f * 0.5;
          octx.strokeStyle = k % 2 ? colors.violet : colors.cyan;
          octx.lineWidth = f * 3;
          octx.beginPath();
          octx.moveTo(trail[k - 1].x, trail[k - 1].y);
          octx.lineTo(trail[k].x, trail[k].y);
          octx.stroke();
        }

        // HUD reticle
        const follow = 1 - Math.pow(1 - 0.22, dt * 60);
        ring.x += (pointer.x - ring.x) * follow;
        ring.y += (pointer.y - ring.y) * follow;
        const targetR = pointer.down ? 9 : pointer.hovering ? 24 : 15;
        ring.r += (targetR - ring.r) * follow;
        ring.rot += dt * (pointer.hovering ? 2.6 : 0.7);

        octx.globalCompositeOperation = 'source-over';
        if (pointer.hovering) {
          octx.globalAlpha = colors.dark ? 0.12 : 0.1;
          octx.fillStyle = colors.violet;
          octx.beginPath();
          octx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
          octx.fill();
        }
        octx.globalAlpha = 0.95;
        octx.strokeStyle = colors.violet;
        octx.lineWidth = 1.4;
        // Ring drawn as four arcs with gaps, rotating
        for (let k = 0; k < 4; k++) {
          const a = ring.rot + (Math.PI / 2) * k;
          octx.beginPath();
          octx.arc(ring.x, ring.y, ring.r, a + 0.22, a + Math.PI / 2 - 0.22);
          octx.stroke();
        }
        octx.strokeStyle = colors.cyan;
        octx.lineWidth = 1.6;
        for (let k = 0; k < 4; k++) {
          const a = -ring.rot * 0.6 + (Math.PI / 2) * k + Math.PI / 4;
          octx.beginPath();
          octx.moveTo(ring.x + Math.cos(a) * (ring.r + 3), ring.y + Math.sin(a) * (ring.r + 3));
          octx.lineTo(ring.x + Math.cos(a) * (ring.r + 8), ring.y + Math.sin(a) * (ring.r + 8));
          octx.stroke();
        }
        if (!pointer.onText) {
          octx.globalAlpha = 1;
          octx.fillStyle = colors.cyan;
          octx.beginPath();
          octx.arc(pointer.x, pointer.y, 2.6, 0, Math.PI * 2);
          octx.fill();
        }
      } else {
        trail.length = 0;
      }
      octx.globalAlpha = 1;
      octx.globalCompositeOperation = 'source-over';
    };

    const stepPackets = (dt: number) => {
      if (!finePointer) {
        packets = [];
        return;
      }
      while (packets.length < PACKETS) packets.push(spawnPacket());
      for (let idx = 0; idx < packets.length; idx++) {
        const p = packets[idx];
        const step = p.speed * dt;
        p.x += p.dx * step;
        p.y += p.dy * step;
        p.travelled += step;
        if (p.travelled >= GRID) {
          // Snap to the node and maybe turn 90 degrees.
          p.travelled = 0;
          p.x = Math.round(p.x / GRID) * GRID;
          p.y = Math.round(p.y / GRID) * GRID;
          if (Math.random() < 0.35) {
            const turn = Math.random() < 0.5 ? 1 : -1;
            [p.dx, p.dy] = [-p.dy * turn, p.dx * turn];
          }
        }
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 22) p.trail.shift();
        if (p.x < -GRID || p.y < -GRID || p.x > W + GRID || p.y > H + GRID) packets[idx] = spawnPacket();
      }
    };

    /* ---------- loop ---------- */
    let raf = 0;
    let last = performance.now();
    function frame(ts: number) {
      raf = 0;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      const now = ts / 1000;

      ripples = ripples.filter((r) => now - r.t < RIPPLE_LIFE);
      bursts = bursts.filter((b) => now - b.t < 0.7);
      sparks = sparks.filter((s) => s.life > 0);

      const follow = 1 - Math.pow(1 - 0.2, dt * 60);
      lens.x += (pointer.x - lens.x) * follow;
      lens.y += (pointer.y - lens.y) * follow;

      stepPackets(dt);
      drawField(now);
      drawOverlay(now, dt);

      // Desktop keeps a continuous (cheap) loop for the packets; touch only animates while effects are alive.
      if (finePointer || ripples.length || bursts.length || sparks.length) raf = requestAnimationFrame(frame);
    }
    function kick() {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    readColors();
    resize();
    const themeObserver = new MutationObserver(() => {
      readColors();
      kick();
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerout', onLeave, { passive: true });
    window.addEventListener('resize', onResize);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerout', onLeave);
      window.removeEventListener('resize', onResize);
      updateSpotlight(null, 0, 0);
      updateMagnet(null, 0, 0);
      root.classList.remove('fx-cursor', 'fx-spotlight');
    };
  }, []);

  return (
    <>
      <canvas ref={fieldRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] w-full h-full" />
      <canvas ref={overlayRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] w-full h-full" />
    </>
  );
}
