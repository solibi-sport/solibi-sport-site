import { supabase } from './supabaseClient.js';

async function checkAuthAndUpdateHeader() {
    const { data: { user } } = await supabase.auth.getUser();
    
    const checkInterval = setInterval(() => {
        const authBtn = document.getElementById('auth-btn');
        const authText = document.getElementById('auth-text');
        // חיפוש המקום שהכנו לברכה
        const greetingEl = document.getElementById('user-greeting'); 
        
        if (authBtn && authText) {
            clearInterval(checkInterval);
            
            if (user) {
                // שולפים את השם. אם אין שם מוגדר, ניקח את החלק שלפני ה-@ באימייל
                const userName = user.user_metadata?.full_name || user.email.split('@')[0];
                
                // כותבים את הברכה
                if (greetingEl) {
                    greetingEl.innerText = `שלום, ${userName} | `;
                }

                // משנים את הכפתור להתנתקות
                authText.innerText = 'התנתק';
                authBtn.href = '#';
                
                authBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await supabase.auth.signOut();
                    window.location.reload();
                });
            }
        }
    }, 100);
}

checkAuthAndUpdateHeader();