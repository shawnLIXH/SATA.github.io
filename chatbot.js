/**
 * chatbot.js
 * SATA 平台專用 AI 聊天機器人
 * 更新內容：修復輸入卡住問題、新增 PDF 預設問題選單、禁止引用標註
 */

// ==========================================
// 1. RAG 知識庫 (來源：SATA 綜合研究報告 PDF)
// ==========================================
const SATA_KNOWLEDGE_BASE = `
你現在是 SATA (劇沙成塔) 平台的 AI 投資顧問與客服。
請根據以下【RAG 知識庫綜合研究報告】的內容來回答使用者的問題。

【重要指令】：
1. 請用專業、親切的口吻回答。
2. **絕對不要**使用, 或 這種引用格式。請將資訊消化後直接以自然語言回答。
3. 若問題超出範圍，請回答「這超出了我的知識範圍，但我可以為您介紹 SATA 平台的核心服務。」

【SATA 平台核心資料】：
1. 品牌核心：「聚文字之細沙，築光影之高塔」。主色調為大地深棕(#5D4037)與流沙金(#C5A065)。
2. 核心價值：解決創作者「缺乏商業轉化力」與投資者「篩選成本高」的雙向痛點。
3. 商業模式：
   - 創作者：免費 AI 初篩，進階付費諮詢 (約 40,000 TWD/次)。
   - 投資者：付費解鎖深度報告 (約 100,000 TWD/份)，投資媒合成功收取 4% 佣金。
4. 成功案例 (模擬數據)：
   - 《消失的檢察官》(懸疑)：1,520次瀏覽，適合 Netflix。
   - 《愛在AI元年》(科幻)：2,100次瀏覽，平台最高分(4.9)。
   - 《家的形狀》(劇情)：在地化故事，適合公視。
5. AI技術：
   - 使用 Hierarchical Transformer 與 NLP 分析敘事結構。
   - 利用 LSTM 分析情感曲線，偵測「棄讀風險點」。
   - 採用 RAG 技術與在地化語料庫 (金馬創投、FPP)。
6. 常見問答 (FAQ)：
   - 版權保護：設有嚴格審核機制與區塊鏈技術，確保創意不被篡改。
   - 數據信用：透過量化評分賦予素人編劇「數據信用」，解決缺乏人脈問題。
   - 票房預測：系統能細分五大洲 (北美/歐洲/亞洲等) 的票房與受眾年齡層。
`;

// ==========================================
// 2. 預設問題設定 (User Persona FAQ)
// ==========================================
const QUICK_QUESTIONS = {
    "main": [
        { text: "我是新銳創作者/編劇 ✍️", action: "category:creator" },
        { text: "我是影視投資人 💰", action: "category:investor" },
        { text: "平台技術與願景 🤖", action: "category:tech" }
    ],
    "creator": [
        { text: "分析我的劇本結構有什麼問題？", action: "ask" },
        { text: "我的劇本商業潛力得分多少？", action: "ask" },
        { text: "如何增強主角的動機？", action: "ask" },
        { text: "專業諮詢服務費用是多少？", action: "ask" },
        { text: "🔙 返回主選單", action: "category:main" }
    ],
    "investor": [
        { text: "推薦懸疑/犯罪類型的高分劇本", action: "ask" },
        { text: "幫我推薦熱度成長最快的作品", action: "ask" },
        { text: "這部劇本的全球票房預估？", action: "ask" },
        { text: "B2B 分析報告需要多少錢？", action: "ask" },
        { text: "🔙 返回主選單", action: "category:main" }
    ],
    "tech": [
        { text: "你們的 AI 用什麼技術開發的？", action: "ask" },
        { text: "SATA 是什麼意思？", action: "ask" },
        { text: "訓練資料來源是什麼？", action: "ask" },
        { text: "🔙 返回主選單", action: "category:main" }
    ]
};

// ==========================================
// 3. 全域變數與初始化
// ==========================================

window.saveApiKey = saveApiKey;
window.resetApiKey = resetApiKey;
window.sendMessage = sendMessage;
window.handleEnter = handleEnter;
window.toggleChat = toggleChat;
window.handleQuickReply = handleQuickReply;

document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
});

