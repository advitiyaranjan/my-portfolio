import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Code2, Check, AlertCircle, ArrowUpRight } from 'lucide-react';
import { contactAPI } from '@/utils/api';
import { usePortfolio } from './hooks/usePortfolio';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { externalUrl } from '../lib/url';

const MIN_MESSAGE_LENGTH = 10;

export function Contact() {
  const { portfolio } = usePortfolio();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await contactAPI.submitForm({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const messageTooShort = formData.message.trim().length < MIN_MESSAGE_LENGTH;
  const canSubmit = !isSubmitting && !messageTooShort && formData.name.trim() && formData.email.trim();

  const contactInfo = [
    portfolio.email && { Icon: Mail, label: 'Email', value: portfolio.email, href: `mailto:${portfolio.email}` },
    portfolio.phone && { Icon: Phone, label: 'Phone', value: portfolio.phone, href: `tel:${portfolio.phone.replace(/[^\d+]/g, '')}` },
    portfolio.location && { Icon: MapPin, label: 'Location', value: portfolio.location, href: null },
  ].filter(Boolean) as { Icon: typeof Mail; label: string; value: string; href: string | null }[];

  const { socialLinks } = portfolio;
  const socials = [
    { Icon: Github, href: socialLinks.github, label: 'GitHub' },
    { Icon: Linkedin, href: socialLinks.linkedin, label: 'LinkedIn' },
    { Icon: Code2, href: socialLinks.leetcode, label: 'LeetCode' },
    { Icon: Twitter, href: socialLinks.twitter, label: 'X (Twitter)' },
  ].filter((social) => social.href);

  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          index="07"
          eyebrow="Contact"
          title="Let's build"
          highlight="something together"
          subtitle="Have a role, project or idea in mind? My inbox is open."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map(({ Icon, label, value, href }, index) => {
              const body = (
                <>
                  <span className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-surface-2 border border-border text-neon-cyan">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
                    <span className="block font-medium text-foreground break-words">{value}</span>
                  </span>
                  {href && <ArrowUpRight className="ml-auto w-4 h-4 shrink-0 text-muted-foreground group-hover:text-neon-violet transition-colors" />}
                </>
              );
              return (
                <Reveal key={label} delay={index * 0.06}>
                  {href ? (
                    <a href={href} className="panel panel-interactive group flex items-center gap-4 p-5">
                      {body}
                    </a>
                  ) : (
                    <div className="panel flex items-center gap-4 p-5">{body}</div>
                  )}
                </Reveal>
              );
            })}

            <Reveal delay={0.2}>
              <div className="panel hud-frame p-6">
                <p className="hud-label">Status</p>
                <p className="mt-2 font-display text-xl font-semibold text-foreground">Open to opportunities</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Exploring roles in software engineering, AI/ML and product. Happy to talk internships, full-time roles and collaborations.
                </p>
                {socials.length > 0 && (
                  <div className="mt-5 flex gap-2.5">
                    {socials.map(({ Icon, href, label }) => (
                      <a key={label} href={externalUrl(href)} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={label} title={label}>
                        <Icon className="w-[18px] h-[18px]" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="panel p-6 sm:p-8 space-y-5">
              <p className="hud-label">// new_message</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="field"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="field"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="flex justify-between text-sm font-medium text-foreground mb-2">
                  <span>Message</span>
                  <span className={`font-mono text-xs ${messageTooShort ? 'text-muted-foreground' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {formData.message.trim().length}/{MIN_MESSAGE_LENGTH}+
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  minLength={MIN_MESSAGE_LENGTH}
                  className="field resize-none"
                  placeholder="Tell me about the role, project or opportunity…"
                />
              </div>

              <button type="submit" disabled={!canSubmit} className="btn btn-primary w-full py-4">
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send message
                  </>
                )}
              </button>

              <AnimatePresence>
                {submitStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="status"
                    className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                      submitStatus === 'success'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                        : 'border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-200'
                    }`}
                  >
                    {submitStatus === 'success' ? (
                      <>
                        <Check className="w-5 h-5 shrink-0" />
                        <div>
                          <p className="font-semibold">Message sent. Thank you!</p>
                          <p className="mt-0.5 opacity-90">I'll get back to you soon.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div>
                          <p className="font-semibold">Couldn't send your message</p>
                          <p className="mt-0.5 opacity-90">
                            Check your name, a valid email and a message of at least {MIN_MESSAGE_LENGTH} characters, then try again.
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
