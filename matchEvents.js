// 1. מזריק את העיצוב (CSS) - גרסה רוחבית, מפוצלת עם שליטה בכדור
const modalStyle = document.createElement('style');
modalStyle.innerHTML = `
.modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(6, 12, 20, 0.85); backdrop-filter: blur(5px); z-index: 9999; justify-content: center; align-items: center; direction: rtl; animation: fadeIn 0.2s ease-out; }
.modal-box { background: #111926; color: #ffffff; width: 95%; max-width: 750px; border-radius: 12px; box-shadow: 0 15px 40px rgba(0,0,0,0.8); border: 1px solid #1f2d40; overflow: hidden; transform: scale(0.95); animation: scaleUp 0.2s ease-out forwards; display: flex; flex-direction: column; max-height: 85vh;}
.modal-header { background: #0d131d; padding: 15px 20px; text-align: center; position: relative; border-bottom: 2px solid #7a9966; flex-shrink: 0; }
.modal-header h2 { margin: 0; font-size: 20px; font-weight: bold; color: #ffffff; }
.close-modal { position: absolute; top: 50%; transform: translateY(-50%); left: 20px; font-size: 26px; cursor: pointer; color: #7a9966; transition: 0.2s; }
.close-modal:hover { color: #ffffff; }

/* אזור שליטה בכדור */
.possession-container { padding: 15px 20px 5px; flex-shrink: 0; background: #0f1620; border-bottom: 1px solid #1f2d40; }
.possession-title { text-align: center; font-size: 13px; color: #8fa0b3; margin-bottom: 8px; }
.possession-labels { display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-bottom: 5px; color: #fff; }
.possession-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; background: #1f2d40; }
.possession-home { background: #7a9966; height: 100%; transition: width 1s ease-out; }
.possession-away { background: #4a90e2; height: 100%; transition: width 1s ease-out; }

/* פיצול האירועים ל-2 עמודות */
#modalEventsContent { padding: 15px 20px; overflow-y: auto; flex-grow: 1; display: flex; gap: 20px; }
.team-col { flex: 1; background: rgba(255,255,255,0.02); border-radius: 8px; padding: 15px; border: 1px solid #1f2d40; }
.team-title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #2a3b4c; color: #fff; }

/* אירוע בודד */
.event-item { display: flex; align-items: center; margin-bottom: 15px; font-size: 13px; line-height: 1.4; }
.event-home { justify-content: flex-start; text-align: right; } 
.event-away { justify-content: flex-end; text-align: left; flex-direction: row-reverse; } /* משמאל לימין לקבוצת החוץ */

.event-time { font-weight: bold; color: #7a9966; min-width: 35px; text-align: center; font-size: 14px; background: rgba(122, 153, 102, 0.1); padding: 3px 6px; border-radius: 4px; margin: 0 8px; }
.event-icon { font-size: 18px; margin: 0 5px; }
.event-text { color: #d1d5db; }
.event-subtext { color: #888; font-size: 11px; display: block; margin-top: 2px; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #2a3b4c; border-radius: 10px; }
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

// 3. הפונקציה שמושכת את האירועים והסטטיסטיקה ביחד!
async function openMatchEvents(fixtureId, homeTeam, awayTeam) {
    const modal = document.getElementById('eventsModal');
    const content = document.getElementById('modalEventsContent');
    const title = document.getElementById('modalMatchTitle');
    
    // ניקוי פס שליטה בכדור קודם אם יש
    const existingPoss = document.getElementById('modalPossession');
    if (existingPoss) existingPoss.remove();

    modal.style.display = 'flex';
    title.innerText = `${translateName(homeTeam)} - ${translateName(awayTeam)}`;
    content.innerHTML = '<p style="text-align:center; width:100%; margin-top:30px; font-size:16px;">טוען נתוני משחק...</p>';
    content.style.display = 'block';

    try {
        const headers = {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': 'הכנס-את-המפתח-שלך-כאן' // <=== שים את מפתח ה-API שלך פה!!!
        };

        // מושך גם אירועים וגם סטטיסטיקה במקביל כדי לחסוך זמן טעינה!
        const [eventsRes, statsRes] = await Promise.all([
            fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`, { headers }),
            fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`, { headers })
        ]);
        
        const eventsData = await eventsRes.json();
        const statsData = await statsRes.json();

        const events = eventsData.response || [];
        const stats = statsData.response || [];

        // --- חישוב ובניית פס שליטה בכדור ---
        let homePoss = "50%";
        let awayPoss = "50%";
        if (stats.length === 2) {
            const homeStat = stats[0].statistics.find(s => s.type === "Ball Possession");
            const awayStat = stats[1].statistics.find(s => s.type === "Ball Possession");
            if (homeStat && homeStat.value) homePoss = homeStat.value;
            if (awayStat && awayStat.value) awayPoss = awayStat.value;
        }

        const possessionHTML = `
        <div id="modalPossession" class="possession-container">
            <div class="possession-title">שליטה בכדור</div>
            <div class="possession-labels">
                <span>${translateName(homeTeam)} (${homePoss})</span>
                <span>${translateName(awayTeam)} (${awayPoss})</span>
            </div>
            <div class="possession-bar">
                <div class="possession-home" style="width: ${homePoss}"></div>
                <div class="possession-away" style="width: ${awayPoss}"></div>
            </div>
        </div>`;
        document.querySelector('.modal-header').insertAdjacentHTML('afterend', possessionHTML);

        // --- עיבוד ומיון אירועי המשחק ---
        content.style.display = 'flex'; // מחזיר לתצוגת 2 עמודות
        if (events.length === 0) {
            content.innerHTML = '<p style="text-align:center; width:100%;">לא נמצאו אירועים מרכזיים למשחק זה.</p>';
            return;
        }

        // ממיין את האירועים לפי הדקה שבה קרו (מההתחלה לסוף)
        events.sort((a, b) => a.time.elapsed - b.time.elapsed);

        let homeHtml = `<div class="team-col"><div class="team-title">${translateName(homeTeam)}</div>`;
        let awayHtml = `<div class="team-col"><div class="team-title">${translateName(awayTeam)}</div>`;

        events.forEach(event => {
            let time = event.time.elapsed + (event.time.extra ? `+${event.time.extra}` : '');
            let playerName = translateName(event.player.name);
            let assistName = event.assist.name ? translateName(event.assist.name) : null;
            
            let icon = '';
            let mainText = '';
            let subText = '';

            if (event.type === 'Goal') {
                icon = '⚽';
                mainText = `שער! ${playerName}`;
                if (assistName) subText = `בישול: ${assistName}`;
            } else if (event.type === 'Card' && event.detail.includes('Yellow')) {
                icon = '🟨';
                mainText = playerName;
                subText = 'כרטיס צהוב';
            } else if (event.type === 'Card' && event.detail.includes('Red')) {
                icon = '🟥';
                mainText = playerName;
                subText = 'כרטיס אדום';
            } else if (event.type === 'subst') {
                icon = '🔄';
                mainText = `${playerName} (נכנס)`;
                subText = `${assistName} (יצא)`;
            } else {
                return; // מדלג על אירועים לא מעניינים (החמצות פנדל וכו' אלא אם תרצה שנוסיף)
            }

            const isHome = event.team.name === homeTeam;
            const eventMarkup = `
                <div class="event-item ${isHome ? 'event-home' : 'event-away'}">
                    <span class="event-time">${time}'</span>
                    <span class="event-icon">${icon}</span>
                    <div class="event-text">
                        <strong>${mainText}</strong>
                        ${subText ? `<span class="event-subtext">${subText}</span>` : ''}
                    </div>
                </div>
            `;

            if (isHome) {
                homeHtml += eventMarkup;
            } else {
                awayHtml += eventMarkup;
            }
        });

        homeHtml += '</div>';
        awayHtml += '</div>';

        content.innerHTML = homeHtml + awayHtml;

    } catch (error) {
        console.error(error);
        content.innerHTML = '<p style="text-align:center; width:100%; color:#ff4d4d;">שגיאה בטעינת הנתונים מהשרת.</p>';
    }
}

// 4. הפונקציה שסוגרת את החלון
function closeEventsModal(event) {
    if(event) event.stopPropagation();
    document.getElementById('eventsModal').style.display = 'none';
}
