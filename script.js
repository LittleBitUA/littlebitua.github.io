document.addEventListener('DOMContentLoaded', () => {
    
    // --- TRANSLATIONS ---
    const translations = {
        uk: {
            nav_projects: "Проєкти",
            nav_support: "Підтримка",
            nav_contacts: "Контакти",
            nav_benefactors: "Доброчинці",
            hero_title: "Грайте українською —<br>відчувайте по-новому.",
            hero_lead: "Улюблені історії — українською, від серця.",
            stat_projects: "проєктів",
            stat_avg: "сер. готовність",
            stat_ea: "ранній доступ",
            hero_what_we_do: "Що ми робимо",
            hero_li_1: "Повна текстова локалізація (інтерфейс, субтитри, туторіали)",
            hero_li_2: "Підтримка та інтеграція шрифтів, технічний супровід",
            hero_li_3: "Художня адаптація з дотриманням чинного правопису",
            search_ph: "Пошук...",
            filter_all: "Всі",
            filter_in_progress: "В процесі",
            filter_fundraising: "Збір",
            filter_early_access: "Ранній доступ",
            support_title: "Фінансова підтримка",
            support_text: "Якщо вам подобається наша робота, ви можете підтримати нас донатом. Це пришвидшує вихід нових локалізацій.",
            contacts_title: "Контакти",
            contacts_text: "Слідкуйте за новинами у наших соцмережах:",
            benefactors_title: "Доброчинці",
            benefactors_text: "Люди, завдяки яким наші переклади виходять у світ. Щиро дякуємо!",
            footer_rights: "© 2025 Little Bit",
            status_fundraising: "Збір коштів",
            status_early_access: "Ранній доступ",
            status_in_progress: "В процесі",
            status_done: "Готово",
            btn_download: "Завантажити",
            btn_sponsor: "Спонсорувати",
            btn_details: "Деталі",
            modal_progress_title: "Детальний прогрес",
            lbl_readiness: "Готовність",
            lbl_raised: "Зібрано",
            lbl_text: "Текст",
            lbl_textures: "Текстури",
            lbl_fonts: "Шрифти",
            lbl_episode: "Епізод"
        },
        en: {
            nav_projects: "Projects",
            nav_support: "Support",
            nav_contacts: "Contacts",
            nav_benefactors: "Benefactors",
            hero_title: "Play in Ukrainian —<br>feel it anew.",
            hero_lead: "Favorite stories — in Ukrainian, from the heart.",
            stat_projects: "projects",
            stat_avg: "avg. readiness",
            stat_ea: "early access",
            hero_what_we_do: "What we do",
            hero_li_1: "Full text localization (UI, subtitles, tutorials)",
            hero_li_2: "Font support and technical integration",
            hero_li_3: "Artistic adaptation respecting current orthography",
            search_ph: "Search...",
            filter_all: "All",
            filter_in_progress: "In Progress",
            filter_fundraising: "Fundraising",
            filter_early_access: "Early Access",
            support_title: "Financial Support",
            support_text: "If you like our work, you can support us with a donation. It speeds up new localizations.",
            contacts_title: "Contacts",
            contacts_text: "Follow our news on social media:",
            benefactors_title: "Benefactors",
            benefactors_text: "People who made these localizations possible. Thank you!",
            footer_rights: "© 2025 Little Bit",
            status_fundraising: "Fundraising",
            status_early_access: "Early Access",
            status_in_progress: "In Progress",
            status_done: "Released",
            btn_download: "Download",
            btn_sponsor: "Sponsor",
            btn_details: "Details",
            modal_progress_title: "Detailed Progress",
            lbl_readiness: "Readiness",
            lbl_raised: "Raised",
            lbl_text: "Text",
            lbl_textures: "Textures",
            lbl_fonts: "Fonts",
            lbl_episode: "Episode"
        }
    };

    let currentLang = 'uk'; // Default language

    // --- DATA ---
    const projectsData = [
      {
        "id": "nier-replicant",
        "title": "NieR Replicant ver.1.22...",
        "cover": "assets/nier_replicant.webp",
        "logo": "assets/nier_replicant_logo.webp",
        "status": "in-progress",
        "progress": 8, "progress_text": 8, "progress_textures": 0, "progress_fonts": 100,
        "desc": "Інтерфейс і субтитри українською.",
        "desc_en": "UI and subtitles in Ukrainian.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "videos": []
      },
      {
        "id": "dispatch",
        "title": "Dispatch",
        "cover": "assets/Dispatch.webp",
        "logo": "assets/Dispatch_logo.webp",
        "status": "in-progress",
        "progress": 50,
        "progress_mode": "episodes",
        "progress_ep1": 100, "progress_ep2": 100, "progress_ep3": 100, "progress_ep4": 100,
        "progress_ep5": 58, "progress_ep6": 0, "progress_ep7": 0, "progress_ep8": 0,
        "desc": "Текстова українська локалізація чотирьох епізодів.",
        "desc_en": "Text Ukrainian localization of four episodes.",
        "cta": { "type": "enabled", "label": "Завантажити", "label_en": "Download", "url": "https://drive.google.com/file/d/1PxV-wsFB8PS5a2RaCHhxfS7OaAGfRt7R/view?usp=sharing", "primary": true },
        "videos": ["https://www.youtube.com/watch?v=JnsQQNCTCPs"]
      },
      {
        "id": "lad",
        "title": "Yakuza: Like a Dragon",
        "cover": "assets/LaD.webp",
        "logo": "assets/LaD_logo.webp",
        "status": "fundraising",
        "raised": 11020, "goal": 35000,
        "progress": 18, "progress_text": 18, "progress_textures": 35, "progress_fonts": 90,
        "desc": "Збір на українську локалізацію: інтерфейс, субтитри.",
        "desc_en": "Fundraising for Ukrainian localization: UI, subtitles.",
        "cta": { "type": "enable", "label": "Спонсорувати", "label_en": "Sponsor", "url": "https://donatello.to/LittleBitUA", "primary": true },
        "steam": "https://store.steampowered.com/app/1235140/Yakuza_Like_a_Dragon/",
        "videos": ["https://www.youtube.com/watch?v=dhObkWG-goU"]
      },
      {
        "id": "mgs2",
        "title": "MGS 2: Sons of Liberty",
        "cover": "assets/MGS2.webp",
        "logo": "assets/MGS2_Logo.webp",
        "status": "fundraising",
        "raised": 13246, "goal": 25000,
        "progress": 15, "progress_text": 15, "progress_textures": 0, "progress_fonts": 100,
        "desc": "Збір на українську локалізацію: інтерфейс, субтитри.",
        "desc_en": "Fundraising for Ukrainian localization: UI, subtitles.",
        "cta": { "type": "enable", "label": "Спонсорувати", "label_en": "Sponsor", "url": "https://donatello.to/LittleBitUA", "primary": true },
        "steam": "https://store.steampowered.com/app/2131660/",
        "videos": ["https://www.youtube.com/watch?v=14EBz2UG1vI"]
      },
      {
        "id": "uncharted-df",
        "title": "Uncharted: Drake's Fortune",
        "cover": "assets/Uncharted.webp",
        "logo": "assets/Uncharted_logo.webp",
        "status": "early-access",
        "progress": 82, "progress_text": 86, "progress_textures": 0, "progress_fonts": 100,
        "desc": "Повний текстовий переклад. Інтерфейс і субтитри.",
        "desc_en": "Full text translation. UI and subtitles.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "videos": ["https://www.youtube.com/watch?v=3O6n4R-69sc"]
      },
      {
        "id": "uncharted-2",
        "title": "Uncharted 2: Among Thieves",
        "cover": "assets/Uncharted2.webp",
        "logo": "assets/Uncharted2_Logo.webp",
        "status": "fundraising",
        "raised": 1110, "goal": 8000,
        "progress": 8, "progress_text": 8, "progress_textures": 0, "progress_fonts": 100,
        "desc": "Збір на українську локалізацію: інтерфейс, субтитри.",
        "desc_en": "Fundraising for Ukrainian localization: UI, subtitles.",
        "cta": { "type": "enable", "label": "Спонсорувати", "label_en": "Sponsor", "url": "https://donatello.to/LittleBitUA", "primary": true },
        "videos": []
      },
      {
        "id": "hotel-barcelona",
        "title": "HOTEL BARCELONA",
        "cover": "assets/barcelona.webp",
        "logo": "assets/barcelona_logo.webp",
        "status": "in-progress",
        "progress": 50, "progress_text": 50, "progress_textures": 0, "progress_fonts": 70,
        "desc": "Авторський проєкт SWERY та SUDA51. Локалізація у процесі.",
        "desc_en": "SWERY and SUDA51 project. Localization in progress.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "steam": "https://store.steampowered.com/app/2286600/HOTEL_BARCELONA/",
        "videos": ["https://www.youtube.com/watch?v=VW4ZfUZ1wI4"]
      },
      {
        "id": "jojo-asbr",
        "title": "JoJo's Bizarre Adventure: ASBR",
        "cover": "assets/jojo_asbr.webp",
        "logo": "assets/jojo_asbr_logo.webp",
        "status": "in-progress",
        "progress": 4, "progress_text": 5, "progress_textures": 0, "progress_fonts": 100,
        "desc": "Повна текстова українська локалізація.",
        "desc_en": "Full text Ukrainian localization.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "steam": "https://store.steampowered.com/app/1372110/",
        "videos": ["https://www.youtube.com/watch?v=MMTx8IkFBXg"]
      },
      {
        "id": "judgment",
        "title": "Judgment",
        "cover": "assets/judgment_takayuki.webp",
        "logo": "assets/judgment_logo.webp",
        "status": "early-access",
        "progress": 89, "progress_text": 89, "progress_textures": 50, "progress_fonts": 100,
        "desc": "Неонуарний детектив. Переклад підісторій та інтерфейсу.",
        "desc_en": "Neo-noir detective. Substories and UI translation.",
        "cta": { "type": "link", "label": "Завантажити", "label_en": "Download", "url": "https://donatello.to/post/68de432ff7753d8d33210ca4/ukrayinizator-dlya-judgment-ranniy-dostup-donatello-2-02-10-2025", "primary": true },
        "steam": "https://store.steampowered.com/app/2058180/Judgment/",
        "videos": ["https://www.youtube.com/watch?v=8cnFlWRILKY"]
      },
      {
        "id": "lost-judgment",
        "title": "Lost Judgment",
        "cover": "assets/lost_judgment.webp",
        "logo": "assets/lost_judgment_logo.webp",
        "status": "in-progress",
        "progress": 6, "progress_text": 6, "progress_textures": 0, "progress_fonts": 60,
        "desc": "Продовження історії Яґамі. Сюжет та інтерфейс.",
        "desc_en": "Yagami's story continues. Story and UI translation.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "steam": "https://store.steampowered.com/app/2058180/Lost_Judgment/",
        "videos": ["https://www.youtube.com/watch?v=wx2OMw06t58"]
      },
      {
        "id": "ishin",
        "title": "Like a Dragon: Ishin!",
        "cover": "assets/Ishin.webp",
        "logo": "assets/Ishin_Logo.webp",
        "status": "in-progress",
        "progress": 15, "progress_text": 15, "progress_textures": 0, "progress_fonts": 60,
        "desc": "Історична пригода. Сюжет та субтитри.",
        "desc_en": "Historical adventure. Story and subtitles.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "steam": "https://store.steampowered.com/app/1805480/Like_a_Dragon_ISHIN/",
        "videos": ["https://www.youtube.com/watch?v=eRTaJJn9ldI"]
      },
      {
        "id": "yk2",
        "title": "Yakuza Kiwami 2",
        "cover": "assets/yakuza_kiwami2.webp",
        "logo": "assets/yakuza_kiwami2_logo.webp",
        "status": "in-progress",
        "progress": 60, "progress_text": 90, "progress_textures": 30, "progress_fonts": 100,
        "desc": "Культовий ремейк. Переклад підісторій та інтерфейсу.",
        "desc_en": "Cult remake. Substories and UI translation.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "steam": "https://store.steampowered.com/app/927380/Yakuza_Kiwami_2/",
        "videos": ["https://www.youtube.com/watch?v=wKe05u8sT_s"]
      },
      {
        "id": "y3",
        "title": "Yakuza 3 Remastered",
        "cover": "assets/yakuza_3_remastered.webp",
        "logo": "assets/yakuza3_logo.webp",
        "status": "in-progress",
        "progress": 14, "progress_text": 14, "progress_textures": 0, "progress_fonts": 100,
        "desc": "Той самий пляжний епізод. Переклад оригінальної гри та ремейку.",
        "desc_en": "The iconic beach episode. Translation of original and remake.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "steam": "https://store.steampowered.com/app/1088710/Yakuza_3_Remastered/",
        "videos": ["https://www.youtube.com/watch?v=N25iZVyPLeI"]
      },
      {
        "id": "nmh1",
        "title": "No More Heroes",
        "cover": "assets/no_more_heroes_travis.webp",
        "logo": "assets/no_more_heroes_logo.webp",
        "status": "early-access",
        "progress": 86, "progress_text": 90, "progress_textures": 90, "progress_fonts": 100,
        "desc": "Пригода Тревіса Тачдауна. Сюжет, туторіали, інтерфейс.",
        "desc_en": "Travis Touchdown's adventure. Story, tutorials, UI.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "steam": "https://store.steampowered.com/app/1420290/No_More_Heroes/",
        "videos": ["https://www.youtube.com/watch?v=tkDdmZFxWbE"]
      },
      {
        "id": "nmh2",
        "title": "No More Heroes 2",
        "cover": "assets/no_more_heroes_2.webp",
        "logo": "assets/no_more_heroes2_logo.webp",
        "status": "early-access",
        "progress": 100, "progress_text": 100, "progress_textures": 40, "progress_fonts": 100,
        "desc": "Ще більше стилю та боїв!",
        "desc_en": "Even more style and combat!",
        "cta": { "type": "link", "label": "Завантажити", "label_en": "Download", "url": "https://t.me/LittleBitUA/95", "primary": true },
        "steam": "https://store.steampowered.com/app/1420300/",
        "videos": ["https://www.youtube.com/watch?v=8HGKIRc7MB8"]
      },
      {
        "id": "tsa",
        "title": "Travis Strikes Again",
        "cover": "assets/travis_strikes_again.webp",
        "logo": "assets/travis_strikes_again_logo.webp",
        "status": "in-progress",
        "progress": 23, "progress_text": 23, "progress_textures": 0, "progress_fonts": 100,
        "desc": "Експериментальний спін-оф.",
        "desc_en": "Experimental spin-off.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "steam": "https://store.steampowered.com/app/1010100/",
        "videos": ["https://www.youtube.com/watch?v=YP8a4amktGE"]
      },
      {
        "id": "nmh3",
        "title": "No More Heroes 3",
        "cover": "assets/no_more_heroes_3.webp",
        "logo": "assets/no_more_heroes3_logo.webp",
        "status": "early-access",
        "progress": 100, "progress_text": 100, "progress_textures": 60, "progress_fonts": 100,
        "desc": "Надери дупу прибульцям! Сюжет та інтерфейс.",
        "desc_en": "Kick some alien butt! Story and UI.",
        "cta": { "type": "link", "label": "Завантажити", "label_en": "Download", "url": "https://t.me/LittleBitUA/95", "primary": true },
        "steam": "https://store.steampowered.com/app/1744330/No_More_Heroes_3/",
        "videos": ["https://www.youtube.com/watch?v=ZmbOIwUhC24"]
      },
      {
        "id": "dp1",
        "title": "Deadly Premonition DC",
        "cover": "assets/DP1.webp",
        "logo": "assets/DP1_Logo.webp",
        "status": "in-progress",
        "progress": 37, "progress_text": 37, "progress_textures": 0, "progress_fonts": 100,
        "desc": "Культовий містичний трилер. Сюжет та інтерфейс.",
        "desc_en": "Cult mystery thriller. Story and UI.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "steam": "https://store.steampowered.com/app/247660/",
        "videos": ["https://www.youtube.com/watch?v=zIdPzW-H8gI"]
      },
      {
        "id": "dp2",
        "title": "Deadly Premonition 2",
        "cover": "assets/DP2.webp",
        "logo": "assets/DP2_Logo.webp",
        "status": "in-progress",
        "progress": 15, "progress_text": 15, "progress_textures": 0, "progress_fonts": 100,
        "desc": "Сиквел трилера з дивакуватим шармом.",
        "desc_en": "Sequel to the cult thriller.",
        "cta": { "type": "disabled", "label": "Завантажити", "label_en": "Download", "url": "#" },
        "steam": "https://store.steampowered.com/app/1271100/",
        "videos": ["https://www.youtube.com/watch?v=66F3TanyZzI"]
      }
    ];

    const benefactorsList = [
        {name: "VADKO", type: "gold"}, {name: "Krov", type: "gold"},
        {name: "Хоук", type: "green"}, {name: "Hlamingo", type: "flamingo"},
        {name: "BreadHood"}, {name: "grafdralkuma"}, {name: "Мимокрокодил"},
        {name: "Volodymyr"}, {name: "anonymous"}, {name: "Дмитро"}, {name: "Македонський"},
        {name: "Рома"}, {name: "Jobitronik"}, {name: "AlviSeed"}, {name: "HorseBH"},
        {name: "Владислав"}, {name: "Nodertuk"}, {name: "Артур К"}, {name: "Валто"},
        {name: "Uatarasas"}, {name: "smutok"}, {name: "Костянтин"}, {name: "SPOQ"},
        {name: "Віталій"}, {name: "Fan"}, {name: "Сатаносексуалка"}, {name: "UnknownTheHero"},
        {name: "Нудьга"}, {name: "YarosTop1GG"}, {name: "Павло"}, {name: "Kazeiro Artist💗"},
        {name: "Jean Kartösciante"}, {name: "JoJo"}, {name: "Окунь"}, {name: "Мухобієчка"},
        {name: "beesexyial"}, {name: "Володимир"}, {name: "Бісик"}, {name: "Ігор Д."},
        {name: "Олексій Мороз"}, {name: "SpY_129"}, {name: "Billey"}, {name: "Іван Кіпрв"},
        {name: "KAREMBO"}, {name: "соня"}, {name: "rage"}, {name: "Бурʼян"}, {name: "LoydiN"},
        {name: "Андрійко"}, {name: "Смуток"}, {name: "Misha"}, {name: "Мемна Арта"},
        {name: "Микита"}, {name: "Мирослав Сеник"}, {name: "Andryxa"}, {name: "Богдан Городюк"},
        {name: "Дмитро С."}, {name: "Andrii Kravchenko"}, {name: "Вова ЇЖ"}, {name: "Dima Feyleg"},
        {name: "Дмитро"}, {name: "офіцерППО"}, {name: "Ігор"}, {name: "Артем"},
        {name: "Ton"}, {name: "Ярослав"}, {name: "BlackWolf94"}
    ];

    // --- LANGUAGE FUNCTION ---
    window.setLang = (lang) => {
        currentLang = lang;
        const t = translations[lang];

        // Buttons style
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        const btnIndex = lang === 'uk' ? 0 : 1;
        document.querySelectorAll('.lang-btn')[btnIndex].classList.add('active');

        // Static text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if(t[key]) el.innerHTML = t[key];
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if(t[key]) el.placeholder = t[key];
        });

        // Re-render projects to translate content
        doFilter();
    }

    // --- RENDER PROJECTS ---
    const grid = document.getElementById('grid');
    
    function renderCards(list) {
        grid.innerHTML = '';
        const t = translations[currentLang];

        list.forEach(p => {
            // Status Logic
            let statusLabel = t.status_in_progress;
            let badgeClass = "badge-blue"; // Default (In Progress)

            if(p.status === 'fundraising') {
                statusLabel = t.status_fundraising;
                badgeClass = "badge-orange";
            } else if (p.status === 'early-access') {
                statusLabel = t.status_early_access;
                badgeClass = "badge-purple";
            }

            // Calculate Bar & Meta
            let barW = p.progress;
            let metaInfo = `${t.lbl_readiness}: <strong>${p.progress}%</strong>`;
            
            if(p.status === 'fundraising' && p.goal) {
                const pct = Math.min(Math.round((p.raised / p.goal) * 100), 100);
                barW = pct;
                metaInfo = `${t.lbl_raised}: <strong>${p.raised} / ${p.goal} ₴</strong>`;
            }

            // Translate Desc & Button
            const desc = currentLang === 'uk' ? p.desc : p.desc_en;
            const label = currentLang === 'uk' ? p.cta.label : p.cta.label_en;

            // Button Logic
            let btnHtml = `<span class="btn btn-primary" style="opacity:0.5; cursor:default">${label || t.status_in_progress}</span>`;
            if(p.cta.type !== 'disabled') {
                let btnClass = 'btn-primary';
                if (p.status === 'early-access' || p.status === 'done') {
                    btnClass = 'btn-primary-active';
                } else if (p.status === 'fundraising') {
                    btnClass = 'btn-primary-sponsor';
                }
                btnHtml = `<a href="${p.cta.url}" target="_blank" class="btn ${btnClass}">${label}</a>`;
            }

            const card = document.createElement('article');
            card.className = 'glass card';
            card.innerHTML = `
                <div class="thumb">
                    <img src="${p.cover}" class="cover" alt="${p.title}" loading="lazy">
                    <div class="status-badge ${badgeClass}">${statusLabel}</div>
                    <img src="${p.logo}" class="logo-overlay" alt="Logo">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${p.title}</h3>
                    <p class="card-desc">${desc}</p>
                    
                    <div class="progress-line"><div class="progress-fill" style="width:${barW}%"></div></div>
                    <div class="meta-row">
                        <span>${metaInfo}</span>
                    </div>

                    <div class="actions">
                        ${btnHtml}
                        <button class="btn btn-icon" onclick="openModal('${p.id}')" title="Детальніше">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 16v-4"></path>
                                <path d="M12 8h.01"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        updateStats(list); // Calc stats based on filtered list
    }

    // --- RENDER BENEFACTORS ---
    const bContainer = document.getElementById('benefactors-list');
    benefactorsList.forEach(b => {
        const span = document.createElement('span');
        span.className = `b-chip ${b.type || ''}`;
        
        let icon = '';
        if (b.type === 'gold') icon = '👑 ';
        else if (b.type === 'green') icon = '💚 ';
        else if (b.type === 'flamingo') icon = '🦩 ';

        span.textContent = icon + b.name;
        bContainer.appendChild(span);
    });

    // --- STATS ---
    function updateStats(list) {
        document.getElementById('stat-count').innerText = list.length;
        
        const activeProjects = list.filter(p => p.status !== 'fundraising');
        const avg = Math.round(activeProjects.reduce((a,b) => a + (b.progress || 0), 0) / activeProjects.length);
        document.getElementById('stat-avg').innerText = avg + "%";

        const eaCount = list.filter(p => p.status === 'early-access').length;
        document.getElementById('stat-ea').innerText = eaCount;
    }

    // --- FILTERS & SEARCH ---
    const filters = document.querySelectorAll('.chip');
    const searchInput = document.getElementById('search');
    let activeFilter = 'all';

    function doFilter() {
        const term = searchInput.value.toLowerCase();
        const filtered = projectsData.filter(p => {
            const matchCat = activeFilter === 'all' || p.status === activeFilter;
            const desc = (currentLang === 'uk' ? p.desc : p.desc_en).toLowerCase();
            const matchTerm = p.title.toLowerCase().includes(term) || desc.includes(term);
            return matchCat && matchTerm;
        });
        renderCards(filtered);
    }

    filters.forEach(f => f.addEventListener('click', () => {
        filters.forEach(btn => btn.classList.remove('active'));
        f.classList.add('active');
        activeFilter = f.dataset.filter;
        doFilter();
    }));

    searchInput.addEventListener('input', doFilter);

    // --- MODAL LOGIC ---
    const modal = document.getElementById('modal');
    const mClose = document.querySelector('.modal-close');
    
    window.openModal = (id) => {
        const p = projectsData.find(x => x.id === id);
        if(!p) return;
        const t = translations[currentLang];

        // Basic Info
        document.getElementById('m-logo').src = p.logo;
        document.getElementById('m-desc').innerHTML = currentLang === 'uk' ? p.desc : p.desc_en;

        // Build Stats Bars
        const statsBox = document.getElementById('m-stats');
        statsBox.innerHTML = '';

        const createBar = (label, val) => `
            <div class="stat-row">
                <div class="stat-label">${label}</div>
                <div class="stat-track"><div class="progress-fill" style="width:${val}%"></div></div>
                <div class="stat-val">${val}%</div>
            </div>`;

        if(p.progress_mode === 'episodes') {
            for(let i=1; i<=8; i++) {
                const epVal = p[`progress_ep${i}`];
                if(epVal !== undefined) {
                    statsBox.innerHTML += createBar(`${t.lbl_episode} ${i}`, epVal);
                }
            }
        } else if (p.status === 'fundraising') {
             const pct = Math.round((p.raised / p.goal) * 100);
             statsBox.innerHTML += createBar(t.lbl_raised, Math.min(pct, 100));
             statsBox.innerHTML += createBar(t.lbl_text, p.progress_text || 0);
        } else {
            if(p.progress_text !== undefined) statsBox.innerHTML += createBar(t.lbl_text, p.progress_text);
            if(p.progress_textures !== undefined) statsBox.innerHTML += createBar(t.lbl_textures, p.progress_textures);
            if(p.progress_fonts !== undefined) statsBox.innerHTML += createBar(t.lbl_fonts, p.progress_fonts);
        }

        // Video
        const vBox = document.getElementById('m-video');
        vBox.innerHTML = '';
        if(p.videos && p.videos.length) {
            const vID = p.videos[0].match(/v=([a-zA-Z0-9_-]+)/)?.[1];
            if(vID) vBox.innerHTML = `<iframe src="https://www.youtube.com/embed/${vID}" allowfullscreen></iframe>`;
        }

        // Links
        const lBox = document.getElementById('m-links');
        lBox.innerHTML = '';
        if(p.steam) lBox.innerHTML += `<a href="${p.steam}" target="_blank" class="btn btn-icon" style="width:auto; padding:0 15px; font-size:1rem">Steam</a>`;
        
        const label = currentLang === 'uk' ? p.cta.label : p.cta.label_en;
        if(p.cta.type !== 'disabled') lBox.innerHTML += `<a href="${p.cta.url}" target="_blank" class="btn btn-primary">${label}</a>`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeM = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('m-video').innerHTML = ''; 
    };

    mClose.addEventListener('click', closeM);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeM(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeM(); });

    // Init
    renderCards(projectsData);
});
