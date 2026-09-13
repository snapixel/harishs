let deferredPrompt;
const pwaBtn = document.getElementById('pwaInstallBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBtn) pwaBtn.style.display = 'flex';
});

function installPWA() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted' && pwaBtn) {
            pwaBtn.style.display = 'none';
        }
        deferredPrompt = null;
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Registration skipped.'));
    });
}

import('https://cdn.jsdelivr.net/npm/@ishubhamx/panchangam-js@latest/+esm').then(module => {
    window.getPanchangam = module.getPanchangam;
    window.Observer = module.Observer;
    window.tithiNames = module.tithiNames;
    window.nakshatraNames = module.nakshatraNames;
    window.yogaNames = module.yogaNames;
    window.karanaNames = module.karanaNames;
}).catch(e => console.error("Engine script load issue.", e));


let isEnglish = false;
let currentData = {};
const currentDate = new Date();
let currentChogData = {};

function openMoreMenu() {
    document.getElementById('moreOverlay').classList.add('active');
    document.getElementById('moreSheet').classList.add('active');
}

function closeMoreMenu() {
    document.getElementById('moreOverlay').classList.remove('active');
    document.getElementById('moreSheet').classList.remove('active');
}

function switchTab(tab) {
    document.getElementById('tabNumerology').style.display = tab === 'num' ? 'block' : 'none';
    document.getElementById('tabChoghadiya').style.display = tab === 'chog' ? 'block' : 'none';
    document.getElementById('tabPanchang').style.display = tab === 'panchang' ? 'block' : 'none';
    document.getElementById('tabSynastry').style.display = tab === 'synastry' ? 'block' : 'none';
    document.getElementById('tabStupank').style.display = tab === 'stupank' ? 'block' : 'none';
    document.getElementById('tabDetailed').style.display = tab === 'detailed' ? 'block' : 'none';
	
    document.getElementById('tabNameOpt').style.display = tab === 'nameopt' ? 'block' : 'none';
    document.getElementById('tabHora').style.display = tab === 'hora' ? 'block' : 'none';
	
	document.getElementById('tabDosha').style.display = tab === 'dosha' ? 'block' : 'none';
    document.getElementById('tabGemstone').style.display = tab === 'gemstone' ? 'block' : 'none';
    document.getElementById('tabSadesati').style.display = tab === 'sadesati' ? 'block' : 'none';

    document.getElementById('navNum').className = tab === 'num' ? 'nav-item active' : 'nav-item';
    document.getElementById('navChog').className = tab === 'chog' ? 'nav-item active' : 'nav-item';
    document.getElementById('navPanchang').className = tab === 'panchang' ? 'nav-item active' : 'nav-item';
    document.getElementById('navSynastry').className = tab === 'synastry' ? 'nav-item active' : 'nav-item';
    
    document.getElementById('sheetStupank').className = tab === 'stupank' ? 'sheet-item active' : 'sheet-item';
    document.getElementById('sheetDetailed').className = tab === 'detailed' ? 'sheet-item active' : 'sheet-item';

    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMoreMenu();

    if (tab === 'dosha') calculateDoshas();
    if (tab === 'chog') calculateChoghadiya();
    if (tab === 'panchang') calculateLivePanchang();
	if (tab === 'hora') calculateHora();
}

function toggleGuide() {
    const box = document.getElementById('guideBox');
    const arrow = document.getElementById('guideArrowIcon');
    if (box.style.display === 'none') {
        box.style.display = 'block';
        arrow.innerText = '˄';
    } else {
        box.style.display = 'none';
        arrow.innerText = '⌵';
    }
}

function openRightDrawer() {
    document.getElementById('drawerOverlay').classList.add('active');
    document.getElementById('rightDrawer').classList.add('active');
}

function closeRightDrawer() {
    document.getElementById('drawerOverlay').classList.remove('active');
    document.getElementById('rightDrawer').classList.remove('active');
}

