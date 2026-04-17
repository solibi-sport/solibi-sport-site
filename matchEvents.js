// 1. מזריק את העיצוב (CSS) בצבעים של האתר שלך באופן אוטומטי
const modalStyle = document.createElement('style');
modalStyle.innerHTML = `
.modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(6, 12, 20, 0.85); backdrop-filter: blur(5px); z-index: 9999; justify-content: center; align-items: center; direction: rtl; animation: fadeIn 0.2s ease-out; }
.modal-box { background: #111926; color: #ffffff; width: 90%; max-width: 450px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); border: 1px solid #1f2d40; overflow: hidden; transform: scale(0.95); animation: scaleUp 0.2s ease-out forwards; }
.modal-header { background: #0d131d; padding: 15px 20px; text-align: center; position: relative; border-bottom: 2px solid #7a9966; }
.modal-header h2 { margin: 0; font-size: 18px; font-weight: bold; color: #ffffff; }
.close-modal { position: absolute; top: 50%; transform: translateY(-50%); left: 15px; font-size: 22px; cursor: pointer; color: #7a9966; }
.close-modal:hover { color: #ffffff; }
#modalEventsContent { padding: 5px 20px 20px 20px; max-height: 60vh; overflow-y: auto; }
.event-item { padding: 12px 0; border-bottom: 1px solid #1f2d40; display: flex; align-items: center; gap: 15px; font-size: 14px; }
.event-item:last-child { border-bottom: none; }
#modalEventsContent::-webkit-scrollbar { width: 6px; }
#modalEventsContent::-webkit-scrollbar-track { background: transparent; }
#modalEventsContent::-webkit-scrollbar-thumb { background: #1f2d40; border-radius: 10px; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleUp { from { transform: scale(0.9); } to { transform: scale(1); } }
`;
document.head.appendChild(modalStyle);

// 2. מזריק את מסגרת ה-HTML ברגע שהדף נטען
document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById('eventsModal')) {
        const modalHTML = `
        <div id="eventsModal" class="modal-overlay">
            <div class="modal-box">
                <div class="modal-header">
                    <span class="close-modal" onclick="closeEventsModal(event)">✖</span>
                    <h2 id="modalMatchTitle">טוען...</h2>
                </div>
                <div id="modalEventsContent"></div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
});

// 3. הפונקציה שמושכת את האירועים כשלוחצים
async function openMatchEvents(fixtureId, homeTeam, awayTeam) {
    const modal = document.getElementById('eventsModal');
    const content = document.getElementById('modalEventsContent');
    const title = document.getElementById('modalMatchTitle');
    
    modal.style.display = 'flex';
    title.innerText = `${translateName(homeTeam)} - ${translateName(awayTeam)}`;
    content.innerHTML = '<p style="text-align:center; margin-top:20px;">טוען אירועים...</p>';

    try {
        const response = await fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`, {
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': 'הכנס-את-המפתח-שלך-כאן' // <=== שים את מפתח ה-API שלך פה!!!
            }
        });
        
        const data = await response.json();
        const events = data.response;

        if (!events || events.length === 0) {
            content.innerHTML = '<p style="text-align:center; margin-top:20px;">לא נמצאו אירועים למשחק זה.</p>';
            return;
        }

        let html = '<div style="margin-top:15px;"></div>';
        events.forEach(event => {
            let time = event.time.elapsed + (event.time.extra ? `+${event.time.extra}` : '');
            let teamName = translateName(event.team.name);
            let playerName = translateName(event.player.name);
            let assistName = event.assist.name ? translateName(event.assist.name) : null;
            
            let icon = '📌';
            let eventDetails = '';

            if (event.type === 'Goal') {
                icon = '⚽';
                eventDetails = `שער! ${playerName}`;
                if (assistName) eventDetails += ` <span style="color:#888; font-size:12px;">(בישול: ${assistName})</span>`;
            } else if (event.type === 'Card' && event.detail.includes('Yellow')) {
                icon = '🟨';
                eventDetails = `כרטיס צהוב: ${playerName}`;
            } else if (event.type === 'Card' && event.detail.includes('Red')) {
                icon = '🟥';
                eventDetails = `כרטיס אדום: ${playerName}`;
            } else if (event.type === 'subst') {
                icon = '🔄';
                eventDetails = `חילוף: ${playerName}`;
            }

            if (['Goal', 'Card', 'subst'].includes(event.type)) {
                 html += `
                    <div class="event-item">
                        <span style="font-weight:bold; color:#7a9966; min-width: 35px; text-align:right;">${time}'</span>
                        <span style="font-size: 16px;">${icon}</span>
                        <span style="flex-grow: 1;"><strong>${teamName}</strong> <br> ${eventDetails}</span>
                    </div>`;
            }
        });
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = '<p style="text-align:center; margin-top:20px; color:#ff4d4d;">שגיאה בטעינת הנתונים.</p>';
    }
}

// 4. הפונקציה שסוגרת את החלון
function closeEventsModal(event) {
    if(event) event.stopPropagation();
    document.getElementById('eventsModal').style.display = 'none';
}
