// ─── Chronology reports ────────────────────────────────────────
// Звіти лежать у src/data/chronology/РРРР-ММ-ДД.md (звичайний Markdown).
// Найсвіжіший показується на /chronology/, кожен — на /chronology/<дата>/.
//
// Як читається Markdown:
//   #      — заголовок звіту; абзац «Станом на…» замінюється датою з назви файлу
//   ##     — розділ, потрапляє в зміст
//   проміжні заголовки (рік, квартал, група) — вузли на лінії часу;
//             найвищий із них у розділі теж потрапляє в зміст
//   найглибший заголовок у розділі — картка гри.
//     «30 грудня — Назва · позначка» → дата, назва, позначка.
//     Назва шукається в GAME_IDS, щоб додати обкладинку й посилання.
//   ---    — усе після лінії стає приміткою внизу сторінки.

import { marked, type Token, type Tokens } from "marked";
import { games } from "../data/catalog";

// ── Назва в звіті → гра в каталозі ──
const GAME_IDS: Record<string, string> = {
  "As Dusk Falls": "as-dusk-falls",
  "No More Heroes 3": "nmh3",
  "A Game About Digging A Hole™": "digging-a-hole",
  "METAL GEAR SOLID 2: Sons of Liberty — Master Collection Version": "mgs2",
  "Uncharted: Drake’s Fortune": "uncharted1",
  "The MISSING: J.J. Macfield and the Island of Memories": "the-missing",
  "HOTEL BARCELONA": "hotel-barcelona",
  "Dispatch": "dispatch",
  "METAL GEAR & METAL GEAR 2: Solid Snake": "metal-gear-mg2",
  "METAL GEAR SOLID 4: Guns of the Patriots — Master Collection": "metal-gear-solid-4",
  "Dead Rising та Dead Rising Deluxe Remaster": "dead-rising-deluxe-remaster",
  "METAL GEAR SOLID 3: Snake Eater — Master Collection Version": "mgs3-master-collection",
  "Yakuza Kiwami 3 & Dark Ties": "yakuza-kiwami3",
  "METAL GEAR SOLID Δ: SNAKE EATER": "mgs-snake-eater",
  "KINGDOM HEARTS III + Re Mind (DLC)": "kingdom-hearts-3",
  "KINGDOM HEARTS III + Re Mind": "kingdom-hearts-3",
  "Judgment": "judgment",
  "KINGDOM HEARTS Birth by Sleep FINAL MIX": "kh-birth-by-sleep",
  "Mixtape": "mixtape",
  "JoJo’s Bizarre Adventure: All-Star Battle R": "jojo-asbr",
  "Catherine Classic": "catherine-classic",
  "Yakuza Kiwami 2": "yakuza-kiwami2",
  "Lost Judgment": "lost-judgment",
  "Like a Dragon: Ishin!": "lad-ishin",
  "Yakuza: Like a Dragon": "yakuza-lad",
  "KINGDOM HEARTS Re:Chain of Memories": "kh-rechain-of-memories",
  "KINGDOM HEARTS -HD 1.5+2.5 ReMIX-": "kingdom-hearts-1525",
  "METAL GEAR SOLID — Master Collection Version": "mgs1-master-collection",
  "METAL GEAR SOLID V: GROUND ZEROES": "mgsv-ground-zeroes",
  "Resident Evil Requiem": "resident-evil-requiem",
  "Silent Hill: Downpour": "silent-hill-downpour",
  "Deadly Premonition: The Director’s Cut": "deadly-premonition-dc",
  "Travis Strikes Again: No More Heroes": "travis-strikes-again",
  "Deadly Premonition 2: A Blessing in Disguise": "deadly-premonition-2",
  "The Good Life": "the-good-life",
  "Silent Hill: Shattered Memories": "silent-hill-shattered-memories",
  "Fire Emblem: Three Houses": "fire-emblem-three-houses",
  "Uncharted 2: Among Thieves": "uncharted2",
  "DAVE THE DIVER: In The Jungle": "dave-the-diver",
  "NieR Replicant™ ver.1.22474487139...": "nier-replicant",
  "Silent Hill: Townfall": "silent-hill-townfall",
  "Like a Dragon: Infinite Wealth": "lad-infinite-wealth",
};
// Довші назви перевіряємо першими («… Re Mind (DLC)» раніше за «… Re Mind»)
const KNOWN = Object.keys(GAME_IDS).sort((a, b) => b.length - a.length);
const gameById = new Map(games.map((g) => [g.id, g]));
type CatalogGame = (typeof games)[number];

