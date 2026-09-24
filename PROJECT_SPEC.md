# Project: Taiwan Niche Day Tour & AI Concierge SaaS
## 1. 專案願景與定位 (Project Vision & Positioning)
- **目標客群**：來台灣自由行的歐美、新馬、日韓高端/深度旅遊旅客（拒絕千篇一律的大眾觀光客行程）。
- **核心護城河**：
  1. **主理人視角 (Local Host)**：主打茶文化（阿里山/東方美人茶）、在地老宅、私房山林步道等深度體驗，由具備流利英文的在地專家帶領。
  2. **AI 極速客製化 (AI Concierge)**：旅客輸入偏好與需求，AI 即時生成專屬 1 日行程並直接導引預訂。
  3. **極簡流暢體驗**：全英文介面、支援國際信用卡（Stripe）一鍵結帳。

---

## 2. 技術堆疊 (Tech Stack) - 建議搭配 Claude Code 快速搭建
- **前端與框架**：Next.js (React) + Tailwind CSS (確保 UI 國際化、高質感、RWD 行動優先)
- **資料庫與後端**：Supabase (PostgreSQL + Auth + 簡易 API)
- **AI 串連**：Claude API / OpenAI API (用於 AI 行程生成器)
- **金流串接**：Stripe (處理外國信用卡)
- **部署平台**：Vercel

---

## 3. MVP 階段核心功能清單 (Core Features for MVP)

### 功能一：高轉換率的 Landing Page (首頁)
- **Hero Section**：強大且吸引人的標語（例如："Skip the tourist traps. Experience the real Taiwan with local experts."）。
- **精選體驗展示**：展示 2-3 個最具特色的旗艦 1 日行程（包含精美照片、亮點介紹、導遊介紹、價格）。
- **Social Proof**：旅客真實評價或媒體背書區塊。

### 功能二：AI 智慧行程客製化小工具 (AI Trip Builder)
- **互動表單**：旅客勾選/輸入：
  - 同行人數、旅遊風格（Culture/Tea, Nature/Hiking, Foodie）
  - 特殊需求（如素食、攜帶長輩/小孩）
- **AI 即時生成**：點擊後，前端呼叫後端 API 結合 AI，在 5 秒內產出客製化的「1 日行程建議預覽」。
- **一鍵轉化**：直接提供「一鍵預訂此客製行程」或「聯繫專屬顧問」按鈕。

### 功能三：行程詳情與線上預訂頁 (Booking & Checkout Flow)
- **行程內頁**：時間軸（Itinerary Timeline）、集合地點（地圖視覺化）、包含/不包含項目。
- **日期與人數選擇器**：即時挑選日期。
- **金流結帳**：整合 Stripe Checkout 頁面，讓外國人順暢完成刷卡。

### 功能四：後台與訂單管理 (Simple Dashboard)
- **管理員/導遊視角**：查看新進訂單、客戶填寫的客製化需求、聯絡資訊。
- **自動化通知**：訂單成立後，自動發送確認信給旅客。