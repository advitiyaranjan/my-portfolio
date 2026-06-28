import {
  skillsStorage, projectsStorage, experiencesStorage, achievementsStorage, portFolioStorage, certificationsStorage,
} from './storage.js';

// Gemini-powered content assistant: turns a plain-English request into a list of
// create/update/delete operations, which the admin previews before they are applied.

const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
const GEMINI_URL = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export const isAiEnabled = () => Boolean(process.env.GEMINI_API_KEY?.trim());
export const aiModel = () => GEMINI_MODEL;

// Collections the assistant may touch. Messages and users are deliberately excluded.
const COLLECTIONS = {
  projects: {
    storage: projectsStorage,
    required: ['title', 'description'],
    fields: 'title, description, highlights (string[]), techStack (string[]), liveLink, githubLink, gradient, order (number)',
  },
  experience: {
    storage: experiencesStorage,
    required: ['title', 'company', 'startDate'],
    fields: 'title (role), company, type, location, startDate (YYYY-MM-DD), endDate (YYYY-MM-DD or null), isCurrentRole (boolean), description (bullets separated by "\\n"), technologies (string[]), credentialUrl, credentialLabel, gradient',
  },
  achievements: {
    storage: achievementsStorage,
    required: ['title', 'description'],
    fields: 'title, subtitle, description, details (string[]), link, icon (Award|Target|Users|Zap|Code|Megaphone), gradient, order (number)',
  },
  certifications: {
    storage: certificationsStorage,
    required: ['title', 'issuer'],
    fields: 'title, issuer, platform, issueDate (YYYY-MM-DD), credentialId, verifyUrl, description, modules (string[]), order (number)',
  },
  skills: {
    storage: skillsStorage,
    required: ['category', 'skills'],
    fields: 'category, skills ({ name, proficiency? (beginner|intermediate|advanced|expert) }[]), order (number)',
  },
  portfolio: {
    storage: portFolioStorage,
    required: [],
    fields: 'fullName, title (headline), bio, profileImage, resumeLink, email, phone, location, education { institution, degree, period, cgpa }, socialLinks { github, linkedin, twitter, leetcode, website }, heroHighlights ({ value, label }[], max 3), aboutDescription (paragraphs separated by blank lines), stats { projectsCompleted, yearsExperience, usersImpacted, technologiesCount }, aboutHighlights ({ id, icon (Code|Lightbulb|Users|Target), title, description }[], max 4)',
  },
};

const GRADIENTS = [
  'from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500', 'from-yellow-500 to-orange-500', 'from-indigo-500 to-blue-500', 'from-red-500 to-rose-500',
];

// Fields that are server-managed or never editable through the assistant.
const PROTECTED = ['_id', 'createdAt', 'updatedAt', 'viewCount', 'lastUpdated'];
const PORTFOLIO_OBJECTS = ['education', 'socialLinks', 'stats'];

const strip = (record) => {
  const out = { ...record };
  for (const key of ['createdAt', 'updatedAt', 'viewCount', 'lastUpdated', 'imageUrl', 'imageAlt', 'color']) delete out[key];
  return out;
};

async function loadContent() {
  const entries = await Promise.all(
    Object.entries(COLLECTIONS).map(async ([name, { storage }]) => [name, await storage.findAll()]),
  );
  return Object.fromEntries(entries);
}

function buildPrompt(content, instruction, history) {
  const snapshot = Object.fromEntries(
    Object.entries(content).map(([name, records]) => [
      name,
      name === 'portfolio' ? strip(records[0] || {}) : records.map(strip),
    ]),
  );
  const schema = Object.entries(COLLECTIONS).map(([name, c]) => `- ${name}: ${c.fields}`).join('\n');
  const previous = (history || [])
    .slice(-6)
    .map((h) => `Admin: ${h.instruction}\nAssistant: ${h.summary}`)
    .join('\n\n');

  return `You are the content assistant for a personal portfolio website's admin dashboard.
Turn the admin's request into precise edits to the site's content. Today's date is ${new Date().toISOString().slice(0, 10)}.

FIELDS PER COLLECTION
${schema}
Allowed "gradient" values: ${GRADIENTS.join(', ')}.

RULES
- Only change what the request asks for. For "update", include ONLY the changed fields in "data".
- Reference existing records by their exact "_id" from the content below. Never invent ids.
- "portfolio" is a single record: always use action "update" with no id. For education/socialLinks/stats you may send just the changed keys. heroHighlights and aboutHighlights are replaced as a whole array, so send the full array.
- When editing an array field on a collection record (e.g. techStack, highlights, details, modules, skills), send the complete new array.
- For new records pick a sensible "order" (usually after the last one) and a gradient if the collection has one.
- Keep the tone professional, concise and in the same style as the existing content. Do not fabricate facts, numbers, links or dates the admin did not give you; leave such fields out instead.
- If the request is unclear or cannot be done with these collections, return no operations and explain why in "summary".

CURRENT CONTENT (JSON)
${JSON.stringify(snapshot)}
${previous ? `\nEARLIER IN THIS SESSION\n${previous}\n` : ''}
ADMIN REQUEST
${instruction}

Respond with JSON only, in exactly this shape:
{"summary": "one or two sentences describing the changes", "operations": [{"action": "create" | "update" | "delete", "collection": "${Object.keys(COLLECTIONS).join('" | "')}", "id": "existing _id for update/delete", "data": { }, "reason": "short explanation" }]}`;
}

