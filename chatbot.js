/**
 * chatbot.js
 * SATA 平台專用 AI 聊天機器人 (RAG + API Key 動態輸入版)
 */

// ==========================================
// 1. RAG 知識庫 (來源：SATA 綜合研究報告 PDF)
// ==========================================
const SATA_KNOWLEDGE_BASE = `
你現在是 SATA (劇沙成塔) 平台的 AI 投資顧問與客服。
請根據以下【RAG 知識庫綜合研究報告】的內容來回答使用者的問題。
若問題超出此文件範圍，請禮貌地回答「這超出了我的知識範圍，但我可以為您介紹 SATA 平台的核心服務。」

【SATA 平台核心資料】：
1. 品牌核心：「聚文字之細沙，築光影之高塔」。主色調為大地深棕(#5D4037)與流沙金(#C5A065)。
2. 核心價值：解決創作者「缺乏商業轉化力」與投資者「篩選成本高」的雙向痛點。
3. 商業模式：
   - 創作者：免費 AI 初篩，進階付費諮詢 (約 40,000 TWD/次，毛利 83.75%)。
   - 投資者：付費解鎖深度報告 (約 100,000 TWD/份)，投資媒合成功收取 4% 佣金。
   - 長期規劃：利潤分成 (Profit Sharing) 與成為 VC (風險投資)。
4. 成功案例 (模擬數據)：
   - 《消失的檢察官》(懸疑)：1,520次瀏覽，高商業潛力，適合 Netflix。
   - 《愛在AI元年》(科幻)：2,100次瀏覽，平台最高分(4.9)，創意價值高。
   - 《家的形狀》(劇情)：在地化故事，適合公視或輔導金。
5. AI技術：
   - 使用 Gemini 模型與 Hierarchical Transformer 分析長文本。
   - 能夠預測「全球票房」並細分五大洲市場。
   - 產出「雷達圖」(5大維度) 與「長條圖」。
6. 團隊背景：
   - CEO 李光翔：經濟學碩士，負責戰略。
   - CIO 黃品文：金融碩士，負責量化分析。
   - CFO 江芸帆：專精 ESG 與風控。
   - CMO 蔡堡丞：FinTech 技術與行銷。
7. 市場數據：2025 台灣國片票房達 7.58 億 (年增 26%)；劇本軟體市場 CAGR 12%。

請用專業、親切、具備數據洞察力的語氣回答。
`;

// ==========================================
// 2. 聊天機器人邏輯
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
});

// 初始化
function initChatbot() {
    const chatWindow = document.getElementById('chat-window');
    const apiKeyOverlay = document.getElementById('api-key-overlay');
    const chatInterface = document.getElementById('chat-interface');
    
    // 檢查 LocalStorage 是否有 API Key
    const storedKey = localStorage.getItem('sata_gemini_key');
    const isChatOpen = localStorage.getItem('sata_chat_open') === 'true';

    // 恢復視窗狀態
    if (isChatOpen) {
        chatWindow.style.display = 'flex';
    }

    // 根據是否有 Key 決定顯示哪個畫面
    if (storedKey) {
        showChatInterface();
        loadChatHistory();
    } else {
        showApiKeyInput();
    }
}

// 切換聊天視窗開關
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

// 顯示 API 輸入介面
function showApiKeyInput() {
    document.getElementById('api-key-overlay').style.display = 'flex';
    document.getElementById('chat-interface').style.display = 'none';
}

// 顯示聊天介面
function showChatInterface() {
    document.getElementById('api-key-overlay').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'flex';
}

// 儲存 API Key
function saveApiKey() {
    const inputKey = document.getElementById('api-key-input').value.trim();
    if (!inputKey) {
        alert("請輸入 API Key！");
        return;
    }
    localStorage.setItem('sata_gemini_key', inputKey);
    showChatInterface();
    // 如果是第一次進入，可以自動發送一條歡迎訊息
    if (!localStorage.getItem('sata_chat_history')) {
        appendMessage("系統：API Key 已儲存。我是 SATA AI 顧問，請問有什麼我可以幫您的？", 'bot');
    }
}

// 重設 API Key (用於錯誤處理或手動重設)
function resetApiKey() {
    localStorage.removeItem('sata_gemini_key');
    document.getElementById('api-key-input').value = ''; // 清空輸入框
    document.getElementById('api-error-msg').style.display = 'none'; // 隱藏錯誤訊息
    showApiKeyInput();
}

// 處理 Enter 鍵發送
function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

// 捲動到底部
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 載入歷史紀錄
function loadChatHistory() {
    const history = localStorage.getItem('sata_chat_history');
    if (history) {
        document.getElementById('chat-messages').innerHTML = history;
    }
    scrollToBottom();
}

// 發送訊息
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    const apiKey = localStorage.getItem('sata_gemini_key');

    if (!text) return;
    if (!apiKey) {
        showApiKeyInput();
        return;
    }

    // 1. 顯示用戶訊息
    input.value = '';
    appendMessage(text, 'user');
    
    // 2. 顯示 Loading
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'block';
    scrollToBottom();

    try {
        // 3. 呼叫 Gemini API
        const responseText = await callGeminiAPI(text, apiKey);
        
        // 4. 成功：顯示回應
        typingIndicator.style.display = 'none';
        appendMessage(responseText, 'bot');

    } catch (error) {
        // 5. 失敗：錯誤處理
        console.error("API Error:", error);
        typingIndicator.style.display = 'none';
        
        let errorMsg = "連線發生錯誤。";
        let isAuthError = false;

        if (error.message.includes("400")) {
            errorMsg = "請求格式錯誤 (400)。請檢查 API Key 是否正確。";
            isAuthError = true;
        } else if (error.message.includes("401") || error.message.includes("403")) {
            errorMsg = "API Key 無效或權限不足 (401/403)。請重新輸入。";
            isAuthError = true;
        } else if (error.message.includes("429")) {
            errorMsg = "請求次數過多 (429)。請稍後再試。";
        } else {
            errorMsg = `發生錯誤：${error.message}`;
        }

        // 顯示錯誤訊息並提供重設按鈕
        const errorHtml = `
            <div style="color: red; margin-bottom: 5px;">${errorMsg}</div>
            ${isAuthError ? '<button onclick="resetApiKey()" style="background:#5D4037; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">重新輸入 API Key</button>' : ''}
        `;
        appendMessage(errorHtml, 'bot', true); // true 表示這是錯誤訊息，不一定存入歷史，這裡我們存入以便查看
    }
}

// 插入訊息到介面
function appendMessage(content, sender, isHtml = false) {
    const chatMessages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.classList.add('message', sender);
    
    if (isHtml) {
        div.innerHTML = content;
    } else {
        // 簡單的 Markdown 處理 (粗體)
        let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // 處理換行
        formatted = formatted.replace(/\n/g, '<br>');
        div.innerHTML = formatted;
    }

    chatMessages.appendChild(div);
    
    // 儲存歷史紀錄 (限制長度避免 LocalStorage 爆掉，可選)
    localStorage.setItem('sata_chat_history', chatMessages.innerHTML);
    scrollToBottom();
}

// 實際呼叫 Gemini API
async function callGeminiAPI(userQuery, key) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: SATA_KNOWLEDGE_BASE }, // 注入 RAG 知識庫
                    { text: "使用者問題：" + userQuery }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        // 拋出包含狀態碼的錯誤
        const errData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status} - ${errData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    if(data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("API 回傳結構異常");
    }
}