function toggleLang() {
    isEnglish = !isEnglish;
    
    document.getElementById('langBtnText').innerText = isEnglish ? "EN" : "HI";
    const langDesc = document.getElementById('langDescText');
    if(langDesc) langDesc.innerText = isEnglish ? "Currently: English" : "Currently: Hindi";

    document.getElementById('numHeroTitle').innerText = isEnglish ? "Name & Birth Numerology" : "नाम एवं जन्म अंक ज्योतिष";
    document.getElementById('numHeroSubtitle').innerText = isEnglish ? "Ancient Chaldean System, Compound 1-80, Psychic, Destiny & Lo Shu Matrix." : "प्राचीन कैल्डियन प्रणाली, 1-80 यौगिक अंक, मूलांक, भाग्यांक, एवं लो शु ग्रिड का संपूर्ण विश्लेषण।";
    document.getElementById('guideBtnLabel').innerText = isEnglish ? "Chaldean Mystery Guide" : "कैल्डियन रहस्य गाइड";
    document.getElementById('lblFullName').innerText = isEnglish ? "ENTER FULL NAME (ENGLISH)" : "पूरा नाम दर्ज करें (ENGLISH)";
    document.getElementById('lblDOB').innerText = isEnglish ? "BIRTH DATE (OPTIONAL)" : "जन्म तिथि (वैकल्पिक / OPTIONAL)";
    document.getElementById('btnCalcNum').innerText = isEnglish ? "Calculate Numerology" : "अंक ज्योतिष गणना करें";

    document.getElementById('stTotalTitle').innerText = isEnglish ? "Compound No" : "संयुक्त अंक";
    document.getElementById('stRootTitle').innerText = isEnglish ? "Name Root" : "नामांक (ROOT)";
    document.getElementById('stPsyTitle').innerText = isEnglish ? "Psychic" : "मूलांक (PSYCHIC)";
    document.getElementById('stDesTitle').innerText = isEnglish ? "Destiny" : "भाग्यांक (DESTINY)";

    document.getElementById('titleRootEffect').innerText = isEnglish ? "Name Root Influence" : "नामांक का प्रभाव";
    document.getElementById('titleCompEffect').innerText = isEnglish ? "Compound Number Insights" : "संयुक्त अंक का रहस्य एवं फल";
    document.getElementById('lblLuckyElementsTitle').innerText = isEnglish ? "Lucky Elements & Vibration" : "शुभ तत्व एवं ऊर्जा";
    document.getElementById('lblColor').innerText = isEnglish ? "Lucky Color" : "शुभ रंग";
    document.getElementById('lblGem').innerText = isEnglish ? "Gemstone" : "रत्न (Gemstone)";
    document.getElementById('lblDays').innerText = isEnglish ? "Lucky Days" : "शुभ वार (Days)";
    document.getElementById('lblYear').innerText = isEnglish ? "Personal Year" : "व्यक्तिगत वर्ष";
    document.getElementById('lblLoshuTitle').innerText = isEnglish ? "Lo Shu Grid Matrix Analysis" : "लो शु ग्रिड विश्लेषण (LO SHU GRID MATRIX)";
    document.getElementById('lblLoshuSub').innerText = isEnglish ? "Energy Balance of Birth Date Numbers" : "जन्म तिथि के अंकों की उपस्थिति एवं ऊर्जा संतुलन";

    document.getElementById('botNavNum').innerText = isEnglish ? "Numerology" : "अंक शास्त्र";
    document.getElementById('botNavChog').innerText = isEnglish ? "Choghadiya" : "चौघड़िया";
    document.getElementById('botNavPanchang').innerText = isEnglish ? "Panchang" : "पंचांग";

// Dosha Translations
    document.getElementById('doshaTitle').innerText = isEnglish ? "Rahu Kaal & Doshas" : "दैनिक दोष (Rahu Kaal)";
    document.getElementById('doshaSub').innerText = isEnglish ? "Exact timings for Rahu Kaal, Yamaganda, and Gulika." : "राहु काल, यमगंड और गुलिक काल का सटीक समय।";
    document.getElementById('btnCalcDosha').innerText = isEnglish ? "Calculate Today's Doshas" : "आज के दोष निकालें";
    if (document.getElementById('sheetDoshaText')) document.getElementById('sheetDoshaText').innerText = isEnglish ? "Daily Doshas" : "राहु काल (Doshas)";

    // Gemstone Translations
    document.getElementById('gemTitle').innerText = isEnglish ? "Gems & Rudraksha" : "रत्न एवं रुद्राक्ष (Gems & Rudraksha)";
    document.getElementById('gemSub').innerText = isEnglish ? "Vedic remedies based on your Life Path." : "आपके भाग्यांक और मूलांक के आधार पर सटीक वैदिक उपाय।";
    document.getElementById('gemDobLabel').innerText = isEnglish ? "Date of Birth" : "जन्म तिथि (Date of Birth)";
    document.getElementById('btnCalcGem').innerText = isEnglish ? "Get Remedies" : "उपाय जानें (Get Remedies)";
    document.getElementById('lblLifePathGem').innerText = isEnglish ? "Life Path Gemstone" : "भाग्यांक रत्न (Life Path Gemstone)";
    document.getElementById('lblRudraksha').innerText = isEnglish ? "Recommended Rudraksha" : "रुद्राक्ष अनुशंसा (Rudraksha)";
    if (document.getElementById('sheetGemText')) document.getElementById('sheetGemText').innerText = isEnglish ? "Gems & Rudraksha" : "रत्न (Gems)";

    // Sade Sati Translations
    document.getElementById('sadeTitle').innerText = isEnglish ? "Sade Sati Tracker" : "साढ़े साती (Sade Sati Tracker)";
    document.getElementById('sadeSub').innerText = isEnglish ? "Check your Saturn transit phases based on Moon Sign." : "अपनी चंद्र राशि के अनुसार शनि गोचर और ढैय्या की जांच करें।";
    document.getElementById('sadeMoonLabel').innerText = isEnglish ? "Your Moon Sign" : "आपकी चंद्र राशि (Your Moon Sign)";
    document.getElementById('sadeSaturnLabel').innerText = isEnglish ? "Current Saturn Transit" : "वर्तमान शनि गोचर (Saturn Transit)";
    document.getElementById('btnCalcSade').innerText = isEnglish ? "Check Transit" : "गोचर जांचें (Check Transit)";
    document.getElementById('lblSadeStatus').innerText = isEnglish ? "Saturn Status" : "शनि स्थिति (Saturn Status)";
    if (document.getElementById('sheetSadeText')) document.getElementById('sheetSadeText').innerText = isEnglish ? "Sade Sati" : "साढ़े साती (Sade Sati)";

    // Refresh dynamic content
    if (document.getElementById('tabDosha').style.display === 'block') calculateDoshas();
    if (document.getElementById('tabGemstone').style.display === 'block') recommendGems();
    if (document.getElementById('tabSadesati').style.display === 'block') checkSadeSati();

    document.getElementById('guideContent').innerHTML = isEnglish ? guideContentEN : guideContentHI;

    // Name Optimizer Translations
    document.getElementById('optTitle').innerText = isEnglish ? "Name Spelling Optimizer" : "नाम वर्तनी जांच (Name Optimizer)";
    document.getElementById('optSub').innerText = isEnglish ? "Real-time Chaldean compound calculator to find your luckiest spelling." : "अपना सबसे भाग्यशाली नाम खोजने के लिए रीयल-टाइम कैल्डियन कैलकुलेटर।";
    document.getElementById('optInputLabel').innerText = isEnglish ? "Test Spelling (IN ENGLISH)" : "Test Spelling (अंग्रेजी में)";
    document.getElementById('optMeaningTitle').innerText = isEnglish ? "Karmic Meaning" : "कार्मिक अर्थ (Karmic Meaning)";
    
    // Hora Calculator Translations
    document.getElementById('horaTitle').innerText = isEnglish ? "Planetary Hours (Hora)" : "होरा चक्र (Planetary Hours)";
    document.getElementById('horaSub').innerText = isEnglish ? "Precise micro-timing for auspicious actions." : "शुभ कार्यों के लिए सटीक सूक्ष्म-समय (Micro-timing) गणना।";
    document.getElementById('btnCalcHoraText').innerText = isEnglish ? "Calculate Today's Hora" : "आज का होरा निकालें";
    
    // Slide-up Menu Translations
    const sheetOptText = document.getElementById('sheetOptText');
    if (sheetOptText) sheetOptText.innerText = isEnglish ? "Name Optimizer" : "नाम वर्तनी (Optimizer)";
    const sheetHoraText = document.getElementById('sheetHoraText');
    if (sheetHoraText) sheetHoraText.innerText = isEnglish ? "Hora Calculator" : "होरा चक्र (Hora)";

    // Refresh dynamic content automatically
    optimizeName();
    if (document.getElementById('tabHora').style.display === 'block') calculateHora();
    if (currentData.name) calculateNumerology(true);
}

function calculateRoot(num) {
    while (num > 9) {
        num = num.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return num;
}

function generateLoShu(dateStr, driver, conductor) {
    const subLabels = {
        4: "Wood", 9: "Fire", 2: "Earth", 3: "Wood", 5: "Earth",
        7: "Metal", 8: "Earth", 1: "Water", 6: "Metal"
    };

    [1,2,3,4,5,6,7,8,9].forEach(n => {
        const el = document.getElementById('ls_' + n);
        if (el) {
            el.className = 'loshu-cell';
            el.innerHTML = `${n}<span class="loshu-cell-sub">${subLabels[n]}</span>`;
        }
    });

    const digitsStr = dateStr.replace(/\D/g, '').replace(/0/g, '');
    let counts = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0};
    
    for (let d of digitsStr) counts[d]++;
    if (driver) counts[driver]++;
    if (conductor) counts[conductor]++;

    let missingNumbers = [];
    let repeatedNumbers = [];

    for (let n = 1; n <= 9; n++) {
        let count = counts[n];
        const el = document.getElementById('ls_' + n);
        
        if (count > 0) {
            if (el) {
                el.className = 'loshu-cell active';
                el.innerHTML = `${String(n).repeat(count)}<span class="loshu-cell-sub">${subLabels[n]}</span>`;
            }
            if (count > 1) repeatedNumbers.push(n);
        } else {
            missingNumbers.push(n);
        }
    }

    const missingList = document.getElementById('missingList');
    const repeatedList = document.getElementById('repeatedList');
    if(!missingList || !repeatedList) return;
    
    missingList.innerHTML = '';
    repeatedList.innerHTML = '';

    if (missingNumbers.length === 0) {
        missingList.innerHTML = "<li>No missing numbers! Your grid is fully balanced. (कोई अंक गायब नहीं है!)</li>";
    } else {
        missingNumbers.forEach(num => {
            let li = document.createElement('li');
            li.innerHTML = loShuPredictions.missing[num];
            li.style.marginBottom = "6px";
            missingList.appendChild(li);
        });
    }

    if (repeatedNumbers.length === 0) {
        repeatedList.innerHTML = "<li>No numbers are repeated more than once. (कोई भी अंक एक से अधिक बार नहीं आया है।)</li>";
    } else {
        repeatedNumbers.forEach(num => {
            let li = document.createElement('li');
            li.innerHTML = loShuPredictions.repeated[num];
            li.style.marginBottom = "6px";
            repeatedList.appendChild(li);
        });
    }
}

