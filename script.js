const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    // ----- Localization (i18n) -----
    const translations = {
        ru: {
            appDesc: "Калькулятор скупки лута",
            updateChecking: "Проверка обновлений...",
            updateAvailable: "Установить обновление",
            updateLatest: "У вас последняя версия",
            tabCalc: "Калькулятор",
            tabDrawing: "Рисование",
            tabHistory: "История",
            marketValue: "Рыночная стоимость (Silver)",
            salePrice: "Ожидаемая цена продажи (Silver)",
            salePricePlaceholder: "По умолчанию = Рыночной",
            marketTax: "Налог при продаже (Market Tax)",
            taxPremium: "Премиум (6.5%)",
            taxNormal: "Без Прем (10.5%)",
            taxNone: "Нет налога (0%)",
            discount: "Процент скупки (Ваш дисконт от цены продажи)",
            customPercent: "Свой %",
            payoutTitle: "К оплате продавцу",
            copyBtn: "Копировать сумму",
            copySuccess: "✓ Скопировано",
            profitTitle: "Чистый профит (после налогов)",
            recordBtn: "Записать сделку",
            recordSuccess: "✓ Записано",
            historyTitle: "История сессии",
            historyTotal: "Тотал",
            resetHistoryBtn: "Очистить историю и сбросить",
            drawTitle: "Умный блокнот (рисуйте цифры и знаки)",
            drawDesc: 'Напишите пример (например, 100+50=) и нажмите "Посчитать".',
            undoTitle: "Шаг назад",
            redoTitle: "Шаг вперед",
            eraserTitle: "Ластик",
            clearTitle: "Очистить холст",
            calcBtn: "Посчитать",
            drawReady: "Готов к рисованию",
            drawAnalysis: "Анализ...",
            drawRecognized: "Распознано: ",
            drawError: " (Ошибка парсинга)",
            drawCalcError: "Ошибка",
            drawNothing: "Ничего не найдено",
            mathResultTitle: "Результат вычислений",
            mathHistoryTitle: "История вычислений",
            emptyHistory: "Пока нет записей",
            confirmReset: "Точно сбросить калькулятор и очистить историю?",
            tabSettings: "Настройки",
            tabCrafting: "🔒 Крафт",
            tabBM: "🔒 Чёрный Рынок",
            langLabel: "Язык интерфейса / Language",
            updateLabel: "Обновления программы",
            updateInstalling: "Установка...",
            premiumKeyLabel: "Premium Ключ Активации",
            activateBtn: "Активировать Premium",
            premiumRequired: "Доступно только в Premium",
            premiumDesc: "Активируйте ключ в Настройках, чтобы использовать эту функцию.",
            craftCostLabel: "Затраты на материалы (Silver)",
            rrfLabel: "Процент возврата ресурсов (RRF %)",
            craftRealCost: "Реальная себестоимость",
            itemSearchLabel: "Предмет",
            cityLabel: "Город крафта",
            useFocusLabel: "Использовать Фокус",
            calculatedRrfLabel: "Фактический возврат (RRF %)",
            serverLabel: "Сервер",
            searchBtn: "Обновить цену на Чёрном Рынке",
            bmPriceTitle: "Цена ордера покупки (Buy Order)",
            bmSellPriceTitle: "Цена продажи (Sell Order)"
        },
        en: {
            appDesc: "Loot Buying Calculator",
            updateChecking: "Checking for updates...",
            updateAvailable: "Install Update",
            updateLatest: "You have the latest version",
            tabCalc: "Calculator",
            tabDrawing: "Drawing",
            tabHistory: "History",
            marketValue: "Market Value (Silver)",
            salePrice: "Expected Sale Price (Silver)",
            salePricePlaceholder: "Default = Market Value",
            marketTax: "Market Tax",
            taxPremium: "Premium (6.5%)",
            taxNormal: "No Premium (10.5%)",
            taxNone: "No Tax (0%)",
            discount: "Buying Discount (Your cut)",
            customPercent: "Custom %",
            payoutTitle: "Payout to Seller",
            copyBtn: "Copy Amount",
            copySuccess: "✓ Copied",
            profitTitle: "Net Profit (After tax)",
            recordBtn: "Record Trade",
            recordSuccess: "✓ Recorded",
            historyTitle: "Session History",
            historyTotal: "Total",
            resetHistoryBtn: "Clear History & Reset",
            drawTitle: "Smart Notebook (Draw numbers & signs)",
            drawDesc: 'Write a math expression (e.g. 100+50=) and click "Calculate".',
            undoTitle: "Undo",
            redoTitle: "Redo",
            eraserTitle: "Eraser",
            clearTitle: "Clear Canvas",
            calcBtn: "Calculate",
            drawReady: "Ready to draw",
            drawAnalysis: "Analyzing...",
            drawRecognized: "Recognized: ",
            drawError: " (Parse Error)",
            drawCalcError: "Error",
            drawNothing: "Nothing found",
            mathResultTitle: "Calculation Result",
            mathHistoryTitle: "Math History",
            emptyHistory: "No records yet",
            confirmReset: "Are you sure you want to clear the calculator and history?",
            tabSettings: "Settings",
            tabCrafting: "🔒 Crafting",
            tabBM: "🔒 Black Market",
            langLabel: "Language / Язык интерфейса",
            updateLabel: "Program Updates",
            updateInstalling: "Installing...",
            premiumKeyLabel: "Premium Activation Key",
            activateBtn: "Activate Premium",
            premiumRequired: "Premium Only",
            premiumDesc: "Activate your key in Settings to use this feature.",
            craftCostLabel: "Material Costs (Silver)",
            rrfLabel: "Resource Return Rate (RRF %)",
            craftRealCost: "Real Crafting Cost",
            itemSearchLabel: "Item",
            cityLabel: "Crafting City",
            useFocusLabel: "Use Focus",
            calculatedRrfLabel: "Actual Return Rate (RRF %)",
            serverLabel: "Server",
            searchBtn: "Refresh Black Market Price",
            bmPriceTitle: "Buy Order Price",
            bmSellPriceTitle: "Sell Order Price"
        }
    };

    let currentLang = localStorage.getItem('albionCalcLang') || 'ru';
    
    const t = (key) => translations[currentLang][key] || key;
    
    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('albionCalcLang', lang);
        
        // Update DOM elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) el.textContent = translations[lang][key];
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) el.placeholder = translations[lang][key];
        });

        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (translations[lang][key]) el.title = translations[lang][key];
        });

        // Update dynamic texts
        updateHistoryUI();
        updateMathHistoryUI();
        if (totalProfitDisplay) totalProfitDisplay.textContent = `${t('historyTotal')}: ` + (currentProfitTotal > 0 ? '+' : '') + formatNumber(currentProfitTotal);
        if (statusText && statusText.textContent === translations[lang === 'ru' ? 'en' : 'ru'].drawReady) statusText.textContent = t('drawReady');

        const langBtn = document.getElementById('lang-btn');
        if (langBtn) langBtn.textContent = lang === 'ru' ? 'RU' : 'EN';
    };

    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'ru' ? 'en' : 'ru');
        });
    }

    // ----- DOM Elements - Header -----
    const updateBtn = document.getElementById('update-btn');

    // ----- Auto Updater Logic -----
    if (updateBtn && ipcRenderer) {
        updateBtn.addEventListener('click', () => {
            if (updateBtn.classList.contains('available')) {
                updateBtn.textContent = t('updateInstalling');
                updateBtn.disabled = true;
                updateBtn.className = 'update-btn';
                ipcRenderer.send('install-update');
            } else if (!updateBtn.classList.contains('checking') && !updateBtn.classList.contains('latest')) {
                updateBtn.textContent = t('updateChecking');
                updateBtn.className = 'update-btn checking';
                ipcRenderer.send('check-for-updates');
            }
        });

        ipcRenderer.on('update-status', (event, data) => {
            if (data.status === 'latest') {
                updateBtn.textContent = t('updateLatest');
                updateBtn.className = 'update-btn latest';
            } else if (data.status === 'available') {
                updateBtn.textContent = 'Скачивание обновления...';
                updateBtn.className = 'update-btn checking';
            } else if (data.status === 'downloaded') {
                updateBtn.classList.remove('checking');
                updateBtn.classList.add('available');
                updateBtn.textContent = t('updateAvailable');
                updateBtn.disabled = false;
            } else if (data.status === 'error') {
                updateBtn.textContent = 'Ошибка проверки';
                updateBtn.className = 'update-btn error';
                updateBtn.disabled = false;
                setTimeout(() => {
                    updateBtn.textContent = t('updateChecking');
                    updateBtn.className = 'update-btn checking';
                    ipcRenderer.send('check-for-updates');
                }, 3000);
            }
        });
    }

    // ----- Premium Logic -----
    const VALID_KEYS = ['ALBION-PRO-2026', 'GENALBION-VIP'];
    let isPremium = localStorage.getItem('isPremium') === 'true';

    const checkPremiumState = () => {
        if (isPremium) {
            document.querySelectorAll('.premium-lock').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.premium-content').forEach(el => el.style.display = 'block');
            const status = document.getElementById('premium-status');
            if (status) {
                status.textContent = currentLang === 'ru' ? '✅ Premium активирован' : '✅ Premium activated';
                status.style.color = 'var(--success)';
            }
            // Remove locks from tab names
            const tC = document.querySelector('[data-tab="crafting"]');
            const tB = document.querySelector('[data-tab="blackmarket"]');
            if (tC) { tC.textContent = currentLang === 'ru' ? 'Крафт' : 'Crafting'; tC.dataset.i18n = ''; }
            if (tB) { tB.textContent = currentLang === 'ru' ? 'Чёрный Рынок' : 'Black Market'; tB.dataset.i18n = ''; }
        }
    };
    
    // Call initially
    setTimeout(checkPremiumState, 100);

    const activateBtn = document.getElementById('activate-key-btn');
    const keyInput = document.getElementById('premium-key-input');
    const statusDiv = document.getElementById('premium-status');

    if (activateBtn && keyInput) {
        activateBtn.addEventListener('click', () => {
            const val = keyInput.value.trim().toUpperCase();
            if (VALID_KEYS.includes(val)) {
                isPremium = true;
                localStorage.setItem('isPremium', 'true');
                checkPremiumState();
            } else {
                statusDiv.textContent = currentLang === 'ru' ? '❌ Неверный ключ' : '❌ Invalid key';
                statusDiv.style.color = 'var(--warning)';
            }
        });
    }

    // ----- Categories & Items Logic -----
    const fs = require('fs');
    const path = require('path');
    let categories = {};
    
    try {
        const catPath = path.join(__dirname, 'categories.json');
        if (fs.existsSync(catPath)) {
            categories = JSON.parse(fs.readFileSync(catPath, 'utf8'));
        }
    } catch (e) {
        console.error("Failed to load categories.json", e);
    }

    let craftSelectedItemId = null;
    let bmSelectedItemId = null;

    function buildItemId(tier, baseId, enchant) {
        return `${tier}_${baseId}${enchant}`;
    }

    function updateItemDisplay(prefix) {
        const catSelect = document.getElementById(`${prefix}-category-select`);
        const itemSelect = document.getElementById(`${prefix}-item-select`);
        const tierSelect = document.getElementById(`${prefix}-tier-select`);
        const enchantSelect = document.getElementById(`${prefix}-enchant-select`);
        const display = document.getElementById(`${prefix}-selected-item`);
        
        if (!catSelect || !itemSelect || !tierSelect || !enchantSelect || !display) return;
        
        const catKey = catSelect.value;
        const baseId = itemSelect.value;
        const tier = tierSelect.value;
        const enchant = enchantSelect.value;
        
        if (!baseId) {
            display.style.display = 'none';
            if(prefix === 'craft') craftSelectedItemId = null;
            if(prefix === 'bm') bmSelectedItemId = null;
            return;
        }

        const fullId = buildItemId(tier, baseId, enchant);
        const iconUrl = `https://render.albiononline.com/v1/item/${fullId}.png`;
        
        let itemName = baseId;
        if(categories[catKey]) {
            const itemObj = categories[catKey].items.find(i => i.id === baseId);
            if(itemObj) {
                itemName = currentLang === 'ru' ? itemObj.nameRu : itemObj.nameEn;
            }
        }
        
        display.innerHTML = `<img src="${iconUrl}" onerror="this.src='icon.png'"> 
                             <div>
                                <strong>${tier} ${itemName} ${enchant.replace('@', '.')}</strong><br>
                                <small style="color:var(--text-muted)">${fullId}</small>
                             </div>`;
        display.style.display = 'flex';
        
        if (prefix === 'craft') {
            craftSelectedItemId = fullId;
        } else if (prefix === 'bm') {
            bmSelectedItemId = fullId;
            // Optionally auto-search on BM?
            // document.getElementById('bm-search-btn').click();
        }
    }

    function populateCategories(prefix) {
        const catSelect = document.getElementById(`${prefix}-category-select`);
        const itemSelect = document.getElementById(`${prefix}-item-select`);
        const tierSelect = document.getElementById(`${prefix}-tier-select`);
        const enchantSelect = document.getElementById(`${prefix}-enchant-select`);
        
        if (!catSelect || !itemSelect) return;
        
        catSelect.innerHTML = '';
        for (const [key, data] of Object.entries(categories)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = currentLang === 'ru' ? data.nameRu : data.nameEn;
            catSelect.appendChild(opt);
        }
        
        const updateItems = () => {
            const catKey = catSelect.value;
            itemSelect.innerHTML = '';
            if (categories[catKey]) {
                categories[catKey].items.forEach(item => {
                    const opt = document.createElement('option');
                    opt.value = item.id;
                    opt.textContent = currentLang === 'ru' ? item.nameRu : item.nameEn;
                    itemSelect.appendChild(opt);
                });
            }
            updateItemDisplay(prefix);
        };
        
        catSelect.addEventListener('change', updateItems);
        itemSelect.addEventListener('change', () => updateItemDisplay(prefix));
        if(tierSelect) tierSelect.addEventListener('change', () => updateItemDisplay(prefix));
        if(enchantSelect) enchantSelect.addEventListener('change', () => updateItemDisplay(prefix));
        
        // Init
        updateItems();
    }

    populateCategories('craft');
    populateCategories('bm');

    // ----- Crafting Logic -----
    const craftCostInput = document.getElementById('craft-resources-cost');
    const craftCitySelect = document.getElementById('craft-city-select');
    const craftFocusToggle = document.getElementById('craft-focus');
    const craftCalculatedRrf = document.getElementById('craft-calculated-rrf');
    const craftFinalCost = document.getElementById('craft-final-cost');

    const updateCraftingCost = () => {
        if(!craftCostInput || !craftFinalCost) return;
        const costStr = craftCostInput.value.replace(/[^0-9]/g, '');
        const cost = parseFloat(costStr) || 0;
        
        let rrf = 15.2; // Default city return
        const city = craftCitySelect ? craftCitySelect.value : 'none';
        const focus = craftFocusToggle ? craftFocusToggle.checked : false;

        // Simplified RRF logic for demonstration
        if (city === 'none') {
            rrf = focus ? 37.1 : 0.0;
        } else if (city === 'blackzone') {
            rrf = focus ? 53.9 : 25.0; // Tier 3 HQ approx
        } else {
            // Royal cities standard 15.2%, bonus 24.8% without focus
            // With focus: 43.5% normal, 47.9% bonus
            // Without knowing exact item category, we will assume standard non-bonus 15.2% / 43.5%
            // and maybe let user tweak it later. Let's use basic city values:
            rrf = focus ? 43.5 : 15.2;
        }

        if (craftCalculatedRrf) craftCalculatedRrf.textContent = rrf.toFixed(1);

        const finalCost = cost * (1 - (rrf / 100));
        craftFinalCost.textContent = formatSilver(Math.round(finalCost));
    };

    if (craftCostInput) {
        craftCostInput.addEventListener('input', (e) => {
            const cursor = e.target.selectionStart;
            const originalLength = e.target.value.length;
            const raw = e.target.value.replace(/[^0-9]/g, '');
            if (raw) {
                e.target.value = formatSilver(parseInt(raw));
            } else {
                e.target.value = '';
            }
            const diff = e.target.value.length - originalLength;
            e.target.setSelectionRange(cursor + diff, cursor + diff);
            updateCraftingCost();
        });
    }
    if (craftCitySelect) craftCitySelect.addEventListener('change', updateCraftingCost);
    if (craftFocusToggle) craftFocusToggle.addEventListener('change', updateCraftingCost);

    // ----- Black Market Scanner -----
    const bmSearchBtn = document.getElementById('bm-search-btn');
    const bmServerSelect = document.getElementById('bm-server-select');
    const bmResults = document.getElementById('bm-results-section');
    const bmBuyPrice = document.getElementById('bm-buy-price');
    const bmSellPrice = document.getElementById('bm-sell-price');
    const bmBuyTime = document.getElementById('bm-buy-time');
    const bmSellTime = document.getElementById('bm-sell-time');

    if (bmSearchBtn) {
        bmSearchBtn.addEventListener('click', async () => {
            if (!bmSelectedItemId) return;
            const itemId = bmSelectedItemId;
            
            const server = bmServerSelect.value;
            let baseUrl = 'https://west.albion-online-data.com';
            if (server === 'east') baseUrl = 'https://east.albion-online-data.com';
            if (server === 'europe') baseUrl = 'https://europe.albion-online-data.com';

            bmSearchBtn.textContent = '...';
            bmSearchBtn.disabled = true;

            try {
                // Fetch from Albion Data Project API
                const quality = document.getElementById('bm-quality-select') ? document.getElementById('bm-quality-select').value : '1';
                const url = `${baseUrl}/api/v2/stats/prices/${itemId}?locations=Black Market&qualities=${quality}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data && data.length > 0) {
                    const item = data[0];
                    bmBuyPrice.textContent = formatSilver(item.buy_price_max || 0);
                    bmSellPrice.textContent = formatSilver(item.sell_price_min || 0);
                    
                    bmBuyTime.textContent = item.buy_price_max_date ? new Date(item.buy_price_max_date).toLocaleString() : '-';
                    bmSellTime.textContent = item.sell_price_min_date ? new Date(item.sell_price_min_date).toLocaleString() : '-';
                    
                    bmResults.style.display = 'block';
                } else {
                    bmBuyPrice.textContent = '0';
                    bmSellPrice.textContent = '0';
                    bmBuyTime.textContent = currentLang === 'ru' ? 'Нет данных' : 'No data';
                    bmSellTime.textContent = '-';
                    bmResults.style.display = 'block';
                }
            } catch (err) {
                console.error(err);
                bmBuyTime.textContent = 'API Error';
            }

            bmSearchBtn.textContent = currentLang === 'ru' ? 'Обновить цену на Чёрном Рынке' : 'Refresh Black Market Price';
            bmSearchBtn.disabled = false;
        });
    }

    // ----- DOM Elements - Classic Tab -----
    const marketValueInput = document.getElementById('market-value');
    const salePriceInput = document.getElementById('sale-price');
    const percentBtns = document.querySelectorAll('.percent-btn');
    const customPercentInput = document.getElementById('custom-percent');
    const taxBtns = document.querySelectorAll('.tax-btn');
    
    const finalPayoutDisplay = document.getElementById('final-payout');
    const profitAmountDisplay = document.getElementById('profit-amount');
    
    const copyBtn = document.getElementById('copy-btn');
    const recordTradeBtn = document.getElementById('record-trade-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    const historyList = document.getElementById('history-list');
    const totalProfitDisplay = document.getElementById('total-profit-display');

    // ----- DOM Elements - Drawing Tab -----
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const clearCanvasBtn = document.getElementById('clear-canvas-btn');
    const recognizeBtn = document.getElementById('recognize-btn');
    const statusText = document.getElementById('recognition-status');
    const mathFinalResult = document.getElementById('math-final-result');

    // ----- State -----
    let currentPercent = 20;
    let currentTax = 6.5; // Default premium tax
    let isSalePriceManuallyEdited = false;
    let tradesHistory = [];
    let currentPayout = 0;
    let currentProfit = 0;

    // Load history from localStorage
    try {
        const saved = localStorage.getItem('albionCalculatorHistory');
        if (saved) {
            tradesHistory = JSON.parse(saved);
        }
    } catch (e) {
        console.error("Error loading history", e);
    }

    const saveHistory = () => {
        try {
            localStorage.setItem('albionCalculatorHistory', JSON.stringify(tradesHistory));
        } catch (e) {
            console.error("Error saving history", e);
        }
    };

    // ----- Number Formatting -----
    const formatNumber = (num) => {
        if (isNaN(num)) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const parseNumber = (str) => {
        if (!str) return 0;
        return parseInt(str.replace(/\s/g, ''), 10) || 0;
    };

    // ----- Core Calculation (Classic Tab) -----
    const calculate = () => {
        const marketValue = parseNumber(marketValueInput.value);
        
        if (marketValue <= 0) {
            finalPayoutDisplay.textContent = '0';
            profitAmountDisplay.textContent = '0';
            if (!isSalePriceManuallyEdited) {
                salePriceInput.value = '';
            }
            currentPayout = 0;
            currentProfit = 0;
            return;
        }

        // Payout is calculated from Market Value and discount
        currentPayout = Math.floor(marketValue * (1 - (currentPercent / 100)));
        finalPayoutDisplay.textContent = formatNumber(currentPayout);

        // Auto-fill Sale Price if not manually edited
        if (!isSalePriceManuallyEdited) {
            salePriceInput.value = formatNumber(marketValue);
        }

        const salePrice = parseNumber(salePriceInput.value);
        
        // Calculate Tax from Sale Price
        const taxAmount = Math.floor(salePrice * (currentTax / 100));
        const afterTaxRevenue = salePrice - taxAmount;
        
        // Profit is Revenue - Payout
        currentProfit = afterTaxRevenue - currentPayout;
        
        profitAmountDisplay.textContent = formatNumber(currentProfit);
        profitAmountDisplay.style.color = currentProfit >= 0 ? 'var(--success)' : '#ef4444';
        profitAmountDisplay.style.textShadow = currentProfit >= 0 ? '0 0 15px var(--success-glow)' : '0 0 15px rgba(239,68,68,0.25)';
    };

    // ----- Tab Logic -----
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });

    // ----- Classic Input Handlers -----
    const handleNumberInput = (e, callback) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 1 && val.startsWith('0')) {
            val = val.substring(1);
        }
        e.target.value = val !== '' ? formatNumber(parseInt(val, 10)) : '';
        callback();
    };

    marketValueInput.addEventListener('input', (e) => {
        isSalePriceManuallyEdited = false;
        handleNumberInput(e, calculate);
    });

    salePriceInput.addEventListener('input', (e) => {
        isSalePriceManuallyEdited = true;
        handleNumberInput(e, calculate);
    });

    // ----- Tax Handlers -----
    taxBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            taxBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTax = parseFloat(btn.getAttribute('data-tax'));
            calculate();
        });
    });

    // ----- Percentage Handlers -----
    percentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            percentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = parseInt(btn.getAttribute('data-val'), 10);
            currentPercent = val;
            customPercentInput.value = val;
            calculate();
        });
    });

    customPercentInput.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val) || val < 0) val = 0;
        if (val > 100) val = 100;
        currentPercent = val;
        
        percentBtns.forEach(btn => btn.classList.remove('active'));
        const matchingBtn = Array.from(percentBtns).find(b => parseInt(b.getAttribute('data-val'), 10) === val);
        if (matchingBtn) matchingBtn.classList.add('active');

        calculate();
    });

    // ----- Trade History Logic -----
    const calculateTradeProfit = (trade) => {
        const taxAmount = Math.floor(trade.sale * (trade.tax / 100));
        const afterTaxRevenue = trade.sale - taxAmount;
        return afterTaxRevenue - trade.payout;
    };

    const updateHistoryUI = () => {
        historyList.innerHTML = '';
        
        if (tradesHistory.length === 0) {
            historyList.innerHTML = `<div class="empty-history">${t('emptyHistory')}</div>`;
            totalProfitDisplay.textContent = `${t('historyTotal')}: 0`;
            totalProfitDisplay.style.color = 'var(--text-muted)';
            totalProfitDisplay.style.background = 'transparent';
            totalProfitDisplay.style.borderColor = 'transparent';
            return;
        }

        let total = 0;
        
        // Reverse array to show newest first, but keep indexes pointing to original array
        const reversedHistory = [...tradesHistory].map((trade, idx) => ({ ...trade, originalIndex: idx })).reverse();

        reversedHistory.forEach((trade) => {
            // Recalculate profit in case sale price was edited
            const calculatedProfit = calculateTradeProfit(trade);
            total += calculatedProfit;
            
            const item = document.createElement('div');
            item.className = 'history-item';
            
            const isPositive = calculatedProfit >= 0;
            const sign = isPositive ? '+' : '';
            const profitColor = isPositive ? 'var(--success)' : '#ef4444';
            
            item.innerHTML = `
                <div class="history-item-left">
                    <div style="display:flex; align-items:center; gap:4px">
                        <span class="history-value">Продажа:</span>
                        <input type="text" class="history-sale-input" data-index="${trade.originalIndex}" value="${formatNumber(trade.sale)}" inputmode="numeric">
                    </div>
                    <span class="history-payout">Отдано: ${formatNumber(trade.payout)} (${trade.percent}%) | Налог: ${trade.tax}%</span>
                </div>
                <div class="history-profit" style="color: ${profitColor}">
                    ${sign}${formatNumber(calculatedProfit)} 🪙
                </div>
                <button class="delete-btn" data-index="${trade.originalIndex}" title="Удалить сделку">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;
            historyList.appendChild(item);
        });

        // Event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                tradesHistory.splice(idx, 1);
                saveHistory();
                updateHistoryUI();
            });
        });

        // Event listeners for history sale inputs
        document.querySelectorAll('.history-sale-input').forEach(input => {
            input.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (val.length > 1 && val.startsWith('0')) val = val.substring(1);
                e.target.value = val !== '' ? formatNumber(parseInt(val, 10)) : '';
                
                const idx = parseInt(e.target.getAttribute('data-index'), 10);
                tradesHistory[idx].sale = parseNumber(val);
                tradesHistory[idx].profit = calculateTradeProfit(tradesHistory[idx]);
                saveHistory();
                
                // Debounce full UI update to prevent losing focus while typing
                clearTimeout(input.updateTimeout);
                input.updateTimeout = setTimeout(() => {
                    updateHistoryUI();
                }, 1000);
            });
            // Update immediately on blur
            input.addEventListener('blur', () => {
                updateHistoryUI();
            });
        });

        const totalSign = total >= 0 ? '+' : '';
        const totalColor = total >= 0 ? 'var(--success)' : '#ef4444';
        const totalBg = total >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        const totalBorder = total >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
        
        totalProfitDisplay.textContent = `${t('historyTotal')}: ${totalSign}${formatNumber(total)}`;
        totalProfitDisplay.style.color = totalColor;
        totalProfitDisplay.style.background = totalBg;
        totalProfitDisplay.style.borderColor = totalBorder;
    };

    recordTradeBtn.addEventListener('click', () => {
        if (currentPayout <= 0 && currentProfit === 0) return;

        tradesHistory.push({
            payout: currentPayout,
            sale: parseNumber(salePriceInput.value),
            profit: currentProfit,
            percent: currentPercent,
            tax: currentTax
        });
        
        saveHistory();
        updateHistoryUI();
        
        // Visual feedback
        const originalText = recordTradeBtn.innerHTML;
        recordTradeBtn.innerHTML = t('recordSuccess');
        recordTradeBtn.style.background = 'var(--success)';
        recordTradeBtn.style.color = '#fff';
        recordTradeBtn.style.border = 'none';
        
        setTimeout(() => {
            recordTradeBtn.innerHTML = originalText;
            recordTradeBtn.style.background = '';
            recordTradeBtn.style.color = '';
            recordTradeBtn.style.border = '';
            
            marketValueInput.value = '';
            salePriceInput.value = '';
            isSalePriceManuallyEdited = false;
            calculate();
        }, 1000);
    });

    // ----- Action Buttons -----
    copyBtn.addEventListener('click', () => {
        const payoutText = finalPayoutDisplay.textContent.replace(/\s/g, '');
        if (payoutText === '0') return;

        navigator.clipboard.writeText(payoutText).then(() => {
            const originalContent = copyBtn.innerHTML;
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = t('copySuccess');
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = originalContent;
            }, 1500);
        });
    });

    resetBtn.addEventListener('click', () => {
        if(confirm(t('confirmReset'))) {
            marketValueInput.value = '';
            salePriceInput.value = '';
            isSalePriceManuallyEdited = false;
            
            currentPercent = 20;
            customPercentInput.value = 20;
            percentBtns.forEach(b => b.classList.remove('active'));
            const defaultBtn = document.querySelector('.percent-btn[data-val="20"]');
            if (defaultBtn) defaultBtn.classList.add('active');
            
            tradesHistory = [];
            saveHistory();
            updateHistoryUI();
            calculate();
        }
    });

    // ----- Canvas Drawing Logic (Math Tab) -----
    let isDrawing = false;
    let canvasHistory = [];
    let currentStep = -1;
    let currentBrush = 'pen'; // 'pen' or 'eraser'
    let mathHistory = [];
    
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const eraserBtn = document.getElementById('eraser-btn');
    const mathHistoryList = document.getElementById('math-history-list');

    // Load math history
    try {
        const savedMath = localStorage.getItem('albionCalculatorMathHistory');
        if (savedMath) mathHistory = JSON.parse(savedMath);
    } catch(e) {}

    const initCanvas = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000000';
    };

    const saveCanvasState = () => {
        if (currentStep < canvasHistory.length - 1) {
            canvasHistory = canvasHistory.slice(0, currentStep + 1);
        }
        canvasHistory.push(canvas.toDataURL());
        currentStep++;
    };

    const restoreCanvasState = (dataUrl) => {
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
    };
    
    // Resize canvas properly when tab is shown
    tabBtns[1].addEventListener('click', () => {
        setTimeout(() => {
            if(canvas.width !== canvas.parentElement.getBoundingClientRect().width) {
                const rect = canvas.parentElement.getBoundingClientRect();
                canvas.width = rect.width;
                // Height is fixed in CSS, but we set attribute to match pixel size
                canvas.height = 350; 
                initCanvas();
                canvasHistory = [];
                currentStep = -1;
                saveCanvasState();
            }
            updateMathHistoryUI();
        }, 50);
    });

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width),
            y: (e.clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    });

    window.addEventListener('mouseup', () => {
        if (isDrawing) {
            ctx.closePath();
            isDrawing = false;
            saveCanvasState();
        }
    });

    const clearCanvas = () => {
        initCanvas();
        saveCanvasState();
        statusText.textContent = t('drawReady');
        statusText.style.color = 'var(--primary)';
        mathFinalResult.textContent = '---';
    };

    clearCanvasBtn.addEventListener('click', clearCanvas);

    // Tools
    undoBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            restoreCanvasState(canvasHistory[currentStep]);
        }
    });

    redoBtn.addEventListener('click', () => {
        if (currentStep < canvasHistory.length - 1) {
            currentStep++;
            restoreCanvasState(canvasHistory[currentStep]);
        }
    });

    eraserBtn.addEventListener('click', () => {
        if (currentBrush === 'pen') {
            currentBrush = 'eraser';
            eraserBtn.classList.add('active');
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 36;
        } else {
            currentBrush = 'pen';
            eraserBtn.classList.remove('active');
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 18;
        }
    });

    // Math History UI
    const updateMathHistoryUI = () => {
        if(!mathHistoryList) return;
        mathHistoryList.innerHTML = '';
        if (mathHistory.length === 0) {
            mathHistoryList.innerHTML = `<div class="empty-history">${t('emptyHistory')}</div>`;
            return;
        }
        mathHistory.slice().reverse().forEach(record => {
            const el = document.createElement('div');
            el.className = 'history-item';
            el.innerHTML = `
                <div class="history-item-left">
                    <span class="history-value" style="font-size: 16px;">${record.expr}</span>
                </div>
                <div class="history-profit" style="color: var(--success); font-size: 18px;">
                    = ${record.result}
                </div>
            `;
            mathHistoryList.appendChild(el);
        });
    };

    // ----- OCR / Tesseract Math Integration -----
    
    const evaluateMath = (expr) => {
        try {
            // Replace visual variants of x/* with *
            let sanitized = expr.toLowerCase().replace(/[xх]/g, '*').replace(/[^0-9+\-*/.()%]/g, '');
            if (!sanitized) return null;
            
            // Handle percentages (e.g. 100+20% -> 100 + 100*0.2)
            // Simplified eval for generic math
            sanitized = sanitized.replace(/(\d+)%/g, '($1/100)');

            const result = new Function('return ' + sanitized)();
            if (!isFinite(result) || isNaN(result)) return null;
            
            return Number.isInteger(result) ? formatNumber(result) : formatNumber(parseFloat(result.toFixed(2)));
        } catch (e) {
            return null;
        }
    };

    recognizeBtn.addEventListener('click', async () => {
        recognizeBtn.disabled = true;
        statusText.textContent = t('drawAnalysis');
        statusText.style.color = 'var(--primary)';

        try {
            // Downscale canvas to 1/4 size for better OCR
            const scale = 0.25;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width * scale;
            tempCanvas.height = canvas.height * scale;
            const tCtx = tempCanvas.getContext('2d');
            
            // Fill white background just in case
            tCtx.fillStyle = '#ffffff';
            tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Draw original canvas scaled down
            tCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
            
            const dataUrl = tempCanvas.toDataURL('image/png');
            const worker = await Tesseract.createWorker('eng');
            
            // PSM=11 Sparse text. Find as much text as possible in no particular order.
            await worker.setParameters({
                tessedit_char_whitelist: '0123456789+-*/=xXIl|',
                tessedit_pageseg_mode: 11
            });

            const { data: { text } } = await worker.recognize(dataUrl);
            await worker.terminate();

            // Replace common misreadings of '1'
            let recognizedText = text.trim().replace(/[Il|]/g, '1');

            if (recognizedText.length > 0) {
                statusText.textContent = t('drawRecognized') + recognizedText;
                
                const calcResult = evaluateMath(recognizedText);
                
                if (calcResult !== null) {
                    statusText.style.color = 'var(--success)';
                    mathFinalResult.textContent = calcResult;
                    
                    // Add to history
                    mathHistory.push({ expr: recognizedText, result: calcResult });
                    localStorage.setItem('albionCalculatorMathHistory', JSON.stringify(mathHistory));
                    updateMathHistoryUI();

                } else {
                    statusText.textContent = t('drawRecognized') + recognizedText + t('drawError');
                    statusText.style.color = '#f59e0b';
                    mathFinalResult.textContent = t('drawCalcError');
                }
            } else {
                statusText.textContent = t('drawNothing');
                statusText.style.color = '#ef4444';
            }
        } catch (error) {
            console.error(error);
            statusText.textContent = t('drawError');
            statusText.style.color = '#ef4444';
        } finally {
            recognizeBtn.disabled = false;
        }
    });

    // Init UI state
    updateHistoryUI();
    calculate();
    marketValueInput.focus();
    setLanguage(currentLang);
});