// ── Допоміжне ──
const plain = (text: string) => text.replace(/\*\*|__|\*/g, "");
export const slug = (text: string) =>
  text.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/gi, "-").replace(/^-|-$/g, "");
const isHeading = (t: Token, depth?: number): t is Tokens.Heading =>
  t.type === "heading" && (depth === undefined || (t as Tokens.Heading).depth === depth);

/** Підсвічує відсотки й суми в гривнях у тексті HTML (не чіпаючи теги й атрибути). */
function highlightNumbers(html: string): string {
  const re = /(\d[\d   ]*(?:[.,]\d+)?\s?%|\d[\d   ]*\s?₴)/g;
  return html
    .replace(/>([^<]+)</g, (_, text: string) => ">" + text.replace(re, '<span class="hl">$1</span>') + "<")
    .replace(/<strong>([^<]*<span class="hl">[^<]*<\/span>[^<]*)<\/strong>/g, '<strong class="hl">$1</strong>');
}

/** Абзаци, що говорять про реальний збір коштів (а не «збору не було»). */
function mentionsFundraising(text: string): boolean {
  return text
    .split(/[.:;!?]/)
    .some(
      (s) =>
        // «збір», «збору», «зборів», «зібрано» — але не «збірка»
        (/₴/.test(s) || /(^|[^а-яіїєґ])(збір(?!к)|збор[уаіо]\S*|зібрано)/i.test(s)) &&
        !/не\s+(було|проводили|збирали|планують|планується|планували)|немає|без\s+збору|збору не|зборів не|відсутн|можлив|майбутн/i.test(s),
    );
}

// ── Типи ──
export type EntryKind = "released" | "updated" | "upcoming";
export interface Entry {
  id: string;
  date: string | null;
  title: string;
  note: string | null;
  game?: CatalogGame;
  html: string;
  kind: EntryKind;
  earlyAccess: boolean;
  fundraising: boolean;
  search: string;
}
export type Item =
  | { kind: "node"; level: 1 | 2; text: string; id: string }
  | { kind: "summary"; html: string }
  | { kind: "entry"; entry: Entry };
export interface Section { id: string; title: string; short: string; lead: string; items: Item[]; toc: { id: string; text: string }[] }
export interface Report {
  date: string; // РРРР-ММ-ДД
  dateLabel: string; // «27 вересня 2026 року»
  title: string;
  intro: string[];
  sections: Section[];
  footnote: string;
  entries: Entry[];
}

