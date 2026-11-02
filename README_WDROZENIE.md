# OEE - wersja dwuzmianowa

## Kolejnosc wdrozenia

1. Zrob kopie tabeli `oee_reports` w Supabase.
2. W Supabase otworz **SQL Editor**, wklej zawartosc pliku `01_migracja_supabase.sql` i uruchom.
3. W repozytorium podmien pliki:
   - `panel.html`
   - `index.html`
   - `index2.html`
   - `config_panel.html` (bez zmian funkcjonalnych, dolaczony dla kompletnej paczki)
4. Po wdrozeniu wykonaj twarde odswiezenie przegladarki (`Ctrl+F5`) na panelu i obu TV.
5. Wprowadz testowy raport na zmianie 1 i zmianie 2 dla jednej daty.

## Zasady

- Zmiana 1: 06:00-14:00, okno zamkniecia 13:50-14:00.
- Zmiana 2: 14:00-22:00, okno zamkniecia 21:50-22:00.
- Raporty sa zapisywane osobno wedlug `date + shift`.
- Istniejace raporty sa zachowane i otrzymuja `shift = 1`.
- Ekrany TV lacza raporty zmianowe w jeden wynik dobowy.
- `index2.html` zachowuje mechanizm przerw i 6S korzystajacy z konfiguracji Supabase / `config_panel.html`.
- Status zamkniecia: `przed_oknem`, `w_terminie`, `po_terminie` albo `korekta_historyczna`.

## Cofniecie

W razie problemu najpierw przywroc poprzednie pliki HTML. Nie usuwaj kolumn z bazy, poniewaz przechowuja raporty obu zmian.