function calculateNumerology(isRecalc = false) {
    try {
        const nameEl = document.getElementById('nameInput');
        if (!nameEl) return;
        const rawInput = nameEl.value.toUpperCase().trim();
        const dobInput = document.getElementById('dobInput')?.value || "";
        const sanitizedInput = rawInput.replace(/[^A-Z]/g, '');

        if (!isRecalc && !sanitizedInput) {
            alert("कृपया मान्य अंग्रेजी नाम दर्ज करें (Please enter a valid English name).");
            return;
        }

        currentData.name = rawInput;

        let totalScore = 0;
        let breakdownParts = [];
        for (let char of sanitizedInput) {
            if (chaldeanMap[char]) {
                totalScore += chaldeanMap[char];
                breakdownParts.push(`${char}(${chaldeanMap[char]})`);
            }
        }

        let originalTotal = totalScore;
        let effectiveCompound = totalScore;
        let reductionMsg = "";

        if (effectiveCompound > 80) {
            effectiveCompound = effectiveCompound.toString().split('').reduce((s, d) => s + parseInt(d, 10), 0);
            reductionMsg = isEnglish ? ` ➔ ${effectiveCompound} (Reduced)` : ` ➔ ${effectiveCompound} (घटाया गया)`;
        }

        const rootScore = calculateRoot(effectiveCompound);
        currentData.compound = effectiveCompound;
        currentData.originalTotal = originalTotal;
        currentData.root = rootScore;

        document.getElementById('stTotalNum').innerText = effectiveCompound;
        document.getElementById('stTotalSub').innerText = originalTotal > 80 ? `Orig: ${originalTotal}` : `Total ${effectiveCompound}`;
        document.getElementById('stRootNum').innerText = rootScore;
        document.getElementById('stRootLord').innerText = planetaryLords[rootScore][isEnglish ? 'en' : 'hi'];

        document.getElementById('calcBreakdown').innerHTML = `<strong>∑ नामांक:</strong> ${breakdownParts.join(' + ')} = <strong>${originalTotal}</strong>${reductionMsg}`;
        document.getElementById('repNameDisplay').innerText = rawInput;

        const langKey = isEnglish ? 'en' : 'hi';
        document.getElementById('rootPredictionText').innerText = rootPredictions[rootScore][langKey];

        let compoundText = "";
        if (effectiveCompound < 10) {
            compoundText = isEnglish
                ? "Numbers 1 through 9 are known as Root Numbers. Since this name totals a single digit, there is no hidden karmic 'compound' influence attached."
                : "1 से 9 तक की संख्याओं को मूलांक या एकल अंक कहा जाता है। चूंकि इस नाम का कुल योग एक एकल अंक है, इसका अर्थ है कि इसके साथ कोई छिपा हुआ कार्मिक 'संयुक्त' प्रभाव नहीं है।";
        } else {
            compoundText = compoundPredictions[effectiveCompound] || (isEnglish ? "N/A" : "उपलब्ध नहीं");
        }
        document.getElementById('predictionText').innerText = compoundText;

        const dobSection = document.getElementById('dobResultSection');
        const dobBadges = document.querySelectorAll('.dob-dep');

        if (dobInput) {
            currentData.dob = dobInput;
            const parts = dobInput.split('-');

            const daySum = parts[2].split('').reduce((s, d) => s + parseInt(d, 10), 0);
            const psychicScore = calculateRoot(daySum);

            const fullDateSum = dobInput.replace(/\D/g, '').split('').reduce((s, d) => s + parseInt(d, 10), 0);
            const destinyScore = calculateRoot(fullDateSum);

            const currYearSum = currentDate.getFullYear().toString().split('').reduce((s, d) => s + parseInt(d, 10), 0);
            const pySum = currYearSum + daySum + parts[1].split('').reduce((s, d) => s + parseInt(d, 10), 0);
            const personalYear = calculateRoot(pySum);

            currentData.psychic = psychicScore;
            currentData.destiny = destinyScore;
            currentData.personalYear = personalYear;

            document.getElementById('stPsyNum').innerText = psychicScore;
            document.getElementById('stPsyLord').innerText = planetaryLords[psychicScore][langKey];
            document.getElementById('stDesNum').innerText = destinyScore;
            document.getElementById('stDesLord').innerText = planetaryLords[destinyScore][langKey];

            document.getElementById('repDobDisplay').innerText = `जन्म तिथि: ${parts[2]}/${parts[1]}/${parts[0]}`;
            document.getElementById('luckyColor').innerText = luckyElements[psychicScore][isEnglish ? 'en_color' : 'hi_color'];
            document.getElementById('luckyGem').innerText = luckyElements[psychicScore][isEnglish ? 'en_gem' : 'hi_gem'];
            document.getElementById('luckyDays').innerText = luckyElements[psychicScore][isEnglish ? 'en_days' : 'hi_days'];
            document.getElementById('personalYear').innerText = personalYear;

            document.getElementById('psychicText').innerText = rootPredictions[psychicScore][langKey];
            document.getElementById('destinyText').innerText = rootPredictions[destinyScore][langKey];

            generateLoShu(dobInput, psychicScore, destinyScore);

            dobSection.style.display = 'block';
            dobBadges.forEach(el => el.style.display = 'flex');
        } else {
            currentData.dob = null;
            dobSection.style.display = 'none';
            dobBadges.forEach(el => el.style.display = 'none');
            document.getElementById('repDobDisplay').innerText = isEnglish ? "Date of Birth: Not Specified" : "जन्म तिथि: दर्ज नहीं";
        }

        document.getElementById('reportAreaNum').style.display = 'block';
    } catch (error) {
        console.error(error);
        alert("गणना में त्रुटि (Calculation Error): " + error.message);
    }
}

