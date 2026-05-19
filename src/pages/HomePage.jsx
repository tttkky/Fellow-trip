import { Bot, Shield, SunMedium, Volume2 } from "lucide-react";
import MiniMap from "../components/MiniMap.jsx";
import SegmentedControl from "../components/SegmentedControl.jsx";
import { timeline } from "../data/mockData.js";

export default function HomePage({ mode, setMode, setActivePage, showToast }) {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="pill soft">
            <SunMedium size={14} /> 广州 26°C 晴
          </span>
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
          <button className="text-button" onClick={() => setActivePage("plan")}>
            调整
          </button>
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