async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL(GEMINI_MODEL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY.trim() },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
    }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.error?.message || `Gemini request failed (${res.status})`;
    throw Object.assign(new Error(message), { status: res.status === 429 ? 429 : 502 });
  }

  const text = body?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
  if (!text) {
    const reason = body?.promptFeedback?.blockReason || body?.candidates?.[0]?.finishReason || 'empty response';
    throw Object.assign(new Error(`Gemini returned no content (${reason})`), { status: 502 });
  }

  try {
    // Tolerate a stray ```json fence even though JSON mode is requested.
    return JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ''));
  } catch {
    throw Object.assign(new Error('Gemini returned malformed JSON. Try rephrasing the request.'), { status: 502 });
  }
}

// Coerce values into the shapes the site expects, whatever form the model (or client) sent.
function normalizeData(collection, data) {
  const out = {};
  for (const [key, value] of Object.entries(data || {})) {
    if (!PROTECTED.includes(key) && value !== undefined) out[key] = value;
  }

  const toList = (v) => (Array.isArray(v) ? v : String(v ?? '').split(/[\n,]/)).map((s) => String(s).trim()).filter(Boolean);
  const listFields = {
    projects: ['highlights', 'techStack'],
    experience: ['technologies'],
    achievements: ['details'],
    certifications: ['modules'],
  }[collection] || [];
  for (const key of listFields) if (key in out) out[key] = toList(out[key]);

  if ('order' in out) out.order = Number(out.order) || 0;
  if (collection === 'experience') {
    if (Array.isArray(out.description)) out.description = out.description.map((s) => String(s).trim()).filter(Boolean).join('\n');
    if (out.isCurrentRole === true) out.endDate = null;
  }
  if (collection === 'skills' && 'skills' in out) {
    const list = Array.isArray(out.skills) ? out.skills : toList(out.skills);
    out.skills = list
      .map((s) => (typeof s === 'string' ? { name: s.trim() } : { name: String(s?.name || '').trim(), ...(s?.proficiency ? { proficiency: String(s.proficiency).toLowerCase() } : {}) }))
      .filter((s) => s.name);
  }
  if (collection === 'portfolio' && out.stats && typeof out.stats === 'object') {
    out.stats = Object.fromEntries(Object.entries(out.stats).map(([k, v]) => [k, Math.max(0, Number(v) || 0)]));
  }
  return out;
}

/**
 * Validate raw operations against current content. Returns the clean operations
 * (with the record they affect, for previews) and human-readable reasons for any dropped ones.
 */
function validateOperations(rawOps, content) {
  const operations = [];
  const rejected = [];

  for (const raw of Array.isArray(rawOps) ? rawOps : []) {
    const { action, collection, id, reason } = raw || {};
    const config = COLLECTIONS[collection];
    const label = `${action || '?'} ${collection || '?'}`;

    if (!config) { rejected.push(`${label}: unknown collection`); continue; }
    if (!['create', 'update', 'delete'].includes(action)) { rejected.push(`${label}: unknown action`); continue; }

    if (collection === 'portfolio') {
      if (action !== 'update') { rejected.push(`${label}: the profile can only be updated`); continue; }
      const data = normalizeData(collection, raw.data);
      if (Object.keys(data).length === 0) { rejected.push(`${label}: no changes`); continue; }
      operations.push({ action, collection, data, reason: reason || '', before: strip(content.portfolio[0] || {}) });
      continue;
    }

    const records = content[collection];
    if (action === 'create') {
      const data = normalizeData(collection, raw.data);
      const missing = config.required.filter((f) => data[f] === undefined || data[f] === '' || (Array.isArray(data[f]) && data[f].length === 0));
      if (missing.length) { rejected.push(`${label}: missing ${missing.join(', ')}`); continue; }
      operations.push({ action, collection, data, reason: reason || '' });
      continue;
    }

    const before = records.find((r) => r._id === id);
    if (!before) { rejected.push(`${label}: record "${id}" not found`); continue; }

    if (action === 'delete') {
      operations.push({ action, collection, id, reason: reason || '', before: strip(before) });
      continue;
    }

    const data = normalizeData(collection, raw.data);
    if (Object.keys(data).length === 0) { rejected.push(`${label}: no changes`); continue; }
    operations.push({ action, collection, id, data, reason: reason || '', before: strip(before) });
  }

  return { operations, rejected };
}

export async function planChanges(instruction, history) {
  if (!isAiEnabled()) throw Object.assign(new Error('Gemini is not configured. Set GEMINI_API_KEY on the server.'), { status: 503 });

  const content = await loadContent();
  const result = await callGemini(buildPrompt(content, instruction, history));
  const { operations, rejected } = validateOperations(result?.operations, content);
  return { summary: String(result?.summary || ''), operations, rejected };
}

export async function applyChanges(rawOps) {
  // Re-validate against fresh content: the client may have edited the plan, or content may have changed since.
  const content = await loadContent();
  const { operations, rejected } = validateOperations(rawOps, content);
  const applied = [];

  for (const op of operations) {
    const { storage } = COLLECTIONS[op.collection];
    if (op.collection === 'portfolio') {
      const current = content.portfolio[0];
      const patch = { ...op.data, lastUpdated: new Date().toISOString() };
      for (const key of PORTFOLIO_OBJECTS) {
        if (patch[key] && typeof patch[key] === 'object') patch[key] = { ...(current?.[key] || {}), ...patch[key] };
      }
      const saved = current ? await storage.updateById(current._id, patch) : await storage.create({ viewCount: 0, ...patch });
      content.portfolio = [saved];
      applied.push({ action: op.action, collection: op.collection, record: saved });
    } else if (op.action === 'create') {
      applied.push({ action: op.action, collection: op.collection, record: await storage.create({ order: 0, ...op.data }) });
    } else if (op.action === 'update') {
      applied.push({ action: op.action, collection: op.collection, record: await storage.updateById(op.id, op.data) });
    } else {
      await storage.deleteById(op.id);
      applied.push({ action: op.action, collection: op.collection, id: op.id });
    }
  }

  return { applied, rejected };
}
