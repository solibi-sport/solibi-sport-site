// יבוא הספריה של סופאבייס ישירות לדפדפן (ללא התקנות)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// המפתחות שלך
const supabaseUrl = 'https://fkuvgvlxlmzmyacaosgi.supabase.co'
const supabaseKey = 'הדבק_כאן_את_מפתח_ה_PUBLISHABLE_שלך_מהתמונה_האחרונה'

// יצירת החיבור שאותו נייבא לכל שאר הדפים באתר
export const supabase = createClient(supabaseUrl, supabaseKey)
