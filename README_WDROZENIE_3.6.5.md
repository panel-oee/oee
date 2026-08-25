# Panel OEE 3.6.5 - poprawki Egress

## Najważniejsze zmiany
- `oee_reports` jest pobierane tylko od początku poprzedniego miesiąca do końca bieżącego miesiąca.
- Zapytania nie używają już `select('*')` w głównych miejscach, tylko listy potrzebnych kolumn.
- Odświeżanie historii 6S na dashboardzie zmieniono z 2 do 5 minut i zatrzymano w ukrytej karcie.
- Własne dźwięki w `config_panel.html` trafiają do bucketu `break-sounds`, a w harmonogramie zapisywany jest tylko URL. To zapobiega rozsyłaniu Base64 przy każdym pobraniu konfiguracji.
- Service worker nie próbuje cache'ować zewnętrznych odpowiedzi API Supabase.
- Wersja aplikacji: 3.6.5.

## Wdrożenie
1. Zachowaj istniejący folder `icons` w repozytorium.
2. Podmień pliki z paczki w katalogu głównym repozytorium `app`.
3. Upewnij się, że `manifest.webmanifest` nie ma rozszerzenia `.txt`.
4. Bucket Supabase Storage `break-sounds` musi istnieć i umożliwiać odczyt publiczny oraz autoryzowany upload zgodny z politykami projektu.
5. Po publikacji uruchom aplikację i wybierz aktualizację do 3.6.5. W razie starego cache zamknij PWA i uruchom ponownie.

## Uwaga
Pakiet nie zawiera ikon, ponieważ nie zostały przekazane. Nie usuwaj folderu `icons` z repozytorium.
