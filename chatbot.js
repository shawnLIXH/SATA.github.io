/**
 * chatbot.js
 * SATA 平台專用 AI 聊天機器人
 * 更新內容：整合完整 PDF 知識庫、橫向捲動 UI、限制回答長度、修復輸入框
 */

// ==========================================
// 1. RAG 知識庫 (來源：SATA 綜合研究報告 PDF 全文)
// ==========================================
const SATA_KNOWLEDGE_BASE = `
你現在是 SATA (劇沙成塔) 平台的 AI 投資顧問與客服。
請根據以下【RAG 知識庫綜合研究報告】的內容來回答使用者的問題。

【重要指令】：
1. 請用專業、親切的口吻回答。
2. **回答請精簡，嚴格控制在三段以內 (約 150 字)。**
3. **絕對不要**使用 引用格式。
4. 若問題超出範圍，請回答「這超出了我的知識範圍，但我可以為您介紹 SATA 平台的核心服務。」

【完整知識庫內容】：
SATA 劇沙成塔: AI 影視孵化與投資平台 RAG 知識庫綜合研究報告

1. 執行摘要與品牌核心論述
1.1 品牌識別與設計哲學
本報告旨在為「SATA劇沙成塔」之聊天機器人RAG(檢索增強生成)系統構建詳盡的基礎知識庫。SATA 平台(Script Al Tech & Analysis)的品牌核心構建於一個深刻的隱喻:「聚文字之細沙,築光影之高塔」。此一核心標語不僅是行銷詞彙,更象徵著平台在碎片化的創意產業中扮演的聚合者角色。在影視產業的原始生態中,無數的創意靈感如同散落的細沙,雖然本質珍貴但缺乏結構支撐,難以獨自成形。SATA的存在意義,即在於透過科技的結構與資本的黏合劑,將這些離散的文字細沙堆砌成宏偉的光影高塔,亦即將劇本轉化為具備商業與藝術價值的影視作品。

在視覺識別系統(VI)的構建上,SATA採取了極具象徵意義的色彩策略：
• 大地深棕(Primary Brown - #5D4037):作為主色調,象徵著劇本創作的土壤與根基,傳遞出一種沉穩、可信賴的厚重感,這對於一個涉及資金交易與智慧財產權的平台而言至關重要,能有效降低使用者(特別是投資方)的心理防禦機制。
• 流沙金(Sand Gold - #C5A065):作為強調色,廣泛應用於按鈕、邊框與數據亮點。金色象徵著隱藏在文字中的商業價值與「點石成金」的轉化潜力,暗示平台能從海量文本中挖掘出黃金般的投資標的。
• 暖白(Warm White - #FAF9F6)與卡片底色(Card Bg - #FFFDF5):作為介面背景,提供了一種溫潤、不刺眼的閱讀體驗,這與傳統高冷科技感的AI平台形成區隔,更強調「人文科技」的溫度,符合影視產業感性與理性交織的特質。

1.2 策略使命與願景
SATA 的戰略使命在於解決影視產業長久以來的結構性矛盾:將影視投資從傳統的「高風險盲盒遊戲」,轉型為「基於數據的精準決策模型」。傳統影視投資往往依賴少數決策者的直覺(Gut Feeling)或人脈網絡,導致資源配置極度不效率——優質的劇本因缺乏人脈而被埋沒,而巨額資金卻常因錯誤判斷而血本無歸。SATA試圖引入「量化分析」作為新的通用語言,在藝術創作(感性)與資本運作(理性)之間搭建一座可溝通的橋樑。平台的願景不僅止於媒合,更在於建立一個「自循環的影視創新生態系」。透過AI技術降低初期篩選成本,透過專業諮詢提升內容品質,再透過透明的媒合機制完成價值實現。

1.3 核心價值主張矩陣
技術面：AI 驅動的量化指標。利用NLP 技術將敘事結構、角色情感曲線、商業潛力轉化為可視化的雷達圖與數據,提供客觀的評估基準。
服務面：人機協作的深度孵化。承認 AI的侷限性,引入資深編劇與製片人進行「Human-in-the-loop」的專業諮詢,將冷冰冰的數據轉化為溫度的創作建議與商業策略。
市場面：透明化的雙向媒合。打破資訊不對稱,建立即時更新的投資意願看板與劇本數據庫,讓創作方能看見市場需求,讓投資方能看見潛力標的,降低交易摩擦成本。

2. 影視產業市場結構與經濟學分析
2.1 宏觀市場數據與趨勢分析
截至2025年10月20日,台灣國片總票房已達到7.58億新台幣,相較於2024年全年的6億新台幣,年增長率高達26%。2024年全球劇本創作與分析軟體的市場規模約為1.788 億美元,預計至2033年將增長至4.94億美元,年複合成長率(CAGR)達到12%。

2.2 雙邊市場失靈與痛點深度解析
供給端痛點(創作者)：商業轉化能力的匱乏、數據說服力的缺失(缺乏Track Record)、依賴補助的路徑依賴。
需求端痛點(投資者)：高昂的篩選成本(Search Cost)、缺乏定價與評估標準(非標準化資產)、資訊不透明導致的逆向選擇(檸檬市場)。

3. AI 技術架構與演算法邏輯
SATA 的核心競爭力在於其「AI劇本初步分析」模組。
• 大型語言模型(LLM)整合策略：串接 Google Gemini API (支援 Flash 到 Pro 模型)，具備自動偵測與降級機制。
• 深度學習架構：
  1. Hierarchical Transformer(階層式 Transformer)：處理長文本。
  2. 事件抽取(Event Extraction)：識別情節轉折點。
  3. NER(命名實體識別)與關係抽取：生成角色關係圖譜。
  4. LSTM 與情感分析：追蹤情緒流動，偵測棄讀風險點。
  5. RAG(檢索增強生成)：建立包含 FPP、金馬創投等成功劇本的向量資料庫，解決幻覺與在地化問題。

4. 平台功能模組與使用者體驗設計
• 創作者旅程：上傳與格式檢核 -> AI 初步診斷 (雷達圖) -> 專業諮詢介入 -> 上架與數據追蹤。
• 投資者旅程：高效篩選 (標籤/瀏覽熱度) -> 深度評估 (購買深度報告) -> 投資意願管理 (CRM體驗)。

5. 劇本資料庫內容資產與案例分析
• 《消失的檢察官》(懸疑/犯罪)：1,520次瀏覽，4.8顆星。典型強情節類型片，高商業潛力，適合 Netflix。
• 《迷霧追兇》(懸疑/犯罪)：890次瀏覽，4.5顆星。新舊衝突，角色互動亮點。
• 《愛在AI元年》(愛情/科幻)：2,100次瀏覽，4.9顆星(最高分)。探討人機戀，高創意價值。
• 《星際戀曲》(愛情/科幻)：1,200次瀏覽，4.6顆星。經典結構，需注意預算可行性。
• 《家的形狀》(劇情/家庭)：650次瀏覽，4.3顆星。高度在地化，適合公視或輔導金。
• 《聽見你的聲音》(劇情/家庭)：980次瀏覽，4.7顆星。高概念文藝片。

6. 商業模式、財務預測與營運策略
• 創作者諮詢服務(B2C)：約 40,000 TWD/次，毛利率 83.75%。現金牛業務。
• 投資方深度報告(B2B)：約 100,000 TWD/份，毛利率 93.5%。高利潤產品。
• 媒合佣金：交易總額的 4%。
• 利潤分成：長期規劃從票房中抽取分成。
• 財務預測：第一年(種子期)營收880萬，第三年(成長期)營收3,800萬，預計第二年第二季損益平衡。

7. 專業諮詢與人機協作體系
• 核心團隊：
  - 李光翔 (CEO & CSO)：經濟學碩士，負責戰略與宏觀分析。
  - 黃品文 (CIO)：金融碩士，證券商執照，負責量化分析與財務模型。
  - 江芸帆 (CFO & CRO)：專精 ESG 與風險控管。
  - 蔡堡丞 (CMO & CPO)：FinTech 技術與行銷背景。

8. 未來發展藍圖
• 階段一：基礎建設期(第1年)，MVP驗證。
• 階段二：成長擴張期(第2-5年)，建立投資者生態。
• 階段三：生態統治期(第6-10年)，轉型為 VC (自投+媒合)。

10. 常見問答集 (FAQ)
• AI 如何讀懂劇本？使用 Hierarchical Transformer 與 NLP 技術，非單純關鍵字搜尋。
• 如何預測票房？系統整合全球票房預測模組，細分北美、歐洲、亞洲等五大洲市場。
• 版權安全嗎？設有嚴格審核機制與區塊鏈技術保護。
• 為什麼相信 SATA？專為華語市場打造，擁有在地化訓練語料庫。
`;

