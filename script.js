const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    // ----- DOM Elements - Header -----
    const updateBtn = document.getElementById('update-btn');

    // ----- Auto Updater Logic -----
    if (updateBtn && ipcRenderer) {
        updateBtn.addEventListener('click', () => {
            if (updateBtn.classList.contains('update-available')) {
                ipcRenderer.send('install-update');
            } else if (!updateBtn.classList.contains('checking') && !updateBtn.classList.contains('latest')) {
                updateBtn.textContent = 'Проверка...';
                updateBtn.className = 'update-btn checking';
                ipcRenderer.send('check-for-updates');
            }
        });

        ipcRenderer.on('update-status', (event, data) => {
            if (data.status === 'latest') {
                updateBtn.textContent = 'Последняя версия';
                updateBtn.className = 'update-btn latest';
            } else if (data.status === 'available') {
                updateBtn.textContent = 'Скачивание обновления...';
                updateBtn.className = 'update-btn checking';
            } else if (data.status === 'downloaded') {
                updateBtn.textContent = 'Установить обновление';
                updateBtn.className = 'update-btn update-available';
            } else if (data.status === 'error') {
                updateBtn.textContent = 'Ошибка проверки';
                updateBtn.className = 'update-btn error';
            }
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
            historyList.innerHTML = '<div class="empty-history">Пока нет записанных сделок</div>';
            totalProfitDisplay.textContent = 'Тотал: 0';
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
        
        totalProfitDisplay.textContent = `Тотал: ${totalSign}${formatNumber(total)}`;
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
        recordTradeBtn.innerHTML = `✓ Записано`;
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
            copyBtn.innerHTML = `✓ Скопировано`;
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = originalContent;
            }, 1500);
        });
    });

    resetBtn.addEventListener('click', () => {
        if(confirm('Точно сбросить калькулятор и очистить историю?')) {
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
        ctx.lineWidth = 8;
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
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
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
        statusText.textContent = 'Готов к рисованию';
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
            ctx.lineWidth = 20;
        } else {
            currentBrush = 'pen';
            eraserBtn.classList.remove('active');
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 8;
        }
    });

    // Math History UI
    const updateMathHistoryUI = () => {
        if(!mathHistoryList) return;
        mathHistoryList.innerHTML = '';
        if (mathHistory.length === 0) {
            mathHistoryList.innerHTML = '<div class="empty-history">Пока нет записей</div>';
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
        statusText.textContent = 'Анализ...';
        statusText.style.color = 'var(--primary)';

        try {
            const dataUrl = canvas.toDataURL('image/png');
            const worker = await Tesseract.createWorker('eng');
            
            // PSM=6 Assumes a single uniform block of text.
            await worker.setParameters({
                tessedit_char_whitelist: '0123456789+-*/=xX()%Il|',
                tessedit_pageseg_mode: 6 
            });

            const { data: { text } } = await worker.recognize(dataUrl);
            await worker.terminate();

            // Replace common misreadings of '1'
            let recognizedText = text.trim().replace(/[Il|]/g, '1');

            if (recognizedText.length > 0) {
                statusText.textContent = 'Распознано: ' + recognizedText;
                
                const calcResult = evaluateMath(recognizedText);
                
                if (calcResult !== null) {
                    statusText.style.color = 'var(--success)';
                    mathFinalResult.textContent = calcResult;
                    
                    // Add to history
                    mathHistory.push({ expr: recognizedText, result: calcResult });
                    localStorage.setItem('albionCalculatorMathHistory', JSON.stringify(mathHistory));
                    updateMathHistoryUI();

                } else {
                    statusText.textContent = 'Распознано: ' + recognizedText + ' (Ошибка парсинга)';
                    statusText.style.color = '#f59e0b';
                    mathFinalResult.textContent = 'Ошибка';
                }
            } else {
                statusText.textContent = 'Ничего не найдено';
                statusText.style.color = '#ef4444';
            }
        } catch (error) {
            console.error(error);
            statusText.textContent = 'Ошибка OCR движка';
            statusText.style.color = '#ef4444';
        } finally {
            recognizeBtn.disabled = false;
        }
    });

    // Init UI state
    updateHistoryUI();
    calculate();
    marketValueInput.focus();
});
