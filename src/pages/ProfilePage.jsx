import { useEffect, useState } from "react";
import { Bot, ChevronDown, ChevronRight, History, LogOut, MapPin, Phone, Shield, UserRound } from "lucide-react";
import { memoryArchives, tripHistory, userProfile } from "../data/mockData.js";
import profileAvatar from "../assets/profile-avatar.png";

const appearanceLabels = {
  "round-bot": "圆滚机器人",
  "fox-guide": "小狐狸向导",
  "cloud-cat": "云朵猫猫",
  "human-guide": "人形向导",
};

const safetyPreferenceOptions = [
  { key: "safetyMode", label: "安全守护模式", description: "在行程中持续开启安全陪伴" },
  { key: "nightTravelReminder", label: "夜间出行提醒", description: "天黑后的返程和主路提示" },
  { key: "remoteRouteHint", label: "偏僻路线轻提示", description: "经过低人流路线时轻量提醒" },
  { key: "locationShareReminder", label: "位置共享提醒", description: "必要时提醒邀请好友查看位置" },
  { key: "emergencyContactReminder", label: "紧急联系人提示", description: "求助前提示联系人联动方式" },
];

export default function ProfilePage({
  userSettings = userProfile,
  buddySettings,
  safetyPreferences,
  onEditBuddy,
  onEditProfile,
  onEditSafety,
  onOpenTrip,
  onLogout,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState(userSettings);

  useEffect(() => {
    setProfileDraft(userSettings);
  }, [userSettings]);

  const buddyName = buddySettings?.name ?? "小旅";
  const appearance = appearanceLabels[buddySettings?.appearance] ?? buddySettings?.appearance ?? "圆滚机器人";
  const voice = buddySettings?.voice ?? "温柔";
  const frequency = buddySettings?.frequency ?? "中";
  const completedSoloTripCount = memoryArchives.length;
  const activeSafetyCount = safetyPreferenceOptions.filter((item) => safetyPreferences[item.key]).length;

  const toggleSafetyPreference = (key) => {
    onEditSafety({
      ...safetyPreferences,
      [key]: !safetyPreferences[key],
    });
  };

  const updateProfileDraft = (key, value) => {
    setProfileDraft((draft) => ({ ...draft, [key]: value }));
  };

  const saveProfileDraft = (event) => {
    event.preventDefault();
    const nextProfile = {
      ...userSettings,
      ...profileDraft,
      name: profileDraft.name?.trim() || userSettings.name,
      city: profileDraft.city?.trim() || userSettings.city,
      phone: profileDraft.phone?.trim() || userSettings.phone,
      safetyContact: profileDraft.safetyContact?.trim() || userSettings.safetyContact,
      safetyContactPhone: profileDraft.safetyContactPhone?.trim() || userSettings.safetyContactPhone || "",
    };
    onEditProfile?.(nextProfile);
    setProfileDraft(nextProfile);
    setProfileOpen(false);
  };

  return (
    <div className="page-stack">
      <section className="profile-hero">
        <div className="profile-avatar">
          <img src={profileAvatar} alt={`${userSettings.name}的头像`} />
        </div>
        <div>
          <span className="eyebrow">独旅档案</span>
          <h2>{userSettings.name}</h2>
          <p>
            {userSettings.city} · 已完成 {completedSoloTripCount} 次独自旅行
          </p>
        </div>
      </section>

      <button
        className="profile-action"
        type="button"
        aria-expanded={profileOpen}
        onClick={() => {
          setProfileDraft(userSettings);
          setProfileOpen((open) => !open);
        }}
      >
        <span className="profile-action-icon">
          <UserRound size={20} />
        </span>
        <span>
          <strong>个人信息设置</strong>
          <small>
            {userSettings.name} · {userSettings.city} · 紧急联系人：{userSettings.safetyContact}
          </small>
        </span>
        {profileOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {profileOpen && (
        <form className="card profile-settings-card" onSubmit={saveProfileDraft}>
          <label className="profile-settings-field">
            <span><UserRound size={15} /> 名字</span>
            <input value={profileDraft.name ?? ""} onChange={(event) => updateProfileDraft("name", event.target.value)} />
          </label>
          <label className="profile-settings-field">
            <span><MapPin size={15} /> 地区</span>
            <input value={profileDraft.city ?? ""} onChange={(event) => updateProfileDraft("city", event.target.value)} />
          </label>
          <label className="profile-settings-field">
            <span><Phone size={15} /> 手机号码</span>
            <input value={profileDraft.phone ?? ""} onChange={(event) => updateProfileDraft("phone", event.target.value)} />
          </label>
          <label className="profile-settings-field">
            <span><Shield size={15} /> 紧急联系人</span>
            <input value={profileDraft.safetyContact ?? ""} onChange={(event) => updateProfileDraft("safetyContact", event.target.value)} />
          </label>
          <label className="profile-settings-field">
            <span><Phone size={15} /> 紧急联系人号码</span>
            <input value={profileDraft.safetyContactPhone ?? ""} onChange={(event) => updateProfileDraft("safetyContactPhone", event.target.value)} />
          </label>
          <button className="primary-button full" type="submit">
            保存个人信息
          </button>
        </form>
      )}

      <button className="profile-action" type="button" onClick={onEditBuddy}>
        <span className="profile-action-icon">
          <Bot size={20} />
        </span>
        <span>
          <strong>搭子设置</strong>
          <small>
            {buddyName} · {appearance} · {voice}声线 · {frequency}频率
          </small>
        </span>
        <ChevronRight size={18} />
      </button>

      <button
        className="profile-action"
        type="button"
        aria-expanded={safetyOpen}
        onClick={() => setSafetyOpen((open) => !open)}
      >
        <span className="profile-action-icon mint">
          <Shield size={20} />
        </span>
        <span>
          <strong>安全偏好</strong>
          <small>{activeSafetyCount} 项已开启 · 点击设置守护提醒</small>
        </span>
        {safetyOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {safetyOpen && (
        <section className="card safety-preferences-card" aria-label="安全偏好设置">
          {safetyPreferenceOptions.map((item) => (
            <button
              className="safety-preference-row"
              type="button"
              role="switch"
              aria-checked={safetyPreferences[item.key]}
              key={item.key}
              onClick={() => toggleSafetyPreference(item.key)}
            >
              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
              <i className={safetyPreferences[item.key] ? "active" : ""}>
                <b />
              </i>
            </button>
          ))}
        </section>
      )}

      <section className="card">
        <div className="section-title">
          <h3>历史旅行</h3>
          <History size={18} />
        </div>
        {tripHistory.map((trip) => {
          const archive = memoryArchives.find((item) => item.city === trip.city);
          const HistoryRow = archive ? "button" : "div";

          return (
            <HistoryRow
              className={archive ? "history-row interactive" : "history-row"}
              type={archive ? "button" : undefined}
              key={`${trip.city}-${trip.date}`}
              onClick={archive ? () => onOpenTrip(archive) : undefined}
              aria-label={archive ? `查看${trip.city}旅行回忆` : undefined}
            >
              <div>
                <strong>{trip.city}</strong>
                <p>{trip.summary}</p>
              </div>
              <span>
                {trip.date}
                {archive && <ChevronRight size={14} />}
              </span>
            </HistoryRow>
          );
        })}
      </section>

      <button className="secondary-button full-width" type="button" onClick={onLogout}>
        <LogOut size={17} /> 退出登录
      </button>
    </div>
  );
}
