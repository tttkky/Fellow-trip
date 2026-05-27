import { useMemo, useState } from "react";
import { Check, HeartHandshake, MessageCircle, Sparkles, UserRound, Volume2, Wand2 } from "lucide-react";
import SegmentedControl from "../components/SegmentedControl.jsx";
import { buddyProfile, companionOptions } from "../data/mockData.js";

// ==========================================
// 1. 独家造型渲染引擎：彻底替换原本锁死形状的 CSS span 结构
// ==========================================
function RenderBuddyShape({ type }) {
  switch (type) {
    case "round-bot":
      return (
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
          {/* 机器人专属：电子天线 */}
          <rect x="47" y="5" width="6" height="12" rx="3" fill="#0ea5e9" />
          <circle cx="50" cy="5" r="4" fill="#f43f5e" />
          {/* 机器人科技感方圆头部 */}
          <rect x="20" y="16" width="60" height="52" rx="16" fill="#0ea5e9" />
          {/* LED显示屏幕 */}
          <rect x="28" y="24" width="44" height="28" rx="8" fill="#1e293b" />
          {/* 智能发光双眼 */}
          <circle cx="42" cy="38" r="4" fill="#22c55e" />
          <circle cx="58" cy="38" r="4" fill="#22c55e" />
          {/* 悬浮动力底座 */}
          <path d="M30 68 C30 68, 25 90, 50 90 C75 90, 70 68, 70 68 Z" fill="#38bdf8" />
        </svg>
      );
    case "fox-guide":
      return (
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
          {/* 狐狸向导专属：挺拔的三角形大耳朵 */}
          <polygon points="18,38 22,8 46,32" fill="#ea580c" />
          <polygon points="82,38 78,8 54,32" fill="#ea580c" />
          <polygon points="24,34 26,16 40,30" fill="#ffedd5" />
          <polygon points="76,34 74,16 60,30" fill="#ffedd5" />
          {/* 标志性倒三角狐狸脸颊 */}
          <polygon points="16,38 84,38 50,78" fill="#f97316" />
          {/* 两侧标志性白毛花纹 */}
          <polygon points="16,38 36,38 26,56" fill="#ffffff" />
          <polygon points="84,38 64,38 74,56" fill="#ffffff" />
          {/* 灵动双眼与倒三角小黑鼻 */}
          <circle cx="38" cy="44" r="4" fill="#1e293b" />
          <circle cx="62" cy="44" r="4" fill="#1e293b" />
          <polygon points="46,72 54,72 50,78" fill="#1e293b" />
          {/* 冒险家标志红色小领巾 */}
          <path d="M38 72 L50 88 L62 72 Z" fill="#ef4444" />
        </svg>
      );
    case "cloud-cat":
      return (
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
          {/* 云朵猫咪专属：软萌尖尖猫耳 */}
          <polygon points="22,34 30,10 48,28" fill="#a855f7" />
          <polygon points="78,34 70,10 52,28" fill="#a855f7" />
          {/* 蓬松绵软的波浪状云朵大脸蛋 */}
          <path d="M22 46 C12 46, 12 28, 30 28 C36 16, 64 16, 70 28 C88 28, 88 46, 78 46 C88 60, 74 74, 50 74 C26 74, 12 60, 22 46 Z" fill="#f3e8ff" />
          {/* 治愈系眯眯眼与粉嘟嘟小鼻子 */}
          <path d="M34 42 Q40 46 42 42" stroke="#a855f7" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M66 42 Q60 46 58 42" stroke="#a855f7" strokeWidth="3" fill="none" strokeLinecap="round" />
          <polygon points="47,51 53,51 50,55" fill="#f43f5e" />
          {/* 萌系小髭须 */}
          <line x1="18" y1="46" x2="6" y2="44" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="52" x2="4" y2="53" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="46" x2="94" y2="44" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="52" x2="96" y2="53" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "human-guide":
      return (
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
          {/* 人形向导专属：潮流防晒运动遮阳帽 */}
          <path d="M26 36 C26 18, 74 18, 74 36 Z" fill="#475569" />
          <path d="M36 24 L86 28 C86 28, 86 36, 70 36 Z" fill="#64748b" />
          {/* 本地向导可靠面庞 */}
          <circle cx="50" cy="50" r="23" fill="#fed7aa" />
          {/* 标配酷炫户外太阳墨镜 */}
          <rect x="31" y="44" width="17" height="11" rx="4" fill="#1e293b" />
          <rect x="52" y="44" width="17" height="11" rx="4" fill="#1e293b" />
          <line x1="48" y1="47" x2="52" y2="47" stroke="#1e293b" strokeWidth="3" />
          {/* 阳光自信大微笑 */}
          <path d="M43 60 Q50 66 57 60" stroke="#4a0404" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* 防风冲锋衣立领 */}
          <path d="M25 82 C25 72, 32 70, 50 70 C68 70, 75 72, 75 82 Z" fill="#475569" />
        </svg>
      );
    default:
      return null;
  }
}

