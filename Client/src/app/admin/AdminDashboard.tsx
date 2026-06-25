import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  LayoutDashboard, User, FileText, FolderGit2, Briefcase, Trophy, BadgeCheck, Layers, Inbox,
  LogOut, ArrowUpRight, Plus, Pencil, Trash2, X, Check, AlertCircle, Eye, Mail, Save, Loader2,
} from 'lucide-react';
import {
  portfolioAPI, messagesAPI, projectAPI, experienceAPI, skillAPI, achievementAPI, certificationAPI,
} from '@/utils/api';
import { ThemeToggle } from '../components/Navbar';
import { accentFor } from '../components/Projects';

/* ------------------------------------------------------------------ */
/* Shared UI                                                           */
/* ------------------------------------------------------------------ */

type ToastKind = 'success' | 'error';
interface Toast { id: number; kind: ToastKind; text: string }

let pushToast: (kind: ToastKind, text: string) => void = () => {};
const notify = {
  success: (text: string) => pushToast('success', text),
  error: (text: string) => pushToast('error', text),
};
const errorText = (err: unknown) => (err instanceof Error && err.message ? err.message : 'Something went wrong');

function Toasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    pushToast = (kind, text) => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, kind, text }]);
      setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3500);
    };
    return () => { pushToast = () => {}; };
  }, []);
  return (
    <div className="fixed top-20 right-5 z-[60] flex flex-col gap-2 w-[min(360px,calc(100vw-2.5rem))]" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20 }}
            className={`panel flex items-start gap-3 p-3.5 text-sm ${t.kind === 'success' ? 'border-emerald-500/40' : 'border-red-500/40'}`}
          >
            {t.kind === 'success'
              ? <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
              : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />}
            <span className="text-foreground">{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1.5 text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="flex items-baseline justify-between gap-2 mb-1.5">
      <span className="text-sm font-medium text-foreground">{children}</span>
      {hint && <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{hint}</span>}
    </span>
  );
}

function Spinner() {
  return <Loader2 className="w-4 h-4 animate-spin" />;
}

function EmptyState({ text }: { text: string }) {
  return <div className="panel p-10 text-center text-muted-foreground">{text}</div>;
}

/* ------------------------------------------------------------------ */
/* Generic collection manager                                          */
/* ------------------------------------------------------------------ */

const GRADIENTS = [
  { value: 'from-blue-500 to-cyan-500', label: 'Blue / Cyan' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple / Pink' },
  { value: 'from-green-500 to-emerald-500', label: 'Green / Emerald' },
  { value: 'from-orange-500 to-red-500', label: 'Orange / Red' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow / Orange' },
  { value: 'from-indigo-500 to-blue-500', label: 'Indigo / Blue' },
  { value: 'from-red-500 to-rose-500', label: 'Red / Rose' },
];

type FieldType = 'text' | 'textarea' | 'date' | 'number' | 'checkbox' | 'select' | 'list' | 'lines' | 'link';

interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  full?: boolean;
  disabledWhen?: (values: Record<string, any>) => boolean;
}

interface CollectionConfig {
  title: string;
  subtitle: string;
  singular: string;
  api: {
    list: () => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    remove: (id: string) => Promise<any>;
  };
  fields: FieldDef[];
  defaults: Record<string, any>;
  sort?: (a: any, b: any) => number;
  /** Convert a stored record to form values (optional). */
  toForm?: (record: any) => Record<string, any>;
  /** Convert form values into the payload sent to the API (optional). */
  toPayload?: (values: Record<string, any>, original?: any) => Record<string, any>;
  renderCard: (record: any) => React.ReactNode;
  columns?: 1 | 2;
}

// Stored value -> editable string for list/lines fields, and back.
function recordToForm(fields: FieldDef[], record: any, defaults: Record<string, any>) {
  const values: Record<string, any> = { ...defaults };
  for (const f of fields) {
    const v = record?.[f.name];
    if (f.type === 'list') values[f.name] = Array.isArray(v) ? v.join(', ') : v || '';
    else if (f.type === 'lines') values[f.name] = Array.isArray(v) ? v.join('\n') : v || '';
    else if (f.type === 'date') values[f.name] = typeof v === 'string' ? v.slice(0, 10) : '';
    else if (f.type === 'checkbox') values[f.name] = Boolean(v);
    else if (v !== undefined && v !== null) values[f.name] = v;
  }
  return values;
}

function formToPayload(fields: FieldDef[], values: Record<string, any>) {
  const payload: Record<string, any> = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.type === 'list') payload[f.name] = String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
    else if (f.type === 'lines') payload[f.name] = String(v || '').split('\n').map((s) => s.trim()).filter(Boolean);
    else if (f.type === 'number') payload[f.name] = Number(v) || 0;
    else if (f.type === 'checkbox') payload[f.name] = Boolean(v);
    else payload[f.name] = typeof v === 'string' ? v.trim() : v;
  }
  return payload;
}

