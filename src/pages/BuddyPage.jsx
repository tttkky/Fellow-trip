import { useState } from "react";
import { Bot, Check, HeartHandshake, MessageCircle, Volume2, Wand2 } from "lucide-react";
import OptionSection from "../components/OptionSection.jsx";
import { companionOptions } from "../data/mockData.js";

export default function BuddyPage({ buddyReady, setBuddyReady, showToast }) {
  const [voice, setVoice] = useState("温柔");
  const [frequency, setFrequency] = useState("中");

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
