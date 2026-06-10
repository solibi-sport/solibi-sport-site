import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://fkuvgvlxlmzmyacaosgi.supabase.co';

// פה בפנים, בין הגרשיים, אתה מדביק את כל המפתח הארוך שהעתקת
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdXZndmx4bG16bXlhY2Fvc2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNjA1NDcsImV4cCI6MjA5MTYzNjU0N30.O1XX2kX3LJX97BXR3Fd3h-a1R1sgCUASRAKvD4BOG7Q'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);