import { useState } from "react";
import { Bot, Check, HeartHandshake, MessageCircle, Volume2, Wand2 } from "lucide-react";
import OptionSection from "../components/OptionSection.jsx";
import SegmentedControl from "../components/SegmentedControl.jsx";
import { buddyProfile, companionOptions } from "../data/mockData.js";

export default function BuddyPage({ variant = "onboarding", submitLabel = "保存搭子设置", onComplete }) {
  const [voice, setVoice] = useState(buddyProfile.voice);
  const [frequency, setFrequency] = useState(buddyProfile.frequency);
  const [companionMode, setCompanionMode] = useState("realtime");

  return (
    <div className="page-stack">
      <section className="creator-panel">
        <div className="creator-preview">
          <div className="avatar-stage">
            <Bot size={60} />
          </div>
          <span className="pill">
            <HeartHandshake size={14} /> 治愈型搭子
          </span>
        </div>
        <div>
          <span className="eyebrow">{variant === "onboarding" ? "首次设置" : "搭子设置"}</span>
          <h2>让 AI 搭子拥有刚刚好的陪伴感</h2>
          <p>它会记住你的旅行偏好、风险边界和喜欢的说话方式。</p>
        </div>
      </section>

      <OptionSection title="形象类型" items={companionOptions.appearance} selected={buddyProfile.appearance} />

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

      <button className="primary-button full" onClick={onComplete}>
        <Wand2 size={17} /> {submitLabel}
      </button>
    </div>
  );
}
