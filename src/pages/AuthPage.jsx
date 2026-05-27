import { useState } from "react";
import { Bot, LockKeyhole, Mail, Phone, Sparkles, UserRound } from "lucide-react";

export default function AuthPage({ onSuccess, showToast }) {
  const [mode, setMode] = useState("login");

  return (
    <section className="auth-screen">
      <div className="auth-hero">
        <div className="auth-logo">
          <Bot size={34} />
        </div>
        <span className="eyebrow">FellowTrip</span>
        <h1>一个人旅行，也有人安静同行。</h1>
        <p>登录后会先创建你的专属 AI 搭子，用来记住偏好、安全边界和陪伴方式。</p>
      </div>

      <div className="auth-card">
        <div className="segmented">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            登录
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            注册
          </button>
        </div>

        <div className="auth-form">
          {mode === "register" && (
            <label className="field">
              <span>昵称</span>
              <div className="field-control">
                <UserRound size={17} />
                <input placeholder="例如：小彤" />
              </div>
            </label>
          )}
          <label className="field">
            <span>{mode === "login" ? "手机号 / 邮箱" : "手机号"}</span>
            <div className="field-control">
              {mode === "login" ? <Mail size={17} /> : <Phone size={17} />}
              <input placeholder={mode === "login" ? "输入账号" : "用于接收安全提醒"} />
            </div>
          </label>
          <label className="field">
            <span>密码</span>
            <div className="field-control">
              <LockKeyhole size={17} />
              <input type="password" placeholder="输入密码" />
            </div>
          </label>
        </div>

        <button className="primary-button full" onClick={() => onSuccess(mode)}>
          <Sparkles size={17} /> {mode === "login" ? "登录并继续" : "注册并创建搭子"}
        </button>
        <button className="text-button auth-help" onClick={() => showToast("原型演示：验证码登录将在下一阶段补充")}>
          使用验证码登录
        </button>
      </div>
    </section>
  );
}
