import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Clock3,
  MapPinned,
  MicOff,
  PhoneOff,
  Siren,
  Volume2,
  X,
} from "lucide-react";
import { safetyCompanionCall, safetyMedia } from "../data/mockData.js";

export default function SafetyPage({ showToast }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [sosHolding, setSosHolding] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const sosTimerRef = useRef(null);

  const stopSosHold = () => {
    window.clearTimeout(sosTimerRef.current);
    sosTimerRef.current = null;
    setSosHolding(false);
  };

  useEffect(() => () => window.clearTimeout(sosTimerRef.current), []);

  const startSosHold = () => {
    if (sosSent) return;
    setSosHolding(true);
    sosTimerRef.current = window.setTimeout(() => {
      setSosHolding(false);
      setSosSent(true);
      showToast("报警求助已发送：正在拨打 110，并发送当前位置和当前时间");
    }, 3000);
  };

  return (
    <div className="page-stack safety-page">
      <section className="safety-call-card">
        <div className="safety-call-header">
          <div className="safety-buddy-avatar" aria-hidden="true">
            <Bot size={31} />
          </div>
          <div>
            <span className="safety-live-status">
              <i /> {safetyCompanionCall.status}
            </span>
            <h2>{safetyCompanionCall.assistant}</h2>
          </div>
        </div>

        <div className="safety-call-timing">
          <div>
            <Clock3 size={17} />
            <small>陪伴通话</small>
            <span>{safetyCompanionCall.duration}</span>
          </div>
        </div>

        <div className="safety-live-caption" aria-label="实时语音字幕">
          <span>实时字幕</span>
          <p>
            <strong>小旅：</strong>
            {safetyCompanionCall.liveCaption}
          </p>
        </div>

        <div className="safety-call-controls" aria-label="陪伴通话操作">
          <button
            className={muted ? "active" : ""}
            type="button"
            onClick={() => {
              setMuted((value) => !value);
              showToast(muted ? "麦克风已开启" : "已静音");
            }}
          >
            <MicOff size={19} />
            <span>静音</span>
          </button>
          <button
            className={speakerOn ? "active" : ""}
            type="button"
            onClick={() => {
              setSpeakerOn((value) => !value);
              showToast(speakerOn ? "免提已关闭" : "免提已开启");
            }}
          >
            <Volume2 size={19} />
            <span>免提</span>
          </button>
          <button
            className="end-call"
            type="button"
            onClick={() => showToast("陪伴通话已结束，需要时小旅随时回来")}
          >
            <PhoneOff size={19} />
            <span>结束</span>
          </button>
        </div>
      </section>

      <section className="safety-navigation-card" aria-label="导航窗口">
        <div className="safety-navigation-header">
          <h3>导航窗口</h3>
          <span>{safetyCompanionCall.navigationStatus}</span>
        </div>
        <div className="safety-navigation-preview">
          <img src={safetyMedia.navigationImage} alt="实时导航画面" />
          <div className="safety-navigation-companion-tip">
            <strong>小旅：</strong>
            <span>{safetyCompanionCall.walkingCue}</span>
          </div>
        </div>
      </section>

      <section className="safety-assistance-card">
        <button className="safety-share-status" type="button" onClick={() => setShareOpen(true)}>
          <span>
            <MapPinned size={16} />
            位置共享：未开启
          </span>
          <small>邀请微信好友</small>
        </button>
        <div className="safety-emergency-copy">
          <strong>报警求助</strong>
          <p>紧急情况下将拨打 110，并发送当前位置和当前时间。</p>
        </div>
        <button
          className={`sos-hold-button${sosHolding ? " holding" : ""}${sosSent ? " sent" : ""}`}
          type="button"
          onPointerDown={startSosHold}
          onPointerUp={stopSosHold}
          onPointerLeave={stopSosHold}
          onPointerCancel={stopSosHold}
          onContextMenu={(event) => event.preventDefault()}
        >
          <Siren size={20} />
          {sosSent ? "报警求助已发送" : "长按 3 秒报警求助"}
        </button>
      </section>

      {shareOpen && (
        <div className="safety-share-backdrop">
          <section className="safety-tool-sheet" role="dialog" aria-modal="true" aria-label="微信好友列表">
          <div className="safety-sheet-header">
            <div>
              <span className="wechat-tag">微信</span>
              <h3>选择要共享位置的微信好友</h3>
            </div>
            <button type="button" onClick={() => setShareOpen(false)} aria-label="关闭">
              <X size={17} />
            </button>
          </div>
          <div className="wechat-preview">
            <img src={safetyMedia.wechatContactsImage} alt="微信好友列表" />
          </div>
          </section>
        </div>
      )}
    </div>
  );
}
