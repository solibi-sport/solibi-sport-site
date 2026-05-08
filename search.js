// מסד הנתונים של האתר - כאן תוכל להוסיף דפים בעתיד!
window.sitePagesData = [
    { title: "דף הבית", url: "index.html", desc: "העמוד הראשי של סוליבי ספורט", keywords: "ראשי בית כדורגל ספורט" },
    { title: "חנות סוליבי (עגלת קניות)", url: "store.html", desc: "החנות הרשמית לציוד ספורט ואוהדים", keywords: "חנות קניות עגלה מוצרים קלפים" },
    { title: "אודות סוליבי ספורט", url: "about.html", desc: "החזון והקהילה שלנו", keywords: "אודות עלינו חזון קהילה סיפור" },
    { title: "יצירת קשר", url: "contact.html", desc: "פנה אלינו בכל שאלה", keywords: "קשר טלפון אימייל הודעה שירות" },
    { title: "קרדיטים וזכויות יוצרים", url: "credits.html", desc: "רשימת המקורות באתר", keywords: "קרדיטים זכויות יוצרים" },
    { title: "ליגת הפנטזי", url: "fantasy.html", desc: "ניהול קבוצת פנטזי ותחרויות", keywords: "פנטזי ליגה קבוצה הרכב מנג'ר" },
    { title: "בורסת השחקנים", url: "bourse.html", desc: "מעקב אחר מחירי שחקנים חי", keywords: "בורסה שוק ערך שחקנים העברות מחיר" }
];

// הפונקציה שמפעילה את הרשימה הנפתחת בזמן אמת
window.runLiveSearch = function(query) {
    const dropdown = document.getElementById('searchDropdown');
    if (!dropdown) return;
    
    if (!query || query.trim() === '') {
        dropdown.classList.remove('active');
        return;
    }

    const lowerQuery = query.toLowerCase().trim();
    
    // סינון התוצאות
    const results = window.sitePagesData.filter(page => 
        page.title.toLowerCase().includes(lowerQuery) || 
        page.keywords.toLowerCase().includes(lowerQuery)
    );

    dropdown.innerHTML = '';
    
    if (results.length === 0) {
        dropdown.innerHTML = '<div class="no-search-results">לא נמצאו תוצאות...</div>';
    } else {
        results.forEach(res => {
            dropdown.innerHTML += `
                <a href="${res.url}" class="search-result-item">
                    <span class="search-result-title">${res.title}</span>
                    <span class="search-result-desc">${res.desc}</span>
                </a>
            `;
        });
    }
    dropdown.classList.add('active');
};

// סוגר את הרשימה באלגנטיות אם לוחצים מחוץ לאזור החיפוש
document.addEventListener('click', function(e) {
    const searchWrapper = document.querySelector('.search-wrapper');
    const dropdown = document.getElementById('searchDropdown');
    if (searchWrapper && !searchWrapper.contains(e.target) && dropdown) {
        dropdown.classList.remove('active');
    }
});
