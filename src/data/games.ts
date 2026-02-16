// ─── Game Data ───────────────────────────────────────────────
// Central data source for all localization projects.
// Sourced from lbklauncher.com/games?authors=Little+Bit

export type GameStatus = "planned" | "in-progress" | "early-access" | "fundraising" | "done";

/** Localization work stage */
export type LocalizationStage =
  | "Переклад"
  | "Редактура"
  | "Текстури"
  | "Готово";

export interface StageDetail {
  label: string;
  percent: number;
}

/** Team member information */
export interface TeamMember {
  name: string;
  role: string; // "Перекладач", "Редактор", "Тестувальник", etc.
  link?: string; // Link to profile (Telegram, GitHub, etc.)
}

/** Progress history entry for tracking changes over time */
export interface ProgressEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  progress: number; // 0-100
  milestone?: string; // Optional milestone description
}

/** Translation statistics */
export interface TranslationStats {
  totalLines?: number;
  translatedLines?: number;
  totalWords?: number;
  totalCharacters?: number;
}

export interface Game {
  id: string;
  title: string;
  series?: string;
  description: string;
  cover: string;
  progress: number; // 0–100
  status: GameStatus;
  stage?: LocalizationStage;
  stageDetails?: StageDetail[];
  tags: string[];
  steamUrl?: string;
  downloadUrl?: string;
  donateUrl: string;
  fundraisingRaised?: number;
  fundraisingGoal?: number;
  lastUpdate?: string;

  // ── Detail Pages Data ──
  screenshots?: string[]; // Paths to translation screenshots
  installInstructions?: string; // Markdown instructions
  team?: TeamMember[]; // Translation team
  detailedDescription?: string; // Extended description for detail page
  releaseDate?: string; // Release date (YYYY-MM-DD)
  gameYear?: number; // Original game release year

  // ── Progress Tracker Data ──
  progressHistory?: ProgressEntry[]; // Historical progress data
  stats?: TranslationStats; // Translation statistics

  // ── Search & Filters Data ──
  genre?: string[]; // Game genres
  platform?: string[]; // Platforms (PC, PlayStation, Xbox, Switch)
  translationSize?: "small" | "medium" | "large"; // Translation project size
}

/** Stage badge color mapping */
export const STAGE_COLORS: Record<LocalizationStage, string> = {
  "Переклад": "text-steam-blue",
  "Редактура": "text-yellow-400",
  "Текстури": "text-orange-400",
  "Готово": "text-steam-green",
};

/** Human-readable status labels in Ukrainian */
export const STATUS_LABELS: Record<GameStatus, string> = {
  planned: "Заплановано",
  "in-progress": "У процесі",
  "early-access": "Ранній доступ",
  fundraising: "Збір коштів",
  done: "Готово",
};

/** Status badge color mapping */
export const STATUS_COLORS: Record<GameStatus, string> = {
  planned: "bg-steam-gold/20 text-steam-gold border-steam-gold/30",
  "in-progress": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "early-access": "bg-steam-blue/20 text-steam-blue border-steam-blue/30",
  fundraising: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  done: "bg-steam-green/20 text-steam-green border-steam-green/30",
};