function formatTime12(dateInput) {
    if (!dateInput) return "--:--";
    let d;
    if (dateInput instanceof Date) {
        d = dateInput;
    } else if (typeof dateInput === 'object' && dateInput.year !== undefined) {
        d = new Date(dateInput.year, (dateInput.month || 1) - 1, dateInput.day || 1, dateInput.hour || 0, dateInput.minute || 0, dateInput.second || 0);
    } else {
        d = new Date(dateInput);
    }
    
    if (isNaN(d.getTime())) return "--:--";
    
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

function formatTime24(dateInput) {
    if (!dateInput) return "--:--";
    let d;
    if (dateInput instanceof Date) {
        d = dateInput;
    } else if (typeof dateInput === 'object' && dateInput.year !== undefined) {
        d = new Date(dateInput.year, (dateInput.month || 1) - 1, dateInput.day || 1, dateInput.hour || 0, dateInput.minute || 0, dateInput.second || 0);
    } else {
        d = new Date(dateInput);
    }
    
    if (isNaN(d.getTime())) return "--:--";
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

async function getCoordinates(city) {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&email=astropro@web.app`);
    const data = await res.json();
    if (data.length === 0) throw new Error("शहर नहीं मिला। कृपया पुनः जांचें।");
    return { lat: data[0].lat, lng: data[0].lon, displayName: data[0].display_name };
}

async function getSunTimes(lat, lng, dateStr) {
    const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dateStr}&formatted=0`);
    const data = await res.json();
    return data.results;
}

function selectCity(cityName) {
    document.getElementById('cityInput').value = cityName;
    document.querySelectorAll('#tabChoghadiya .city-chip').forEach(c => {
        c.className = c.innerText.toLowerCase() === cityName.toLowerCase() ? 'city-chip active' : 'city-chip';
    });
    calculateChoghadiya();
}

function selectCityPanchang(cityName) {
    document.getElementById('panchangCityInput').value = cityName;
    document.querySelectorAll('#tabPanchang .city-chip').forEach(c => {
        c.className = c.innerText.toLowerCase() === cityName.toLowerCase() ? 'city-chip active' : 'city-chip';
    });
    calculateLivePanchang();
}

function stepDate(context, deltaDays) {
    const elId = context === 'chog' ? 'chogDateInput' : 'panchangDateInput';
    const el = document.getElementById(elId);
    const cur = new Date(el.value || new Date());
    cur.setDate(cur.getDate() + deltaDays);
    el.value = cur.toISOString().split('T')[0];
    if (context === 'chog') calculateChoghadiya();
    else calculateLivePanchang();
}

function setToday(context) {
    const elId = context === 'chog' ? 'chogDateInput' : 'panchangDateInput';
    document.getElementById(elId).value = new Date().toISOString().split('T')[0];
    if (context === 'chog') calculateChoghadiya();
    else calculateLivePanchang();
}

async function calculateChoghadiya() {
    const city = document.getElementById('cityInput').value.trim() || 'Udaipur';
    const dateStr = document.getElementById('chogDateInput').value;
    const status = document.getElementById('statusMsg');

    status.innerText = "गणना हो रही है (Calculating)...";

    try {
        const coords = await getCoordinates(city);
        const selectedDate = new Date(dateStr);
        const dayOfWeek = selectedDate.getDay();

        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateStr = nextDate.toISOString().split('T')[0];

        const todaySun = await getSunTimes(coords.lat, coords.lng, dateStr);
        const tomorrowSun = await getSunTimes(coords.lat, coords.lng, nextDateStr);

        const sunrise = new Date(todaySun.sunrise);
        const sunset = new Date(todaySun.sunset);
        const nextSunrise = new Date(tomorrowSun.sunrise);

        document.getElementById('chogSunriseDisplay').innerText = formatTime12(sunrise);
        document.getElementById('chogSunsetDisplay').innerText = formatTime12(sunset);
        document.getElementById('chogCityTitle').innerText = `${coords.displayName.split(',').slice(0, 3).join(', ').toUpperCase()}`;
        document.getElementById('chogHorizonSub').innerText = `दिनांक: ${dateStr.split('-').reverse().join('/')} • सूर्योदय: ${formatTime12(sunrise)} • सूर्यास्त: ${formatTime12(sunset)}`;

        const dayDuration = sunset.getTime() - sunrise.getTime();
        const nightDuration = nextSunrise.getTime() - sunset.getTime();

        const daySeg = dayDuration / 8;
        const nightSeg = nightDuration / 8;

        const now = new Date().getTime();
        let currentLiveFound = null;

        function buildRows(containerId, sequence, startMs, segDuration, isNight = false) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';

            for (let i = 0; i < 8; i++) {
                const slotStart = new Date(startMs + (i * segDuration));
                const slotEnd = new Date(startMs + ((i + 1) * segDuration));
                const cKey = sequence[i];
                const info = choghadiyaInfo[cKey];

                const isCurrentSlot = now >= slotStart.getTime() && now < slotEnd.getTime();
                if (isCurrentSlot) {
                    currentLiveFound = { name: info.nameHI, status: info.statusClass, start: slotStart, end: slotEnd, lord: info.lord };
                }

                const statusPillLabel = info.statusClass === 'good' ? 'शुभ' : (info.statusClass === 'neutral' ? 'सामान्य / चल' : 'अशुभ');

                const row = document.createElement('div');
                row.className = `chog-item-row ${isCurrentSlot ? 'is-current' : ''}`;
                row.innerHTML = `
                    <div class="chog-row-left">
                        <div class="chog-index-badge">${i + 1}</div>
                        <div class="chog-name-block">
                            <strong>${info.nameHI} ${isCurrentSlot ? '<span style="color:#582be8; font-size:0.75rem; font-weight:800;">(LIVE)</span>' : ''}</strong>
                            <span>${info.lord}</span>
                        </div>
                    </div>
                    <div class="chog-row-right">
                        <div class="chog-time-text">${formatTime12(slotStart)} - ${formatTime12(slotEnd)}</div>
                        <span class="status-badge-pill ${info.statusClass}">${statusPillLabel}</span>
                    </div>
                `;
                container.appendChild(row);
            }
        }

        buildRows('dayChogList', daySequences[dayOfWeek], sunrise.getTime(), daySeg);
        buildRows('nightChogList', nightSequences[dayOfWeek], sunset.getTime(), nightSeg, true);

        if (currentLiveFound) {
            document.getElementById('liveChogName').innerText = currentLiveFound.name;
            document.getElementById('liveChogDesc').innerText = currentLiveFound.lord;
            document.getElementById('liveChogTimeSlot').innerText = `${formatTime12(currentLiveFound.start)} – ${formatTime12(currentLiveFound.end)}`;
            const pill = document.getElementById('livePill');
            pill.className = `status-badge-pill ${currentLiveFound.status}`;
            pill.innerText = currentLiveFound.status === 'good' ? 'शुभ मुहूर्त' : (currentLiveFound.status === 'neutral' ? 'चल मुहूर्त' : 'अशुभ काल');
        } else {
            document.getElementById('liveChogName').innerText = "चौघड़िया अवलोकन";
            document.getElementById('liveChogDesc').innerText = "चयनित तिथि के मुहूर्त की गणना";
            document.getElementById('liveChogTimeSlot').innerText = `${dateStr.split('-').reverse().join('/')}`;
        }

        status.innerText = "";
    } catch (e) {
        status.innerText = "त्रुटि: " + e.message;
    }
}

