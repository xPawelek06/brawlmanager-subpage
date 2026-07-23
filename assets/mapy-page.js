// Wspólna zawartość pary stron Mapy (PL: /Mapy/) <-> Maps (EN: /Maps/) — patrz
// assets/i18n.js (nagłówek + sekcja "Komendy/Mapy") i assets/komendy-page.js
// (ten sam wzorzec, ta sama uzasadniona decyzja: markup + słownik + logika
// żyją TYLKO tutaj, obie strony HTML to cienkie powłoki wołające mount()
// z inną wymuszoną wartością języka - zero podwójnego utrzymywania treści).
(function () {
  "use strict";

  const TEMPLATE = `
<!-- ============ NAVBAR ============ -->
<header class="navbar">
    <div class="navbar-inner">
        <a href="/" class="brand">
            <img src="/assets/logo.png" alt="Logo BrawlManager" class="brand-mark" data-i18n-attr="alt:common.logo_alt">
            BrawlManager
        </a>

        <nav>
            <ul class="nav-links">
                <li><a href="/" data-i18n="common.nav_home">Home</a></li>
                <li><a href="/Komendy/" data-i18n="common.nav_komendy" data-i18n-href="komendy">Komendy</a></li>
                <li><a href="/Mapy/" data-i18n="common.nav_mapy" data-i18n-href="mapy">Mapy</a></li>
            </ul>
        </nav>

        <div class="nav-cta">
            <div class="lang-switch" role="group" data-i18n-attr="aria-label:common.lang_switch_aria">
                <button type="button" class="lang-switch-btn" data-lang-btn="pl">PL</button>
                <button type="button" class="lang-switch-btn" data-lang-btn="en">EN</button>
            </div>
            <a href="https://discord.com/oauth2/authorize?client_id=1506378216108195851" class="btn btn-primary btn-small" target="_blank" rel="noopener" data-i18n="common.nav_add_discord">Dodaj do Discorda</a>
            <button class="nav-toggle" aria-label="Otwórz menu" aria-expanded="false" data-i18n-attr="aria-label:common.nav_toggle_aria">☰</button>
        </div>
    </div>
</header>

<main>

    <!-- ============ HERO ============ -->
    <section class="page-hero">
        <div class="container">
            <div class="eyebrow" data-i18n="mapy.hero_eyebrow">🗺️ Cała rotacja, jeden rzut oka</div>
            <h1 data-i18n="mapy.hero_title">Rotacja map Brawl Stars — wszystkie tryby naraz</h1>
            <p data-i18n="mapy.hero_body">
                Znajdziesz tutaj aktualne rotacje map dla każdego trybu gry!
            </p>
        </div>
    </section>

    <div class="container">
        <div class="rotation-table-wrap">
            <table class="rotation-full-table">
                <thead>
                    <tr>
                        <th data-i18n="mapy.th_mode">Tryb gry</th>
                        <th data-i18n="mapy.th_old_map">Ostatnia mapa</th>
                        <th data-i18n="mapy.th_current_map">Aktualna mapa</th>
                        <th data-i18n="mapy.th_countdown">Koniec obecnej rotacji</th>
                    </tr>
                </thead>
                <tbody id="rotation-rows">
                    <!-- wypełniane przez initRotation() poniżej z assets/rotation.json -->
                </tbody>
            </table>
        </div>
        <div id="rotation-status" class="rotation-status" hidden></div>

        <a href="/#rotacja-map" class="back-link" data-i18n="common.back_home">← Wróć do strony głównej</a>
    </div>

    <!-- Lightbox powiększenia mapy - jeden reużywalny modal, wypełniany przez
         JS (patrz openLightbox() niżej) po kliknięciu dowolnej miniaturki
         mapy (.map-thumb) w tabeli. -->
    <div id="map-lightbox" class="map-lightbox" hidden>
        <button type="button" class="map-lightbox-close" aria-label="Zamknij podgląd mapy" data-i18n-attr="aria-label:mapy.lightbox_close_aria">✕</button>
        <div class="map-lightbox-inner">
            <img id="map-lightbox-img" src="" alt="">
            <p id="map-lightbox-caption" class="map-lightbox-caption"></p>
        </div>
    </div>

</main>

<!-- ============ STOPKA ============ -->
<footer class="site-footer">
    <div class="container">
        <div class="footer-inner">
            <div class="footer-brand">
                <img src="/assets/logo.png" alt="Logo BrawlManager" class="brand-mark" data-i18n-attr="alt:common.logo_alt">
                BrawlManager
            </div>

            <ul class="footer-links">
                <li><a href="/privacy/" data-i18n="common.footer_privacy">Polityka prywatności</a></li>
                <li><a href="/tos/" data-i18n="common.footer_tos">Regulamin</a></li>
                <li><a href="https://discord.gg/ARd5PM8VBQ" target="_blank" rel="noopener" data-i18n="common.footer_support">Serwer wsparcia</a></li>
            </ul>
        </div>
        <p class="footer-copy">&copy; <span data-year>2026</span> <span data-i18n="common.footer_copy_suffix">BrawlManagerTeam. Wszelkie prawa zastrzeżone.</span></p>
    </div>
</footer>
`;

  const DICT = {
    "mapy.meta_title": {
      pl: "Rotacja map Brawl Stars — BrawlManager",
      en: "Brawl Stars Map Rotation — BrawlManager",
    },
    "mapy.meta_description": {
      pl: "Pełna lista trybów gry Brawl Stars z ostatnią i aktualną mapą w rotacji — dane z oficjalnego API Supercella, aktualizowane przez BrawlManagera.",
      en: "Full list of Brawl Stars game modes with the last and current map in rotation — data from Supercell's official API, kept updated by BrawlManager.",
    },
    "mapy.hero_eyebrow": { pl: "🗺️ Cała rotacja, jeden rzut oka", en: "🗺️ The whole rotation, at a glance" },
    "mapy.hero_title": { pl: "Rotacja map Brawl Stars — wszystkie tryby naraz", en: "Brawl Stars map rotation — every mode at once" },
    "mapy.hero_body": { pl: "Znajdziesz tutaj aktualne rotacje map dla każdego trybu gry!", en: "Find the current map rotation for every game mode here!" },
    "mapy.th_mode": { pl: "Tryb gry", en: "Game mode" },
    "mapy.th_old_map": { pl: "Ostatnia mapa", en: "Previous map" },
    "mapy.th_current_map": { pl: "Aktualna mapa", en: "Current map" },
    "mapy.th_countdown": { pl: "Koniec obecnej rotacji", en: "Current rotation ends" },
    "mapy.lightbox_close_aria": { pl: "Zamknij podgląd mapy", en: "Close map preview" },
  };

  // Wczytuje assets/rotation.json (statyczny plik) i buduje tabelę tryb /
  // ostatnia mapa / aktualna mapa / odliczanie do końca slotu. Świadomie NIE
  // ma tu żadnego bezpośredniego wywołania api.brawlstars.com - token API to
  // sekret, nie może trafić do kodu klienckiego statycznej strony.
  //
  // Ikony trybów i podglądy map: rotation.json od bota zawiera TYLKO nazwy
  // (np. tryb "brawlBall", mapa "Beach Ball") - żadnych ID obrazków. Żeby
  // pokazać grafiki, strona dociąga (client-side, bez klucza/autoryzacji)
  // publiczne, darmowe dane z BrawlAPI (api.brawlapi.com, CORS otwarty,
  // Cache-Control ustawiony przez Cloudflare) i sama dopasowuje nazwę ->
  // obrazek z cdn.brawlify.com.
  //
  // i18n: nazwy trybów PL_NAZWY_TRYBOW są uzywane TYLKO gdy
  // BM_I18N.getLang() === "pl" - dla "en" render() korzysta wprost z
  // angielskiej nazwy zwróconej przez BrawlAPI (hit.name), bez osobnego
  // słownika tłumaczeń trybów (BrawlAPI i tak jest po angielsku).
  function initRotation() {
    const rowsEl = document.getElementById("rotation-rows");
    const statusEl = document.getElementById("rotation-status");

    // ==========================================
    // LIGHTBOX powiększenia mapy (jeden reużywalny modal dla wszystkich
    // miniaturek - ostatnia i aktualna mapa). Event delegation na rowsEl,
    // bo wiersze tabeli są tworzone dynamicznie w render() (innerHTML).
    // ==========================================
    const lightboxEl = document.getElementById("map-lightbox");
    const lightboxImgEl = document.getElementById("map-lightbox-img");
    const lightboxCaptionEl = document.getElementById("map-lightbox-caption");
    const lightboxCloseEl = lightboxEl.querySelector(".map-lightbox-close");

    function openLightbox(src, name) {
      lightboxImgEl.src = src;
      lightboxImgEl.alt = (window.BM_I18N.getLang() === "en" ? "Enlarged preview of map " : "Powiększony podgląd mapy ") + name;
      lightboxCaptionEl.textContent = name;
      lightboxEl.hidden = false;
      document.body.style.overflow = "hidden";
      lightboxCloseEl.focus();
    }

    function closeLightbox() {
      lightboxEl.hidden = true;
      lightboxImgEl.src = "";
      document.body.style.overflow = "";
    }

    rowsEl.addEventListener("click", (event) => {
      const thumb = event.target.closest(".map-thumb");
      if (thumb) openLightbox(thumb.src, thumb.dataset.mapName || "");
    });

    rowsEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const thumb = event.target.closest(".map-thumb");
      if (!thumb) return;
      event.preventDefault();
      openLightbox(thumb.src, thumb.dataset.mapName || "");
    });

    lightboxCloseEl.addEventListener("click", closeLightbox);

    lightboxEl.addEventListener("click", (event) => {
      if (event.target === lightboxEl) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightboxEl.hidden) closeLightbox();
    });

    // Ręcznie utrzymywana lista - stała, niewielka (kilkadziesiąt trybów w
    // historii gry, w rotacji naraz widać zwykle kilkanaście). Tylko tryby,
    // których polską nazwę znam z dużą pewnością (stabilne w grze od lat).
    // Nowe/rzadkie tryby (np. najświeższe eventy) celowo NIE są zgadywane -
    // dostają fallback humanizeModeKey() zamiast wymyślonego tłumaczenia.
    // Używana WYŁĄCZNIE dla lang="pl" - patrz modeCellHtml().
    const PL_NAZWY_TRYBOW = {
      knockout: "Nokaut",
      gemGrab: "Zbiory Klejnotów",
      brawlBall: "Zadyma",
      heist: "Napad",
      basketBrawl: "Zadyma pod Koszem",
      hotZone: "Gorąca Strefa",
      bounty: "Nagroda",
      volleyBrawl: "Zadyma pod Siatką",
      soloShowdown: "Starcie (solo)",
      duoShowdown: "Starcie (duo)",
      trioShowdown: "Starcie (trio)",
      loadedShowdown: "Naładowane Starcie",
      knockout5v5: "Nokaut 5v5",
      wipeout5v5: "Batalia 5v5",
      brawlBall5v5: "Zadyma 5v5",
      brawlHockey5v5: "Hokejowa Zadyma 5v5",
      gemGrab5v5: "Zbiory Klejnotów 5v5",
      loveBombing: "Atak Miłości ",
      shadowSmash5v5: "Potyczka w Cieniach 5v5",
      trioGemGrab: "Zbiory Klejnotów z Tercetem",
      trioWipeout: "Batalia z  Tercetem",
      brawlHockey: "Hokejowa Zadyma",
      duels: "Pojedynki",
      // Supercell zmienił nazwę wewnętrzną tego trybu na "tagTeam" w
      // surowym rotation.json (potwierdzone 2026-07-16 na produkcyjnych
      // danych bota - klucz "duels" się tam nie pojawia). Zostawiamy oba
      // klucze na wypadek, gdyby stary wariant kiedyś wrócił.
      tagTeam: "Pojedynki",
      brawlArena: "Arena Zadymy",
      wipeout: "Batalia",
      treasureHunt: "Pogoń za Skarbem",
      tokenRun: "Żetonowy Wyścig",
      dodgeBrawl: "Zbijak",
      soulCollector: "Zbiór Dusz",
      presentPlunder: "Rabunek Prezentów",
      safeBlast: "Wybuch Kontrolowany",
      shadowSmash: "Potyczka w Cieniach",
      paintBrawl: "Starcie Kolorów",
      spiritWars: "Wojny Duchów",
      subwayRun: "Bieg Subway",
      duoMegaBoss: "MegaBoss dla Dwojga",
      hawkinsHunt: "Łowy w Hawkins",
      upsideShowdown: "Starcie po Drugiej Stronie",
      swarm: "Swarm",
      superBall: "SuperPiłka",
      largeShowdown: "Large Showdown",
      loadedDuoShowdown: "Naładowanie Starcie (duo)",
      mechaGuard: "MechaStrażnik",
    };
    // Lookup pomocniczy bez rozróżniania wielkości liter - Supercell w
    // rotation.json bywa niekonsekwentny (np. "brawlBall5V5" z wielkim V,
    // podczas gdy BrawlAPI/PL_NAZWY_TRYBOW używają małego "5v5").
    const PL_NAZWY_TRYBOW_LOWER = new Map(
      Object.entries(PL_NAZWY_TRYBOW).map(([k, v]) => [k.toLowerCase(), v])
    );

    // Ręczne dopasowania ikon dla trybów, których BrawlAPI (v1/gamemodes) nie
    // zna pod hashem, jakiego używa Supercell w surowym rotation.json.
    const MANUAL_ICON_OVERRIDES_LOWER = new Map([
      ["airhockey", "https://cdn.brawlify.com/game-modes/regular/48000045.png"], // = BrawlAPI "brawlHockey"
      ["tagteam", "https://cdn.brawlify.com/game-modes/regular/48000024.png"], // = BrawlAPI "duels" (Pojedynki)
      ["wipeout", "https://cdn.brawlify.com/game-modes/regular/48000025.png"], // = BrawlAPI "wipeout" (Batalia)
      ["deathmatch", "https://cdn.brawlify.com/game-modes/regular/48000079.png"], // luka w numeracji BrawlAPI, dopasowanie wizualne, klucz nigdy realnie nie występuje
    ]);

    // "tagTeam" -> "Tag Team", "airHockey" -> "Air Hockey" itd. - używane
    // tylko gdy trybu nie ma ani w PL_NAZWY_TRYBOW, ani w danych z BrawlAPI.
    function humanizeModeKey(key) {
      if (!key) return window.BM_I18N.getLang() === "en" ? "Unknown mode" : "Nieznany tryb";
      const spaced = key.replace(/([a-z])([A-Z])/g, "$1 $2");
      return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    // Normalizacja nazwy mapy do porównania z bazą BrawlAPI - różnice bywają
    // tylko w apostrofach/wykrzyknikach/wielkości liter (np. "Belle's Rock" w
    // rotation.json vs "Belles Rock" w BrawlAPI).
    function normalizeMapName(name) {
      return (name || "")
        .toLowerCase()
        .replace(/['’!]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    function formatCountdown(iso) {
      const lang = window.BM_I18N.getLang();
      if (!iso) return "—";
      const end = new Date(iso).getTime();
      const now = Date.now();
      const diffMs = end - now;
      if (isNaN(end)) return "—";
      if (diffMs <= 0) return lang === "en" ? "should have changed by now" : "powinno się już zmienić";
      const totalSec = Math.floor(diffMs / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      if (lang === "en") {
        if (h > 0) return `in ${h}h ${m}m ${s}s`;
        if (m > 0) return `in ${m}m ${s}s`;
        return `in ${s}s`;
      }
      if (h > 0) return `za ${h} godz. ${m} min ${s} s`;
      if (m > 0) return `za ${m} min ${s} s`;
      return `za ${s} s`;
    }

    // Odświeżanie na żywo (co sekundę) - podmienia tylko tekst komórek
    // odliczania na podstawie ISO w data-end, bez ponownego fetcha/renderu
    // całej tabeli.
    function tickCountdowns() {
      document.querySelectorAll("td.countdown[data-end]").forEach((el) => {
        el.textContent = formatCountdown(el.dataset.end);
      });
    }
    setInterval(tickCountdowns, 1000);

    // Ręczna implementacja (nie przez div.textContent/innerHTML) - używana też
    // wewnątrz atrybutów HTML (data-map-name), więc musi escapować cudzysłowy.
    function escapeHtml(str) {
      return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function modeCellHtml(trybKey, modesByHash) {
      const lang = window.BM_I18N.getLang();
      const hit = trybKey ? modesByHash.get(trybKey.toLowerCase()) : null;
      const nazwa = lang === "en"
        ? ((hit && hit.name) || humanizeModeKey(trybKey))
        : ((trybKey && PL_NAZWY_TRYBOW_LOWER.get(trybKey.toLowerCase())) || (hit && hit.name) || humanizeModeKey(trybKey));
      const iconUrl = hit
        ? hit.imageUrl
        : (trybKey && MANUAL_ICON_OVERRIDES_LOWER.get(trybKey.toLowerCase())) || null;
      const icon = iconUrl
        ? `<img class="mode-icon" src="${iconUrl}" alt="" loading="lazy" onerror="this.remove()">`
        : "";
      return `<div class="mode-cell-inner">${icon}<span>${escapeHtml(nazwa)}</span></div>`;
    }

    function mapCellHtml(mapName, mapsByName) {
      if (!mapName) {
        const brak = window.BM_I18N.getLang() === "en" ? "no data" : "brak danych";
        return `<div class="map-cell"><span class="map-name">${brak}</span></div>`;
      }
      const hit = mapsByName.get(normalizeMapName(mapName));
      const alt = window.BM_I18N.getLang() === "en"
        ? `Enlarge preview of map ${escapeHtml(mapName)}`
        : `Powiększ podgląd mapy ${escapeHtml(mapName)}`;
      const thumb = hit
        ? `<img class="map-thumb" src="${hit.imageUrl}" alt="${alt}" data-map-name="${escapeHtml(mapName)}" loading="lazy" role="button" tabindex="0" onerror="this.remove()">`
        : "";
      return `<div class="map-cell">${thumb}<span class="map-name">${escapeHtml(mapName)}</span></div>`;
    }

    // Ostatnio pobrane dane trzymane w domknięciu, żeby zmiana języka mogła
    // przerenderować tabelę bez drugiego fetcha do API (patrz nasłuch
    // "bm:lang-applied" na końcu pliku).
    let lastData = null;
    let lastModesByHash = null;
    let lastMapsByName = null;

    function render(data, modesByHash, mapsByName) {
      lastData = data;
      lastModesByHash = modesByHash;
      lastMapsByName = mapsByName;

      const sloty = Array.isArray(data.sloty) ? data.sloty : [];

      if (!sloty.length) {
        statusEl.hidden = false;
        statusEl.textContent = window.BM_I18N.getLang() === "en"
          ? "No map rotation data to show."
          : "Brak danych o rotacji map do pokazania.";
        return;
      }

      rowsEl.innerHTML = sloty.map((slot) => `
        <tr>
          <td class="mode-cell">${modeCellHtml(slot.tryb, modesByHash)}</td>
          <td class="old-map">${mapCellHtml(slot.mapa_poprzednia, mapsByName)}</td>
          <td class="current-map">${mapCellHtml(slot.mapa_aktualna, mapsByName)}</td>
          <td class="countdown" data-end="${slot.koniec_aktualnego_slotu || ""}">${formatCountdown(slot.koniec_aktualnego_slotu)}</td>
        </tr>
      `).join("");
    }

    // Przerenderuj tabelę (bez nowego fetcha) po zmianie języka - patrz
    // zmienne lastData/lastModesByHash/lastMapsByName wyżej. W praktyce ta
    // strona teraz nawiguje do /Maps//Mapy/ zamiast przełączać w miejscu (patrz
    // urlPair w mount()), więc to zdarzenie już się nie odpala z klika PL/EN -
    // zostawione jako nieszkodliwe zabezpieczenie na przyszłość.
    document.addEventListener("bm:lang-applied", () => {
      if (lastData) render(lastData, lastModesByHash, lastMapsByName);
    });

    // Trzy niezależne fetch-e: rotation.json JEST krytyczny (bez niego nie ma
    // tabeli), gamemodes/maps z BrawlAPI są WZBOGACENIEM - jeśli akurat nie
    // odpowiedzą, strona ma dalej pokazać tabelę tekstową zamiast się wywalić.
    Promise.allSettled([
      fetch("/assets/rotation.json", { cache: "no-store" }).then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      }),
      fetch("https://api.brawlapi.com/v1/gamemodes").then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      }),
      fetch("https://api.brawlapi.com/v1/maps").then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      }),
    ]).then(([rotationResult, gamemodesResult, mapsResult]) => {
      if (rotationResult.status !== "fulfilled") {
        statusEl.hidden = false;
        statusEl.textContent = window.BM_I18N.getLang() === "en"
          ? "Couldn't load map rotation data. Try refreshing the page later."
          : "Nie udało się wczytać danych o rotacji map. Spróbuj odświeżyć stronę później.";
        return;
      }

      const modesByHash = new Map();
      if (gamemodesResult.status === "fulfilled") {
        const list = gamemodesResult.value.list || [];
        list.forEach((m) => {
          if (m.scHash) modesByHash.set(String(m.scHash).toLowerCase(), m);
        });
      } else {
        console.warn("BrawlAPI gamemodes niedostępne - tabela pokaże tryby bez ikon.", gamemodesResult.reason);
      }

      const mapsByName = new Map();
      if (mapsResult.status === "fulfilled") {
        const list = mapsResult.value.list || [];
        list.forEach((m) => {
          const key = normalizeMapName(m.name);
          if (key && !mapsByName.has(key)) mapsByName.set(key, m);
        });
      } else {
        console.warn("BrawlAPI maps niedostępne - tabela pokaże mapy bez podglądu.", mapsResult.reason);
      }

      render(rotationResult.value, modesByHash, mapsByName);
    });
  }

  window.BM_MAPY_PAGE = {
    // opts: { forcedLang: "pl"|"en", urlPair: {pl,en} } - przekazywane wprost do
    // BM_I18N.init(), patrz assets/i18n.js.
    mount: function (opts) {
      document.body.insertAdjacentHTML("afterbegin", TEMPLATE);
      window.BM_I18N.init(DICT, opts);
      initRotation();
    },
  };
})();