function initChatbot() {
    const chatWindow = document.getElementById('chat-window');
    const storedKey = localStorage.getItem('sata_gemini_key');
    const isChatOpen = localStorage.getItem('sata_chat_open') === 'true';

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
// 4. API Key 管理
// ==========================================

async function saveApiKey() {
    const inputField = document.getElementById('api-key-input');
    const saveBtn = document.querySelector('.save-api-btn');
    const errorMsg = document.getElementById('api-error-msg');
    
    const inputKey = inputField.value.trim();
    if (!inputKey) { alert("請輸入 API Key！"); return; }

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 檢測中...';
    errorMsg.style.display = 'none';

    try {
        const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${inputKey}`;
        const response = await fetch(modelsUrl);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error?.message || "無法連接 Google 伺服器");

        const availableModels = data.models || [];
        const modelNames = availableModels.map(m => m.name.replace('models/', ''));
        
        // 自動選擇最佳模型
        let bestModel = modelNames.find(m => m.includes("gemini-1.5-flash")) || 
                        modelNames.find(m => m.includes("flash")) || 
                        modelNames[0];

        if (!bestModel) throw new Error("找不到支援的模型版本");

        localStorage.setItem('sata_gemini_key', inputKey);
        localStorage.setItem('sata_gemini_model', bestModel);

        showChatInterface();
        appendMessage(`<strong>系統：</strong>連接成功！已選擇模型：${bestModel}<br>我是 SATA AI 顧問，請選擇您想了解的主題：`, 'bot', true);
        showQuickReplies('main');

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
    document.getElementById('api-key-input').value = ''; 
    document.getElementById('api-error-msg').style.display = 'none';
    showApiKeyInput();
}

// ==========================================
// 5. 介面控制
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
    document.getElementById('api-key-overlay').style.display = 'flex';
    document.getElementById('chat-interface').style.display = 'none';
}

function showChatInterface() {
    document.getElementById('api-key-overlay').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'flex';
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    if(chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

// ==========================================
// 6. 預設問題按鈕邏輯
// ==========================================

function showQuickReplies(category) {
    const questions = QUICK_QUESTIONS[category];
    if (!questions) return;

    const container = document.createElement('div');
    container.className = 'quick-reply-container';

    questions.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        if (q.action.startsWith('category:')) btn.classList.add('category');
        btn.innerText = q.text;
        btn.onclick = () => handleQuickReply(q.text, q.action);
        container.appendChild(btn);
    });

    document.getElementById('chat-messages').appendChild(container);
    scrollToBottom();
}

function handleQuickReply(text, action) {
    if (action.startsWith('category:')) {
        const category = action.split(':')[1];
        const oldContainers = document.querySelectorAll('.quick-reply-container');
        oldContainers.forEach(el => el.style.display = 'none'); // 隱藏舊的選單
        
        appendMessage(`<strong>已選擇：${text}</strong>`, 'user', true);
        showQuickReplies(category);
    } else {
        const input = document.getElementById('chat-input');
        input.value = text;
        sendMessage();
    }
}

// ==========================================
// 7. 訊息發送與 API 呼叫
// ==========================================

function loadChatHistory() {
    const history = localStorage.getItem('sata_chat_history');
    if (history) {
        document.getElementById('chat-messages').innerHTML = history;
        showQuickReplies('main'); // 重新載入時顯示主選單
    }
    scrollToBottom();
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const text = input.value.trim();
    const apiKey = localStorage.getItem('sata_gemini_key');
    const modelName = localStorage.getItem('sata_gemini_model') || 'gemini-1.5-flash';

    if (!text) return;
    if (!apiKey) { showApiKeyInput(); return; }

    // UI 處理
    input.value = ''; 
    input.disabled = true; // 鎖定
    sendBtn.disabled = true;
    
    appendMessage(text, 'user');
    
    // 移除所有舊的按鈕選單，避免重複點擊
    const oldContainers = document.querySelectorAll('.quick-reply-container');
    oldContainers.forEach(el => el.remove());

    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'block';
    scrollToBottom();

    try {
        const responseText = await callGeminiAPI(text, apiKey, modelName);
        typingIndicator.style.display = 'none';
        appendMessage(responseText, 'bot');
        
        // 根據問題類型顯示對應選單
        if (text.includes("AI") || text.includes("技術") || text.includes("SATA")) {
             showQuickReplies('tech');
        } else {
             showQuickReplies('main');
        }

    } catch (error) {
        console.error("API Error:", error);
        typingIndicator.style.display = 'none';
        
        let errorMsg = `發生錯誤：${error.message}`;
        const errorHtml = `
            <div style="color: #D32F2F; margin-bottom: 8px;">
                <i class="fas fa-exclamation-circle"></i> ${errorMsg}
            </div>
            <button onclick="window.resetApiKey()" class="reset-btn-inline">
                <i class="fas fa-redo"></i> 重新設定 API Key
            </button>
        `;
        appendMessage(errorHtml, 'bot', true);
    } finally {
        // 解鎖輸入框
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const requestBody = {
        contents: [{
            role: "user",
            parts: [
                { text: SATA_KNOWLEDGE_BASE },
                { text: "使用者問題：" + userQuery }
            ]
        }]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);

    if(data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("API 回傳異常");
    }
}