async function calculateLivePanchang() {
    const city = document.getElementById('panchangCityInput').value.trim() || 'Udaipur';
    const dateInput = document.getElementById('panchangDateInput').value;

    let targetDate = new Date();
    if (dateInput) {
        targetDate = new Date(dateInput);
        targetDate.setHours(12, 0, 0);
    }

    try {
        const coords = await getCoordinates(city);
        document.getElementById('panLocName').innerText = coords.displayName.split(',').slice(0, 3).join(', ').toUpperCase();
        document.getElementById('panLocCoords').innerText = `${parseFloat(coords.lat).toFixed(4)}° N, ${parseFloat(coords.lng).toFixed(4)}° E • Asia/Calcutta`;

        const sunData = await getSunTimes(coords.lat, coords.lng, dateInput || new Date().toISOString().split('T')[0]);
        const sunrise = new Date(sunData.sunrise);
        const sunset = new Date(sunData.sunset);

        document.getElementById('panSunriseDisplay').innerText = formatTime12(sunrise);
        document.getElementById('panSunsetDisplay').innerText = formatTime12(sunset);

        if (window.getPanchangam && window.Observer) {
            const observer = new window.Observer(parseFloat(coords.lat), parseFloat(coords.lng), 0);
            const tzOffsetMinutes = -(new Date().getTimezoneOffset());
            const p = window.getPanchangam(targetDate, observer, { timezoneOffset: tzOffsetMinutes });

            const tId = typeof p.tithi === 'object' ? p.tithi.id : p.tithi;
            const tName = window.tithiNames[tId] || "अज्ञात (Unknown)";
            const pName = (p.paksha === 'Shukla' || p.paksha === 'Shukla Paksha') ? 'शुक्ल पक्ष (Shukla Paksha)' : 'कृष्ण पक्ष (Krishna Paksha)';
            
            const nId = typeof p.nakshatra === 'object' ? p.nakshatra.id : p.nakshatra;
            const nName = window.nakshatraNames[nId] || "अज्ञात";
            const mName = (p.masa && p.masa.name) ? p.masa.name : "Bhadrapad";

            document.getElementById('panMoonPhaseTitle').innerText = `${tName}, ${pName}`;
            document.getElementById('panMoonMasaSub').innerText = `माह: ${mName}`;

            const tEndTime = p.tithiEndTime || (p.tithi && p.tithi.endTime);
            document.getElementById('panTithiName').innerText = tName;
            document.getElementById('panTithiTime').innerText = tEndTime ? `${formatTime12(tEndTime)} तक` : "सूर्योदय पर्यन्त";
            document.getElementById('panTithiNext').innerText = `अगली: ${window.tithiNames[(tId + 1) % 30] || '...'} ↑`;

            document.getElementById('panPakshaName').innerText = pName;

            const nEndTime = p.nakshatraEndTime || (p.nakshatra && p.nakshatra.endTime);
            document.getElementById('panNakshatraName').innerText = nName;
            document.getElementById('panNakshatraTime').innerText = nEndTime ? `${formatTime12(nEndTime)} तक` : "अहोरात्र";
            document.getElementById('panNakshatraNext').innerText = `अगला: ${window.nakshatraNames[(nId + 1) % 27] || '...'} ↑`;

            const yId = typeof p.yoga === 'object' ? p.yoga.id : p.yoga;
            const yName = window.yogaNames[yId] || "अज्ञात";
            const yEndTime = p.yogaEndTime || (p.yoga && p.yoga.endTime);
            document.getElementById('panYogaName').innerText = yName;
            document.getElementById('panYogaTime').innerText = yEndTime ? `${formatTime12(yEndTime)} तक` : "दिनमान";
            document.getElementById('panYogaNext').innerText = `अगला: ${window.yogaNames[(yId + 1) % 27] || '...'} ↑`;

            const kId = typeof p.karana === 'object' ? p.karana.id : p.karana;
            const kName = fallbackKaranas[kId] || "बव (Bava)";
            const kEndTime = p.karanaEndTime || (p.karana && p.karana.endTime);
            document.getElementById('panKaranaName').innerText = kName;
            document.getElementById('panKaranaTime').innerText = kEndTime ? `${formatTime12(kEndTime)} तक` : "कालखंड";
            document.getElementById('panKaranaNext').innerText = `अगला: ${fallbackKaranas[(kId + 1) % 60] || '...'} ↑`;

            document.getElementById('panVaarName').innerText = vaarNames[targetDate.getDay()];
            document.getElementById('panMoonSign').innerText = (p.planetaryPositions && p.planetaryPositions.moon) ? p.planetaryPositions.moon.rashiName : "सिंह (Leo)";
            document.getElementById('panSunSign').innerText = (p.planetaryPositions && p.planetaryPositions.sun) ? p.planetaryPositions.sun.rashiName : "सिंह (Leo)";
            document.getElementById('panRitu').innerText = p.ritu || "शरद (Sharad)";
            document.getElementById('panAyana').innerText = p.ayana || "दक्षिणायन (Dakshinayana)";

            const cYear = targetDate.getFullYear();
            document.getElementById('panVikram').innerText = cYear + 57;
            document.getElementById('panGujarati').innerText = cYear + 57;
            document.getElementById('panShaka').innerText = cYear - 78;
            document.getElementById('panKali').innerText = cYear + 3101;

            const padaRowsContainer = document.getElementById('panPadaRows');
            padaRowsContainer.innerHTML = '';
            const syllables = padaSyllables[nId] || ["-","-","-","-"];
            const daySeg = (sunset.getTime() - sunrise.getTime()) / 4;

            for (let i = 0; i < 4; i++) {
                const row = document.createElement('div');
                row.className = 'pada-table-row';
                const padTime = new Date(sunrise.getTime() + ((i + 1) * daySeg));
                row.innerHTML = `
                    <div class="pada-char-badge">${i + 1} &nbsp; ${syllables[i]}</div>
                    <div class="pada-nak-name">${nName}</div>
                    <div class="pada-time">${formatTime24(padTime)}</div>
                `;
                padaRowsContainer.appendChild(row);
            }
        } else {
            console.warn("Panchangam library is still loading...");
            setTimeout(calculateLivePanchang, 500); 
        }
    } catch (e) {
        console.error("Panchang Error:", e);
        document.getElementById('panLocName').innerText = "Network / API Error";
        document.getElementById('panLocCoords').innerText = "Please check internet connection or city name.";
    }
}

function reduceToSingleDigitMod9(num) {
    if (num === 0) return 0;
    return (num % 9 === 0) ? 9 : (num % 9);
}

