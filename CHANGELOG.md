## CHANGELOG

### 5.0.4 - 2026-11-03

#### Zmieniono
- przeniesiono wspólną konfigurację połączenia z Supabase do `assets/database-config.js`,
- usunięto powielone dane połączenia z sześciu plików HTML,
- wszystkie ekrany korzystają teraz z jednego źródła konfiguracji bazy danych,
- zachowano odrębne funkcje `index.html` i `index2.html` oraz dotychczasową logikę OEE i 6S.

### 5.0.3 - 2026-11-03

#### Poprawiono
- usunięto duplikaty identyfikatorów HTML w `index.html` i `index2.html` przez rozdzielenie identyfikatorów bloków stylów i skryptów,
- zachowano odrębne przeznaczenie ekranów TV: `index.html` bez przerw oraz `index2.html` z przerwami i modułem 6S,
- zachowano dotychczasową bazę Supabase, logikę OEE, raportowanie dwóch zmian i moduł 6S,
- uporządkowano strukturę paczki z plikami `quantum-forge.css` i `quantum-forge.js` w katalogu `assets`,
- pominięto stare, zbędne pliki instrukcji wdrożeniowych.

### 5.0.2 - 2026-09-03

#### Poprawiono
- naprawiono czytelność opcji list rozwijanych w Edge i Chrome,
- zachowano lokalny wygląd przycisków na każdym ekranie,
- usunięto globalne nadpisywanie gradientów, zaokrągleń i animacji przycisków z `quantum-forge.css`,
- naprawiono zbędny nawias w `quantum-forge.css`,
- usunięto osierocony fragment animacji CSS z `index.html`,
- dodano obsługę czytelnych opcji list dla jasnego i ciemnego motywu,
- zachowano połączenie z dotychczasową bazą Supabase i istniejącą logikę OEE/6S.

### 5.0.1 - 2026-08-28
- usunięto dodatkowy globalny pasek nawigacji,
- zachowano nawigację kontekstową ekranów.
