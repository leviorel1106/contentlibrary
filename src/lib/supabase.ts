import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xyyhuwifwyjdgonmahbc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5eWh1d2lmd3lqZGdvbm1haGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTM5MDcsImV4cCI6MjA4MzI4OTkwN30.TbjGqgR-Ylj2CawyeO84cLGctWwQAd0sv6G4KBSf4sI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