function calculateDetailedNum() {
    const dobInput = document.getElementById('detDob').value;
    const targetDateInput = document.getElementById('detTargetDate').value;
    const targetTimeInput = document.getElementById('detTargetTime').value;

    if (!dobInput || !targetDateInput || !targetTimeInput) {
        alert("कृपया सभी जानकारी सही-सही भरें।");
        return;
    }

    const dob = new Date(dobInput);
    const target = new Date(targetDateInput);
    
    const bDay = dob.getDate();
    const bMonth = dob.getMonth() + 1;
    const bYear = dob.getFullYear();

    const tDay = target.getDate();
    const tMonth = target.getMonth() + 1;
    const tYear = target.getFullYear();
    const tHour = parseInt(targetTimeInput.split(':')[0]) || 1;

    const mulank = reduceToSingleDigitMod9(bDay);
    const bhagyank = reduceToSingleDigitMod9(bDay + bMonth + bYear);
    const varshphal = reduceToSingleDigitMod9(bDay + bMonth + tYear);
    const maasphal = reduceToSingleDigitMod9(varshphal + tMonth);
    const dainikphal = reduceToSingleDigitMod9(maasphal + tDay);
    const horaphal = reduceToSingleDigitMod9(dainikphal + tHour);

    document.getElementById('resMulank').innerText = mulank;
    document.getElementById('resBhagyank').innerText = bhagyank;
    document.getElementById('resVarshphal').innerText = varshphal;
    document.getElementById('resMaasphal').innerText = maasphal;
    document.getElementById('resDainikphal').innerText = dainikphal;
    document.getElementById('resHoraphal').innerText = horaphal;

    document.getElementById('readMulank').innerHTML = traitsMeaning[mulank] || "";
    document.getElementById('readBhagyank').innerHTML = traitsMeaning[bhagyank] || "";
    document.getElementById('readVarshphal').innerHTML = periodMeaning[varshphal] || "";
    document.getElementById('readMaasphal').innerHTML = periodMeaning[maasphal] || "";
    document.getElementById('readDainikphal').innerHTML = periodMeaning[dainikphal] || "";
    document.getElementById('readHoraphal').innerHTML = periodMeaning[horaphal] || "";

    document.getElementById('reportAreaDetailed').style.display = 'block';
}

function calculateStoop() {
    let text = document.getElementById('stoopInput').value.trim();
    if (!text) {
        alert('कृपया कोई प्रश्न या नाम दर्ज करें! (Please enter text)');
        return;
    }

    let words = text.split(/\s+/);
    let initialNumbers = [];

    initialNumbers.push(calculateRoot(words.length));

    for (let word of words) {
        let cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
        if (cleanWord.length > 0) {
            initialNumbers.push(calculateRoot(cleanWord.length));
        }
    }

    let pyramid = [initialNumbers];

    while (pyramid[pyramid.length - 1].length > 1) {
        let currentRow = pyramid[pyramid.length - 1];
        let nextRow = [];
        for (let i = 0; i < currentRow.length - 1; i++) {
            let sum = currentRow[i] + currentRow[i+1];
            nextRow.push(calculateRoot(sum));
        }
        pyramid.push(nextRow);
    }

    let pyramidHTML = '';
    for (let row of pyramid) {
        pyramidHTML += row.join(' ') + '<br>';
    }

    let finalDigit = pyramid[pyramid.length - 1][0];
    
    document.getElementById('pyramidOutput').innerHTML = pyramidHTML;
    document.getElementById('finalStoopDigit').innerText = finalDigit;
    document.getElementById('stoopPredictionText').innerHTML = stoopPredictions[finalDigit] || "अज्ञात फल";
    
    document.getElementById('reportAreaStoop').style.display = 'block';
}

function getLifePathNumber(dateString) {
    let sum = dateString.replace(/-/g, '').split('').map(Number).reduce((a, b) => a + b, 0);
    return calculateRoot(sum);
}

function calculateCompatibility() {
    const name1 = document.getElementById('synName1').value || "Person 1";
    const dob1 = document.getElementById('synDob1').value;
    const name2 = document.getElementById('synName2').value || "Person 2";
    const dob2 = document.getElementById('synDob2').value;
    const relType = document.getElementById('relType').value;

    if(!dob1 || !dob2) return alert("कृपया दोनों व्यक्तियों की जन्म तिथि दर्ज करें (Please enter DOB for both).");

    const lp1 = getLifePathNumber(dob1);
    const lp2 = getLifePathNumber(dob2);
    const score = compMatrix[lp1][lp2];

    document.getElementById('scoreText').innerText = score + '%';
    document.getElementById('scoreCircle').style.background = `conic-gradient(#ff4757 ${score}%, #eee ${score}%)`;
    document.getElementById('pathNumbers').innerHTML = `<div>${name1}: अंक ${lp1}</div><div>${name2}: अंक ${lp2}</div>`;

    const verdicts = [
        { s: 80, en: "Soulmate Potential! (Excellent Match)", hi: "अद्भुत योग! (बहुत अच्छा मिलान)" },
        { s: 60, en: "Strong Connection (Good Match)", hi: "म मजबूत संबंध (अच्छा मिलान)" },
        { s: 40, en: "Karmic Bond (Requires Effort)", hi: "औसत मिलान (प्रयास की आवश्यकता है)" },
        { s: 0, en: "Challenging Dynamic (Opposite Energies)", hi: "चुनौतीपूर्ण संबंध (विपरीत ऊर्जा)" }
    ];
    let v = verdicts.find(x => score >= x.s);
    document.getElementById('matchVerdict').innerText = v.en;
    document.getElementById('hiVerdict').innerText = v.hi;

    const p1Data = numData[lp1];
    const p2Data = numData[lp2];
    
    document.getElementById('individualTraits').innerHTML = `
        <div class="person-trait">
            <strong>${name1} (${p1Data.title}):</strong> <br>
            <span style="font-size: 0.85rem;">${p1Data[relType].en}</span>
            <span class="hi-text">${p1Data[relType].hi}</span>
        </div>
        <div class="person-trait">
            <strong>${name2} (${p2Data.title}):</strong> <br>
            <span style="font-size: 0.85rem;">${p2Data[relType].en}</span>
            <span class="hi-text">${p2Data[relType].hi}</span>
        </div>
    `;

    let synEn, synHi, advEn, advHi;

    if (score >= 80) {
        synEn = `The numbers ${lp1} and ${lp2} are highly compatible. Your fundamental energies align perfectly. You naturally cover each other's blind spots without feeling restricted.`;
        synHi = `अंक ${lp1} और ${lp2} अत्यधिक अनुकूल हैं। आपकी ऊर्जा पूरी तरह से मेल खाती है। आप बिना किसी प्रतिबंध के स्वाभाविक रूप से एक-दूसरे की कमियों को पूरा करते हैं।`;
        advEn = `Maintain this beautiful harmony by continuing to express gratitude.`;
        advHi = `आभार व्यक्त करके इस खूबसूरत सामंजस्य को बनाए रखें।`;
    } else if (score >= 60) {
        synEn = `There is a solid foundation here. The ${lp1} and ${lp2} dynamic offers strong potential for growth.`;
        synHi = `यहाँ एक मजबूत नींव है। ${lp1} और ${lp2} का तालमेल विकास की मजबूत संभावना प्रदान करता है।`;
        advEn = `Focus on active listening. Remember that your partner's opposite approach is an asset.`;
        advHi = `सक्रिय रूप से सुनने पर ध्यान दें। याद रखें कि आपके साथी का अलग दृष्टिकोण एक संपत्ति है।`;
    } else if (score >= 40) {
        synEn = `The ${lp1} and ${lp2} pairing creates a Karmic friction. You are drawn together to teach each other difficult life lessons.`;
        synHi = `यह जोड़ी एक 'कर्मिक घर्षण' पैदा करती है। आप एक-दूसरे को जीवन के कठिन सबक सिखाने के लिए साथ आए हैं।`;
        advEn = `Clear boundaries and extreme compromise are required. Find a middle ground where both feel heard.`;
        advHi = `स्पष्ट सीमाएं और अत्यधिक समझौते की आवश्यकता है। एक बीच का रास्ता खोजें।`;
    } else {
        synEn = `This is a highly challenging dynamic. The energies of ${lp1} and ${lp2} naturally repel each other.`;
        synHi = `यह एक अत्यधिक चुनौतीपूर्ण संबंध है। ${lp1} और ${lp2} की ऊर्जा स्वाभाविक रूप से एक-दूसरे का विरोध करती है।`;
        advEn = `You must practice radical acceptance to make this work.`;
        advHi = `आपको पूर्ण स्वीकृति का अभ्यास करना होगा।`;
    }

    document.getElementById('enSynergy').innerText = synEn;
    document.getElementById('hiSynergy').innerText = synHi;
    document.getElementById('enAdvice').innerText = advEn;
    document.getElementById('hiAdvice').innerText = advHi;

    document.getElementById('reportAreaSynastry').style.display = 'block';
}

