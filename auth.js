import { supabase } from './supabaseClient.js';

async function checkAuthAndUpdateHeader() {
    const { data: { user } } = await supabase.auth.getUser();
    
    const checkInterval = setInterval(() => {
        const authContainer = document.getElementById('dynamic-auth-btn');
        
        if (authContainer) {
            clearInterval(checkInterval); 
            
            if (user) {
                // שולפים את השם של המשתמש
                const userName = user.user_metadata?.display_name || user.user_metadata?.full_name || user.email.split('@')[0];
                
                // הזרקת הכפתור עם קלאסים נקיים ל-CSS
                authContainer.innerHTML = `
                    <a href="profile.html" class="profile-dynamic-btn">
                        <span class="profile-btn-title">
                            אזור אישי <i class="fa-regular fa-user" style="margin-right: 3px;"></i>
                        </span>
                        <span class="profile-btn-subtitle">
                            היי, ${userName}
                        </span>
                    </a>
                `;
            }
        }
    }, 100);
}

checkAuthAndUpdateHeader();