const appearanceOptions = [
  {
    value: "round-bot",
    label: "圆滚机器人",
    tone: "治愈系",
    tags: ["路线播报", "全天候安全盾", "高效率"],
    gradient: "linear-gradient(135deg, #bae6fd 0%, #0284c7 100%)", 
    desc: "全天候安全守护盾。反应敏捷，最擅长精准播报路线、天气与安全预警，给你满满的确定感。",
  },
  {
    value: "fox-guide",
    label: "小狐狸向导",
    tone: "灵动系",
    tags: ["宝藏美食", "拍照神仙机位", "小众街区"],
    gradient: "linear-gradient(135deg, #fed7aa 0%, #ea580c 100%)", 
    desc: "资深街头探险家。专职挖掘隐藏小巷、地道宝藏美食，自带拉慢的拍照机位雷达。",
  },
  {
    value: "cloud-cat",
    label: "云朵猫猫",
    tone: "慢热系",
    tags: ["不打扰", "佛系随心", "情绪树洞"],
    gradient: "linear-gradient(135deg, #f3e8ff 0%, #7e22ce 100%)", 
    desc: "佛系慢旅行体验官。温和安静不打扰，极度契合走走停停、漫无目的的灵魂漫游者。",
  },
  {
    value: "human-guide",
    label: "人形向导",
    tone: "老铁系",
    tags: ["本地老友", "避坑指南", "地道方言"],
    gradient: "linear-gradient(135deg, #e2e8f0 0%, #334155 100%)", 
    desc: "靠谱又健谈的本地老友。地道方言信手拈来，表达直爽利落，总能给你最接地气的避坑指南。",
  },
];

const legacyAppearanceMap = {
  圆滚机器人: "round-bot",
  小狐狸: "fox-guide",
  小狐狸向导: "fox-guide",
  云朵猫: "cloud-cat",
  云朵猫猫: "cloud-cat",
  人形向导: "human-guide",
};