function FieldInput({ field, values, setValue }: { field: FieldDef; values: Record<string, any>; setValue: (n: string, v: any) => void }) {
  const value = values[field.name];
  const disabled = field.disabledWhen?.(values);
  const common = {
    id: `f-${field.name}`,
    required: field.required,
    placeholder: field.placeholder,
    disabled,
    className: 'field disabled:opacity-50',
  };

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none h-full pt-6">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => setValue(field.name, e.target.checked)}
          className="w-4 h-4 accent-violet-600"
        />
        <span className="text-sm font-medium text-foreground">{field.label}</span>
      </label>
    );
  }

  return (
    <label htmlFor={common.id} className="block">
      <Label hint={field.hint}>{field.label}{field.required && <span className="text-red-500"> *</span>}</Label>
      {field.type === 'textarea' || field.type === 'lines' ? (
        <textarea {...common} rows={field.type === 'lines' ? 4 : 3} value={value ?? ''} onChange={(e) => setValue(field.name, e.target.value)} className={`${common.className} resize-y`} />
      ) : field.type === 'select' ? (
        <select {...common} value={value ?? ''} onChange={(e) => setValue(field.name, e.target.value)}>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          {...common}
          // "link" accepts full URLs and site paths like /resume.pdf, so no browser URL validation.
          type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
          inputMode={field.type === 'link' ? 'url' : undefined}
          value={disabled && field.type === 'date' ? '' : value ?? ''}
          onChange={(e) => setValue(field.name, e.target.value)}
        />
      )}
    </label>
  );
}

