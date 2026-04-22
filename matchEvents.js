// 1. מזריק את העיצוב (CSS)
if (!document.getElementById('modal-style-events')) {
    const modalStyle = document.createElement('style');
    modalStyle.id = 'modal-style-events';
    modalStyle.innerHTML = `
    .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(6, 12, 20, 0.75); z-index: 9999; justify-content: center; align-items: center; direction: rtl; animation: fadeIn 0.2s ease-out; backdrop-filter: blur(3px); }
    
    .modal-box { background: #111926; color: #ffffff; width: 95%; max-width: 500px; border-radius: 12px; box-shadow: 0 15px 50px rgba(0,0,0,0.9); border: 1px solid #2a3b4c; overflow: hidden; transform: scale(0.95); animation: scaleUp 0.2s ease-out forwards; display: flex; flex-direction: column; max-height: 75vh; will-change: transform; touch-action: none; position: relative; }
    
    .modal-header { background: #0d131d; padding: 12px 15px; text-align: center; position: relative; flex-shrink: 0; cursor: grab; user-select: none; touch-action: none; z-index: 10; border-bottom: 1px solid #1f2d40; }
    .modal-header:active { cursor: grabbing; }
    .modal-header h2 { margin: 0; font-size: 14px; font-weight: bold; color: #8fa0b3; pointer-events: none; letter-spacing: 0.5px;}
    .close-modal { position: absolute; top: 50%; transform: translateY(-50%); left: 15px; font-size: 20px; cursor: pointer; color: #7a9966; transition: 0.2s; pointer-events: auto; }
    .close-modal:hover { color: #ffffff; }

    @keyframes bannerGoalPulse { 0% { box-shadow: inset 0 0 10px rgba(122,153,102,0.2); } 100% { box-shadow: inset 0 0 40px rgba(122,153,102,0.9); } }
    @keyframes textGoalPop { 0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; } 100% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; } }

    .score-banner { display: flex; justify-content: space-between; align-items: center; background: radial-gradient(circle at center, #1e4266 0%, #112845 100%); padding: 15px; border-bottom: 2px solid #7a9966; color: #fff; flex-shrink: 0; position: relative; z-index: 5; transition: box-shadow 0.3s; }
    .score-banner.goal-active { animation: bannerGoalPulse 0.8s infinite alternate; }

    .modal-goal-flash { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 50px; font-weight: 900; color: rgba(255,255,255,0.95); text-shadow: 0 0 20px #7a9966, 0 0 40px #7a9966; pointer-events: none; z-index: 20; animation: textGoalPop 0.8s infinite alternate; }

    .score-team { font-size: 15px; font-weight: 900; flex: 1; text-align: center; text-shadow: 0 2px 4px rgba(0,0,0,0.5); line-height: 1.2; position: relative; z-index: 2;}
    .score-box { display: flex; align-items: center; gap: 12px; background: #060c14; padding: 8px 20px; border-radius: 12px; border: 1px solid rgba(122, 153, 102, 0.4); position: relative; box-shadow: inset 0 3px 10px rgba(0,0,0,0.6); margin: 0 10px; z-index: 2;}
    .score-val { font-size: 26px; font-weight: 900; color: #ffffff; line-height: 1; }
    .score-divider { font-size: 18px; color: #7a9966; font-weight: bold; line-height: 1; transform: translateY(-2px); }
    .score-minute { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #7a9966; color: #111926; font-size: 11px; font-weight: 900; padding: 2px 10px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.5); white-space: nowrap; border: 1px solid #fff; }

    /* עיצוב הלשוניות */
    .modal-tabs { display: flex; justify-content: space-between; background: #0d131d; border-bottom: 1px solid #1f2d40; flex-shrink: 0; }
    .modal-tab-btn { flex: 1; background: transparent; border: none; color: #8fa0b3; padding: 12px 0; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; border-bottom: 3px solid transparent; font-family: inherit; outline: none; }
    .modal-tab-btn.active { color: #7a9966; border-bottom: 3px solid #7a9966; background: rgba(255,255,255,0.02); }
    .modal-tab-btn:hover { color: #ffffff; }

    .tab-content { display: none; flex-direction: column; overflow-y: auto; flex-grow: 1; }
    .tab-content.active { display: flex; }

    /* --- עיצוב מגרש פרימיום --- */
    .pitch-wrapper { 
        background: repeating-linear-gradient(90deg, #1f4f33, #1f4f33 10%, #24583a 10%, #24583a 20%);
        border: 2px solid rgba(255,255,255,0.6); 
        border-radius: 8px; 
        position: relative; 
        height: 380px; 
        width: 100%; 
        margin: 15px 0; 
        overflow: hidden; 
        display: flex; 
        box-shadow: inset 0 0 40px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.5); 
    }
    .pitch-line-center { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.5); transform: translateX(-50%); z-index: 1;}
    .pitch-circle { position: absolute; left: 50%; top: 50%; width: 80px; height: 80px; border: 2px solid rgba(255,255,255,0.5); border-radius: 50%; transform: translate(-50%, -50%); z-index: 1;}
    .pitch-box-left { position: absolute; left: -2px; top: 20%; height: 60%; width: 15%; border: 2px solid rgba(255,255,255,0.5); border-left: none; z-index: 1;}
    .pitch-box-right { position: absolute; right: -2px; top: 20%; height: 60%; width: 15%; border: 2px solid rgba(255,255,255,0.5); border-right: none; z-index: 1;}
    
    .pitch-team { flex: 1; position: relative; }
    .pitch-player { position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; width: 60px; z-index: 3; transition: 0.3s ease; }
    .pitch-player-num { border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; border: 2px solid #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.7); z-index: 4;}
    .pitch-player-name { color: #fff; font-size: 9px; background: rgba(0,0,0,0.8); padding: 3px 6px; border-radius: 4px; margin-top: -3px; white-space: nowrap; text-align: center; text-shadow: 0 1px 2px rgba(0,0,0,0.9); z-index: 3; border: 1px solid rgba(255,255,255,0.15);}
    
    /* תווית חילוף מתחת לשחקן */
    .pitch-player-sub { color: #ffffff; font-size: 8px; font-weight: bold; background: linear-gradient(135deg, #064e3b 0%, #047857 100%); padding: 3px 5px; border-radius: 4px; margin-top: 3px; white-space: nowrap; border: 1px solid #34d399; box-shadow: 0 2px 5px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 3px; z-index: 5; text-shadow: 0 1px 1px rgba(0,0,0,0.5); }

    /* עיצוב טבלה מיני */
    .modal-mini-table { width: 100%; border-collapse: collapse; font-size: 11px; text-align: center; margin-top: 5px; }
    .modal-mini-table th { color: #8fa0b3; font-weight: normal; padding: 6px; border-bottom: 1px solid #1f2d40; }
    .modal-mini-table td { padding: 8px 6px; border-bottom: 1px solid rgba(255,255,255,0.03); }
    .modal-mini-table tr.highlight { background: rgba(122,153,102,0.15); font-weight: bold; }
    .modal-mini-table td .team-name-text { display: flex; align-items: center; vertical-align: middle; }
    .modal-mini-table td .team-logo { width: 14px; height: 14px; margin-left: 5px; }
    .modal-mini-table td .live-dot { color: #ef4444; font-size: 9px; animation: blink 1.5s infinite; margin-right: 6px; vertical-align: middle; }

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
    
    .events-wrapper { padding: 10px 15px; display: flex; gap: 15px; align-items: stretch; }
    .team-col { flex: 1; background: rgba(255,255,255,0.01); border-radius: 6px; padding: 10px; border: 1px solid #1f2d40; min-height: max-content;}
    .team-title { text-align: center; font-size: 13px; font-weight: bold; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #2a3b4c; color: #fff; }
    
    .event-item { display: flex; align-items: center; margin-bottom: 10px; font-size: 11px; line-height: 1.3; }
    .event-home { justify-content: flex-start; text-align: right; } 
    .event-away { justify-content: flex-end; text-align: left; flex-direction: row-reverse; }
    
    .event-time { font-weight: bold; color: #7a9966; min-width: 25px; text-align: center; font-size: 11px; background: rgba(122, 153, 102, 0.1); padding: 2px 4px; border-radius: 3px; margin: 0 6px; }
    .event-icon { font-size: 14px; margin: 0 4px; }
    .event-text { color: #d1d5db; }
    .event-subtext { color: #888; font-size: 9px; display: block; margin-top: 1px; }
    .event-text.var-cancelled { color: #ef4444; text-decoration: line-through; opacity: 0.8; }
    .event-subtext.var-cancelled-sub { color: #ef4444; text-decoration: none; font-weight: bold; font-size: 10px; display: block; margin-top: 2px; }
    
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #2a3b4c; border-radius: 10px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.9); } to { transform: scale(1); } }
    @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
    `;
    document.head.appendChild(modalStyle);
}

