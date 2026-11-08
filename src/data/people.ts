// ─── Люди й команди, які працюють над локалізаціями ────────────
// Звідси будуються сторінки /team/ і /team/<slug>/, а також блок
// «Над локалізацією працювали» на сторінці кожної гри.
//
// Тут лише поточний склад команди. Щоб додати людину, допишіть запис у PEOPLE;
// `game` — це id гри з games.ts, `role` — що саме робить.
// Фото: файл src/assets/team/<slug>.(png|jpg|webp), інакше показуються ініціали.
// Порядок у списку = порядок на сторінці «Команда».

export interface Credit {
  game: string;
  role: string;
}
export interface Person {
  slug: string;
  name: string;
  /** Коротко про людину; показується на її сторінці */
  about?: string;
  /** Telegram, сайт тощо */
  link?: string;
  /** Не людина, а окрема команда-партнер */
  team?: boolean;
  credits: Credit[];
}

export const PEOPLE: Person[] = [
  {
    slug: "little-bit",
    name: "Літтл Біт",
    about: "Засновник «Little Bit». Перекладає й редагує, веде більшість проєктів команди.",
    link: "https://t.me/LittleBitUA",
    credits: [
      { game: "nmh3", role: "Переклад" },
      { game: "digging-a-hole", role: "Переклад і редактура" },
      { game: "hotel-barcelona", role: "Переклад і редактура" },
      { game: "dispatch", role: "Переклад і первинна редактура" },
      { game: "travis-strikes-again", role: "Переклад" },
      { game: "judgment", role: "Переклад і редактура" },
      { game: "yakuza-kiwami3", role: "Переклад і редактура" },
      { game: "yakuza-kiwami2", role: "Переклад" },
      { game: "lost-judgment", role: "Переклад" },
      { game: "lad-ishin", role: "Переклад" },
      { game: "dragon-quest-xi-s", role: "Переклад" },
      { game: "catherine-classic", role: "Переклад" },
    ],
  },
  {
    slug: "dmytro-bydlov",
    name: "Дмитро Бидлов",
    about: "Перекладач, редактор і технічна частина: розбирає ігри, вбудовує текст, робить нативні рекомпіляції.",
    credits: [
      { game: "uncharted-collection", role: "Переклад, редактура, технічна частина" },
      { game: "gravity-rush", role: "Переклад" },
      { game: "silent-hill-shattered-memories", role: "Переклад" },
      { game: "mixtape", role: "Переклад, редактура, інтеграція в гру" },
      { game: "dead-rising-deluxe-remaster", role: "Переклад, редактура, технічна частина" },
      { game: "metal-gear-solid-4", role: "Переклад, редактура, технічна частина" },
      { game: "metal-gear-mg2", role: "Переклад, редактура, технічна частина" },
      { game: "the-missing", role: "Переклад і редактура" },
      { game: "mgs-snake-eater", role: "Переклад і редактура" },
      { game: "resident-evil-requiem", role: "Переклад" },
      { game: "kingdom-hearts-3", role: "Переклад" },
      { game: "silent-hill-townfall", role: "Переклад" },
      { game: "dave-the-diver", role: "Переклад доповнення In The Jungle" },
      { game: "deadly-premonition-dc", role: "Переклад і нативна рекомпіляція" },
      { game: "deadly-premonition-2", role: "Переклад" },
      { game: "the-good-life", role: "Переклад" },
      { game: "fire-emblem-three-houses", role: "Переклад" },
    ],
  },
  {
    slug: "naumchas",
    name: "Дмитро Науменко «naumchas»",
    credits: [{ game: "kingdom-hearts-3", role: "Переклад і редактура" }],
  },
  {
    slug: "twentysix",
    name: "твентісікз",
    credits: [
      { game: "kingdom-hearts-3", role: "Переклад" },
      { game: "judgment", role: "Текстури" },
      { game: "yakuza-lad", role: "Текстури" },
    ],
  },
  {
    slug: "cherrybee",
    name: "CherryBee",
    credits: [
      { game: "yakuza-lad", role: "Переклад" },
      { game: "as-dusk-falls", role: "Переклад" },
      { game: "yakuza-kiwami2", role: "Переклад" },
    ],
  },
  {
    slug: "molfar",
    name: "мольфар",
    credits: [{ game: "jojo-asbr", role: "Текстури" }],
  },
  {
    slug: "mmartwy",
    name: "mmartwy",
    credits: [
      { game: "romeo-is-a-dead-man", role: "Текстури" },
      { game: "nmh1", role: "Текстури" },
      { game: "nmh2", role: "Текстури" },
      { game: "nmh3", role: "Текстури" },
      { game: "travis-strikes-again", role: "Текстури" },
    ],
  },
  {
    slug: "frogsll",
    name: "frogsll",
    credits: [{ game: "deadly-premonition-2", role: "Текстури" }],
  },
  {
    slug: "retnara",
    name: "Retnara",
    credits: [{ game: "nier-replicant", role: "Переклад з японського оригіналу" }],
  },
  {
    slug: "qxktrns",
    name: "Катріна «qxktrns»",
    credits: [{ game: "lad-infinite-wealth", role: "Переклад" }],
  },
  {
    slug: "olha-l",
    name: "Olha L",
    credits: [{ game: "the-good-life", role: "Переклад" }],
  },
  {
    slug: "svitchhh",
    name: "svitchhh",
    credits: [{ game: "silent-hill-downpour", role: "Переклад" }],
  },
];

/** Люди, які працювали над грою, з їхньою роллю саме в ній */
export function peopleOf(gameId: string): { person: Person; role: string }[] {
  return PEOPLE.flatMap((p) => p.credits.filter((c) => c.game === gameId).map((c) => ({ person: p, role: c.role })));
}

/** Ініціали для аватарки: «Дмитро Бидлов» → «ДБ», «tor» → «T» */
export function initialsOf(name: string): string {
  const words = name.replace(/[«»()"]/g, " ").split(/\s+/).filter((w) => /^\p{L}/u.test(w));
  const letters = words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] ?? "?").slice(0, 1);
  return letters.toUpperCase();
}

/** Стабільний відтінок аватарки за іменем */
export function hueOf(name: string): number {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) % 360;
  return h;
}
