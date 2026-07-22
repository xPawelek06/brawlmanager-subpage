// BrawlManager landing page — mechanizm PL/EN.
//
// Statyczna strona bez frameworka/buildu, więc zamiast osobnych plików /en/
// (podwójna liczba plików do ręcznego utrzymania w wiecznej synchronizacji)
// używamy jednego zestawu stron z atrybutem `data-i18n="klucz"` na elementach
// tekstowych - JS podmienia `innerHTML` wg wybranego języka. Wybór języka jest
// trzymany w localStorage (ten sam origin dla Home/Komendy/Mapy), więc
// PRZECHODZI między podstronami zamiast resetować się przy każdej nawigacji.
//
// Użycie w każdej z 3 stron (na końcu body, po script.js):
//   <script src="/assets/i18n.js"></script>
//   <script>BM_I18N.init(PAGE_DICT);</script>
// gdzie PAGE_DICT to obiekt { "klucz": { pl: "...", en: "..." }, ... } z treścią
// specyficzną dla tej strony - łączony ze wspólnym słownikiem COMMON (nav,
// stopka, wspólne przyciski) zdefiniowanym tutaj.
//
// Atrybuty:
//   data-i18n="klucz"              -> ustawia innerHTML elementu (może zawierać
//                                      zaufany, ręcznie pisany markup np. <code>)
//   data-i18n-attr="attr:klucz"     -> ustawia atrybut zamiast innerHTML (aria-label,
//                                      meta content, alt...). Kilka par oddzielone "|".
//   data-lang-btn="pl"/"en"         -> przycisk przełącznika języka w navbarze.

(function () {
  "use strict";

  const STORAGE_KEY = "bm_lang";
  const DEFAULT_LANG = "pl";

  // ---------- wspólny słownik (navbar, stopka, przyciski powtarzające się
  // na wszystkich 3 stronach) ----------
  const COMMON = {
    "common.nav_home": { pl: "Home", en: "Home" },
    "common.nav_komendy": { pl: "Komendy", en: "Commands" },
    "common.nav_mapy": { pl: "Mapy", en: "Maps" },
    "common.nav_add_discord": { pl: "Dodaj do Discorda", en: "Add to Discord" },
    "common.nav_toggle_aria": { pl: "Otwórz menu", en: "Open menu" },
    "common.lang_switch_aria": { pl: "Język strony", en: "Site language" },
    "common.logo_alt": { pl: "Logo BrawlManager", en: "BrawlManager logo" },
    "common.footer_privacy": { pl: "Polityka prywatności", en: "Privacy Policy" },
    "common.footer_tos": { pl: "Regulamin", en: "Terms of Service" },
    "common.footer_support": { pl: "Serwer wsparcia", en: "Support server" },
    "common.footer_copy_suffix": {
      pl: "BrawlManagerTeam. Wszelkie prawa zastrzeżone.",
      en: "BrawlManagerTeam. All rights reserved.",
    },
    "common.badge_premium": { pl: "🔒 Premium", en: "🔒 Premium" },
    "common.badge_partial_premium": { pl: "🔒 częściowo Premium", en: "🔒 partially Premium" },
    "common.badge_new": { pl: "🆕 Nowość", en: "🆕 New" },
    "common.badge_pending": { pl: "📸 Zrzuty ekranu wkrótce", en: "📸 Screenshots coming soon" },
    "common.back_home": { pl: "← Wróć do strony głównej", en: "← Back to homepage" },
  };

  function getLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "pl" || stored === "en") return stored;
    } catch (e) {
      /* localStorage niedostępny (np. tryb prywatny z zablokowanym storage) -
         cicho spadamy na domyślny język zamiast wywalać stronę. */
    }
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* jw. - brak trwałości nie powinien blokować samego przełączenia na TEJ stronie */
    }
  }

  function lookup(dict, key) {
    const entry = dict[key];
    if (!entry) {
      console.warn("BM_I18N: brak tłumaczenia dla klucza", key);
      return null;
    }
    const lang = getLang();
    return entry[lang] !== undefined ? entry[lang] : entry.pl;
  }

  function applyAll(dict) {
    const lang = getLang();
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = lookup(dict, el.getAttribute("data-i18n"));
      if (value != null) el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr").split("|").forEach((pair) => {
        const sep = pair.indexOf(":");
        if (sep === -1) return;
        const attr = pair.slice(0, sep);
        const key = pair.slice(sep + 1);
        const value = lookup(dict, key);
        if (value != null) el.setAttribute(attr, value);
      });
    });

    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang-btn") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // Pozwala stronom z własną logiką JS (np. Mapy/ - tabela rotacji budowana
    // dynamicznie z fetchowanych danych, poza zasięgiem data-i18n) przerenderować
    // się po zmianie języka bez przeładowania strony.
    document.dispatchEvent(new CustomEvent("bm:lang-applied", { detail: { lang } }));
  }

  function wireLangSwitch(dict) {
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang-btn");
        if (lang === getLang()) return;
        setLang(lang);
        applyAll(dict);
      });
    });
  }

  window.BM_I18N = {
    getLang,
    setLang,
    // Jeden argument - klucz - czyta z ostatnio zainicjowanego (scalonego)
    // słownika strony. Używane przez skrypty stron do tłumaczenia treści
    // budowanej dynamicznie (np. Mapy/ - tabela rotacji).
    t: function (key) {
      return this._dict ? lookup(this._dict, key) : null;
    },
    init: function (pageDict) {
      this._dict = Object.assign({}, COMMON, pageDict || {});
      applyAll(this._dict);
      wireLangSwitch(this._dict);
    },
  };
})();
