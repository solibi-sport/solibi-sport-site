// 1. מזריק את העיצוב (CSS)
if (!document.getElementById('modal-style-events')) {
    const modalStyle = document.createElement('style');
    modalStyle.id = 'modal-style-events';
    modalStyle.innerHTML = `
    .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(6, 12, 20, 0.65); z-index: 9999; justify-content: center; align-items: center; direction: rtl; animation: fadeIn 0.2s ease-out; }
    
    .modal-box { background: #111926; color: #ffffff; width: 95%; max-width: 500px; border-radius: 12px; box-shadow: 0 15px 40px rgba(0,0,0,0.9); border: 1px solid #1f2d40; overflow: hidden; transform: scale(0.95); animation: scaleUp 0.2s ease-out forwards; display: flex; flex-direction: column; max-height: 65vh; will-change: transform; touch-action: none; position: relative; }
    
    .modal-header { background: #0d131d; padding: 12px 15px; text-align: center; position: relative; flex-shrink: 0; cursor: grab; user-select: none; touch-action: none; z-index: 10; border-bottom: 1px solid #1f2d40; }
    .modal-header:active { cursor: grabbing; }
    .modal-header h2 { margin: 0; font-size: 14px; font-weight: bold; color: #8fa0b3; pointer-events: none; letter-spacing: 0.5px;}
    .close-modal { position: absolute; top: 50%; transform: translateY(-50%); left: 15px; font-size: 20px; cursor: pointer; color: #7a9966; transition: 0.2s; pointer-events: auto; }
    .close-modal:hover { color: #ffffff; }

    @keyframes bannerGoalPulse { 0% { box-shadow: inset 0 0 10px rgba(122,153,102,0.2); } 100% { box-shadow: inset 0 0 40px rgba(122,153,102,0.9); } }
    @keyframes textGoalPop { 0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; } 100% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; } }

    .score-banner { display: flex; justify-content: space-between; align-items: center; background: radial-gradient(circle at center, #1e4266 0%, #112845 100%); padding: 20px 15px; border-bottom: 2px solid #7a9966; color: #fff; flex-shrink: 0; position: relative; z-index: 5; transition: box-shadow 0.3s; }
    .score-banner.goal-active { animation: bannerGoalPulse 0.8s infinite alternate; }

    .modal-goal-flash { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 50px; font-weight: 900; color: rgba(255,255,255,0.95); text-shadow: 0 0 20px #7a9966, 0 0 40px #7a9966; pointer-events: none; z-index: 20; animation: textGoalPop 0.8s infinite alternate; }

    .score-team { font-size: 15px; font-weight: 900; flex: 1; text-align: center; text-shadow: 0 2px 4px rgba(0,0,0,0.5); line-height: 1.2; position: relative; z-index: 2;}
    .score-box { display: flex; align-items: center; gap: 12px; background: #060c14; padding: 8px 20px; border-radius: 12px; border: 1px solid rgba(122, 153, 102, 0.4); position: relative; box-shadow: inset 0 3px 10px rgba(0,0,0,0.6); margin: 0 10px; z-index: 2;}
    .score-val { font-size: 26px; font-weight: 900; color: #ffffff; line-height: 1; }
    .score-divider { font-size: 18px; color: #7a9966; font-weight: bold; line-height: 1; transform: translateY(-2px); }
    .score-minute { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #7a9966; color: #111926; font-size: 11px; font-weight: 900; padding: 2px 10px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.5); white-space: nowrap; border: 1px solid #fff; }

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
    
    #modalEventsContent { padding: 10px 15px; overflow-y: auto; flex-grow: 1; display: flex; gap: 15px; position: relative; z-index: 1; align-items: stretch; }
    .team-col { flex: 1; background: rgba(255,255,255,0.01); border-radius: 6px; padding: 10px; border: 1px solid #1f2d40; min-height: max-content;}
    .team-title { text-align: center; font-size: 13px; font-weight: bold; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #2a3b4c; color: #fff; }
    
    .event-item { display: flex; align-items: center; margin-bottom: 10px; font-size: 11px; line-height: 1.3; }
    .event-home { justify-content: flex-start; text-align: right; } 
    .event-away { justify-content: flex-end; text-align: left; flex-direction: row-reverse; }
    
    .event-time { font-weight: bold; color: #7a9966; min-width: 25px; text-align: center; font-size: 11px; background: rgba(122, 153, 102, 0.1); padding: 2px 4px; border-radius: 3px; margin: 0 6px; }
    .event-icon { font-size: 14px; margin: 0 4px; }
    .event-text { color: #d1d5db; }
    .event-subtext { color: #888; font-size: 9px; display: block; margin-top: 1px; }

    /* תוספת עבור שערים פסולים */
    .event-text.var-cancelled { color: #ef4444; text-decoration: line-through; opacity: 0.8; }
    .event-subtext.var-cancelled-sub { color: #ef4444; text-decoration: none; font-weight: bold; font-size: 10px; display: block; margin-top: 2px; }
    
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #2a3b4c; border-radius: 10px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.9); } to { transform: scale(1); } }
    `;
    document.head.appendChild(modalStyle);
}