// ==========================================
// 2. 預設問題設定 (User Persona FAQ)
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
        { text: "SATA 的使命與願景", sub: "品牌精神", icon: "fas fa-flag", action: "ask:SATA 的使命與願景是什麼？" },
        { text: "AI 技術架構", sub: "Transformer & RAG", icon: "fas fa-microchip", action: "ask:你們的 AI 是用什麼技術開發的？" },
        { text: "團隊背景介紹", sub: "核心成員", icon: "fas fa-users", action: "ask:請介紹團隊背景與核心成員。" },
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
window.scrollQuickReply = scrollQuickReply;

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
        appendMessage(`<strong>系統：</strong>歡迎使用 SATA 平台，您可以問我以下問題：<br>1. 平台的商業模式<br>2. SATA的使命與願景<br>3. AI 技術架構<br>4. 團隊背景介紹`, 'bot', true);
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
    leftBtn.onclick = () => scrollQuickReply(wrapper, -150);

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
    rightBtn.onclick = () => scrollQuickReply(wrapper, 150);

    // 組裝
    wrapper.appendChild(leftBtn);
    wrapper.appendChild(container);
    wrapper.appendChild(rightBtn);

    document.getElementById('chat-messages').appendChild(wrapper);
    scrollToBottom();
}

function scrollQuickReply(wrapper, amount) {
    const container = wrapper.querySelector('.quick-reply-container');
    if (container) {
        container.scrollBy({ left: amount, behavior: 'smooth' });
    }
}

function handleQuickReply(text, action) {
    if (action.startsWith('category:')) {
        const category = action.split(':')[1];
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
