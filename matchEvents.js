function getStatValue(statsArray, typeName) {
    const stat = statsArray.find(s => s.type === typeName);
    return (stat && stat.value !== null) ? stat.value : '0';
}

function getShortPlayerName(fullName) {
    if (!fullName) return '';
    let translated = typeof window.translateName === 'function' ? window.translateName(fullName) : fullName;
    let parts = translated.trim().split(' ');
    if (parts.length <= 1) return parts[0];
    return parts[0].charAt(0) + '. ' + parts.slice(1).join(' ');
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

window.toggleTeamView = function(team, view) {
    const pBtn = document.getElementById('btn-' + team + '-pitch');
    const bBtn = document.getElementById('btn-' + team + '-bench');
    const pCont = document.getElementById(team + '-pitch');
    const bCont = document.getElementById(team + '-bench');
    
    if (view === 'pitch') {
        pCont.style.display = 'block'; 
        bCont.style.display = 'none';
        pBtn.classList.add('active'); 
        bBtn.classList.remove('active');
    } else {
        pCont.style.display = 'none'; 
        bCont.style.display = 'block';
        bBtn.classList.add('active'); 
        pBtn.classList.remove('active');
    }
};

window.switchModalTab = function(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    btn.classList.add('active');
};

async function openMatchEvents(fixtureId, paramHome, paramAway) {
    let homeTeam = paramHome;
    let awayTeam = paramAway;
    try { homeTeam = decodeURIComponent(paramHome); } catch(e) {}
    try { awayTeam = decodeURIComponent(paramAway); } catch(e) {}

    if (!document.getElementById('eventsModalWrapper')) {
        const modalHTML = `
        <div id="eventsModalWrapper">
            <style>
                .modal-overlay { display: none; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-color: rgba(6, 12, 20, 0.85) !important; z-index: 999999 !important; justify-content: center; align-items: center; direction: rtl; animation: fadeIn 0.2s ease-out; backdrop-filter: blur(3px); }
                .modal-box { background: #111926 !important; color: #ffffff !important; width: 95%; max-width: 500px; border-radius: 12px; box-shadow: 0 15px 50px rgba(0,0,0,0.9); border: 1px solid #2a3b4c; overflow: hidden; transform: scale(0.95); animation: scaleUp 0.2s ease-out forwards; display: flex; flex-direction: column; height: 620px; max-height: 85vh; will-change: transform; touch-action: none; position: relative; font-family: sans-serif; }
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
                .modal-tabs { display: flex; justify-content: space-between; background: #0d131d; border-bottom: 1px solid #1f2d40; flex-shrink: 0; }
                .modal-tab-btn { flex: 1; background: transparent; border: none; color: #8fa0b3; padding: 12px 0; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; border-bottom: 3px solid transparent; font-family: inherit; outline: none; }
                .modal-tab-btn.active { color: #7a9966; border-bottom: 3px solid #7a9966; background: rgba(255,255,255,0.02); }
                .modal-tab-btn:hover { color: #ffffff; }
                .tab-content { display: none; flex-direction: column; overflow-y: auto; flex: 1; min-height: 0; padding-bottom: 10px; }
                .tab-content.active { display: flex; }
                .sub-tabs { display: flex; justify-content: center; gap: 20px; border-bottom: 1px solid #1f2d40; margin-bottom: 15px; }
                .sub-tab-btn { background: transparent; border: none; color: #8fa0b3; padding: 10px 20px; font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.3s; border-bottom: 3px solid transparent; font-family: inherit; outline: none; }
                .sub-tab-btn.active { color: #7a9966; border-bottom: 3px solid #7a9966; }
                .sub-tab-btn:hover { color: #ffffff; }
                .pitch-wrapper { background: repeating-linear-gradient(90deg, #1a432b, #1a432b 10%, #1e4d32 10%, #1e4d32 20%); border: 2px solid rgba(255,255,255,0.3); border-radius: 8px; position: relative; height: 380px; width: 100%; margin: 5px 0; overflow: visible; display: flex; box-shadow: inset 0 0 50px rgba(0,0,0,0.8); }
                .pitch-line-center { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.4); transform: translateX(-50%); z-index: 1;}
                .pitch-circle { position: absolute; left: 50%; top: 50%; width: 80px; height: 80px; border: 2px solid rgba(255,255,255,0.4); border-radius: 50%; transform: translate(-50%, -50%); z-index: 1;}
                .pitch-box-left { position: absolute; left: -2px; top: 20%; height: 60%; width: 16%; border: 2px solid rgba(255,255,255,0.4); border-left: none; z-index: 1;}
                .pitch-box-right { position: absolute; right: -2px; top: 20%; height: 60%; width: 16%; border: 2px solid rgba(255,255,255,0.4); border-right: none; z-index: 1;}
                .pitch-small-box-left { position: absolute; left: -2px; top: 36%; height: 28%; width: 6%; border: 2px solid rgba(255,255,255,0.4); border-left: none; z-index: 1;}
                .pitch-small-box-right { position: absolute; right: -2px; top: 36%; height: 28%; width: 6%; border: 2px solid rgba(255,255,255,0.4); border-right: none; z-index: 1;}
                .pitch-team { flex: 1; position: relative; overflow: visible; }
                .pitch-player { position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; width: 75px; z-index: 3; transition: 0.3s ease; }
                .pitch-player-num { border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; border: 1.5px solid rgba(255,255,255,0.9); box-shadow: 0 4px 6px rgba(0,0,0,0.6), inset 0 -3px 5px rgba(0,0,0,0.3); z-index: 4; position: relative;}
                .pitch-player-name { color: #ffffff; font-size: 10px; font-weight: bold; margin-top: 3px; text-align: center; text-shadow: 1px 1px 2px #000, -1px -1px 2px #000, 1px -1px 2px #000, -1px 1px 2px #000, 0 3px 5px rgba(0,0,0,0.9); z-index: 3; max-width: 70px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; direction: ltr;}
                .bench-view { width: 100%; display: flex; gap: 15px; margin-top: 5px; }
                .bench-col { flex: 1; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid #1f2d40; padding: 10px; }
                .bench-title { text-align: center; font-weight: bold; color: #fff; padding-bottom: 8px; border-bottom: 1px solid #2a3b4c; margin-bottom: 10px; font-size: 13px; }
                .bench-item { display: flex; align-items: center; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 12px; }
                .bench-num { font-weight: 900; color: #7a9966; background: rgba(122,153,102,0.1); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 4px; margin-left: 8px; font-size: 11px; flex-shrink: 0; }
                .bench-name { color: #d1d5db; flex: 1; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
                .bench-sub-badge { color: #10b981; font-size: 10px; font-weight: bold; background: rgba(16,185,129,0.1); padding: 2px 6px; border-radius: 12px; border: 1px solid rgba(16,185,129,0.3); margin-right: 5px; flex-shrink: 0; }
                .modal-mini-table { width: 100%; border-collapse: collapse; font-size: 11px; text-align: center; margin-top: 5px; }
                .modal-mini-table th { color: #8fa0b3; font-weight: normal; padding: 6px; border-bottom: 1px solid #1f2d40; }
                .modal-mini-table td { padding: 8px 6px; border-bottom: 1px solid rgba(255,255,255,0.03); }
                .modal-mini-table tr.highlight { background: rgba(122,153,102,0.15); font-weight: bold; }
                .modal-mini-table td .team-name-text { display: flex; align-items: center; justify-content: flex-start; gap: 6px; direction: rtl; }
                .modal-mini-table td .team-logo { width: 14px; height: 14px; }
                .modal-mini-table td .live-dot { color: #ef4444; font-size: 9px; animation: blink 1.5s infinite; margin-right: 2px; vertical-align: middle; }
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
            </style>
            <div id="eventsModal" class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-header">
                        <span class="close-modal" onclick="closeEventsModal(event)">✖</span>
                        <h2 id="modalMatchTitle">זירת משחק</h2>
                    </div>
                    <div id="modalDynamicArea" style="display:flex; flex-direction:column; flex-grow:1; overflow:hidden;"></div>
                </div>
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
            if (e.target.closest('.close-modal') || e.target.tagName.toLowerCase() === 'button') return;
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
            const [eventsRes, statsRes, fixtureRes, lineupsRes] = await Promise.all([
                fetch(`/api/football-proxy?endpoint=fixtures/events&fixture=${fixtureId}`),
                fetch(`/api/football-proxy?endpoint=fixtures/statistics&fixture=${fixtureId}`),
                fetch(`/api/football-proxy?endpoint=fixtures&id=${fixtureId}`),
                fetch(`/api/football-proxy?endpoint=fixtures/lineups&fixture=${fixtureId}`)
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
                fetch(`/api/football-proxy?endpoint=fixtures/headtohead&h2h=${homeId}-${awayId}&last=6`),
                fetch(`/api/football-standings?league=${leagueId}&season=${season}`)
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

            let lineupsHtml = '<div style="padding:20px; text-align:center; font-size:12px;">אין נתוני הרכבים עדיין</div>';
            
            if (lineupsData.response && lineupsData.response.length === 2) {
                const hL = lineupsData.response.find(r => r.team.id === homeId) || lineupsData.response[0];
                const aL = lineupsData.response.find(r => r.team.id === awayId) || lineupsData.response[1];
                
                const renderPlayersSnapToGrid = (teamLineup, isHome) => {
                    let players = (teamLineup.startXI || []).slice(0, 11);
                    if (players.length === 0) return '';

                    let formationStr = teamLineup.formation;
                    let linesCounts = [1];
                    
                    if (formationStr && formationStr.includes('-')) {
                        linesCounts = linesCounts.concat(formationStr.split('-').map(Number));
                    } else {
                        linesCounts = [1, 4, 4, 2]; 
                    }

                    let totalInFormation = linesCounts.reduce((a, b) => a + b, 0);
                    if (totalInFormation !== 11) {
                        linesCounts = [1, 4, 4, 2]; 
                    }

                    let html = '';
                    let playerIndex = 0;

                    linesCounts.forEach((numPlayersInLine, lineIdx) => {
                        let numLines = linesCounts.length;
                        let r = lineIdx + 1; // קו השחקנים. קו 1 תמיד יהיה השוער.

                        // מיקומים על בסיס משחק אמיתי:
                        // קבוצת הבית (ימין): שוער ב-90 (ימין), התקפה ב-15 (שמאל)
                        // קבוצת חוץ (שמאל): שוער ב-10 (שמאל), התקפה ב-85 (ימין)
                        let xPercent;
                        
                        if (isHome) {
                            if (r === 1) xPercent = 90;
                            else if (r === 2) xPercent = 72;
                            else if (r === numLines) xPercent = 15;
                            else if (numLines === 4 && r === 3) xPercent = 45;
                            else if (numLines === 5 && r === 3) xPercent = 55;
                            else if (numLines === 5 && r === 4) xPercent = 35;
                            else xPercent = 90 - (r * 18);
                        } else {
                            if (r === 1) xPercent = 10;
                            else if (r === 2) xPercent = 28;
                            else if (r === numLines) xPercent = 85;
                            else if (numLines === 4 && r === 3) xPercent = 55;
                            else if (numLines === 5 && r === 3) xPercent = 45;
                            else if (numLines === 5 && r === 4) xPercent = 65;
                            else xPercent = 10 + (r * 18);
                        }

                        for (let i = 0; i < numPlayersInLine; i++) {
                            if (playerIndex >= players.length) break;
                            let p = players[playerIndex];
                            playerIndex++;

                            let yPercent;
                            if (numPlayersInLine === 1) {
                                yPercent = 50; 
                            } else if (numPlayersInLine === 2) {
                                yPercent = i === 0 ? 30 : 70; 
                            } else if (numPlayersInLine === 3) {
                                yPercent = i === 0 ? 20 : (i === 1 ? 50 : 80); 
                            } else if (numPlayersInLine === 4) {
                                yPercent = i === 0 ? 15 : (i === 1 ? 38 : (i === 2 ? 62 : 85)); 
                            } else if (numPlayersInLine === 5) {
                                yPercent = i === 0 ? 10 : (i === 1 ? 30 : (i === 2 ? 50 : (i === 3 ? 70 : 90)));
                            } else {
                                yPercent = 10 + (i / (numPlayersInLine - 1)) * 80; 
                            }

                            // תמונת מראה לקבוצת החוץ כדי ששחקני האגף יעמדו בדיוק במקביל
                            if (!isHome) {
                                yPercent = 100 - yPercent;
                            }

                            let bgColor = isHome ? (teamLineup.team.colors?.player?.primary || 'ffffff') : (teamLineup.team.colors?.player?.primary || '000000');
                            if (bgColor && !bgColor.startsWith('#')) bgColor = '#' + bgColor;
                            let textColor = isHome ? (teamLineup.team.colors?.player?.number || '000000') : (teamLineup.team.colors?.player?.number || 'ffffff');
                            if (textColor && !textColor.startsWith('#')) textColor = '#' + textColor;
                            
                            let shortName = getShortPlayerName(p.player.name);
                            let teamIdForEvent = isHome ? homeId : awayId;
                            let subEvent = events.find(e => e.type.toLowerCase() === 'subst' && e.team.id === teamIdForEvent && e.player.name === p.player.name);
                            
                            let subTextHtml = '';
                            if (subEvent) {
                                let subInShortName = getShortPlayerName(subEvent.assist.name);
                                subTextHtml = `<div style="background: rgba(255, 255, 255, 0.95); color: #111926; border: 1.5px solid #10b981; border-radius: 4px; padding: 2px 5px; margin-top: 4px; font-size: 9px; font-weight: 900; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 3px; direction: ltr; z-index: 10;">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                                    <span>${subInShortName}</span>
                                </div>`;
                            }
                            
                            html += `<div class="pitch-player" style="left: ${xPercent}%; top: ${yPercent}%;">
                                <div class="pitch-player-num" style="background: ${bgColor}; color: ${textColor};">${p.player.number}</div>
                                <div class="pitch-player-name" title="${p.player.name}">${shortName}</div>
                                ${subTextHtml}
                            </div>`;
                        }
                    });

                    return html;
                };

                const renderBenchPlayer = (p, evts, tId) => {
                    let subEvt = evts.find(e => e.type.toLowerCase() === 'subst' && e.team.id === tId && e.assist.name === p.player.name);
                    let statusHtml = '';
                    if (subEvt) {
                        statusHtml = `<span class="bench-sub-badge">▲ נכנס (${subEvt.time.elapsed}')</span>`;
                    }
                    let playerName = typeof window.translateName === 'function' ? window.translateName(p.player.name) : p.player.name;
                    return `<div class="bench-item">
                        <span class="bench-num">${p.player.number || '-'}</span>
                        <span class="bench-name">${playerName}</span>
                        ${statusHtml}
                    </div>`;
                };

                lineupsHtml = `
                <div style="padding: 10px 15px;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:bold; margin-bottom:5px; color:#a0aec0; padding: 0 10px;">
                        <span>מערך: ${aL.formation || '?'}</span>
                        <span>מערך: ${hL.formation || '?'}</span>
                    </div>

                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; direction: rtl;">
                        <div class="sub-tabs" style="margin:0; border:none; gap:5px; flex:1; justify-content: flex-start; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom:5px;">
                            <button id="btn-home-pitch" class="sub-tab-btn active" onclick="toggleTeamView('home', 'pitch')" style="padding: 4px 8px; font-size: 11px;">הרכב פותח</button>
                            <button id="btn-home-bench" class="sub-tab-btn" onclick="toggleTeamView('home', 'bench')" style="padding: 4px 8px; font-size: 11px;">ספסל מחליפים</button>
                        </div>
                        
                        <div class="sub-tabs" style="margin:0; border:none; gap:5px; flex:1; justify-content: flex-end; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom:5px;">
                            <button id="btn-away-bench" class="sub-tab-btn" onclick="toggleTeamView('away', 'bench')" style="padding: 4px 8px; font-size: 11px;">ספסל מחליפים</button>
                            <button id="btn-away-pitch" class="sub-tab-btn active" onclick="toggleTeamView('away', 'pitch')" style="padding: 4px 8px; font-size: 11px;">הרכב פותח</button>
                        </div>
                    </div>
                    
                    <div class="pitch-wrapper" style="position: relative;">
                        <div class="pitch-box-left"></div>
                        <div class="pitch-box-right"></div>
                        <div class="pitch-small-box-left"></div>
                        <div class="pitch-small-box-right"></div>
                        <div class="pitch-line-center"></div>
                        <div class="pitch-circle"></div>
                        
                        <div id="home-pitch" class="pitch-team" style="display:block;">${renderPlayersSnapToGrid(hL, true)}</div>
                        <div id="home-bench" class="bench-col" style="display:none; position:absolute; top:0; right:0; width:50%; height:100%; background:rgba(13,19,29,0.95); z-index:20; overflow-y:auto; border-left:2px solid #2a3b4c; padding:10px; box-sizing:border-box;">
                            <div class="bench-title" style="color:#fff; text-align:center; font-weight:bold; margin-bottom:10px; padding-bottom:5px; border-bottom:1px solid #1f2d40;">${tHome} (ספסל)</div>
                            ${hL.substitutes.map(p => renderBenchPlayer(p, events, homeId)).join('')}
                        </div>
                        
                        <div id="away-pitch" class="pitch-team" style="display:block;">${renderPlayersSnapToGrid(aL, false)}</div>
                        <div id="away-bench" class="bench-col" style="display:none; position:absolute; top:0; left:0; width:50%; height:100%; background:rgba(13,19,29,0.95); z-index:20; overflow-y:auto; border-right:2px solid #2a3b4c; padding:10px; box-sizing:border-box;">
                            <div class="bench-title" style="color:#fff; text-align:center; font-weight:bold; margin-bottom:10px; padding-bottom:5px; border-bottom:1px solid #1f2d40;">${tAway} (ספסל)</div>
                            ${aL.substitutes.map(p => renderBenchPlayer(p, events, awayId)).join('')}
                        </div>
                    </div>
                </div>`;
            }

            /* ------ סטטיסטיקה ואירועים ------ */
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

            /* ------ טבלה ------ */
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
                        <tr>
                            <th>#</th>
                            <th style="text-align:right; padding-right:5px;">קבוצה</th>
                            <th>מש'</th>
                            <th>נצ'</th>
                            <th>תיקו</th>
                            <th>הפ'</th>
                            <th>ש.ז</th>
                            <th>ש.ח</th>
                            <th>הפרש</th>
                            <th>נק'</th>
                        </tr>
                        ${targetGroupLive.map(t => {
                            let isPlaying = t.team.id === homeId || t.team.id === awayId;
                            let rowClass = isPlaying ? 'highlight' : '';
                            let name = typeof window.translateName === 'function' ? window.translateName(t.team.name) : t.team.name;
                            let liveDot = t.isLiveUpdated ? '<span class="live-dot">⬤</span>' : '';
                            return `<tr class="${rowClass}">
                                <td>${t.rank}</td>
                                <td style="text-align:right; padding-right:5px;">
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

            /* ------ ראש בראש (מסינון המשחק הנוכחי) ------ */
            let h2hHtml = '<div style="padding:20px; text-align:center; font-size:12px;">אין היסטוריית מפגשים קודמת</div>';
            if (h2hData.response && h2hData.response.length > 0) {
                let filteredH2H = h2hData.response.filter(m => String(m.fixture.id) !== String(fixtureId)).slice(0, 5);
                
                if (filteredH2H.length > 0) {
                    h2hHtml = `<div style="padding: 10px 15px; display:flex; flex-direction:column; gap:6px;">` +
                    filteredH2H.map(m => {
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
            }

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
