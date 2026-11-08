// ─── Актуальні цифри поруч із текстом звіту ────────────────────
// Звіти хронології пишуться вручну й старіють, а відсотки з LBK Launcher
// оновлюються щодня. Тут порівнюємо цифри з тексту звіту з поточними,
// щоб біля застарілого уривка показати «зараз: …».
import type { Game } from "../data/games";
import { launcherSlugOf } from "./launcher";
import { stagesOf } from "../utils/status";

export interface Live {
  translation: number;
  editing: number | null;
  /** Цифри в тексті звіту відрізняються від поточних (або їх там немає взагалі) */
  differs: boolean;
}

const num = (s: string) => Math.round(parseFloat(s.replace(",", ".")));

/** Відсотки перекладу й редактури, названі в тексті звіту (перші згадки). */
function fromText(html: string): { t: number | null; e: number | null } {
  const text = html.replace(/<[^>]+>/g, "");
  const t = text.match(/перекладено(?: на)?\s*(?:приблизно\s*)?(\d+(?:,\d+)?)\s*%/i) ?? text.match(/переклад[^.;]{0,40}?(\d+(?:,\d+)?)\s*%/i);
  const e = text.match(/редакту?р[а-яі]*[^.;\d]{0,30}?(\d+(?:,\d+)?)\s*%/i) ?? text.match(/зредаговано[^.;\d]{0,15}?(\d+(?:,\d+)?)\s*%/i);
  return { t: t ? num(t[1]) : null, e: e ? num(e[1]) : null };
}

/**
 * Поточні цифри гри, якщо вони надходять із LBK Launcher (для ігор із ручними
 * цифрами повертає null — їм нема з чим звіряти). `html` — текст звіту про гру.
 */
export function liveNumbers(game: Game, html: string): Live | null {
  if (!launcherSlugOf(game) || game.launcherSync === false) return null;
  const stages = stagesOf(game);
  const translation = Math.round(game.progress);
  const ed = stages.find((s) => /редакт/i.test(s.label));
  const editing = ed ? Math.round(ed.percent) : null;
  const said = fromText(html);
  // В одному записі буває кілька ігор (Lost Judgment + Ishin, збірки KINGDOM HEARTS):
  // якщо поточний відсоток уже згадано в тексті — звіт не застарів
  const text = html.replace(/<[^>]+>/g, "");
  const mentioned = (n: number) => new RegExp(`(^|[^\\d,])${n}(,0+)?\\s*%`).test(text);
  const differs =
    (said.t != null && said.t !== translation && !mentioned(translation)) ||
    (said.e != null && editing != null && said.e !== editing && !mentioned(editing));
  return { translation, editing, differs };
}

export const liveLabel = (l: Live) =>
  `переклад ${l.translation}%` + (l.editing != null ? ` · редактура ${l.editing}%` : "");