// ==========================================
// PDF & WHATSAPP EXPORTS
// ==========================================
function generatePDF(type) {
    let element, filename;
    if (type === 'num') {
        element = document.getElementById('reportAreaNum');
        filename = `${(currentData.name || 'User').replace(/\s+/g, '_')}_Numerology.pdf`;
    } else if (type === 'chog') {
        element = document.getElementById('reportAreaChog');
        filename = `Choghadiya_${document.getElementById('chogDateInput').value}.pdf`;
    } else if (type === 'panchang') {
        element = document.getElementById('reportAreaPanchang');
        filename = `Vedic_Panchang_${document.getElementById('panchangDateInput').value}.pdf`;
    }

    // 1. Apply PDF mode and hide buttons
    element.classList.add('pdf-export-mode');
    const actionBars = element.querySelectorAll('.report-actions-grid, .floating-action-bar');
    actionBars.forEach(bar => bar.style.display = 'none');

    // 2. Force animations to stop instantly on the live element
    element.style.animation = 'none';
    element.style.opacity = '1';

    const opt = {
        margin: 0.25,
        filename: filename,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#ffffff',
            scrollY: 0, 
            scrollX: 0
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // 3. Generate PDF and restore UI
    html2pdf().set(opt).from(element).save().then(() => {
        element.classList.remove('pdf-export-mode');
        element.style.animation = ''; // Restore animation state
        actionBars.forEach(bar => bar.style.display = '');
    }).catch(err => {
        console.error("PDF Error: ", err);
        element.classList.remove('pdf-export-mode');
        actionBars.forEach(bar => bar.style.display = '');
    });
}

function shareWhatsApp() {
    const langKey = isEnglish ? 'en' : 'hi';
    let text = `*🔮 ASTRO PRO NUMEROLOGY REPORT*\n`;
    text += `👤 *नाम (Name):* ${currentData.name}\n\n`;
    text += `🔹 *संयुक्त अंक (Compound):* ${currentData.compound}\n`;
    text += `🔹 *नामांक (Root Number):* ${currentData.root} (${planetaryLords[currentData.root][langKey]})\n`;

    if (currentData.dob) {
        text += `🔹 *मूलांक (Psychic):* ${currentData.psychic}\n`;
        text += `🔹 *भाग्यांक (Destiny):* ${currentData.destiny}\n`;
        text += `🔹 *व्यक्तिगत वर्ष (Personal Year):* ${currentData.personalYear}\n`;
        text += `🎨 *शुभ रंग:* ${luckyElements[currentData.psychic][isEnglish ? 'en_color' : 'hi_color']}\n`;
        text += `💎 *भाग्यशाली रत्न:* ${luckyElements[currentData.psychic][isEnglish ? 'en_gem' : 'hi_gem']}\n`;
    }
    text += `\n_Generated via Astro Pro PWA_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('chogDateInput').value = todayStr;
    document.getElementById('panchangDateInput').value = todayStr;
    
    const detTargetDate = document.getElementById('detTargetDate');
    if(detTargetDate) detTargetDate.value = todayStr;
    const detTargetTime = document.getElementById('detTargetTime');
    if(detTargetTime) detTargetTime.value = "12:00";

    document.getElementById('guideContent').innerHTML = guideContentHI;
    calculateChoghadiya();
});

// ==========================================
// 7. NAME OPTIMIZER LOGIC
// ==========================================
function optimizeName() {
    const rawInput = document.getElementById('optNameInput')?.value.toUpperCase().trim() || "";
    const sanitizedInput = rawInput.replace(/[^A-Z]/g, '');
    
    if (!sanitizedInput) {
        document.getElementById('optCompound').innerText = "0";
        document.getElementById('optRoot').innerText = "0";
        document.getElementById('optMeaning').innerText = isEnglish ? "Start typing to see real-time karmic results..." : "परिणाम देखने के लिए टाइप करना शुरू करें...";
        return;
    }

    let totalScore = 0;
    for (let char of sanitizedInput) {
        if (chaldeanMap[char]) totalScore += chaldeanMap[char];
    }

    let effectiveCompound = totalScore > 80 ? totalScore.toString().split('').reduce((s, d) => s + parseInt(d, 10), 0) : totalScore;
    const rootScore = calculateRoot(effectiveCompound);

    document.getElementById('optCompound').innerText = effectiveCompound;
    document.getElementById('optRoot').innerText = rootScore;

    let meaning = effectiveCompound < 10 
        ? rootPredictions[rootScore][isEnglish ? 'en' : 'hi']
        : compoundPredictions[effectiveCompound] || (isEnglish ? "N/A" : "उपलब्ध नहीं");
        
    document.getElementById('optMeaning').innerHTML = meaning;
}

// ==========================================
// 8. HORA CALCULATOR LOGIC
// ==========================================
const horaLords = {
    en: ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"],
    hi: ["सूर्य (Sun)", "शुक्र (Venus)", "बुध (Mercury)", "चन्द्रमा (Moon)", "शनि (Saturn)", "बृहस्पति (Jupiter)", "मंगल (Mars)"]
};

async function calculateHora() {
    const dateStr = document.getElementById('chogDateInput').value;
    const city = document.getElementById('cityInput').value.trim() || 'Udaipur';
    
    try {
        const coords = await getCoordinates(city);
        const sunData = await getSunTimes(coords.lat, coords.lng, dateStr);
        const sunrise = new Date(sunData.sunrise);
        const sunset = new Date(sunData.sunset);
        
        const dayDuration = sunset.getTime() - sunrise.getTime();
        const horaSeg = dayDuration / 12;
        
        const selectedDate = new Date(dateStr);
        const dayOfWeek = selectedDate.getDay();
        const startIndices = [0, 3, 6, 2, 5, 1, 4]; // Sun:0, Mon:3, Tue:6, Wed:2, Thu:5, Fri:1, Sat:4
        let currentHoraIdx = startIndices[dayOfWeek];

        const container = document.getElementById('horaList');
        const titleText = isEnglish ? "Day Hora (Sunrise to Sunset)" : "दिन का होरा (सूर्योदय से सूर्यास्त)";
        container.innerHTML = `<div class="chog-group-title">${titleText}</div>`;

        const now = new Date().getTime();
        const langKey = isEnglish ? 'en' : 'hi';
        const horaPrefix = isEnglish ? 'Hora of' : 'होरा:';
        const liveText = isEnglish ? '(LIVE)' : '(सक्रिय)';

        for (let i = 0; i < 12; i++) {
            const slotStart = new Date(sunrise.getTime() + (i * horaSeg));
            const slotEnd = new Date(sunrise.getTime() + ((i + 1) * horaSeg));
            const lord = horaLords[langKey][currentHoraIdx % 7];
            
            const isCurrentSlot = now >= slotStart.getTime() && now < slotEnd.getTime();

            const row = document.createElement('div');
            row.className = `chog-item-row ${isCurrentSlot ? 'is-current' : ''}`;
            row.innerHTML = `
                <div class="chog-row-left">
                    <div class="chog-index-badge">${i + 1}</div>
                    <div class="chog-name-block">
                        <strong>${horaPrefix} ${lord} ${isCurrentSlot ? `<span style="color:#582be8; font-size:0.75rem; font-weight:800;">${liveText}</span>` : ''}</strong>
                    </div>
                </div>
                <div class="chog-row-right">
                    <div class="chog-time-text">${formatTime12(slotStart)} - ${formatTime12(slotEnd)}</div>
                </div>
            `;
            container.appendChild(row);
            currentHoraIdx++;
        }
    } catch (e) {
        console.error("Hora Error:", e);
    }
}

// ==========================================
// 9. RAHU KAAL & DOSHA LOGIC
// ==========================================
async function calculateDoshas() {
    const dateStr = document.getElementById('chogDateInput').value;
    const city = document.getElementById('cityInput').value.trim() || 'Udaipur';
    
    try {
        const coords = await getCoordinates(city);
        const sunData = await getSunTimes(coords.lat, coords.lng, dateStr);
        const sunrise = new Date(sunData.sunrise);
        const sunset = new Date(sunData.sunset);
        
        const dayDuration = sunset.getTime() - sunrise.getTime();
        const segMs = dayDuration / 8; // 8 segments of daylight
        
        const selectedDate = new Date(dateStr);
        const dayOfWeek = selectedDate.getDay();

        const rIndex = doshaPeriods.rahu[dayOfWeek] - 1;
        const yIndex = doshaPeriods.yama[dayOfWeek] - 1;
        const gIndex = doshaPeriods.gulika[dayOfWeek] - 1;

        const getSlot = (idx) => {
            const start = new Date(sunrise.getTime() + (idx * segMs));
            const end = new Date(sunrise.getTime() + ((idx + 1) * segMs));
            return `${formatTime12(start)} - ${formatTime12(end)}`;
        };

        const container = document.getElementById('doshaList');
        const titleText = isEnglish ? "Major Daily Doshas (Daylight)" : "दिन के मुख्य दोष (सूर्योदय से सूर्यास्त)";
        
        container.innerHTML = `
            <div class="chog-group-title">${titleText}</div>
            <div class="chog-item-row" style="border-left: 4px solid #e11d48;">
                <div class="chog-name-block"><strong>${isEnglish ? "Rahu Kaal" : "राहु काल"}</strong><span style="color:#e11d48;">${isEnglish ? "(Inauspicious)" : "(अशुभ)"}</span></div>
                <div class="chog-time-text">${getSlot(rIndex)}</div>
            </div>
            <div class="chog-item-row" style="border-left: 4px solid #ea580c;">
                <div class="chog-name-block"><strong>${isEnglish ? "Yamaganda" : "यमगंड काल"}</strong><span style="color:#ea580c;">${isEnglish ? "(Death Energy)" : "(मृत्यु ऊर्जा)"}</span></div>
                <div class="chog-time-text">${getSlot(yIndex)}</div>
            </div>
            <div class="chog-item-row" style="border-left: 4px solid #64748b;">
                <div class="chog-name-block"><strong>${isEnglish ? "Gulika Kaal" : "गुलिक काल"}</strong><span style="color:#64748b;">${isEnglish ? "(Delays)" : "(विलंब कारक)"}</span></div>
                <div class="chog-time-text">${getSlot(gIndex)}</div>
            </div>
        `;
    } catch (e) {
        console.error("Dosha Error:", e);
    }
}

// ==========================================
// 10. GEMSTONE & RUDRAKSHA LOGIC
// ==========================================
function recommendGems() {
    const dobInput = document.getElementById('gemDobInput').value;
    if (!dobInput) return alert(isEnglish ? "Please select DOB." : "कृपया जन्म तिथि चुनें।");

    const parts = dobInput.split('-');
    const daySum = parts[2].split('').reduce((s, d) => s + parseInt(d, 10), 0);
    const psychicScore = calculateRoot(daySum);

    const fullDateSum = dobInput.replace(/\D/g, '').split('').reduce((s, d) => s + parseInt(d, 10), 0);
    const destinyScore = calculateRoot(fullDateSum);

    // Primary gem is based on Destiny number (Life Path) for long term success
    const rec = gemData[destinyScore];
    const rud = gemData[psychicScore]; // Rudraksha aligns well with psychic/body number

    const langKey = isEnglish ? 'En' : 'Hi';

    document.getElementById('resGem1').innerText = rec[`gem${langKey}`];
    document.getElementById('resGemDesc1').innerText = rec[`desc${langKey}`];
    
    document.getElementById('resRud').innerText = rud[`rud${langKey}`];
    document.getElementById('resRudDesc').innerText = rud[`desc${langKey}`];

    document.getElementById('reportAreaGem').style.display = 'block';
}

// ==========================================
// 11. SADE SATI TRACKER LOGIC
// ==========================================
function checkSadeSati() {
    const moonIdx = parseInt(document.getElementById('moonSignSelect').value);
    const saturnIdx = parseInt(document.getElementById('saturnTransitSelect').value);

    // Calculate astrological distance
    const dist = (saturnIdx - moonIdx + 12) % 12;
    
    let resultKey = "none";
    if (dist === 11) resultKey = 11; // 12th from moon (1st phase)
    else if (dist === 0) resultKey = 0; // On the moon (2nd phase)
    else if (dist === 1) resultKey = 1; // 2nd from moon (3rd phase)
    else if (dist === 3) resultKey = 3; // 4th from moon (Kantak Dhaiya)
    else if (dist === 7) resultKey = 7; // 8th from moon (Ashtam Dhaiya)

    const res = sadeSatiResults[resultKey];
    const langKey = isEnglish ? 'En' : 'Hi';

    document.getElementById('resSadePhase').innerText = res[`title${langKey}`];
    document.getElementById('resSadeDesc').innerText = res[`desc${langKey}`];

    document.getElementById('reportAreaSade').style.display = 'block';
}