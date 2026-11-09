// ─── Люди й команди, які працюють над локалізаціями ────────────
// Звідси будуються сторінки /team/ і /team/<slug>/, а також блок
// «Над локалізацією працювали» на сторінці кожної гри.
//
// На сторінці «Команда» — лише поточний склад. Люди з позначкою `guest` (колишні
// учасники й ті, хто допомагав з окремими проєктами) показуються тільки на
// сторінках ігор, у списку команди їх немає. `from` — назва іншої команди, якщо
// людина не з «Little Bit». Щоб додати людину, допишіть запис у PEOPLE;
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
  /** Не в поточному складі: показується лише на сторінках ігор */
  guest?: boolean;
  /** Людина з іншої команди (не «Little Bit») */
  from?: string;
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
      { game: "lad-ishin", role: "Переклад, редагування" },
      { game: "yakuza3", role: "Переклад" },
      { game: "catherine-classic", role: "Переклад" },
    ],
  },
  {
    slug: "dmytro-bydlov",
    name: "Дмитро Бидлов",
    about: "Перекладач, редактор і технічна частина: розбирає ігри, вбудовує текст, робить нативні рекомпіляції.",
    credits: [
      { game: "uncharted-collection", role: "Переклад, редактура, технічна частина" },
      { game: "gravity-rush", role: "Переклад, технічна частина" },
      { game: "gravity-rush-2", role: "Переклад, технічна частина" },
      { game: "killer-is-dead", role: "Переклад, технічна частина" },
      { game: "shadows-of-the-damned", role: "Переклад, технічна частина" },
      { game: "uncharted-golden-abyss", role: "Переклад, технічна частина" },
      { game: "silent-hill-shattered-memories", role: "Переклад" },
      { game: "mixtape", role: "Переклад, редактура, інтеграція в гру" },
      { game: "dead-rising-deluxe-remaster", role: "Переклад, редактура, технічна частина" },
      { game: "dead-rising", role: "Переклад" },
      { game: "shenmue", role: "Переклад, редактура, технічна частина" },
      { game: "as-dusk-falls", role: "Технічна частина" },
      { game: "yakuza-kiwami3", role: "Технічна частина" },
      { game: "mgsv-ground-zeroes", role: "Переклад, редактура, технічна частина" },
      { game: "mgs1-master-collection", role: "Переклад, редагування, технічна частина" },
      { game: "silent-hill-downpour", role: "Первинний переклад" },
      { game: "jojo-asbr", role: "Редагування" },
      { game: "lost-judgment", role: "Технічна частина" },
      { game: "cat-quest", role: "Керівництво проєкту" },
      { game: "i-am-fish", role: "Керівництво проєкту, технічна частина" },
      { game: "tmnt-shredders-revenge", role: "Керівництво проєкту" },
      { game: "kingdom-hearts-1525", role: "Переклад, технічна частина" },
      { game: "kh-rechain-of-memories", role: "Переклад, технічна частина" },
      { game: "kh-birth-by-sleep", role: "Переклад, технічна частина" },
      { game: "kh-dream-drop-distance", role: "Переклад, технічна частина" },
      { game: "kingdom-hearts-2", role: "Переклад, технічна частина" },
      { game: "metal-gear-solid-4", role: "Переклад, редактура, технічна частина" },
      { game: "metal-gear-mg2", role: "Переклад, редактура, технічна частина" },
      { game: "the-missing", role: "Переклад і редактура" },
      { game: "mgs-snake-eater", role: "Переклад і редактура" },
      { game: "resident-evil-requiem", role: "Переклад, технічна частина" },
      { game: "romeo-is-a-dead-man", role: "Переклад" },
      { game: "dragon-quest-xi-s", role: "Переклад, технічна частина" },
      { game: "nmh1", role: "Переклад" },
      { game: "nmh2", role: "Переклад" },
      { game: "nmh3", role: "Переклад" },
      { game: "travis-strikes-again", role: "Переклад" },
      { game: "kingdom-hearts-3", role: "Переклад" },
      { game: "silent-hill-townfall", role: "Переклад" },
      { game: "dave-the-diver", role: "Переклад доповнення In The Jungle" },
      { game: "deadly-premonition-dc", role: "Переклад і нативна рекомпіляція" },
      { game: "deadly-premonition-2", role: "Переклад, редагування, технічна частина" },
      { game: "the-good-life", role: "Переклад, технічна частина, редагування" },
      { game: "fire-emblem-three-houses", role: "Переклад, технічна частина, подальше редагування" },
      { game: "lad-infinite-wealth", role: "Технічна частина" },
    ],
  },
  {
    slug: "naumchas",
    name: "Дмитро Науменко «naumchas»",
    credits: [
      { game: "kingdom-hearts-3", role: "Переклад і редактура" },
      { game: "kingdom-hearts-1525", role: "Переклад" },
      { game: "kh-rechain-of-memories", role: "Переклад" },
      { game: "kh-birth-by-sleep", role: "Переклад" },
      { game: "kh-dream-drop-distance", role: "Переклад" },
      { game: "kingdom-hearts-2", role: "Переклад" },
    ],
  },
  {
    slug: "twentysix",
    name: "твентісікз",
    credits: [
      { game: "kingdom-hearts-3", role: "Переклад" },
      { game: "nmh3", role: "Текстури" },
      { game: "judgment", role: "Текстури" },
      { game: "yakuza-lad", role: "Текстури" },
      { game: "cat-quest", role: "Тестування" },
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
    slug: "gromik",
    name: "Давид Gromik",
    credits: [{ game: "fire-emblem-three-houses", role: "Переклад" }],
  },
  {
    slug: "tonelicoaesc",
    name: "tonelicoaesc",
    credits: [{ game: "fire-emblem-three-houses", role: "Переклад" }],
  },
  {
    slug: "molfar",
    name: "мольфар",
    credits: [{ game: "jojo-asbr", role: "Текстури" }],
  },
  {
    slug: "mmartwy",
    name: "mmartwy",
    about:
      "За освітою — вчителька образотворчого мистецтва й дизайнерка, у майбутньому — реставраторка та скульпторка (амінь). Має власні переклади: Slime Rancher 2, I Have No Mouth, and I Must Scream, Leaf It Alone, MyVoiceZoo. Співпрацює з CatLocTeam як тестувальниця й художниця текстур, а ще — один із голосів їхнього TikTok-акаунта. Разом із компанією друзів розробляє власну фентезі-гру, яка обов’язково колись вийде (амінь).",
    credits: [
      { game: "romeo-is-a-dead-man", role: "Текстури" },
      { game: "nmh1", role: "Текстури" },
      { game: "nmh2", role: "Текстури" },
      { game: "nmh3", role: "Текстури" },
      { game: "travis-strikes-again", role: "Текстури" },
      { game: "dragon-quest-xi-s", role: "Текстури" },
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
    about: "Перекладачка за фахом. Інші переклади: Of Blades & Tails, Ravenlok, Echo Generation, Sealed Bite, Felvidek (редактура).",
    credits: [
      { game: "nier-replicant", role: "Переклад з японського оригіналу" },
      { game: "cat-quest", role: "Переклад і літературна редактура" },
      { game: "tmnt-shredders-revenge", role: "Літературна редактура" },
    ],
  },
  {
    slug: "qxktrns",
    name: "Катріна «qxktrns»",
    about: "Студентка спеціальності «Англійська філологія», лише починає свій шлях у перекладі.",
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
    about:
      "Навчається на англійсько-іспанському перекладі у Львівському національному університеті імені Івана Франка. Має досвід художнього перекладу: її переклад оповідання Баррі Пейна «The End of the Show» опубліковано в журналі «Дзвін». Також співпрацювала з видавництвом RM Publishing як критична читачка. Захоплюється літературою, відеоіграми й театром.",
    credits: [{ game: "silent-hill-downpour", role: "Переклад" }],
  },
  {
    slug: "madao",
    name: "Мадао",
    about: "Ν. Ν.\n13歳くらいの頃だった\n村のはずれで羊の子を飼っていた\n太陽がさんさんと照っていたからだろうか\nそれともわたしにはたくさんのものがあったからだろうか\nわたしはとても楽しくなった\n神様のみもとにいるかのように.......\nすでに食事の時が告げられていたけれど\nわたしは雑草のなかで\n神に祈っていた･･･\n小さなわたしにそのとき\nなぜお祈りがかくも快く感じられたのか\n楽しく思われたのか わたしにはわからない\n空も村も羊の子も\nわたしには楽しそうに思われたものだ!\n太陽は暖かだったが焼けつくほどではなかった!\nだが暖かだったのは束の間のこと\n祈っていたのは束の間のこと･･･\nじりじり焼けつき 灼熱し\n楽園は燃え上がった\nふと気が付いて眺めると\n村は焼け焦げ\n空の青さは薄れ\n輝きは失なわれた\n羊の子を眺めると\nもうあの羊の子ではない\n家の方を振り返ると\nもうそこにはわたしの家はない!\n神はわたしに何もくださらなかったのだ!･･･\n涙がどっと流れ落ちた\n苦い涙が!･･･\nひとりの娘が わたしのそばの\n道のほとりで\n麻の茎を引き抜いていた\n娘はわたしの涙に気がついた\n近づいて来ると微笑んで\nわたしの涙を拭き取りながら頬に口づけしてくれた......\n太陽が輝きだしたかのようだった\nこの世の全てがわたしのものになったかのようだった\n畑も灌木の林も 果樹園も!･･･\nわたしと娘は陽気に喋りながら追っていった他人の羊を水辺まで\n悲しいことだ!･･･ 今にいたるも\n思い出すたび心は痛み泣けて来る\nなぜ神はお許しにならなかったのだろうか\nあの楽園で\nせめて一時なりと暮らすのを\n死んだほうがよかったのだ畑を耕しながら\nこの世で何も知らずにいればよかったのだ\n賢しげな人間になりたくなかった\nわたしは人さまも神も呪ったことがない!\n[1847年後半\nオルスク要塞にて]",
    from: "TypeUkraine",
    guest: true,
    credits: [{ game: "resident-evil-requiem", role: "Переклад з японської" }],
  },

  // ── Не в поточному складі: лише в титрах ігор ──
  { slug: "mrikso", name: "MrIkso", guest: true, credits: [
    { game: "lad-ishin", role: "Технічна частина" },
    { game: "nier-replicant", role: "Технічна частина" },
    { game: "mgs2", role: "Технічна частина й шрифти" },
    { game: "jojo-asbr", role: "Технічна частина" },
  ] },
  { slug: "vadko", name: "vadko", guest: true, credits: [{ game: "jojo-asbr", role: "Переклад" }] },
  { slug: "tor", name: "tor", guest: true, credits: [
    { game: "nmh3", role: "Шрифти" },
    { game: "hotel-barcelona", role: "Шрифти" },
    { game: "lost-judgment", role: "Шрифти" },
  ] },
  { slug: "yuliia-naturkach", name: "Юлія Натуркач", guest: true, credits: [
    { game: "dispatch", role: "Літературна редактура перших двох епізодів" },
    { game: "mgs3-master-collection", role: "Літературна редактура" },
  ] },
  { slug: "kyrylo-boldyriev", name: "Кирило Болдирєв", guest: true, credits: [
    { game: "mgs3-master-collection", role: "Літературна редактура" },
    { game: "gravity-rush", role: "Ініціатива й тестування" },
  ] },
  { slug: "mimotw", name: "Марія «Mimotw» Єфіменко", guest: true, credits: [
    { game: "kingdom-hearts-3", role: "Шрифти" },
    { game: "the-missing", role: "Графіка" },
    { game: "cat-quest", role: "Шрифти" },
    { game: "i-am-fish", role: "Шрифти" },
  ] },
  { slug: "tsunderman", name: "tsunderman", guest: true, credits: [{ game: "yakuza-kiwami2", role: "Літературна редактура, звірка з японським текстом" }] },
  { slug: "kostyanchek8", name: "kostyanchek8", from: "Перекладач Патріотів", guest: true, credits: [
    { game: "mgs2", role: "Переклад" },
    { game: "mgs-snake-eater", role: "Переклад" },
  ] },
  { slug: "shprot", name: "Богдан «Чеширський Шпрот»", from: "УкрКонсервЗавод", guest: true, credits: [
    { game: "mgs3-master-collection", role: "Переклад" },
    { game: "i-am-fish", role: "Переклад і редактура" },
  ] },
  { slug: "godresky", name: "Андрій «Godresky»", guest: true, credits: [{ game: "mgs3-master-collection", role: "Переклад" }] },
  { slug: "frayziken", name: "Максим «Frayziken»", guest: true, credits: [{ game: "mgs3-master-collection", role: "Переклад" }] },
  { slug: "dildo", name: "ДІЛДО", guest: true, credits: [{ game: "silent-hill-townfall", role: "Переклад" }] },
  { slug: "semon99", name: "semon99", guest: true, credits: [{ game: "silent-hill-townfall", role: "Переклад" }] },
  { slug: "nazarii-poslushniak", name: "Nazarii Poslushniak", guest: true, credits: [{ game: "silent-hill-townfall", role: "Переклад" }] },
  { slug: "funfy", name: "Микита «Funfy» Захаров", guest: true, credits: [
    { game: "the-missing", role: "Графіка" },
    { game: "cat-quest", role: "Текстури" },
    { game: "i-am-fish", role: "Текстури" },
  ] },
  { slug: "denys-tarnavskyi", name: "Денис Тарнавський", guest: true, credits: [{ game: "cat-quest", role: "Тестування" }] },
  { slug: "v-orbit-v", name: "Назарій «V_Orbit_V» Васильковський", guest: true, credits: [{ game: "cat-quest", role: "Тестування" }] },
  { slug: "feostyle", name: "Олексій «Feostyle»", guest: true, credits: [{ game: "tmnt-shredders-revenge", role: "Переклад" }] },
  { slug: "froghus", name: "Денис «FrogHus» Решетілов", guest: true, credits: [{ game: "the-missing", role: "Графіка" }] },
  { slug: "solomon-kane", name: "Соломон Кейн", guest: true, credits: [{ game: "shadows-of-the-damned", role: "Шрифти" }] },
  { slug: "tenamio", name: "Tenamio", guest: true, credits: [
    { game: "travis-strikes-again", role: "Тестування" },
    { game: "tmnt-shredders-revenge", role: "Переклад" },
  ] },
  { slug: "dark-valeriiovych", name: "Дарк Валерійович", guest: true, credits: [{ game: "metal-gear-solid-4", role: "Тестування" }] },
  { slug: "solovina-komanda", name: "Солов’їна команда", team: true, guest: true, about: "Команда, яку очолює Дмитро Бидлов.", credits: [
    { game: "mgs-snake-eater", role: "Переклад" },
    { game: "mgs3-master-collection", role: "Оригінальний переклад, перенесений у Master Collection" },
    { game: "persona-5-royal", role: "Переклад" },
    { game: "dave-the-diver", role: "Переклад" },
    { game: "cat-quest", role: "Переклад" },
    { game: "florence", role: "Переклад" },
    { game: "i-am-fish", role: "Переклад" },
    { game: "tmnt-shredders-revenge", role: "Переклад" },
    { game: "kingdom-hearts-1525", role: "Переклад" },
  ] },
  { slug: "locus-team", name: "Locus Team", team: true, guest: true, about: "Команда-партнер.", credits: [{ game: "catherine-classic", role: "Переклад" }] },
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
