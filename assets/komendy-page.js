// Wspólna zawartość pary stron Komendy (PL: /Komendy/) <-> Commands (EN:
// /Commands/) — patrz assets/i18n.js (nagłówek + sekcja "Komendy/Mapy") po
// wyjaśnienie mechanizmu par URL.
//
// Ta strona MA REALNIE osobne, nawigowalne adresy per język (w przeciwieństwie
// do Home/tos/privacy, gdzie przełącznik działa w miejscu) — więc gdyby markup
// i słownik tłumaczeń leżały osobno w Komendy/index.html i Commands/index.html,
// każda zmiana treści komendy wymagałaby edycji w DWÓCH plikach (poza już
// istniejącym podwójnym zapisem PL tekstu wewnątrz jednego pliku: raz jako
// domyślny markup, raz w słowniku - patrz i18n.js). Żeby tego uniknąć, cały
// markup (navbar/hero/lista komend/lightbox/stopka) i słownik żyją TYLKO tutaj,
// w jednym miejscu — obie strony HTML (Komendy/index.html, Commands/index.html)
// to cienkie powłoki, które importują ten plik i wołają mount() z inną
// wymuszoną wartością języka. Wstrzykiwanie robione jest synchronicznie
// (document.body.insertAdjacentHTML, NIE fetch) - zero dodatkowego round-tripu
// sieciowego i zero migotania nieprzetłumaczonej treści, bo skrypt wykonuje się
// w trakcie parsowania dokumentu, zanim przeglądarka zdąży cokolwiek namalować.
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
            <div class="eyebrow" data-i18n="komendy.hero_eyebrow">🖥️ Realny wygląd na Discordzie</div>
            <h1 data-i18n="komendy.hero_title">Wszystkie komendy - dokładnie tak, jak je zobaczysz</h1>
            <p data-i18n="komendy.hero_body">
                Znajdziesz tu opis każdej komendy wraz z zrzutami ekranu z Discorda. Komenda w wersji
                free i premium pokazane są w obu wariantach.
            </p>
        </div>
    </section>

    <!-- Widoczne TYLKO w EN (patrz wireScreenshots niżej) - w PL wszystkie 21 komend
         ma już realne zrzuty (runda 2026-07-29), więc ten banner byłby nieaktualny. -->
    <div class="container" id="komendy-info-note-wrap">
        <div class="info-note">
            <span>📸</span>
            <span data-i18n="komendy.info_note_body">
                <strong>Zrzuty ekranu są chwilowo wstrzymane.</strong> Po dużym redesignie komend
                (embedy, lokalizacja PL/EN, nowe komendy) stare screeny pokazywały nieaktualny wygląd -
                usunęliśmy je, dopóki nie nagramy nowych. Do tego czasu każda komenda ma sam, aktualny opis.
            </span>
        </div>
    </div>

    <!-- .command-nav-stick-area gives the sticky wrapper below room to stay pinned
         while scrolling through all the command sections (see .command-nav-container
         in style.css for why position:sticky lives on the wrapper, not on .command-nav
         itself, and how this was actually verified with a live scroll test). -->
    <div class="command-nav-stick-area">
    <div class="container command-nav-container">
        <!-- Zwijana belka (2026-07-22): nagłówek z etykietą + strzałką zostaje
             ZAWSZE widoczny (poza .command-nav-collapsible), więc po zwinięciu
             belka ściąga się do tego cienkiego paska zamiast znikać całkowicie.
             Domyślnie rozwinięta (aria-expanded="true"); JS niżej animuje
             max-height na wyliczonym scrollHeight, nie stałej wartości. -->
        <div class="command-nav-header">
            <span class="command-nav-header-label" data-i18n="komendy.nav_label">Skocz do komendy</span>
            <button type="button" class="command-nav-toggle-btn" id="commandNavToggle" aria-expanded="true" aria-controls="commandNavCollapsible" data-i18n-attr="aria-label:komendy.nav_toggle_aria">
                <span class="command-nav-toggle-icon" aria-hidden="true">▲</span>
            </button>
        </div>
        <div class="command-nav-collapsible" id="commandNavCollapsible">
        <div class="command-nav">
            <a href="#sprawdz_puchary" data-i18n="komendy.sprawdz_puchary_nav">/sprawdz_puchary</a>
            <a href="#profil_bs" data-i18n="komendy.profil_bs_nav">/profil_bs</a>
            <a href="#brawlerzy" data-i18n="komendy.brawlerzy_nav">/brawlerzy</a>
            <a href="#ranking_klanu" data-i18n="komendy.ranking_klanu_nav">/ranking_klanu</a>
            <a href="#moja_pozycja" data-i18n="komendy.moja_pozycja_nav">/moja_pozycja</a>
            <a href="#moj_cel" data-i18n="komendy.moj_cel_nav">/moj_cel</a>
            <a href="#moje_osiagniecia" data-i18n="komendy.moje_osiagniecia_nav">/moje_osiagniecia</a>
            <a href="#pojedynek" data-i18n="komendy.pojedynek_nav">/pojedynek</a>
            <a href="#historia_pucharow" data-i18n="komendy.historia_pucharow_nav">/historia_pucharow</a>
            <a href="#rotacja_map" data-i18n="komendy.rotacja_map_nav">/rotacja_map</a>
            <a href="#support" data-i18n="komendy.support_nav">/support</a>
            <a href="#ustaw_klan" data-i18n="komendy.ustaw_klan_nav">/ustaw_klan</a>
            <a href="#ustaw_prog_pucharow" data-i18n="komendy.ustaw_prog_pucharow_nav">/ustaw_prog_pucharow</a>
            <a href="#ustaw_role_rang" data-i18n="komendy.ustaw_role_rang_nav">/ustaw_role_rang</a>
            <a href="#ustaw_kanal_raportow" data-i18n="komendy.ustaw_kanal_raportow_nav">/ustaw_kanal_raportow</a>
            <a href="#ustaw_kanal_rotacji" data-i18n="komendy.ustaw_kanal_rotacji_nav">/ustaw_kanal_rotacji</a>
            <a href="#ustaw_harmonogram_raportow" data-i18n="komendy.ustaw_harmonogram_raportow_nav">/ustaw_harmonogram_raportow</a>
            <a href="#panel_weryfikacji" data-i18n="komendy.panel_weryfikacji_nav">/panel_weryfikacji</a>
            <a href="#czystka_klanu" data-i18n="komendy.czystka_klanu_nav">/czystka_klanu</a>
            <a href="#ustaw_wyglad" data-i18n="komendy.ustaw_wyglad_nav">/ustaw_wyglad</a>
            <a href="#ustaw_jezyk" data-i18n="komendy.ustaw_jezyk_nav">/ustaw_jezyk</a>
        </div>
        </div>
    </div>

    <!-- ============ DLA CZŁONKÓW KLANU ============ -->
    <section class="alt">
        <div class="container">
            <div class="section-head">
                <h2 class="section-title" data-i18n="komendy.members_title">Dla członków klanu</h2>
                <p class="section-lede" data-i18n="komendy.members_lede">Komendy, z których korzysta każdy zweryfikowany członek.</p>
            </div>

            <div class="command-showcase">

                <!-- /sprawdz_puchary -->
                <div class="command-block command-block--text-only" id="sprawdz_puchary" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.sprawdz_puchary_code">/sprawdz_puchary [tag_gracza]</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.sprawdz_puchary_desc">Sprawdza, czy gracz spełnia próg pucharowy tego serwera i czy należy do przypisanego klanu.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/sprawdz_puchary-uzycie.png" data-src-en="/assets/screenshots/sprawdz_puchary-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.sprawdz_puchary_shot_usage_alt">
                        <img src="/assets/screenshots/sprawdz_puchary-wynik.png" data-src-en="/assets/screenshots/sprawdz_puchary-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.sprawdz_puchary_shot_result_alt">
                    </div>
                </div>

                <!-- /profil_bs -->
                <div class="command-block command-block--text-only" id="profil_bs" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.profil_bs_code">/profil_bs [tag_gracza]</code> <span class="badge badge-partial" data-i18n="common.badge_partial_premium">🔒 częściowo Premium</span> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.profil_bs_desc">Karta gracza: poziom, rekordowe trofea, zwycięstwa i top 3 brawlery. Premium dorzuca dodatkowe pole z progresem od pierwszego dnia śledzenia historii.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/profil_bs-uzycie.png" data-src-en="/assets/screenshots/profil_bs-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.profil_bs_shot_usage_alt">
                        <div class="command-screenshot-group">
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.profil_bs_shot_free_caption">Wersja darmowa</p>
                                <img src="/assets/screenshots/profil_bs-non-premium-wynik.png" data-src-en="/assets/screenshots/profil_bs-non-premium-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.profil_bs_shot_free_alt">
                            </div>
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.profil_bs_shot_premium_caption">Premium: progres od pierwszego dnia</p>
                                <img src="/assets/screenshots/profil_bs-premium-wynik.png" data-src-en="/assets/screenshots/profil_bs-premium-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.profil_bs_shot_premium_alt">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- /brawlerzy -->
                <div class="command-block command-block--text-only" id="brawlerzy" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.brawlerzy_code">/brawlerzy [tag_gracza]</code></div>
                        <p data-i18n="komendy.brawlerzy_desc">
                            Generuje obraz siatki wszystkich brawlerów w grze - odblokowani przez gracza kolorowo
                            (z odznaką rangi albo poziomem mocy w rogu), zablokowani wyszarzeni z ikoną kłódki.
                            Menu pod obrazkiem pozwala przesortować siatkę wg rangi, poziomu mocy, rzadkości albo
                            najwyższych trofeów.
                        </p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/brawlerzy-uzycie.png" data-src-en="/assets/screenshots/brawlerzy-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.brawlerzy_shot_usage_alt">
                        <img src="/assets/screenshots/brawlerzy-wynik.png" data-src-en="/assets/screenshots/brawlerzy-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.brawlerzy_shot_result_alt">
                    </div>
                </div>

                <!-- /ranking_klanu -->
                <div class="command-block command-block--text-only" id="ranking_klanu" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.ranking_klanu_code">/ranking_klanu</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.ranking_klanu_desc">Pokazuje pierwszą dziesiątkę klanu posortowaną wg trofeów, wg tagu klanu skonfigurowanego przez admina (<code>/ustaw_klan</code>).</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/ranking_klanu-uzycie.png" data-src-en="/assets/screenshots/ranking_klanu-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ranking_klanu_shot_usage_alt">
                        <img src="/assets/screenshots/ranking_klanu-wynik.png" data-src-en="/assets/screenshots/ranking_klanu-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.ranking_klanu_shot_result_alt">
                    </div>
                </div>

                <!-- /moja_pozycja -->
                <div class="command-block command-block--text-only" id="moja_pozycja" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.moja_pozycja_code">/moja_pozycja [tag_gracza]</code> <span class="badge badge-partial" data-i18n="common.badge_partial_premium">🔒 częściowo Premium</span> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.moja_pozycja_desc">Twoja aktualna pozycja w rankingu klanu wg aktualnych trofeów i dystans do osoby bezpośrednio wyżej.</p>
                        <ul>
                            <li data-i18n="komendy.moja_pozycja_li1">Premium: prognoza, za ile dni wyprzedzisz osobę przed sobą (na bazie tempa z ostatnich 30 dni)</li>
                            <li data-i18n="komendy.moja_pozycja_li2">Premium: przycisk do samodzielnego ustawienia liczby dni prognozy</li>
                        </ul>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/moja_pozycja-uzycie.png" data-src-en="/assets/screenshots/moja_pozycja-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.moja_pozycja_shot_usage_alt">
                        <div class="command-screenshot-group">
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.moja_pozycja_shot_free_caption">Wersja darmowa</p>
                                <img src="/assets/screenshots/moja_pozycja-non-premium-wynik.png" data-src-en="/assets/screenshots/moja_pozycja-non-premium-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.moja_pozycja_shot_free_alt">
                            </div>
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.moja_pozycja_shot_premium_caption">Premium: prognoza wyprzedzenia</p>
                                <img src="/assets/screenshots/moja_pozycja-premium-wynik.png" data-src-en="/assets/screenshots/moja_pozycja-premium-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.moja_pozycja_shot_premium_alt">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- /moj_cel -->
                <div class="command-block command-block--text-only" id="moj_cel" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.moj_cel_code">/moj_cel [tag_gracza] [cel_puchary]</code> <span class="badge badge-partial" data-i18n="common.badge_partial_premium">🔒 częściowo Premium</span> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.moj_cel_desc">Ustawia Twój osobisty cel pucharowy i pokazuje pasek postępu oraz zmianę od wczoraj.</p>
                        <ul>
                            <li data-i18n="komendy.moj_cel_li1">Premium: prognoza dotarcia do celu w widełkach - osobno z Twojego najlepszego i najgorszego tygodnia</li>
                            <li data-i18n="komendy.moj_cel_li2">Premium: pole „Najlepszy dzień w tym okresie”</li>
                        </ul>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/moj_cel-uzycie.png" data-src-en="/assets/screenshots/moj_cel-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.moj_cel_shot_usage_alt">
                        <div class="command-screenshot-group">
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.moj_cel_shot_free_caption">Wersja darmowa</p>
                                <img src="/assets/screenshots/moj_cel-non-premium-wynik.png" data-src-en="/assets/screenshots/moj_cel-non-premium-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.moj_cel_shot_free_alt">
                            </div>
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.moj_cel_shot_premium_caption">Premium: prognoza w widełkach</p>
                                <img src="/assets/screenshots/moj_cel-premium-wynik.png" data-src-en="/assets/screenshots/moj_cel-premium-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.moj_cel_shot_premium_alt">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- /moje_osiagniecia -->
                <div class="command-block command-block--text-only" id="moje_osiagniecia" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.moje_osiagniecia_code">/moje_osiagniecia [tag_gracza]</code></div>
                        <p data-i18n="komendy.moje_osiagniecia_desc">Odznaki i osiągnięcia gracza w klanie, liczone automatycznie z historii bota - m.in. najdłuższa seria na plusie, rekordowy dzień, staż w klanie, % ukończenia kolekcji brawlerów, najlepszy tydzień i kamienie milowe rekordu trofeów.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/moje_osiagniecia-uzycie.png" data-src-en="/assets/screenshots/moje_osiagniecia-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.moje_osiagniecia_shot_usage_alt">
                        <img src="/assets/screenshots/moje_osiagniecia-wynik.png" data-src-en="/assets/screenshots/moje_osiagniecia-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.moje_osiagniecia_shot_result_alt">
                    </div>
                </div>

                <!-- /pojedynek -->
                <div class="command-block command-block--text-only" id="pojedynek" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.pojedynek_code">/pojedynek [tag_gracza_1] [tag_gracza_2]</code> <span class="badge badge-partial" data-i18n="common.badge_partial_premium">🔒 częściowo Premium</span> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.pojedynek_desc">Porównanie 1:1 dwóch graczy klanu - aktualne trofea, kto prowadzi i przyrost z ostatniego tygodnia każdego z nich.</p>
                        <ul>
                            <li data-i18n="komendy.pojedynek_li1">Premium: porównanie kolekcji brawlerów obu graczy (wg rzadkości)</li>
                            <li data-i18n="komendy.pojedynek_li2">Premium: wspólny wykres trendu trofeów obu graczy (30 dni)</li>
                        </ul>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/pojedynek-uzycie.png" data-src-en="/assets/screenshots/pojedynek-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.pojedynek_shot_usage_alt">
                        <div class="command-screenshot-group">
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.pojedynek_shot_free_caption">Wersja darmowa</p>
                                <img src="/assets/screenshots/pojedynek-basic-wynik.png" data-src-en="/assets/screenshots/pojedynek-basic-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.pojedynek_shot_free_alt">
                            </div>
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.pojedynek_shot_premium_caption">Premium: kolekcja brawlerów + wykres</p>
                                <img src="/assets/screenshots/pojedynek-premium-wynik.png" data-src-en="/assets/screenshots/pojedynek-premium-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.pojedynek_shot_premium_alt">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- /historia_pucharow -->
                <div class="command-block command-block--text-only" id="historia_pucharow" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.historia_pucharow_code">/historia_pucharow [zakres_dni] [tag_gracza]</code> <span class="badge" data-i18n="common.badge_premium">🔒 Premium</span> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.historia_pucharow_desc">Trend trofeów dowolnego gracza z klanu z ostatnich 7 lub 30 dni - tekstowy sparkline w embedzie plus prawdziwy wykres liniowy PNG. Dorzuca też prognozę osiągnięcia progu klanowego i pozycję gracza w klanie w tym oknie czasowym.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <div class="command-screenshot-group">
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.historia_pucharow_shot_7d_caption">Ostatnie 7 dni</p>
                                <img src="/assets/screenshots/historia_pucharow-7d-uzycie.png" data-src-en="/assets/screenshots/historia_pucharow-7d-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.historia_pucharow_shot_7d_usage_alt">
                                <img src="/assets/screenshots/historia_pucharow-7d-wynik.png" data-src-en="/assets/screenshots/historia_pucharow-7d-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.historia_pucharow_shot_7d_result_alt">
                            </div>
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.historia_pucharow_shot_30d_caption">Ostatnie 30 dni</p>
                                <img src="/assets/screenshots/historia_pucharow-30d-uzycie.png" data-src-en="/assets/screenshots/historia_pucharow-30d-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.historia_pucharow_shot_30d_usage_alt">
                                <img src="/assets/screenshots/historia_pucharow-30d-wynik.png" data-src-en="/assets/screenshots/historia_pucharow-30d-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.historia_pucharow_shot_30d_result_alt">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- /rotacja_map -->
                <div class="command-block command-block--text-only" id="rotacja_map" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.rotacja_map_code">/rotacja_map</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.rotacja_map_desc">Pokazuje na żądanie aktualną rotację map i trybów gry Brawl Stars - ta sama tabela, co na <a href="/Mapy/">stronie z mapami</a>, tylko wprost na Discordzie.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/rotacja_map-uzycie.png" data-src-en="/assets/screenshots/rotacja_map-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.rotacja_map_shot_usage_alt">
                        <img src="/assets/screenshots/rotacja_map-wynik.png" data-src-en="/assets/screenshots/rotacja_map-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.rotacja_map_shot_result_alt">
                    </div>
                </div>

                <!-- /support -->
                <div class="command-block command-block--text-only" id="support" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.support_code">/support</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.support_desc">Krótkie info o bocie, pierwsze kroki dla admina i przycisk-link do serwera wsparcia.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/support-uzycie.png" data-src-en="/assets/screenshots/support-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.support_shot_usage_alt">
                        <img src="/assets/screenshots/support-wynik.png" data-src-en="/assets/screenshots/support-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.support_shot_result_alt">
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- ============ DLA ADMINÓW ============ -->
    <section>
        <div class="container">
            <div class="section-head">
                <h2 class="section-title" data-i18n="komendy.admins_title">Dla adminów / liderów serwera</h2>
                <p class="section-lede" data-i18n="komendy.admins_lede">Konfiguracja klanu, progu, ról, kanałów i wyglądu bota.</p>
            </div>

            <div class="command-showcase">

                <!-- /ustaw_klan -->
                <div class="command-block command-block--text-only" id="ustaw_klan" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.ustaw_klan_code">/ustaw_klan [nowy_tag_klanu]</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.ustaw_klan_desc">Powiązuje ten serwer Discord z konkretnym klanem Brawl Stars i od razu zapisuje pierwszy punkt historii pucharów wszystkich jego członków.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/ustaw_klan-uzycie.png" data-src-en="/assets/screenshots/ustaw_klan-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ustaw_klan_shot_usage_alt">
                        <img src="/assets/screenshots/ustaw_klan-wynik.png" data-src-en="/assets/screenshots/ustaw_klan-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.ustaw_klan_shot_result_alt">
                    </div>
                </div>

                <!-- /ustaw_prog_pucharow -->
                <div class="command-block command-block--text-only" id="ustaw_prog_pucharow" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.ustaw_prog_pucharow_code">/ustaw_prog_pucharow [nowe_puchary]</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.ustaw_prog_pucharow_desc">Ustawia minimalny próg pucharowy wymagany na tym serwerze - używany przez <code>/sprawdz_puchary</code>, panel weryfikacji i <code>/czystka_klanu</code>.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/ustaw_prog_pucharow-uzycie.png" data-src-en="/assets/screenshots/ustaw_prog_pucharow-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ustaw_prog_pucharow_shot_usage_alt">
                        <img src="/assets/screenshots/ustaw_prog_pucharow-wynik.png" data-src-en="/assets/screenshots/ustaw_prog_pucharow-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.ustaw_prog_pucharow_shot_result_alt">
                    </div>
                </div>

                <!-- /ustaw_role_rang -->
                <div class="command-block command-block--text-only" id="ustaw_role_rang" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.ustaw_role_rang_code">/ustaw_role_rang [ranga_z_gry] [nowa_nazwa_discord]</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.ustaw_role_rang_desc">Dopasowuje nazwę roli Discord do konkretnej rangi klanowej (member / senior / vicePresident / president). Odpowiedź widoczna tylko dla admina.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/ustaw_role_rang-uzycie.png" data-src-en="/assets/screenshots/ustaw_role_rang-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ustaw_role_rang_shot_usage_alt">
                        <img src="/assets/screenshots/ustaw_role_rang-wynik.png" data-src-en="/assets/screenshots/ustaw_role_rang-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.ustaw_role_rang_shot_result_alt">
                    </div>
                </div>

                <!-- /ustaw_kanal_raportow -->
                <div class="command-block command-block--text-only" id="ustaw_kanal_raportow" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.ustaw_kanal_raportow_code">/ustaw_kanal_raportow [kanal]</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.ustaw_kanal_raportow_desc">Ustawia kanał, na który trafiają automatyczne raporty tygodniowe i miesięczne. Bot sam sprawdza, czy ma uprawnienia do pisania i linkowania embedów na wybranym kanale.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/ustaw_kanal_raportow-uzycie.png" data-src-en="/assets/screenshots/ustaw_kanal_raportow-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ustaw_kanal_raportow_shot_usage_alt">
                        <img src="/assets/screenshots/ustaw_kanal_raportow-wynik.png" data-src-en="/assets/screenshots/ustaw_kanal_raportow-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.ustaw_kanal_raportow_shot_result_alt">
                    </div>
                </div>

                <!-- /ustaw_kanal_rotacji -->
                <div class="command-block command-block--text-only" id="ustaw_kanal_rotacji" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.ustaw_kanal_rotacji_code">/ustaw_kanal_rotacji [kanal]</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.ustaw_kanal_rotacji_desc">Ustawia kanał powiadomień o zmianie mapy w rotacji Brawl Stars.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/ustaw_kanal_rotacji-uzycie.png" data-src-en="/assets/screenshots/ustaw_kanal_rotacji-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ustaw_kanal_rotacji_shot_usage_alt">
                        <img src="/assets/screenshots/ustaw_kanal_rotacji-wynik.png" data-src-en="/assets/screenshots/ustaw_kanal_rotacji-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.ustaw_kanal_rotacji_shot_result_alt">
                    </div>
                </div>

                <!-- /ustaw_harmonogram_raportow -->
                <div class="command-block command-block--text-only" id="ustaw_harmonogram_raportow" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.ustaw_harmonogram_raportow_code">/ustaw_harmonogram_raportow [dzien] [godzina]</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.ustaw_harmonogram_raportow_desc">Ustala dzień tygodnia i godzinę, o której wysyłany jest automatyczny raport tygodniowy.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/ustaw_harmonogram_raportow-uzycie.png" data-src-en="/assets/screenshots/ustaw_harmonogram_raportow-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ustaw_harmonogram_raportow_shot_usage_alt">
                        <img src="/assets/screenshots/ustaw_harmonogram_raportow-wynik.png" data-src-en="/assets/screenshots/ustaw_harmonogram_raportow-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.ustaw_harmonogram_raportow_shot_result_alt">
                    </div>
                </div>

                <!-- /panel_weryfikacji -->
                <div class="command-block command-block--text-only" id="panel_weryfikacji" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.panel_weryfikacji_code">/panel_weryfikacji</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.panel_weryfikacji_desc">Wysyła panel z przyciskiem, dzięki któremu członkowie sami się zweryfikują (otwiera formularz na tag z gry).</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/panel_weryfikacji-uzycie.png" data-src-en="/assets/screenshots/panel_weryfikacji-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.panel_weryfikacji_shot_usage_alt">
                        <img src="/assets/screenshots/panel_weryfikacji-wynik.png" data-src-en="/assets/screenshots/panel_weryfikacji-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.panel_weryfikacji_shot_result_alt">
                    </div>
                </div>

                <!-- /czystka_klanu -->
                <!-- EN ma tylko 1 z 2 wariantów wyniku (brak "wszyscy spełniają próg" -
                     patrz komendy.md, luka znana i zaakceptowana). data-en-skip="1" na
                     pierwszym .command-screenshot-item (wariant "spelnia") - wireScreenshots("en")
                     chowa ten konkretny element inline-style'em (patrz uzasadnienie w JS niżej,
                     dlaczego nie .hidden), więc w EN widać tylko drugi item ("niespelnia"),
                     bez pustego miejsca w layoucie po prawej. -->
                <div class="command-block command-block--text-only" id="czystka_klanu" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.czystka_klanu_code">/czystka_klanu</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.czystka_klanu_desc">Lista członków klanu, którzy są poniżej ustawionego progu pucharowego - gotowa do przejrzenia przed ewentualnym wyrzuceniem z klanu w grze.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/czystka_klanu-uzycie.png" data-src-en="/assets/screenshots/czystka_klanu-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.czystka_klanu_shot_usage_alt">
                        <div class="command-screenshot-group">
                            <div class="command-screenshot-item" data-en-skip="1">
                                <p class="command-screenshot-caption" data-i18n="komendy.czystka_klanu_shot_spelnia_caption">Wszyscy spełniają próg</p>
                                <img src="/assets/screenshots/czystka_klanu-spelnia.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.czystka_klanu_shot_spelnia_alt">
                            </div>
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.czystka_klanu_shot_niespelnia_caption">Część graczy poniżej progu</p>
                                <img src="/assets/screenshots/czystka_klanu-niespelnia.png" data-src-en="/assets/screenshots/czystka_klanu-niespelnia-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.czystka_klanu_shot_niespelnia_alt">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- /ustaw_wyglad -->
                <div class="command-block command-block--text-only" id="ustaw_wyglad" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.ustaw_wyglad_code">/ustaw_wyglad [komenda]</code> <span class="badge badge-partial" data-i18n="common.badge_partial_premium">🔒 częściowo Premium</span> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.ustaw_wyglad_desc">Kolor embedów bota. W wersji darmowej wystarczy wywołać komendę bez żadnych parametrów - kolor obejmie wszystkie embedy naraz. W Premium można dodatkowo wybrać (z podpowiadanej listy) jedną z kilkunastu pojedynczych komend bota i ustawić dla niej osobny kolor. Otwiera listę wyboru z 16 kolorami.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/ustaw_wyglad-non-premium-uzycie.png" data-src-en="/assets/screenshots/ustaw_wyglad-non-premium-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ustaw_wyglad_shot_usage_alt">
                        <img src="/assets/screenshots/ustaw_wyglad-dropdown.png" data-src-en="/assets/screenshots/ustaw_wyglad-dropdown-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ustaw_wyglad_shot_dropdown_alt">
                        <img src="/assets/screenshots/ustaw_wyglad-non-premium-wynik.png" data-src-en="/assets/screenshots/ustaw_wyglad-non-premium-wynik-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ustaw_wyglad_shot_result_alt">
                        <div class="command-screenshot-group">
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.ustaw_wyglad_shot_premium_usage_caption">Premium: wybór jednej komendy - użycie</p>
                                <img src="/assets/screenshots/ustaw_wyglad-premium-uzycie.png" data-src-en="/assets/screenshots/ustaw_wyglad-premium-uzycie-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.ustaw_wyglad_shot_premium_usage_alt">
                            </div>
                            <div class="command-screenshot-item">
                                <p class="command-screenshot-caption" data-i18n="komendy.ustaw_wyglad_shot_premium_result_caption">Premium: kolor tylko tej komendy - wynik</p>
                                <img src="/assets/screenshots/ustaw_wyglad-premium-wynik.png" data-src-en="/assets/screenshots/ustaw_wyglad-premium-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.ustaw_wyglad_shot_premium_result_alt">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- /ustaw_jezyk -->
                <div class="command-block command-block--text-only" id="ustaw_jezyk" data-has-shots="1" data-has-shots-en="1">
                    <div class="command-block-copy">
                        <div class="command-tag"><code data-i18n="komendy.ustaw_jezyk_code">/ustaw_jezyk [jezyk]</code> <span class="badge badge-pending" data-i18n="common.badge_pending">📸 Zrzuty ekranu wkrótce</span></div>
                        <p data-i18n="komendy.ustaw_jezyk_desc">Ustawia język odpowiedzi bota na tym serwerze - polski albo angielski (domyślnie polski). Wszystkie nazwy i opisy komend mają też natywną angielską lokalizację Discorda, niezależną od tego ustawienia.</p>
                    </div>
                    <div class="command-block-shots" hidden>
                        <img src="/assets/screenshots/ustaw_jezyk-uzycie.png" data-src-en="/assets/screenshots/ustaw_jezyk-uzycie-en.png" alt="" class="command-screenshot command-screenshot-usage" data-i18n-attr="alt:komendy.ustaw_jezyk_shot_usage_alt">
                        <img src="/assets/screenshots/ustaw_jezyk-wynik.png" data-src-en="/assets/screenshots/ustaw_jezyk-wynik-en.png" alt="" class="command-screenshot" data-i18n-attr="alt:komendy.ustaw_jezyk_shot_result_alt">
                    </div>
                </div>

            </div>
        </div>
    </section>

    <div class="container">
        <a href="/#komendy" class="back-link" data-i18n="common.back_home">← Wróć do strony głównej</a>
    </div>
    </div>

    <!-- Lightbox powiększenia screenshotu - jeden reużywalny modal, wypełniany przez
         JS poniżej po kliknięciu dowolnego .command-screenshot. Wzorowany na
         #map-lightbox z rotacja-map.html (ten sam mechanizm: X/klik w tło/Escape,
         dostępność przez role="button" tabindex="0"), ale to CELOWO osobna,
         analogiczna implementacja pod własnymi nazwami (#command-lightbox /
         .command-lightbox*), a nie współdzielony kod - screenshoty tutaj są
         statyczne w HTML od razu przy wczytaniu strony (nie doklejane dynamicznie
         przez fetch jak miniaturki map), więc nie potrzeba event delegation na
         wspólnym kontenerze; wydzielanie tego do assets/script.js niosłoby ryzyko
         regresji na już działającym rotacja-map.html bez realnej korzyści. -->
    <div id="command-lightbox" class="command-lightbox" hidden>
        <button type="button" class="command-lightbox-close" aria-label="Zamknij podgląd zrzutu ekranu" data-i18n-attr="aria-label:komendy.lightbox_close_aria">✕</button>
        <div class="command-lightbox-inner">
            <img id="command-lightbox-img" src="" alt="">
            <p id="command-lightbox-caption" class="command-lightbox-caption"></p>
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
    "komendy.meta_title": {
      pl: "Wszystkie komendy z wizualizacją - BrawlManager",
      en: "All commands with visuals - BrawlManager",
    },
    "komendy.meta_description": {
      pl: "Pełna lista komend BrawlManagera (dla członków i adminów) z dokładną wizualizacją, jak wygląda odpowiedź bota na Discordzie.",
      en: "Full list of BrawlManager commands (for members and admins), with an accurate look at how the bot responds on Discord.",
    },
    "komendy.hero_eyebrow": { pl: "🖥️ Realny wygląd na Discordzie", en: "🖥️ The real look on Discord" },
    "komendy.hero_title": { pl: "Wszystkie komendy - dokładnie tak, jak je zobaczysz", en: "Every command - exactly as you'll see it" },
    "komendy.hero_body": {
      pl: "Znajdziesz tu opis każdej komendy wraz z zrzutami ekranu z Discorda. Komenda w wersji free i premium pokazane są w obu wariantach.",
      en: "You'll find a description of every command here, along with real Discord screenshots. Commands are shown in both their free and Premium versions.",
    },
    "komendy.info_note_body": {
      pl: "<strong>Zrzuty ekranu są chwilowo wstrzymane.</strong> Po dużym redesignie komend (embedy, lokalizacja PL/EN, nowe komendy) stare screeny pokazywały nieaktualny wygląd - usunęliśmy je, dopóki nie nagramy nowych. Do tego czasu każda komenda ma sam, aktualny opis.",
      en: "<strong>Screenshots are temporarily paused.</strong> After a big command redesign (embeds, PL/EN localization, new commands) the old screenshots showed an outdated look - we removed them until we record new ones. Until then, every command just has an up-to-date description.",
    },
    "komendy.nav_label": { pl: "Skocz do komendy", en: "Jump to a command" },
    "komendy.nav_toggle_aria": { pl: "Zwiń lub rozwiń listę komend", en: "Collapse or expand the command list" },

    "komendy.members_title": { pl: "Dla członków klanu", en: "For clan members" },
    "komendy.members_lede": { pl: "Komendy, z których korzysta każdy zweryfikowany członek.", en: "Commands every verified member uses." },
    "komendy.admins_title": { pl: "Dla adminów / liderów serwera", en: "For admins / server leaders" },
    "komendy.admins_lede": {
      pl: "Konfiguracja klanu, progu, ról, kanałów i wyglądu bota.",
      en: "Clan, threshold, role, channel and bot appearance configuration.",
    },
    "komendy.lightbox_close_aria": { pl: "Zamknij podgląd zrzutu ekranu", en: "Close screenshot preview" },

    "komendy.sprawdz_puchary_code": { pl: "/sprawdz_puchary [tag_gracza]", en: "/check_trophies [player_tag]" },
    "komendy.sprawdz_puchary_nav": { pl: "/sprawdz_puchary", en: "/check_trophies" },
    "komendy.sprawdz_puchary_desc": {
      pl: "Sprawdza, czy gracz spełnia próg pucharowy tego serwera i czy należy do przypisanego klanu.",
      en: "Checks whether a player meets this server's trophy threshold and belongs to the linked clan.",
    },
    "komendy.profil_bs_code": { pl: "/profil_bs [tag_gracza]", en: "/bs_profile [player_tag]" },
    "komendy.profil_bs_nav": { pl: "/profil_bs", en: "/bs_profile" },
    "komendy.profil_bs_desc": {
      pl: "Karta gracza: poziom, rekordowe trofea, zwycięstwa i top 3 brawlery. Premium dorzuca dodatkowe pole z progresem od pierwszego dnia śledzenia historii.",
      en: "Player card: level, record trophies, wins, and top 3 brawlers. Premium adds an extra field showing progress since the first day of tracked history.",
    },

    "komendy.brawlerzy_code": { pl: "/brawlerzy [tag_gracza]", en: "/brawlers [player_tag]" },
    "komendy.brawlerzy_nav": { pl: "/brawlerzy", en: "/brawlers" },
    "komendy.brawlerzy_desc": {
      pl: "Generuje obraz siatki wszystkich brawlerów w grze - odblokowani przez gracza kolorowo (z odznaką rangi albo poziomem mocy w rogu), zablokowani wyszarzeni z ikoną kłódki. Menu pod obrazkiem pozwala przesortować siatkę wg rangi, poziomu mocy, rzadkości albo najwyższych trofeów.",
      en: "Generates an image grid of every brawler in the game - the ones the player has unlocked shown in color (with a rank badge or power level in the corner), locked ones grayed out with a lock icon. A menu under the image lets you re-sort the grid by rank, power level, rarity, or highest trophies.",
    },

    "komendy.ranking_klanu_code": { pl: "/ranking_klanu", en: "/clan_top" },
    "komendy.ranking_klanu_nav": { pl: "/ranking_klanu", en: "/clan_top" },
    "komendy.ranking_klanu_desc": {
      pl: "Pokazuje pierwszą dziesiątkę klanu posortowaną wg trofeów, wg tagu klanu skonfigurowanego przez admina (<code>/ustaw_klan</code>).",
      en: "Shows the clan's top 10 sorted by trophies, based on the clan tag configured by the admin (<code>/set_clan</code>).",
    },

    "komendy.moja_pozycja_code": { pl: "/moja_pozycja [tag_gracza]", en: "/my_rank [player_tag]" },
    "komendy.moja_pozycja_nav": { pl: "/moja_pozycja", en: "/my_rank" },
    "komendy.moja_pozycja_desc": {
      pl: "Twoja aktualna pozycja w rankingu klanu wg aktualnych trofeów i dystans do osoby bezpośrednio wyżej.",
      en: "Your current position in the clan ranking by current trophies, and the gap to the player directly above you.",
    },
    "komendy.moja_pozycja_li1": {
      pl: "Premium: prognoza, za ile dni wyprzedzisz osobę przed sobą (na bazie tempa z ostatnich 30 dni)",
      en: "Premium: a forecast for how many days until you overtake the player above you (based on your pace over the last 30 days)",
    },
    "komendy.moja_pozycja_li2": {
      pl: "Premium: przycisk do samodzielnego ustawienia liczby dni prognozy",
      en: "Premium: a button to set your own custom number of forecast days",
    },

    "komendy.moj_cel_code": { pl: "/moj_cel [tag_gracza] [cel_puchary]", en: "/my_goal [player_tag] [goal_trophies]" },
    "komendy.moj_cel_nav": { pl: "/moj_cel", en: "/my_goal" },
    "komendy.moj_cel_desc": {
      pl: "Ustawia Twój osobisty cel pucharowy i pokazuje pasek postępu oraz zmianę od wczoraj.",
      en: "Sets your personal trophy goal and shows a progress bar plus the change since yesterday.",
    },
    "komendy.moj_cel_li1": {
      pl: "Premium: prognoza dotarcia do celu w widełkach - osobno z Twojego najlepszego i najgorszego tygodnia",
      en: "Premium: a forecast range for reaching your goal - separately from your best and worst week",
    },
    "komendy.moj_cel_li2": {
      pl: "Premium: pole „Najlepszy dzień w tym okresie”",
      en: "Premium: a \"Best day in this period\" field",
    },

    "komendy.moje_osiagniecia_code": { pl: "/moje_osiagniecia [tag_gracza]", en: "/my_achievements [player_tag]" },
    "komendy.moje_osiagniecia_nav": { pl: "/moje_osiagniecia", en: "/my_achievements" },
    "komendy.moje_osiagniecia_desc": {
      pl: "Odznaki i osiągnięcia gracza w klanie, liczone automatycznie z historii bota - m.in. najdłuższa seria na plusie, rekordowy dzień, staż w klanie, % ukończenia kolekcji brawlerów, najlepszy tydzień i kamienie milowe rekordu trofeów.",
      en: "A player's badges and achievements in the clan, calculated automatically from the bot's history - including longest positive streak, record day, time in the clan, brawler collection completion %, best week, and trophy record milestones.",
    },

    "komendy.pojedynek_code": { pl: "/pojedynek [tag_gracza_1] [tag_gracza_2]", en: "/duel [player_tag_1] [player_tag_2]" },
    "komendy.pojedynek_nav": { pl: "/pojedynek", en: "/duel" },
    "komendy.pojedynek_desc": {
      pl: "Porównanie 1:1 dwóch graczy klanu - aktualne trofea, kto prowadzi i przyrost z ostatniego tygodnia każdego z nich.",
      en: "A 1:1 comparison of two clan members - current trophies, who's leading, and each player's gain from the last week.",
    },
    "komendy.pojedynek_li1": {
      pl: "Premium: porównanie kolekcji brawlerów obu graczy (wg rzadkości)",
      en: "Premium: a comparison of both players' brawler collections (by rarity)",
    },
    "komendy.pojedynek_li2": {
      pl: "Premium: wspólny wykres trendu trofeów obu graczy (30 dni)",
      en: "Premium: a shared 30-day trophy trend chart for both players",
    },

    "komendy.historia_pucharow_code": { pl: "/historia_pucharow [zakres_dni] [tag_gracza]", en: "/trophy_history [day_range] [player_tag]" },
    "komendy.historia_pucharow_nav": { pl: "/historia_pucharow", en: "/trophy_history" },
    "komendy.historia_pucharow_desc": {
      pl: "Trend trofeów dowolnego gracza z klanu z ostatnich 7 lub 30 dni - tekstowy sparkline w embedzie plus prawdziwy wykres liniowy PNG. Dorzuca też prognozę osiągnięcia progu klanowego i pozycję gracza w klanie w tym oknie czasowym.",
      en: "Trophy trend for any clan member over the last 7 or 30 days - a text sparkline in the embed plus a real PNG line chart. Also adds a forecast for hitting the clan threshold and the player's position in the clan over that time window.",
    },

    "komendy.rotacja_map_code": { pl: "/rotacja_map", en: "/map_rotation" },
    "komendy.rotacja_map_nav": { pl: "/rotacja_map", en: "/map_rotation" },
    "komendy.rotacja_map_desc": {
      pl: 'Pokazuje na żądanie aktualną rotację map i trybów gry Brawl Stars - ta sama tabela, co na <a href="/Mapy/">stronie z mapami</a>, tylko wprost na Discordzie.',
      en: 'Shows the current Brawl Stars map and mode rotation on demand - the same table as on the <a href="/Mapy/">maps page</a>, just directly on Discord.',
    },

    "komendy.support_code": { pl: "/support", en: "/support" },
    "komendy.support_nav": { pl: "/support", en: "/support" },
    "komendy.support_desc": {
      pl: "Krótkie info o bocie, pierwsze kroki dla admina i przycisk-link do serwera wsparcia.",
      en: "Quick info about the bot, first steps for admins, and a button linking to the support server.",
    },

    "komendy.ustaw_klan_code": { pl: "/ustaw_klan [nowy_tag_klanu]", en: "/set_clan [clan_tag]" },
    "komendy.ustaw_klan_nav": { pl: "/ustaw_klan", en: "/set_clan" },
    "komendy.ustaw_klan_desc": {
      pl: "Powiązuje ten serwer Discord z konkretnym klanem Brawl Stars i od razu zapisuje pierwszy punkt historii pucharów wszystkich jego członków.",
      en: "Links this Discord server to a specific Brawl Stars clan and immediately saves the first trophy history point for all its members.",
    },

    "komendy.ustaw_prog_pucharow_code": { pl: "/ustaw_prog_pucharow [nowe_puchary]", en: "/set_trophy_threshold [new_trophy_count]" },
    "komendy.ustaw_prog_pucharow_nav": { pl: "/ustaw_prog_pucharow", en: "/set_trophy_threshold" },
    "komendy.ustaw_prog_pucharow_desc": {
      pl: "Ustawia minimalny próg pucharowy wymagany na tym serwerze - używany przez <code>/sprawdz_puchary</code>, panel weryfikacji i <code>/czystka_klanu</code>.",
      en: "Sets the minimum trophy threshold required on this server - used by <code>/check_trophies</code>, the verification panel, and <code>/clan_cleanup</code>.",
    },

    "komendy.ustaw_role_rang_code": { pl: "/ustaw_role_rang [ranga_z_gry] [nowa_nazwa_discord]", en: "/set_rank_role [game_rank] [discord_role]" },
    "komendy.ustaw_role_rang_nav": { pl: "/ustaw_role_rang", en: "/set_rank_role" },
    "komendy.ustaw_role_rang_desc": {
      pl: "Dopasowuje nazwę roli Discord do konkretnej rangi klanowej (member / senior / vicePresident / president). Odpowiedź widoczna tylko dla admina.",
      en: "Maps a Discord role name to a specific clan rank (member / senior / vicePresident / president). The response is only visible to the admin.",
    },

    "komendy.ustaw_kanal_raportow_code": { pl: "/ustaw_kanal_raportow [kanal]", en: "/set_report_channel [channel]" },
    "komendy.ustaw_kanal_raportow_nav": { pl: "/ustaw_kanal_raportow", en: "/set_report_channel" },
    "komendy.ustaw_kanal_raportow_desc": {
      pl: "Ustawia kanał, na który trafiają automatyczne raporty tygodniowe i miesięczne. Bot sam sprawdza, czy ma uprawnienia do pisania i linkowania embedów na wybranym kanale.",
      en: "Sets the channel that receives automatic weekly and monthly reports. The bot checks on its own whether it has permission to post and embed links in the chosen channel.",
    },

    "komendy.ustaw_kanal_rotacji_code": { pl: "/ustaw_kanal_rotacji [kanal]", en: "/set_rotation_channel [channel]" },
    "komendy.ustaw_kanal_rotacji_nav": { pl: "/ustaw_kanal_rotacji", en: "/set_rotation_channel" },
    "komendy.ustaw_kanal_rotacji_desc": {
      pl: "Ustawia kanał powiadomień o zmianie mapy w rotacji Brawl Stars.",
      en: "Sets the channel for Brawl Stars map rotation change notifications.",
    },

    "komendy.ustaw_harmonogram_raportow_code": { pl: "/ustaw_harmonogram_raportow [dzien] [godzina]", en: "/set_report_schedule [day] [hour]" },
    "komendy.ustaw_harmonogram_raportow_nav": { pl: "/ustaw_harmonogram_raportow", en: "/set_report_schedule" },
    "komendy.ustaw_harmonogram_raportow_desc": {
      pl: "Ustala dzień tygodnia i godzinę, o której wysyłany jest automatyczny raport tygodniowy.",
      en: "Sets the day of the week and hour when the automatic weekly report is sent.",
    },

    "komendy.panel_weryfikacji_code": { pl: "/panel_weryfikacji", en: "/verification_panel" },
    "komendy.panel_weryfikacji_nav": { pl: "/panel_weryfikacji", en: "/verification_panel" },
    "komendy.panel_weryfikacji_desc": {
      pl: "Wysyła panel z przyciskiem, dzięki któremu członkowie sami się zweryfikują (otwiera formularz na tag z gry).",
      en: "Sends a panel with a button that lets members verify themselves (opens a form for their in-game tag).",
    },

    "komendy.czystka_klanu_code": { pl: "/czystka_klanu", en: "/clan_cleanup" },
    "komendy.czystka_klanu_nav": { pl: "/czystka_klanu", en: "/clan_cleanup" },
    "komendy.czystka_klanu_desc": {
      pl: "Lista członków klanu, którzy są poniżej ustawionego progu pucharowego - gotowa do przejrzenia przed ewentualnym wyrzuceniem z klanu w grze.",
      en: "A list of clan members who are below the configured trophy threshold - ready to review before removing anyone from the clan in-game.",
    },

    "komendy.ustaw_wyglad_code": { pl: "/ustaw_wyglad [komenda]", en: "/set_appearance [command]" },
    "komendy.ustaw_wyglad_nav": { pl: "/ustaw_wyglad", en: "/set_appearance" },
    "komendy.ustaw_wyglad_desc": {
      pl: "Kolor embedów bota. W wersji darmowej wystarczy wywołać komendę bez żadnych parametrów - kolor obejmie wszystkie embedy naraz. W Premium można dodatkowo wybrać (z podpowiadanej listy) jedną z kilkunastu pojedynczych komend bota i ustawić dla niej osobny kolor. Otwiera listę wyboru z 16 kolorami.",
      en: "The bot's embed color. In the free version, just run the command with no parameters - the color applies to every embed at once. Premium lets you additionally pick (from an autocomplete list) one of over a dozen individual bot commands and set a separate color for it. Opens a picker with 16 colors.",
    },

    "komendy.ustaw_jezyk_code": { pl: "/ustaw_jezyk [jezyk]", en: "/set_language [language]" },
    "komendy.ustaw_jezyk_nav": { pl: "/ustaw_jezyk", en: "/set_language" },
    "komendy.ustaw_jezyk_desc": {
      pl: "Ustawia język odpowiedzi bota na tym serwerze - polski albo angielski (domyślnie polski). Wszystkie nazwy i opisy komend mają też natywną angielską lokalizację Discorda, niezależną od tego ustawienia.",
      en: "Sets the bot's response language on this server - Polish or English (Polish by default). Every command name and description also has native English Discord localization, independent of this setting.",
    },

    // ---------- Alt/caption teksty zrzutów ekranu (runda 2026-07-29) ----------
    // Widoczne tylko w PL (patrz wireScreenshots) - EN wersje przygotowane pod
    // przyszłe angielskie zrzuty, żeby nie trzeba było wracać do i18n przy ich
    // dodawaniu.
    "komendy.sprawdz_puchary_shot_usage_alt": { pl: "Wpisywanie komendy /sprawdz_puchary na Discordzie", en: "Typing the /check_trophies command on Discord" },
    "komendy.sprawdz_puchary_shot_result_alt": { pl: "Wynik komendy /sprawdz_puchary - kalkulator progu klanowego", en: "Result of /check_trophies - clan threshold calculator" },

    "komendy.profil_bs_shot_usage_alt": { pl: "Wpisywanie komendy /profil_bs na Discordzie", en: "Typing the /bs_profile command on Discord" },
    "komendy.profil_bs_shot_free_caption": { pl: "Wersja darmowa", en: "Free version" },
    "komendy.profil_bs_shot_free_alt": { pl: "Karta gracza z komendy /profil_bs - wersja darmowa", en: "Player card from /bs_profile - free version" },
    "komendy.profil_bs_shot_premium_caption": { pl: "Premium: progres od pierwszego dnia", en: "Premium: progress since day one" },
    "komendy.profil_bs_shot_premium_alt": { pl: "Karta gracza z komendy /profil_bs - wersja Premium z progresem", en: "Player card from /bs_profile - Premium version with progress" },

    "komendy.brawlerzy_shot_usage_alt": { pl: "Wpisywanie komendy /brawlerzy na Discordzie", en: "Typing the /brawlers command on Discord" },
    "komendy.brawlerzy_shot_result_alt": { pl: "Wynik komendy /brawlerzy - siatka odblokowanych brawlerów", en: "Result of /brawlers - grid of unlocked brawlers" },

    "komendy.ranking_klanu_shot_usage_alt": { pl: "Wpisywanie komendy /ranking_klanu na Discordzie", en: "Typing the /clan_top command on Discord" },
    "komendy.ranking_klanu_shot_result_alt": { pl: "Wynik komendy /ranking_klanu - top 10 klanu", en: "Result of /clan_top - clan's top 10" },

    "komendy.moja_pozycja_shot_usage_alt": { pl: "Wpisywanie komendy /moja_pozycja na Discordzie", en: "Typing the /my_rank command on Discord" },
    "komendy.moja_pozycja_shot_free_caption": { pl: "Wersja darmowa", en: "Free version" },
    "komendy.moja_pozycja_shot_free_alt": { pl: "Wynik komendy /moja_pozycja - wersja darmowa", en: "Result of /my_rank - free version" },
    "komendy.moja_pozycja_shot_premium_caption": { pl: "Premium: prognoza wyprzedzenia", en: "Premium: overtake forecast" },
    "komendy.moja_pozycja_shot_premium_alt": { pl: "Wynik komendy /moja_pozycja - wersja Premium z prognozą", en: "Result of /my_rank - Premium version with forecast" },

    "komendy.moj_cel_shot_usage_alt": { pl: "Wpisywanie komendy /moj_cel na Discordzie", en: "Typing the /my_goal command on Discord" },
    "komendy.moj_cel_shot_free_caption": { pl: "Wersja darmowa", en: "Free version" },
    "komendy.moj_cel_shot_free_alt": { pl: "Wynik komendy /moj_cel - wersja darmowa", en: "Result of /my_goal - free version" },
    "komendy.moj_cel_shot_premium_caption": { pl: "Premium: prognoza w widełkach", en: "Premium: forecast range" },
    "komendy.moj_cel_shot_premium_alt": { pl: "Wynik komendy /moj_cel - wersja Premium z prognozą", en: "Result of /my_goal - Premium version with forecast" },

    "komendy.moje_osiagniecia_shot_usage_alt": { pl: "Wpisywanie komendy /moje_osiagniecia na Discordzie", en: "Typing the /my_achievements command on Discord" },
    "komendy.moje_osiagniecia_shot_result_alt": { pl: "Wynik komendy /moje_osiagniecia - odznaki gracza", en: "Result of /my_achievements - player badges" },

    "komendy.pojedynek_shot_usage_alt": { pl: "Wpisywanie komendy /pojedynek na Discordzie", en: "Typing the /duel command on Discord" },
    "komendy.pojedynek_shot_free_caption": { pl: "Wersja darmowa", en: "Free version" },
    "komendy.pojedynek_shot_free_alt": { pl: "Wynik komendy /pojedynek - wersja darmowa", en: "Result of /duel - free version" },
    "komendy.pojedynek_shot_premium_caption": { pl: "Premium: kolekcja brawlerów + wykres", en: "Premium: brawler collection + chart" },
    "komendy.pojedynek_shot_premium_alt": { pl: "Wynik komendy /pojedynek - wersja Premium z porównaniem kolekcji", en: "Result of /duel - Premium version with collection comparison" },

    "komendy.historia_pucharow_shot_7d_caption": { pl: "Ostatnie 7 dni", en: "Last 7 days" },
    "komendy.historia_pucharow_shot_7d_usage_alt": { pl: "Wpisywanie komendy /historia_pucharow - zakres 7 dni", en: "Typing /trophy_history - 7-day range" },
    "komendy.historia_pucharow_shot_7d_result_alt": { pl: "Wynik komendy /historia_pucharow - trend z ostatnich 7 dni", en: "Result of /trophy_history - 7-day trend" },
    "komendy.historia_pucharow_shot_30d_caption": { pl: "Ostatnie 30 dni", en: "Last 30 days" },
    "komendy.historia_pucharow_shot_30d_usage_alt": { pl: "Wpisywanie komendy /historia_pucharow - zakres 30 dni", en: "Typing /trophy_history - 30-day range" },
    "komendy.historia_pucharow_shot_30d_result_alt": { pl: "Wynik komendy /historia_pucharow - trend z ostatnich 30 dni", en: "Result of /trophy_history - 30-day trend" },

    "komendy.rotacja_map_shot_usage_alt": { pl: "Wpisywanie komendy /rotacja_map na Discordzie", en: "Typing the /map_rotation command on Discord" },
    "komendy.rotacja_map_shot_result_alt": { pl: "Wynik komendy /rotacja_map - aktualna rotacja map", en: "Result of /map_rotation - current map rotation" },

    "komendy.support_shot_usage_alt": { pl: "Wpisywanie komendy /support na Discordzie", en: "Typing the /support command on Discord" },
    "komendy.support_shot_result_alt": { pl: "Wynik komendy /support - pomoc i pierwsze kroki", en: "Result of /support - help and first steps" },

    "komendy.ustaw_klan_shot_usage_alt": { pl: "Wpisywanie komendy /ustaw_klan na Discordzie", en: "Typing the /set_clan command on Discord" },
    "komendy.ustaw_klan_shot_result_alt": { pl: "Wynik komendy /ustaw_klan - klan powiązany z serwerem", en: "Result of /set_clan - clan linked to the server" },

    "komendy.ustaw_prog_pucharow_shot_usage_alt": { pl: "Wpisywanie komendy /ustaw_prog_pucharow na Discordzie", en: "Typing the /set_trophy_threshold command on Discord" },
    "komendy.ustaw_prog_pucharow_shot_result_alt": { pl: "Wynik komendy /ustaw_prog_pucharow - zaktualizowany próg", en: "Result of /set_trophy_threshold - updated threshold" },

    "komendy.ustaw_role_rang_shot_usage_alt": { pl: "Wpisywanie komendy /ustaw_role_rang na Discordzie", en: "Typing the /set_rank_role command on Discord" },
    "komendy.ustaw_role_rang_shot_result_alt": { pl: "Wynik komendy /ustaw_role_rang - rola powiązana z rangą", en: "Result of /set_rank_role - role linked to a rank" },

    "komendy.ustaw_kanal_raportow_shot_usage_alt": { pl: "Wpisywanie komendy /ustaw_kanal_raportow na Discordzie", en: "Typing the /set_report_channel command on Discord" },
    "komendy.ustaw_kanal_raportow_shot_result_alt": { pl: "Wynik komendy /ustaw_kanal_raportow - kanał raportów ustawiony", en: "Result of /set_report_channel - report channel set" },

    "komendy.ustaw_kanal_rotacji_shot_usage_alt": { pl: "Wpisywanie komendy /ustaw_kanal_rotacji na Discordzie", en: "Typing the /set_rotation_channel command on Discord" },
    "komendy.ustaw_kanal_rotacji_shot_result_alt": { pl: "Wynik komendy /ustaw_kanal_rotacji - kanał rotacji ustawiony", en: "Result of /set_rotation_channel - rotation channel set" },

    "komendy.ustaw_harmonogram_raportow_shot_usage_alt": { pl: "Wpisywanie komendy /ustaw_harmonogram_raportow na Discordzie", en: "Typing the /set_report_schedule command on Discord" },
    "komendy.ustaw_harmonogram_raportow_shot_result_alt": { pl: "Wynik komendy /ustaw_harmonogram_raportow - harmonogram ustawiony", en: "Result of /set_report_schedule - schedule set" },

    "komendy.panel_weryfikacji_shot_usage_alt": { pl: "Wpisywanie komendy /panel_weryfikacji na Discordzie", en: "Typing the /verification_panel command on Discord" },
    "komendy.panel_weryfikacji_shot_result_alt": { pl: "Wynik komendy /panel_weryfikacji - panel z przyciskiem weryfikacji", en: "Result of /verification_panel - panel with a verify button" },

    "komendy.czystka_klanu_shot_usage_alt": { pl: "Wpisywanie komendy /czystka_klanu na Discordzie", en: "Typing the /clan_cleanup command on Discord" },
    "komendy.czystka_klanu_shot_spelnia_caption": { pl: "Wszyscy spełniają próg", en: "Everyone meets the threshold" },
    "komendy.czystka_klanu_shot_spelnia_alt": { pl: "Wynik komendy /czystka_klanu - wszyscy członkowie spełniają próg", en: "Result of /clan_cleanup - every member meets the threshold" },
    "komendy.czystka_klanu_shot_niespelnia_caption": { pl: "Część graczy poniżej progu", en: "Some players below the threshold" },
    "komendy.czystka_klanu_shot_niespelnia_alt": { pl: "Wynik komendy /czystka_klanu - lista graczy poniżej progu", en: "Result of /clan_cleanup - list of players below the threshold" },

    "komendy.ustaw_wyglad_shot_usage_alt": { pl: "Wpisywanie komendy /ustaw_wyglad na Discordzie (bez parametrów)", en: "Typing the /set_appearance command on Discord (no parameters)" },
    "komendy.ustaw_wyglad_shot_dropdown_alt": { pl: "Lista wyboru koloru embedów (16 kolorów)", en: "Embed color picker (16 colors)" },
    "komendy.ustaw_wyglad_shot_result_alt": { pl: "Wynik komendy /ustaw_wyglad - globalny kolor zaktualizowany", en: "Result of /set_appearance - global color updated" },
    "komendy.ustaw_wyglad_shot_premium_usage_caption": { pl: "Premium: wybór jednej komendy - użycie", en: "Premium: picking a single command - usage" },
    "komendy.ustaw_wyglad_shot_premium_usage_alt": { pl: "Wpisywanie komendy /ustaw_wyglad z wybraną pojedynczą komendą (Premium)", en: "Typing /set_appearance with a single command selected (Premium)" },
    "komendy.ustaw_wyglad_shot_premium_result_caption": { pl: "Premium: kolor tylko tej komendy - wynik", en: "Premium: color for just that command - result" },
    "komendy.ustaw_wyglad_shot_premium_result_alt": { pl: "Wynik komendy /ustaw_wyglad - kolor pojedynczej komendy zaktualizowany (Premium)", en: "Result of /set_appearance - single command's color updated (Premium)" },

    "komendy.ustaw_jezyk_shot_usage_alt": { pl: "Wpisywanie komendy /ustaw_jezyk na Discordzie", en: "Typing the /set_language command on Discord" },
    "komendy.ustaw_jezyk_shot_result_alt": { pl: "Wynik komendy /ustaw_jezyk - język bota zaktualizowany", en: "Result of /set_language - bot language updated" },
  };

  // Odkrywa realne zrzuty ekranu - runda 2026-07-29 zrobiła to dla PL, runda
  // 2026-07-31 dociągnęła analogiczny branch dla EN. Domyślny markup w TEMPLATE
  // wyżej jest pisany "na sztywno" pod stan "zero zrzutów" (.command-block-shots
  // ma atrybut hidden, badge-pending jest widoczny, każdy <img> ma src=PL) - ta
  // funkcja odwraca to per język: chowa badge, odkrywa zrzuty i zdejmuje
  // --text-only, żeby wrócić do dwukolumnowego układu .command-block (patrz
  // style.css). Analogicznie chowa baner #komendy-info-note-wrap ("zrzuty
  // wstrzymane"), bo dla obu języków jest już w większości nieaktualny.
  //
  // PL (`[data-has-shots]`): stan 2026-07-31, 21 z 21 komend ma ten atrybut
  // (panel_rekrutacji/panel_preferencji, które kiedyś tu były, zostały usunięte
  // ze strony - to wewnętrzne narzędzia Pawła oparte o twardo zakodowane
  // ROLE_ID z jego własnego serwera, nie ogólne funkcje bota).
  //
  // EN (`[data-has-shots-en]`): druga, osobna runda zrzutów (2026-07-30,
  // dostarczona przez Pawła, mapa plik->komenda w
  // C:\Users\x\Desktop\mozg\.claude\komendy.md), dociągnięta 2026-07-31 dwoma
  // brakującymi kompletami (/brawlerzy, wariant Premium /ustaw_wyglad) - teraz
  // 21 z 21 komend ma ten atrybut. Każdy <img>, który ma angielski odpowiednik,
  // niesie `data-src-en` z jego ścieżką - branch EN podmienia `img.src` na tę
  // wartość. Jedno miejsce nadal nie ma kompletu wariantów po angielsku
  // (opisane w komendy.md, świadomie zaakceptowana luka): /czystka_klanu
  // brakuje wariantu "wszyscy spełniają próg" (tylko "niespelnia" dostarczone).
  // Elementy bez angielskiego odpowiednika niosą `data-en-skip="1")` - branch EN
  // je chowa (patrz uzasadnienie inline style.display przy pendingBadge niżej -
  // ten sam problem author-CSS-vs-UA-hidden dotyczy .command-screenshot-group,
  // które ma `display: flex` w style.css).
  function wireScreenshots(forcedLang) {
    const infoNoteWrap = document.getElementById("komendy-info-note-wrap");
    if (forcedLang !== "pl" && forcedLang !== "en") {
      if (infoNoteWrap) infoNoteWrap.hidden = false;
      return;
    }
    if (infoNoteWrap) infoNoteWrap.hidden = true;
    const blockSelector = forcedLang === "pl" ? ".command-block[data-has-shots]" : ".command-block[data-has-shots-en]";
    document.querySelectorAll(blockSelector).forEach((block) => {
      block.classList.remove("command-block--text-only");
      // .badge sets `display: inline-flex` in style.css - an author-stylesheet
      // rule, which always beats the browser's UA `[hidden]{display:none}`
      // regardless of selector specificity (author origin outranks UA origin
      // in the cascade). Plain `.hidden = true` silently no-ops on badges for
      // this reason - found via Playwright screenshot during this round
      // (2026-07-29), the badge stayed visible even though .hidden read back
      // as true. Setting inline style.display explicitly sidesteps that.
      const pendingBadge = block.querySelector(".badge-pending");
      if (pendingBadge) pendingBadge.style.display = "none";
      const shots = block.querySelector(".command-block-shots");
      if (shots) shots.hidden = false;

      if (forcedLang === "en") {
        // Swap every image that has an English variant to it.
        block.querySelectorAll("img[data-src-en]").forEach((img) => {
          img.src = img.dataset.srcEn;
        });
        // Hide any sub-element without an English variant (see comment above
        // the function for the two known gaps). Same inline-style reasoning
        // as pendingBadge above - .command-screenshot-group has `display: flex`
        // as an author rule in style.css, so plain `.hidden = true` would not
        // actually hide it.
        block.querySelectorAll("[data-en-skip]").forEach((el) => {
          el.style.display = "none";
        });
      }
    });
  }

  // Lightbox powiększenia screenshotu - patrz komentarz przy #command-lightbox
  // w TEMPLATE wyżej po uzasadnienie, czemu to osobna implementacja, a nie ta
  // sama funkcja co #map-lightbox na Mapy/Maps.
  function wireLightbox() {
    const lightboxEl = document.getElementById("command-lightbox");
    const lightboxImgEl = document.getElementById("command-lightbox-img");
    const lightboxCaptionEl = document.getElementById("command-lightbox-caption");
    const lightboxCloseEl = lightboxEl.querySelector(".command-lightbox-close");
    const screenshots = document.querySelectorAll(".command-screenshot");

    function openLightbox(img) {
      lightboxImgEl.src = img.src;
      lightboxImgEl.alt = img.alt;
      lightboxCaptionEl.textContent = img.alt;
      lightboxEl.hidden = false;
      document.body.style.overflow = "hidden";
      lightboxCloseEl.focus();
    }

    function closeLightbox() {
      lightboxEl.hidden = true;
      lightboxImgEl.src = "";
      document.body.style.overflow = "";
    }

    screenshots.forEach((img) => {
      img.addEventListener("click", () => openLightbox(img));
      img.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openLightbox(img);
      });
    });

    lightboxCloseEl.addEventListener("click", closeLightbox);

    lightboxEl.addEventListener("click", (event) => {
      if (event.target === lightboxEl) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightboxEl.hidden) closeLightbox();
    });
  }

  // Zwijana belka pigułek komend (2026-07-22) - domyślnie rozwinięta. max-height
  // animowany na WYLICZONY scrollHeight (nie stałą wartość) w obie strony, bo
  // liczba wierszy zawiniętych pigułek zależy od szerokości ekranu.
  function wireCollapsibleNav() {
    const toggleBtn = document.getElementById("commandNavToggle");
    const collapsible = document.getElementById("commandNavCollapsible");
    if (!toggleBtn || !collapsible) return;

    function setExpanded(expanded) {
      if (expanded) {
        const targetHeight = collapsible.scrollHeight;
        collapsible.style.maxHeight = targetHeight + "px";
        const clearFixedHeight = (event) => {
          if (event.propertyName !== "max-height") return;
          collapsible.style.maxHeight = "none";
          collapsible.removeEventListener("transitionend", clearFixedHeight);
        };
        collapsible.addEventListener("transitionend", clearFixedHeight);
      } else {
        collapsible.style.maxHeight = collapsible.scrollHeight + "px";
        void collapsible.offsetHeight;
        collapsible.style.maxHeight = "0px";
      }
      toggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
    }

    toggleBtn.addEventListener("click", () => {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      setExpanded(!isExpanded);
    });
  }

  window.BM_KOMENDY_PAGE = {
    // opts: { forcedLang: "pl"|"en", urlPair: {pl,en} } - przekazywane wprost do
    // BM_I18N.init(), patrz assets/i18n.js.
    mount: function (opts) {
      document.body.insertAdjacentHTML("afterbegin", TEMPLATE);
      wireScreenshots((opts || {}).forcedLang);
      wireLightbox();
      wireCollapsibleNav();
      window.BM_I18N.init(DICT, opts);
    },
  };
})();
