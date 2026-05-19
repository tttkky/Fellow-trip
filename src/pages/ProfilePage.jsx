import { Bot, ChevronRight, History, LogOut, Shield, UserRound } from "lucide-react";
import { buddyProfile, tripHistory, userProfile } from "../data/mockData.js";

export default function ProfilePage({ onEditBuddy, onLogout, showToast }) {
  return (
    <div className="page-stack">
      <section className="profile-hero">
        <div className="profile-avatar">
          <UserRound size={34} />
        </div>
        <div>
          <span className="eyebrow">独旅档案</span>
          <h2>{userProfile.name}</h2>
          <p>{userProfile.city} · 已完成 {userProfile.travelCount} 次独自旅行</p>
        </div>
      </section>

      <section className="card">
        <div className="section-title">
          <h3>用户信息</h3>
          <UserRound size={18} />
        </div>
        <div className="profile-row">
          <span>手机号</span>
          <strong>{userProfile.phone}</strong>
        </div>
        <div className="profile-row">
          <span>常驻城市</span>
          <strong>{userProfile.city}</strong>
        </div>
        <div className="profile-row">
          <span>紧急联系人</span>
          <strong>{userProfile.safetyContact}</strong>
        </div>
      </section>

      <button className="profile-action" onClick={onEditBuddy}>
        <span className="profile-action-icon">
          <Bot size={20} />
        </span>
        <span>
          <strong>搭子设置</strong>
          <small>{buddyProfile.name} · {buddyProfile.voice}声线 · {buddyProfile.frequency}频率</small>
        </span>
        <ChevronRight size={18} />
      </button>

      <button className="profile-action" onClick={() => showToast("安全偏好编辑将在下一阶段开放")}>
        <span className="profile-action-icon mint">
          <Shield size={20} />
        </span>
        <span>
          <strong>安全偏好</strong>
          <small>夜间守护、偏航提醒、联系人策略</small>
        </span>
        <ChevronRight size={18} />
      </button>

      <section className="card">
        <div className="section-title">
          <h3>历史旅行</h3>
          <History size={18} />
        </div>
        {tripHistory.map((trip) => (
          <div className="history-row" key={`${trip.city}-${trip.date}`}>
            <div>
              <strong>{trip.city}</strong>
              <p>{trip.summary}</p>
            </div>
            <span>{trip.date}</span>
          </div>
        ))}
      </section>

      <button className="secondary-button full-width" onClick={onLogout}>
        <LogOut size={17} /> 退出登录
      </button>
    </div>
  );
}