// פונקציה גלובלית להחלפת לשוניות
window.switchModalTab = function(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    btn.classList.add('active');
};

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
                <div id="modalDynamicArea" style="display:flex; flex-direction:column; flex-grow:1; overflow:hidden;"></div>
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
            const limitUpY = -((vH - mH) / 2); 
            const limitDownY = vH - ((vH - mH) / 2) - (mH / 2); 
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
    const dynamicArea = document.getElementById('modalDynamicArea');
    
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
            dynamicArea.innerHTML = '<p style="text-align:center; width:100%; margin-top:30px; font-size:13px; color:#888;">טוען נתונים...</p>';
        }

        try {
            const headers = { 'x-apisports-key': 'd580159a7d19ead2bc2054c8b57e6ee3' };

            const [eventsRes, statsRes, fixtureRes, lineupsRes] = await Promise.all([
                fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`, { headers }),
                fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`, { headers }),
                fetch(`https://v3.football.api-sports.io/fixtures?id=${fixtureId}`, { headers }),
                fetch(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${fixtureId}`, { headers })
            ]);
            
            const eventsData = await eventsRes.json();
            const statsData = await statsRes.json();
            const fixtureData = await fixtureRes.json();
            const lineupsData = await lineupsRes.json();

            let goalsHome = '-';
            let goalsAway = '-';
            let matchStatus = '';
            let shortStatus = '';
            let homeId = 0, awayId = 0, leagueId = 0, season = 0;
            
            if (fixtureData && fixtureData.response && fixtureData.response.length > 0) {
                const info = fixtureData.response[0];
                homeId = info.teams.home.id;
                awayId = info.teams.away.id;
                leagueId = info.league.id;
                season = info.league.season;
                goalsHome = info.goals.home !== null ? info.goals.home : '-';
                goalsAway = info.goals.away !== null ? info.goals.away : '-';
                shortStatus = info.fixture.status.short;

                if (['FT', 'AET', 'PEN'].includes(shortStatus)) matchStatus = 'הסתיים';
                else if (shortStatus === 'HT') matchStatus = 'מחצית';
                else if (info.fixture.status.elapsed) matchStatus = `${info.fixture.status.elapsed}'`;
                else matchStatus = 'לא התחיל';
            }

            const [h2hRes, standingsRes] = await Promise.all([
                fetch(`https://v3.football.api-sports.io/fixtures/headtohead?h2h=${homeId}-${awayId}&last=5`, { headers }),
                fetch(`https://v3.football.api-sports.io/standings?league=${leagueId}&season=${season}`, { headers })
            ]);
            const h2hData = await h2hRes.json();
            const stdData = await standingsRes.json();

            let isGoalRecent = false;
            if (window.matchGoalTracker && window.matchGoalTracker[fixtureId] && (Date.now() - window.matchGoalTracker[fixtureId].goalTime < 15000)) isGoalRecent = true;
            if (window.leagueGoalTracker && window.leagueGoalTracker[fixtureId] && (Date.now() - window.leagueGoalTracker[fixtureId].goalTime < 15000)) isGoalRecent = true;

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

            const tabsHTML = `
            <div class="modal-tabs">
                <button class="modal-tab-btn active" onclick="switchModalTab('stats', this)">אירועים וסטט'</button>
                <button class="modal-tab-btn" onclick="switchModalTab('lineups', this)">הרכבים</button>
                <button class="modal-tab-btn" onclick="switchModalTab('standings', this)">טבלה</button>
                <button class="modal-tab-btn" onclick="switchModalTab('h2h', this)">ראש בראש</button>
            </div>`;

            let events = eventsData.response || [];

            /* ------ יצירת תוכן ללשונית הרכבים (פרימיום!) ------ */
            let lineupsHtml = '<div style="padding:20px; text-align:center; font-size:12px;">אין נתוני הרכבים עדיין</div>';
            if (lineupsData.response && lineupsData.response.length === 2) {
                const hL = lineupsData.response.find(r => r.team.id === homeId) || lineupsData.response[0];
                const aL = lineupsData.response.find(r => r.team.id === awayId) || lineupsData.response[1];
                
                const renderPlayers = (players, isHome) => {
                    let rows = {};
                    players.forEach(p => {
                        let grid = p.player.grid || '1:1';
                        let [row, col] = grid.split(':').map(Number);
                        if (!row) row = 1;
                        if (!rows[row]) rows[row] = [];
                        rows[row].push({ ...p, originalCol: col || 1 });
                    });

                    let html = '';
                    Object.keys(rows).forEach(r => {
                        let rowPlayers = rows[r];
                        let rowNum = parseInt(r);
                        let rowCount = rowPlayers.length;

                        rowPlayers.sort((a, b) => a.originalCol - b.originalCol);

                        rowPlayers.forEach((p, index) => {
                            let colNum = index + 1; 
                            let left, top;

                            if (isHome) {
                                // קבוצת ימין: שוער בימין
                                left = 85 - ((rowNum - 1) * 16);
                            } else {
                                // קבוצת שמאל: שוער בשמאל
                                left = 15 + ((rowNum - 1) * 16);
                            }
                            
                            top = (100 / (rowCount + 1)) * colNum;
                            
                            let bgColor = isHome ? (hL.team.colors?.player?.primary || 'ffffff') : (aL.team.colors?.player?.primary || '000000');
                            if (bgColor && !bgColor.startsWith('#')) bgColor = '#' + bgColor;
                            
                            let textColor = isHome ? (hL.team.colors?.player?.number || '000000') : (aL.team.colors?.player?.number || 'ffffff');
                            if (textColor && !textColor.startsWith('#')) textColor = '#' + textColor;
                            
                            let name = typeof window.translateName === 'function' ? window.translateName(p.player.name) : p.player.name;
                            
                            // חיפוש חילופים עבור שחקן זה!
                            let teamIdForEvent = isHome ? homeId : awayId;
                            let subEvent = events.find(e => e.type.toLowerCase() === 'subst' && e.team.id === teamIdForEvent && e.player.name === p.player.name);
                            
                            let subHtml = '';
                            if (subEvent) {
                                let subInName = typeof window.translateName === 'function' ? window.translateName(subEvent.assist.name) : subEvent.assist.name;
                                let subTime = subEvent.time.elapsed;
                                subHtml = `<div class="pitch-player-sub">🔃 ${subInName} (${subTime}')</div>`;
                            }
                            
                            html += `<div class="pitch-player" style="left: ${left}%; top: ${top}%;">
                                <div class="pitch-player-num" style="background: ${bgColor}; color: ${textColor};">${p.player.number}</div>
                                <div class="pitch-player-name">${name}</div>
                                ${subHtml}
                            </div>`;
                        });
                    });
                    return html;
                };

                lineupsHtml = `
                <div style="padding: 10px 15px;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:bold; margin-bottom:5px; color:#a0aec0;">
                        <span>מערך: ${hL.formation || '?'}</span>
                        <span>מערך: ${aL.formation || '?'}</span>
                    </div>
                    <div class="pitch-wrapper">
                        <div class="pitch-box-left"></div>
                        <div class="pitch-box-right"></div>
                        <div class="pitch-line-center"></div>
                        <div class="pitch-circle"></div>
                        <div class="pitch-team">${renderPlayers(hL.startXI, true)}</div>
                        <div class="pitch-team">${renderPlayers(aL.startXI, false)}</div>
                    </div>
                </div>`;
            }


            /* ------ יצירת תוכן ללשונית סטטיסטיקה ואירועים ------ */
            const stats = statsData.response || [];
            let homeStatsArray = stats.length > 0 ? stats[0].statistics : [];
            let awayStatsArray = stats.length > 1 ? stats[1].statistics : [];

            let homePoss = getStatValue(homeStatsArray, "Ball Possession") || '50%';
            let awayPoss = getStatValue(awayStatsArray, "Ball Possession") || '50%';

            const statsHTML = `
            <div class="stats-container">
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
                    <div class="stat-row"><span class="stat-val home-val">${getStatValue(homeStatsArray, "Shots on Goal")}</span><span class="stat-name">בעיטות למסגרת</span><span class="stat-val away-val">${getStatValue(awayStatsArray, "Shots on Goal")}</span></div>
                    <div class="stat-row"><span class="stat-val home-val">${getStatValue(homeStatsArray, "Total Shots")}</span><span class="stat-name">סה"כ בעיטות</span><span class="stat-val away-val">${getStatValue(awayStatsArray, "Total Shots")}</span></div>
                    <div class="stat-row"><span class="stat-val home-val">${getStatValue(homeStatsArray, "Corner Kicks")}</span><span class="stat-name">קרנות</span><span class="stat-val away-val">${getStatValue(awayStatsArray, "Corner Kicks")}</span></div>
                    <div class="stat-row"><span class="stat-val home-val">${getStatValue(homeStatsArray, "Fouls")}</span><span class="stat-name">עבירות</span><span class="stat-val away-val">${getStatValue(awayStatsArray, "Fouls")}</span></div>
                </div>
            </div>`;

            let eventsHtml = '';
            if (events.length === 0) {
                eventsHtml = '<p style="text-align:center; width:100%; font-size:12px; margin-top:20px;">אין אירועים להצגה.</p>';
            } else {
                events.sort((a, b) => a.time.elapsed - b.time.elapsed);
                let homeHtml = `<div class="team-col"><div class="team-title">${tHome}</div>`;
                let awayHtml = `<div class="team-col"><div class="team-title">${tAway}</div>`;

                events.forEach((event) => {
                    const typeStr = String(event.type || '').toLowerCase();
                    const detailStr = String(event.detail || '').toLowerCase();
                    const commentsStr = String(event.comments || '').toLowerCase();

                    let time = event.time.elapsed + (event.time.extra ? `+${event.time.extra}` : '');
                    let playerName = event.player?.name ? (typeof window.translateName === 'function' ? window.translateName(event.player.name) : event.player.name) : '';
                    let assistName = event.assist?.name ? (typeof window.translateName === 'function' ? window.translateName(event.assist.name) : event.assist.name) : null;
                    
                    let icon = '📌', mainText = '', subText = '', isGoalCancelled = false;

                    if (typeStr === 'goal') {
                        if (detailStr.includes('cancel') || detailStr.includes('disallow') || commentsStr.includes('cancel')) { icon = '❌'; mainText = `שער! ${playerName}`; isGoalCancelled = true; } 
                        else if (detailStr.includes('missed penalty')) { icon = '❌'; mainText = `החמצת פנדל! ${playerName}`; } 
                        else if (detailStr.includes('penalty')) { icon = '⚽'; mainText = `שער! ${playerName} (פ')`; if (assistName) subText = `בישול: ${assistName}`; } 
                        else if (detailStr.includes('own goal')) { icon = '⚽'; mainText = `שער עצמי! ${playerName}`; } 
                        else { icon = '⚽'; mainText = `שער! ${playerName}`; if (assistName) subText = `בישול: ${assistName}`; }
                    } 
                    else if (typeStr === 'var') {
                        icon = '📺'; mainText = 'החלטת VAR'; if (playerName) mainText += ` (${playerName})`;
                        if (detailStr.includes('cancel') || commentsStr.includes('cancel')) subText = '❌ שער נפסל';
                        else if (detailStr.includes('penalty')) subText = 'בדיקת פנדל';
                        else if (detailStr.includes('card')) subText = 'בדיקת כרטיס';
                        else subText = event.detail || 'בדיקה';
                    } 
                    else if (typeStr === 'card') {
                        if (detailStr.includes('yellow') && !detailStr.includes('second')) { icon = '🟨'; mainText = playerName; subText = 'כרטיס צהוב'; } 
                        else if (detailStr.includes('red') || detailStr.includes('second yellow')) { icon = '🟥'; mainText = playerName; subText = 'כרטיס אדום'; } 
                        else { icon = '🟨'; mainText = playerName; subText = event.detail; }
                    } 
                    else if (typeStr === 'subst') {
                        icon = '🔄'; mainText = `${assistName} (נכנס)`; subText = `${playerName} (יצא)`;
                    } 
                    else { icon = '🔔'; mainText = event.type + (playerName ? ` - ${playerName}` : ''); subText = event.detail || ''; }

                    const isHome = event.team.id === homeId;
                    let textClass = isGoalCancelled ? 'event-text var-cancelled' : 'event-text';
                    let cancelledMarkup = isGoalCancelled ? `<span class="event-subtext var-cancelled-sub">❌ נפסל ע"י VAR</span>` : '';

                    const eventMarkup = `
                        <div class="event-item ${isHome ? 'event-home' : 'event-away'}">
                            <span class="event-time">${time}'</span><span class="event-icon">${icon}</span>
                            <div class="${textClass}"><strong>${mainText}</strong>${subText && !isGoalCancelled ? `<span class="event-subtext">${subText}</span>` : ''}${cancelledMarkup}</div>
                        </div>`;

                    if (isHome) homeHtml += eventMarkup; else awayHtml += eventMarkup;
                });

                homeHtml += '</div>'; awayHtml += '</div>';
                eventsHtml = `<div class="events-wrapper">${homeHtml}${awayHtml}</div>`;
            }

            /* ------ יצירת תוכן ללשונית טבלה ------ */
            let stdHtml = '<div style="padding:20px; text-align:center; font-size:12px;">לא קיימת טבלה רלוונטית למשחק זה</div>';
            if (stdData.response && stdData.response.length > 0) {
                const standings = stdData.response[0].league.standings;
                let targetGroup = standings[0];
                standings.forEach(g => { if (g.some(t => t.team.id === homeId || t.team.id === awayId)) targetGroup = g; });

                const liveStatuses = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT'];
                const isLiveMatch = shortStatus && liveStatuses.includes(shortStatus);

                let targetGroupLive = JSON.parse(JSON.stringify(targetGroup)); 
                
                if (isLiveMatch) {
                    targetGroupLive.forEach(teamStats => {
                        const teamId = teamStats.team.id;
                        let isHome, gFor, gAgainst;
                        
                        if (teamId === homeId) { isHome = true; gFor = goalsHome; gAgainst = goalsAway; } 
                        else if (teamId === awayId) { isHome = false; gFor = goalsAway; gAgainst = goalsHome; } 
                        else { return; } 

                        teamStats.all.played += 1;
                        teamStats.all.goals.for += gFor;
                        teamStats.all.goals.against += gAgainst;
                        teamStats.goalsDiff = teamStats.all.goals.for - teamStats.all.goals.against;

                        if (gFor > gAgainst) { teamStats.all.win += 1; teamStats.points += 3; } 
                        else if (gFor === gAgainst) { teamStats.all.draw += 1; teamStats.points += 1; } 
                        else { teamStats.all.lose += 1; }
                        
                        teamStats.isLiveUpdated = true; 
                    });

                    targetGroupLive.sort((a, b) => {
                        if (b.points !== a.points) return b.points - a.points;
                        if (b.goalsDiff !== a.goalsDiff) return b.goalsDiff - a.goalsDiff;
                        return b.all.goals.for - a.all.goals.for;
                    });
                    
                    targetGroupLive.forEach((t, idx) => { t.rank = idx + 1; });
                }

                stdHtml = `
                <div style="padding: 10px 15px;">
                    <table class="modal-mini-table">
                        <tr><th>#</th><th style="text-align:right;">קבוצה</th><th>מש'</th><th>נצ'</th><th>תיקו</th><th>הפ'</th><th>ש.ז</th><th>ש.ח</th><th>הפרש</th><th>נק'</th></tr>
                        ${targetGroupLive.map(t => {
                            let isPlaying = t.team.id === homeId || t.team.id === awayId;
                            let rowClass = isPlaying ? 'highlight' : '';
                            let name = typeof window.translateName === 'function' ? window.translateName(t.team.name) : t.team.name;
                            let liveDot = t.isLiveUpdated ? '<span class="live-dot">⬤</span>' : '';
                            return `<tr class="${rowClass}">
                                <td>${t.rank}</td>
                                <td style="text-align:right;">
                                    <div class="team-name-text">
                                        <img src="${t.team.logo}" class="team-logo">
                                        <span>${name}${liveDot}</span>
                                    </div>
                                </td>
                                <td>${t.all.played}</td>
                                <td>${t.all.win}</td>
                                <td>${t.all.draw}</td>
                                <td>${t.all.lose}</td>
                                <td>${t.all.goals.for}</td>
                                <td>${t.all.goals.against}</td>
                                <td dir="ltr">${t.goalsDiff}</td>
                                <td style="color:#7a9966;">${t.points}</td>
                            </tr>`;
                        }).join('')}
                    </table>
                </div>`;
            }

            /* ------ יצירת תוכן ללשונית ראש בראש ------ */
            let h2hHtml = '<div style="padding:20px; text-align:center; font-size:12px;">אין היסטוריית מפגשים קודמת</div>';
            if (h2hData.response && h2hData.response.length > 0) {
                h2hHtml = `<div style="padding: 10px 15px; display:flex; flex-direction:column; gap:6px;">` +
                h2hData.response.slice(0,5).map(m => {
                    let hName = typeof window.translateName === 'function' ? window.translateName(m.teams.home.name) : m.teams.home.name;
                    let aName = typeof window.translateName === 'function' ? window.translateName(m.teams.away.name) : m.teams.away.name;
                    let lName = typeof window.translateName === 'function' ? window.translateName(m.league.name) : m.league.name;
                    
                    return `
                    <div style="background: rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 6px; display:flex; align-items: center; font-size: 11px; border: 1px solid #1f2d40; margin-bottom: 5px;">
                        <div style="width: 30%; color:#8fa0b3; text-align:right; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 5px;">
                            <div style="font-weight:bold;">${new Date(m.fixture.date).toLocaleDateString('he-IL')}</div>
                            <div style="font-size: 9px; margin-top:2px; color:#7a9966; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${lName}</div>
                        </div>
                        <div style="width: 70%; display:flex; justify-content:space-between; align-items:center; padding-right: 10px;">
                            <span style="flex:1; text-align:left; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${hName}</span>
                            <span dir="ltr" style="font-weight:900; background:#1e293b; padding:2px 8px; border-radius:4px; color:#ffffff; margin:0 10px; flex-shrink:0;">${m.goals.away} - ${m.goals.home}</span>
                            <span style="flex:1; text-align:right; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${aName}</span>
                        </div>
                    </div>`;
                }).join('') + `</div>`;
            }

            // הרכבת כל המבנה אל תוך ה-Modal
            dynamicArea.innerHTML = `
                ${scoreHTML}
                ${tabsHTML}
                <div id="tab-stats" class="tab-content active">${statsHTML}${eventsHtml}</div>
                <div id="tab-lineups" class="tab-content">${lineupsHtml}</div>
                <div id="tab-standings" class="tab-content">${stdHtml}</div>
                <div id="tab-h2h" class="tab-content">${h2hHtml}</div>
            `;

            if (['FT', 'AET', 'PEN'].includes(shortStatus)) {
                if (modalRefreshTimer) { clearInterval(modalRefreshTimer); modalRefreshTimer = null; }
            }

        } catch (error) {
            console.error(error);
            if (isInitialLoad) dynamicArea.innerHTML = '<p style="text-align:center; width:100%; color:#ff4d4d; font-size:12px; margin-top:20px;">שגיאה בטעינת הנתונים.</p>';
        }
    }

    await updateModalData(true);
    modalRefreshTimer = setInterval(() => updateModalData(false), 60000);
}
