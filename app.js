// --- PWA INSTALLATION LOGIC ---
let deferredPrompt;
const pwaBtn = document.getElementById('pwaInstallBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBtn) pwaBtn.style.display = 'inline-block';
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

// --- ASTRONOMICAL PANCHANG ENGINE ---
import('https://cdn.jsdelivr.net/npm/@ishubhamx/panchangam-js@latest/+esm').then(module => {
    window.getPanchangam = module.getPanchangam;
    window.Observer = module.Observer;
    window.tithiNames = module.tithiNames;
    window.nakshatraNames = module.nakshatraNames;
    window.yogaNames = module.yogaNames;
    window.karanaNames = module.karanaNames;
}).catch(e => console.error("Engine script load issue.", e));


// --- STATE VARIABLES ---
let isEnglish = false;
let currentData = {};
const currentDate = new Date();
let currentChogData = {};

// --- TAB SWITCHER & UI LOGIC ---
function switchTab(tab) {
    document.getElementById('tabNumerology').style.display = tab === 'num' ? 'block' : 'none';
    document.getElementById('tabChoghadiya').style.display = tab === 'chog' ? 'block' : 'none';
    document.getElementById('tabPanchang').style.display = tab === 'panchang' ? 'block' : 'none';
    document.getElementById('tabStupank').style.display = tab === 'stupank' ? 'block' : 'none';
    document.getElementById('tabDetailed').style.display = tab === 'detailed' ? 'block' : 'none';

    document.getElementById('navNum').className = tab === 'num' ? 'nav-item active' : 'nav-item';
    document.getElementById('navChog').className = tab === 'chog' ? 'nav-item active' : 'nav-item';
    document.getElementById('navPanchang').className = tab === 'panchang' ? 'nav-item active' : 'nav-item';
    document.getElementById('navStupank').className = tab === 'stupank' ? 'nav-item active' : 'nav-item';
    document.getElementById('navDetailed').className = tab === 'detailed' ? 'nav-item active' : 'nav-item';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'chog') calculateChoghadiya();
    if (tab === 'panchang') calculateLivePanchang();
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

function toggleMenuDrawer() {
    alert("Astro Pro v3.5\nChaldean Numerology, Choghadiya & Live Vedic Panchang\nDeveloped for Mobile Web & PWA.");
}

    function toggleLang() {
        isEnglish = !isEnglish;
        document.getElementById('langBtnText').innerText = isEnglish ? "HI" : "EN";

        // Titles
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

        document.getElementById('guideContent').innerHTML = isEnglish ? guideContentEN : guideContentHI;

        if (currentData.name) calculateNumerology(true);
    }

    function calculateRoot(num) {
        while (num > 9) {
            num = num.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
        }
        return num;
    }

    function generateLoShu(dateStr) {
        // Reset cells
        [1,2,3,4,5,6,7,8,9].forEach(n => {
            const el = document.getElementById('ls_' + n);
            if (el) {
                el.className = 'loshu-cell';
                el.innerText = n;
            }
        });

        const digitsStr = dateStr.replace(/\D/g, '');
        let counts = {};
        for (let d of digitsStr) {
            if (d !== '0') counts[d] = (counts[d] || 0) + 1;
        }

        for (let n in counts) {
            const el = document.getElementById('ls_' + n);
            if (el) {
                el.className = 'loshu-cell active';
                el.innerText = n.repeat(counts[n]);
            }
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

            // Chaldean Logic: Reductions above 80
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

            // UI Stat Update
            document.getElementById('stTotalNum').innerText = effectiveCompound;
            document.getElementById('stTotalSub').innerText = originalTotal > 80 ? `Orig: ${originalTotal}` : `Total ${effectiveCompound}`;
            document.getElementById('stRootNum').innerText = rootScore;
            document.getElementById('stRootLord').innerText = planetaryLords[rootScore][isEnglish ? 'en' : 'hi'];

            document.getElementById('calcBreakdown').innerHTML = `<strong>∑ नामांक:</strong> ${breakdownParts.join(' + ')} = <strong>${originalTotal}</strong>${reductionMsg}`;
            document.getElementById('repNameDisplay').innerText = rawInput;

            const langKey = isEnglish ? 'en' : 'hi';
            document.getElementById('rootPredictionText').innerText = rootPredictions[rootScore][langKey];

            // 1-9 Root Number Logic
            let compoundText = "";
            if (effectiveCompound < 10) {
                compoundText = isEnglish
                    ? "Numbers 1 through 9 are known as Root Numbers or Single Digits. Since this name totals a single digit, it means there is no hidden karmic 'compound' influence attached. What you see is what you get. Please refer to the standard planetary meaning of the Root Number above."
                    : "1 से 9 तक की संख्याओं को मूलांक या एकल अंक कहा जाता है। चूंकि इस नाम का कुल योग एक एकल अंक है, इसका अर्थ है कि इसके साथ कोई छिपा हुआ कार्मिक 'संयुक्त' प्रभाव नहीं है। जो दिखता है वही सच है। कृपया ऊपर दिए गए नामांक (Root Number) के फल को ही पढ़ें।";
            } else {
                compoundText = compoundPredictions[effectiveCompound] || (isEnglish ? "N/A" : "उपलब्ध नहीं");
            }
            document.getElementById('predictionText').innerText = compoundText;

            // DOB Calculations
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

                generateLoShu(dobInput);

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

// --- UTILITY FUNCTIONS ---
    function formatTime12(dateObj) {
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    function formatTime24(dateObj) {
        return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
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
        document.querySelectorAll('.city-chip').forEach(c => {
            c.className = c.innerText.toLowerCase() === cityName.toLowerCase() ? 'city-chip active' : 'city-chip';
        });
        calculateChoghadiya();
    }

    function selectCityPanchang(cityName) {
        document.getElementById('panchangCityInput').value = cityName;
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

    // --- CHOGHADIYA LOGIC ---
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

    // --- LIVE PANCHANG LOGIC ---
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

            const sunData = await getSunTimes(coords.lat, coords.lng, dateInput);
            const sunrise = new Date(sunData.sunrise);
            const sunset = new Date(sunData.sunset);

            document.getElementById('panSunriseDisplay').innerText = formatTime12(sunrise);
            document.getElementById('panSunsetDisplay').innerText = formatTime12(sunset);

            if (window.getPanchangam && window.Observer) {
                const observer = new window.Observer(parseFloat(coords.lat), parseFloat(coords.lng), 0);
                const tzOffsetMinutes = -(new Date().getTimezoneOffset());
                const p = window.getPanchangam(targetDate, observer, { timezoneOffset: tzOffsetMinutes });

                const tName = window.tithiNames[p.tithi];
                const pName = p.paksha === 'Shukla' ? 'शुक्ल पक्ष (Shukla Paksha)' : 'कृष्ण पक्ष (Krishna Paksha)';
                const nName = window.nakshatraNames[p.nakshatra];
                const mName = p.masa?.name || "Bhadrapad";

                document.getElementById('panMoonPhaseTitle').innerText = `${tName}, ${pName}`;
                document.getElementById('panMoonMasaSub').innerText = `माह: ${mName}`;

                document.getElementById('panTithiName').innerText = tName;
                document.getElementById('panTithiTime').innerText = p.tithiEndTime ? `${formatTime12(p.tithiEndTime)} तक` : "सूर्योदय पर्यन्त";
                document.getElementById('panTithiNext').innerText = `अगली: ${window.tithiNames[(p.tithi + 1) % 30]} ↑`;

                document.getElementById('panPakshaName').innerText = pName;

                document.getElementById('panNakshatraName').innerText = nName;
                document.getElementById('panNakshatraTime').innerText = p.nakshatraEndTime ? `${formatTime12(p.nakshatraEndTime)} तक` : "अहोरात्र";
                document.getElementById('panNakshatraNext').innerText = `अगला: ${window.nakshatraNames[(p.nakshatra + 1) % 27]} ↑`;

                document.getElementById('panYogaName').innerText = window.yogaNames[p.yoga];
                document.getElementById('panYogaTime').innerText = p.yogaEndTime ? `${formatTime12(p.yogaEndTime)} तक` : "दिनमान";
                document.getElementById('panYogaNext').innerText = `अगला: ${window.yogaNames[(p.yoga + 1) % 27]} ↑`;

                const kIndex = typeof p.karana === 'object' ? p.karana.id : p.karana;
                const kName = fallbackKaranas[kIndex] || "बव (Bava)";
                document.getElementById('panKaranaName').innerText = kName;
                document.getElementById('panKaranaTime').innerText = p.karanaEndTime ? `${formatTime12(p.karanaEndTime)} तक` : "कालखंड";
                document.getElementById('panKaranaNext').innerText = `अगला: ${fallbackKaranas[(kIndex + 1) % 60]} ↑`;

                document.getElementById('panVaarName').innerText = vaarNames[targetDate.getDay()];

                document.getElementById('panMoonSign').innerText = p.planetaryPositions?.moon?.rashiName || "सिंह (Leo)";
                document.getElementById('panSunSign').innerText = p.planetaryPositions?.sun?.rashiName || "सिंह (Leo)";
                document.getElementById('panRitu').innerText = p.ritu || "शरद (Sharad)";
                document.getElementById('panAyana').innerText = "दक्षिणायन (Dakshinayana)";

                const cYear = targetDate.getFullYear();
                document.getElementById('panVikram').innerText = cYear + 57;
                document.getElementById('panGujarati').innerText = cYear + 57;
                document.getElementById('panShaka').innerText = cYear - 78;
                document.getElementById('panKali').innerText = cYear + 3101;

                const padaRowsContainer = document.getElementById('panPadaRows');
                padaRowsContainer.innerHTML = '';
                const syllables = padaSyllables[p.nakshatra] || ["-","-","-","-"];
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
            }
        } catch (e) {
            console.error("Panchang Error:", e);
        }
    }

    // --- PDF & WHATSAPP EXPORTS ---
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

        element.classList.add('pdf-export-mode');
        const opt = {
            margin: 0.25,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            element.classList.remove('pdf-export-mode');
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

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('chogDateInput').value = todayStr;
    document.getElementById('panchangDateInput').value = todayStr;
    document.getElementById('guideContent').innerHTML = guideContentHI;

    calculateChoghadiya();
});

function switchTab(tab) {
    document.getElementById('tabNumerology').style.display = tab === 'num' ? 'block' : 'none';
    document.getElementById('tabChoghadiya').style.display = tab === 'chog' ? 'block' : 'none';
    document.getElementById('tabPanchang').style.display = tab === 'panchang' ? 'block' : 'none';
    document.getElementById('tabStupank').style.display = tab === 'stupank' ? 'block' : 'none';
    document.getElementById('tabDetailed').style.display = tab === 'detailed' ? 'block' : 'none';

    document.getElementById('navNum').className = tab === 'num' ? 'nav-item active' : 'nav-item';
    document.getElementById('navChog').className = tab === 'chog' ? 'nav-item active' : 'nav-item';
    document.getElementById('navPanchang').className = tab === 'panchang' ? 'nav-item active' : 'nav-item';
    document.getElementById('navStupank').className = tab === 'stupank' ? 'nav-item active' : 'nav-item';
    document.getElementById('navDetailed').className = tab === 'detailed' ? 'nav-item active' : 'nav-item';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'chog') calculateChoghadiya();
    if (tab === 'panchang') calculateLivePanchang();
}

// --- DETAILED NUMEROLOGY LOGIC ---
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

    // Calculations
    const mulank = reduceToSingleDigitMod9(bDay);
    const bhagyank = reduceToSingleDigitMod9(bDay + bMonth + bYear);
    const varshphal = reduceToSingleDigitMod9(bDay + bMonth + tYear);
    const maasphal = reduceToSingleDigitMod9(varshphal + tMonth);
    const dainikphal = reduceToSingleDigitMod9(maasphal + tDay);
    const horaphal = reduceToSingleDigitMod9(dainikphal + tHour);

    // Update UI numbers
    document.getElementById('resMulank').innerText = mulank;
    document.getElementById('resBhagyank').innerText = bhagyank;
    document.getElementById('resVarshphal').innerText = varshphal;
    document.getElementById('resMaasphal').innerText = maasphal;
    document.getElementById('resDainikphal').innerText = dainikphal;
    document.getElementById('resHoraphal').innerText = horaphal;

    // Update UI readings
    document.getElementById('readMulank').innerHTML = traitsMeaning[mulank] || "";
    document.getElementById('readBhagyank').innerHTML = traitsMeaning[bhagyank] || "";
    document.getElementById('readVarshphal').innerHTML = periodMeaning[varshphal] || "";
    document.getElementById('readMaasphal').innerHTML = periodMeaning[maasphal] || "";
    document.getElementById('readDainikphal').innerHTML = periodMeaning[dainikphal] || "";
    document.getElementById('readHoraphal').innerHTML = periodMeaning[horaphal] || "";

    document.getElementById('reportAreaDetailed').style.display = 'block';
}

