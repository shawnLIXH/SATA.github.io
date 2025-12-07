/**
 * chatbot.js
 * SATA 平台專用 AI 聊天機器人
 * 更新內容：橫向捲動卡片 UI、限制回答長度 (三段內)、過濾 [cite] 標籤
 */

// ==========================================
// 1. RAG 知識庫
// ==========================================
const SATA_KNOWLEDGE_BASE = `
你現在是 SATA (劇沙成塔) 平台的 AI 投資顧問與客服。
請根據以下【RAG 知識庫綜合研究報告】的內容來回答使用者的問題。

【重要指令】：
1. 請用專業、親切的口吻回答。
2. **回答請精簡，嚴格控制在三段以內 (約 150 字)。**
3. **絕對不要**使用 引用格式。
4. 若問題超出範圍，請回答「這超出了我的知識範圍，但我可以為您介紹 SATA 平台的核心服務。」

【SATA 平台核心資料】：
1. 品牌核心：「聚文字之細沙，築光影之高塔」。主色調為大地深棕與流沙金。
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
   - 版權保護：設有嚴格審核機制與區塊鏈技術。
   - 數據信用：透過量化評分賦予素人編劇「數據信用」。
   - 票房預測：系統能細分五大洲 (北美/歐洲/亞洲等) 的票房與受眾年齡層。
`;

