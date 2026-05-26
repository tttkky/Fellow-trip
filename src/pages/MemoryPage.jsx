import { useState } from "react";
import { 
  CalendarDays, Sparkles, Star, Heart, FileText, 
  Share2, ChevronLeft, ChevronRight, ClipboardList, MessageSquare 
} from "lucide-react";
import Metric from "../components/Metric.jsx";
import SegmentedControl from "../components/SegmentedControl.jsx";
// 引入 photoTimelineData 以替换原有的本地 localTimelineData
import { memories, memoryArchives, moodCurveData, sharePlatforms, evaluationTags, defaultCommentPlaceholder, photoTimelineData } from "../data/mockData.js";

import hero1 from "../assets/hero-1.jpg";
import hero2 from "../assets/hero-2.jpg";
import hero3 from "../assets/hero-3.jpg";

import day1_1 from "../assets/day1-1.jpg";
import day1_2 from "../assets/day1-2.jpg";
import day1_3 from "../assets/day1-3.jpg";

import day2_1 from "../assets/day2-1.jpg";
import day2_2 from "../assets/day2-2.jpg";
import day2_3 from "../assets/day2-3.jpg";

import day3_1 from "../assets/day3-1.jpg";
import day3_2 from "../assets/day3-2.jpg";
import day3_3 from "../assets/day3-3.jpg";

import mem1 from "../assets/memory-1.jpg";
import mem2 from "../assets/memory-2.jpg";
import mem3 from "../assets/memory-3.jpg";

const memoryArchiveCovers = {
  "guangzhou-2026-05": mem1,
};