export default function BuddyPage({
  variant = "onboarding",
  submitLabel = "保存搭子设置",
  initialSettings = buddyProfile,
  onComplete,
}) {
  const initialAppearance = legacyAppearanceMap[initialSettings.appearance] ?? initialSettings.appearance ?? "round-bot";
  const [buddyName, setBuddyName] = useState(initialSettings.name || "小旅");
  const [appearance, setAppearance] = useState(initialAppearance);
  const [voice, setVoice] = useState(initialSettings.voice || buddyProfile.voice);
  const [frequency, setFrequency] = useState(initialSettings.frequency || buddyProfile.frequency);
  const [companionMode, setCompanionMode] = useState(initialSettings.companionMode || "realtime");

  const selectedAppearance = useMemo(
    () => appearanceOptions.find((item) => item.value === appearance) ?? appearanceOptions[0],
    [appearance],
  );

  const handleSubmit = () => {
    onComplete?.({
      name: buddyName.trim() || "小旅",
      appearance,
      voice,
      frequency,
      companionMode,
    });
  };

  const dynamicName = buddyName.trim() || "小旅";

  return (
    <div className="page-stack">
      {/* 头部大预览面板 - 完美的背景和矢量独立形象多态联动 */}
      <section 
        className="creator-panel buddy-creator-panel"
        style={{ 
          background: selectedAppearance.gradient,
          transition: "background 0.4s ease-in-out",
          borderRadius: "24px",
          color: "#ffffff",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}
      >
        <div className="creator-preview buddy-preview" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          
          {/* 【关键重构】：彻底删除了死板的 span 结构，注入真正的动态图形渲染引擎 */}
          <div 
            className={`buddy-avatar buddy-avatar-${appearance}`} 
            aria-hidden="true"
            style={{ 
              width: "80px", 
              height: "80px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              background: "rgba(255,255,255,0.9)",
              borderRadius: "20px",
              padding: "6px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
            }}
          >
            <RenderBuddyShape type={appearance} />
          </div>

          <span className="pill" style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(8px)", padding: "4px 12px", borderRadius: "99px", fontSize: "12px" }}>
            <HeartHandshake size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> {selectedAppearance.tone}搭子
          </span>
        </div>
        <div className="creator-intro">
          <span className="eyebrow" style={{ opacity: 0.8, fontSize: "12px" }}>{variant === "onboarding" ? "首次设置" : "搭子设置"}</span>
          <h2 style={{ fontSize: "20px", margin: "4px 0", fontWeight: "bold", textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>让你的旅行搭子先有一个样子</h2>
          <p style={{ opacity: 0.9, fontSize: "13px", lineHeight: "1.4" }}>{dynamicName}会记住你的旅行偏好、风险边界和喜欢的说话方式。</p >
        </div>
      </section>

      {/* 名字设置卡片 */}
      <section className="card buddy-name-card">
        <div className="section-title">
          <h3>给搭子起名</h3>
          <UserRound size={18} />
        </div>
        <label className="buddy-name-field">
          <span>搭子昵称</span>
          <input
            value={buddyName}
            maxLength={10}
            onChange={(event) => setBuddyName(event.target.value)}
            placeholder="比如 小旅"
            aria-label="搭子昵称"
          />
        </label>
      </section>

      {/* 形象选择网格 */}
      <section className="card">
        <div className="section-title">
          <h3>形象类型</h3>
          <Sparkles size={18} />
        </div>
        <div className="appearance-grid" style={{ display: "grid", gap: "14px" }}>
          {appearanceOptions.map((item) => {
            const isSelected = appearance === item.value;
            return (
              <button
                key={item.value}
                className={`appearance-choice ${isSelected ? "active" : ""}`}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  textAlign: "left",
                  padding: "16px",
                  borderRadius: "16px",
                  border: isSelected ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                  backgroundColor: isSelected ? "#f8fafc" : "#ffffff",
                  boxShadow: isSelected ? "0 8px 20px -4px rgba(59, 130, 246, 0.15)" : "none",
                  transition: "all 0.25s ease",
                  cursor: "pointer"
                }}
                onClick={() => setAppearance(item.value)}
                type="button"
                aria-pressed={isSelected}
              >
                {/* 选项内部的同款角色缩略图展示 */}
                <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "12px", marginBottom: "8px" }}>
                  <span 
                    className={`appearance-mini appearance-mini-${item.value}`} 
                    aria-hidden="true"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: item.gradient,
                      padding: "4px"
                    }}
                  >
                    <RenderBuddyShape type={item.value} />
                  </span>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong style={{ fontSize: "16px", color: "#1e293b" }}>{item.label}</strong>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>风格：{item.tone}</span>
                  </div>
                </div>

                <small style={{ color: "#475569", fontSize: "13px", lineHeight: "1.5", marginBottom: "10px" }}>{item.desc}</small>
                
                {/* 亮点标签 */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {item.tags.map((tag) => (
                    <span 
                      key={tag} 
                      style={{ 
                        fontSize: "11px", 
                        padding: "2px 8px", 
                        borderRadius: "999px", 
                        background: isSelected ? "#dbeafe" : "#f1f5f9",
                        color: isSelected ? "#1d4ed8" : "#475569"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 右上角选中状态标识 */}
                {isSelected && (
                  <div style={{ position: "absolute", top: "16px", right: "16px", color: "#3b82f6" }}>
                    <Check className="appearance-check" size={18} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 默认陪伴模式 */}
      <section className="card">
        <div className="section-title">
          <h3>默认陪伴模式</h3>
          <MessageCircle size={18} />
        </div>
        <SegmentedControl
          value={companionMode}
          onChange={setCompanionMode}
          options={[
            { value: "realtime", label: "实时陪伴" },
            { value: "quiet", label: "后台响应" },
          ]}
        />
      </section>

      {/* 声线选择 */}
      <section className="card">
        <div className="section-title">
          <h3>声线选择</h3>
          <Volume2 size={18} />
        </div>
        <div className="choice-grid">
          {companionOptions.voices.map((item) => (
            <button 
              key={item} 
              className={`choice ${voice === item ? "active" : ""}`} 
              onClick={() => setVoice(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* 主动对话频率 */}
      <section className="card">
        <div className="section-title">
          <h3>主动对话频率</h3>
          <MessageCircle size={18} />
        </div>
        <div className="frequency-list">
          {companionOptions.frequencies.map((item) => {
            const isSelected = frequency === item;
            return (
              <button
                key={item}
                className={`frequency ${isSelected ? "active" : ""}`}
                onClick={() => setFrequency(item)}
                type="button"
              >
                <span>{item}</span>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </section>

      {/* 提交按钮 */}
      <button className="primary-button full" onClick={handleSubmit} type="button">
        <Wand2 size={17} /> {submitLabel}
      </button>
    </div>
  );
}