// מסד הנתונים החכם של סוליבי ספורט - כולל מילות מפתח מורחבות ותת-נושאים
window.sitePagesData = [
    // --- דפים ראשיים ---
    { 
        title: "דף הבית", 
        url: "index.html", 
        desc: "העמוד הראשי של סוליבי ספורט - כל עולמות הכדורגל במקום אחד", 
        keywords: "ראשי בית כדורגל ספורט תוצאות לייב משחקים חי טבלה ליגה סטטיסטיקה חדשות עדכונים היום תקצירים" 
    },
    { 
        title: "חנות סוליבי (עגלת קניות)", 
        url: "store.html", 
        desc: "החנות הרשמית של סוליבי: ציוד ספורט, חולצות ואספנות", 
        keywords: "חנות קניות עגלה מוצרים קלפים חולצות כדור ציוד מבצעים רכישה תשלום משלוח אספנות מרצ'נדייז" 
    },
    { 
        title: "אודות סוליבי ספורט", 
        url: "about.html", 
        desc: "החזון שלנו, הקהילה והסיפור מאחורי הפלטפורמה", 
        keywords: "אודות עלינו חזון קהילה סיפור מי אנחנו אהבה פיפא מנג'ר נתונים גיימינג דאטה חוויה טריוויה חידונים" 
    },
    { 
        title: "יצירת קשר ותמיכה", 
        url: "contact.html", 
        desc: "יש לך שאלה? פנה אלינו בכל נושא", 
        keywords: "קשר טלפון אימייל הודעה שירות לקוחות תמיכה וואטסאפ פניה עזרה צור נציג" 
    },
    { 
        title: "קרדיטים וזכויות יוצרים", 
        url: "credits.html", 
        desc: "רשימת המקורות, הרישיונות והטכנולוגיות באתר", 
        keywords: "קרדיטים זכויות יוצרים תמונות מקורות חוקי רישיון צילום פונטים אייקונים עיצוב ספקים משפטי" 
    },
    
    // --- עולמות הגיימינג והפנטזי ---
    { 
        title: "ליגת הפנטזי הרשמית", 
        url: "fantasy.html", 
        desc: "בנה קבוצה מנצחת, התחרה מול חברים וזכה בפרסים", 
        keywords: "פנטזי ליגה קבוצה הרכב מנג'ר נקודות חילופים דירוג טבלה משחק פרסים ליגות" 
    },
    { 
        title: "בורסת השחקנים", 
        url: "bourse.html", 
        desc: "זירת המסחר של סוליבי: מעקב אחר מחירי שחקנים בזמן אמת", 
        keywords: "בורסה שוק ערך שחקנים העברות מחיר קניה מכירה מניות סחר עליה ירידה מסחר כלכלה" 
    },

    // --- תת-נושאים (כדי שהחיפוש ימצא דברים ספציפיים ויפנה לדף הנכון) ---
    { 
        title: "המועדון שלי (פנטזי)", 
        url: "fantasy.html", 
        desc: "ניהול הסגל שלך, בחירת קפטן וביצוע חילופים", 
        keywords: "המועדון שלי קבוצה שלי ניהול סגל הרכב פותח קפטן ספסל שחקנים שלי" 
    },
    { 
        title: "דירוג וסטטיסטיקות שחקנים", 
        url: "fantasy.html", 
        desc: "טבלת המובילים, ציונים ונקודות שבועיות", 
        keywords: "דירוג דירוגים ציון ציונים סטטיסטיקה מובילים טופ השחקן המצטיין ניקוד ביצועים" 
    },
    { 
        title: "תוצאות לייב (Live)", 
        url: "index.html", 
        desc: "עדכונים חיים מכל המגרשים והליגות", 
        keywords: "תוצאות לייב חי משחקים עדכונים גולים שערים דקות תוצאת סיום מחצית" 
    },
    { 
        title: "אספנות קלפי כדורגל", 
        url: "store.html", 
        desc: "מחלקת הקלפים והאספנות בחנות סוליבי", 
        keywords: "קלפים אוסף אספנות קלפי שחקנים אלבום מדבקות נדיר פרימיום" 
    }
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
    
    // סורק את המערך ומוצא התאמות בכותרת, בתיאור או במילות המפתח
    const results = window.sitePagesData.filter(page => 
        page.title.toLowerCase().includes(lowerQuery) || 
        page.desc.toLowerCase().includes(lowerQuery) || 
        page.keywords.toLowerCase().includes(lowerQuery)
    );

    dropdown.innerHTML = '';
    
    if (results.length === 0) {
        dropdown.innerHTML = '<div class="no-search-results">לא נמצאו תוצאות לחיפוש שלך...</div>';
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