/** «30 грудня — Назва · позначка» → дата, назва, позначка, гра */
function parseEntryTitle(raw: string) {
  const text = plain(raw).trim();
  const m = text.match(/^(\d{1,2}\s+[а-яіїєґʼ’']+)\s+—\s+(.+)$/i);
  const date = m ? m[1] : null;
  const rest = m ? m[2] : text;
  const known = KNOWN.find((k) => rest === k || rest.startsWith(k + " "));
  const title = known ?? rest.split(/\s+·\s+/)[0];
  const note = rest.slice(title.length).replace(/^\s*[—·]\s*/, "").trim() || null;
  return { date, title, note, game: known ? gameById.get(GAME_IDS[known]) : undefined };
}

/** Тип розділу за назвою: вийшло / оновлюється / ще не вийшло. */
function sectionKind(title: string, index: number): EntryKind {
  if (/не вийшли|заплан/i.test(title)) return "upcoming";
  if (/оновлен|триває робота|над якими/i.test(title)) return "updated";
  return index === 0 ? "released" : "updated";
}

const formatReportDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" }).replace(/ р\.$/, " року");

export function parseReport(source: string, date: string): Report {
  const all = marked.lexer(source);
  const render = (list: Token[]) => highlightNumbers(String(marked.parser(Object.assign([...list], { links: all.links }))));
  const inline = (text: string) => highlightNumbers(String(marked.parseInline(text)));

  const hrAt = all.map((t) => t.type).lastIndexOf("hr");
  const main = hrAt >= 0 ? all.slice(0, hrAt) : all;
  const footnote = hrAt >= 0 ? render(all.slice(hrAt + 1)) : "";

  const title = (main.find((t) => isHeading(t, 1)) as Tokens.Heading | undefined)?.text ?? "Хронологія";
  const firstH2 = main.findIndex((t) => isHeading(t, 2));
  const intro = main
    .slice(0, firstH2 < 0 ? main.length : firstH2)
    .filter((t): t is Tokens.Paragraph => t.type === "paragraph")
    .filter((p) => !/^\*{0,2}станом на/i.test(p.text.trim()))
    .map((p) => inline(p.text));

  const sections: Section[] = [];
  const entries: Entry[] = [];
  const usedIds = new Set<string>();
  const uniqueId = (base: string) => {
    let id = base;
    for (let n = 2; usedIds.has(id); n++) id = `${base}-${n}`;
    usedIds.add(id);
    return id;
  };

  const rest = main.slice(Math.max(firstH2, 0));
  const starts = rest.flatMap((t, i) => (isHeading(t, 2) ? [i] : []));
  for (const [n, start] of starts.entries()) {
    const chunk = rest.slice(start, starts[n + 1] ?? rest.length);
    const h2 = chunk[0] as Tokens.Heading;
    const body = chunk.slice(1).filter((t) => t.type !== "space");
    const depths = [...new Set(body.filter((t) => isHeading(t)).map((t) => (t as Tokens.Heading).depth))].sort();
    const entryDepth = depths.length ? depths[depths.length - 1] : 99;
    const topDepth = depths.length > 1 ? depths[0] : 99;
    const kind = sectionKind(h2.text, n);

    const section: Section = {
      id: uniqueId(slug(h2.text)),
      title: h2.text,
      // Коротка назва для мобільної навігації: до коми або перші три слова
      short: h2.text.split(/,|\s+або\s+/)[0].split(/\s+/).slice(0, 3).join(" "),
      lead: "",
      items: [],
      toc: [],
    };
    let i = 0;
    const leadTokens: Token[] = [];
    while (i < body.length && !isHeading(body[i])) leadTokens.push(body[i++]);
    section.lead = render(leadTokens);

    while (i < body.length) {
      const h = body[i++] as Tokens.Heading;
      const content: Token[] = [];
      while (i < body.length && !isHeading(body[i])) content.push(body[i++]);
      if (h.depth === entryDepth) {
        const head = parseEntryTitle(h.text);
        const rawText = content.map((t) => ("raw" in t ? t.raw : "")).join(" ");
        const entry: Entry = {
          ...head,
          id: uniqueId(head.game?.id ?? slug(head.title)),
          html: render(content),
          kind,
          earlyAccess: /ранн\S* доступ/i.test(`${head.note ?? ""} ${rawText}`),
          fundraising: mentionsFundraising(plain(rawText)),
          search: plain(`${head.title} ${head.note ?? ""} ${rawText}`).toLowerCase(),
        };
        entries.push(entry);
        section.items.push({ kind: "entry", entry });
      } else {
        const level = h.depth === topDepth ? 1 : 2;
        const id = uniqueId(`${section.id}-${slug(h.text)}`);
        section.items.push({ kind: "node", level, text: plain(h.text), id });
        if (level === 1) section.toc.push({ id, text: plain(h.text) });
        if (content.length) section.items.push({ kind: "summary", html: render(content) });
      }
    }
    sections.push(section);
  }

  return { date, dateLabel: formatReportDate(date), title, intro, sections, footnote, entries };
}

// ── Усі звіти ──
const files = import.meta.glob("../data/chronology/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export const reports: Report[] = Object.entries(files)
  .map(([path, source]) => ({ date: path.match(/(\d{4}-\d{2}-\d{2})\.md$/)?.[1], source }))
  .filter((r): r is { date: string; source: string } => !!r.date)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((r) => parseReport(r.source, r.date));

export const latestReport: Report | undefined = reports[0];

// Ігри, описані у звіті разом з іншою грою
const SHARED_ENTRY: Record<string, string> = {
  "dead-rising": "dead-rising-deluxe-remaster",
  "lad-ishin": "lost-judgment",
};

/** Запис гри в найсвіжішому звіті (для блоку «Стан проєкту» на сторінці гри). */
export function chronologyEntry(gameId: string): Entry | null {
  const id = SHARED_ENTRY[gameId] ?? gameId;
  return latestReport?.entries.find((e) => e.game?.id === id) ?? null;
}

/** Якір гри в найсвіжішому звіті. */
export function chronologyAnchor(gameId: string): string | null {
  const entry = chronologyEntry(gameId);
  return entry ? `/chronology/#${entry.id}` : null;
}
