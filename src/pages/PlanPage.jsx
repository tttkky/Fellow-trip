import { Camera, ChevronRight, MapPin, Route, Shield, Sparkles } from "lucide-react";
import InfoTile from "../components/InfoTile.jsx";
import Metric from "../components/Metric.jsx";
import MiniMap from "../components/MiniMap.jsx";
import { destinations } from "../data/mockData.js";

export default function PlanPage({ selectedDestination, setSelectedDestination, setActivePage, showToast }) {
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
            <span className="tag" key={tag}>
              {tag}
            </span>
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
          <button className="text-button" onClick={() => showToast("拖拽调整将在下一阶段实现")}>
            拖拽排序
          </button>
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
