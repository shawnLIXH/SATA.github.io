/**
 * chatbot.js
 * SATA 平台專用 AI 聊天機器人 (RAG + 自動模型偵測 + 錯誤恢復版)
 */

// ==========================================
// 1. RAG 知識庫
// ==========================================
const SATA_KNOWLEDGE_BASE = `
你現在是 SATA (劇沙成塔) 平台的 AI 投資顧問與客服。
請根據以下【RAG 知識庫綜合研究報告】的內容來回答使用者的問題。

【SATA 平台核心資料】：
1. 品牌核心：「聚文字之細沙，築光影之高塔」。主色調為大地深棕(#5D4037)與流沙金(#C5A065)。
2. 核心價值：解決創作者「缺乏商業轉化力」與投資者「篩選成本高」的雙向痛點。
3. 商業模式：
   - 創作者：免費 AI 初篩，進階付費諮詢 (約 40,000 TWD/次，毛利 83.75%)。
   - 投資者：付費解鎖深度報告 (約 100,000 TWD/份)，投資媒合成功收取 4% 佣金。
4. 成功案例 (模擬數據)：
   - 《消失的檢察官》(懸疑)：1,520次瀏覽，高商業潛力，適合 Netflix。
   - 《愛在AI元年》(科幻)：2,100次瀏覽，平台最高分(4.9)，創意價值高。
   - 《家的形狀》(劇情)：在地化故事，適合公視或輔導金。
5. AI技術：
   - 使用 Gemini 模型與 Hierarchical Transformer 分析長文本。
   - 能夠預測「全球票房」並細分五大洲市場。
6. 團隊背景：CEO 李光翔、CIO 黃品文、CFO 江芸帆、CMO 蔡堡丞。

請用專業、親切、具備數據洞察力的語氣回答。
`;

// ==========================================
// 2. 全域變數與初始化
// ==========================================

// 將關鍵函數掛載到 window，確保 HTML 中的 onclick 找得到
window.saveApiKey = saveApiKey;
window.resetApiKey = resetApiKey;
window.sendMessage = sendMessage;
window.handleEnter = handleEnter;
window.toggleChat = toggleChat;

document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
});

function initChatbot() {
    const chatWindow = document.getElementById('chat-window');
    
    // 檢查 LocalStorage
    const storedKey = localStorage.getItem('sata_gemini_key');
    const isChatOpen = localStorage.getItem('sata_chat_open') === 'true';

    // 恢復視窗狀態
    if (isChatOpen && chatWindow) {
        chatWindow.style.display = 'flex';
    }

    if (storedKey) {
        showChatInterface();
        loadChatHistory();
    } else {
        showApiKeyInput();
    }
}

// ==========================================
// 3. API Key 管理與自動偵測 (核心修正)
// ==========================================

