import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bell,
  Bot,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Compass,
  HeartHandshake,
  Home,
  Map,
  MapPin,
  MessageCircle,
  Mic,
  Moon,
  Navigation,
  Phone,
  Route,
  Shield,
  Sparkles,
  Star,
  SunMedium,
  UserRound,
  Volume2,
  Wand2,
} from "lucide-react";
import { companionOptions, destinations, memories, safetyCards, timeline } from "./data/mockData.js";
import "./styles/global.css";

const navItems = [
  { id: "home", label: "陪伴", icon: Home },
  { id: "buddy", label: "搭子", icon: Bot },
  { id: "plan", label: "规划", icon: Map },
  { id: "safety", label: "守护", icon: Shield },
  { id: "memory", label: "回忆", icon: Sparkles },
];

function App() {
  const [activePage, setActivePage] = useState("home");
  const [mode, setMode] = useState("realtime");
  const [buddyReady, setBuddyReady] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const [toast, setToast] = useState("");

  const pageTitle = useMemo(() => navItems.find((item) => item.id === activePage)?.label ?? "陪伴", [activePage]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__fellowTripToast);
    window.__fellowTripToast = window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <main className="stage">
      <section className="phone-shell" aria-label="FellowTrip mobile prototype">
        <StatusBar />
        <div className="app-header">
          <div>
            <span className="eyebrow">FellowTrip</span>
            <h1>{pageTitle === "陪伴" ? "今日旅途陪伴" : pageTitle}</h1>
          </div>
          <button className="icon-button" aria-label="通知" onClick={() => showToast("暂无新的安全提醒")}>
            <Bell size={18} />
          </button>
        </div>

        <section className="screen">
          {activePage === "home" && (
            <HomePage
              mode={mode}
              setMode={setMode}
              setActivePage={setActivePage}
              showToast={showToast}
            />
          )}
          {activePage === "buddy" && (
            <BuddyPage buddyReady={buddyReady} setBuddyReady={setBuddyReady} showToast={showToast} />
          )}
          {activePage === "plan" && (
            <PlanPage
              selectedDestination={selectedDestination}
              setSelectedDestination={setSelectedDestination}
              setActivePage={setActivePage}
              showToast={showToast}
            />
          )}
          {activePage === "safety" && <SafetyPage showToast={showToast} />}
          {activePage === "memory" && <MemoryPage showToast={showToast} />}
        </section>

        <FloatingBuddy mode={mode} onClick={() => showToast("我在，随时可以叫我一起看看路线")} />
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
        {toast && <div className="toast">{toast}</div>}
      </section>
    </main>
  );
}

function StatusBar() {
  return (
    <div className="status-bar">
      <span>21:42</span>
      <span className="status-dots">● ● ●</span>
    </div>
  );
}

function BottomNav({ activePage, setActivePage }) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={activePage === item.id ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage(item.id)}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function FloatingBuddy({ mode, onClick }) {
  return (
    <button className="floating-buddy" onClick={onClick} aria-label="唤醒 FellowTrip 搭子">
      <span className="buddy-face">
        <Bot size={24} />
      </span>
      <span className={mode === "realtime" ? "pulse-dot online" : "pulse-dot"} />
    </button>
  );
}