/** All game localization projects */
export const games: Game[] = [
  // ── Done (100%) ───────────────────────────────────────────
  {
    id: "nmh1",
    title: "No More Heroes",
    series: "No More Heroes",
    description:
      "Тревіс Тачдаун — найкрутіший кілер у Санта-Дестрой. Безумний екшен із катаною, рейтингами вбивць і неповторним стилем Суди51.",
    cover: "/images/nmh1.jpg",
    progress: 100,
    status: "done",
    stage: "Готово",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 100 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Action", "Hack and Slash", "Аркада"],
    steamUrl: "https://store.steampowered.com/app/1420290/No_More_Heroes/",
    downloadUrl: "https://lbklauncher.com/games/no_more_heroes/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-10",

    // Extended data
    releaseDate: "2026-02-10",
    detailedDescription: "Культова гра від Suda51 тепер українською! Тревіс Тачдаун вирушає у божевільну подорож, щоб стати найкращим кілером Санта-Дестрой. Стиль, екшен, абсурдний гумор — усе, що робить цю гру легендарною.",
    gameYear: 2007,
    genre: ["Action", "Hack and Slash", "Аркада"],
    platform: ["PC", "Switch"],
    translationSize: "medium",
    screenshots: [
      "/images/screenshots/nmh-battle.jpg",
      "/images/screenshots/nmh-dialog.jpg"
    ],
    team: [
      { name: "Little Bit Team", role: "Переклад", link: "https://t.me/LittleBitUA" }
    ],
    installInstructions: `## Встановлення локалізації No More Heroes

### Через LBK Launcher (найпростіше)
1. Встановіть [LBK Launcher](https://lbklauncher.com/)
2. Знайдіть No More Heroes у списку
3. Натисніть "Встановити"
4. Запускайте гру!

### Ручне встановлення
1. [Завантажте патч](https://lbklauncher.com/games/no_more_heroes/little-bit)
2. Розпакуйте в папку гри
3. Запустіть гру через Steam`,
    progressHistory: [
      { date: "2025-06-01", progress: 0, milestone: "Початок проєкту" },
      { date: "2025-07-15", progress: 30, milestone: "Переклад основних діалогів" },
      { date: "2025-09-01", progress: 60, milestone: "Переклад усіх босів" },
      { date: "2025-11-15", progress: 85, milestone: "Завершено переклад" },
      { date: "2026-01-20", progress: 95, milestone: "Редактура" },
      { date: "2026-02-10", progress: 100, milestone: "Реліз!" }
    ],
    stats: {
      totalLines: 8250,
      translatedLines: 8250,
      totalWords: 95000,
      totalCharacters: 450000
    }
  },

  // ── Early Access / In Progress ───────────────────────────
  {
    id: "dispatch",
    title: "Dispatch",
    description:
      "Інтерактивний наратив у стилі коміксу. Розслідуй злочини та приймай рішення, що змінюють сюжет.",
    cover: "/images/dispatch.jpg",
    progress: 90,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 90 },
      { label: "Редактура", percent: 30 },
    ],
    tags: ["Пригоди", "Візуальна новела", "Інді"],
    steamUrl: "https://store.steampowered.com/app/2592160/Dispatch/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-08",

    // Extended data
    detailedDescription: "Станьте диспетчером поліції та керуйте екстреними викликами. Кожне ваше рішення впливає на долі людей. Унікальна стилістика коміксу та нелінійний сюжет.",
    gameYear: 2024,
    genre: ["Пригоди", "Симулятор", "Візуальна новела"],
    platform: ["PC"],
    translationSize: "small",
    team: [
      { name: "Little Bit Team", role: "Переклад та адаптація" }
    ],
    progressHistory: [
      { date: "2026-01-10", progress: 50, milestone: "Почато переклад" },
      { date: "2026-01-25", progress: 75, milestone: "Перші два епізоди" },
      { date: "2026-02-08", progress: 90, milestone: "Редактура" }
    ],
    stats: {
      totalLines: 3500,
      translatedLines: 3150,
      totalWords: 42000,
      totalCharacters: 210000
    }
  },
  {
    id: "uncharted1",
    title: "Uncharted: Drake's Fortune",
    series: "Uncharted",
    description:
      "Натан Дрейк вирушає на пошуки скарбів Ель Дорадо. Перша частина культової пригодницької серії — тепер українською.",
    cover: "/images/uncharted1.png",
    progress: 90,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 90 },
      { label: "Редактура", percent: 50 },
    ],
    tags: ["Action", "Пригоди", "Шутер"],
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "judgment",
    title: "Judgment",
    series: "Judgment",
    description:
      "Детективний екшен від творців Yakuza. Такаюкі Яґамі розслідує серію вбивств у Камуро-чьо.",
    cover: "/images/judgment.jpg",
    progress: 90,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 90 },
      { label: "Редактура", percent: 60 },
    ],
    tags: ["Action", "RPG", "Детектив", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/2058180/Judgment/",
    downloadUrl: "https://lbklauncher.com/games/judgment/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-06",
  },
  {
    id: "yakuza-kiwami2",
    title: "Yakuza Kiwami 2",
    series: "Yakuza",
    description:
      "Повний текстовий переклад гри українською та українізовані текстури. Усе — від сюжету й побічних активностей до інтерфейсу, підказок.",
    cover: "/images/yakuza-kiwami2-new.jpg",
    progress: 95,
    status: "in-progress",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 95 },
      { label: "Редактура", percent: 10 },
      { label: "Текстури", percent: 30 },
    ],
    tags: ["Action", "RPG", "Пригоди", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/927380/Yakuza_Kiwami_2/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",

    // Extended data
    detailedDescription: "Продовження історії Кадзуми Кір'ю. Рік після подій першої Yakuza Kiwami. Війна між кланами Тодзьо та Омі загрожує спалахнути знову. Перероблена гра на Dragon Engine із покращеною графікою та геймплеєм.",
    gameYear: 2017,
    genre: ["Action", "RPG", "Beat 'em up", "Відкритий світ"],
    platform: ["PC", "PlayStation", "Xbox"],
    translationSize: "large",
    screenshots: [
      "/images/screenshots/yk2-dialog.jpg",
      "/images/screenshots/yk2-menu.jpg",
      "/images/screenshots/yk2-combat.jpg"
    ],
    team: [
      { name: "Little Bit Team", role: "Переклад та редакція" }
    ],
    installInstructions: `## Встановлення патчу Yakuza Kiwami 2

### Через LBK Launcher (рекомендовано)
1. Завантажте та встановіть [LBK Launcher](https://lbklauncher.com/)
2. Запустіть лаунчер та знайдіть Yakuza Kiwami 2 у списку
3. Натисніть "Встановити локалізацію"
4. Запускайте гру через Steam як зазвичай

### Ручне встановлення
1. Завантажте останню версію патчу
2. Розпакуйте архів у папку з грою
3. Підтвердіть заміну файлів
4. Готово! Запускайте гру

**Важливо:** Патч працює з версією гри Steam.`,
    progressHistory: [
      { date: "2025-08-01", progress: 45, milestone: "Почато переклад основної історії" },
      { date: "2025-09-15", progress: 60, milestone: "Завершено переклад основних місій" },
      { date: "2025-11-01", progress: 75, milestone: "Перекладено побічні активності" },
      { date: "2025-12-20", progress: 85, milestone: "Почато редактуру" },
      { date: "2026-01-15", progress: 90, milestone: "Завершено редагування основного сюжету" },
      { date: "2026-02-16", progress: 95, milestone: "Фінальна редактура та текстури" }
    ],
    stats: {
      totalLines: 43903,
      translatedLines: 41708, // 95% від 43903
      totalWords: 169221,
      totalCharacters: 930716 // Приблизно totalWords * 5.5
    }
  },
  {
    id: "yakuza-lad",
    title: "Yakuza: Like a Dragon",
    series: "Yakuza",
    description:
      "Yakuza: Like a Dragon — нова глава серії з іншим героєм і свіжим підходом. Ічібан Касуґа виходить на волю після довгих років і опиняється в світі, де його зрадили й списали з рахунків. Попереду — Йокоґама, нові друзі, дивакуваті підробітки та велика кримінальна змова, а всі розбірки тут вирішуються вже в покрокових боях у стилі JRPG.",
    cover: "/images/yakuza-lad.jpg",
    progress: 33,
    status: "fundraising",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 33 },
      { label: "Текстури", percent: 30 },
    ],
    tags: ["RPG", "JRPG", "Покрокова", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/1235140/Yakuza_Like_a_Dragon/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    fundraisingRaised: 33900,
    fundraisingGoal: 35000,
    lastUpdate: "2026-02-16",
  },
  {
    id: "nmh3",
    title: "No More Heroes 3",
    series: "No More Heroes",
    description:
      "Фінальна частина трилогії. Тревіс бореться з інопланетними суперзлодіями у найбожевільнішій грі серії.",
    cover: "/images/nmh3.jpg",
    progress: 98,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 98 },
      { label: "Редактура", percent: 60 },
      { label: "Текстури", percent: 60 },
    ],
    tags: ["Action", "Hack and Slash", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/1744330/No_More_Heroes_3/",
    downloadUrl: "https://lbklauncher.com/games/no_more_heroes_3/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-14",
  },
  {
    id: "digging-a-hole",
    title: "A Game About Digging A Hole™",
    description:
      "Копай все глибше в цій незвичній грі про створення ям. Затишна інді-гра з неочікуваною глибиною — тепер українською.",
    cover: "/images/digging-a-hole.jpg",
    progress: 90,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 90 },
      { label: "Текстури", percent: 90 },
    ],
    tags: ["Інді", "Симулятор", "Казуальна"],
    steamUrl: "https://store.steampowered.com/app/3244220/A_Game_About_Digging_A_Hole/",
    downloadUrl: "https://lbklauncher.com/games/a_game_about_digging_a_hole/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-12",
  },
  {
    id: "nmh2",
    title: "No More Heroes 2: Desperate Struggle",
    series: "No More Heroes",
    description:
      "Продовження безумних пригод Тревіса. Ще більше босів, ретро-міні-ігор та божевільного екшену.",
    cover: "/images/nmh2.jpg",
    progress: 80,
    status: "in-progress",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 80 },
      { label: "Текстури", percent: 40 },
    ],
    tags: ["Action", "Hack and Slash", "Аркада"],
    steamUrl: "https://store.steampowered.com/app/1420300/No_More_Heroes_2_Desperate_Struggle/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "mgs2",
    title: "METAL GEAR SOLID 2: Sons of Liberty - Master Collection Version",
    description:
      "METAL GEAR SOLID 2: Sons of Liberty — Master Collection Version — культовий стелс-екшен, де місія на танкері переростає у змову планетарного масштабу. На вас чекають проникнення без зайвого шуму, гаджети, напружені босфайти та історія про інформацію, контроль і правду — актуальна й сьогодні.",
    cover: "/images/mgs2.jpg",
    progress: 60,
    status: "fundraising",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 60 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Action", "Стелс", "Тактика"],
    steamUrl: "https://store.steampowered.com/app/2131640/METAL_GEAR_SOLID_2_Sons_of_Liberty__Master_Collection_Version/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    fundraisingRaised: 16650,
    fundraisingGoal: 25000,
    lastUpdate: "2026-02-16",
  },
  {
    id: "hotel-barcelona",
    title: "HOTEL BARCELONA",
    description:
      "Джастін, молода американська детективка, вирушає на, здавалося б, чергову рутинну справу — аж поки дивна аварія не закидає її на край цивілізації… у HOTEL BARCELONA. Тут у стінах готелю застрягли душі, а коридорами блукають сім серійних убивць. Та найстрашніше — в її голові прокидається інша особистість: доктор Карнавал, прадавнє згубне чудовисько.",
    cover: "/images/hotel-barcelona.jpg",
    progress: 50,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 50 },
      { label: "Редактура", percent: 0 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Action", "Інді", "Хоррор"],
    steamUrl: "https://store.steampowered.com/app/2286600/HOTEL_BARCELONA/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "deadly-premonition-dc",
    title: "Deadly Premonition: The Director's Cut",
    series: "Deadly Premonition",
    description:
      "Культовий трилер-детектив від SWERY. Розслідуй загадкові вбивства у маленькому містечку Ґрінвейл.",
    cover: "/images/deadly-premonition-dc.jpg",
    progress: 43,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 43 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Action", "Хоррор", "Пригоди", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/247660/Deadly_Premonition_The_Directors_Cut/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "travis-strikes-again",
    title: "Travis Strikes Again: No More Heroes",
    series: "No More Heroes",
    description:
      "Тревіс Тачдаун потрапляє всередину ігрової консолі. Спін-оф серії з кооперативним геймплеєм.",
    cover: "/images/travis-strikes-again.jpg",
    progress: 23,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 23 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Action", "Інді", "Hack and Slash"],
    steamUrl: "https://store.steampowered.com/app/961490/Travis_Strikes_Again_No_More_Heroes_Complete_Edition/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "nier-replicant",
    title: "NieR Replicant™ ver.1.22474487139...",
    description:
      "Оновлена версія культової екшен-RPG, де юнак Нір вирушає на відчайдушний пошук порятунку для своєї сестри Йони. Разом із балакучим «Ґримоаром Вайсом» та незабутніми супутниками ви досліджуватимете химерний світ, битиметеся з Тінями й розплутуватимете історію, у якій кожна відповідь має свою ціну — і веде до кількох фіналів.",
    cover: "/images/nier-replicant.jpg",
    progress: 20,
    status: "fundraising",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 20 },
    ],
    tags: ["Action", "RPG", "JRPG"],
    steamUrl: "https://store.steampowered.com/app/1113560/NieR_Replicant_ver122474487139/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    fundraisingRaised: 4213,
    fundraisingGoal: 50000,
    lastUpdate: "2026-02-16",
  },
  {
    id: "deadly-premonition-2",
    title: "Deadly Premonition 2: A Blessing in Disguise",
    series: "Deadly Premonition",
    description:
      "Продовження культового трилера від SWERY. Нова загадка, нове місто, та ще більше божевілля.",
    cover: "/images/deadly-premonition-2.jpg",
    progress: 15,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 15 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Action", "Хоррор", "Пригоди", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/1271100/Deadly_Premonition_2_A_Blessing_in_Disguise/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "lad-ishin",
    title: "Like a Dragon: Ishin!",
    series: "Yakuza",
    description:
      "Самурайський спін-оф серії Yakuza. Рьома Сакамото шукає вбивцю свого батька в Японії епохи Бакумацу.",
    cover: "/images/lad-ishin.jpg",
    progress: 15,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 15 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Action", "RPG", "Пригоди", "Історична"],
    steamUrl: "https://store.steampowered.com/app/1805480/Like_a_Dragon_Ishin/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "yakuza3",
    title: "Yakuza 3 Remastered",
    series: "Yakuza",
    description:
      "Кірю намагається знайти спокій в Окінаві, але минуле не відпускає. Ремастер класики серії.",
    cover: "/images/yakuza3.jpg",
    progress: 14,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 14 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Action", "RPG", "Пригоди", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/1088710/Yakuza_3_Remastered/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "as-dusk-falls",
    title: "As Dusk Falls",
    description:
      "Інтерактивна драма про дві сім'ї, чиї долі переплітаються через пограбування в Арізоні.",
    cover: "/images/as-dusk-falls.jpg",
    progress: 10,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 10 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Пригоди", "Інтерактивне кіно", "Драма"],
    steamUrl: "https://store.steampowered.com/app/1341820/As_Dusk_Falls/",
    downloadUrl: "https://lbklauncher.com/games/as_dusk_falls/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-01-20",
  },
  {
    id: "uncharted2",
    title: "Uncharted 2: Among Thieves",
    series: "Uncharted",
    description:
      "Натан Дрейк шукає легендарне місто Шамбала. Друга частина серії з ще масштабнішими пригодами.",
    cover: "/images/uncharted2.png",
    progress: 10,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 10 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Action", "Пригоди", "Шутер"],
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "shenmue",
    title: "Shenmue I & II",
    description:
      "Класика від Ю Судзукі. Рьо Хадзукі шукає вбивцю свого батька, досліджуючи Японію та Гонконг.",
    cover: "/images/shenmue.jpg",
    progress: 9,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 9 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Action", "Пригоди", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/758330/Shenmue_I__II/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "jojo-asbr",
    title: "JoJo's Bizarre Adventure: All-Star Battle R",
    description:
      "Файтинг за мотивами культової манги JoJo. Понад 50 персонажів з усіх частин серії.",
    cover: "/images/jojo-asbr.jpg",
    progress: 8,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 8 },
    ],
    tags: ["Файтинг", "Аніме", "Action"],
    steamUrl: "https://store.steampowered.com/app/1372110/JoJos_Bizarre_Adventure_AllStar_Battle_R/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
  {
    id: "lost-judgment",
    title: "Lost Judgment",
    series: "Judgment",
    description:
      "Продовження детективного екшену. Яґамі розслідує справу, що пов'язує буллінг у школі та вбивство.",
    cover: "/images/lost-judgment.jpg",
    progress: 6,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 6 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Action", "RPG", "Детектив", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/2058190/Lost_Judgment/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-16",
  },
];

/** Get unique series names for filtering */
export function getSeriesList(): string[] {
  const series = new Set(games.map((g) => g.series).filter(Boolean) as string[]);
  return Array.from(series);
}

/** Get unique statuses present in data */
export function getStatusList(): GameStatus[] {
  const statuses = new Set(games.map((g) => g.status));
  return Array.from(statuses);
}

/** Calculate overall progress across all projects */
export function getOverallProgress(): number {
  if (games.length === 0) return 0;
  const total = games.reduce((sum, g) => sum + g.progress, 0);
  return Math.round(total / games.length);
}