// ==========================================
// 2. 預設問題設定
// ==========================================
const QUICK_QUESTIONS = {
    "main": [
        { text: "我是新銳創作者", sub: "劇本分析與諮詢", icon: "fas fa-pen-fancy", action: "category:creator" },
        { text: "我是影視投資人", sub: "尋找潛力標的", icon: "fas fa-sack-dollar", action: "category:investor" },
        { text: "平台技術願景", sub: "AI 原理與數據", icon: "fas fa-robot", action: "category:tech" }
    ],
    "creator": [
        { text: "分析劇本結構", sub: "找出劇情盲點", icon: "fas fa-search", action: "ask:請分析我的劇本結構有什麼常見問題？" },
        { text: "商業潛力評估", sub: "預測市場價值", icon: "fas fa-chart-line", action: "ask:我的劇本在「商業潛力」這個維度通常如何評分？" },
        { text: "專業諮詢費用", sub: "人工顧問輔導", icon: "fas fa-file-invoice-dollar", action: "ask:專業諮詢服務費用是多少？包含什麼？" },
        { text: "返回主選單", sub: "回上一層", icon: "fas fa-undo", action: "category:main" }
    ],
    "investor": [
        { text: "推薦高分劇本", sub: "懸疑/犯罪類型", icon: "fas fa-star", action: "ask:最近有哪些「懸疑/犯罪」類型的高分劇本？" },
        { text: "全球票房預估", sub: "AI 市場預測", icon: "fas fa-globe-asia", action: "ask:這部劇本的全球票房預估是如何計算的？" },
        { text: "B2B 分析報告", sub: "盡職調查服務", icon: "fas fa-file-contract", action: "ask:取得一份完整的 B2B 劇本分析報告需要多少錢？" },
        { text: "返回主選單", sub: "回上一層", icon: "fas fa-undo", action: "category:main" }
    ],
    "tech": [
        { text: "AI 技術原理", sub: "Transformer & RAG", icon: "fas fa-microchip", action: "ask:你們的 AI 是用什麼技術開發的？" },
        { text: "SATA 的意義", sub: "品牌名稱由來", icon: "fas fa-signature", action: "ask:SATA 是什麼意思？" },
        { text: "訓練資料來源", sub: "金馬/FPP", icon: "fas fa-database", action: "ask:你們的訓練資料來源是什麼？" },
        { text: "返回主選單", sub: "回上一層", icon: "fas fa-undo", action: "category:main" }
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
window.scrollQuickReply = scrollQuickReply; // 新增捲動函式

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
        
        let bestModel = modelNames.find(m => m.includes("gemini-1.5-flash")) || 
                        modelNames.find(m => m.includes("flash")) || 
                        modelNames[0];

        if (!bestModel) throw new Error("找不到支援的模型版本");

        localStorage.setItem('sata_gemini_key', inputKey);
        localStorage.setItem('sata_gemini_model', bestModel);

        showChatInterface();
        appendMessage(`<strong>系統：</strong>連接成功！(${bestModel})<br>我是 SATA AI 顧問，請選擇您想了解的主題：`, 'bot', true);
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
// 6. 卡片式預設問題邏輯 (新增左右捲動)
// ==========================================

function showQuickReplies(category) {
    const questions = QUICK_QUESTIONS[category];
    if (!questions) return;

    // 建立外層 Wrapper (包含左右箭頭)
    const wrapper = document.createElement('div');
    wrapper.className = 'quick-reply-wrapper';

    // 左箭頭
    const leftBtn = document.createElement('button');
    leftBtn.className = 'scroll-btn';
    leftBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    leftBtn.onclick = () => scrollQuickReply(wrapper, -150); // 往左捲動 150px

    // 容器
    const container = document.createElement('div');
    container.className = 'quick-reply-container';

    // 產生卡片
    questions.forEach(q => {
        const btn = document.createElement('div');
        btn.className = 'quick-reply-btn';
        if (q.action.startsWith('category:')) btn.classList.add('category');
        
        btn.innerHTML = `
            <i class="${q.icon} quick-reply-icon"></i>
            <div style="font-weight:bold; margin-bottom:4px;">${q.text}</div>
            <div style="font-size:0.75rem; color:#666;">${q.sub || ''}</div>
        `;
        btn.onclick = () => handleQuickReply(q.text, q.action);
        container.appendChild(btn);
    });

    // 右箭頭
    const rightBtn = document.createElement('button');
    rightBtn.className = 'scroll-btn';
    rightBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    rightBtn.onclick = () => scrollQuickReply(wrapper, 150); // 往右捲動 150px

    // 組裝
    wrapper.appendChild(leftBtn);
    wrapper.appendChild(container);
    wrapper.appendChild(rightBtn);

    document.getElementById('chat-messages').appendChild(wrapper);
    scrollToBottom();
}

// 捲動函式
function scrollQuickReply(wrapper, amount) {
    const container = wrapper.querySelector('.quick-reply-container');
    if (container) {
        container.scrollBy({ left: amount, behavior: 'smooth' });
    }
}

function handleQuickReply(text, action) {
    if (action.startsWith('category:')) {
        const category = action.split(':')[1];
        // 隱藏舊的選單 Wrapper
        const oldWrappers = document.querySelectorAll('.quick-reply-wrapper');
        oldWrappers.forEach(el => el.style.display = 'none'); 
        
        appendMessage(`<strong>已選擇：${text}</strong>`, 'user', true);
        showQuickReplies(category);
    } else if (action.startsWith('ask:')) {
        const question = action.split(':')[1];
        const input = document.getElementById('chat-input');
        input.value = question;
        sendMessage();
    }
}

// ==========================================
// 7. 訊息發送與 API 呼叫 (含文字淨化)
// ==========================================

function loadChatHistory() {
    const history = localStorage.getItem('sata_chat_history');
    if (history) {
        document.getElementById('chat-messages').innerHTML = history;
        showQuickReplies('main'); 
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

    input.value = ''; 
    input.disabled = true; 
    sendBtn.disabled = true;
    
    appendMessage(text, 'user');
    
    // 移除舊的按鈕
    const oldWrappers = document.querySelectorAll('.quick-reply-wrapper');
    oldWrappers.forEach(el => el.remove());

    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'block';
    scrollToBottom();

    try {
        let responseText = await callGeminiAPI(text, apiKey, modelName);
        
        // --- 文字淨化 ---
        responseText = responseText
            .replace(/\]*\]/g, "")
            .replace(/\]*\]/g, "")
            .replace(/\[cite_start\]/g, "")
            .replace(/\[cite_end\]/g, "");

        typingIndicator.style.display = 'none';
        appendMessage(responseText, 'bot');
        
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