function getStatValue(statsArray, typeName) {
    const stat = statsArray.find(s => s.type === typeName);
    return (stat && stat.value !== null) ? stat.value : '0';
}

let modalRefreshTimer = null;

function closeEventsModal(event) {
    if(event) event.stopPropagation();
    const modal = document.getElementById('eventsModal');
    if (modal) modal.style.display = 'none';
    
    if (modalRefreshTimer) {
        clearInterval(modalRefreshTimer);
        modalRefreshTimer = null;
    }
}

async function openMatchEvents(fixtureId, paramHome, paramAway) {
    let homeTeam = paramHome;
    let awayTeam = paramAway;
    try { homeTeam = decodeURIComponent(paramHome); } catch(e) {}
    try { awayTeam = decodeURIComponent(paramAway); } catch(e) {}

    if (!document.getElementById('eventsModal')) {
        const modalHTML = `
        <div id="eventsModal" class="modal-overlay">
            <div class="modal-box">
                <div class="modal-header">
                    <span class="close-modal" onclick="closeEventsModal(event)">✖</span>
                    <h2 id="modalMatchTitle">זירת משחק</h2>
                </div>
                <div id="modalEventsContent"></div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

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

            const boxRect = box.getBoundingClientRect();
            const vW = window.innerWidth;
            const vH = window.innerHeight;
            const mH = boxRect.height;
            const mW = boxRect.width;

            const defaultTop = (vH - mH) / 2;
            const limitUpY = -defaultTop; 
            const limitDownY = vH - defaultTop - (mH / 2); 
            const limitX = (vW / 2); 

            if (targetY < limitUpY) targetY = limitUpY;
            if (targetY > limitDownY) targetY = limitDownY;
            if (targetX > limitX) targetX = limitX;
            if (targetX < -limitX) targetX = -limitX;

            window.dragOffsetX = targetX;
            window.dragOffsetY = targetY;
            box.style.transform = `translate(${window.dragOffsetX}px, ${window.dragOffsetY}px)`;
        }

        function onDragEnd() { isDragging = false; }

        header.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove, { passive: false });
        document.addEventListener('mouseup', onDragEnd);
        header.addEventListener('touchstart', onDragStart, { passive: true });
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd);
    }

    const modal = document.getElementById('eventsModal');
    const box = document.querySelector('.modal-box');
    const content = document.getElementById('modalEventsContent');
    
    window.dragOffsetX = 0;
    window.dragOffsetY = 0;
    box.style.animation = 'none';
    box.offsetHeight; 
    box.style.animation = 'scaleUp 0.2s ease-out forwards';
    box.style.transform = '';

    modal.style.display = 'flex';
    
    const tHome = typeof window.translateName === 'function' ? window.translateName(homeTeam) : homeTeam;
    const tAway = typeof window.translateName === 'function' ? window.translateName(awayTeam) : awayTeam;

    if (modalRefreshTimer) {
        clearInterval(modalRefreshTimer);
        modalRefreshTimer = null;
    }

    async function updateModalData(isInitialLoad) {
        if (isInitialLoad) {
            const existingStats = document.getElementById('modalStatsContainer');
            if (existingStats) existingStats.remove();
            const existingScore = document.getElementById('modalScoreBanner');
            if (existingScore) existingScore.remove();
            content.innerHTML = '<p style="text-align:center; width:100%; margin-top:20px; font-size:13px; color:#888;">טוען נתונים...</p>';
            content.style.display = 'flex'; 
        }

        try {
            const headers = { 'x-apisports-key': 'd580159a7d19ead2bc2054c8b57e6ee3' };

            const [eventsRes, statsRes, fixtureRes] = await Promise.all([
                fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`, { headers }),
                fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`, { headers }),
                fetch(`https://v3.football.api-sports.io/fixtures?id=${fixtureId}`, { headers })
            ]);
            
            const eventsData = await eventsRes.json();
            const statsData = await statsRes.json();
            const fixtureData = await fixtureRes.json();

            let goalsHome = '-';
            let goalsAway = '-';
            let matchStatus = '';
            let shortStatus = '';
            
            if (fixtureData && fixtureData.response && fixtureData.response.length > 0) {
                const info = fixtureData.response[0];
                goalsHome = info.goals.home !== null ? info.goals.home : '-';
                goalsAway = info.goals.away !== null ? info.goals.away : '-';
                
                shortStatus = info.fixture.status.short;
                if (['FT', 'AET', 'PEN'].includes(shortStatus)) {
                    matchStatus = 'הסתיים';
                } else if (shortStatus === 'HT') {
                    matchStatus = 'מחצית';
                } else if (info.fixture.status.elapsed) {
                    matchStatus = `${info.fixture.status.elapsed}'`;
                } else {
                    matchStatus = 'לא התחיל';
                }
            }

            let isGoalRecent = false;
            if (window.matchGoalTracker && window.matchGoalTracker[fixtureId] && (Date.now() - window.matchGoalTracker[fixtureId].goalTime < 15000)) {
                isGoalRecent = true;
            }
            if (window.leagueGoalTracker && window.leagueGoalTracker[fixtureId] && (Date.now() - window.leagueGoalTracker[fixtureId].goalTime < 15000)) {
                isGoalRecent = true;
            }

            const scoreHTML = `
            <div id="modalScoreBanner" class="score-banner ${isGoalRecent ? 'goal-active' : ''}">
                ${isGoalRecent ? '<div class="modal-goal-flash">שער!</div>' : ''}
                <div class="score-team home">${tHome}</div>
                <div class="score-box">
                    <span class="score-val">${goalsHome}</span>
                    <span class="score-divider">-</span>
                    <span class="score-val">${goalsAway}</span>
                    <div class="score-minute">${matchStatus}</div>
                </div>
                <div class="score-team away">${tAway}</div>
            </div>`;

            let events = eventsData.response || [];
            const stats = statsData.response || [];

            let homeStatsArray = stats.length > 0 ? stats[0].statistics : [];
            let awayStatsArray = stats.length > 1 ? stats[1].statistics : [];

            let homePoss = getStatValue(homeStatsArray, "Ball Possession");
            let awayPoss = getStatValue(awayStatsArray, "Ball Possession");
            if (homePoss === '0' || !homePoss) homePoss = '50%';
            if (awayPoss === '0' || !awayPoss) awayPoss = '50%';

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
                    <span>${tHome} (${homePoss})</span>
                    <span>${tAway} (${awayPoss})</span>
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
            
            const oldStats = document.getElementById('modalStatsContainer');
            if (oldStats) oldStats.remove();
            const oldScore = document.getElementById('modalScoreBanner');
            if (oldScore) oldScore.remove();

            document.querySelector('.modal-header').insertAdjacentHTML('afterend', scoreHTML);
            document.getElementById('modalScoreBanner').insertAdjacentHTML('afterend', statsHTML);

            let eventsHtml = '';
            if (events.length === 0) {
                eventsHtml = '<p style="text-align:center; width:100%; font-size:12px;">אין אירועים להצגה.</p>';
            } else {
                
                // קודם כל נמיין את האירועים לפי זמן
                events.sort((a, b) => a.time.elapsed - b.time.elapsed);

                // === המוח החדש לטיפול ב-VAR ===
                const cancelledGoalIndices = new Set();
                events.forEach((e, idx) => {
                    const detailLower = e.detail ? e.detail.toLowerCase() : '';
                    if (e.type === 'Var' && (detailLower.includes('cancel') || detailLower.includes('disallow'))) {
                        // אם יש פסילת VAR, הולכים אחורה לחפש את השער האחרון של אותו שחקן
                        for (let i = idx - 1; i >= 0; i--) {
                            const prevE = events[i];
                            if (prevE.type === 'Goal' && prevE.player.name === e.player.name) {
                                cancelledGoalIndices.add(i);
                                break;
                            }
                        }
                    }
                });

                let homeHtml = `<div class="team-col"><div class="team-title">${tHome}</div>`;
                let awayHtml = `<div class="team-col"><div class="team-title">${tAway}</div>`;

                events.forEach((event, index) => {
                    // מדלגים על הצגת האירוע של הפסילה עצמה (כי נציג את זה על השער המקורי)
                    const detailLower = event.detail ? event.detail.toLowerCase() : '';
                    if (event.type === 'Var' && (detailLower.includes('cancel') || detailLower.includes('disallow'))) return;

                    let time = event.time.elapsed + (event.time.extra ? `+${event.time.extra}` : '');
                    let playerName = typeof window.translateName === 'function' ? window.translateName(event.player.name) : event.player.name;
                    let assistName = event.assist.name ? (typeof window.translateName === 'function' ? window.translateName(event.assist.name) : event.assist.name) : null;
                    
                    let icon = '';
                    let mainText = '';
                    let subText = '';
                    let isCancelled = cancelledGoalIndices.has(index);

                    // טיפול בשערים
                    if (event.type === 'Goal') {
                        if (event.detail === 'Penalty') {
                            icon = '⚽';
                            mainText = `שער! ${playerName} (פ')`;
                        } else if (event.detail === 'Own Goal') {
                            icon = '⚽';
                            mainText = `שער עצמי! ${playerName}`;
                        } else if (event.detail === 'Missed Penalty') {
                            icon = '❌';
                            mainText = `החמצת פנדל! ${playerName}`;
                        } else {
                            icon = '⚽';
                            mainText = `שער! ${playerName}`;
                        }

                        if (assistName && !isCancelled && event.detail !== 'Missed Penalty') {
                            subText = `בישול: ${assistName}`;
                        }
                    } 
                    // טיפול בכרטיסים
                    else if (event.type === 'Card') {
                        if (event.detail === 'Yellow Card') {
                            icon = '🟨';
                            mainText = playerName;
                            subText = 'כרטיס צהוב';
                        } else if (event.detail.includes('Red') || event.detail.includes('Second Yellow')) {
                            icon = '🟥';
                            mainText = playerName;
                            subText = 'כרטיס אדום';
                        } else {
                            return; // אם זה כרטיס לא מוכר
                        }
                    } 
                    // טיפול בחילופים
                    else if (event.type === 'subst') {
                        icon = '🔄';
                        mainText = `${playerName} (נכנס)`;
                        subText = `${assistName} (יצא)`;
                    } 
                    else {
                        return; 
                    }

                    const isHome = event.team.name === homeTeam;
                    
                    // מחיל עיצוב מיוחד אם השער בוטל ע"י ה-VAR
                    const textClass = isCancelled ? 'event-text var-cancelled' : 'event-text';
                    const cancelledMarkup = isCancelled ? `<span class="event-subtext var-cancelled-sub">❌ נפסל ע"י VAR</span>` : '';

                    const eventMarkup = `
                        <div class="event-item ${isHome ? 'event-home' : 'event-away'}">
                            <span class="event-time">${time}'</span>
                            <span class="event-icon">${icon}</span>
                            <div class="${textClass}">
                                <strong>${mainText}</strong>
                                ${subText ? `<span class="event-subtext">${subText}</span>` : ''}
                                ${cancelledMarkup}
                            </div>
                        </div>
                    `;

                    if (isHome) homeHtml += eventMarkup;
                    else awayHtml += eventMarkup;
                });

                homeHtml += '</div>';
                awayHtml += '</div>';
                eventsHtml = homeHtml + awayHtml;
            }

            content.innerHTML = eventsHtml;

            if (['FT', 'AET', 'PEN'].includes(shortStatus)) {
                if (modalRefreshTimer) {
                    clearInterval(modalRefreshTimer);
                    modalRefreshTimer = null;
                }
            }

        } catch (error) {
            console.error(error);
            if (isInitialLoad) {
                content.innerHTML = '<p style="text-align:center; width:100%; color:#ff4d4d; font-size:12px;">שגיאה בטעינת הנתונים.</p>';
            }
        }
    }

    await updateModalData(true);
    modalRefreshTimer = setInterval(() => updateModalData(false), 60000);
}
