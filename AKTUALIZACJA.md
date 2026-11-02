# Aktualizacja paczki

Poprawiono logikę daty w panelu dwuzmianowym:

- panel otwiera bieżący dzień kalendarzowy, np. 2 listopada 2026, zamiast poprzedniego dnia roboczego,
- raport zmiany 1 i zmiany 2 jest przypisany do tej samej bieżącej daty,
- po zapisaniu zmiany 1 panel pozostaje na tej samej dacie i przełącza formularz na zmianę 2,
- po zapisaniu zmiany 2 panel nadal pozostaje na tej samej dacie,
- daty historyczne nadal można wybrać ręcznie w kalendarzu.

Migracji SQL nie uruchamiaj ponownie. Podmień pliki HTML i wykonaj `Ctrl+F5`.
