/*
 * Wspólna konfiguracja połączenia z bazą danych Supabase.
 * Ten plik musi być wczytany przed skryptami tworzącymi klienta Supabase.
 * Klucz publishable/anon jest przeznaczony do aplikacji klienckiej.
 * Bezpieczeństwo danych musi zapewniać Row Level Security (RLS) w Supabase.
 */
window.APP_DATABASE_CONFIG = Object.freeze({
  SUPABASE_URL: 'https://vyobsgknuxxlglkyhulb.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_n6qmH_g5BMxbzxxz5KDp3A_W0k80d7L'
});
