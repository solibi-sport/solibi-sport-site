// 1. מזריק את העיצוב (CSS) - גרסה קומפקטית, נטולת טשטוש רקע, עם נתונים סטטיסטיים מתקדמים
const modalStyle = document.createElement('style');
modalStyle.innerHTML = `
/* הסרנו את ה-backdrop-filter והורדנו שקיפות כדי שיראו את האתר */
.modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(6, 12, 20, 0.55); z-index: 9999; justify-content: center; align-items: center; direction: rtl; animation: fadeIn 0.2s ease-out; }

/* הקטנו משמעותית את רוחב החלון מ-750 ל-580 */
.modal-box { background: #111926; color: #ffffff; width: 95%; max-width: 580px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); border: 1px solid #1f2d40; overflow: hidden; transform: scale(0.95); animation: scaleUp 0.2s ease-out forwards; display: flex; flex-direction: column; max-height: 85vh;}
.modal-header { background: #0d131d; padding: 12px 15px; text-align: center; position: relative; border-bottom: 2px solid #7a9966; flex-shrink: 0; }
.modal-header h2 { margin: 0; font-size: 16px; font-weight: bold; color: #ffffff; }
.close-modal { position: absolute; top: 50%; transform: translateY(-50%); left: 15px; font-size: 20px; cursor: pointer; color: #7a9966; transition: 0.2s; }
.close-modal:hover { color: #ffffff; }

/* אזור הסטטיסטיקות המורחב */
.stats-container { padding: 10px 15px; flex-shrink: 0; background: #0f1620; border-bottom: 1px solid #1f2d40; }
.possession-labels { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; color: #fff; }
.possession-bar { display: flex; height: 6px; border-radius: 3px; overflow: hidden; background: #1f2d40; margin-bottom: 10px;}
.possession-home { background: #7a9966; height: 100%; transition: width 1s ease-out; }
.possession-away { background: #4a90e2; height: 100%; transition: width 1s ease-out; }

/* עיצוב שורות הסטטיסטיקה הנוספות */
.extra-stats { display: flex; flex-direction: column; gap: 3px; }
.stat-row { display: flex; justify-content: space-between; align-items: center; font-size: 11px; background: rgba(255,255,255,0.015); padding: 4px 8px; border-radius: 4px; }
.stat-val { font-weight: bold; width: 35px; text-align: center; font-size: 12px; }
.home-val { color: #7a9966; }
.away-val { color: #4a90e2; }
.stat-name { flex-grow: 1; text-align: center; color: #a0aec0; }

/* פיצול האירועים ל-2 עמודות - הכל הוקטן וצומצם */
#modalEventsContent { padding: 10px 15px; overflow-y: auto; flex-grow: 1; display: flex; gap: 15px; }
.team-col { flex: 1; background: rgba(255,255,255,0.01); border-radius: 6px; padding: 10px; border: 1px solid #1f2d40; }
.team-title { text-align: center; font-size: 13px; font-weight: bold; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #2a3b4c; color: #fff; }

/* אירוע בודד מוקטן */
.event-item { display: flex; align-items: center; margin-bottom: 10px; font-size: 11px; line-height: 1.3; }
.event-home { justify-content: flex-start; text-align: right; } 
.event-away { justify-content: flex-end; text-align: left; flex-direction: row-reverse; }

.event-time { font-weight: bold; color: #7a9966; min-width: 25px; text-align: center; font-size: 11px; background: rgba(122, 153, 102, 0.1); padding: 2px 4px; border-radius: 3px; margin: 0 6px; }
.event-icon { font-size: 14px; margin: 0 4px; }
.event-text { color: #d1d5db; }
.event-subtext { color: #888; font-size: 9px; display: block; margin-top: 1px; }

::-webkit-scrollbar { width: 4px; }
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

// פונקציית עזר קטנה לשליפת נתון סטטיסטי
function getStatValue(statsArray, typeName) {
    const stat = statsArray.find(s => s.type === typeName);
    return (stat && stat.value !== null) ? stat.value : '0';
}

// 3. הפונקציה המרכזית
async function openMatchEvents(fixtureId, homeTeam, awayTeam) {
    const modal = document.getElementById('eventsModal');
    const content = document.getElementById('modalEventsContent');
    const title = document.getElementById('modalMatchTitle');
    
    // ניקוי פס הסטטיסטיקות הקודם אם קיים
    const existingStats = document.getElementById('modalStatsContainer');
    if (existingStats) existingStats.remove();

    modal.style.display = 'flex';
    title.innerText = `${translateName(homeTeam)} - ${translateName(awayTeam)}`;
    content.innerHTML = '<p style="text-align:center; width:100%; margin-top:20px; font-size:13px; color:#888;">טוען נתונים...</p>';
    content.style.display = 'block';

    try {
        const headers = {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': 'd580159a7d19ead2bc2054c8b57e6ee3' // <=== חובה להכניס את מפתח ה-API שלך פה
        };

        const [eventsRes, statsRes] = await Promise.all([
            fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`, { headers }),
            fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`, { headers })
        ]);
        
        const eventsData = await eventsRes.json();
        const statsData = await statsRes.json();

        const events = eventsData.response || [];
        const stats = statsData.response || [];

        // --- שאיבת נתונים סטטיסטיים לשתי הקבוצות ---
        let homeStatsArray = stats.length > 0 ? stats[0].statistics : [];
        let awayStatsArray = stats.length > 1 ? stats[1].statistics : [];

        // שליטה בכדור
        let homePoss = getStatValue(homeStatsArray, "Ball Possession");
        let awayPoss = getStatValue(awayStatsArray, "Ball Possession");
        if (homePoss === '0') homePoss = '50%';
        if (awayPoss === '0') awayPoss = '50%';

        // סטטיסטיקות נוספות
        let homeShotsOnGoal = getStatValue(homeStatsArray, "Shots on Goal");
        let awayShotsOnGoal = getStatValue(awayStatsArray, "Shots on Goal");
        let homeTotalShots = getStatValue(homeStatsArray, "Total Shots");
        let awayTotalShots = getStatValue(awayStatsArray, "Total Shots");
        let homeCorners = getStatValue(homeStatsArray, "Corner Kicks");
        let awayCorners = getStatValue(awayStatsArray, "Corner Kicks");
        let homeFouls = getStatValue(homeStatsArray, "Fouls");
        let awayFouls = getStatValue(awayStatsArray, "Fouls");

        // בניית אזור הסטטיסטיקה החדש
        const statsHTML = `
        <div id="modalStatsContainer" class="stats-container">
            <div style="text-align: center; font-size: 11px; color: #8fa0b3; margin-bottom: 5px;">שליטה בכדור</div>
            <div class="possession-labels">
                <span>${translateName(homeTeam)} (${homePoss})</span>
                <span>${translateName(awayTeam)} (${awayPoss})</span>
            </div>
            <div class="possession-bar">
                <div class="possession-home" style="width: ${homePoss}"></div>
                <div class="possession-away" style="width: ${awayPoss}"></div>
            </div>
            
            <div class="extra-stats">
                <div class="stat-row">
                    <span class="stat-val home-val">${homeShotsOnGoal}</span>
                    <span class="stat-name">בעיטות למסגרת</span>
                    <span class="stat-val away-val">${awayShotsOnGoal}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-val home-val">${homeTotalShots}</span>
                    <span class="stat-name">סה"כ בעיטות</span>
                    <span class="stat-val away-val">${awayTotalShots}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-val home-val">${homeCorners}</span>
                    <span class="stat-name">קרנות</span>
                    <span class="stat-val away-val">${awayCorners}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-val home-val">${homeFouls}</span>
                    <span class="stat-name">עבירות</span>
                    <span class="stat-val away-val">${awayFouls}</span>
                </div>
            </div>
        </div>`;
        
        // הוספת הסטטיסטיקה לחלון
        if (stats.length > 0) {
            document.querySelector('.modal-header').insertAdjacentHTML('afterend', statsHTML);
        }

        // --- עיבוד אירועי המשחק ---
        content.style.display = 'flex'; 
        if (events.length === 0) {
            content.innerHTML = '<p style="text-align:center; width:100%; font-size:12px;">אין אירועים להצגה.</p>';
            return;
        }

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
                return; 
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

            if (isHome) homeHtml += eventMarkup;
            else awayHtml += eventMarkup;
        });

        homeHtml += '</div>';
        awayHtml += '</div>';

        content.innerHTML = homeHtml + awayHtml;

    } catch (error) {
        console.error(error);
        content.innerHTML = '<p style="text-align:center; width:100%; color:#ff4d4d; font-size:12px;">שגיאה בטעינת הנתונים.</p>';
    }
}

// 4. סגירת החלון
function closeEventsModal(event) {
    if(event) event.stopPropagation();
    document.getElementById('eventsModal').style.display = 'none';
}
