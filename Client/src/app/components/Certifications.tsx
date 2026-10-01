import { BadgeCheck, ArrowUpRight } from 'lucide-react';
import { certificationAPI } from '@/utils/api';
import { useApiList } from './hooks/useApiList';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { externalUrl } from '../lib/url';

interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  platform?: string;
  issueDate?: string;
  credentialId?: string;
  verifyUrl?: string;
  description?: string;
  modules?: string[];
}

const formatDate = (date?: string) => {
  if (!date) return '';
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const monogram = (issuer: string) =>
  issuer
    .replace(/[^A-Za-z. ]/g, '')
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

export function Certifications() {
  const { items: certifications, loading } = useApiList<Certification>(certificationAPI.getAllCertifications);

  return (
    <section id="certifications" className="relative py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          index="06"
          eyebrow="Certifications"
          title="Verified"
          highlight="credentials"
          subtitle={
            certifications.length
              ? `${certifications.length} certifications from ${new Set(certifications.map((c) => c.issuer)).size} issuers, each linked to its verification page.`
              : undefined
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="panel h-64 animate-pulse" />
            ))}
          </div>
        ) : certifications.length === 0 ? (
          <p className="text-muted-foreground">Certifications will appear here soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map((cert, index) => (
              <Reveal key={cert._id || cert.title} delay={(index % 3) * 0.06} className="h-full">
                <article className="panel panel-interactive h-full flex flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center w-11 h-11 rounded-xl neon-border font-display text-sm font-bold">
                      <span className="text-gradient">{monogram(cert.issuer)}</span>
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{cert.issuer}</p>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground truncate">
                        {[cert.platform !== cert.issuer ? cert.platform : null, formatDate(cert.issueDate)].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-5 font-display text-lg font-semibold leading-snug tracking-tight text-foreground">{cert.title}</h3>
                  {cert.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{cert.description}</p>
                  )}

                  {cert.modules && cert.modules.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {cert.modules.slice(0, 4).map((module) => (
                        <li key={module} className="chip text-[11px]">
                          {module}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex-1" />
                  <div className="mt-5 pt-4 flex items-center justify-between gap-3 border-t border-border">
                    <span className="flex items-center gap-1.5 min-w-0 font-mono text-[11px] text-muted-foreground">
                      <BadgeCheck className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                      <span className="truncate">{cert.credentialId ? `ID ${cert.credentialId}` : 'Issued certificate'}</span>
                    </span>
                    {cert.verifyUrl && (
                      <a
                        href={externalUrl(cert.verifyUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-neon-violet hover:underline underline-offset-4"
                        aria-label={`Verify ${cert.title}`}
                      >
                        Verify
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
