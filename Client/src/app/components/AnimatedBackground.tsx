import { motion } from 'motion/react';

export function AnimatedBackground() {
  return (
    <>
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10 dark:opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(0deg, rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'drift 20s linear infinite',
        }}
      />

      {/* Subtle 3D Cubes Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <motion.div
          style={{
            width: '300px',
            height: '300px',
            position: 'absolute',
            transformStyle: 'preserve-3d',
            left: '10%',
            top: '20%',
          }}
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
            rotateZ: [0, 180],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                border: '1px solid rgba(139,92,246,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                transformStyle: 'preserve-3d',
                transform: [
                  'rotateY(0deg) translateZ(150px)',
                  'rotateY(90deg) translateZ(150px)',
                  'rotateY(180deg) translateZ(150px)',
                  'rotateY(270deg) translateZ(150px)',
                  'rotateX(90deg) translateZ(150px)',
                  'rotateX(-90deg) translateZ(150px)',
                ][i],
              }}
            >
              {['🧠', '💡', '🎯', '⚙️', '🚀', '✨'][i]}
            </div>
          ))}
        </motion.div>

        <motion.div
          style={{
            width: '250px',
            height: '250px',
            position: 'absolute',
            transformStyle: 'preserve-3d',
            right: '15%',
            bottom: '15%',
          }}
          animate={{
            rotateX: [360, 0],
            rotateY: [360, 0],
            rotateZ: [180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
            delay: 2,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '250px',
                height: '250px',
                border: '1px solid rgba(139,92,246,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                transformStyle: 'preserve-3d',
                transform: [
                  'rotateY(0deg) translateZ(125px)',
                  'rotateY(90deg) translateZ(125px)',
                  'rotateY(180deg) translateZ(125px)',
                  'rotateY(270deg) translateZ(125px)',
                  'rotateX(90deg) translateZ(125px)',
                  'rotateX(-90deg) translateZ(125px)',
                ][i],
              }}
            >
              {['🔧', '🎨', '💻', '📊', '🌟', '⚡'][i]}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Animated Blur Orbs */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-10 -left-40 w-96 h-96 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-full blur-3xl opacity-30"
      />

      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 80, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
          delay: 2,
        }}
        className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-full blur-3xl opacity-25"
      />

      <motion.div
        animate={{
          x: [0, 60, -80, 0],
          y: [0, -80, 60, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
          delay: 4,
        }}
        className="absolute bottom-10 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full blur-3xl opacity-20"
      />

      <motion.div
        animate={{
          x: [0, -60, 80, 0],
          y: [0, 60, -80, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'linear',
          delay: 6,
        }}
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-25"
      />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50 pointer-events-none" />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-40"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <style>{`
        @keyframes drift {
          0% { transform: translate(0, 0); }
          33% { transform: translate(20px, -20px); }
          66% { transform: translate(-10px, 10px); }
          100% { transform: translate(0, 0); }
        }
        
        .bg-radial-gradient {
          background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%);
        }
      `}</style>
    </>
  );
}
