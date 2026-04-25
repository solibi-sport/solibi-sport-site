// יבוא הספריה של סופאבייס ישירות לדפדפן (ללא התקנות)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// המפתחות שלך
const supabaseUrl = 'https://fkuvgvlxlmzmyacaosgi.supabase.co'
const supabaseKey = 'sb_publishable_FVsN5ZdlDNAEh2w8sE9Ipw_R8g0KJkR'

// יצירת החיבור שאותו נייבא לכל שאר הדפים באתר
export const supabase = createClient(supabaseUrl, supabaseKey)
