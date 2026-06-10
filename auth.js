import { supabase } from './supabaseClient.js';

async function checkAuthAndUpdateHeader() {
    const { data: { user } } = await supabase.auth.getUser();
    
    const checkInterval = setInterval(() => {
        const authBtn = document.getElementById('auth-btn');
        const authText = document.getElementById('auth-text');
        
        if (authBtn && authText) {
            clearInterval(checkInterval);
            
            if (user) {
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