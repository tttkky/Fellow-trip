import { CalendarDays, Sparkles, Star } from "lucide-react";
import Metric from "../components/Metric.jsx";
import { memories } from "../data/mockData.js";

export default function MemoryPage({ showToast }) {
  return (
    <div className="page-stack">
      <section className="memory-hero">
        <span className="pill">
          <Sparkles size={14} /> AI 手帐已生成
        </span>
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
        <button className="primary-button compact" onClick={() => showToast("文案已复制到剪贴板演示")}>
          一键复制
        </button>
      </section>

      <section className="card">
        <div className="section-title">
          <h3>评价这次陪伴</h3>
          <span className="stars">★★★★★</span>
        </div>
        <div className="tag-row">
          {["不打扰", "安全感强", "讲解自然", "路线靠谱"].map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
