import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { authAPI } from '@/utils/api';
import { Backdrop } from '../components/Backdrop';
import { ThemeToggle } from '../components/Navbar';

const readToken = () => {
  try {
    return localStorage.getItem('authToken') || localStorage.getItem('portfolioToken');
  } catch {
    return null;
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (readToken()) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    // Fetch the dashboard code while the user types, so signing in opens it instantly.
    import('./admin/Dashboard').catch(() => {});
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login(email.trim(), password);
      const token = response?.token || response?.data?.token;
      if (!token) throw new Error('Server did not return an authentication token');

      localStorage.setItem('authToken', token);
      localStorage.setItem('portfolioToken', token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      const message: string = err?.message || '';
      setError(
        /invalid credentials|unauthori[sz]ed|401/i.test(message)
          ? 'Invalid email or password. Please try again.'
          : message || 'Login failed. Please try again.'
      );
      setLoading(false);
    }
  };

  const trackCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState('CapsLock'));

  return (
    <div className="relative min-h-[100svh] flex flex-col text-foreground">
      <Backdrop />

      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 pt-5">
        <Link to="/" className="btn btn-ghost px-2 py-2 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to portfolio
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex-1 grid place-items-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-[420px]"
        >
          <div className="relative rounded-3xl p-px" style={{ backgroundImage: 'linear-gradient(140deg, var(--neon-cyan), transparent 40%, transparent 60%, var(--neon-violet))' }}>
            <div className="rounded-[calc(1.5rem-1px)] bg-surface p-7 sm:p-9 shadow-[0_30px_80px_-40px_var(--glow)]">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-12 h-12 rounded-2xl neon-border">
                  <ShieldCheck className="w-6 h-6 text-neon-cyan" />
                </span>
                <div>
                  <p className="hud-label">Secure access // admin</p>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground mt-0.5">Welcome back</h1>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Sign in to manage your portfolio content.</p>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-800 dark:text-red-200">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p>{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLogin} className="mt-7 space-y-5">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="username"
                      autoFocus
                      required
                      className="field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={trackCapsLock}
                      onKeyDown={trackCapsLock}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="field pl-10 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((shown) => !shown)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {capsLock && <p className="mt-2 font-mono text-xs text-amber-700 dark:text-amber-300">Caps Lock is on</p>}
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 group">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                      Authenticating…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="mt-6 text-center font-mono text-[11px] tracking-wider uppercase text-muted-foreground">
            Protected area · JWT-secured session
          </p>
        </motion.div>
      </main>
    </div>
  );
}