async function saveApiKey() {
    const inputField = document.getElementById('api-key-input');
    const saveBtn = document.querySelector('.save-api-btn');
    const errorMsg = document.getElementById('api-error-msg');
    
    const inputKey = inputField.value.trim();
    if (!inputKey) {
        alert("請輸入 API Key！");
        return;
    }

    // UI 進入 Loading 狀態
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在檢測 Key...';
    errorMsg.style.display = 'none';

    try {
        // 步驟 1: 測試 Key 並獲取可用模型列表 (解決 404 問題)
        const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${inputKey}`;
        const response = await fetch(modelsUrl);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "無法連接 Google 伺服器");
        }

        // 步驟 2: 篩選出支援 generateContent 的模型
        // 優先順序：gemini-1.5-flash -> gemini-2.0-flash -> 列表中的第一個 flash
        const availableModels = data.models || [];
        let bestModel = "";

        const modelNames = availableModels.map(m => m.name.replace('models/', ''));
        console.log("可用模型:", modelNames);

        if (modelNames.includes("gemini-1.5-flash")) {
            bestModel = "gemini-1.5-flash";
        } else if (modelNames.some(m => m.includes("gemini-1.5-flash"))) {
            bestModel = modelNames.find(m => m.includes("gemini-1.5-flash"));
        } else if (modelNames.includes("gemini-2.0-flash-exp")) {
            bestModel = "gemini-2.0-flash-exp";
        } else {
            // 隨便找一個 flash，如果沒有就拿第一個
            bestModel = modelNames.find(m => m.includes("flash")) || modelNames[0];
        }

        if (!bestModel) {
            throw new Error("您的 Key 有效，但找不到支援聊天的模型版本。");
        }

        // 步驟 3: 儲存 Key 和 模型名稱
        localStorage.setItem('sata_gemini_key', inputKey);
        localStorage.setItem('sata_gemini_model', bestModel); // 存下正確的模型名稱

        // 成功，切換介面
        showChatInterface();
        appendMessage(`<strong>系統：</strong>連接成功！<br>已自動為您選擇模型：${bestModel}<br>我是 SATA AI 顧問，請問有什麼我可以幫您的？`, 'bot', true);

    } catch (error) {
        console.error(error);
        errorMsg.innerText = `驗證失敗：${error.message}`;
        errorMsg.style.display = 'block';
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = '啟動 AI 服務';
    }
}

function resetApiKey() {
    localStorage.removeItem('sata_gemini_key');
    localStorage.removeItem('sata_gemini_model');
    
    // 清空輸入框
    const inputField = document.getElementById('api-key-input');
    if(inputField) inputField.value = ''; 
    
    const errorMsg = document.getElementById('api-error-msg');
    if(errorMsg) errorMsg.style.display = 'none';

    showApiKeyInput();
}

// ==========================================
// 4. 介面控制
// ==========================================

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';
    
    if (isHidden) {
        chatWindow.style.display = 'flex';
        localStorage.setItem('sata_chat_open', 'true');
        scrollToBottom();
    } else {
        chatWindow.style.display = 'none';
        localStorage.setItem('sata_chat_open', 'false');
    }
}

function showApiKeyInput() {
    const overlay = document.getElementById('api-key-overlay');
    const interface = document.getElementById('chat-interface');
    if(overlay) overlay.style.display = 'flex';
    if(interface) interface.style.display = 'none';
}

function showChatInterface() {
    const overlay = document.getElementById('api-key-overlay');
    const interface = document.getElementById('chat-interface');
    if(overlay) overlay.style.display = 'none';
    if(interface) interface.style.display = 'flex';
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    if(chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

// ==========================================
// 5. 訊息處理與 API 呼叫
// ==========================================

function loadChatHistory() {
    const history = localStorage.getItem('sata_chat_history');
    if (history) {
        document.getElementById('chat-messages').innerHTML = history;
    }
    scrollToBottom();
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    const apiKey = localStorage.getItem('sata_gemini_key');
    // 讀取剛剛自動偵測到的模型，如果沒有預設 fallback
    const modelName = localStorage.getItem('sata_gemini_model') || 'gemini-1.5-flash';

    if (!text) return;
    if (!apiKey) {
        showApiKeyInput();
        return;
    }

    // 顯示用戶訊息
    input.value = '';
    appendMessage(text, 'user');
    
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'block';
    scrollToBottom();

    try {
        const responseText = await callGeminiAPI(text, apiKey, modelName);
        typingIndicator.style.display = 'none';
        appendMessage(responseText, 'bot');

    } catch (error) {
        console.error("API Error:", error);
        typingIndicator.style.display = 'none';
        
        let errorMsg = `發生錯誤：${error.message}`;
        let showResetBtn = true;

        // 錯誤 HTML 包含重新設定按鈕
        const errorHtml = `
            <div style="color: #D32F2F; margin-bottom: 8px;">
                <i class="fas fa-exclamation-circle"></i> ${errorMsg}
            </div>
            <button onclick="window.resetApiKey()" class="reset-btn-inline">
                <i class="fas fa-redo"></i> 重新設定 API Key
            </button>
        `;
        appendMessage(errorHtml, 'bot', true);
    }
}

function appendMessage(content, sender, isHtml = false) {
    const chatMessages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.classList.add('message', sender);
    
    if (isHtml) {
        div.innerHTML = content;
    } else {
        let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\n/g, '<br>');
        div.innerHTML = formatted;
    }

    chatMessages.appendChild(div);
    localStorage.setItem('sata_chat_history', chatMessages.innerHTML);
    scrollToBottom();
}

async function callGeminiAPI(userQuery, key, model) {
    // 使用動態偵測到的 model 名稱
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: SATA_KNOWLEDGE_BASE },
                    { text: "使用者問題：" + userQuery }
                ]
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || `HTTP Error ${response.status}`);
    }

    if(data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("API 回傳結構異常，請稍後再試。");
    }
}
