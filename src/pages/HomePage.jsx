import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  History,
  Hotel,
  MapPinned,
  Mic,
  Plus,
  Route,
  Send,
  Utensils,
  Wand2,
  X,
} from "lucide-react";
import {
  bookingOptions,
  destinationIdeas,
  finalItineraryDays,
  itineraryMapNodes,
  planningModes,
  preTripStatus,
  trafficSegments,
} from "../data/mockData.js";

const flowTitles = {
  chat: "和小旅聊方向",
  spots: "主要景点",
  spotDetail: "景点介绍",
  strategy: "细节攻略制定",
  map: "交互地图攻略",
  booking: "酒店饭店评价",
  bookingDetail: "详情预定",
  final: "最终行程",
};

const nodeIcons = {
  hotel: Hotel,
  food: Utensils,
  spot: MapPinned,
};

function BuddyChatAvatar({ appearance = "round-bot" }) {
  return (
    <span className={`chat-buddy-avatar buddy-avatar-${appearance}`} aria-hidden="true">
      <span className="chat-avatar-head" />
      <span className="chat-avatar-eyes" />
      <span className="chat-avatar-body" />
    </span>
  );
}

export default function HomePage({ setActivePage, showToast, onConfirmTrip, buddySettings }) {
  const [flow, setFlow] = useState("chat");
  const [selectedCity, setSelectedCity] = useState(destinationIdeas[0].city);
  const [selectedAttraction, setSelectedAttraction] = useState(destinationIdeas[0].attractions[0]);
  const [planMode, setPlanMode] = useState("");
  const [selectedNode, setSelectedNode] = useState(itineraryMapNodes[1]);
  const [selectedBooking, setSelectedBooking] = useState(bookingOptions[0]);
  const [reservedItem, setReservedItem] = useState("");

  const cityOptions = destinationIdeas.slice(0, 2);
  const buddyName = buddySettings?.name ?? "小旅";

  const selectedDestination = useMemo(
    () => destinationIdeas.find((item) => item.city === selectedCity) ?? destinationIdeas[0],
    [selectedCity],
  );

  const openCitySpots = (city) => {
    const destination = destinationIdeas.find((item) => item.city === city) ?? destinationIdeas[0];
    setSelectedCity(destination.city);
    setSelectedAttraction(destination.attractions[0]);
    setFlow("spots");
  };

  const openStrategy = (city) => {
    const destination = destinationIdeas.find((item) => item.city === city) ?? destinationIdeas[0];
    setSelectedCity(destination.city);
    setSelectedAttraction(destination.attractions[0]);
    setPlanMode("");
    setFlow("strategy");
  };

  const openBookingFromNode = (node) => {
    setSelectedNode(node);
    if (node.type !== "hotel" && node.type !== "food") {
      showToast("已选中景点节点，可在下方查看设施和替换建议");
      return;
    }
    const booking = bookingOptions.find((item) => item.type === (node.type === "hotel" ? "酒店" : "饭店")) ?? bookingOptions[0];
    setSelectedBooking(booking);
    setFlow("booking");
  };

  const goBack = () => {
    const backMap = {
      spots: "chat",
      spotDetail: "spots",
      strategy: "chat",
      map: "strategy",
      booking: "map",
      bookingDetail: "booking",
      final: "map",
    };
    setFlow(backMap[flow] ?? "chat");
  };

  const PageHeader = () => (
    <div className="flow-header">
      {flow !== "chat" ? (
        <button className="flow-back" type="button" onClick={goBack} aria-label="返回上一页">
          <ArrowLeft size={17} />
        </button>
      ) : (
        <span className="flow-back-placeholder" />
      )}
      <div>
        <span className="eyebrow">旅途前 · {selectedDestination.city}</span>
        <h2>{flowTitles[flow]}</h2>
      </div>
      <button className="flow-history" type="button" onClick={() => setActivePage("memory")} aria-label="历史行程">
        <History size={17} />
      </button>
    </div>
  );

  if (flow === "chat") {
    return (
      <div className="page-stack pretrip-page">
        <section className="planning-thread">
          <div className="ai-bubble intro-bubble">
            <BuddyChatAvatar appearance={buddySettings?.appearance} />
            <div>
              <span className="pill soft">
                <CalendarDays size={14} /> {preTripStatus.label} · 自动识别
              </span>
              <strong>{preTripStatus.title}</strong>
              <p>我是{buddyName}，你可以像聊天一样告诉我时间、预算、心情、想避开的事。我会把目的地、景点、地图、酒店饭店这些工具嵌进对话里。</p>
            </div>
          </div>

          <div className="mock-dialogue">
            <div className="user-bubble">我想找一个不用太赶、晚上也安心的城市。</div>
            <div className="ai-bubble">
              <BuddyChatAvatar appearance={buddySettings?.appearance} />
              <span>收到。我先按“独自旅行安全、节奏慢、适合散步和拍照”筛两个方向。你可以点城市看主要景点，也可以直接点“就它了”。</span>
            </div>
            <div className="user-bubble">三天两夜，预算别太高，最好吃饭也方便。</div>
          </div>

          <div className="ai-tool-bubble">
            <div className="ai-tool-header">
              <BuddyChatAvatar appearance={buddySettings?.appearance} />
              <div>
                <span className="eyebrow">{buddyName}生成了 2 个城市选择</span>
                <strong>目的地推荐</strong>
              </div>
            </div>
            <div className="destination-card-list">
              {cityOptions.map((item) => (
                <article className="destination-card" key={item.city}>
                  <button className="destination-card-main" type="button" onClick={() => openCitySpots(item.city)}>
                    <div>
                      <strong>{item.city}</strong>
                      <span>{item.fit}</span>
                    </div>
                    <small>{item.reason}</small>
                    <div className="tag-row">
                      {item.highlights.map((highlight) => (
                        <span className="tag" key={highlight}>
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </button>
                  <button className="primary-button full" type="button" onClick={() => openStrategy(item.city)}>
                    就它了
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="chat-compose-bar" aria-label="AI 聊天输入框">
          <button type="button" aria-label="打开工具" onClick={() => showToast("可以在这里接入日期、预算、地图等工具")}>
            <Plus size={18} />
          </button>
          <div className="chat-compose-input">问{buddyName}任何旅行想法...</div>
          <button type="button" aria-label="语音输入" onClick={() => showToast("语音输入将在接入能力后可用")}>
            <Mic size={18} />
          </button>
          <button className="chat-compose-send" type="button" aria-label="发送" onClick={() => showToast("当前为 mock 输入框，暂未连接 AI API")}>
            <Send size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (flow === "spots") {
    return (
      <div className="page-stack pretrip-page">
        <PageHeader />
        <section className="spot-card flow-page-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">{selectedDestination.city}</span>
              <h3>主要景点卡片</h3>
            </div>
          </div>
          <div className="spot-grid">
            {selectedDestination.attractions.map((spot) => (
              <button
                className="spot-choice"
                key={spot.name}
                type="button"
                onClick={() => {
                  setSelectedAttraction(spot);
                  setFlow("spotDetail");
                }}
              >
                <span>{spot.tag}</span>
                <strong>{spot.name}</strong>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
          <button className="primary-button full flow-bottom-action" type="button" onClick={() => openStrategy(selectedDestination.city)}>
            就这个城市，继续制定攻略
          </button>
        </section>
      </div>
    );
  }

  if (flow === "spotDetail") {
    return (
      <div className="page-stack pretrip-page">
        <PageHeader />
        <section className="spot-card flow-page-card">
          <div className="spot-detail large-spot-detail">
            <span className="pill">{selectedAttraction.tag}</span>
            <strong>{selectedAttraction.name}</strong>
            <p>{selectedAttraction.intro}</p>
          </div>
          <button className="primary-button full flow-bottom-action" type="button" onClick={() => openStrategy(selectedDestination.city)}>
            喜欢这个方向，进入细节攻略制定
          </button>
        </section>
      </div>
    );
  }

  if (flow === "strategy") {
    return (
      <div className="page-stack pretrip-page">
        <PageHeader />
        <section className="strategy-card flow-page-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">{selectedDestination.city} · 攻略模式</span>
              <h3>先选择生成颗粒度</h3>
            </div>
          </div>
          <div className="mode-choice-list">
            {planningModes.map((item) => (
              <button
                className={item.id === planMode ? "mode-choice active" : "mode-choice"}
                key={item.id}
                type="button"
                onClick={() => setPlanMode(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </button>
            ))}
          </div>
          <div className="preference-box">
            <span>也可以先补充偏好</span>
            <p>少排队、晚餐一人友好、晚上尽量沿主路回酒店。</p>
          </div>
          <button
            className="primary-button full"
            type="button"
            disabled={!planMode}
            onClick={() => {
              if (!planMode) return;
              showToast("攻略已生成，进入地图调整");
              setFlow("map");
            }}
          >
            <Wand2 size={17} /> 生成攻略并进入地图
          </button>
        </section>
      </div>
    );
  }

  if (flow === "map") {
    return (
      <div className="page-stack pretrip-page">
        <PageHeader />
        <section className="interactive-map-card flow-page-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">{selectedDestination.days}</span>
              <h3>点击节点或路段调整</h3>
            </div>
            <span className="time-chip">3天2夜</span>
          </div>
          <div className="planner-map" aria-label="交互式地图原型">
            <svg viewBox="0 0 300 150" role="presentation">
              <path className="route-day-one" d="M28 112 C70 54, 112 116, 154 62 S238 42, 268 72" />
              <path className="route-day-two" d="M42 36 C94 24, 112 82, 170 98 S238 122, 282 40" />
            </svg>
            {itineraryMapNodes.map((node, index) => {
              const Icon = nodeIcons[node.type] ?? MapPinned;
              return (
                <button
                  className={selectedNode.name === node.name ? "planner-node active" : "planner-node"}
                  key={node.name}
                  style={{ left: `${14 + index * 18}%`, top: `${index % 2 === 0 ? 22 : 58}%` }}
                  type="button"
                  onClick={() => openBookingFromNode(node)}
                  aria-label={node.name}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
          <div className="node-detail">
            <div>
              <span>{selectedNode.day} · {selectedNode.time}</span>
              <strong>{selectedNode.name}</strong>
              <p>{selectedNode.meta}</p>
            </div>
            <button type="button" onClick={() => showToast("小旅已自动替换并重排路线")}>
              <X size={14} /> 不想去
            </button>
          </div>
          <div className="traffic-list">
            {trafficSegments.map((segment) => (
              <button key={`${segment.from}-${segment.to}`} type="button" onClick={() => showToast(segment.note)}>
                <Route size={15} />
                <span>{segment.from} → {segment.to}</span>
                <strong>{segment.method}</strong>
              </button>
            ))}
          </div>
          <div className="floating-ai-window">
            <Bot size={17} />
            <span>点击酒店或饭店节点会跳转到评价、均价和套餐页。</span>
          </div>
          <button className="primary-button full flow-bottom-action" type="button" onClick={() => setFlow("final")}>
            确定攻略，查看最终行程
          </button>
        </section>
      </div>
    );
  }

  if (flow === "booking") {
    return (
      <div className="page-stack pretrip-page">
        <PageHeader />
        <section className="booking-card flow-page-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">来自地图节点</span>
              <h3>评价、均价、套餐</h3>
            </div>
          </div>
          <div className="booking-list">
            {bookingOptions.map((item) => (
              <button
                className={selectedBooking.name === item.name ? "booking-option active" : "booking-option"}
                key={item.name}
                type="button"
                onClick={() => setSelectedBooking(item)}
              >
                <span>{item.type}</span>
                <strong>{item.name}</strong>
                <small>评分 {item.rating} · 人均/均价 {item.price} · {item.package}</small>
              </button>
            ))}
          </div>
          <button className="primary-button full flow-bottom-action" type="button" onClick={() => setFlow("bookingDetail")}>
            查看详情并预定
          </button>
        </section>
      </div>
    );
  }

  if (flow === "bookingDetail") {
    return (
      <div className="page-stack pretrip-page">
        <PageHeader />
        <section className="booking-card flow-page-card">
          <div className="booking-detail booking-detail-page">
            <span className="pill">{selectedBooking.type}</span>
            <strong>{selectedBooking.name}</strong>
            <p>评分 {selectedBooking.rating} · 人均/均价 {selectedBooking.price}</p>
            <p>{selectedBooking.package}</p>
            <p>{selectedBooking.detail}</p>
          </div>
          <button
            className="primary-button full flow-bottom-action"
            type="button"
            onClick={() => {
              setReservedItem(selectedBooking.name);
              showToast("预定成功，已同步到攻略");
            }}
          >
            一键预定
          </button>
          {reservedItem === selectedBooking.name && (
            <div className="reserved-state">
              <CheckCircle2 size={18} />
              <span>已预定，返回地图后可以继续确认攻略。</span>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack pretrip-page">
      <PageHeader />
      <section className="final-route-card flow-page-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">{selectedDestination.city} · 整体行程</span>
            <h3>不同颜色代表不同天</h3>
          </div>
        </div>
        <div className="planner-map final-map" aria-label="最终行程地图">
          <svg viewBox="0 0 300 150" role="presentation">
            <path className="route-day-one" d="M28 112 C70 54, 112 116, 154 62 S238 42, 268 72" />
            <path className="route-day-two" d="M42 36 C94 24, 112 82, 170 98 S238 122, 282 40" />
          </svg>
          <span className="planner-node active" style={{ left: "16%", top: "58%" }}>1</span>
          <span className="planner-node" style={{ left: "48%", top: "32%" }}>2</span>
          <span className="planner-node" style={{ left: "76%", top: "62%" }}>3</span>
        </div>
        <div className="final-route-map">
          {finalItineraryDays.map((day) => (
            <div className="final-day" key={day.day}>
              <span style={{ background: day.color }} />
              <div>
                <strong>{day.day}</strong>
                <p>{day.route}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="primary-button full" type="button" onClick={() => onConfirmTrip?.(selectedDestination)}>
          保存最终攻略并加入陪伴列表
        </button>
      </section>
    </div>
  );
}
