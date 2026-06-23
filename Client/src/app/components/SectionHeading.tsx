import { motion } from 'motion/react';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
}

export function SectionHeading({ index, eyebrow, title, highlight, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-12 sm:mb-16 max-w-3xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="hud-label">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-neon-cyan to-transparent" />
        <span className="hud-label text-muted-foreground">{eyebrow}</span>
      </div>
      <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
        {title} {highlight && <span className="text-gradient">{highlight}</span>}
      </h2>
      {subtitle && <p className="mt-4 text-base sm:text-lg text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}
