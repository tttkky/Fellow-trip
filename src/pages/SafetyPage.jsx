import { Moon, Navigation, Phone, Shield, UserRound } from "lucide-react";
import { safetyCards } from "../data/mockData.js";

export default function SafetyPage({ showToast }) {
  return (
    <div className="page-stack">
      <section className="night-panel">
        <div>
          <span className="pill dark">
            <Moon size={14} /> 夜间安全守护中
          </span>
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
        <button className="secondary-button" onClick={() => showToast("联系人编辑将在下一阶段开放")}>
          编辑联系人
        </button>
      </section>

      <section className="alert-card">
        <strong>偏航确认示例</strong>
        <p>这条路比原路线暗一些，要不要我陪你打个语音，或者帮你改走主干道？</p>
        <div className="route-actions">
          <button className="secondary-button" onClick={() => showToast("已保持当前路线")}>
            继续当前路线
          </button>
          <button className="primary-button compact" onClick={() => showToast("已切换明亮路线")}>
            换安全路线
          </button>
        </div>
      </section>
    </div>
  );
}
