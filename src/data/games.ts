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
  fundraisingCompleted?: boolean;
  fundraisingDescription?: string;
  /** Посилання на ціль Donatello (…?g=…): суми збору оновлюються автоматично під час збірки */
  fundraisingUrl?: string;
  /** Збір тимчасово призупинено: на сайті не показується, Donatello не опитується; суми лишаються на потім */
  fundraisingPaused?: boolean;
  lastUpdate?: string;
  /** Дата останнього оновлення перекладу в LBK Launcher (заповнюється під час збірки) */
  translationUpdated?: string;
  /**
   * Адреса гри в LBK Launcher (lbklauncher.com/games/<slug>). Звідти під час збірки
   * беруться переклад, редактура, статус і версія. Якщо не вказано — береться з downloadUrl.
   */
  launcherSlug?: string;
  /** false — не брати прогрес і статус з LBK Launcher, лишати значення з цього файлу */
  launcherSync?: boolean;
  /** Банер і логотип гри з LBK Launcher; заповнюється під час збірки (lib/launcher.ts) */
  launcherArt?: { banner: string; logo: string };

  // ── Закинуто ──
  /** Етап, роботу над яким припинено (наприклад, "Редактура"). Статус гри від цього не змінюється. */
  abandonedStage?: string;
  /** Причина, чому етап закинуто. Показується на сторінці гри. */
  abandonedReason?: string;

  // ── Detail Pages Data ──
  screenshots?: string[]; // Paths to translation screenshots
  videoUrl?: string; // YouTube URL (any form) for trailer / showcase video
  installInstructions?: string; // Markdown instructions
  version?: string; // Current localization version (e.g. "1.0.5")
  faq?: { question: string; answer: string }[]; // FAQ items
  team?: TeamMember[]; // Translation team
  detailedDescription?: string; // Extended description for detail page
  /** Інші сторінки цієї ж гри в LBK Launcher (інша платформа чи видання) */
  launcherVersions?: { slug: string; label: string }[];
  /** Заповнюється з лаунчера під час збірки: прогрес цих версій */
  otherVersions?: { slug: string; label: string; translation: number; editing: number; version: string | null }[];
  /** false — щоденна перевірка не порівнює відсотки з лаунчером (там інша гра чи збірка) */
  launcherCheck?: boolean;
  /** Скільки окремих ігор у цьому записі (для збірок, напр. Uncharted 1–3) — для підрахунку ігор у серії */
  gamesCount?: number;
  /** Переклад зроблено за часів «Солов’їної команди» — показуємо помітку */
  solovinaEra?: boolean;
  /** Що поки не перекладено чи не зроблено — окремий блок на сторінці гри */
  limitations?: string[];
  releaseDate?: string; // Release date (YYYY-MM-DD)
  gameYear?: number; // Рік виходу (для ігор зі Steam — рік виходу в Steam)

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
  "Переклад": "text-red-400",
  "Редактура": "text-violet-400",
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
  {
    id: "mixtape",
    launcherSlug: "mixtape",
    title: "Mixtape",
    description:
      "Увечері напередодні розлуки троє друзів рушають в останню спільну пригоду. Зіграйте в добірку чудових спогадів під найкращі пісні цілого покоління.",
    cover: "https://cdn2.steamgriddb.com/grid/de0c701f43e5097566f7c3d560bb2b23.png",
    progress: 100,
    status: "done",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 100 },
      { label: "Шрифти", percent: 100 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Інді", "Пригоди", "Музика", "Сюжетна"],
    steamUrl: "https://store.steampowered.com/app/2582320/Mixtape/",
    downloadUrl: "https://lbklauncher.com/games/mixtape/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2026,
    videoUrl: "https://www.youtube.com/watch?v=BhukvsGyX2s",
    lastUpdate: "2026-10-10",
    releaseDate: "2026-09-27",
    stats: {
      totalLines: 2713,
      translatedLines: 2713, // 100%
      totalWords: 15679, // 3761 укр + 11918 англ
    },
  },
  {
    id: "shadows-of-the-damned",
    releaseDate: "2026-10-10",
    limitations: ["Текстури (написи на зображеннях) не перекладено — вони лишаються англійською."],
    title: "Shadows of the Damned: Hella Remastered",
    description:
      "Божевільний пригодницький екшн від Grasshopper Manufacture, створений за участю легендарних SUDA51, Шінджі Мікамі та композитора Акіри Ямаоки. Це вибухова суміш горору, чорного гумору, рок-н-ролу, абсурду й відвертих жартів, у якій Пекло — лише початок усіх неприємностей.\n\nГарсія Готспер — безстрашний мисливець на демонів, який вирушає просто в Потойбіччя, щоб урятувати свою кохану Полу з лап жорстокого Володаря демонів Флемінга. Його єдиний напарник — Джонсон, балакучий демон, здатний перетворюватися на смертоносну зброю. Разом їм доведеться пробиватися крізь орди пекельних створінь, долати смертельні пастки, розгадувати загадки та використовувати силу світла проти всепоглинальної Темряви.\n\nHella Remastered повертає культову гру з оновленою графікою, зберігаючи її неповторну атмосферу, зухвалий гумор, видовищні перестрілки та абсолютно непередбачувану історію. Приготуйтеся до подорожі, у якій здоровий глузд давно здох, демони не стуляють пельок, а ваш найкращий друг — буквально зброя в руках.",
    cover: "https://cdn2.steamgriddb.com/thumb/c96ba6ab24641368e70eb8f1e409957c.jpg",
    progress: 100,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 93 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Бойовик", "Шутер", "Хоррор", "Чорний гумор"],
    steamUrl: "https://store.steampowered.com/app/2535440/Shadows_of_the_Damned_Hella_Remastered/",
    downloadUrl: "https://lbklauncher.com/games/shadows_of_the_damned_hella_remastered/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-10-10",
    gameYear: 2024,
  },
  {
    id: "romeo-is-a-dead-man",
    releaseDate: "2026-10-08",
    title: "ROMEO IS A DEAD MAN",
    description:
      "ROMEO IS A DEAD MAN — божевільний екшен від Grasshopper Manufacture та Ґоїчі Суди, де смерть — лише початок.\n\nУлітку 2019 року зіткнення сингулярностей розкололо світ на безліч фрагментних усесвітів. Ромео Старґейзер, звичайний заступник шерифа з Дедфорда, опиняється в самому центрі цієї катастрофи. Смертельно поранений і врятований завдяки загадковому «Дедґіру», він стає Дедменом — людиною, що зависла між життям і смертю.\n\nТепер Ромео працює з Часопросторовою поліцією ФБР, полює на часопросторових злочинців, мандрує фрагментними всесвітами й намагається відшукати Джульєт — дівчину, з якої для нього все почалося.\n\nДивакуватий гумор, криваві сутички, абсурд, окультизм, наукова фантастика й фірмове божевілля SUDA51 — усе це ROMEO IS A DEAD MAN.",
    cover: "https://cdn2.steamgriddb.com/thumb/d7940c4b3657832faf6933edc87e0490.jpg",
    progress: 100,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 60 },
    ],
    tags: ["Бойовик", "Hack and Slash", "Шутер", "Чорний гумор"],
    steamUrl: "https://store.steampowered.com/app/3050900/ROMEO_IS_A_DEAD_MAN/",
    downloadUrl: "https://lbklauncher.com/games/romeo_is_a_dead_man/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-10-10",
    gameYear: 2026,
  },
  {
    id: "killer-is-dead",
    releaseDate: "2026-10-14",
    limitations: ["Текстури (написи на зображеннях) не перекладено — вони лишаються англійською."],
    launcherSlug: "killer_is_dead_nightmare_edition",
    title: "Killer is Dead - Nightmare Edition",
    description:
      "Гра поєднує швидкі бої на мечах, незвичну подачу сюжету, яскравий візуальний стиль і характерний для SUDA51 треш, гумор та сюрреалізм.",
    cover: "https://cdn2.steamgriddb.com/thumb/7bd9b89f3787c90eb1a89eb12fae70d3.jpg",
    progress: 100,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 100 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Hack and Slash", "Бойовик", "Чорний гумор"],
    steamUrl: "https://store.steampowered.com/app/261110/Killer_is_Dead__Nightmare_Edition/",
    downloadUrl: "https://lbklauncher.com/games/killer_is_dead_nightmare_edition/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-10-14",
    gameYear: 2014,
  },
  {
    id: "dragon-quest-xi-s",
    launcherSlug: "dragon_quest_xi_s_echoes_of_an_elusive_age_definitive_edition",
    title: "DRAGON QUEST® XI S: Echoes of an Elusive Age™ - Definitive Edition",
    series: "Dragon Quest",
    description:
      "Рольова пригода про юнака із селища Коблстоун, який дізнається, що він — нове втілення легендарного Люмінарія. Та замість почестей у королівстві Геліодор на нього чекають звинувачення, ув'язнення й переслідування. Разом із новими друзями він вирушає в подорож величезним світом, сповненим таємниць, небезпечних чудовиськ і несподіваних відкриттів, щоб дізнатися правду про своє походження та виконати власне призначення.",
    cover: "https://cdn2.steamgriddb.com/thumb/a44531997fab340499c42410656d1b5b.jpg",
    progress: 9,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 9 },
    ],
    tags: ["JRPG", "RPG", "Пригоди", "Покрокова"],
    steamUrl: "https://store.steampowered.com/app/1295510/DRAGON_QUEST_XI_S_Echoes_of_an_Elusive_Age__Definitive_Edition/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-10-17",
    gameYear: 2020,
  },
  {
    id: "gravity-rush",
    limitations: ["Текстури перекладено лише частково — більшість написів на зображеннях поки англійською."],
    launcherSlug: "gravity_rush_remastered",
    launcherVersions: [{ slug: "gravity_rush", label: "Версія для PS Vita" }],
    title: "Gravity Rush™ Remastered",
    series: "Gravity Rush",
    description:
      "Відкрийте для себе незвичайну пригоду Кет — дівчини, яка втратила пам'ять, але здобула дивовижну здатність керувати гравітацією. Досліджуйте загадкове місто Гексевіль, змінюйте напрямок тяжіння та допоможіть його мешканцям розкрити таємниці свого світу. Тепер — українською мовою!\n\nРоботу над перекладом було повністю завершено ще для проєкту G2Fork. Тепер ми адаптуємо його для неофіційної комп'ютерної версії Gravity Rush™ Remastered від LucaPazienza.\n\nОкрім перенесення перекладу, проводимо додаткове літературне редагування, виправляємо попередні недоліки та вдосконалюємо український текст, щоб підготувати якнайкращу версію локалізації до випуску.",
    cover: "https://cdn2.steamgriddb.com/grid/93058caa4389f7c69bfb0e6ee0472a95.png",
    progress: 100,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 50 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Бойовик", "Пригоди", "Відкритий світ", "Аніме"],
    downloadUrl: "https://lbklauncher.com/games/gravity_rush_remastered/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-10-26",
    releaseDate: "2026-10-26",
    gameYear: 2015,
    team: [
      { name: "Дмитро Бидлов", role: "Переклад" },
    ],
    stats: {
      totalLines: 5638, // текстових записів
    },
  },
  {
    id: "gravity-rush-2",
    launcherSlug: "gravity_rush_2",
    title: "Gravity Rush™ 2",
    series: "Gravity Rush",
    description:
      "Пригодницький бойовик у відкритому світі від Japan Studio, створений під керівництвом Кеїчіро Тоями, автора оригінальної Silent Hill.\n\nПродовження незвичайної історії Кет — дівчини, здатної керувати силою тяжіння. Після загадкових подій героїня опиняється далеко від рідного Гексевіля, де на неї чекають нові знайомства, небезпечні вороги та таємниці, здатні змінити її уявлення про світ.\n\nГоловна особливість гри — унікальна система керування гравітацією. Кет може літати між хмарочосами, ходити по стінах, змінювати напрямок падіння та використовувати три різні гравітаційні стилі, кожен із яких по-своєму впливає на пересування й бої.\n\nВеличезні міста, видовищні сутички, численні побічні завдання, виразна мальована стилістика та прекрасний музичний супровід створюють неповторну атмосферу пригоди, яку складно сплутати з будь-якою іншою грою.",
    cover: "https://cdn2.steamgriddb.com/grid/cee0281e36d843e932cbabe3aaa22d50.png",
    progress: 60,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 60 },
    ],
    tags: ["Бойовик", "Пригоди", "Відкритий світ", "Аніме"],
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-11-08",
    gameYear: 2017,
    stats: {
      totalLines: 20203, // текстових записів
    },
  },
  {
    id: "yakuza-kiwami3",
    title: "Yakuza Kiwami 3 & Dark Ties",
    series: "Yakuza",
    description:
      "Це масштабний ремейк Yakuza 3 у форматі сучасної кримінальної пригоди з динамічними бійками, драматичним сюжетом і фірмовим контрастом між серйозною історією та химерним побічним контентом. Гра розповідає про Кадзуму Кірю, який знову змушений вступити в боротьбу, щоб захистити близьких, а також містить окрему сюжетну кампанію Dark Ties, що дає змогу подивитися на події з іншого боку — через персонажа Йошітаку Міне. За матеріалами анонсу та профільної преси, у ремейку суттєво оновлено бойову систему, а також додано новий контент і переосмислення окремих сюжетних моментів. Гра позиціонується як видання 18+ і містить жорстоке насильство, грубу лексику та елементи імітації азартних ігор.",
    cover: "https://cdn2.steamgriddb.com/thumb/d7fbe5fb946867aacf79463f8f36981c.jpg",
    progress: 37,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 37 },
      { label: "Редактура", percent: 0 },
      { label: "Текстури", percent: 40 },
    ],
    tags: ["Бойовик", "RPG", "Відкритий світ", "Кримінал"],
    steamUrl: "https://store.steampowered.com/app/3937550/Yakuza_Kiwami_3__Dark_Ties/",
    downloadUrl: "https://lbklauncher.com/games/yakuza_kiwami_3_dark_ties/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2026,
    videoUrl: "https://www.youtube.com/watch?v=-CMhSswHhn4",
    lastUpdate: "2026-04-28",
    progressHistory: [
      { date: "2026-03-04", progress: 23, milestone: "Початок перекладу" },
      { date: "2026-03-07", progress: 25, milestone: "25% перекладу" },
      { date: "2026-03-09", progress: 26, milestone: "26% перекладу" },
      { date: "2026-03-12", progress: 30, milestone: "30.40% перекладу" },
      { date: "2026-04-28", progress: 38, milestone: "Ранній доступ — 37.56% перекладено" }
    ],
    stats: {
      totalLines: 57398,
      translatedLines: 21557, // 37.56%
      totalWords: 468281, // 134011 укр + 334270 англ
    },
  },
  {
    id: "nier-replicant",
    launcherSlug: "nier_replicant_ver122474487139",
    title: "NieR Replicant™ ver.1.22474487139...",
    description:
      "Оновлений приквел NieR:Automata. Добрий юнак разом із «Ґримуар Вайсом», дивною балакучою книгою, вирушає на пошуки Запечатаних заклять, аби врятувати свою сестру Йону, яку смертельно вразив Чорний напис.",
    cover: "https://cdn2.steamgriddb.com/thumb/9dcecafda1dec7a08c0630b896ff82cc.jpg",
    progress: 31,
    status: "fundraising",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 31 },
    ],
    tags: ["Чудовий саундтрек", "Глибокий сюжет", "Бойовик", "Пригоди"],
    screenshots: [
      "/images/NieR_1.webp",
      "/images/NieR_2.webp",
      "/images/NieR_3.webp",
      "/images/NieR_4.webp",
      "/images/NieR_5.webp",
    ],
    videoUrl: "https://www.youtube.com/watch?v=7NiZAmBlMk0",
    steamUrl: "https://store.steampowered.com/app/1113560/NieR_Replicant_ver122474487139/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2021,
    fundraisingRaised: 29000,
    fundraisingGoal: 50000,
    fundraisingUrl: "https://donatello.to/LittleBitUA?g=tekstova-lokalizatsiya-nie-r-replicant-ver-1-22474487139",
    fundraisingDescription: "Переклад робитиметься з оглядом на японську мову та виконується професійним дипломованим перекладачем під ніком Retnara.",
    lastUpdate: "2026-08-01",
    progressHistory: [
      { date: "2026-08-01", progress: 30, milestone: "Збір: 29 000 ₴ із 50 000 ₴ (58%)" },
    ],
    stats: {
      totalLines: 24458,
      translatedLines: 6921, // 28.3%
      totalWords: 131813, // 27203 UA + 109012 ENG
      totalCharacters: 682805,
    },
  },
  {
    id: "mgs2",
    releaseDate: "2026-04-13",
    title: "METAL GEAR SOLID 2: Sons of Liberty - Master Collection Version",
    description:
      "Четверта гра в серії METAL GEAR: події розгортаються навколо двох інцидентів 2007 та 2009 років, у центрі сюжету — Солід Снейк і Райден, а гравців чекають нові можливості стелс-ґеймплею.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2131640/library_600x900_2x.jpg?t=1710478205",
    progress: 70,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 70 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Бойовик", "Стелс", "Глибокий сюжет", "Пригоди"],
    steamUrl: "https://store.steampowered.com/app/2131640/METAL_GEAR_SOLID_2_Sons_of_Liberty__Master_Collection_Version/",
    downloadUrl: "https://lbklauncher.com/games/metal_gear_solid_2_sons_of_liberty_master_collection_version/little-bit-perekladach-patriotiv-kostyanchek8",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2023,
    videoUrl: "https://www.youtube.com/watch?v=21t5AVKLa04",
    fundraisingCompleted: true,
    lastUpdate: "2026-04-28",
    team: [
      { name: "Little Bit", role: "Переклад" },
      { name: "Перекладач патріотів", role: "Переклад" },
      { name: "Kostyanchek8", role: "Переклад" }
    ],
  },
  {
    id: "uncharted-collection",
    gamesCount: 3,
    limitations: ["Текстури (написи на зображеннях) не перекладено — вони лишаються англійською."],
    title: "Uncharted: The Nathan Drake Collection",
    series: "Uncharted",
    description:
      "Незвідане: Колекція Натана Дрейка\n\nUncharted: The Nathan Drake Collection\n\nТри пригоди Натана Дрейка — тепер українською! Вирушайте на пошуки легендарних скарбів, розгадуйте давні таємниці й виплутуйтеся з небезпечних халеп разом із Натаном та його друзями.\n\nНезвідане: Фортуна Дрейка\n\nUncharted: Drake’s Fortune\n\nПригода, з якої почалася історія Натана Дрейка. Підказка, залишена мореплавцем Френсісом Дрейком, веде мисливця за скарбами до загадкового острова й легендарного Ельдорадо. Разом із журналісткою Оленою Фішер та давнім другом Віктором Салліваном Натан має випередити найманців і розкрити таємницю, що століттями залишалася похованою.\n\nВідкрийте для себе першу пригоду Дрейка з українським перекладом діалогів, субтитрів та інтерфейсу.\n\nНезвідане 2: Серед злодіїв\n\nUncharted 2: Among Thieves\n\nЗдавалося б, просте викрадення музейної реліквії обертається зрадою та небезпечною гонитвою за втраченою Шамбалою. Слідами експедиції Марко Поло Натан дістається засніжених Гімалаїв, де на нього чекають безжальні вороги, хиткі союзи й таємниця легендарного каменя Чінтамані.\n\nПереживіть цю пригоду українською — з перекладеними діалогами, субтитрами та інтерфейсом.\n\nНезвідане 3: Омана Дрейка\n\nUncharted 3: Drake’s Deception\n\nПошуки легендарної Атлантиди пісків ведуть Натана Дрейка та Віктора Саллівана в саме серце Аравійської пустелі. Проте за давньою таємницею полює й могутня таємна організація. Щоб дістатися істини, Натанові доведеться зіткнутися з власним минулим і вирішити, чого насправді варта його одержимість пошуками.\n\nПориньте в третю пригоду Дрейка з українським перекладом діалогів, субтитрів та інтерфейсу.",
    cover: "https://supabase.lbklauncher.com/storage/v1/object/public/game-images/dfe6f72f-ad86-8718-9453-d623c8c06287/thumbnail.webp?v=1792798127729",
    progress: 100,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 90 },
      { label: "Шрифти", percent: 100 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Бойовик", "Пригоди", "Шутер"],
    downloadUrl: "https://lbklauncher.com/games/uncharted_the_nathan_drake_collection/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    fundraisingCompleted: true,
    lastUpdate: "2026-10-24",
    releaseDate: "2026-10-24",
    gameYear: 2015,
    team: [
      { name: "Дмитро Бидлов", role: "Переклад" },
    ],
  },
  {
    id: "uncharted-golden-abyss",
    launcherSlug: "uncharted_golden_abyss",
    title: "Uncharted: Golden Abyss",
    series: "Uncharted",
    description:
      "Uncharted: Golden Abyss — пригодницький бойовик від Bend Studio, створений спеціально для PlayStation Vita. Події гри розгортаються до початку Uncharted: Drake's Fortune й розповідають про одну з ранніх пригод Натана Дрейка.\n\nУ пошуках слідів загадкової іспанської експедиції Натан вирушає до Центральної Америки, де знайомиться з дослідницею Марісою Чейз. Разом вони намагаються розгадати багатовікову таємницю, пов'язану зі зниклими конкістадорами, стародавніми руїнами та легендарними скарбами.\n\nНа гравців чекають небезпечні джунглі, стародавні храми, перестрілки, запаморочливі підйоми, головоломки та фірмовий гумор серії Uncharted. Golden Abyss зберігає атмосферу пригодницького кіно, поєднуючи дослідження, видовищні сутички й захопливу історію про пошуки загублених скарбів.",
    cover: "https://cdn2.steamgriddb.com/grid/7a4dac4925ff62ea0ffe563eb2ee20f8.png",
    progress: 20,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 20 },
    ],
    tags: ["Бойовик", "Пригоди", "Шутер"],
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    screenshots: [
      "/images/GoldenAbyss_1.webp",
      "/images/GoldenAbyss_2.webp",
      "/images/GoldenAbyss_3.webp",
      "/images/GoldenAbyss_4.webp",
      "/images/GoldenAbyss_5.webp",
    ],
    lastUpdate: "2026-11-08",
    gameYear: 2011,
  },
  {
    id: "mgs-snake-eater",
    gameYear: 2025,
    title: "METAL GEAR SOLID Δ: SNAKE EATER",
    description:
      "Зустрічайте ремейк гри 2004 року METAL GEAR SOLID 3 з тією ж неймовірною історією і яскравим світом, але з оновленою графікою та 3D-звуком, що допоможе ще більше зануритися в атмосферу джунглів. Приготуйтеся провести не один десяток годин у цьому неперевершеному стелс-бойовику на виживання.",
    cover: "https://cdn2.steamgriddb.com/thumb/67dffe36336093c94187f6dd9412ba89.jpg",
    progress: 63,
    status: "early-access",
    stage: "Переклад",
    fundraisingRaised: 33475,
    fundraisingGoal: 50000,
    fundraisingCompleted: true,
    fundraisingUrl: "https://donatello.to/LittleBitUA?g=podalsha-tekstova-lokalizatsiya-metal-gear-solid-d-snake-eater-master-collection",
    fundraisingDescription: "Збір на подальшу повноцінну текстову локалізацію METAL GEAR SOLID Δ: SNAKE EATER.",
    stageDetails: [
      { label: "Переклад", percent: 63 },
      { label: "Редактура", percent: 0 },
    ],
    stats: {
      totalLines: 15981,
      translatedLines: 10068, // 63%
      totalWords: 536590, // 57292 укр + 479298 англ
    },
    tags: ["Стелс", "Бойовик", "Глибокий сюжет", "Пригоди"],
    downloadUrl: "https://lbklauncher.com/games/metal_gear_solid_snake_eater/little-bit-perekladach-patriotiv-kostyanchek8-solovina-komanda",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    videoUrl: "https://www.youtube.com/watch?v=ZFcVAqzto8Y",
    lastUpdate: "2026-07-02",
    version: "2.2",
    installInstructions: `## Встановлення локалізації METAL GEAR SOLID Δ: SNAKE EATER

### Через LBK Launcher
1. Встановіть [LBK Launcher](https://lbklauncher.com/)
2. Знайдіть METAL GEAR SOLID Δ: SNAKE EATER у списку
3. Натисніть "Встановити"
4. Запускайте гру!`,
    faq: [
      {
        question: "Чому така сума збору?",
        answer: "Тому що гра дуже велика, а для завершення локалізації цього року потрібна активна, якісна й стабільна робота всієї команди.",
      },
      {
        question: "Буде переклад на стару версію гри?",
        answer: "Так, переклад для старої версії гри вже доступний. Завантажити його можна через LBK Launcher.",
      },
      {
        question: "Скільки у грі тексту?",
        answer: "У грі понад 50\u00a0000 рядків тексту.",
      },
      {
        question: "«Солов'їна команда» працюватиме над перекладом?",
        answer: "Ні. Водночас ми виплатимо їм кошти за попередньо виконану роботу. Якщо хтось із них захоче повернутися, ми будемо тільки раді.",
      },
      {
        question: "Хто працює над перекладом?",
        answer: "Над локалізацією працюють Little Bit, Kostyanchek8 та інші учасники команди.",
      },
      {
        question: "Буде переклад інших частин?",
        answer: "Так, якщо збір матиме підтримку, а українська локалізація буде справді затребуваною серед гравців.",
      },
      {
        question: "Ви плануєте оновлювати переклад одразу чи вже після завершення збору?",
        answer: "Оновлення виходитимуть у процесі роботи. Тобто навіть якщо ми зберемо, умовно, лише 30% від загальної суми, ви все одно зможете проходити нові версії гри й прозоро підтримувати нашу роботу.",
      },
      {
        question: "Що буде, якщо збір не закриється?",
        answer: "Нічого критичного — ми все одно завершимо проєкт. Але після цього з більшим скептицизмом ставитимемося до подальшої локалізації ігор цієї серії.",
      },
    ],
  },
  {
    id: "nmh1",
    limitations: ["Перекладено не всі текстури: частина написів на зображеннях лишається англійською."],
    title: "No More Heroes",
    series: "No More Heroes",
    description:
      "Проклади собі шлях на вершину рейтингу найманих убивць у HD-ремастері культового екшену No More Heroes!\n\nТревіс Тачдаун — звичайний американський отаку, який вирішив стати вбивцею № 1 у світі. Озброївшись променевою катаною, він вирушає на полювання за найнебезпечнішими й найдивакуватішими найманцями, щоб одного дня очолити рейтинг.\n\nНа тебе чекають шалені сутички, колоритні персонажі, чорний гумор і добряча порція божевілля у фірмовому стилі Suda51. Ласкаво просимо до Санта-Дестрою — міста, де за місце на вершині доведеться добряче поборотися!",
    cover: "https://cdn2.steamgriddb.com/grid/34b4bdc640e8367a103af9181039d99f.jpg",
    progress: 100,
    status: "early-access",
    stage: "Текстури",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 98 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Hack and Slash", "Бойовик", "Аркада"],
    steamUrl: "https://store.steampowered.com/app/1420290/No_More_Heroes/",
    downloadUrl: "https://lbklauncher.com/games/no_more_heroes/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-11-02",

    // Extended data
    releaseDate: "2026-01-02",
    gameYear: 2021,
    genre: ["Action", "Hack and Slash", "Аркада"],
    platform: ["PC", "Switch"],
    translationSize: "medium",
    team: [
      { name: "Little Bit Team", role: "Переклад", link: "https://t.me/LittleBitUA" }
    ],
    installInstructions: `## Встановлення локалізації No More Heroes

### Через LBK Launcher
1. Встановіть [LBK Launcher](https://lbklauncher.com/)
2. Знайдіть No More Heroes у списку
3. Натисніть "Встановити"
4. Запускайте гру!`,
    progressHistory: [
      { date: "2025-06-01", progress: 0, milestone: "Початок проєкту" },
      { date: "2025-07-15", progress: 30, milestone: "Переклад основних діалогів" },
      { date: "2025-09-01", progress: 60, milestone: "Переклад усіх босів" },
      { date: "2025-11-15", progress: 85, milestone: "Завершено переклад" },
      { date: "2026-01-20", progress: 95, milestone: "Редактура" },
      { date: "2026-02-10", progress: 100, milestone: "Реліз!" }
    ],
    stats: {
      totalLines: 14091,
      translatedLines: 14091,
      totalWords: undefined,
      totalCharacters: 450000
    }
  },
  {
    id: "dispatch",
    limitations: ["Професійна літературна редакторка відредагувала лише перші два епізоди; для решти епізодів редактура не планується."],
    abandonedStage: "Редактура",
    abandonedReason:
      "Професійна редакторка відредагувала лише перші два епізоди. Подальша редактура не планується: для гри вийшла офіційна українська локалізація. Сам текст перекладено повністю, і цією версією можна користуватися й надалі.",
    title: "Dispatch",
    description:
      "Сюжетна супергеройська комедія, у якій колишній герой після втрати бойового костюма влаштовується диспетчером. Тепер йому доведеться керувати командою колишніх лиходіїв, розподіляти їх між завданнями, владнувати офісні конфлікти та ухвалювати рішення, що впливатимуть на стосунки персонажів і розвиток історії.",
    cover: "https://cdn2.steamgriddb.com/thumb/bfa1e9bc09534cad8103ba543b5e0e24.jpg",
    progress: 100,
    status: "done",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 30 },
    ],
    tags: ["Візуальна новела", "Детектив", "Інтерактивне кіно"],
    steamUrl: "https://store.steampowered.com/app/2592160/Dispatch/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    downloadUrl: "https://lbklauncher.com/games/dispatch/little-bit",
    lastUpdate: "2026-03-07",

    // Extended data
    detailedDescription: "Станьте диспетчером поліції та керуйте екстреними викликами. Кожне ваше рішення впливає на долі людей. Унікальна стилістика коміксу та нелінійний сюжет.",
    gameYear: 2025,
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
    },
    installInstructions: `## Встановлення локалізації Dispatch

### Через LBK Launcher
1. Завантажте та встановіть [LBK Launcher](https://lbklauncher.com/)
2. Запустіть лаунчер та знайдіть Dispatch у списку
3. Натисніть "Встановити локалізацію"
4. Запускайте гру через Steam як зазвичай

**Важливо:** Патч працює з версією гри Steam.`
  },
  {
    id: "judgment",
    title: "Judgment",
    series: "Judgment",
    description:
      "Неонуарний детективний екшен від Ryu Ga Gotoku Studio, спін-оф серії Yakuza, дія якого розгортається в кримінальному районі Камуро-чьо в Токіо. Ви граєте за Такаюкі Яґамі — колишнього адвоката, що втратив репутацію після резонансної справи та тепер працює приватним детективом. Разом із партнером Масахару Кайто він береться за розслідування серії жорстоких убивств якудза, де жертв знаходять із вирізаними очима, і крок за кроком виходить на змову, в якій замішані клан Тоджьо, клан Кьорей, корумповані правоохоронці та науковий центр, що розробляє експериментальні ліки від хвороби Альцгаймера.\n\nІгролад поєднує динамічні бійки в реальному часі з елементами детективного розслідування: стеження, перегони, пошук доказів, допити, робота з клієнтами та судовими справами. Камуро-чьо живе власним життям — побічні справи, дружби з містянами та численні мініігри роблять район відчутно «живим» і дають змогу перепочити від напруженого сюжету.\n\nJudgment пропонує самодостатню історію юридичного трилера та кримінальної драми, тож у неї можна зануритися навіть без попереднього знайомства з серією Yakuza, зосередившись на розкритті справи й особистому шляху Яґамі від зневіри до спроб спокутувати власні помилки.",
    cover: "https://cdn2.steamgriddb.com/thumb/e25c8f3b6421b1795ba83b623d1d82c0.jpg",
    progress: 90,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 90 },
      { label: "Редактура", percent: 10 },
    ],
    tags: ["Бойовик", "Детектив", "Відкритий світ", "Кримінал"],
    steamUrl: "https://store.steampowered.com/app/2058180/Judgment/",
    downloadUrl: "https://lbklauncher.com/games/judgment/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-02-06",

    // Extended data
    releaseDate: "2025-11-26",
    gameYear: 2022,
    genre: ["Action", "RPG", "Детектив", "Відкритий світ"],
    platform: ["PC", "PlayStation", "Xbox"],
    translationSize: "large",
    team: [
      { name: "Little Bit Team", role: "Переклад та редакція" }
    ],
    installInstructions: `## Встановлення локалізації Judgment

### Через LBK Launcher
1. Завантажте [LBK Launcher](https://lbklauncher.com/)
2. Знайдіть Judgment у списку
3. Натисніть "Встановити"
4. Запускайте гру через Steam

**Увага:** Ранній доступ — переклад активно оновлюється.`,
    progressHistory: [
      { date: "2025-07-01", progress: 35, milestone: "Початок перекладу основної історії" },
      { date: "2025-09-01", progress: 55, milestone: "Переклад половини сюжету" },
      { date: "2025-11-15", progress: 75, milestone: "Основна історія перекладена" },
      { date: "2026-01-10", progress: 85, milestone: "Побічні місії" },
      { date: "2026-02-06", progress: 90, milestone: "Редактура та поліпшення" }
    ],
    stats: {
      totalLines: 69340,
      translatedLines: 62917, // 90.74%
      totalWords: 505041, // 427028 укр + 78013 англ
      totalCharacters: 2777726 // Приблизно
    }
  },
  {
    id: "dave-the-diver",
    solovinaEra: true,
    launcherSlug: "dave_the_diver",
    launcherSync: false, // DLC «In The Jungle»: у лаунчері прогрес базової гри
    launcherCheck: false,
    title: "Dave The Diver: In The Jungle",
    description:
      "Dave The Diver — затишна пригодницька гра про Дейва, який удень пірнає в загадкову Блакитну Діру, ловить рибу й збирає скарби, а ввечері керує суші-баром: готує страви, розвиває заклад і знайомиться з дивакуватими персонажами. Тут поєдналися дослідження, легкий екшен під водою та приємний менеджмент у стилі “ще один день — і спати”.",
    cover: "https://cdn2.steamgriddb.com/thumb/1d50a96e0e3d7b721de8aafbb246067d.jpg",
    progress: 45,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 45 },
    ],
    tags: ["Пригоди", "Симулятор", "Інді", "Казуальна"],
    steamUrl: "https://store.steampowered.com/app/1868140/DAVE_THE_DIVER/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2023,
    lastUpdate: "2026-04-30",
  },
  {
    id: "persona-5-royal",
    solovinaEra: true,
    launcherSlug: "persona_5_royal",
    title: "Persona 5 Royal",
    description:
      "Стильова JRPG про старшокласника, який разом із Примарними крадіями викрадає «зіпсовані серця» дорослих тиранів. Поєднуй шкільні будні, дружбу та побачення з вилазками в Метавсесвіт, досліджуй Палаци й змінюй долю Токіо — і свою власну.",
    cover: "https://cdn2.steamgriddb.com/thumb/78b22a52a1e53b0d2e27e6b40569793a.jpg",
    progress: 65,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 65 },
      { label: "Редактура", percent: 0 },
      { label: "Шрифти", percent: 100 },
      { label: "Текстури", percent: 15 },
    ],
    tags: ["JRPG", "Покрокова", "Глибокий сюжет", "Аніме"],
    steamUrl: "https://store.steampowered.com/app/1687950/Persona_5_Royal/",
    downloadUrl: "https://lbklauncher.com/games/persona_5_royal/solovina-komanda",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2022,
    lastUpdate: "2026-09-05",
  },
  {
    id: "yakuza-kiwami2",
    launcherSlug: "yakuza_kiwami_2",
    title: "Yakuza Kiwami 2",
    series: "Yakuza",
    description:
      "Кадзума Кірю, легендарний Дракон Доджіми, мусить зійтися в смертельному двобої з амбітним Рюджі Ґодою, Драконом Кансая — попереду повномасштабна війна між двома ворогуючими кланами якудза. На вас чекає безкомпромісне переосмислення однієї з найулюбленіших частин серії Yakuza: приголомшливе 4K, розблокована частота кадрів і оновлена до дрібниць класика жорсткого кримінального бойовика. Урешті-решт Драконом може залишитися тільки один.",
    cover: "https://cdn2.steamgriddb.com/thumb/30d35f85cc2976e1427452715a353eb9.jpg",
    progress: 95,
    status: "in-progress",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 95 },
      { label: "Редактура", percent: 20 },
      { label: "Текстури", percent: 30 },
    ],
    tags: ["Бойовик", "Відкритий світ", "Beat 'em up", "Кримінал"],
    steamUrl: "https://store.steampowered.com/app/3717340/Yakuza_Kiwami_2/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    videoUrl: "https://www.youtube.com/watch?v=hGMcrhk7tn4",
    lastUpdate: "2026-02-17",

    // Extended data
    gameYear: 2025,
    genre: ["Action", "RPG", "Beat 'em up", "Відкритий світ"],
    platform: ["PC", "PlayStation", "Xbox"],
    translationSize: "large",
    team: [
      { name: "Little Bit Team", role: "Переклад та редакція" }
    ],
    installInstructions: `## Встановлення патчу Yakuza Kiwami 2

### Через LBK Launcher
1. Завантажте та встановіть [LBK Launcher](https://lbklauncher.com/)
2. Запустіть лаунчер та знайдіть Yakuza Kiwami 2 у списку
3. Натисніть "Встановити локалізацію"
4. Запускайте гру через Steam як зазвичай

**Важливо:** Патч працює з версією гри Steam.`,
    progressHistory: [
      { date: "2025-08-01", progress: 45, milestone: "Почато переклад основної історії" },
      { date: "2025-09-15", progress: 60, milestone: "Завершено переклад основних місій" },
      { date: "2025-11-01", progress: 75, milestone: "Перекладено побічні активності" },
      { date: "2025-12-20", progress: 85, milestone: "Почато редактуру" },
      { date: "2026-01-15", progress: 90, milestone: "Завершено редагування основного сюжету" },
      { date: "2026-01-31", progress: 91, milestone: "Відредаговано 4000 рядків" },
      { date: "2026-02-02", progress: 92, milestone: "Відредаговано 4800 рядків" },
      { date: "2026-02-05", progress: 93, milestone: "Відредаговано 5350 рядків" },
      { date: "2026-02-12", progress: 94, milestone: "Відредаговано 6000 рядків" },
      { date: "2026-02-16", progress: 95, milestone: "Фінальна редактура та текстури" },
      { date: "2026-02-17", progress: 96, milestone: "Відредаговано 7118 рядків" }
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
    launcherSlug: "yakuza_like_a_dragon",
    title: "Yakuza: Like a Dragon",
    series: "Yakuza",
    description:
      "Yakuza: Like a Dragon — рольова гра від Ryu Ga Gotoku Studio та SEGA, сьома основна частина серії Yakuza, але з новим героєм і зовсім іншим геймплеєм.\n\nПодії розгортаються у 2019 році в Іседзакі Іджін-чьо — районі Йокоґами, де перетинаються інтереси трьох кримінальних угруповань: Люман Йокоґами, Ґеоміджул і клан Сейрю. Ви граєте за Ічібана Касуґу — дрібного якудзу із сім’ї Аракава клану Тоджьо, який відсидів 18 років за злочин, якого не скоював, аби врятувати старших по сім’ї. Після звільнення він дізнається, що клан Тоджьо знищено, Камуро-чьо захопив альянс Омі, а його колишній бос став зрадником. Залишившись ні з чим, Ічібан вирушає з’ясувати правду й «стати героєм», збираючи навколо себе таку ж «лузере-банду» невдах та диваків.\n\nНа відміну від попередніх частин, де бійки були екшеном у реальному часі, Like a Dragon — це повноцінна покрокова JRPG із системою «професій» (робіт), де герої змінюють «роботу» й уміння, немов у класичній настільній RPG. У бою ви керуєте загоном до чотирьох персонажів, використовуєте навколишні предмети (наприклад, велосипеди) як зброю, викликаєте «помічників» через особливий сервіс, а також качаєте рівні, спорядження й параметри героя.\n\nОкрім основної історії, гра пропонує величезну кількість побічних завдань, мініігор і активностей: від керування власною компанією та виборів на міській раді до класичних розваг серії — караоке, аркад SEGA, казино та вуличних бійок. Усе це робить Yakuza: Like a Dragon своєрідним стартовим «порогом входу» у серію: навіть якщо ви ніколи не грали в попередні частини, історія Ічібана подана як новий початок, але водночас пов’язана з подіями старих ігор для давніх фанів.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/1235140/library_600x900_2x.jpg?t=1716350681",
    progress: 54,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 54 },
      { label: "Текстури", percent: 30 },
    ],
    tags: ["RPG", "JRPG", "Покрокова", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/1235140/Yakuza_Like_a_Dragon/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    fundraisingCompleted: true,
    lastUpdate: "2026-05-12",

    // Extended data
    gameYear: 2020,
    genre: ["RPG", "JRPG", "Покрокова бойова система", "Відкритий світ"],
    platform: ["PC", "PlayStation", "Xbox"],
    translationSize: "large",
    team: [
      { name: "Little Bit Team", role: "Переклад" }
    ],
    progressHistory: [
      { date: "2025-09-01", progress: 15, milestone: "Початок основного сюжету" },
      { date: "2025-11-15", progress: 25, milestone: "Перша половина історії" },
      { date: "2026-02-16", progress: 35, milestone: "Активний переклад" },
      { date: "2026-02-19", progress: 38, milestone: "38% перекладено" },
      { date: "2026-03-04", progress: 41, milestone: "40.95% перекладено" },
      { date: "2026-05-08", progress: 46, milestone: "46.09% перекладено" }
    ],
    stats: {
      totalLines: 72448,
      translatedLines: 33394, // 46.09%
      totalWords: 599254, // 247506 укр + 351748 англ
      totalCharacters: 3374591 // Приблизно
    }
  },
  {
    id: "nmh3",
    limitations: ["Перекладено не всі текстури: частина написів на зображеннях лишається англійською."],
    title: "No More Heroes 3",
    series: "No More Heroes",
    description:
      "No More Heroes 3 — це шалений, стильний екшен про найманця Тревіса Тачдауна, який повертається в справу, щоб навести лад у Санта-Дестрої й розібратися з прибульцями та цілою купою дивакуватих босів. Тут усе побудовано на драйвових дуелях, чорному гуморі, безумних сюжетних поворотах і любові до попкультури — гра, яка не соромиться бути гучною, дивною й дуже впізнаваною.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/1744330/library_600x900_2x.jpg?t=1665510381",
    progress: 100,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 98 },
      { label: "Текстури", percent: 50 },
    ],
    tags: ["Бойовик", "Hack and Slash", "Аніме", "Комедія"],
    steamUrl: "https://store.steampowered.com/app/1744330/No_More_Heroes_3/",
    downloadUrl: "https://lbklauncher.com/games/no_more_heroes_3/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-10-23",

    // Extended data
    releaseDate: "2026-01-14",
    gameYear: 2022,
    genre: ["Action", "Hack and Slash", "Відкритий світ"],
    platform: ["PC", "Switch"],
    translationSize: "large",
    team: [
      { name: "Little Bit Team", role: "Переклад та редакція", link: "https://t.me/LittleBitUA" }
    ],
    installInstructions: `## Встановлення локалізації No More Heroes 3

### Через LBK Launcher
1. Завантажте [LBK Launcher](https://lbklauncher.com/)
2. Знайдіть No More Heroes 3 у списку
3. Натисніть "Встановити"
4. Готово!`,
    progressHistory: [
      { date: "2025-07-01", progress: 40, milestone: "Початок перекладу" },
      { date: "2025-09-15", progress: 70, milestone: "Основний сюжет" },
      { date: "2025-11-30", progress: 90, milestone: "Редактура" },
      { date: "2026-01-14", progress: 100, milestone: "Реліз!" }
    ]
  },
  {
    id: "digging-a-hole",
    releaseDate: "2026-01-05",
    title: "A Game About Digging A Hole™",
    description:
      "Мінімалістична гра про те, як копати яму в саду щойно купленого будинку. Збирайте ресурси, продавайте їх, поліпшуйте спорядження та розкрийте таємничий секрет. Коштує всього одну каву!",
    cover: "https://cdn2.steamgriddb.com/grid/6e37bf8ef1dcdb1bcf4cd4fb66167984.png",
    progress: 100,
    status: "done",
    stage: "Готово",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 100 },
    ],
    tags: ["Інді", "Симулятор", "Казуальна"],
    steamUrl: "https://store.steampowered.com/app/3244220/A_Game_About_Digging_A_Hole/",
    downloadUrl: "https://lbklauncher.com/games/a_game_about_digging_a_hole/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2025,
    lastUpdate: "2026-05-12",
    installInstructions: `## Встановлення локалізації A Game About Digging A Hole

### Через LBK Launcher
1. Завантажте та встановіть [LBK Launcher](https://lbklauncher.com/)
2. Запустіть лаунчер та знайдіть A Game About Digging A Hole у списку
3. Натисніть "Встановити локалізацію"
4. Запускайте гру через Steam як зазвичай

**Важливо:** Патч працює з версією гри Steam.`
  },
  {
    id: "nmh2",
    limitations: ["Перекладено не всі текстури: частина написів на зображеннях лишається англійською."],
    launcherSlug: "no_more_heroes_2_desperate_struggle",
    title: "No More Heroes 2: Desperate Struggle",
    series: "No More Heroes",
    description:
      "Тревіс Тачдаун повертається! Минуло три роки відтоді, як він підкорив вершину рейтингу найманих убивць і відійшов від справ. Та спокійне життя закінчується, коли в Санта-Дестрої вбивають його найкращого друга. Тепер Тревісу потрібна не слава, а помста. Озброївшись улюбленою променевою катаною, він знову вступає в смертельні сутички з найнебезпечнішими вбивцями міста, щоб пробитися з 51-го місця на саму вершину рейтингу. На вас чекають видовищні бої, божевільні боси, кривавий екшен, ретроігри у стилі 8-бітних аркад, чорний гумор і фірмове безумство Ґоїчі Суди. Цього разу все особисте. І Тревіс не зупиниться, доки не помститься.",
    cover: "https://cdn2.steamgriddb.com/grid/19f960c299756abbce4d8dbe2e096a1d.png",
    progress: 100,
    status: "in-progress",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 88 },
      { label: "Текстури", percent: 40 },
    ],
    tags: ["Бойовик", "Hack and Slash", "Аніме", "Beat 'em up"],
    steamUrl: "https://store.steampowered.com/app/1420300/No_More_Heroes_2_Desperate_Struggle/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2021,
    lastUpdate: "2026-11-01",
    releaseDate: "2026-11-01",
  },
  {
    id: "hotel-barcelona",
    releaseDate: "2026-06-02",
    title: "HOTEL BARCELONA",
    description:
      "HOTEL BARCELONA — божевільний горор-екшн від SWERY та SUDA51, де федеральна маршалка, одержима серійним убивцею, пробивається крізь моторошний готель, наповнений маніяками, кров’ю й абсурдом. На вас чекають сім зон у стилі різних піджанрів жахів, жорсткі боси, чорний гумор і фірмова шиза двох культових авторів.",
    cover: "https://cdn2.steamgriddb.com/thumb/a75ea8ff83616d5ce27efdd50da47ef3.jpg",
    progress: 100,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 0 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Бойовик", "Хоррор", "Піксельна графіка", "Інді"],
    steamUrl: "https://store.steampowered.com/app/2286600/HOTEL_BARCELONA/",
    downloadUrl: "https://lbklauncher.com/games/hotel_barcelona/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2025,
    lastUpdate: "2026-05-12",
    stats: {
      totalLines: 4751,
      translatedLines: 4751, // 100%
      totalWords: 22623, // Ukrainian + English
      totalCharacters: undefined,
    },
  },
  {
    id: "deadly-premonition-dc",
    launcherSlug: "deadly_premonition_the_directors_cut",
    launcherVersions: [{ slug: "deadly_premonition_recompilation", label: "Deadly Premonition Recompilation" }],
    title: "Deadly Premonition: The Director's Cut",
    series: "Deadly Premonition",
    description:
      "«Deadly Premonition» — дивна, незграбна, але до болю щира гра, яку або ненавидять, або закохуються назавжди. Вона здобула репутацію однієї з найсуперечливіших ігор жахів в історії, але саме її дивакуватість, потужна історія та незабутні персонажі зробили з неї справжню культову класику.",
    cover: "https://cdn2.steamgriddb.com/thumb/36cbb165fdbe3a26b21fa941d90737fe.png",
    progress: 43,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 43 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Хоррор", "Містерія", "Відкритий світ", "Атмосферна"],
    steamUrl: "https://store.steampowered.com/app/247660/Deadly_Premonition_The_Directors_Cut/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2013,
    lastUpdate: "2026-02-16",
    stats: {
      totalLines: 16667,
      translatedLines: 7211,
      totalWords: 143396, // Ukrainian + English
      totalCharacters: undefined,
    },
  },
  {
    id: "travis-strikes-again",
    launcherSlug: "travis_strikes_again_no_more_heroes_complete_edition",
    title: "Travis Strikes Again: No More Heroes",
    series: "No More Heroes",
    description:
      "Тревіс Тачдаун заляг на дно й проводить дні за відеоіграми, аж поки на порозі його трейлера не з’являється Бедмен — батько Бед Ґерл, який прийшов помститися за доньку. Та посеред сутички легендарна консоль Death Drive Mk II затягує обох усередину відеоігор. Тепер запеклим ворогам доведеться битися пліч-о-пліч.\n\nВирушайте на пошуки сфер смерті та пориньте в химерні ігрові світи, де кожен бос вважає себе головним героєм. Рубайте багів променевою катаною, комбінуйте чипи умінь і випробовуйте себе в боях, перегонах та інших божевільних витівках. Між сутичками — текстові пригоди, зустрічі зі старими знайомими й миска рамену, щоб відновити здоров’я. Грайте наодинці або запросіть друга до локального кооперативу: роботи для двох убивць тут вистачить.\n\nComplete Edition містить доповнення Black Dandelion і Bubblegum Fatale з додатковими сюжетними епізодами, уміннями та ігровими персонажами — Шінобу й Бед Ґерл.",
    cover: "https://cdn2.steamgriddb.com/thumb/3fb9ea9011a179ca6ef04fcb1e828d24.jpg",
    progress: 100,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 70 },
    ],
    tags: ["Бойовик", "Hack and Slash", "Інді", "Аркада"],
    steamUrl: "https://store.steampowered.com/app/961490/Travis_Strikes_Again_No_More_Heroes_Complete_Edition/",
    downloadUrl: "https://lbklauncher.com/games/travis_strikes_again_no_more_heroes_complete_edition/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2019,
    lastUpdate: "2026-10-15",
    releaseDate: "2026-10-15",
  },
  {
    id: "deadly-premonition-2",
    launcherSlug: "deadly_premonition_2_a_blessing_in_disguise",
    title: "Deadly Premonition 2: A Blessing in Disguise",
    series: "Deadly Premonition",
    description:
      "Сиквел трилера з дивакуватим шармом.",
    cover: "https://cdn2.steamgriddb.com/thumb/10dc0bb717c02b51d7f4e06704591f05.jpg",
    progress: 80,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 80 },
      { label: "Редактура", percent: 10 },
    ],
    tags: ["Хоррор", "Містерія", "Пригоди", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/1271100/Deadly_Premonition_2_A_Blessing_in_Disguise/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2022,
    lastUpdate: "2026-07-02",
    stats: {
      totalLines: 18436,
      translatedLines: 15117, // 82%
    },
  },
  {
    id: "lad-ishin",
    launcherSlug: "like_a_dragon_ishin",
    title: "Like a Dragon: Ishin!",
    series: "Yakuza",
    description:
      "Кіото 1860-х років. Самурай в пошуках справедливості змінить історію всього несправедливого суспільства. Наточіть свій меч та приєднуйтесь до революції у цій історичній пригоді.",
    cover: "https://cdn2.steamgriddb.com/thumb/302a3ba086a09127aff1b25258ffab24.jpg",
    progress: 68,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 68 },
      { label: "Редактура", percent: 62 },
    ],
    tags: ["Бойовик", "RPG", "Історична", "Пригоди"],
    steamUrl: "https://store.steampowered.com/app/1805480/Like_a_Dragon_Ishin/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2023,
    lastUpdate: "2026-11-08",
    stats: {
      totalLines: 62238, // діалоги й інтерфейс
    },
  },
  {
    id: "yakuza3",
    launcherSlug: "yakuza_3_remastered",
    title: "Yakuza 3 Remastered",
    series: "Yakuza",
    description:
      "Кадзума Кірю нарешті заслужив спокійну пенсію на піщаних пляжах Окінави. Але щойно кривава боротьба за владу приходить просто до його дверей, йому знову доведеться вийти на вулиці Камуро-чьо, щоб раз і назавжди вирватися з полону минулого.",
    cover: "https://cdn2.steamgriddb.com/thumb/3fc1a4fffe3e6f03caf6aaf25ddc01d4.jpg",
    progress: 14,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 14 },
      { label: "Редактура", percent: 0 },
    ],
    tags: ["Бойовик", "Пригоди", "Відкритий світ", "Кримінал"],
    steamUrl: "https://store.steampowered.com/app/1088710/Yakuza_3_Remastered/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2021,
    lastUpdate: "2026-02-16",
  },
  {
    id: "as-dusk-falls",
    releaseDate: "2025-12-30",
    title: "As Dusk Falls",
    description:
      "As Dusk Falls — кінематографічна інтерактивна драма від творців із Interior/Night, де ви проживаєте історію двох родин, чиї долі переплітаються після невдалого пограбування в маленькому містечку Аризони. Це гра про вибір і наслідки: кожне рішення змінює стосунки, хід подій і фінал. Візуальний стиль — як ожилий графічний роман, а проходження зручно ділиться на епізоди та добре підходить для гри з друзями.",
    cover: "https://cdn2.steamgriddb.com/thumb/7d3d82c29720a5cb8824d02529389ab5.jpg",
    progress: 10,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 10 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Інтерактивне кіно", "Драма", "Глибокий сюжет", "Пригоди"],
    steamUrl: "https://store.steampowered.com/app/1341820/As_Dusk_Falls/",
    downloadUrl: "https://lbklauncher.com/games/as_dusk_falls/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2022,
    lastUpdate: "2026-01-20",
    installInstructions: `## Встановлення локалізації As Dusk Falls

### Через LBK Launcher
1. Завантажте та встановіть [LBK Launcher](https://lbklauncher.com/)
2. Запустіть лаунчер та знайдіть As Dusk Falls у списку
3. Натисніть "Встановити локалізацію"
4. Запускайте гру через Steam як зазвичай

**Важливо:** Патч працює з версією гри Steam.`
  },

  {
    id: "shenmue",
    releaseDate: "2026-10-14",
    launcherSlug: "shenmue_i_ii",
    title: "Shenmue I & II",
    description:
      "Shenmue I & II — це перевидання легендарної дилогії Ю Судзукі, що поєднує кінематографічну історію помсти, відкритий світ та симуляцію повсякденного життя у Японії й Гонконґу кінця 80-х. У ролі юнака Рьо Хадзукі ти стаєш свідком убивства батька та вирушаєш у довгу подорож за слідами таємничого Лан Ді, збираючи уривки правди в розмовах, бійках і випадкових зустрічах.\n\nЗбірка містить обидві частини серії — Shenmue та Shenmue II — у покращеному вигляді для сучасних платформ: із підтримкою високих роздільних здатностей, оновленим інтерфейсом, сучасними схемами керування та можливістю обрати озвучення. При цьому збережено дух оригіналу з Dreamcast: детальні міські квартали, де магазини зачиняються за розкладом, NPC живуть за власним графіком, а погода і час доби впливають на твій щоденний розпорядок.\n\nНа тебе чекають вуличні бійки з прийомами джиу-джитсу, знамениті QTE-сцени, допити й розслідування, випадкові підробітки, а також аркадні автомати й безліч мініігор — від карате-тренувань до ігор у залах SEGA. Shenmue I & II не лише зібрала культову дилогію під однією обкладинкою, а й дає змогу відчути одну з найвпливовіших історичних віх для всіх сучасних пригодницьких ігор.",
    cover: "https://cdn2.steamgriddb.com/thumb/963d79c80b622f504a6970dde6ffab0e.jpg",
    progress: 70,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 70 },
      { label: "Редактура", percent: 10 },
    ],
    tags: ["Пригоди", "Відкритий світ", "Бойовик", "Атмосферна"],
    steamUrl: "https://store.steampowered.com/app/758330/Shenmue_I__II/",
    downloadUrl: "https://lbklauncher.com/games/shenmue_i_ii/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2018,
    lastUpdate: "2026-10-14",
  },
  {
    id: "jojo-asbr",
    launcherSlug: "jojos_bizarre_adventure_all_star_battle_r",
    title: "JoJo's Bizarre Adventure: All-Star Battle R",
    description:
      "Неперевершений шедевр Хірохіко Аракі оживає у вибуховому файтингу! Зіграйте за 50 яскравих бійців із власними Стендами, Хамоном та купою унікальних умінь — від божевільних комбо до фірмових добивань. Побачте, як персонажі, яким у оригінальній історії ніколи б не перетнутися, нарешті сходяться віч-на-віч і влаштовують сутички мрії для кожного фаната ДжоДжо!",
    cover: "https://cdn2.steamgriddb.com/thumb/0f5d8f2124b95d0ef0245533fa616693.png",
    progress: 100,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 50 },
    ],
    tags: ["Файтинг", "Аніме", "Бойовик", "Аркада"],
    steamUrl: "https://store.steampowered.com/app/1372110/JoJos_Bizarre_Adventure_AllStar_Battle_R/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-10-10",

    // Extended data
    gameYear: 2022,
    genre: ["Файтинг", "Аніме", "Мультиплеєр"],
    platform: ["PC", "PlayStation", "Xbox", "Switch"],
    translationSize: "medium",
    team: [
      { name: "Little Bit Team", role: "Переклад" }
    ],
    progressHistory: [
      { date: "2026-01-20", progress: 5, milestone: "Початок проєкту" },
      { date: "2026-02-16", progress: 9, milestone: "Перші персонажі" }
    ],
    stats: {
      totalWords: 133285, // 11849 укр + 121436 англ
      translatedLines: 11849 // Приблизна оцінка на основі слів
    }
  },
  {
    id: "the-good-life",
    launcherSlug: "the_good_life",
    title: "The Good Life",
    description:
      "The Good Life — це дивакувата пригодницька гра від SWERY про журналістку Наомі Гейворд, яка приїздить у британське містечко Рейні-Вудс, щоб розкрити його таємниці й виплатити власні борги. Удень тут панує затишне сільське життя, а вночі мешканці перетворюються на котів і собак. Гравцю доведеться фотографувати, розслідувати дивні події, виконувати доручення, досліджувати містечко та поступово дізнаватися, чому «найщасливіше місце у світі» приховує стільки химерного.",
    cover: "https://cdn2.steamgriddb.com/grid/6988bcd312727287326c36e724ba2367.png",
    progress: 13,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 13 },
    ],
    tags: ["RPG", "Інді", "Пригоди", "Симулятор", "Містерія"],
    steamUrl: "https://store.steampowered.com/app/1452500/The_Good_Life/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2021,
    lastUpdate: "2026-05-12",
  },
  {
    id: "silent-hill-shattered-memories",
    gameYear: 2009,
    releaseDate: "2026-10-14",
    launcherSlug: "silent_hill_shattered_memories",
    title: "Silent Hill: Shattered Memories",
    series: "Silent Hill",
    description:
      "Silent Hill: Shattered Memories це психологічний горор про Гаррі Мейсона, який після аварії шукає свою зниклу доньку Шеріл у засніженому Сайлент-Гіллі. Гра поєднує дослідження міста, головоломки, використання телефона, ліхтарика й тривожні сеанси психотерапії, а також напружені кошмарні погоні без звичного бойового акценту. Вибори гравця, відповіді на тести й поведінка під час проходження впливають на деталі світу, персонажів і те, як історія поступово розкриває тему пам'яті, страху й заперечення.",
    cover: "https://cdn2.steamgriddb.com/grid/1e5ecaa150c05b9ec1f0ca90860785d2.png",
    progress: 100,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 90 },
    ],
    tags: ["Хоррор", "Психологічний", "Атмосферна", "Пригоди", "Сюжетна"],
    platform: ["Wii", "PS2", "PSP"],
    downloadUrl: "https://lbklauncher.com/games/silent_hill_shattered_memories/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-10-14",
  },
  {
    id: "fire-emblem-three-houses",
    gameYear: 2019,
    title: "Fire Emblem: Three Houses",
    series: "Fire Emblem",
    description:
      "Викладаєш у Гарреґ-Маху, обираєш один із трьох домів — Чорні Орли, Сині Леви, Золоті Олені — і ведеш учнів від спокійних будніх занять до повномасштабної війни на континенті Фодлан.",
    cover: "https://cdn2.steamgriddb.com/grid/849460026d42c840faab34d4d3b9fc33.png",
    progress: 11,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 11 },
    ],
    tags: ["JRPG", "Тактика", "Покрокова", "Глибокий сюжет", "Аніме"],
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-07-31",
  },
  {
    id: "the-missing",
    releaseDate: "2026-06-01",
    title: "The MISSING: J.J. Macfield and the Island of Memories",
    description:
      "The Missing: J.J. Macfield and the Island of Memories — моторошна й зворушлива пригода від SWERY, у якій Джей-Джей вирушає на острів Спогадів, щоб знайти зниклу подругу. На цьому кошмарному острові смерть не кінець: героїня знову й знову відроджується, використовуючи власні травми для розв’язання пазлів і поступово відкриваючи болісну правду про себе.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/842910/library_600x900_2x.jpg",
    progress: 100,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 50 },
      { label: "Текстури", percent: 50 },
    ],
    tags: ["Платформер", "Інді", "Сюжетна", "Атмосферна", "Психологічний"],
    steamUrl: "https://store.steampowered.com/app/842910/The_MISSING_JJ_Macfield_and_the_Island_of_Memories/",
    downloadUrl: "https://lbklauncher.com/games/the_missing_jj_macfield_and_the_island_of_memories/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2018,
    lastUpdate: "2026-05-12",
  },
  {
    id: "metal-gear-solid-4",
    gameYear: 2026,
    releaseDate: "2026-09-19",
    title: "METAL GEAR SOLID 4: Guns of the Patriots — Master Collection",
    series: "Metal Gear",
    description:
      "METAL GEAR SOLID 4: GUNS OF THE PATRIOTS — масштабний стелс-екшен, у якому Старий Снейк вирушає у свою останню місію. Гра поєднує тактичне проникнення, видовищні бої, кінематографічну постановку та емоційну історію про війну, спадщину й завершення цілої епохи.",
    cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2492670/157a186fed0c042110ab99871bdad8e341811ec1/library_capsule_2x.jpg?t=1785222293",
    progress: 95,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 95 },
      { label: "Редактура", percent: 10 },
    ],
    tags: ["Стелс", "Бойовик", "Тактика", "Класика", "Глибокий сюжет"],
    steamUrl: "https://store.steampowered.com/app/4184400/METAL_GEAR_SOLID_4_Guns_of_the_Patriots__Master_Collection_Version/",
    downloadUrl: "https://lbklauncher.com/games/metal_gear_solid_4_guns_of_the_patriots_master_collection_version/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    videoUrl: "https://www.youtube.com/watch?v=HgqicXhm-XI",
    lastUpdate: "2026-09-09",
  },
  {
    id: "kingdom-hearts-3",
    title: "KINGDOM HEARTS III + Re Mind (DLC)",
    series: "Kingdom Hearts",
    description:
      "Емоційна пригодницька RPG про Сору та його друзів, які подорожують світами Disney та Pixar, щоб зупинити темряву. Разом із Дональдом і Ґуфі ти борешся з ворогами, відкриваєш нові світи й захищаєш серця тих, хто тобі дорогий.",
    cover: "https://cdn2.steamgriddb.com/grid/1318ae15a52c171bf63b0db992ba1451.png",
    progress: 57,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 57 },
    ],
    tags: ["Action RPG", "JRPG", "Пригоди", "Аніме", "Disney"],
    steamUrl: "https://store.steampowered.com/app/2552450/KINGDOM_HEARTS_III__Re_Mind_DLC/",
    downloadUrl: "https://lbklauncher.com/games/kingdom_hearts_iii_re_mind_dlc/solovina-komanda-dmytro-naumchas-naumenko",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2024,
    lastUpdate: "2026-10-10",
  },
  {
    id: "lost-judgment",
    launcherSlug: "lost_judgment",
    title: "Lost Judgment",
    series: "Judgment",
    description:
      "Коли поліцейський зізнається у вбивстві вчителя-стажера, який цькував його сина й довів до самогубства, зі стін старшої школи в Йокоґамі починають просочуватися викривлені таємниці. У цій справі немає нічого чорно-білого.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2058190/library_600x900_2x.jpg?t=1663168032",
    progress: 17,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 17 },
    ],
    tags: ["Бойовик", "Детектив", "Пригоди", "Відкритий світ", "Кримінал"],
    steamUrl: "https://store.steampowered.com/app/2058190/Lost_Judgment/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2022,
    lastUpdate: "2026-07-31",
    progressHistory: [
      { date: "2026-01-15", progress: 3, milestone: "Початок проєкту" },
      { date: "2026-02-16", progress: 7, milestone: "Перші глави" },
      { date: "2026-04-28", progress: 14, milestone: "13.75% перекладено" },
      { date: "2026-05-08", progress: 14, milestone: "13.97% перекладено" },
      { date: "2026-07-31", progress: 29, milestone: "29% перекладено" },
    ],
  },
  {
    id: "silent-hill-downpour",
    gameYear: 2012,
    launcherSlug: "silent_hill_downpour",
    title: "Silent Hill: Downpour",
    series: "Silent Hill",
    description:
      "Silent Hill: Downpour — психологічний горор про в’язня Мерфі Пендлтона, який після аварії опиняється в туманному Сайлент-Гіллі. Місто змушує його пройти крізь провину, страх і спогади, де кожен дощ приносить нову небезпеку, а правда виявляється страшнішою за будь-якого монстра.",
    cover: "https://cdn2.steamgriddb.com/grid/7f996610ab63c3bc9590c1bd8e9a7d65.png",
    progress: 60,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 60 },
      { label: "Редактура", percent: 10 },
    ],
    tags: ["Хоррор", "Психологічний", "Відкритий світ", "Атмосферна", "Пригоди"],
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    lastUpdate: "2026-07-02",
  },
  {
    id: "catherine-classic",
    title: "Catherine Classic",
    description:
      "Catherine Classic — культова сюжетна головоломка від ATLUS про кохання, зраду, страх відповідальності та нічні кошмари. Вдень Вінсент намагається розібратися у стосунках між Кетрін і Катаріною, а вночі дереться смертельно небезпечними вежами з блоків. Ваші рішення, діалоги й моральний вибір впливають на розвиток історії та фінал.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/893180/library_600x900_2x.jpg",
    progress: 32,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 32 },
    ],
    tags: ["Головоломка", "Психологічний", "Пригоди", "Аніме"],
    steamUrl: "https://store.steampowered.com/app/893180/Catherine_Classic/",
    downloadUrl: "https://lbklauncher.com/games/catherine_classic/little-bit-locus-team",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2019,
    lastUpdate: "2026-09-01",
  },
  {
    id: "mgs1-master-collection",
    launcherSlug: "metal_gear_solid_master_collection_version",
    title: "METAL GEAR SOLID - Master Collection Version",
    series: "Metal Gear",
    description:
      "METAL GEAR SOLID — легендарний стелс-екшен, у якому Солід Снейк вирушає на секретну операцію, щоб зупинити небезпечну терористичну загрозу. На вас чекають тактичне проникнення, напружені сутички, незабутні персонажі та кінематографічна історія, що назавжди змінила жанр стелс-ігор.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2131630/library_600x900_2x.jpg",
    progress: 27,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 27 },
    ],
    tags: ["Стелс", "Бойовик", "Тактика", "Класика", "Глибокий сюжет"],
    steamUrl: "https://store.steampowered.com/app/2131630/METAL_GEAR_SOLID__Master_Collection_Version/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2023,
    lastUpdate: "2026-10-10",
  },
  {
    id: "mgs3-master-collection",
    releaseDate: "2026-09-27",
    title: "METAL GEAR SOLID 3: Snake Eater - Master Collection Version",
    series: "Metal Gear",
    description:
      "Маскування, виживання, тактичне проникнення та історія, що заклала основу майбутньої долі Біґ Боса.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2131650/library_600x900_2x.jpg",
    progress: 50,
    status: "early-access",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 50 },
      { label: "Редактура", percent: 30 },
    ],
    tags: ["Стелс", "Бойовик", "Тактика", "Класика", "Глибокий сюжет"],
    steamUrl: "https://store.steampowered.com/app/2131650/METAL_GEAR_SOLID_3_Snake_Eater__Master_Collection_Version/",
    downloadUrl: "https://lbklauncher.com/games/metal_gear_solid_3_snake_eater_master_collection_version/little-bit-solovina-komanda",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2023,
    lastUpdate: "2026-09-26",
  },
  {
    id: "metal-gear-mg2",
    releaseDate: "2026-09-18",
    limitations: ["Лаунчер гри (меню перед запуском) не перекладено.", "Текстури (написи на зображеннях) не перекладено — вони лишаються англійською."],
    title: "METAL GEAR & METAL GEAR 2: Solid Snake",
    series: "Metal Gear",
    description:
      "METAL GEAR та METAL GEAR 2: Solid Snake — класичні стелс-екшени Хідео Коджіми, з яких почалася історія серії METAL GEAR.\n\nУ ролі Соліда Снейка гравець проникає на добре захищені ворожі бази, уникає прямих зіткнень, збирає спорядження, підтримує зв’язок із союзниками через радіо та розкриває змови, пов’язані з ядерною зброєю й бойовими машинами Metal Gear.\n\nДруга частина розвиває ідеї оригіналу, додаючи складніший стелс, покращену поведінку ворогів, розширені локації та значно глибший сюжет.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2131680/library_600x900_2x.jpg",
    progress: 100,
    status: "done",
    stage: "Готово",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 100 },
      { label: "Текстури", percent: 0 },
    ],
    tags: ["Стелс", "Бойовик", "Тактика", "Класика"],
    steamUrl: "https://store.steampowered.com/app/2131680/METAL_GEAR__METAL_GEAR_2_Solid_Snake/",
    downloadUrl: "https://lbklauncher.com/games/metal_gear_metal_gear_2_solid_snake/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2023,
    lastUpdate: "2026-09-26",
  },
  {
    id: "mgsv-ground-zeroes",
    launcherSlug: "metal_gear_solid_v_ground_zeroes",
    title: "METAL GEAR SOLID V: GROUND ZEROES",
    series: "Metal Gear",
    description:
      "METAL GEAR SOLID V: GROUND ZEROES — пролог до подій The Phantom Pain, у якому Біґ Бос вирушає на таємну операцію на військовій базі Кемп Омега.\n\nГра робить ставку на відкриті локації, свободу дій, приховане проникнення та тактичний підхід. Ground Zeroes знайомить із новою версією ігрового процесу Metal Gear Solid, рушієм FOX Engine і закладає основу для подій METAL GEAR SOLID V.",
    cover: "https://cdn2.steamgriddb.com/grid/3d5cbcad747c5477f33557043b62bbeb.png",
    progress: 89,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 89 },
    ],
    tags: ["Стелс", "Бойовик", "Тактика", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/311340/METAL_GEAR_SOLID_V_GROUND_ZEROES/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2014,
    lastUpdate: "2026-10-10",
  },
  {
    id: "resident-evil-requiem",
    launcherSlug: "resident_evil_requiem",
    // Лаунчер показує лише цілі відсотки, а тут точне значення від команди
    launcherSync: false,
    title: "Resident Evil Requiem",
    series: "Resident Evil",
    description:
      "Resident Evil Requiem — дев’ята основна частина культової серії survival horror від Capcom, що повертає гравців туди, де колись почався справжній кошмар, — до Раккун-Сіті.\n\nУ центрі історії — аналітикиня ФБР Ґрейс Ешкрофт та легендарний Леон С. Кеннеді. Дві різні історії та два підходи до виживання поєднують напружений психологічний горор, дослідження небезпечних локацій, загадки й видовищні бойові сутички.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/3764200/ed3b2cae7d15f598f41006f5f1e605ec5517b5e4/library_capsule_2x.jpg",
    progress: 100,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 10 },
    ],
    tags: ["Хоррор", "Бойовик", "Психологічний", "Атмосферна"],
    steamUrl: "https://store.steampowered.com/app/3764200/Resident_Evil_Requiem/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    videoUrl: "https://www.youtube.com/watch?v=5Bk3RuhjquA",
    gameYear: 2026,
    lastUpdate: "2026-10-10",
    stats: {
      totalLines: 11791, // записів тексту
      totalWords: 58573, // слів в англійському тексті
      totalCharacters: 360874,
    },
  },
  {
    id: "dead-rising-deluxe-remaster",
    releaseDate: "2026-09-27",
    title: "Dead Rising Deluxe Remaster",
    series: "Dead Rising",
    description:
      "Dead Rising Deluxe Remaster — оновлена версія культового зомбі-екшену про журналіста Френка Веста, який опиняється у величезному торговому центрі, переповненому мерцями. У вас є 72 години, щоб розібратися, що сталося, рятувати вцілілих і виживати, використовуючи буквально все, що трапиться під руку.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2527390/library_600x900_2x.jpg",
    progress: 100,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 40 },
    ],
    tags: ["Бойовик", "Хоррор", "Beat 'em up", "Відкритий світ"],
    steamUrl: "https://store.steampowered.com/app/2527390/Dead_Rising_Deluxe_Remaster/",
    downloadUrl: "https://lbklauncher.com/games/dead_rising_deluxe_remaster/little-bit",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2024,
    lastUpdate: "2026-09-26",
  },
  {
    id: "dead-rising",
    releaseDate: "2026-09-27",
    launcherSlug: "dead_rising",
    title: "Dead Rising",
    series: "Dead Rising",
    description:
      "Dead Rising — культовий зомбі-екшен про фотожурналіста Френка Веста, який прибуває до торгового центру Вілламетта, щоб розслідувати загадковий спалах. У нього є лише 72 години, щоб з’ясувати правду, рятувати вцілілих і пробиватися крізь орди мерців усім, що потрапить під руку.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/427190/library_600x900_2x.jpg",
    progress: 100,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 40 },
    ],
    tags: ["Бойовик", "Хоррор", "Beat 'em up", "Класика"],
    steamUrl: "https://store.steampowered.com/app/427190/DEAD_RISING/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2016,
    lastUpdate: "2026-09-26",
  },
  {
    id: "silent-hill-townfall",
    launcherSlug: "silent_hill_townfall",
    title: "Silent Hill: Townfall",
    series: "Silent Hill",
    description:
      "Саймон Ордел вирішує повернутися до острівного містечка, щоб «усе владнати», і поступово занурюється у світ напруженого переховування, вибухових сутичок та карколомних загадок, які поступово виводять на поверхню правду про Св. Амелію.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/1636440/cdad5ea5a7f19f1394a6393416c83720664ecf81/library_capsule_2x.jpg",
    progress: 100,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 100 },
    ],
    tags: ["Хоррор", "Психологічний", "Атмосферна", "Пригоди"],
    steamUrl: "https://store.steampowered.com/app/1636440/SILENT_HILL_Townfall/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2026,
    lastUpdate: "2026-10-10",
  },
  {
    id: "kh-birth-by-sleep",
    releaseDate: "2026-09-30",
    title: "KINGDOM HEARTS Birth by Sleep FINAL MIX",
    series: "Kingdom Hearts",
    description:
      "Приквел до основної серії, що розповідає історію трьох володарів Ключ-клинка: Терри, Акви та Вентуса. Їхні окремі шляхи поступово переплітаються у спільній історії про дружбу, світло й темряву та події, що назавжди змінили долю всесвіту KINGDOM HEARTS.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2552430/library_600x900_2x.jpg",
    progress: 100,
    status: "early-access",
    stage: "Редактура",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 80 },
      { label: "Текстури", percent: 30 },
    ],
    tags: ["Action RPG", "JRPG", "Пригоди", "Disney"],
    steamUrl: "https://store.steampowered.com/app/2552430/KINGDOM_HEARTS_HD_1525_ReMIX/",
    // У лаунчері гра — частина сторінки збірки 1.5+2.5 (там 40%), тож цифри лише звідси
    // і щоденна перевірка їх із лаунчером не порівнює
    launcherSync: false,
    launcherCheck: false,
    downloadUrl: "https://lbklauncher.com/games/kingdom_hearts_hd_1525_remix/little-bit-dmytro-naumchas-naumenko-solovina-komanda",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2024,
    lastUpdate: "2026-09-30",
  },
  {
    id: "kh-rechain-of-memories",
    launcherSlug: "kingdom_hearts_rechain_of_memories",
    title: "KINGDOM HEARTS Re:Chain of Memories",
    series: "Kingdom Hearts",
    description:
      "KINGDOM HEARTS Re:Chain of Memories — рольова екшн-гра, події якої відбуваються між KINGDOM HEARTS і KINGDOM HEARTS II.\n\nПісля завершення своєї першої великої подорожі Сора разом із Дональдом і Ґуфі потрапляє до загадкового Замку Забуття. Тут кожен новий поверх породжує світи, створені зі спогадів, а що далі герої просуваються, то більше починають забувати те, що було для них важливим.\n\nУ Re:Chain of Memories звична для серії бойова система поєднується з механікою карт: атаки, магія, предмети та здібності виконуються за допомогою спеціальної колоди. Правильне складання карт і використання комбінацій стають ключем до перемоги.\n\nОкрім історії Сори, гра містить окрему сюжетну кампанію за Ріку, яка розкриває його внутрішню боротьбу та події, що безпосередньо ведуть до KINGDOM HEARTS II.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2552430/library_600x900_2x.jpg",
    progress: 100,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 44 },
    ],
    tags: ["Action RPG", "JRPG", "Пригоди", "Disney"],
    steamUrl: "https://store.steampowered.com/app/2552430/KINGDOM_HEARTS_HD_1525_ReMIX/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2024,
    lastUpdate: "2026-10-10",
  },
  {
    id: "kh-dream-drop-distance",
    launcherSlug: "kingdom_hearts_dream_drop_distance_hd",
    title: "KINGDOM HEARTS Dream Drop Distance HD",
    series: "Kingdom Hearts",
    description:
      "KINGDOM HEARTS Dream Drop Distance HD кидає Сору та Ріку в нове випробування, де межа між сном і реальністю стає дедалі тоншою.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2552440/library_600x900_2x.jpg",
    progress: 0,
    status: "planned",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 0 },
    ],
    tags: ["Action RPG", "JRPG", "Пригоди", "Disney"],
    steamUrl: "https://store.steampowered.com/app/2552440/KINGDOM_HEARTS_HD_28_Final_Chapter_Prologue/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2024,
    lastUpdate: "2026-09-26",
  },
  {
    id: "lad-infinite-wealth",
    launcherSlug: "like_a_dragon_infinite_wealth",
    title: "Like a Dragon: Infinite Wealth",
    series: "Yakuza",
    description:
      "Like a Dragon: Infinite Wealth — масштабна рольова пригода, що поєднує драматичну історію, фірмовий гумор серії та покрокові бої. На вас чекають яскраві персонажі, великі міста, безліч побічних занять і шалені пригоди, у яких серйозні теми легко сусідять із цілковитим безумством.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2072450/library_600x900_2x.jpg",
    progress: 0,
    status: "planned",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 0 },
    ],
    tags: ["RPG", "JRPG", "Покрокова", "Відкритий світ", "Кримінал"],
    steamUrl: "https://store.steampowered.com/app/2072450/Like_a_Dragon_Infinite_Wealth/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2024,
    lastUpdate: "2026-09-26",
  },
  {
    id: "cat-quest",
    solovinaEra: true,
    launcherSlug: "cat_quest",
    title: "Cat Quest",
    description:
      "Чудова рольова гра у котячому світі.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/593280/library_600x900_2x.jpg",
    progress: 100,
    status: "done",
    stage: "Готово",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 100 },
    ],
    tags: ["Рольова гра", "Пригоди", "Інді"],
    steamUrl: "https://store.steampowered.com/app/593280/Cat_Quest/",
    downloadUrl: "https://lbklauncher.com/games/cat_quest",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2017,
    platform: ["PC"],
  },
  {
    id: "florence",
    solovinaEra: true,
    launcherSlug: "florence",
    title: "Florence",
    description:
      "Florence — це коротка, але дуже емоційна інтерактивна історія про перше кохання та пошук себе. Це радше ігрова новела/комікс, ніж «гра» у звичному сенсі: приблизно за пів години ти проживаєш невеликий шматок життя 25-річної Флоренс Йо, яка застрягла в рутині роботи, сну й бездумного гортання соцмереж.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/1102130/library_600x900_2x.jpg",
    progress: 100,
    status: "done",
    stage: "Готово",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 100 },
    ],
    tags: ["Пригоди", "Інтерактивна історія", "Інді"],
    steamUrl: "https://store.steampowered.com/app/1102130/Florence/",
    downloadUrl: "https://lbklauncher.com/games/florence",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2020,
    platform: ["PC"],
  },
  {
    id: "i-am-fish",
    solovinaEra: true,
    launcherSlug: "i_am_fish",
    title: "I Am Fish",
    description:
      "I Am Fish — це симпатична гра з реалістичною фізикою про безстрашних рибок, які втратили свою домівку та опинилися в акваріумі зоомагазину. Плавайте, літайте, перекачуйтесь та прогризайте усі перешкоди на шляху до океану, щоб здобути свободу.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/1472560/library_600x900_2x.jpg",
    progress: 100,
    status: "done",
    stage: "Готово",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 100 },
    ],
    tags: ["Пригоди", "Фізика", "Кумедна"],
    steamUrl: "https://store.steampowered.com/app/1472560/I_Am_Fish/",
    downloadUrl: "https://lbklauncher.com/games/i_am_fish",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2021,
    platform: ["PC"],
  },
  {
    id: "kingdom-hearts-2",
    // У лаунчері гра — частина сторінки збірки 1.5+2.5 (там 40%), тож цифри лише звідси
    // і щоденна перевірка їх із лаунчером не порівнює
    launcherSync: false,
    launcherCheck: false,
    title: "KINGDOM HEARTS II FINAL MIX",
    series: "Kingdom Hearts",
    description:
      "Друга номерна частина серії KINGDOM HEARTS. Сора, Дональд і Ґуфі знову вирушають у подорож світами Disney, щоб протистояти Безсердним і загадковій Організації XIII. Гра входить до збірки KINGDOM HEARTS -HD 1.5+2.5 ReMIX-.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2552430/library_600x900_2x.jpg",
    progress: 100,
    status: "done",
    stage: "Готово",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 100 },
    ],
    tags: ["Action RPG", "JRPG", "Пригоди", "Disney"],
    steamUrl: "https://store.steampowered.com/app/2552430/KINGDOM_HEARTS_HD_1525_ReMIX/",
    downloadUrl: "https://lbklauncher.com/games/kingdom_hearts_hd_1525_remix/little-bit-dmytro-naumchas-naumenko-solovina-komanda",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2024,
    platform: ["PC"],
  },
  {
    id: "kingdom-hearts-1525",
    launcherSlug: "kingdom_hearts_hd_1525_remix",
    title: "KINGDOM HEARTS -HD 1.5+2.5 ReMIX-",
    series: "Kingdom Hearts",
    description:
      "Kingdom Hearts HD 1.5 Remix — це збірка класичних пригод серії Kingdom Hearts у покращеному HD-виданні. Гравці вирушають у чарівну подорож разом із Сорою, Дональдом і Ґуфі, відвідуючи світи Disney та борючись із темрявою, що загрожує серцям людей.\n\nДо збірки входять оновлена версія першої Kingdom Hearts, Kingdom Hearts Re:Chain of Memories, а також сюжетні сцени з Kingdom Hearts 358/2 Days. Це чудова нагода познайомитися з початком великої історії про дружбу, світло, темряву та силу серця.",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/2552430/library_600x900_2x.jpg",
    progress: 40,
    status: "in-progress",
    stage: "Переклад",
    stageDetails: [
      { label: "Переклад", percent: 40 },
    ],
    tags: ["Action RPG", "JRPG", "Пригоди", "Disney", "Збірка"],
    steamUrl: "https://store.steampowered.com/app/2552430/KINGDOM_HEARTS_HD_1525_ReMIX/",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2024,
    platform: ["PC"],
  },
  {
    id: "tmnt-shredders-revenge",
    solovinaEra: true,
    launcherSlug: "teenage_mutant_ninja_turtles_shredders_revenge",
    title: "Teenage Mutant Ninja Turtles: Shredder's Revenge",
    description:
      "Повернення класичних черепах з підземки. Агов, хтось замовляв піцу?",
    cover: "https://shared.steamstatic.com/store_item_assets/steam/apps/1361510/library_600x900_2x.jpg",
    progress: 100,
    status: "done",
    stage: "Готово",
    stageDetails: [
      { label: "Переклад", percent: 100 },
      { label: "Редактура", percent: 100 },
    ],
    tags: ["Біт-ем-ап", "Кооператив", "Інді"],
    steamUrl: "https://store.steampowered.com/app/1361510/Teenage_Mutant_Ninja_Turtles_Shredders_Revenge/",
    downloadUrl: "https://lbklauncher.com/games/teenage_mutant_ninja_turtles_shredders_revenge",
    donateUrl: "https://send.monobank.ua/jar/3h4akVJRXK",
    gameYear: 2022,
    platform: ["PC"],
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
