import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  ChevronRight,
  MapPinned,
  Pause,
  Play,
  Route,
  ShieldCheck,
  X,
} from "lucide-react";

export default function PlanPage({ confirmedTrips = [], setActivePage, showToast, updateTripStatus }) {
  const [activeTripId, setActiveTripId] = useState("");
  const [selectedSpot, setSelectedSpot] = useState(null);

  const activeTrip = useMemo(
    () => confirmedTrips.find((trip) => trip.id === activeTripId) ?? confirmedTrips[0],
    [activeTripId, confirmedTrips],
  );

  const enterTrip = (trip) => {
    setActiveTripId(trip.id);
    setSelectedSpot(null);
    updateTripStatus?.(trip.id, "active", "陪伴中");
    showToast("已进入当前行程陪伴");
  };

  const exitTrip = (status, statusText, message) => {
    if (activeTrip) updateTripStatus?.(activeTrip.id, status, statusText);
    setActiveTripId("");
    setSelectedSpot(null);
    showToast(message);
  };

  if (!activeTripId) {
    return (
      <div className="page-stack companion-page">
        <section className="companion-hero">
          <div>
            <span className="pill soft">
              <ShieldCheck size={14} /> 安全功能持续开启
            </span>
            <h2>行程列表</h2>
            <p>规划界面确认的攻略会出现在这里。进入行程后，小旅会根据地图节点进行陪伴。</p>
          </div>
        </section>

        <section className="companion-list-card">
          {confirmedTrips.length === 0 ? (
            <div className="empty-trip-state">
              <Route size={32} />
              <strong>还没有确认的行程</strong>
              <p>先去规划页完成一个攻略，保存后会自动放到这里。</p>
              <button className="primary-button full" type="button" onClick={() => setActivePage("home")}>
                去规划
              </button>
            </div>
          ) : (
            confirmedTrips.map((trip) => (
              <article className="companion-trip-card" key={trip.id}>
                <div>
                  <span className={`trip-state trip-state-${trip.status}`}>{trip.statusText}</span>
                  <h3>{trip.title}</h3>
                  <p>{trip.date} · {trip.safety}</p>
                </div>
                <div className="trip-route-preview">
                  {trip.route.slice(0, 4).map((node) => (
                    <span key={node}>{node}</span>
                  ))}
                </div>
                <button className="primary-button full" type="button" onClick={() => enterTrip(trip)}>
                  <Play size={16} /> 进入行程
                </button>
              </article>
            ))
          )}
        </section>
      </div>
    );
  }

  if (selectedSpot) {
    return (
      <div className="page-stack companion-page">
        <div className="companion-topbar">
          <button className="flow-back" type="button" onClick={() => setSelectedSpot(null)} aria-label="返回当前行程">
            <ArrowLeft size={17} />
          </button>
          <div>
            <span className="eyebrow">附近景点详情</span>
            <h2>{selectedSpot.name}</h2>
          </div>
          <span />
        </div>
        <section className="spot-card flow-page-card">
          <div className="spot-detail large-spot-detail">
            <span className="pill">{selectedSpot.tag} · {selectedSpot.distance}</span>
            <strong>{selectedSpot.name}</strong>
            <p>{selectedSpot.intro}</p>
          </div>
          <button className="primary-button full flow-bottom-action" type="button" onClick={() => setSelectedSpot(null)}>
            回到当前行程
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack companion-page">
      <div className="companion-topbar">
        <button className="flow-back" type="button" onClick={() => setActiveTripId("")} aria-label="返回行程列表">
          <ArrowLeft size={17} />
        </button>
        <div>
          <span className="eyebrow">当前陪伴和行程</span>
          <h2>{activeTrip.title}</h2>
        </div>
        <div className="trip-exit-actions">
          <button type="button" onClick={() => exitTrip("safetyOnly", "已退出陪伴", "已退出行程陪伴，安全功能仍然打开")} aria-label="退出行程">
            <X size={15} />
          </button>
          <button type="button" onClick={() => exitTrip("paused", "已暂停", "行程已暂停，安全功能仍然打开")} aria-label="退出并暂停行程">
            <Pause size={15} />
          </button>
        </div>
      </div>

      <section className="companion-live-card">
        <div className="companion-map" aria-label="当前行程地图">
          <svg viewBox="0 0 300 150" role="presentation">
            <path d="M30 112 C76 42, 126 114, 164 58 S238 36, 270 76" />
          </svg>
          <span className="live-node hotel">住</span>
          <span className="live-node current">你</span>
          <span className="live-node next">景</span>
        </div>
        <div className="node-detail">
          <div>
            <span>当前位置 · {activeTrip.currentPlace}</span>
            <strong>下一站：{activeTrip.nextPlace}</strong>
            <p>点击路段可查看交通方式和预计时间。安全守护仍在后台运行。</p>
          </div>
          <button type="button" onClick={() => showToast("步行 16 分钟，打车约 8 分钟")}>
            <Route size={14} /> 路段
          </button>
        </div>
      </section>

      <section className="buddy-speech-card">
        <div className="buddy-cartoon" aria-hidden="true">
          <Bot size={40} />
        </div>
        <div>
          <span className="eyebrow">搭子转文字</span>
          <p>{activeTrip.buddyLine}</p>
        </div>
      </section>

      <section className="nearby-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">附近景点</span>
            <h3>点击进入景点详情</h3>
          </div>
        </div>
        <div className="nearby-list">
          {activeTrip.nearbySpots.map((spot) => (
            <button key={spot.name} type="button" onClick={() => setSelectedSpot(spot)}>
              <MapPinned size={16} />
              <div>
                <strong>{spot.name}</strong>
                <span>{spot.tag} · {spot.distance}</span>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