function EditorDrawer({
  open, title, fields, initial, onClose, onSubmit,
}: {
  open: boolean;
  title: string;
  fields: FieldDef[];
  initial: Record<string, any>;
  onClose: () => void;
  onSubmit: (values: Record<string, any>) => Promise<void>;
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setValues(initial); }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const setValue = (name: string, v: any) => setValues((cur) => ({ ...cur, [name]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-surface border-l border-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
              <div>
                <p className="hud-label">Editor</p>
                <h2 className="font-display text-lg font-semibold text-foreground leading-tight">{title}</h2>
              </div>
              <button type="button" onClick={onClose} className="icon-btn" aria-label="Close editor"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={submit} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                {fields.map((f) => (
                  <div key={f.name} className={f.full || f.type === 'textarea' || f.type === 'lines' ? 'sm:col-span-2' : ''}>
                    <FieldInput field={f} values={values} setValue={setValue} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border shrink-0">
                <button type="button" onClick={onClose} className="btn btn-outline py-2.5">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary py-2.5">
                  {saving ? <Spinner /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CollectionManager({ config, onChanged }: { config: CollectionConfig; onChanged: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ record?: any } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await config.api.list();
      const data = Array.isArray(res?.data) ? res.data : [];
      setItems(config.sort ? [...data].sort(config.sort) : data);
    } catch (err) {
      notify.error(`Couldn't load ${config.title.toLowerCase()}: ${errorText(err)}`);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  const initial = useMemo(() => {
    const record = editing?.record;
    if (!record) return { ...config.defaults, ...(config.defaults.order !== undefined ? { order: items.length + 1 } : {}) };
    return config.toForm ? config.toForm(record) : recordToForm(config.fields, record, config.defaults);
  }, [editing, config, items.length]);

  const save = async (values: Record<string, any>) => {
    const original = editing?.record;
    const payload = config.toPayload ? config.toPayload(values, original) : formToPayload(config.fields, values);
    try {
      // Apply the saved record locally so the list updates instantly, without waiting on a re-fetch.
      const upsert = (saved: any) => setItems((list) => {
        const next = list.some((r) => r._id === saved._id)
          ? list.map((r) => (r._id === saved._id ? saved : r))
          : [...list, saved];
        return config.sort ? [...next].sort(config.sort) : next;
      });
      if (original?._id) {
        const res = await config.api.update(original._id, payload);
        upsert(res?.data ?? { ...original, ...payload });
        notify.success(`${config.singular} updated`);
      } else {
        const res = await config.api.create(payload);
        if (res?.data?._id) upsert(res.data); else await load();
        notify.success(`${config.singular} added`);
      }
      setEditing(null);
      onChanged();
    } catch (err) {
      notify.error(`Save failed: ${errorText(err)}`);
    }
  };

  const remove = async (record: any) => {
    if (!window.confirm(`Delete "${record.title || record.category || config.singular}"? This can't be undone.`)) return;
    setBusyId(record._id);
    try {
      await config.api.remove(record._id);
      setItems((list) => list.filter((r) => r._id !== record._id));
      notify.success(`${config.singular} deleted`);
      onChanged();
    } catch (err) {
      notify.error(`Delete failed: ${errorText(err)}`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        action={
          <button type="button" onClick={() => setEditing({})} className="btn btn-primary py-2.5">
            <Plus className="w-4 h-4" /> Add {config.singular.toLowerCase()}
          </button>
        }
      />

      {loading ? (
        <div className={`grid grid-cols-1 ${config.columns === 1 ? '' : 'lg:grid-cols-2'} gap-4`}>
          {[0, 1, 2, 3].map((i) => <div key={i} className="panel h-36 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState text={`No ${config.title.toLowerCase()} yet. Add your first one.`} />
      ) : (
        <div className={`grid grid-cols-1 ${config.columns === 1 ? '' : 'lg:grid-cols-2'} gap-4`}>
          {items.map((record) => (
            <article key={record._id} className="panel p-5 flex flex-col">
              <div className="flex-1 min-w-0">{config.renderCard(record)}</div>
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                <button type="button" onClick={() => setEditing({ record })} className="btn btn-outline py-2 px-3.5 text-sm">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(record)}
                  disabled={busyId === record._id}
                  className="btn py-2 px-3.5 text-sm text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50"
                >
                  {busyId === record._id ? <Spinner /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <EditorDrawer
        open={editing !== null}
        title={editing?.record ? `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`}
        fields={config.fields}
        initial={initial}
        onClose={() => setEditing(null)}
        onSubmit={save}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Collection configurations                                           */
/* ------------------------------------------------------------------ */

const Chips = ({ items, mono }: { items?: string[]; mono?: boolean }) =>
  items && items.length > 0 ? (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {items.map((t) => <span key={t} className={`chip text-[11px] ${mono ? 'font-mono' : ''}`}>{t}</span>)}
    </div>
  ) : null;

const AccentBar = ({ gradient }: { gradient?: string }) => {
  const [from, to] = accentFor(gradient);
  return <div className="h-[3px] w-12 rounded-full mb-3" style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }} />;
};

const fmtMonth = (d?: string | null) => {
  if (!d) return '';
  const t = new Date(d);
  return isNaN(t.getTime()) ? d : t.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const LinkOut = ({ href, label }: { href?: string; label: string }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-neon-violet hover:underline">
      {label} <ArrowUpRight className="w-3 h-3" />
    </a>
  ) : null;

const projectsConfig: CollectionConfig = {
  title: 'Projects',
  subtitle: 'Shown in the "Things I\'ve built" section, in order.',
  singular: 'Project',
  api: {
    list: projectAPI.getAllProjects,
    create: (d) => projectAPI.createProject(d),
    update: projectAPI.updateProject,
    remove: projectAPI.deleteProject,
  },
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, full: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'highlights', label: 'Key points', type: 'lines', hint: 'one per line' },
    { name: 'techStack', label: 'Tech stack', type: 'list', hint: 'comma separated', full: true },
    { name: 'liveLink', label: 'Live URL', type: 'link', placeholder: 'https://…' },
    { name: 'githubLink', label: 'GitHub URL', type: 'link', placeholder: 'https://github.com/…' },
    { name: 'gradient', label: 'Accent colour', type: 'select', options: GRADIENTS },
    { name: 'order', label: 'Order', type: 'number' },
  ],
  defaults: { title: '', description: '', highlights: '', techStack: '', liveLink: '', githubLink: '', gradient: GRADIENTS[0].value, order: 0 },
  sort: (a, b) => (a.order ?? 0) - (b.order ?? 0),
  renderCard: (p) => (
    <>
      <AccentBar gradient={p.gradient} />
      <h3 className="font-display text-lg font-semibold text-foreground">{p.title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
      <Chips items={p.techStack} mono />
      <div className="mt-3 flex gap-4"><LinkOut href={p.liveLink} label="Live" /><LinkOut href={p.githubLink} label="GitHub" /></div>
    </>
  ),
};

const experienceConfig: CollectionConfig = {
  title: 'Experience',
  subtitle: 'Sorted by start date, newest first.',
  singular: 'Experience',
  api: {
    list: experienceAPI.getAllExperience,
    create: (d) => experienceAPI.createExperience(d),
    update: experienceAPI.updateExperience,
    remove: experienceAPI.deleteExperience,
  },
  fields: [
    { name: 'title', label: 'Role', type: 'text', required: true },
    { name: 'company', label: 'Company', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'text', placeholder: 'Internship, Full-time…' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'startDate', label: 'Start date', type: 'date', required: true },
    { name: 'endDate', label: 'End date', type: 'date', disabledWhen: (v) => Boolean(v.isCurrentRole) },
    { name: 'isCurrentRole', label: 'I currently work here', type: 'checkbox', full: true },
    { name: 'description', label: 'What you did', type: 'lines', hint: 'one bullet per line' },
    { name: 'technologies', label: 'Technologies', type: 'list', hint: 'comma separated', full: true },
    { name: 'credentialUrl', label: 'Certificate / letter URL', type: 'link' },
    { name: 'credentialLabel', label: 'Link label', type: 'text', placeholder: 'Certificate' },
    { name: 'gradient', label: 'Accent colour', type: 'select', options: GRADIENTS },
  ],
  defaults: {
    title: '', company: '', type: '', location: '', startDate: '', endDate: '', isCurrentRole: false,
    description: '', technologies: '', credentialUrl: '', credentialLabel: '', gradient: GRADIENTS[0].value,
  },
  // Description is stored as a newline-separated string, not an array.
  toPayload: (values) => {
    const payload = formToPayload(experienceConfig.fields, values);
    payload.description = (payload.description as string[]).join('\n');
    if (payload.isCurrentRole) payload.endDate = null;
    return payload;
  },
  sort: (a, b) => String(b.startDate).localeCompare(String(a.startDate)),
  columns: 1,
  renderCard: (e) => (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
      <div className="min-w-0">
        <AccentBar gradient={e.gradient} />
        <h3 className="font-display text-lg font-semibold text-foreground">{e.title}</h3>
        <p className="text-sm text-foreground/80">{e.company}{e.type ? ` · ${e.type}` : ''}</p>
        <Chips items={e.technologies} mono />
      </div>
      <div className="shrink-0 sm:text-right font-mono text-xs text-muted-foreground space-y-1">
        <p>{fmtMonth(e.startDate)} – {e.isCurrentRole || !e.endDate ? 'Present' : fmtMonth(e.endDate)}</p>
        {e.location && <p>{e.location}</p>}
        <LinkOut href={e.credentialUrl} label={e.credentialLabel || 'Credential'} />
      </div>
    </div>
  ),
};

const ACHIEVEMENT_ICONS = ['Award', 'Target', 'Users', 'Zap', 'Code', 'Megaphone'].map((v) => ({ value: v, label: v }));

const achievementsConfig: CollectionConfig = {
  title: 'Achievements',
  subtitle: 'Leadership roles, awards and milestones.',
  singular: 'Achievement',
  api: {
    list: achievementAPI.getAllAchievements,
    create: (d) => achievementAPI.createAchievement(d),
    update: achievementAPI.updateAchievement,
    remove: achievementAPI.deleteAchievement,
  },
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, full: true },
    { name: 'subtitle', label: 'Subtitle', type: 'text', full: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'details', label: 'Highlights (chips)', type: 'lines', hint: 'one per line' },
    { name: 'link', label: 'Link', type: 'link', full: true },
    { name: 'icon', label: 'Icon', type: 'select', options: ACHIEVEMENT_ICONS },
    { name: 'gradient', label: 'Accent colour', type: 'select', options: GRADIENTS },
    { name: 'order', label: 'Order', type: 'number' },
  ],
  defaults: { title: '', subtitle: '', description: '', details: '', link: '', icon: 'Award', gradient: GRADIENTS[0].value, order: 0 },
  sort: (a, b) => (a.order ?? 0) - (b.order ?? 0),
  renderCard: (a) => (
    <>
      <AccentBar gradient={a.gradient} />
      <h3 className="font-display text-lg font-semibold text-foreground">{a.title}</h3>
      <p className="font-mono text-[11px] uppercase tracking-wider text-neon-cyan">{a.subtitle}</p>
      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{a.description}</p>
      <Chips items={a.details} />
      <div className="mt-3"><LinkOut href={a.link} label="Link" /></div>
    </>
  ),
};

const certificationsConfig: CollectionConfig = {
  title: 'Certifications',
  subtitle: 'Each card links to its verification page.',
  singular: 'Certification',
  api: {
    list: certificationAPI.getAllCertifications,
    create: certificationAPI.createCertification,
    update: certificationAPI.updateCertification,
    remove: certificationAPI.deleteCertification,
  },
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, full: true },
    { name: 'issuer', label: 'Issuer', type: 'text', required: true, placeholder: 'Google' },
    { name: 'platform', label: 'Platform', type: 'text', placeholder: 'Coursera' },
    { name: 'issueDate', label: 'Issued on', type: 'date' },
    { name: 'credentialId', label: 'Credential ID', type: 'text' },
    { name: 'verifyUrl', label: 'Verification URL', type: 'link', full: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'modules', label: 'Modules / skills', type: 'list', hint: 'comma separated', full: true },
    { name: 'order', label: 'Order', type: 'number' },
  ],
  defaults: { title: '', issuer: '', platform: '', issueDate: '', credentialId: '', verifyUrl: '', description: '', modules: '', order: 0 },
  sort: (a, b) => (a.order ?? 0) - (b.order ?? 0),
  renderCard: (c) => (
    <>
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {[c.issuer, c.platform, fmtMonth(c.issueDate)].filter(Boolean).join(' · ')}
      </p>
      <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{c.title}</h3>
      <Chips items={c.modules} />
      <div className="mt-3"><LinkOut href={c.verifyUrl} label="Verify" /></div>
    </>
  ),
};

const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

const skillsConfig: CollectionConfig = {
  title: 'Skills',
  subtitle: 'Grouped by category. Add a level with "Name:level", e.g. "React:expert" (optional).',
  singular: 'Skill category',
  api: {
    list: skillAPI.getAllSkills,
    create: (d) => skillAPI.createSkill(d),
    update: skillAPI.updateSkill,
    remove: skillAPI.deleteSkill,
  },
  fields: [
    { name: 'category', label: 'Category', type: 'text', required: true },
    { name: 'order', label: 'Order', type: 'number' },
    { name: 'skills', label: 'Skills', type: 'lines', hint: 'one per line or comma separated', required: true },
  ],
  defaults: { category: '', order: 0, skills: '' },
  toForm: (r) => ({
    category: r.category || '',
    order: r.order ?? 0,
    skills: (r.skills || [])
      .map((s: any) => (s.proficiency && LEVELS.includes(s.proficiency) ? `${s.name}:${s.proficiency}` : s.name))
      .join('\n'),
  }),
  toPayload: (values) => ({
    category: String(values.category).trim(),
    order: Number(values.order) || 0,
    skills: String(values.skills)
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((entry) => {
        const [name, level] = entry.split(':').map((p) => p.trim());
        const lower = level?.toLowerCase();
        return lower && LEVELS.includes(lower) ? { name, proficiency: lower } : { name: level ? entry : name };
      }),
  }),
  sort: (a, b) => (a.order ?? 0) - (b.order ?? 0),
  renderCard: (s) => (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">{s.category}</h3>
        <span className="font-mono text-xs text-muted-foreground">{s.skills?.length || 0} skills</span>
      </div>
      <Chips items={(s.skills || []).map((k: any) => (k.proficiency ? `${k.name} · ${k.proficiency}` : k.name))} />
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Profile (single portfolio record)                                   */
/* ------------------------------------------------------------------ */

const ABOUT_ICONS = ['Code', 'Lightbulb', 'Users', 'Target'];

function useFormState<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  const set = (path: string, value: any) =>
    setState((cur: any) => {
      const next = structuredClone(cur);
      const keys = path.split('.');
      let node = next;
      keys.slice(0, -1).forEach((k) => { node[k] = node[k] ?? {}; node = node[k]; });
      node[keys[keys.length - 1]] = value;
      return next;
    });
  return [state, set, setState] as const;
}

const profileFromPortfolio = (p: any) => ({
  fullName: p?.fullName || '',
  title: p?.title || '',
  bio: p?.bio || '',
  profileImage: p?.profileImage || '/images/profile.jpg',
  resumeLink: p?.resumeLink || '',
  email: p?.email || '',
  phone: p?.phone || '',
  location: p?.location || '',
  education: {
    institution: p?.education?.institution || '',
    degree: p?.education?.degree || '',
    period: p?.education?.period || '',
    cgpa: p?.education?.cgpa || '',
  },
  socialLinks: {
    github: p?.socialLinks?.github || '',
    linkedin: p?.socialLinks?.linkedin || '',
    twitter: p?.socialLinks?.twitter || '',
    leetcode: p?.socialLinks?.leetcode || '',
    website: p?.socialLinks?.website || '',
  },
  heroHighlights: [0, 1, 2].map((i) => ({
    value: p?.heroHighlights?.[i]?.value || '',
    label: p?.heroHighlights?.[i]?.label || '',
  })),
});

const aboutFromPortfolio = (p: any) => ({
  aboutDescription: p?.aboutDescription || '',
  stats: {
    projectsCompleted: p?.stats?.projectsCompleted ?? 0,
    yearsExperience: p?.stats?.yearsExperience ?? 0,
    usersImpacted: p?.stats?.usersImpacted ?? 0,
    technologiesCount: p?.stats?.technologiesCount ?? 0,
  },
  aboutHighlights: [0, 1, 2, 3].map((i) => ({
    id: p?.aboutHighlights?.[i]?.id ?? i + 1,
    icon: p?.aboutHighlights?.[i]?.icon || ABOUT_ICONS[i],
    title: p?.aboutHighlights?.[i]?.title || '',
    description: p?.aboutHighlights?.[i]?.description || '',
  })),
});

function Card({ title, hud, children }: { title: string; hud?: string; children: React.ReactNode }) {
  return (
    <section className="panel p-6">
      {hud && <p className="hud-label mb-1">{hud}</p>}
      <h2 className="font-display text-lg font-semibold text-foreground mb-5">{title}</h2>
      {children}
    </section>
  );
}

function TextField({ label, value, onChange, hint, placeholder, required, textarea, rows = 4, type = 'text' }: {
  label: string; value: any; onChange: (v: string) => void; hint?: string; placeholder?: string; required?: boolean; textarea?: boolean; rows?: number; type?: string;
}) {
  return (
    <label className="block">
      <Label hint={hint}>{label}{required && <span className="text-red-500"> *</span>}</Label>
      {textarea ? (
        <textarea className="field resize-y" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
      ) : (
        <input className="field" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
      )}
    </label>
  );
}

function SaveBar({ saving, dirty }: { saving: boolean; dirty: boolean }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 sm:mx-0 mt-6 px-4 sm:px-5 py-3.5 sm:rounded-2xl glass flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">{dirty ? 'You have unsaved changes' : 'All changes saved'}</span>
      <button type="submit" disabled={saving || !dirty} className="btn btn-primary py-2.5">
        {saving ? <Spinner /> : <Save className="w-4 h-4" />} {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}

function usePortfolioSave(portfolio: any, onSaved: (p: any) => void) {
  const [saving, setSaving] = useState(false);
  const save = async (patch: Record<string, any>) => {
    setSaving(true);
    try {
      const res = await portfolioAPI.updatePortfolio(patch);
      onSaved(res?.data || { ...portfolio, ...patch });
      notify.success('Saved. Changes are live on your site.');
    } catch (err) {
      notify.error(`Save failed: ${errorText(err)}`);
    } finally {
      setSaving(false);
    }
  };
  return { saving, save };
}

function ProfileView({ portfolio, onSaved }: { portfolio: any; onSaved: (p: any) => void }) {
  const initial = useMemo(() => profileFromPortfolio(portfolio), [portfolio]);
  const [form, set, reset] = useFormState(initial);
  useEffect(() => reset(initial), [initial, reset]);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const { saving, save } = usePortfolioSave(portfolio, onSaved);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    save({
      ...form,
      // Keep links this form doesn't edit (e.g. email_link) instead of wiping them.
      socialLinks: { ...(portfolio?.socialLinks || {}), ...form.socialLinks },
      education: { ...(portfolio?.education || {}), ...form.education },
      heroHighlights: form.heroHighlights.filter((h) => h.value.trim() && h.label.trim()),
    });
  };

  return (
    <form onSubmit={submit}>
      <PageHeader title="Profile" subtitle="Your name, headline, contact details and links." />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <Card title="Identity" hud="01">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="Full name" value={form.fullName} onChange={(v) => set('fullName', v)} required />
              <TextField label="Headline" value={form.title} onChange={(v) => set('title', v)} required />
              <div className="sm:col-span-2">
                <TextField label="Hero bio" value={form.bio} onChange={(v) => set('bio', v)} textarea rows={3} hint={`${form.bio.length} chars`} />
              </div>
              <TextField label="Profile photo URL" value={form.profileImage} onChange={(v) => set('profileImage', v)} hint="URL or /images/…" />
              <TextField label="Resume link" value={form.resumeLink} onChange={(v) => set('resumeLink', v)} hint="URL or /file.pdf" />
            </div>
          </Card>

          <Card title="Contact" hud="02">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="Email" type="email" value={form.email} onChange={(v) => set('email', v)} />
              <TextField label="Phone" value={form.phone} onChange={(v) => set('phone', v)} />
              <div className="sm:col-span-2"><TextField label="Location" value={form.location} onChange={(v) => set('location', v)} /></div>
            </div>
          </Card>

          <Card title="Social links" hud="03">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['github', 'linkedin', 'leetcode', 'twitter', 'website'] as const).map((k) => (
                <TextField key={k} label={k === 'twitter' ? 'X (Twitter)' : k[0].toUpperCase() + k.slice(1)} value={form.socialLinks[k]} onChange={(v) => set(`socialLinks.${k}`, v)} placeholder="https://…" />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <section className="panel p-6 text-center">
            <img src={form.profileImage || '/images/profile.jpg'} alt="" className="mx-auto w-28 h-28 rounded-full object-cover object-top ring-2 ring-offset-4 ring-offset-surface ring-violet-500/60" />
            <p className="mt-4 font-display text-lg font-semibold text-foreground">{form.fullName || 'Your name'}</p>
            <p className="text-sm text-muted-foreground">{form.title || 'Your headline'}</p>
          </section>

          <Card title="Education" hud="04">
            <div className="space-y-4">
              <TextField label="Degree" value={form.education.degree} onChange={(v) => set('education.degree', v)} />
              <TextField label="Institution" value={form.education.institution} onChange={(v) => set('education.institution', v)} />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Period" value={form.education.period} onChange={(v) => set('education.period', v)} placeholder="2023 – 2028" />
                <TextField label="CGPA" value={form.education.cgpa} onChange={(v) => set('education.cgpa', v)} />
              </div>
            </div>
          </Card>

          <Card title="Hero highlights" hud="05">
            <div className="space-y-3">
              {form.heroHighlights.map((h, i) => (
                <div key={i} className="grid grid-cols-[0.8fr_1.2fr] gap-2">
                  <input className="field" value={h.value} onChange={(e) => set(`heroHighlights.${i}.value`, e.target.value)} placeholder="AIR 3460" aria-label={`Highlight ${i + 1} value`} />
                  <input className="field" value={h.label} onChange={(e) => set(`heroHighlights.${i}.label`, e.target.value)} placeholder="GATE 2026 · CS" aria-label={`Highlight ${i + 1} label`} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <SaveBar saving={saving} dirty={dirty} />
    </form>
  );
}

function AboutView({ portfolio, onSaved }: { portfolio: any; onSaved: (p: any) => void }) {
  const initial = useMemo(() => aboutFromPortfolio(portfolio), [portfolio]);
  const [form, set, reset] = useFormState(initial);
  useEffect(() => reset(initial), [initial, reset]);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const { saving, save } = usePortfolioSave(portfolio, onSaved);

  const statFields = [
    { key: 'projectsCompleted', label: 'Projects shipped', suffix: '+' },
    { key: 'yearsExperience', label: 'Years building', suffix: '+' },
    { key: 'usersImpacted', label: 'People reached', suffix: 'K+' },
    { key: 'technologiesCount', label: 'Technologies', suffix: '+' },
  ] as const;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    save({
      aboutDescription: form.aboutDescription,
      stats: Object.fromEntries(Object.entries(form.stats).map(([k, v]) => [k, Math.max(0, Number(v) || 0)])),
      aboutHighlights: form.aboutHighlights.filter((h) => h.title.trim()),
    });
  };

  return (
    <form onSubmit={submit}>
      <PageHeader title="About & stats" subtitle="The About section story, the four stat tiles and the highlight cards." />
      <div className="space-y-5">
        <Card title="About text" hud="01">
          <TextField label="Description" value={form.aboutDescription} onChange={(v) => set('aboutDescription', v)} textarea rows={9} hint="blank line = new paragraph" />
        </Card>

        <Card title="Stat tiles" hud="02">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statFields.map(({ key, label, suffix }) => (
              <label key={key} className="block">
                <Label>{label}</Label>
                <div className="relative">
                  <input className="field pr-12" type="number" min={0} value={form.stats[key]} onChange={(e) => set(`stats.${key}`, e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">{suffix}</span>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Card title="Highlight cards" hud="03">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {form.aboutHighlights.map((h, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface-2/60 p-4 space-y-3">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input className="field" value={h.title} onChange={(e) => set(`aboutHighlights.${i}.title`, e.target.value)} placeholder={`Card ${i + 1} title`} aria-label={`Card ${i + 1} title`} />
                  <select className="field w-36" value={h.icon} onChange={(e) => set(`aboutHighlights.${i}.icon`, e.target.value)} aria-label={`Card ${i + 1} icon`}>
                    {ABOUT_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <textarea className="field resize-y" rows={3} value={h.description} onChange={(e) => set(`aboutHighlights.${i}.description`, e.target.value)} placeholder="Description" aria-label={`Card ${i + 1} description`} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Leave a card's title empty to hide it.</p>
        </Card>
      </div>
      <SaveBar saving={saving} dirty={dirty} />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Messages & overview                                                 */
/* ------------------------------------------------------------------ */

const isRead = (m: any) => Boolean(m?.isRead ?? m?.read);
const fmtDateTime = (d?: string) => {
  const t = d ? new Date(d) : null;
  return t && !isNaN(t.getTime()) ? t.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';
};

function MessagesView({ messages, loading, setMessages }: { messages: any[]; loading: boolean; setMessages: Dispatch<SetStateAction<any[]>> }) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [busy, setBusy] = useState<string | null>(null);
  const shown = filter === 'unread' ? messages.filter((m) => !isRead(m)) : messages;

  // Each action updates the shared list right away, so the inbox, badges and overview change instantly.
  const act = async (id: string, fn: () => Promise<any>, apply: (list: any[]) => any[], done: string) => {
    setBusy(id);
    try {
      await fn();
      setMessages(apply);
      notify.success(done);
    } catch (err) {
      notify.error(errorText(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle="Sent from the contact form on your site."
        action={
          <div className="inline-flex rounded-xl border border-border bg-surface-2 p-1">
            {(['all', 'unread'] as const).map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-surface text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {f}{f === 'unread' && ` (${messages.filter((m) => !isRead(m)).length})`}
              </button>
            ))}
          </div>
        }
      />
      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="panel h-28 animate-pulse" />)}</div>
      ) : shown.length === 0 ? (
        <EmptyState text={filter === 'unread' ? 'No unread messages.' : 'No messages yet.'} />
      ) : (
        <div className="space-y-3">
          {shown.map((m) => (
            <article key={m._id} className={`panel p-5 ${isRead(m) ? '' : 'border-l-4 border-l-violet-500'}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    {m.name || 'Unknown'}
                    {!isRead(m) && <span className="chip text-[10px] font-mono uppercase text-neon-violet">New</span>}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-sm text-muted-foreground hover:text-foreground break-all">{m.email}</a>
                </div>
                <span className="font-mono text-xs text-muted-foreground shrink-0">{fmtDateTime(m.createdAt)}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'Your message'}`)}`} className="btn btn-outline py-2 px-3.5 text-sm">
                  <Mail className="w-3.5 h-3.5" /> Reply
                </a>
                {!isRead(m) && (
                  <button type="button" disabled={busy === m._id} onClick={() => act(m._id, () => messagesAPI.markAsRead(m._id), (list) => list.map((x) => (x._id === m._id ? { ...x, isRead: true, read: true } : x)), 'Marked as read')} className="btn btn-outline py-2 px-3.5 text-sm disabled:opacity-50">
                    <Check className="w-3.5 h-3.5" /> Mark read
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy === m._id}
                  onClick={() => window.confirm('Delete this message?') && act(m._id, () => messagesAPI.deleteMessage(m._id), (list) => list.filter((x) => x._id !== m._id), 'Message deleted')}
                  className="btn py-2 px-3.5 text-sm text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function OverviewView({ portfolio, stats, counts, messages, go }: {
  portfolio: any; stats: any; counts: Record<string, number>; messages: any[]; go: (v: View) => void;
}) {
  const unread = messages.filter((m) => !isRead(m)).length;
  const tiles = [
    { label: 'Portfolio views', value: stats?.viewCount ?? portfolio?.viewCount ?? 0, icon: Eye },
    { label: 'Unread messages', value: unread, icon: Inbox, onClick: () => go('messages') },
    { label: 'Projects', value: counts.projects ?? '–', icon: FolderGit2, onClick: () => go('projects') },
    { label: 'Certifications', value: counts.certifications ?? '–', icon: BadgeCheck, onClick: () => go('certifications') },
  ];
  const updated = stats?.lastUpdated ? fmtDateTime(stats.lastUpdated) : '';

  return (
    <div>
      <PageHeader title={`Welcome back${portfolio?.fullName ? `, ${portfolio.fullName.split(' ')[0]}` : ''}`} subtitle={updated ? `Content last updated ${updated}` : 'Manage everything on your portfolio from here.'} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(({ label, value, icon: Icon, onClick }) => (
          <button key={label} type="button" onClick={onClick} disabled={!onClick} className="panel panel-interactive p-5 text-left disabled:cursor-default disabled:hover:transform-none">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
              <Icon className="w-4 h-4 text-neon-cyan" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-gradient">{value}</p>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="panel p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent messages</h2>
            <button type="button" onClick={() => go('messages')} className="text-sm font-medium text-neon-violet hover:underline">View all</button>
          </div>
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {messages.slice(0, 5).map((m) => (
                <li key={m._id} className="py-3 flex items-start gap-3">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${isRead(m) ? 'bg-surface-3' : 'bg-violet-500'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{m.message}</p>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground shrink-0">{fmtDateTime(m.createdAt).split(',')[0]}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick actions</h2>
          <div className="grid gap-2">
            {([
              ['profile', 'Edit profile & links', User],
              ['projects', 'Add a project', FolderGit2],
              ['certifications', 'Add a certification', BadgeCheck],
              ['experience', 'Update experience', Briefcase],
            ] as const).map(([view, label, Icon]) => (
              <button key={view} type="button" onClick={() => go(view)} className="flex items-center gap-3 rounded-xl border border-border px-3.5 py-3 text-sm font-medium text-foreground hover:border-violet-500/50 hover:bg-surface-2 transition-colors text-left">
                <Icon className="w-4 h-4 text-neon-cyan" /> {label}
              </button>
            ))}
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-border px-3.5 py-3 text-sm font-medium text-foreground hover:border-violet-500/50 hover:bg-surface-2 transition-colors">
              <ArrowUpRight className="w-4 h-4 text-neon-cyan" /> Open live site
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

type View = 'overview' | 'profile' | 'about' | 'projects' | 'experience' | 'achievements' | 'certifications' | 'skills' | 'messages';

const NAV: { id: View; label: string; icon: typeof User; group: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, group: 'General' },
  { id: 'messages', label: 'Messages', icon: Inbox, group: 'General' },
  { id: 'profile', label: 'Profile', icon: User, group: 'Content' },
  { id: 'about', label: 'About & stats', icon: FileText, group: 'Content' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, group: 'Content' },
  { id: 'experience', label: 'Experience', icon: Briefcase, group: 'Content' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, group: 'Content' },
  { id: 'certifications', label: 'Certifications', icon: BadgeCheck, group: 'Content' },
  { id: 'skills', label: 'Skills', icon: Layers, group: 'Content' },
];

const COLLECTIONS: Partial<Record<View, CollectionConfig>> = {
  projects: projectsConfig,
  experience: experienceConfig,
  achievements: achievementsConfig,
  certifications: certificationsConfig,
  skills: skillsConfig,
};

const readView = (): View => {
  const hash = window.location.hash.slice(1) as View;
  return NAV.some((n) => n.id === hash) ? hash : 'overview';
};

export default function AdminDashboard() {
  const [view, setView] = useState<View>(readView);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const go = (next: View) => {
    setView(next);
    window.history.replaceState(null, '', `#${next}`);
    window.scrollTo({ top: 0 });
  };

  const loadMessages = useCallback(async () => {
    try {
      const res = await messagesAPI.getAllMessages(1, 500);
      const list = Array.isArray(res?.data) ? res.data : [];
      setMessages([...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
    } catch (err) {
      notify.error(`Couldn't load messages: ${errorText(err)}`);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    const [p, s, projects, certs] = await Promise.allSettled([
      portfolioAPI.getPortfolio(),
      portfolioAPI.getStats(),
      projectAPI.getAllProjects(),
      certificationAPI.getAllCertifications(),
    ]);
    if (p.status === 'fulfilled') setPortfolio(p.value?.data ?? p.value);
    if (s.status === 'fulfilled') setStats(s.value?.data ?? s.value);
    setCounts({
      projects: projects.status === 'fulfilled' ? projects.value?.data?.length ?? 0 : NaN,
      certifications: certs.status === 'fulfilled' ? certs.value?.data?.length ?? 0 : NaN,
    });
  }, []);

  useEffect(() => {
    loadSummary();
    loadMessages();
  }, [loadSummary, loadMessages]);

  useEffect(() => {
    const onHash = () => setView(readView());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleLogout = () => {
    ['portfolioToken', 'authToken', 'adminToken'].forEach((k) => localStorage.removeItem(k));
    window.location.href = '/login';
  };

  const unread = messages.filter((m) => !isRead(m)).length;
  const collection = COLLECTIONS[view];
  const groups = [...new Set(NAV.map((n) => n.group))];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-surface">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
          <span className="grid place-items-center w-9 h-9 rounded-xl neon-border font-display font-bold text-sm"><span className="text-gradient">AR</span></span>
          <div className="leading-none">
            <p className="font-display font-semibold text-foreground">Admin</p>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground mt-1">control panel</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin sections">
          {groups.map((group) => (
            <div key={group} className="mb-4">
              <p className="px-3 mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{group}</p>
              {NAV.filter((n) => n.group === group).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => go(id)}
                  aria-current={view === id ? 'page' : undefined}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${view === id ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-surface-2/60'}`}
                >
                  {view === id && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-neon-cyan to-neon-violet" />}
                  <Icon className="w-4 h-4" />
                  {label}
                  {id === 'messages' && unread > 0 && (
                    <span className="ml-auto min-w-5 h-5 px-1.5 grid place-items-center rounded-full bg-violet-600 text-white text-[11px] font-semibold">{unread}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2/60">
            <ArrowUpRight className="w-4 h-4" /> View site
          </a>
          <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-x-0 border-t-0">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-8 h-16">
            <div className="flex items-center gap-2 min-w-0">
              <span className="lg:hidden grid place-items-center w-9 h-9 rounded-xl neon-border font-display font-bold text-sm shrink-0"><span className="text-gradient">AR</span></span>
              <p className="font-mono text-xs text-muted-foreground truncate">
                admin <span className="text-neon-cyan">/</span> {NAV.find((n) => n.id === view)?.label.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button type="button" onClick={handleLogout} className="icon-btn lg:hidden" aria-label="Log out"><LogOut className="w-[18px] h-[18px]" /></button>
            </div>
          </div>
          {/* Section switcher (mobile/tablet) */}
          <nav className="lg:hidden flex gap-1 overflow-x-auto px-3 pb-2" aria-label="Admin sections">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${view === id ? 'bg-surface-2 text-foreground border border-border' : 'text-muted-foreground'}`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
                {id === 'messages' && unread > 0 && <span className="ml-0.5 text-[11px] font-semibold text-neon-violet">{unread}</span>}
              </button>
            ))}
          </nav>
        </header>

        <main className="px-4 sm:px-8 py-8 max-w-6xl">
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {view === 'overview' && <OverviewView portfolio={portfolio} stats={stats} counts={counts} messages={messages} go={go} />}
            {view === 'messages' && <MessagesView messages={messages} loading={messagesLoading} setMessages={setMessages} />}
            {view === 'profile' && (portfolio ? <ProfileView portfolio={portfolio} onSaved={setPortfolio} /> : <div className="panel h-64 animate-pulse" />)}
            {view === 'about' && (portfolio ? <AboutView portfolio={portfolio} onSaved={setPortfolio} /> : <div className="panel h-64 animate-pulse" />)}
            {collection && <CollectionManager key={view} config={collection} onChanged={loadSummary} />}
          </motion.div>
        </main>
      </div>

      <Toasts />
    </div>
  );
}