export default function MemoryPage({ showToast }) {
  const [openedArchive, setOpenedArchive] = useState(null);
  const [platform, setPlatform] = useState("pyq");
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);

  // 陪伴评价状态
  const [rating, setRating] = useState(5); 
  const [selectedTags, setSelectedTags] = useState(["1", "2"]); 
  const [comment, setComment] = useState("");

  // ================= 核心修复：建立精准的真实图片资产映射表 =================
  const imageAssetMap = {
    // 映射当日足迹图片 (对应 mockData 中的 imgClass)
    "img-day1-1": day1_1,
    "img-day1-2": day1_2,
    "img-day1-3": day1_3,
    "img-day2-1": day2_1,
    "img-day2-2": day2_2,
    "img-day2-3": day2_3,
    "img-day3-1": day3_1,
    "img-day3-2": day3_2,
    "img-day3-3": day3_3,
    // 映射陪伴片段图片 (对应 mockData 中的 imgClass)
    "img-mem-1": mem1,
    "img-mem-2": mem2,
    "img-mem-3": mem3
  };

  const handlePrevDay = () => {
    if (currentDay > 1) setCurrentDay(currentDay - 1);
  };

  const handleNextDay = () => {
    if (currentDay < 3) setCurrentDay(currentDay + 1);
  };

  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const ratingHints = {
    1: "糟糕，需要大幅改进",
    2: "一般，陪伴有些机械",
    3: "合格，路线和安全有保障",
    4: "超棒，感觉非常安心",
    5: "完美！最懂我的独旅神仙搭子"
  };

  const handleSubmitEvaluation = () => {
    const toastMessages = {
      1: "FellowTrip 已收到您的评价，我们将痛定思痛，抓紧改进不好的体验！",
      2: "收到您的反馈，我们会继续打磨智能算法，努力让 FellowTrip 的陪伴更具温度。",
      3: "感谢您的合格评价！FellowTrip 会固守安全底线，并持续优化细节体验。",
      4: "谢谢你的喜欢！有 FellowTrip 的陪伴，愿你的每一次独自出发都充满底气。✨",
      5: "哇！最高赞誉收到！FellowTrip 已经把这段回忆永久珍藏，期待与你下一次温暖同行！🎒"
    };
    showToast(toastMessages[rating]);
    setComment(""); 
  };

  if (!openedArchive) {
    return (
      <div className="page-stack">
        <section className="card memory-list-intro">
          <span className="eyebrow">旅行记忆</span>
          <h3>先选择一段记忆</h3>
          <p>每段旅程都会整理成一份独立手帐。现在先放这一段广州独旅，点击后查看完整回忆。</p>
        </section>

        <section className="memory-archive-list">
          {memoryArchives.map((archive) => (
            <button className="memory-archive-card" type="button" key={archive.id} onClick={() => setOpenedArchive(archive)}>
              <span className="memory-archive-cover" style={{ backgroundImage: `url(${memoryArchiveCovers[archive.id] ?? mem1})` }} />
              <div>
                <span className="eyebrow">{archive.city} · {archive.date}</span>
                <strong>{archive.title}</strong>
                <p>{archive.summary}</p>
                <div className="tag-row">
                  {archive.stats.map((item) => (
                    <span className="tag" key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <ChevronRight size={18} />
            </button>
          ))}
        </section>
      </div>
    );
  }

  return (
      <div className="page-stack">
        <button className="memory-detail-back" type="button" onClick={() => setOpenedArchive(null)}>
          <ChevronLeft size={17} />
          <span>返回记忆列表</span>
        </button>
        {/* 顶部英雄卡片 - 替换真实顶部图 */}
        <section className="memory-hero">
          <span className="pill">
            <Sparkles size={14} /> AI 手帐已生成
          </span>
          <h2>这次旅行，<br></br>比你想象中更勇敢一点。</h2>
          <div className="photo-collage">
            <span style={{ backgroundImage: `url(${hero1})` }} />
            <span style={{ backgroundImage: `url(${hero2})` }} />
            <span style={{ backgroundImage: `url(${hero3})` }} />
          </div>
        </section>

        {/* 旅程摘要 */}
        <section className="card">
          <div className="section-title">
            <h3>旅程摘要</h3>
          </div>
          <div className="metric-grid">
            <Metric label="天数" value="3天" />
            <Metric label="步数" value="26840" />
            <Metric label="照片" value="86张" />
          </div>
        </section>

        {/* 心情曲线 */}
        <section className="card">
          <div className="section-title">
            <h3>独旅心情波动曲线</h3>
          </div>
          <div className="mood-container">
            <svg className="mood-svg-box" viewBox="0 0 280 100">
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--mint)" />
                  <stop offset="50%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--pink)" />
                </linearGradient>
              </defs>
              <line x1="0" y1="80" x2="280" y2="80" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 4" />
              <polyline points={moodCurveData.points} className="mood-line" />
              {moodCurveData.points.split(" ").map((pt, idx) => {
                const [x, y] = pt.split(",");
                return <circle key={idx} cx={x} cy={y} r="5" className="mood-dot-glow" />;
              })}
              {moodCurveData.labels.map((lbl, idx) => (
                <text key={idx} x={lbl.x} y={lbl.y} className="mood-text" textAnchor="middle">
                  {lbl.text}
                </text>
              ))}
            </svg>
          </div>
        </section>

        {/* 当日足迹照片流 - 完美加载三日配图 */}
        <section className="card">
          <div className="section-title" style={{ marginBottom: "12px" }}>
            <h3>当日足迹照片流</h3>
          </div>

          <div className="day-switcher">
            <button className="nav-arrow" onClick={handlePrevDay} disabled={currentDay === 1}>
              <ChevronLeft size={20} />
            </button>
            <div className="day-info">
              <strong>Day {currentDay}</strong>
              <span>{currentDay === 1 ? "5月18日" : currentDay === 2 ? "5月19日" : "5月20日"}</span>
            </div>
            <button className="nav-arrow" onClick={handleNextDay} disabled={currentDay === 3}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="photo-timeline-flow">
            {/* 修复：将数据源完全替换为 mockData 中的全局 photoTimelineData */}
            {photoTimelineData[currentDay]?.map((item, index) => (
              <div className="timeline-photo-row" key={`${currentDay}-${index}`}>
                <span className="time-left">{item.time}</span>
                <div className="photo-timeline-card">
                  {/* 修复：通过映射表精准找到资产图片，并且额外附带其 imgClass 类名保障潜在的全局 CSS 兼容性 */}
                  <div 
                    className={`photo-placeholder-box ${item.imgClass || ""}`}
                    style={{ backgroundImage: `url(${imageAssetMap[item.imgClass]})` }}
                  />
                  <div className="photo-info-box">
                    <strong>{item.tag}</strong>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 陪伴回忆片段 - 替换陪伴图 */}
        <section className="card">
          <div className="section-title">
            <h3>陪伴回忆片段</h3>
          </div>
          {memories.map((item) => (
            <div 
              className="memory-row memory-row-clickable" 
              key={item.title}
              onClick={() => setSelectedMemory(item)}
            >
              {/* 修复：摆脱繁琐的 index 强绑定，直接使用 mock 里的项对应的 imgClass 映射真实图 */}
              <span 
                className={`memory-thumb ${item.imgClass || ""}`}
                style={{ backgroundImage: `url(${imageAssetMap[item.imgClass]})` }}
              />
              <div>
                <strong>&nbsp;&nbsp;&nbsp;{item.title}</strong>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;{item.text}</p>
                <span className="click-tip">&nbsp;&nbsp;&nbsp;&nbsp;点击查看深度复盘</span>
              </div>
            </div>
          ))}
        </section>

        {/* 分享文案 */}
        <section className="share-card">
          <div className="section-title" style={{ marginBottom: "10px" }}>
            <span className="eyebrow">一键打卡文案</span>
            <Share2 size={16} style={{ color: "var(--primary)" }} />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <SegmentedControl
              value={platform}
              onChange={setPlatform}
              options={[
                { value: "pyq", label: "朋友圈" },
                { value: "xhs", label: "小红书" },
              ]}
            />
          </div>
          <p style={{ background: "rgba(255,255,255,0.5)", padding: "12px", borderRadius: "10px", margin: "0 0 12px 0", fontSize: "12px" }}>
            {sharePlatforms[platform]}
          </p>
          <button className="primary-button compact full" onClick={() => showToast(`文案已复制`)}>
            复制文案
          </button>
        </section>

        {/* 陪伴反馈评价 */}
        <section className="card" style={{ marginBottom: "24px" }}>
          <div className="section-title">
            <h3>评价这次AI陪伴</h3>
          </div>
          
          <div className="rating-container">
            <div className="star-row">
              {[1, 2, 3, 4, 5].map((num) => (
                <span 
                  key={num} 
                  className={`star-item ${rating >= num ? 'active' : ''}`}
                  onClick={() => setRating(num)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="rating-hint">{ratingHints[rating]}</div>
          </div>

          <div className="eval-tag-grid">
            {evaluationTags.map((tag) => (
              <span 
                key={tag.id} 
                className={`eval-tag ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.text}
              </span>
            ))}
          </div>

          <div className="eval-feedback-box">
            <textarea 
              className="eval-textarea"
              placeholder={defaultCommentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button className="submit-eval-btn" onClick={handleSubmitEvaluation}>
            提交给 FellowTrip 的独旅反馈
          </button>
        </section>

        {/* 弹窗详情 */}
        {selectedMemory && (
          <div className="modal-overlay" onClick={() => setSelectedMemory(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedMemory.title} · 深度复盘</h3>
                <button className="close-modal-btn" onClick={() => setSelectedMemory(null)}>✕</button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: "600", marginBottom: "8px" }}>
                  “{selectedMemory.text}”
                </p>
                <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: "1.5" }}>
                  {selectedMemory.details}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
