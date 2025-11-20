document.addEventListener('DOMContentLoaded', () => {
    
    // --- ДАНІ ПРОЄКТІВ (ПОВНИЙ СПИСОК З assets) ---
    const projectsData = [
      { "id": "nier-replicant", "title": "NieR Replicant ver.1.22...", "cover": "assets/nier_replicant.webp", "logo": "assets/nier_replicant_logo.webp", "status": "in-progress", "progress": 8, "desc": "Інтерфейс і субтитри українською.", "desc_en": "UI and subtitles in Ukrainian.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": [] },
      { "id": "dispatch", "title": "Dispatch", "cover": "assets/Dispatch.webp", "logo": "assets/Dispatch_logo.webp", "status": "in-progress", "progress": 50, "progress_mode": "episodes", "progress_ep1": 100, "progress_ep2": 100, "progress_ep3": 100, "progress_ep4": 100, "progress_ep5": 58, "desc": "Текстова українська локалізація чотирьох епізодів.", "desc_en": "Text Ukrainian localization of four episodes.", "cta": { "type": "enabled", "label": "Завантажити", "url": "https://drive.google.com/file/d/1PxV-wsFB8PS5a2RaCHhxfS7OaAGfRt7R/view?usp=sharing" }, "videos": ["https://www.youtube.com/watch?v=JnsQQNCTCPs"] },
      { "id": "lad", "title": "Yakuza: Like a Dragon", "cover": "assets/LaD.webp", "logo": "assets/LaD_logo.webp", "status": "fundraising", "raised": 11020, "goal": 35000, "progress": 18, "progress_textures": 35, "desc": "Збір на локалізацію.", "desc_en": "Fundraising.", "cta": { "type": "enable", "label": "Спонсорувати", "url": "https://donatello.to/LittleBitUA" }, "videos": ["https://www.youtube.com/watch?v=dhObkWG-goU"] },
      { "id": "mgs2", "title": "MGS 2: Sons of Liberty", "cover": "assets/MGS2.webp", "logo": "assets/MGS2_Logo.webp", "status": "fundraising", "raised": 13246, "goal": 25000, "progress": 15, "progress_text": 15, "desc": "Збір на локалізацію.", "desc_en": "Fundraising.", "cta": { "type": "enable", "label": "Спонсорувати", "url": "https://donatello.to/LittleBitUA" }, "videos": ["https://www.youtube.com/watch?v=14EBz2UG1vI"] },
      { "id": "uncharted-df", "title": "Uncharted: Drake's Fortune", "cover": "assets/Uncharted.webp", "logo": "assets/Uncharted_logo.webp", "status": "early-access", "progress": 82, "progress_text": 86, "desc": "Повний текстовий переклад.", "desc_en": "Full text translation.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=3O6n4R-69sc"] },
      { "id": "uncharted-2", "title": "Uncharted 2: Among Thieves", "cover": "assets/Uncharted2.webp", "logo": "assets/Uncharted2_Logo.webp", "status": "fundraising", "raised": 1110, "goal": 8000, "progress": 8, "desc": "Збір на локалізацію.", "desc_en": "Fundraising.", "cta": { "type": "enable", "label": "Спонсорувати", "url": "https://donatello.to/LittleBitUA" }, "videos": [] },
      { "id": "hotel-barcelona", "title": "HOTEL BARCELONA", "cover": "assets/barcelona.webp", "logo": "assets/barcelona_logo.webp", "status": "in-progress", "progress": 50, "desc": "Авторський проєкт SWERY та SUDA51.", "desc_en": "SWERY and SUDA51 project.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=VW4ZfUZ1wI4"] },
      { "id": "jojo-asbr", "title": "JoJo's Bizarre Adventure: ASBR", "cover": "assets/jojo_asbr.webp", "logo": "assets/jojo_asbr_logo.webp", "status": "in-progress", "progress": 4, "desc": "Повна текстова українська локалізація.", "desc_en": "Full text Ukrainian localization.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=MMTx8IkFBXg"] },
      { "id": "judgment", "title": "Judgment", "cover": "assets/judgment_takayuki.webp", "logo": "assets/judgment_logo.webp", "status": "early-access", "progress": 89, "progress_textures": 50, "desc": "Неонуарний детектив.", "desc_en": "Neo-noir detective.", "cta": { "type": "link", "label": "Завантажити", "url": "https://donatello.to/post/68de432ff7753d8d33210ca4/ukrayinizator-dlya-judgment-ranniy-dostup-donatello-2-02-10-2025" }, "videos": ["https://www.youtube.com/watch?v=8cnFlWRILKY"] },
      { "id": "lost-judgment", "title": "Lost Judgment", "cover": "assets/lost_judgment.webp", "logo": "assets/lost_judgment_logo.webp", "status": "in-progress", "progress": 6, "desc": "Продовження історії Яґамі.", "desc_en": "Yagami's story continues.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=wx2OMw06t58"] },
      { "id": "ishin", "title": "Like a Dragon: Ishin!", "cover": "assets/Ishin.webp", "logo": "assets/Ishin_Logo.webp", "status": "in-progress", "progress": 15, "desc": "Історична пригода.", "desc_en": "Historical adventure.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=eRTaJJn9ldI"] },
      { "id": "yk2", "title": "Yakuza Kiwami 2", "cover": "assets/yakuza_kiwami2.webp", "logo": "assets/yakuza_kiwami2_logo.webp", "status": "in-progress", "progress": 60, "progress_textures": 30, "desc": "Культовий ремейк.", "desc_en": "Cult remake.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=wKe05u8sT_s"] },
      { "id": "y3", "title": "Yakuza 3 Remastered", "cover": "assets/yakuza_3_remastered.webp", "logo": "assets/yakuza3_logo.webp", "status": "in-progress", "progress": 14, "desc": "Той самий пляжний епізод.", "desc_en": "The iconic beach episode.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=N25iZVyPLeI"] },
      { "id": "nmh1", "title": "No More Heroes", "cover": "assets/no_more_heroes_travis.webp", "logo": "assets/no_more_heroes_logo.webp", "status": "early-access", "progress": 86, "progress_textures": 90, "desc": "Пригода Тревіса Тачдауна.", "desc_en": "Travis Touchdown's adventure.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=tkDdmZFxWbE"] },
      { "id": "nmh2", "title": "No More Heroes 2", "cover": "assets/no_more_heroes_2.webp", "logo": "assets/no_more_heroes2_logo.webp", "status": "early-access", "progress": 100, "progress_textures": 40, "desc": "Ще більше стилю та боїв!", "desc_en": "Even more style and combat!", "cta": { "type": "link", "label": "Завантажити", "url": "https://t.me/LittleBitUA/95" }, "videos": ["https://www.youtube.com/watch?v=8HGKIRc7MB8"] },
      { "id": "tsa", "title": "Travis Strikes Again", "cover": "assets/travis_strikes_again.webp", "logo": "assets/travis_strikes_again_logo.webp", "status": "in-progress", "progress": 23, "desc": "Експериментальний спін-оф.", "desc_en": "Experimental spin-off.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=YP8a4amktGE"] },
      { "id": "nmh3", "title": "No More Heroes 3", "cover": "assets/no_more_heroes_3.webp", "logo": "assets/no_more_heroes3_logo.webp", "status": "early-access", "progress": 100, "progress_textures": 60, "desc": "Надери дупу прибульцям!", "desc_en": "Kick some alien butt!", "cta": { "type": "link", "label": "Завантажити", "url": "https://t.me/LittleBitUA/95" }, "videos": ["https://www.youtube.com/watch?v=ZmbOIwUhC24"] },
      { "id": "dp1", "title": "Deadly Premonition DC", "cover": "assets/DP1.webp", "logo": "assets/DP1_Logo.webp", "status": "in-progress", "progress": 37, "desc": "Культовий містичний трилер.", "desc_en": "Cult mystery thriller.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=zIdPzW-H8gI"] },
      { "id": "dp2", "title": "Deadly Premonition 2", "cover": "assets/DP2.webp", "logo": "assets/DP2_Logo.webp", "status": "in-progress", "progress": 15, "desc": "Сиквел трилера з дивакуватим шармом.", "desc_en": "Sequel to the cult thriller.", "cta": { "type": "disabled", "label": "Завантажити", "url": "#" }, "videos": ["https://www.youtube.com/watch?v=66F3TanyZzI"] }
    ];

    // --- ДАНІ ДОБРОЧИНЦІВ ---
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
    
    // --- ПЕРЕКЛАДИ ---
    const translations = {
        uk: {
            nav_projects: "Проєкти", nav_support: "Підтримка", nav_contacts: "Контакти",
            hero_title: "Грайте українською —<br>відчувайте по-новому.",
            hero_lead: "Улюблені історії — українською, від серця.",
            stat_projects: "ПРОЄКТІВ", stat_avg: "СЕР. ГОТОВНІСТЬ", stat_ea: "РАННІЙ ДОСТУП",
            search_ph: "Пошук всесвіту...", filter_all: "Всі", filter_in_progress: "В процесі", filter_fundraising: "Збір", filter_early_access: "Ранній доступ",
            contacts_title: "Контакти", contacts_text: "Слідкуйте за новинами:",
            support_title: "Фінансова підтримка", support_text: "Підтримайте нас донатом.",
            benefactors_title: "ДОБРОЧИНЦІ",
            st_prog: "В ПРОЦЕСІ", st_fund: "ЗБІР КОШТІВ", st_early: "РАННІЙ ДОСТУП", st_done: "ГОТОВО",
            lbl_readiness: "Готовність", lbl_raised: "Зібрано",
            btn_dl: "Завантажити", btn_details: "Деталі", lbl_episode: "Епізод",
            lbl_text: "Текст", lbl_textures: "Текстури", lbl_fonts: "Шрифти"
        },
        en: {
            nav_projects: "Projects", nav_support: "Support", nav_contacts: "Contacts",
            hero_title: "Play in Ukrainian —<br>feel it anew.",
            hero_lead: "Favorite stories — in Ukrainian, from the heart.",
            stat_projects: "PROJECTS", stat_avg: "AVG. READINESS", stat_ea: "EARLY ACCESS",
            search_ph: "Search universe...", filter_all: "All", filter_in_progress: "In Progress", filter_fundraising: "Fundraising", filter_early_access: "Early Access",
            contacts_title: "Contacts", contacts_text: "Follow our news:",
            support_title: "Financial Support", support_text: "Support us with a donation.",
            benefactors_title: "BENEFACTORS",
            st_prog: "IN PROGRESS", st_fund: "FUNDRAISING", st_early: "EARLY ACCESS", st_done: "RELEASED",
            lbl_readiness: "Readiness", lbl_raised: "Raised",
            btn_dl: "Download", btn_details: "Details", lbl_episode: "Episode",
            lbl_text: "Text", lbl_textures: "Textures", lbl_fonts: "Fonts"
        }
    };
    
    let currentLang = 'uk';
    const grid = document.getElementById('projects');
    let activeFilter = 'all';

    // --- ФУНКЦІЯ TILT (3D-ефект на десктопі) ---
    const initTilt = (card) => {
        card.addEventListener('mousemove', (e) => {
            if(window.innerWidth < 900) return; 
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; const y = e.clientY - rect.top;
            const cx = rect.width / 2; const cy = rect.height / 2;
            const dx = (x - cx) / cx; const dy = (y - cy) / cy;
            card.style.transform = `perspective(1000px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    };

    // --- ФУНКЦІЯ ПЕРЕКЛАДУ ІНТЕРФЕЙСУ ---
    window.setLang = (lang) => {
        currentLang = lang;
        const t = translations[lang];
        document.querySelectorAll('.lang-opt').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.lang-opt')[lang === 'uk' ? 0 : 1].classList.add('active');
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            if(t[el.dataset.i18n]) el.innerHTML = t[el.dataset.i18n];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            if(t[el.dataset.i18nPlaceholder]) el.placeholder = t[el.dataset.i18nPlaceholder];
        });
        renderGrid();
    };

    // --- ФУНКЦІЯ ФІЛЬТРУВАННЯ ТА ВІДОБРАЖЕННЯ КАРТОК ---
    function renderGrid() {
        const term = document.getElementById('search').value.toLowerCase();
        grid.innerHTML = '';
        const t = translations[currentLang];

        const filtered = projectsData.filter(p => {
            const matchCat = activeFilter === 'all' || p.status === activeFilter;
            const matchTerm = p.title.toLowerCase().includes(term);
            return matchCat && matchTerm;
        });

        filtered.forEach(p => {
            let stClass = 'st-prog', stText = t.st_prog;
            let barColor = 'var(--neon-blue)';
            let metaLabel = t.lbl_readiness;
            let metaVal = `${p.progress}%`;
            let btnClass = 'btn-grad-blue';

            if(p.status === 'fundraising') {
                stClass = 'st-fund'; stText = t.st_fund; barColor = 'var(--neon-orange)';
                metaLabel = t.lbl_raised;
                if(p.goal) metaVal = `${(p.raised/1000).toFixed(1)}k / ${(p.goal/1000).toFixed(1)}k`;
                btnClass = 'btn-fund';
            } else if(p.status === 'early-access') {
                stClass = 'st-early'; stText = t.st_early; barColor = 'var(--neon-purple)';
                btnClass = 'btn-early';
            }

            const btnLabel = (currentLang==='uk'? p.cta.label : (p.cta.label_en || p.cta.label));
            let btnHtml = `<a href="${p.cta.url}" target="_blank" class="btn-action ${btnClass}">${btnLabel}</a>`;
            if(p.cta.type === 'disabled') {
                btnHtml = `<span class="btn-action btn-disabled">${btnLabel}</span>`;
            }

            const card = document.createElement('article');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="card-visual">
                    <img src="${p.cover}" class="card-bg-img" loading="lazy">
                    <div class="card-logo-layer">
                        <img src="${p.logo}" class="card-logo" onerror="this.style.display='none'">
                    </div>
                </div>
                <div class="card-info">
                    <div class="c-header"><div class="status-pill ${stClass}">${stText}</div></div>
                    <h3 class="card-title">${p.title}</h3>
                    <div class="progress-wrap">
                        <div class="p-meta"><span>${metaLabel}</span><span>${metaVal}</span></div>
                        <div class="p-track">
                            <div class="p-bar" style="width:${p.progress}%; background:${barColor}; box-shadow:0 0 10px ${barColor}"></div>
                        </div>
                    </div>
                    <div class="card-actions">
                        ${btnHtml}
                        <button class="btn-action btn-details" onclick="openModal('${p.id}')">${t.btn_details}</button>
                    </div>
                </div>
            `;
            initTilt(card);
            grid.appendChild(card);
        });

        // Оновлення статистики
        document.getElementById('stat-count').innerText = filtered.length;
        document.getElementById('stat-ea').innerText = filtered.filter(p => p.status === 'early-access').length;
        const active = filtered.filter(p => p.status !== 'fundraising');
        const avg = active.length ? Math.round(active.reduce((a,b)=>a+(b.progress||0),0)/active.length) : 0;
        document.getElementById('stat-avg').innerText = avg + "%";
    }

    // --- ОБРОБНИКИ ПОДІЙ ДЛЯ ФІЛЬТРІВ ТА ПОШУКУ ---
    document.querySelectorAll('.f-btn').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.f-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        activeFilter = b.dataset.filter;
        renderGrid();
    }));
    document.getElementById('search').addEventListener('input', renderGrid);

    // --- ВІДОБРАЖЕННЯ СПИСКУ ДОБРОЧИНЦІВ ---
    const bList = document.getElementById('benefactors-list');
    benefactorsList.forEach(b => {
        const sp = document.createElement('span');
        sp.className = `b-tag ${b.type||''}`;
        sp.innerText = (b.type==='gold'?'👑 ':b.type==='green'?'💚 ':b.type==='flamingo'?'🦩 ':'') + b.name;
        bList.appendChild(sp);
    });

    // --- ФУНКЦІЯ ВІДОБРАЖЕННЯ МОДАЛЬНОГО ВІКНА ---
    const modal = document.getElementById('modal');
    window.openModal = (id) => {
        const p = projectsData.find(x => x.id === id);
        if(!p) return;
        const t = translations[currentLang];

        document.getElementById('m-logo').src = p.logo;
        document.getElementById('m-title').innerText = p.title;
        document.getElementById('m-desc').innerHTML = currentLang==='uk'?p.desc: (p.desc_en || p.desc);
        
        const sBox = document.getElementById('m-stats'); sBox.innerHTML = '';
        
        const addBar = (l, v) => { 
            if(v !== undefined) sBox.innerHTML += `
            <div class="stat-row">
                <div class="stat-label">${l}</div>
                <div style="flex:1; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden">
                    <div style="height:100%; background:#00f2ff; width:${v}%; box-shadow:0 0 10px #00f2ff"></div>
                </div>
                <div style="font-weight:700">${v}%</div>
            </div>`; 
        };
        
        if (p.progress_mode === 'episodes') {
             for(let i=1; i<=8; i++) {
                const val = p[`progress_ep${i}`];
                if(val !== undefined && val !== 0) addBar(`${t.lbl_episode} ${i}`, val);
             }
        } else if (p.status === 'fundraising') {
            if(p.goal) {
                const pct = Math.min(Math.round((p.raised/p.goal)*100), 100);
                addBar(t.lbl_raised, pct);
            }
            if(p.progress_text) addBar(t.lbl_text, p.progress_text);
        } else {
            if(p.progress_text !== undefined) addBar(t.lbl_text, p.progress_text);
            else if (p.progress !== undefined) addBar(t.lbl_text, p.progress);

            if(p.progress_textures !== undefined) addBar(t.lbl_textures, p.progress_textures);
            if(p.progress_fonts !== undefined) addBar(t.lbl_fonts, p.progress_fonts);
        }

        const vBox = document.getElementById('m-video'); vBox.innerHTML = '';
        if(p.videos && p.videos.length) {
             const vID = p.videos[0].match(/v=([a-zA-Z0-9_-]+)/)?.[1];
             if(vID) vBox.innerHTML = `<iframe width="100%" height="300" src="https://www.youtube.com/embed/${vID}" frameborder="0" allowfullscreen></iframe>`;
        }

        const btnLabel = (currentLang==='uk'? p.cta.label : (p.cta.label_en || p.cta.label));
        const btnHref = p.cta.type === 'disabled' ? '#' : p.cta.url;
        
        let btnStyle = 'background:linear-gradient(135deg, #00c6ff, #0072ff); color:white';
        if(p.status === 'fundraising') btnStyle = 'background:linear-gradient(135deg, var(--neon-orange), #d97706); color:black';
        else if(p.status === 'early-access') btnStyle = 'background:linear-gradient(135deg, #e056fd, #686de0); color:white';

        document.getElementById('m-actions').innerHTML = `<a href="${btnHref}" target="_blank" class="btn-action" style="flex:1; ${btnStyle}">${btnLabel}</a>`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // --- ФУНКЦІЯ ЗАКРИТТЯ МОДАЛЬНОГО ВІКНА ---
    const closeM = () => { modal.classList.remove('active'); document.body.style.overflow = ''; document.getElementById('m-video').innerHTML=''; };
    document.querySelector('.modal-close').addEventListener('click', closeM);
    modal.addEventListener('click', e => { if(e.target === modal) closeM(); });

    // --- ЗАПУСК ---
    renderGrid();
});
