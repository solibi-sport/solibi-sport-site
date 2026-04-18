// 1. מזריק את העיצוב (CSS)
const modalStyle = document.createElement('style');
modalStyle.innerHTML = `
.modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(6, 12, 20, 0.55); z-index: 9999; justify-content: center; align-items: center; direction: rtl; animation: fadeIn 0.2s ease-out; }

.modal-box { background: #111926; color: #ffffff; width: 95%; max-width: 580px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); border: 1px solid #1f2d40; overflow: hidden; transform: scale(0.95); animation: scaleUp 0.2s ease-out forwards; display: flex; flex-direction: column; max-height: 85vh; will-change: transform; touch-action: none; position: relative; }

.modal-header { background: #0d131d; padding: 12px 15px; text-align: center; position: relative; border-bottom: 2px solid #7a9966; flex-shrink: 0; cursor: grab; user-select: none; touch-action: none; z-index: 10; }
.modal-header:active { cursor: grabbing; }
.modal-header h2 { margin: 0; font-size: 16px; font-weight: bold; color: #ffffff; pointer-events: none; }
.close-modal { position: absolute; top: 50%; transform: translateY(-50%); left: 15px; font-size: 20px; cursor: pointer; color: #7a9966; transition: 0.2s; pointer-events: auto; }
.close-modal:hover { color: #ffffff; }

.stats-container { padding: 10px 15px; flex-shrink: 0; background: #0f1620; border-bottom: 1px solid #1f2d40; }
.possession-labels { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; color: #fff; }
.possession-bar { display: flex; height: 6px; border-radius: 3px; overflow: hidden; background: #1f2d40; margin-bottom: 10px;}
.possession-home { background: #7a9966; height: 100%; transition: width 1s ease-out; }
.possession-away { background: #4a90e2; height: 100%; transition: width 1s ease-out; }

.extra-stats { display: flex; flex-direction: column; gap: 3px; }
.stat-row { display: flex; justify-content: space-between; align-items: center; font-size: 11px; background: rgba(255,255,255,0.015); padding: 4px 8px; border-radius: 4px; }
.stat-val { font-weight: bold; width: 35px; text-align: center; font-size: 12px; }
.home-val { color: #7a9966; }
.away-val { color: #4a90e2; }
.stat-name { flex-grow: 1; text-align: center; color: #a0aec0; }

#modalEventsContent { padding: 10px 15px; overflow-y: auto; flex-grow: 1; display: flex; gap: 15px; position: relative; z-index: 1; }
.team-col { flex: 1; background: rgba(255,255,255,0.01); border-radius: 6px; padding: 10px; border: 1px solid #1f2d40; }
.team-title { text-align: center; font-size: 13px; font-weight: bold; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #2a3b4c; color: #fff; }

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

// 2. מזריק את מסגרת ה-HTML ומוסיף את מנגנון הגרירה (Drag)
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

        // --- מנגנון הגרירה (Drag and Drop) המתוקן ---
        const header = document.querySelector('.modal-header');
        const box = document.querySelector('.modal-box');
        
        window.dragOffsetX = 0;
        window.dragOffsetY = 0;
        let isDragging = false;
        let startX, startY;

        function onDragStart(e) {
            if (e.target.closest('.close-modal')) return;
            isDragging = true;
            box.style.animation = 'none'; 
            
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            startX = clientX - window.dragOffsetX;
            startY = clientY - window.dragOffsetY;
        }

        function onDragMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            let targetX = clientX - startX;
            let targetY = clientY - startY;

            // --- חומת המגן: מונע מהחלון לברוח מחוץ למסך ---
            const boxRect = box.getBoundingClientRect();
            const vW = window.innerWidth;
            const vH = window.innerHeight;
            const mH = boxRect.height;
            const mW = boxRect.width;

            // חישוב המיקום המקורי (במרכז)
            const defaultTop = (vH - mH) / 2;
            const defaultLeft = (vW - mW) / 2;

            // גבולות גרירה (מבוסס על translate מהמרכז)
            // למעלה: אסור לכותרת לצאת בכלל
            const limitUpY = -defaultTop; 
            // למטה: משאיר חצי מהגובה במסך
            const limitDownY = vH - defaultTop - (mH / 2); 
            // ימינה/שמאלה: משאיר חצי מהרוחב במסך
            const limitX = (vW / 2); 

            // החלת הגבולות
            if (targetY < limitUpY) targetY = limitUpY;
            if (targetY > limitDownY) targetY = limitDownY;
            if (targetX > limitX) targetX = limitX;
            if (targetX < -limitX) targetX = -limitX;

            window.dragOffsetX = targetX;
            window.dragOffsetY = targetY;
            box.style.transform = `translate(${window.dragOffsetX}px, ${window.dragOffsetY}px)`;
        }

        function onDragEnd() {
            isDragging = false;
        }

        header.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove, { passive: false });
        document.addEventListener('mouseup', onDragEnd);

        header.addEventListener('touchstart', onDragStart, { passive: true });
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd);
    }
});

function getStatValue(statsArray, typeName) {
    const stat = statsArray.find(s => s.type === typeName);
    return (stat && stat.value !== null) ? stat.value : '0';
}

// 3. הפונקציה המרכזית לשאיבת הנתונים
async function openMatchEvents(fixtureId, paramHome, paramAway) {
    // מפענחים בחזרה את השמות כדי למנוע שבירה של גרשיים בדף הבית
    let homeTeam = paramHome;
    let awayTeam = paramAway;
    try { homeTeam = decodeURIComponent(paramHome); } catch(e) {}
    try { awayTeam = decodeURIComponent(paramAway); } catch(e) {}
    const modal = document.getElementById('eventsModal');
    const box = document.querySelector('.modal-box');
    const content = document.getElementById('modalEventsContent');
    const title = document.getElementById('modalMatchTitle');
    
    // מאפסים את המיקום והאנימציה כל פעם שפותחים חלון מחדש
    window.dragOffsetX = 0;
    window.dragOffsetY = 0;
    box.style.animation = 'none';
    box.offsetHeight; // Reset animation
    box.style.animation = 'scaleUp 0.2s ease-out forwards';
    box.style.transform = '';

    const existingStats = document.getElementById('modalStatsContainer');
    if (existingStats) existingStats.remove();

    modal.style.display = 'flex';
    title.innerText = `${translateName(homeTeam)} - ${translateName(awayTeam)}`;
    content.innerHTML = '<p style="text-align:center; width:100%; margin-top:20px; font-size:13px; color:#888;">טוען נתונים...</p>';
    content.style.display = 'block';

    try {
        const headers = {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': 'd580159a7d19ead2bc2054c8b57e6ee3' // <=== חובה להכניס את המפתח שלך!
        };

        const [eventsRes, statsRes] = await Promise.all([
            fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`, { headers }),
            fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`, { headers })
        ]);
        
        const eventsData = await eventsRes.json();
        const statsData = await statsRes.json();

        const events = eventsData.response || [];
        const stats = statsData.response || [];

        let homeStatsArray = stats.length > 0 ? stats[0].statistics : [];
        let awayStatsArray = stats.length > 1 ? stats[1].statistics : [];

        let homePoss = getStatValue(homeStatsArray, "Ball Possession");
        let awayPoss = getStatValue(awayStatsArray, "Ball Possession");
        if (homePoss === '0') homePoss = '50%';
        if (awayPoss === '0') awayPoss = '50%';

        let homeShotsOnGoal = getStatValue(homeStatsArray, "Shots on Goal");
        let awayShotsOnGoal = getStatValue(awayStatsArray, "Shots on Goal");
        let homeTotalShots = getStatValue(homeStatsArray, "Total Shots");
        let awayTotalShots = getStatValue(awayStatsArray, "Total Shots");
        let homeCorners = getStatValue(homeStatsArray, "Corner Kicks");
        let awayCorners = getStatValue(awayStatsArray, "Corner Kicks");
        let homeFouls = getStatValue(homeStatsArray, "Fouls");
        let awayFouls = getStatValue(awayStatsArray, "Fouls");

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
        
        if (stats.length > 0) {
            document.querySelector('.modal-header').insertAdjacentHTML('afterend', statsHTML);
        }

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
