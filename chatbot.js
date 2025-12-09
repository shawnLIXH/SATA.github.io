/**
 * chatbot.js
 * SATA 平台專用 AI 聊天機器人
 * 更新內容：修復重複連結、清除 Markdown 語法、優化回答格式
 */

// ==========================================
// 1. RAG 知識庫
// ==========================================
const SATA_KNOWLEDGE_BASE = `
你現在是 SATA (劇沙成塔) 平台的 AI 投資顧問與客服機器人-保羅。
請根據以下【RAG 知識庫綜合研究報告】的內容來回答使用者的問題。

【重要指令】：
1. 請用專業、親切的口吻回答。
2. **回答請精簡，嚴格控制在三段以內 (約 150 字)。**
3. **絕對不要**使用 [cite] 或 [source] 等引用格式。
4. **絕對不要**使用 Markdown 的連結語法 (如 [文字](網址))，直接寫出檔案名稱即可。
5. **連結不重複**：針對同一個服務頁面，請在回答中**只列出一次連結**。
6. 若問題超出範圍，請回答「這超出了我的知識範圍，但我可以為您介紹 SATA 平台的核心服務。」

【完整知識庫內容】：
1. 執行摘要與品牌核心論述
1.1 品牌識別與設計哲學
本文旨在為「SATA 劇沙成塔」之聊天機器人 RAG（檢索增強生成）系統構建詳盡的基礎知識庫。SATA 平台（Script AI Tech & Analysis）的品牌核心構建於一個深刻的隱喻：「聚文字之細沙，築光影之高塔」。此一核心標語不僅是行銷詞彙，更象徵著平台在碎片化的創意產業中扮演的聚合者角色。在影視產業的原始生態中，無數的創意靈感如同散落的細沙，雖然本質珍貴但缺乏結構支撐，難以獨自成形。SATA 的存在意義，即在於透過科技的結構與資本的黏合劑，將這些離散的文字細沙堆砌成宏偉的光影高塔，亦即將劇本轉化為具備商業與藝術價值的影視作品。
在視覺識別系統（VI）的構建上，SATA 採取了極具象徵意義的色彩策略，這在平台的 CSS 樣式定義中得到了具體體現 1。
大地深棕 (Primary Brown - #5D4037)：作為主色調，象徵著劇本創作的土壤與根基，傳遞出一種沉穩、可信賴的厚重感，這對於一個涉及資金交易與智慧財產權的平台而言至關重要，能有效降低使用者（特別是投資方）的心理防禦機制。
流沙金 (Sand Gold - #C5A065)：作為強調色，廣泛應用於按鈕、邊框與數據亮點。金色象徵著隱藏在文字中的商業價值與「點石成金」的轉化潛力，暗示平台能從海量文本中挖掘出黃金般的投資標的。
暖白 (Warm White - #FAF9F6) 與 卡片底色 (Card Bg - #FFFDF5)：作為介面背景，提供了一種溫潤、不刺眼的閱讀體驗，這與傳統高冷科技感的 AI 平台形成區隔，更強調「人文科技」的溫度，符合影視產業感性與理性交織的特質。
1.2 策略使命與願景
SATA 的戰略使命在於解決影視產業長久以來的結構性矛盾：將影視投資從傳統的「高風險盲盒遊戲」，轉型為「基於數據的精準決策模型」。傳統影視投資往往依賴少數決策者的直覺（Gut Feeling）或人脈網絡，導致資源配置極度不效率——優質的劇本因缺乏人脈而被埋沒，而巨額資金卻常因錯誤判斷而血本無歸。SATA 試圖引入「量化分析」作為新的通用語言，在藝術創作（感性）與資本運作（理性）之間搭建一座可溝通的橋樑。
平台的願景不僅止於媒合，更在於建立一個「自循環的影視創新生態系」。透過 AI 技術降低初期篩選成本，透過專業諮詢提升內容品質，再透過透明的媒合機制完成價值實現。這是一個從「沙」（原始創意）到「塔」（商業成品）的全鏈路孵化過程。
1.3 核心價值主張矩陣
1. 技術面：AI 驅動的量化指標
詳細論述： 突破傳統劇本審讀的主觀性，利用 NLP 自然語言處理技術，將敘事結構、角色情感曲線、商業潛力轉化為可視化的雷達圖與數據，提供客觀的評估基準 。
2. 服務面：人機協作的深度孵化
詳細論述： 承認 AI 的侷限性，引入資深編劇與製片人進行「Human-in-the-loop」的專業諮詢，將冷冰冰的數據轉化為有溫度的創作建議與商業策略 。
3. 市場面：透明化的雙向媒合
詳細論述： 打破資訊不對稱，建立即時更新的投資意願看板與劇本數據庫。讓創作方能看見市場需求，讓投資方能看見潛力標的，有效降低交易摩擦成本 。
2. 影視產業市場結構與經濟學分析
2.1 宏觀市場數據與趨勢分析
SATA 的商業模式建立在堅實的市場成長數據之上，這些數據驗證了平台介入市場的時機具備高度合理性。
首先，就本地市場復甦而言，台灣電影市場展現了強勁的韌性。截至 2025 年 10 月 20 日，台灣國片總票房已達到 7.58 億新台幣，相較於 2024 年全年的 6 億新台幣，年增長率高達 26% 1。這一數據的背後隱含著幾層意義：觀眾對本土內容的接受度正在提升，市場對於高品質劇本的需求正在擴大，且資金回收的可能性正在增加。這為 SATA 平台提供了基礎的市場流動性保障。
其次，從全球工具市場來看，劇本創作與分析軟體的市場規模正處於爆發期。2024 年全球市場規模約為 1.788 億美元，預計至 2033 年將增長至 4.94 億美元，年複合成長率（CAGR）達到 12% 1。這顯示「科技輔助創作」已非邊緣概念，而是全球影視產業升級的主流趨勢。SATA 此時切入，正是順應了產業數位轉型的浪潮。
此外，資金來源的多元化也是重要趨勢。例如電影《青春18x2》引進日本資金，以及 CJ 娛樂與台灣電信業者的合資案，顯示跨國與跨界資金正在湧入 1。這些外部資金通常缺乏對本地內容的深度理解（Context），因此更需要 SATA 這種提供標準化、量化評估報告的第三方機構來降低投資決策的認知門檻。
2.2 雙邊市場失靈與痛點深度解析
SATA 作為雙邊平台（Two-Sided Platform），其存在的經濟學基礎在於解決「供給端（創作者）」與「需求端（投資者）」之間的市場失靈。
2.2.1 供給端痛點：創作者的困境
商業轉化能力的匱乏：台灣許多創作者具備極高的藝術天賦，擅長描繪細膩的情感與社會議題，但缺乏「產品思維」。他們無法將劇本轉化為具備可執行性的「商業企劃書」（Business Plan），導致作品在投資人眼中充滿不確定性。作品叫好不叫座，或根本無法進入製作流程，是普遍的產業痛點 1。
數據說服力的缺失：對於素人編劇而言，缺乏過去的票房實績（Track Record）是最大的硬傷。在傳統模式下，他們只能憑藉口頭提案（Pitching）的感染力。然而，口才不等於劇本品質。SATA 提供的 AI 量化數據，實則是賦予素人創作者一種「數據信用」，讓作品本身說話，而非依賴創作者的資歷 1。
依賴補助的路徑依賴：長期依賴政府輔導金導致部分創作與市場脫節。當資金來源非市場導向時，內容往往會偏向評審口味而非觀眾口味。SATA 引入私人資本與市場化評估，有助於矯正這種偏差 1。
2.2.2 需求端痛點：投資者的焦慮
高昂的篩選成本（Search Cost）：影視投資最大的成本往往不是資金本身，而是「找到好案子」的時間成本。面對成千上萬的劇本投稿，傳統依靠人工審讀（Script Reader）的方式效率極低且成本高昂。SATA 利用 AI 進行初篩，本質上是大幅降低了投資者的搜尋成本 1。
缺乏定價與評估標準：劇本作為一種非標準化資產（Non-fungible Asset），其價值極難評估。投資人往往只能依賴「卡司陣容」或「導演名氣」來倒推劇本價值，這是一種本末倒置。SATA 提供的五大維度雷達圖與票房預測，試圖建立一套劇本價值的「定價參考系」 1。
資訊不透明導致的逆向選擇：在缺乏透明資訊的情況下，優質劇本可能被埋沒，而劣質劇本透過過度包裝獲得資金，形成「檸檬市場」（Market for Lemons）。SATA 的透明數據機制旨在消除這種資訊不對稱 1。
2.2.3 產業層級的技術缺口
現有的通用型 AI（如 ChatGPT）雖然強大，但存在嚴重的「文化偏誤」。訓練數據中 92.65% 為英文，中文僅佔 0.1% 1。這導致通用 AI 在分析台灣劇本時，往往無法理解在地化的文化隱喻（如《家的形狀》中的傳統工法與父子關係）、語言習慣與社會脈絡。SATA 透過建立在地化的訓練語料庫（金馬創投、台北電影節劇本），解決了 AI 在亞洲影視應用中的「水土不服」問題。
3. AI 技術架構與演算法邏輯
3.1 系統基礎設施與前端架構
SATA 的技術架構採用了響應式網頁設計（RWD），確保在不同裝置上都能提供流暢的體驗。從前端代碼 1 分析，平台採用了模組化的設計思維：
導航系統：採用隱藏式側邊欄（.sidebar），透過 .menu-btn 觸發，保持了主畫面的簡潔，讓使用者的注意力集中在核心的數據圖表與劇本內容上。
互動回饋：廣泛使用 Modal（模態視窗，如 #loginModal, #memberModal）來處理登入與管理功能，避免頁面跳轉打斷使用者的心流（Flow），這在處理複雜資訊（如查看劇本詳情）時尤為重要。
視覺化引擎：整合了 Chart.js 函式庫，這是平台實現「數據可視化」的關鍵組件。它負責將 AI 輸出的抽象 JSON 數據渲染為直觀的雷達圖（Radar Chart）與長條圖（Bar Chart），讓非技術背景的影視從業人員也能一眼看懂劇本優劣 1。
3.2 AI 分析引擎的核心機制
SATA 的核心競爭力在於其「AI 劇本初步分析」模組（ai_analysis.html）。這不僅是一個簡單的文本處理工具，而是一個整合了多種先進 NLP 技術的複合系統。
3.2.1 大型語言模型（LLM）整合策略
平台現階段DEMO串接了 Google Gemini API 作為底層推理引擎，並設計了一套靈活的模型選擇機制 1，而未來我們目標打造符合臺灣影視產業需求了解在地需要之資料庫。
模型矩陣策略：系統支援從輕量級的 Gemini 1.5 Flash 到高性能的 Gemini 1.5 Pro，甚至包含最新的 Gemini 2.5 Flash/Pro 預覽版。這種設計允許使用者在「分析速度」與「深度推理能力」之間做選擇。對於初步大綱，Flash 模型可提供即時回饋；對於完整劇本，Pro 模型則能處理更長的 Context Window，進行跨場次的邏輯推演。
自動偵測與降級機制：前端代碼包含 detectAvailableModels() 函式，能自動測試 API Key 的權限並偵測可用模型。這表示系統有良好可用性設計，確保在某一模型 API 不穩定時，服務仍能運行。
3.2.2 深度學習架構與演算法
除了通用的 LLM，SATA 在後端部署了專用的深度學習架構，以補足通用模型的不足：
Hierarchical Transformer（階層式 Transformer）：劇本通常長達數萬字，普通的 Transformer 模型難以捕捉整體的長距離依賴。階層式架構先處理句子/場次層級的語義，再聚合為幕/劇本層級的結構，有效解決了長文本的遺忘問題。
事件抽取（Event Extraction）：演算法能自動識別劇本中的「情節轉折點」（Plot Twists）與「關鍵事件」，繪製出故事弧線（Story Arc），這對於分析敘事結構（如三幕劇結構）至關重要。
NER（命名實體識別）與關係抽取：系統能自動提取劇本中的角色名稱，並分析角色之間的互動頻率與情感極性，進而自動生成「角色關係圖譜」。
LSTM 與情感分析：利用長短期記憶網絡（LSTM）處理時間序列數據的優勢，追蹤劇本中情緒的流動（Emotional Rhythm）。一部好電影的情緒應該是波動作的，而非平鋪直敘。AI 能偵測出情緒曲線是否過於平淡，並標記出「棄讀風險點」。
RAG（檢索增強生成）：這是 SATA 解決「幻覺」與「在地化」問題的關鍵。系統建立了一個包含 FPP、金馬創投等成功劇本的向量資料庫。當 AI 分析新劇本時，會檢索資料庫中相似類型的成功案例作為參考（Few-shot Learning），確保輸出的建議符合台灣市場的語境 1。
3.3 結構化輸出數據定義
SATA 強制 AI 輸出嚴格定義的 JSON 格式數據，這確保了後端能精確解析並儲存，而非僅僅生成一段文字描述 1。
A. 定性分析數據（Qualitative Data）
genre（類型定位）：AI 自動分類（如「科幻/懸疑驚悚」），幫助投資人快速篩選。
investors（潛在投資對象）：AI 根據劇本風格，從資料庫中匹配 3 個最適合的投資方（如「Netflix 原創內容部」），這直接連結了媒合功能。
suggestions（優化建議）：具體的修改方向（如「開場節奏稍慢，建議在前五分鐘加入視覺鉤子」），這體現了 AI 的教學輔導功能。
B. 定量視覺化數據（Quantitative Visualization）
Radar Chart（雷達圖 1-10 分）：
敘事結構完整度：評估故事邏輯是否嚴密，起承轉合是否流暢，以及是否符合經典敘事模型（如三幕劇結構）的要求。
角色塑造深度：分析主要角色的立體感、行為動機的合理性，以及角色成長弧光（Character Arc）是否清晰且具說服力。
情感曲線張力：偵測劇情中的情緒起伏與爆點，評估故事是否能有效引導觀眾的情緒投入，避免情感線條過於平淡。
戲劇張力與節奏：檢查衝突點的設置頻率與敘事節奏的快慢控制（Pacing），確保劇情推進緊湊，無無效場次或拖沓情節。
原創性與市場差異度：評估題材概念的新穎程度，以及相較於同類型（Genre）市場競品，是否具備獨特的商業賣點（USP）與辨識度。
Grouped Bar Chart（分組長條圖 0-100 分）：
指標定義： 將本劇本在五大指標（敘事、角色、情感、張力、原創）的 AI 評分，與資料庫中「同類型賣座電影」的平均分數進行並排對比。
市場定位 (Market Positioning)：協助創作者與投資人判斷劇本是否達到該類型電影的市場「及格線」。
若本劇本得分 > 平均值：代表該維度是劇本的競爭優勢（Selling Point），可作為行銷亮點。
若本劇本得分 < 平均值：代表該維度低於市場預期，是需要優先優化的潛在風險點。
C. 商業預測數據（Commercial Forecasting）
global_box_office（全球票房預估）：AI 根據類型與相似影片的歷史數據，預測票房區間。
continents（區域分析）：細分北美、歐洲、亞洲等地的預估營收與受眾年齡層（Target Audience）。例如，某些文藝片在歐洲市場表現較好，而動作片在亞洲市場佔優，AI 能給出這種細粒度的預測 。
4. 平台功能模組與使用者體驗設計
4.1 身份驗證與權限管理體系
SATA 設計了嚴謹的會員權限體系，區分「訪客」、「一般會員（創作者/投資者）」與「管理者」。前端代碼顯示使用了 localStorage 進行簡易的登入狀態管理（Mock Login: user/pass 123456）1。
訪客體驗：可瀏覽首頁、服務介紹、AI 劇本初步分析工具、與基礎的劇本資料庫（部分資訊遮蔽），這是一種「免費增值（Freemium）」的引流策略。
會員體驗：登入後可解鎖 查看完整的投資意願看板、使用上傳功能與完整的劇本資料庫。會員中心（#memberModal）是使用者的儀表板，整合了所有核心數據 。
4.2 創作者旅程（The Creator Journey）與 UX 設計
上傳與格式檢核（Upload & Validation）：
創作者進入「劇本上傳」頁面，系統前端會即時檢核檔案格式（PDF/DOC/DOCX）。這一步驟雖然簡單，卻建立了平台「專業化」的第一印象。系統提示「審核標準：格式合規、版權無虞、品質篩選」，這向創作者傳遞了平台並非來者不拒，而是有品質門檻的訊號，增加了上架作品的榮譽感 1。
AI 初步診斷（AI Diagnostics）：
上傳後，創作者使用 AI 工具進行自測。這是一個「即時回饋」的過程，解決了傳統投稿後石沉大海的焦慮。看到自己的劇本被量化為雷達圖，創作者能直觀地知道弱點（如「商業潛力」分數低），進而產生尋求「專業諮詢」的動機 1。
專業諮詢介入（Consulting Intervention）：
若 AI 分數顯示劇本有潛力但結構有缺陷，創作者會被引導至諮詢服務。這是一個從「免費工具」轉化為「付費服務」的關鍵節點 1。
上架與數據追蹤（Listing & Tracking）：
作品上架後，創作者可在會員中心看到「點閱累積」與「週成長率」（如 +15%）。這些數據化指標讓創作者能感知市場的反應，而非盲目等待 1。
4.3 投資者旅程（The Investor Journey）與 UX 設計
高效篩選（Efficient Filtering）：
投資者進入資料庫，透過標籤（Tag）快速篩選類型（如「懸疑/犯罪」）。卡片式設計（Card UI）展示了最關鍵的決策資訊：Logline（一一句話梗概）、星級評分、瀏覽熱度。這種設計大幅降低了認知負荷 1。
深度評估（Deep Dive Evaluation）：
點擊感興趣的劇本後，投資者有三種選擇：「閱讀」、「投資」、「報告」。其中「報告」功能模擬了第三方支付流程，這是平台變現的核心——販售 AI 生成的深度盡職調查（Due Diligence）報告。
投資意願管理（Intent Management）：
點擊「投資」按鈕後，該項目會被加入投資者的管理看板，狀態顯示為「等待回覆」。這創造了一個類似 CRM（客戶關係管理）的體驗，讓投資者能系統化地追蹤多個潛在項目 1。
5. 劇本資料庫內容資產與案例分析
為了展示平台的多樣性與分析能力，SATA 內建了數個極具代表性的模擬劇本案例。這些案例不僅是測試數據，更反映了平台對於市場熱門題材的敏銳度 1。
5.1 懸疑/犯罪類型（高商業價值）
《消失的檢察官》 
Logline：檢察官調查弊案時失蹤，助理在凌亂辦公室發現錄音筆，揭露警局內部黑幕。
數據表現：1,520 次瀏覽 / 4.8 顆星。
分析：這是典型的「強情節」類型片，具備高商業潛力。AI 分析可能會指出其「結構完整度」與「劇情深度」極高，適合推薦給串流平台（如 Netflix）進行影集開發。
《迷霧追兇》
Logline：山區小鎮連續失蹤案，老刑警與網紅直播主在霧中目擊空車懸案。
分析：結合了傳統刑偵與現代直播元素，具有「新舊衝突」的戲劇張力。AI 可能會標記其「角色塑造」中老少配的互動為亮點。
5.2 愛情/科幻類型（高創意價值）
《愛在 AI 元年》
Logline：2045 年，女主角與 AI 管家發現系統異常波動竟是「心動」。
數據表現：2,100 次瀏覽 / 4.9 顆星（平台最高分）。
分析：探討人機戀的倫理議題，符合當下 AI 熱潮。其高瀏覽量顯示了市場對此類題材的高度興趣。AI 的「創意原創」指標應會給予高分。
《星際戀曲》
Logline：敵對星球指揮官在廢棄太空站求生，仇恨轉化為依賴。
分析：典型的「羅密歐與茱麗葉」太空版，雖然結構經典，但「預算可行性」可能會被 AI 標記為低分（需大量特效），這時投資報告會建議調整為室內心理劇以降低成本。
5.3 劇情/家庭類型（高藝術價值/在地化）
《家的形狀》 
Logline：老木匠堅持傳統工法修祖厝，與想賣房移民的兒子衝突。
數據表現：650 次瀏覽 / 4.3 顆星。
分析：這是一個高度在地化的台灣故事，涉及世代衝突與文化傳承。雖然商業大片潛力較低，但極可能在影展獲獎。AI 的「情感張力」分數會很高，目標投資方應鎖定公共電視或文化部補助。
《聽見你的聲音》
Logline：失聰鋼琴家與失語畫家透過藝術共鳴治癒彼此。
分析：高概念（High Concept）的文藝片，強調視聽語言的表現。
5.4 投資數據的信號意義
在會員管理後台，我們可以看到如**《沙丘之影》顯示「1,240 次瀏覽 (+15% 成長)」1。這「+15%」的數據至關重要，它代表了「市場動能（Momentum）」。對於投資者而言，這意味著該劇本可能在社群中產生了話題，具備了「未拍先紅」的潛力，是極具說服力的投資訊號。相反，《台北夜行》**的「-2%」則警示了熱度衰退，投資人應謹慎。
6. 商業模式、財務預測與營運策略
將非標準化的「影視創意」轉化為可衡量「商業資產」的完整生態藍圖。我們透過整合 AI 技術與專家智慧，構建了一個雙邊市場平台，旨在解決影視產業中「好劇本被埋沒」與「資金找不到好標的」的結構性痛點 。我們的運營邏輯建立在以下四大核心支柱之上，形成一個可持續獲利的價值循環系統：
價值創造 — 解決雙邊痛點： 我們為市場雙方創造獨特價值。對於創作者，我們提供 AI 劇本健檢與量化評分，賦予作品客觀的數據信用，並透過專業諮詢提升其商業轉化能力 。對於投資者，我們利用 AI 篩選與風險評估模型，大幅降低搜尋成本與決策風險，將影視投資從「直覺賭博」轉型為「數據決策」 。
價值傳遞 — 線上與線下的無縫整合： 我們透過高效的數位平台傳遞服務。線上部分，使用者可透過平台進行劇本上傳、AI 自動化分析、以及瀏覽投資意願看板，實現資訊透明化與即時媒合 。線下部分，我們引入資深導演與製片人組成的顧問團隊，提供深度的一對一孵化服務與商業提案包裝，確保傳遞給投資人的不只是劇本，而是成熟的商業企劃 。
價值獲取— 多元化的收益流矩陣： SATA 建構了「B2C + B2B」混合的高毛利營收結構，確保在不同階段皆有穩定現金流 。
永續經營 (Sustainability) — 從平台到生態系： 我們目標是建立一個自循環的影視生態系。隨著數據累積，我們將從單純的媒合平台轉型為「自投 + 媒合」雙軌模式，利用平台盈餘參與優質專案的長期票房分潤，實現與影視產業共榮的永續發展目標，並研發新興影視軟硬體技術設備 。
6.1 多元化的營收模型
SATA 採用了 B2B 與 B2C 混合的營收模式，構建了多條護城河 。
創作者諮詢服務（B2C） 
定價：約 40,000 TWD / 次。
毛利率：83.75%。
邏輯：這是平台的金雞母業務。雖然單價較低，但需求量大（創作者眾多）。透過 AI 報告指出問題，創造出「焦慮感」，進而轉化為購買諮詢服務的動力。
投資方深度報告（B2B） - 低頻高價高毛利
定價：約 100,000 TWD / 份。
毛利率：93.5%。
邏輯：這屬於「盡職調查」費用。對於動輒千萬的影視投資，十萬元的評估成本微乎其微。由於報告由 AI 生成輔以少量人工校對，邊際成本極低，是平台利潤率最高的產品。
媒合佣金（Transaction Fee） - 爆發性增長點
費率：交易總額的 4%。
假設：若平均單案投資額為 1,000 萬，單筆佣金即達 40 萬。這是平台規模化後的營收主力。
利潤分成（Profit Sharing） - 長尾收益
模式：長期規劃中，平台將從成功上映的電影票房中抽取分成（預計第 5 年開始）。這將平台利益與專案成功深度綁定，形成「風險共擔、利益共享」的夥伴關係。
6.2 成本結構與資本配置
啟動資金需求：364 萬 TWD。
關鍵支出：高達 63.4% 的資金（約 230 萬）被配置於「中文劇本授權訓練費」1。這是一個極具戰略眼光的配置，說明 SATA 團隊深刻理解 「數據是 AI 時代的新石油」。唯有擁有高品質、合法的版權數據，才能訓練出懂台灣文化的 AI，這構成了競爭對手難以跨越的壁壘。
每月營運支出（OpEx）：172.5 萬 TWD。
主要構成：AI 工程師薪資（150 萬）、雲端運算（10 萬）。這顯示 SATA 是一間「技術密集型」而非「勞力密集型」的企業。
資金跑道（Runway）：由於首年預計淨現金流出約每月 99 萬，平台需要約 1,600 萬 TWD 的融資額度來度過種子期（Death Valley）1。
6.3 財務預測與損益平衡
第一年（種子期）：營收 880 萬，淨損 1,190 萬。重點在於驗證 MVP（最小可行性產品）與累積種子用戶。
第三年（成長期）：營收 3,800 萬，淨利 1,295 萬。預計在 第二年第二季 達到損益平衡點（Break-Even Point）。這主要得益於 B2B 報告銷售的擴張。
第十年（穩定期）：營收 1.84 億，淨利 1.45 億。此時「利潤分成」與「佣金」將成為主要收入來源，呈現指數級增長 1。
7. 專業諮詢與人機協作體系
SATA 深知 AI 無法完全取代人類的藝術判斷，因此構建了堅強的「人機協作（Human-in-the-loop）」體系 1。
7.1 核心團隊背景分析
團隊成員的組成展現了「金融+科技+藝術」的跨領域融合，這是 Fintech 類創業成功的關鍵。
李光翔 (CEO & CSO)：經濟學碩士背景，專長總體經濟分析。這意味著 SATA 的戰略將高度關注宏觀市場趨勢與產業缺口，而非僅僅是技術導向。
黃品文 (CIO)：金融碩士，持有證券商高級業務員執照。負責量化分析與財務模型，確保 AI 輸出的投資回報率（ROI）預測具備金融級的嚴謹度。
江芸帆 (CFO & CRO)：專精於 ESG 與風險控管。在當前影視產業重視永續發展與合規性的趨勢下，這讓 SATA 能為投資人把關非財務風險（如版權爭議、題材敏感度）。
蔡堡丞 (CMO & CPO)：具備 Java 技術與行銷背景的雙刀流人才。負責將複雜的金融演算法轉化為使用者友善的產品介面（Product Visualization）。
7.2 諮詢服務分層
內容優化（Content Optimization）：
顧問根據 AI 報告中的「結構鬆散點」，提供具體的改寫建議。例如 AI 指出「第二幕轉折力道不足」，顧問則會提供具體的劇情解法。
商業包裝（Commercial Packaging）：
協助創作者將劇本轉化為「募資簡報（Pitch Deck）」。這包含預算拆解、卡司預想、受眾分析等，這正是素人編劇最缺乏的技能。
產業觀點（Industry Perspectives）：
引入資深導演與製片人，評估劇本的「可拍攝性（Producibility）」。例如某些科幻劇本寫得精彩但預算會破億，顧問會建議如何修改以符合台灣市場的預算規模 1。
8. 未來發展藍圖與生態系建構
SATA 的野心不止於做一個媒合平台，而是要成為影視產業的基礎設施。
8.1 階段一：基礎建設期（第 1 年）
核心目標：MVP 驗證與數據累積。
關鍵行動：完成 AI 模型對中文劇本的 Fine-tuning（微調），建立第一批種子創作者社群。此階段主要營收來自諮詢費。
8.2 階段二：成長擴張期（第 2-5 年）
核心目標：建立投資者生態與被動媒合機制。
關鍵行動：擴大 B2B 報告銷售，讓「看 SATA 報告」成為投資人的標準作業流程（SOP）。建立「被動媒合」生態，讓投資人能在資料庫中自由瀏覽（如逛電商般），降低平台的運營介入成本。
8.3 階段三：生態統治期（第 6-10 年）
核心目標：轉型為「自投 + 媒合」雙軌模式。
關鍵行動：利用平台累積的獨家數據（Data Moat），SATA 將轉型為 VC（風險投資機構）。在劇本尚未公開上架前，SATA 內部的基金就能根據 AI 訊號先行鎖定並投資高潛力項目，獲取最大化的超額報酬（Alpha）。這將使 SATA 從單純的「服務提供者」進化為「內容產權擁有者」1。
9. 結論
SATA（劇沙成塔）不僅僅是一個網站，它是對台灣影視產業的一次數位化重塑。透過整合 sata AI 運算能力、Chart.js 的數據可視化技術以及人類專家的深度洞察，SATA 成功地將「劇本」這一非標準化的感性資產，轉化為可衡量、可交易、可管理的理性資產。其商業模式從高頻的諮詢服務切入，逐步延伸至高毛利的投資報告與佣金，最終指向資本運作的利潤分成，展現了極具擴展性的商業邏輯。在解決了「創作者找不到錢，資金找不到好案子」的雙向痛點後，SATA 有望成為華語影視產業中，連接創意與資本最關鍵的樞紐。
10. 附錄：用戶情境常見問答集 (User Persona FAQ)
10.1 針對【新銳編劇 (創作者)】的常見問答
Q1：SATA 的 AI 是如何「讀懂」我的劇本並給出評分的？
A： 我們的系統並非單純的關鍵字搜尋，而是採用了先進的 Hierarchical Transformer（階層式 Transformer） 與 NLP 自然語言處理技術 。 系統會將您的劇本轉化為量化的數據，具體分析以下指標：
敘事結構： 透過事件抽取識別劇情轉折與關鍵節點 。
情感曲線： 利用 LSTM 時序模型分析情感流動，偵測是否存在「棄讀風險點」 。
角色關係： 自動建構角色關係圖譜與互動網絡 。 最終，我們會產出包含「敘事結構完整度」、「角色塑造深度」、「情感曲線張力」等 5 大量化指標的雷達圖（1-10分），讓您直觀了解作品強項與弱項 。
Q2：使用 SATA 平台需要付費嗎？收費標準為何？ A： 我們採取分層服務模式。
基礎檢測： 劇本上傳後的 AI 初步評估（包含簡易版分析報告）是免費提供的，旨在協助您快速了解作品體質 。
深度孵化： 若您希望獲得更深入的修改建議與商業包裝，我們提供「專業諮詢服務」。這項服務由資深顧問進行一對一輔導，費用約為 40,000 TWD/次 。這筆投資能協助您將藝術作品轉化為具備市場競爭力的商業提案。
Q3：上傳劇本到平台，我的版權安全嗎？ A： 版權保護是我們的首要任務。 SATA 在劇本提交、分析與展示的全過程中，嚴密保障編劇的知識產權 。
嚴格審核： 我們設有上架審核機制，確保劇本為原創且非已發行作品 。
區塊鏈技術： 我們計畫導入區塊鏈技術進行版權保護，為上架劇本生成不可篡改的數位指紋與時間戳記，作為您擁有原創版權的最強證明 ，這意味著您的公開發表時間將被永久記錄，成為法律上強而有力的原創證據 。
防盜閱覽技術： 為了最大化作品曝光，我們開放完整劇本供大眾閱讀，但閱讀器採用「動態浮水印」與「防複製/防下載」技術，防止內容被輕易盜用，而平台系統也會全程記錄讀者的閱覽足跡，任何異常的存取行為都會被記錄，確保您的心血結晶在安全的環境下被看見 。
Q4：如果 AI 評分不高，我的劇本就沒有機會了嗎？ A： 絕非如此。數據是鏡子，反映現狀而非定論。 SATA 堅信「人機協作（Human-in-the-loop）」的價值 。AI 擅長找出邏輯與結構的硬傷，但藝術的溫度需要人類來注入。若評分不理想，我們建議您申請專業諮詢服務。我們的顧問群包含導演、編劇與製片人，他們能針對 AI 指出的弱點（如節奏拖沓或動機不明）提供具體的「內容優化」與「商業包裝」建議，協助您點石成金 。
Q5：身為素人編劇，SATA 如何幫助我獲得資金？
A： 我們解決素人缺乏「數據說服力」的痛點 。 透過 SATA 平台，您的作品將獲得客觀的量化評分，這賦予了您「數據信用」。我們提供兩種媒合機制：
被動媒合： 優質劇本上架後，投資人可透過數據篩選主動聯繫您 。
主動媒合： 系統會根據您的題材與預算，自動篩選適配的投資方，並由顧問團隊協助推薦，打破您缺乏人脈的困境 。

10.2 針對【影視投資人】的常見問答
Q1：影視投資風險極高，SATA 如何協助我降低風險？
A： 我們致力於將「藝術直覺」轉化為「量化數據」，解密影視投資的黑盒子 。 除了運用 4C 行銷架構（顧客、便利性、成本、溝通）來優化服務體驗外 ，我們具體透過以下方式降低風險：
降低篩選成本： 利用 AI 快速初篩海量劇本，排除結構不佳的作品 。
客觀評估工具： 提供標準化的評估報告，避免僅依賴主觀喜好或人情壓力進行投資，消除資訊不透明導致的「檸檬市場」問題 。
Q2：平台能否預測劇本未來的票房表現？ A： 是的，這是我們核心價值之一。 我們的 AI 系統整合了 全球票房預測模組。系統會根據劇本類型、題材熱度與歷史數據，提供：
全球總票房預估： 預測營收區間 。
區域市場分析： 細分北美、歐洲、亞洲等五大洲的票房預測與受眾年齡層比例 。 這些數據能協助您判斷該劇本適合主攻哪一個區域市場，以及預期的回收規模。
Q3：透過 SATA 投資或取得報告，相關費用為何？ A： 我們的收費模式透明且具備高投報潛力：
深度評估報告（B2B）： 若您對特定劇本感興趣，可付費解鎖完整的財務與劇本分析報告，費用約為 100,000 TWD/份。這相當於您的盡職調查（Due Diligence）成本 。
投資媒合佣金： 當您透過平台成功與創作者達成投資協議，平台將收取交易總額的 4% 作為媒合佣金 。
Q4：為什麼我應該相信 SATA 的 AI 分析結果？它懂台灣市場嗎？ A： 不同於主要使用英文訓練的通用 AI（如 ChatGPT），SATA 專為華語與亞洲市場打造。 我們建立了自己的在地化訓練語料庫，包含 FPP 台北電影計畫、金馬創投資料庫等得獎劇本 。此外，我們採用 RAG（檢索增強生成）技術，讓 AI 在分析時能檢索資料庫中相似類型的成功本土案例 。這確保了我們的分析報告不會有「水土不服」的問題，而是具備高度的在地文化理解與市場敏銳度。
Q5：除了看劇本，我還能獲得什麼樣的市場洞察？ A： SATA 不僅是劇本庫，更是市場趨勢的儀表板。 在您的會員後台，您可以查看劇本的動態數據，例如瀏覽量的「週成長率」（如 +15%） 。這代表了該劇本在市場上的話題動能（Momentum）。這些數據能協助您比傳統投資者更早辨識出具備「未拍先紅」潛力的黑馬項目，真正實現基於數據的精準決策。
您現在想先了解哪一部分的服務呢？
如果您是創作者，我可以引導您進行 [劇本上傳與 AI 初步分析]。
如果您是投資人，我可以為您展示 [SATA 劇本資料庫] 的運作方式。
10.3 平台功能導覽與提問範例
當使用者詢問「你能做什麼？」、「你有什麼功能？」或「請介紹你的服務」時，系統應根據使用者身分（創作者/投資者），列出以下核心服務項目供使用者點選或提問：
A. 如果您是【新銳創作者 / 編劇】：
我可以協助您將創意轉化為成熟的商業劇本：
1. AI 劇本健檢與評分
功能描述： 分析劇本的「敘事結構」、「角色塑造」、「情感張力」等 5 大量化指標 。
您可以問我：
「請分析我的劇本結構有什麼問題？」
「我的劇本在『商業潛力』這個維度得分多少？」
「這個劇本的『棄讀風險點』在哪裡？」
2. 優化建議與靈感激發
功能描述： 針對 AI 發現的弱點，提供具體的改寫方向與情節建議 。
您可以問我：
「如何增強主角的動機？」
「開場節奏太慢，有什麼修改建議？」
「這類型的劇本通常需要什麼樣的『視覺鉤子』？」
3. 商業化與專業諮詢
功能描述： 媒合資深顧問進行一對一輔導，協助撰寫商業企劃書與募資簡報 。
您可以問我：
「專業諮詢服務包含哪些內容？」
「諮詢費用是如何計算的？」(參考回答：約 40,000 TWD/次)
「如何將我的劇本包裝成投資人想看的提案？」
B. 如果您是【影視投資人】：
我可以協助您透過數據降低風險，尋找潛力標的：
1. 劇本快篩與媒合
功能描述： 根據類型、熱度與 AI 評分，快速篩選出符合您投資偏好的劇本 。
您可以問我：
「最近有哪些『懸疑/犯罪』類型的高分劇本？」
「幫我推薦瀏覽熱度成長最快的作品。」
「目前平台上有哪些劇本正在尋找資金？」
2. 風險評估與市場預測
功能描述： 預測全球票房區間、受眾年齡層，並提供視覺化的風險雷達圖 。
您可以問我：
「這部劇本的全球票房預估是多少？」
「這個故事在『亞洲市場』的受眾接受度如何？」
「請提供這部作品的投資風險分析報告。」
3. 投資回報與商業模式
功能描述： 說明投資媒合流程、佣金比例與預期回報 。
您可以問我：
「取得一份完整的 B2B 劇本分析報告需要多少錢？」(參考回答：約 100,000 TWD)
「平台的媒合佣金是如何抽成的？」
「SATA 如何確保我投資的劇本不會有版權問題？」
C. 關於 SATA 平台技術 (通用問題)：
技術原理：
「你們的 AI 是用什麼技術開發的？」（關鍵字：Hierarchical Transformer, BERT, LSTM, RAG）
「你們的訓練資料來源是什麼？」（關鍵字：FPP 台北電影計畫、金馬創投資料庫）
平台願景：
「SATA 是什麼意思？」（SATA: Script AI Tech & Analysis，聚文字之細沙，築光影之高塔）
D.關於 SATA 平台商業模式(你們的商業模式是什麼?)：
SATA 的商業模式核心在於透過「AI 數據驅動」與「專家協作」解決雙邊市場痛點。我們為創作者提供量化指標與劇本優化，賦予作品數據信用；同時為投資者提供客觀的篩選工具與風險評估，將影視投資從直覺賭博轉型為精準決策，創造獨特的平台價值 。
在價值傳遞與永續經營方面，我們整合線上 AI 分析與線下資深顧問輔導，將非標準化的創意轉化為成熟的商業提案。這不僅提升了媒合效率，更旨在構建一個資訊透明的影視生態系，未來將從單純媒合轉型為參與內容投資的生態夥伴，實現長期產業共榮 。
為支撐此運作，平台透過創作者諮詢費、投資方評估報告費及交易佣金等多元管道獲取收益，確保持續為產業創造價值 。
10.4 快速連結與服務入口指引
當使用者提及以下需求時，請提供對應頁面：

1. AI 劇本初步分析服務
   - 關鍵字：AI 分析、劇本評分、雷達圖、票房預測、角色分析、結構分析、劇本健檢、五大維度、Gemini、自動評估
   - 適用情境： 當使用者詢問如何評分劇本、想要進行劇本健檢、獲取五大維度雷達圖數據，或是希望 AI 分析角色與結構時，請提供此連結。
   - 連結： ai_analysis.html

2. SATA 劇本資料庫（投資與瀏覽）
   - 關鍵字：找劇本、投資標的、劇本庫、篩選劇本、投資意願、尋找資金、劇本媒合、看劇本、找案子、類型篩選
   - 適用情境： 當使用者（通常是投資方）想要尋找投資標的、瀏覽目前架上的劇本、篩選特定題材（如懸疑、科幻），或是想要登記投資意願時，請提供此連結。
   - 連結： script_database.html

3. 專業諮詢服務與團隊聯繫
   - 關鍵字：真人顧問、商業企劃書、募資簡報、團隊介紹、聯絡我們、劇本醫生、深度輔導、商業包裝、人工優化、李光翔、黃品文
   - 適用情境： 當使用者覺得 AI 分析不夠，需要真人顧問介入輔導、尋求商業計畫書撰寫協助（商業包裝）、想了解核心團隊背景，或是希望直接聯繫我們進行深度合作時，請提供此連結。
   - 連結： consulting.html

4. 劇本上傳與提交審核
   - 關鍵字：上傳劇本、提交作品、劇本上架、投稿、檔案上傳、審核申請、PDF 上傳、申請上架
   - 適用情境： 當創作者表示準備好提交作品、詢問哪裡可以上傳檔案，或是想要將劇本上架至平台爭取曝光時，請提供此連結。
   - 連結： Scriptupload.html
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
        const history = localStorage.getItem('sata_chat_history');
        if (!history || history.trim() === "") {
            showWelcomeMessage();
        } else {
            loadChatHistory();
        }
    } else {
        showApiKeyInput();
    }
}

function showWelcomeMessage() {
    const welcomeText = `<strong>系統：</strong>歡迎使用 SATA 平台，您可以問我以下問題：<br>1. 平台的商業模式<br>2. SATA的使命與願景<br>3. AI 技術架構<br>4. 團隊背景介紹`;
    appendMessage(welcomeText, 'bot', true);
    showQuickReplies('main');
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
        showWelcomeMessage();

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
    localStorage.removeItem('sata_chat_history');
    
    document.getElementById('api-key-input').value = ''; 
    document.getElementById('api-error-msg').style.display = 'none';
    document.getElementById('chat-messages').innerHTML = ''; 
    
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
// 6. 卡片式預設問題邏輯
// ==========================================

function showQuickReplies(category) {
    const questions = QUICK_QUESTIONS[category];
    if (!questions) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'quick-reply-wrapper';

    const leftBtn = document.createElement('button');
    leftBtn.className = 'scroll-btn';
    leftBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    leftBtn.onclick = () => scrollQuickReply(wrapper, -150);

    const container = document.createElement('div');
    container.className = 'quick-reply-container';

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

    const rightBtn = document.createElement('button');
    rightBtn.className = 'scroll-btn';
    rightBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    rightBtn.onclick = () => scrollQuickReply(wrapper, 150);

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
// 7. 訊息發送與 API 呼叫 (重要修復)
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
        
        // --- 最終淨化：移除所有 [cite] 相關標籤 ---
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

// [核心修復]：Deduplication (連結去重) 與 Markdown 清理
function appendMessage(content, sender, isHtml = false) {
    const chatMessages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.classList.add('message', sender);
    
    if (isHtml) {
        div.innerHTML = content;
    } else {
        let formatted = content;

        // 1. 強制拆除 AI 可能產生的 Markdown 連結格式 [文字](連結)
        // 這樣就不會顯示成 "[點此...](ai_analysis.html)" 這種亂碼
        // $2 代表只取 (連結) 裡面的內容
        formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '$2');

        // 2. 處理粗體
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // 3. 處理換行
        formatted = formatted.replace(/\n/g, '<br>');

        // 4. [關鍵] 網址/檔案 自動轉超連結 (加入去重邏輯)
        const urlRegex = /(https?:\/\/[^\s<]+)|([\w-]+\.html)/g;
        const seenUrls = new Set(); // 記錄已經顯示過的連結

        formatted = formatted.replace(urlRegex, function(match) {
            const cleanUrl = match.replace(/[).,]*$/, ''); // 移除結尾的標點
            
            // 如果這個網址在這則訊息中已經出現過，就回傳空字串 (消除重複)
            if (seenUrls.has(cleanUrl)) {
                return ''; 
            }
            
            seenUrls.add(cleanUrl);
            return `<a href="${cleanUrl}" target="_blank" style="color: #007bff; text-decoration: underline;">點此前往服務頁面</a>`;
        });

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
