import { useMemo, useState } from "react";
import { Check, HeartHandshake, MessageCircle, Sparkles, UserRound, Volume2, Wand2 } from "lucide-react";
import SegmentedControl from "../components/SegmentedControl.jsx";
import { buddyProfile, companionOptions } from "../data/mockData.js";

const appearanceOptions = [
  {
    value: "round-bot",
    label: "圆滚机器人",
    tone: "治愈型",
    desc: "反应快，适合随时提醒路线和安全事项。",
  },
  {
    value: "fox-guide",
    label: "小狐狸向导",
    tone: "灵动型",
    desc: "更会找小巷、美食和拍照角度。",
  },
  {
    value: "cloud-cat",
    label: "云朵猫猫",
    tone: "安静型",
    desc: "陪伴感柔和，适合慢节奏独自旅行。",
  },
  {
    value: "human-guide",
    label: "人形向导",
    tone: "可靠型",
    desc: "像一位熟悉城市的朋友，表达更直接。",
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

  return (
    <div className="page-stack">
      <section className="creator-panel buddy-creator-panel">
        <div className="creator-preview buddy-preview">
          <div className={`buddy-avatar buddy-avatar-${appearance}`} aria-hidden="true">
            <span className="buddy-avatar-head" />
            <span className="buddy-avatar-face" />
            <span className="buddy-avatar-body" />
          </div>
          <span className="pill">
            <HeartHandshake size={14} /> {selectedAppearance.tone}搭子
          </span>
        </div>
        <div>
          <span className="eyebrow">{variant === "onboarding" ? "首次设置" : "搭子设置"}</span>
          <h2>让你的旅行搭子先有一个样子</h2>
          <p>{buddyName.trim() || "小旅"}会记住你的旅行偏好、风险边界和喜欢的说话方式。</p>
        </div>
      </section>

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

      <section className="card">
        <div className="section-title">
          <h3>形象类型</h3>
          <Sparkles size={18} />
        </div>
        <div className="appearance-grid">
          {appearanceOptions.map((item) => (
            <button
              key={item.value}
              className={appearance === item.value ? "appearance-choice active" : "appearance-choice"}
              onClick={() => setAppearance(item.value)}
              type="button"
            >
              <span className={`appearance-mini appearance-mini-${item.value}`} aria-hidden="true" />
              <strong>{item.label}</strong>
              <small>{item.desc}</small>
              {appearance === item.value && <Check className="appearance-check" size={15} />}
            </button>
          ))}
        </div>
      </section>

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

      <section className="card">
        <div className="section-title">
          <h3>声线选择</h3>
          <Volume2 size={18} />
        </div>
        <div className="choice-grid">
          {companionOptions.voices.map((item) => (
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
          {companionOptions.frequencies.map((item) => (
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

      <button className="primary-button full" onClick={handleSubmit}>
        <Wand2 size={17} /> {submitLabel}
      </button>
    </div>
  );
}