function HomePage({ mode, setMode, setActivePage, showToast }) {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="pill soft"><SunMedium size={14} /> 广州 26°C 晴</span>
          <h2>我会在合适的时候出现，也会在你想独处时安静陪着。</h2>
          <p>今日行程已同步，预计步行 6.2km，夜间返程已开启安全守护。</p>
        </div>
        <div className="mascot-card">
          <div className="mascot-orbit">
            <Bot size={46} />
          </div>
          <span>小旅</span>
        </div>
      </section>

      <SegmentedControl
        value={mode}
        onChange={setMode}
        options={[
          { value: "realtime", label: "实时陪伴" },
          { value: "quiet", label: "后台响应" },
        ]}
      />

      <section className="route-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">正在前往</span>
            <h3>沙面岛历史街区</h3>
          </div>
          <span className="time-chip">18 min</span>
        </div>
        <MiniMap />
        <div className="route-actions">
          <button className="secondary-button" onClick={() => showToast("已切换到轻声讲解")}>
            <Volume2 size={16} /> 景点讲解
          </button>
          <button className="primary-button compact" onClick={() => setActivePage("safety")}>
            <Shield size={16} /> 安全守护
          </button>
        </div>
      </section>

      <section className="chat-card">
        <div className="ai-message">
          <Bot size={18} />
          <p>前面这段路游客会变多，我帮你选了靠江边的路线，风景更好也更亮。</p>
        </div>
        <div className="quick-row">
          <button onClick={() => showToast("正在整理附近一人友好餐厅")}>附近吃什么</button>
          <button onClick={() => showToast("拍照构图浮窗已准备")}>帮我拍照</button>
          <button onClick={() => showToast("已进入低打扰模式")}>想安静一下</button>
        </div>
      </section>

      <section className="timeline-card">
        <div className="section-title">
          <h3>今日行程</h3>
          <button className="text-button" onClick={() => setActivePage("plan")}>调整</button>
        </div>
        {timeline.map((item) => (
          <div className="timeline-item" key={item.time}>
            <span>{item.time}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.note}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function BuddyPage({ buddyReady, setBuddyReady, showToast }) {
  const [voice, setVoice] = useState("温柔");
  const [frequency, setFrequency] = useState("中");

  return (
    <div className="page-stack">
      <section className="creator-panel">
        <div className="creator-preview">
          <div className="avatar-stage">
            <Bot size={60} />
          </div>
          <span className="pill"><HeartHandshake size={14} /> 治愈型搭子</span>
        </div>
        <div>
          <span className="eyebrow">创建你的同行者</span>
          <h2>让 AI 搭子拥有刚刚好的陪伴感</h2>
          <p>它会记住你的旅行偏好、风险边界和喜欢的说话方式。</p>
        </div>
      </section>

      <OptionSection title="形象类型" items={companionOptions.appearance} selected="圆滚机器人" />

      <section className="card">
        <div className="section-title">
          <h3>声线选择</h3>
          <Volume2 size={18} />
        </div>
        <div className="choice-grid">
          {["温柔", "活泼", "沉稳", "轻快"].map((item) => (
            <button key={item} className={voice === item ? "choice active" : "choice"} onClick={() => setVoice(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-title">
          <h3>主动对话频率</h3>
          <MessageCircle size={18} />
        </div>
        <div className="frequency-list">
          {["高", "中", "低", "仅唤醒"].map((item) => (
            <button
              key={item}
              className={frequency === item ? "frequency active" : "frequency"}
              onClick={() => setFrequency(item)}
            >
              <span>{item}</span>
              {frequency === item && <Check size={16} />}
            </button>
          ))}
        </div>
      </section>

      <button
        className="primary-button full"
        onClick={() => {
          setBuddyReady(true);
          showToast(buddyReady ? "搭子配置已更新" : "小旅创建完成");
        }}
      >
        <Wand2 size={17} /> {buddyReady ? "保存搭子设置" : "创建我的搭子"}
      </button>
    </div>
  );
}

function PlanPage({ selectedDestination, setSelectedDestination, setActivePage, showToast }) {
  return (
    <div className="page-stack">
      <section className="card input-card">
        <span className="eyebrow">情绪化规划</span>
        <h2>这趟旅行，你想被什么治愈？</h2>
        <div className="search-box">
          <Sparkles size={18} />
          <span>想散心，预算 1800，喜欢安静街区和好吃小店</span>
        </div>
        <div className="tag-row">
          {["治愈", "低预算", "一人友好", "安全优先"].map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>
      </section>

      <section className="destination-strip">
        {destinations.map((item) => (
          <button
            key={item.city}
            className={selectedDestination.city === item.city ? "destination active" : "destination"}
            onClick={() => setSelectedDestination(item)}
          >
            <span>{item.city}</span>
            <small>{item.mood}</small>
          </button>
        ))}
      </section>

      <section className="route-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">推荐方案</span>
            <h3>{selectedDestination.city}三日独旅</h3>
          </div>
          <span className="score-chip">{selectedDestination.score}</span>
        </div>
        <MiniMap />
        <div className="metric-grid">
          <Metric label="预算" value={selectedDestination.budget} />
          <Metric label="强度" value={selectedDestination.energy} />
          <Metric label="安全" value="高" />
        </div>
      </section>

      <section className="card">
        <div className="section-title">
          <h3>行程草案</h3>
          <button className="text-button" onClick={() => showToast("拖拽调整将在下一阶段实现")}>拖拽排序</button>
        </div>
        {selectedDestination.plan.map((item) => (
          <div className="plan-row" key={item.title}>
            <span className="plan-dot" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </div>
            <ChevronRight size={16} />
          </div>
        ))}
      </section>

      <section className="recommend-grid">
        <InfoTile icon={Shield} title="住宿安全" text="优先筛选前台清晰、夜间主路可达酒店" />
        <InfoTile icon={Camera} title="拍照友好" text="标记适合单人自拍和三脚架的位置" />
        <InfoTile icon={MapPin} title="避坑提醒" text="过滤过度营销和绕路景点" />
      </section>

      <button className="primary-button full" onClick={() => setActivePage("home")}>
        <Route size={17} /> 锁定行程并进入陪伴
      </button>
    </div>
  );
}

function SafetyPage({ showToast }) {
  return (
    <div className="page-stack">
      <section className="night-panel">
        <div>
          <span className="pill dark"><Moon size={14} /> 夜间安全守护中</span>
          <h2>返程路线已避开偏僻小路</h2>
          <p>若停留超过 5 分钟或偏离主干道，我会先轻声确认，再建议联系紧急联系人。</p>
        </div>
        <button className="sos-button" onClick={() => showToast("演示模式：已模拟发送定位给紧急联系人")}>
          SOS
        </button>
      </section>

      <section className="card">
        <div className="section-title">
          <h3>守护状态</h3>
          <Shield size={18} />
        </div>
        {safetyCards.map((item) => {
          const Icon = item.icon === "route" ? Navigation : item.icon === "phone" ? Phone : Moon;
          return (
            <div className="safety-row" key={item.title}>
              <span className={item.level === "warning" ? "safety-icon warning" : "safety-icon"}>
                <Icon size={17} />
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="card contact-card">
        <div className="section-title">
          <h3>紧急联系人</h3>
          <UserRound size={18} />
        </div>
        <label>
          姓名
          <input value="罗悦" readOnly />
        </label>
        <label>
          手机
          <input value="138 0000 2026" readOnly />
        </label>
        <button className="secondary-button" onClick={() => showToast("联系人编辑将在下一阶段开放")}>编辑联系人</button>
      </section>

      <section className="alert-card">
        <strong>偏航确认示例</strong>
        <p>这条路比原路线暗一些，要不要我陪你打个语音，或者帮你改走主干道？</p>
        <div className="route-actions">
          <button className="secondary-button" onClick={() => showToast("已保持当前路线")}>继续当前路线</button>
          <button className="primary-button compact" onClick={() => showToast("已切换明亮路线")}>换安全路线</button>
        </div>
      </section>
    </div>
  );
}

function MemoryPage({ showToast }) {
  return (
    <div className="page-stack">
      <section className="memory-hero">
        <span className="pill"><Sparkles size={14} /> AI 手帐已生成</span>
        <h2>这次旅行，比你想象中更勇敢一点。</h2>
        <div className="photo-collage">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="card">
        <div className="section-title">
          <h3>旅程摘要</h3>
          <CalendarDays size={18} />
        </div>
        <div className="metric-grid">
          <Metric label="天数" value="3天" />
          <Metric label="步数" value="26840" />
          <Metric label="照片" value="86张" />
        </div>
      </section>

      <section className="card">
        <div className="section-title">
          <h3>回忆片段</h3>
          <Star size={18} />
        </div>
        {memories.map((item) => (
          <div className="memory-row" key={item.title}>
            <span className="memory-thumb" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="share-card">
        <span className="eyebrow">朋友圈文案</span>
        <p>一个人走过的路，也可以被好好记住。今天在沙面吹到晚风，在老街吃到热汤，FellowTrip 一直安静地陪我确认方向。</p>
        <button className="primary-button compact" onClick={() => showToast("文案已复制到剪贴板演示")}>一键复制</button>
      </section>

      <section className="card">
        <div className="section-title">
          <h3>评价这次陪伴</h3>
          <span className="stars">★★★★★</span>
        </div>
        <div className="tag-row">
          {["不打扰", "安全感强", "讲解自然", "路线靠谱"].map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="segmented">
      {options.map((option) => (
        <button
          key={option.value}
          className={value === option.value ? "active" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function MiniMap() {
  return (
    <div className="mini-map" aria-label="抽象路线地图">
      <span className="map-node start" />
      <span className="map-node middle" />
      <span className="map-node end" />
      <svg viewBox="0 0 280 118" role="presentation">
        <path d="M34 90 C88 36, 135 102, 183 48 S246 24, 258 32" />
      </svg>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoTile({ icon: Icon, title, text }) {
  return (
    <section className="info-tile">
      <Icon size={18} />
      <strong>{title}</strong>
      <p>{text}</p>
    </section>
  );
}

function OptionSection({ title, items, selected }) {
  return (
    <section className="card">
      <div className="section-title">
        <h3>{title}</h3>
      </div>
      <div className="choice-grid">
        {items.map((item) => (
          <button key={item} className={selected === item ? "choice active" : "choice"}>
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
