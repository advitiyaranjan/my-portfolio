import { motion } from 'motion/react';

export function Cube3D({ delay = 0 }: { delay?: number }) {
  const faces = [
    { transform: 'rotateY(0deg) translateZ(100px)', color: 'from-blue-500 to-cyan-500' },
    { transform: 'rotateY(90deg) translateZ(100px)', color: 'from-purple-500 to-pink-500' },
    { transform: 'rotateY(180deg) translateZ(100px)', color: 'from-indigo-500 to-blue-500' },
    { transform: 'rotateY(270deg) translateZ(100px)', color: 'from-cyan-500 to-blue-500' },
    { transform: 'rotateX(90deg) translateZ(100px)', color: 'from-pink-500 to-purple-500' },
    { transform: 'rotateX(-90deg) translateZ(100px)', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <motion.div
      style={{
        width: '200px',
        height: '200px',
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
        rotateZ: [0, 180],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
        delay,
      }}
    >
      {faces.map((face, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid',
            borderImage: `linear-gradient(135deg, var(--color-start), var(--color-end)) 1`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            transform: face.transform,
            background: `linear-gradient(135deg, ${face.color === 'from-blue-500 to-cyan-500' ? '#3b82f6, #06b6d4' : face.color === 'from-purple-500 to-pink-500' ? '#a855f7, #ec4899' : face.color === 'from-indigo-500 to-blue-500' ? '#6366f1, #3b82f6' : face.color === 'from-cyan-500 to-blue-500' ? '#06b6d4, #3b82f6' : face.color === 'from-pink-500 to-purple-500' ? '#ec4899, #a855f7' : '#f97316, #ef4444'})`,
            opacity: 0.9,
          }}
        >
          {i === 0 ? '🧠' : i === 1 ? '💡' : i === 2 ? '🎯' : i === 3 ? '⚙️' : i === 4 ? '🚀' : '✨'}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function CubeGroup() {
  return (
    <div className="relative w-full h-80 flex items-center justify-center perspective">
      <style>{`
        .perspective {
          perspective: 1000px;
        }
      `}</style>
      
      {/* Main rotating cube */}
      <div className="absolute" style={{ perspective: '1000px' }}>
        <Cube3D delay={0} />
      </div>

      {/* Surrounding cubes */}
      <motion.div
        className="absolute"
        animate={{
          x: [0, 150, 0],
          y: [0, -100, 0],
          scale: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ perspective: '1000px' }}
      >
        <Cube3D delay={0.5} />
      </motion.div>

      <motion.div
        className="absolute"
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
          scale: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
        style={{ perspective: '1000px' }}
      >
        <Cube3D delay={1} />
      </motion.div>

      {/* Glow effect behind cubes */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
}