// In your existing DOMContentLoaded listener at the bottom of app.js, add these lines:
// document.getElementById('detTargetDate').value = todayStr;
// document.getElementById('detTargetTime').value = "12:00";

// --- STUPANK LOGIC ---
function calculateStoop() {
    let text = document.getElementById('stoopInput').value.trim();
    if (!text) {
        alert('कृपया कोई प्रश्न या नाम दर्ज करें! (Please enter text)');
        return;
    }

    let words = text.split(/\s+/);
    let initialNumbers = [];

    // 1. First number is the total count of words reduced to a single digit
    initialNumbers.push(calculateRoot(words.length));

    // 2. Next numbers are the letter counts of each word
    for (let word of words) {
        let cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
        if (cleanWord.length > 0) {
            initialNumbers.push(calculateRoot(cleanWord.length));
        }
    }

    let pyramid = [initialNumbers];

    // 3. Build pyramid by summing adjacent numbers
    while (pyramid[pyramid.length - 1].length > 1) {
        let currentRow = pyramid[pyramid.length - 1];
        let nextRow = [];
        for (let i = 0; i < currentRow.length - 1; i++) {
            let sum = currentRow[i] + currentRow[i+1];
            nextRow.push(calculateRoot(sum)); // Reusing existing calculateRoot function
        }
        pyramid.push(nextRow);
    }

    // 4. Render HTML
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