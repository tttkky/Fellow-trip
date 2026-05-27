import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bot,
  Camera,
  ChevronRight,
  Coffee,
  Info,
  MapPinned,
  Pause,
  Play,
  Route,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import BuddyAvatar from "../components/BuddyAvatar.jsx";
import { destinationIdeas, photoGuide, spotGuide } from "../data/mockData";
import huaxinRoadImage from "../assets/day2-2.jpg";
import ferryImage from "../assets/day1-3.jpg";
import oldTownImage from "../assets/day3-2.jpg";
import xiamenFallbackImage from "../assets/hero-1.jpg";
import hangzhouFallbackImage from "../assets/hero-2.jpg";
import chengduFallbackImage from "../assets/hero-3.jpg";
import botanicalGardenImage from "../assets/spots/botanical-garden.jpg";
import gulangyuImage from "../assets/spots/gulangyu.jpg";
import huandaoRoadImage from "../assets/spots/huandao-road.jpg";
import hulishanImage from "../assets/spots/hulishan.jpg";
import lingyinImage from "../assets/spots/lingyin.jpg";
import nanputuoImage from "../assets/spots/nanputuo.jpg";
import shapoweiImage from "../assets/spots/shapowei.jpg";
import westLakeImage from "../assets/spots/west-lake.jpg";
import xiamenUniversityImage from "../assets/spots/xiamen-university.jpg";
import zhongshanRoadImage from "../assets/spots/zhongshan-road.jpg";

const spotImages = {
  沙坡尾: shapoweiImage,
  环岛路: huandaoRoadImage,
  鼓浪屿: gulangyuImage,
  中山路: zhongshanRoadImage,
  八市: oldTownImage,
  南普陀: nanputuoImage,
  万石植物园: botanicalGardenImage,
  华新路: huaxinRoadImage,
  厦门大学外圈: xiamenUniversityImage,
  黄厝海滩: huandaoRoadImage,
  曾厝垵: huaxinRoadImage,
  白城沙滩: huandaoRoadImage,
  胡里山炮台: hulishanImage,
  山海健康步道: huandaoRoadImage,
  菽庄花园: gulangyuImage,
  日光岩: gulangyuImage,
  皓月园: ferryImage,
  最美转角: gulangyuImage,
  钢琴博物馆: gulangyuImage,
  轮渡码头外圈: ferryImage,
  中华城商圈: zhongshanRoadImage,
  龙井村: hangzhouFallbackImage,
  小河直街: westLakeImage,
  西湖外圈: westLakeImage,
  断桥残雪: westLakeImage,
  柳浪闻莺: westLakeImage,
  湖滨银泰: westLakeImage,
  灵隐寺: lingyinImage,
  永福寺: lingyinImage,
  满觉陇: hangzhouFallbackImage,
  拱宸桥: westLakeImage,
  法喜寺: lingyinImage,
  河坊街: zhongshanRoadImage,
  武林夜市: oldTownImage,
  大兜路: westLakeImage,
  玉林路: chengduFallbackImage,
  人民公园: chengduFallbackImage,
  宽窄巷子: chengduFallbackImage,
  东郊记忆: chengduFallbackImage,
  锦里: chengduFallbackImage,
  杜甫草堂: chengduFallbackImage,
  望平街: chengduFallbackImage,
};

const cityFallbackImages = {
  厦门: xiamenFallbackImage,
  杭州: westLakeImage,
  成都: chengduFallbackImage,
};

const allAttractionDetails = destinationIdeas.flatMap((destination) =>
  destination.attractions.map((spot) => ({ ...spot, city: destination.city })),
);

const getSpotImageUrl = (spotName, city) => spotImages[spotName] ?? cityFallbackImages[city] ?? cityFallbackImages.厦门;

export default function PlanPage({
  confirmedTrips = [],
  setActivePage,
  showToast,
  updateTripStatus,
  deleteTrip,
  buddySettings,
}) {
  const [activeTripId, setActiveTripId] = useState("");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [spokenLine, setSpokenLine] = useState("");
  const [companionInput, setCompanionInput] = useState("");
  const [quickAction, setQuickAction] = useState(null);
  const [quickStage, setQuickStage] = useState("idle");
  const [tripPendingDelete, setTripPendingDelete] = useState(null);
  const companionScrollRef = useRef(0);

  const activeTrip = useMemo(
    () => confirmedTrips.find((trip) => trip.id === activeTripId) ?? confirmedTrips[0],
    [activeTripId, confirmedTrips],
  );

  const expandedNearbySpots = useMemo(() => {
    if (!activeTrip) return [];

    const routeCity = destinationIdeas.find((destination) => destination.city === activeTrip.city);
    const mergedSpots = [...(activeTrip.nearbySpots ?? [])];
    const existingNames = new Set(mergedSpots.map((spot) => spot.name));

    routeCity?.attractions?.forEach((spot, index) => {
      if (existingNames.has(spot.name)) return;
      mergedSpots.push({
        ...spot,
        distance: index < 3 ? `${(1.6 + index * 0.7).toFixed(1)}km` : `${(2.8 + index * 0.5).toFixed(1)}km`,
      });
      existingNames.add(spot.name);
    });

    return mergedSpots.slice(0, 8);
  }, [activeTrip]);

  const buddyName = buddySettings?.name ?? "小旅";
  const buddyAppearance = buddySettings?.appearance ?? "round-bot";
  const nearbyFoodItems = activeTrip?.nearbyFoods ?? [];
  const drinkItems = nearbyFoodItems.filter((item) => /咖啡|甜品|饮品|茶|酒/.test(item));
  const mealItems = nearbyFoodItems.filter((item) => !/咖啡|甜品|饮品|茶|酒/.test(item));
  const photoSpot = expandedNearbySpots.find((spot) => photoGuide[spot.name]) ?? expandedNearbySpots[0];
  const activePhotoGuide = photoSpot ? photoGuide[photoSpot.name] : null;

  useEffect(() => {
    if (!activeTripId || !activeTrip?.buddyLine) {
      setSpokenLine("");
      return undefined;
    }

    setSpokenLine("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setSpokenLine(activeTrip.buddyLine.slice(0, index));
      if (index >= activeTrip.buddyLine.length) window.clearInterval(timer);
    }, 42);

    return () => window.clearInterval(timer);
  }, [activeTripId, activeTrip?.buddyLine]);

  useEffect(() => {
    if (quickStage !== "loading") return undefined;
    const timer = window.setTimeout(() => {
      setQuickStage("result");
      window.requestAnimationFrame(() => {
        const screen = document.querySelector(".screen");
        screen?.scrollTo({ top: 0 });
        screen?.focus({ preventScroll: true });
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [quickStage]);

  const saveCompanionScroll = () => {
    companionScrollRef.current = document.querySelector(".screen")?.scrollTop ?? 0;
  };

  const restoreCompanionScroll = () => {
    window.requestAnimationFrame(() => {
      const screen = document.querySelector(".screen");
      screen?.scrollTo({ top: companionScrollRef.current });
      screen?.focus({ preventScroll: true });
    });
  };

  const scrollInternalPageTop = () => {
    window.requestAnimationFrame(() => {
      const screen = document.querySelector(".screen");
      screen?.scrollTo({ top: 0 });
      screen?.focus({ preventScroll: true });
    });
  };

  const enterTrip = (trip) => {
    setActiveTripId(trip.id);
    setSelectedSpot(null);
    setQuickAction(null);
    setQuickStage("idle");
    updateTripStatus?.(trip.id, "active", "陪伴中");
    showToast("已进入当前行程陪伴");
  };

  const exitTrip = (status, statusText, message) => {
    if (activeTrip) updateTripStatus?.(activeTrip.id, status, statusText);
    setActiveTripId("");
    setSelectedSpot(null);
    setQuickAction(null);
    setQuickStage("idle");
    showToast(message);
  };

  const openQuickAction = (action) => {
    saveCompanionScroll();
    setQuickAction(action);
    setQuickStage("loading");
  };

  const closeQuickAction = () => {
    setQuickAction(null);
    setQuickStage("idle");
    restoreCompanionScroll();
  };

  const openSpotDetail = (spot) => {
    saveCompanionScroll();
    setSelectedSpot(spot);
    scrollInternalPageTop();
  };

  const closeSpotDetail = () => {
    setSelectedSpot(null);
    restoreCompanionScroll();
  };

  const requestDeleteTrip = (trip) => {
    setTripPendingDelete(trip);
  };

  const cancelDeleteTrip = () => {
    setTripPendingDelete(null);
  };

  const confirmDeleteTrip = () => {
    if (!tripPendingDelete) return;
    deleteTrip?.(tripPendingDelete.id);
    setTripPendingDelete(null);
  };

  const submitCompanionInput = (event) => {
    event.preventDefault();
    const nextMessage = companionInput.trim();
    if (!nextMessage) return;
    setCompanionInput("");
    setSpokenLine(`${buddyName} 收到：${nextMessage}`);
    showToast("已发送给搭子");
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
                <div className="trip-card-actions">
                  <button className="primary-button full companion-start-button" type="button" onClick={() => enterTrip(trip)}>
                    <Play size={16} /> 开始陪伴
                  </button>
                  <button className="trip-delete-button" type="button" onClick={() => requestDeleteTrip(trip)}>
                    <Trash2 size={15} /> 删除行程
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        {tripPendingDelete && (
          <div className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-trip-title">
            <div className="confirm-dialog">
              <strong id="delete-trip-title">确定删除这个行程吗？</strong>
              <p>删除后，这个陪伴行程会从列表中移除。</p>
              <div className="confirm-dialog-actions">
                <button type="button" className="secondary-button" onClick={cancelDeleteTrip}>
                  取消
                </button>
                <button type="button" className="danger-button" onClick={confirmDeleteTrip}>
                  确定删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (selectedSpot) {
    const attractionDetail = allAttractionDetails.find((spot) => spot.name === selectedSpot.name);
    const detailedSpot = {
      ...selectedSpot,
      ...attractionDetail,
      distance: selectedSpot.distance,
      tag: attractionDetail?.tag ?? selectedSpot.tag ?? "景点",
      intro: attractionDetail?.intro ?? selectedSpot.intro ?? "适合放进当天路线，实际停留时间可以按体力调整。",
      stay: attractionDetail?.stay ?? "60-90 分钟",
      bestTime: attractionDetail?.bestTime ?? "上午或傍晚",
      solo: attractionDetail?.solo ?? "路线清楚，补给方便",
      backup: attractionDetail?.backup ?? "天气不好可换室内/商圈",
      detail: attractionDetail?.detail ?? selectedSpot.details ?? selectedSpot.intro,
      city: attractionDetail?.city ?? activeTrip.city,
    };

    return (
      <div className="page-stack companion-page">
        <div className="companion-topbar">
          <button className="flow-back" type="button" onClick={closeSpotDetail} aria-label="返回当前行程">
            <ArrowLeft size={17} />
          </button>
          <div>
            <span className="eyebrow">附近景点详情</span>
            <h2>{selectedSpot.name}</h2>
          </div>
          <span />
        </div>
        <section className="spot-card flow-page-card">
          <div
            className="spot-detail-hero"
            style={{ backgroundImage: `url("${getSpotImageUrl(detailedSpot.name, detailedSpot.city)}")` }}
            aria-label={`${detailedSpot.name} 图片`}
          >
            <span className="pill dark">{detailedSpot.tag} · {detailedSpot.distance}</span>
            <div>
              <strong>{detailedSpot.name}</strong>
              <p>{detailedSpot.intro}</p>
            </div>
          </div>
          <div className="spot-detail-grid">
            <div>
              <span>建议停留</span>
              <strong>{detailedSpot.stay}</strong>
            </div>
            <div>
              <span>适合时段</span>
              <strong>{detailedSpot.bestTime}</strong>
            </div>
            <div>
              <span>独行友好</span>
              <strong>{detailedSpot.solo}</strong>
            </div>
            <div>
              <span>替换方向</span>
              <strong>{detailedSpot.backup}</strong>
            </div>
          </div>
          <div className="spot-detail-note">
            <Info size={16} />
            <p>{detailedSpot.detail}</p>
          </div>

          {spotGuide[selectedSpot.name] && (
            <section className="guide-card glassmorphism">
              <div className="guide-header">
                <Bot size={18} />
                <h3>AI导游讲解</h3>
              </div>
              <p className="guide-content">{spotGuide[selectedSpot.name].aiIntro}</p>
              <div className="guide-section">
                <h4>景点背景</h4>
                <p>{spotGuide[selectedSpot.name].background}</p>
              </div>
              {spotGuide[selectedSpot.name].history && (
                <div className="guide-section">
                  <h4>历史人文</h4>
                  <p>{spotGuide[selectedSpot.name].history}</p>
                </div>
              )}
            </section>
          )}

          {photoGuide[selectedSpot.name] && (
            <section className="guide-card glassmorphism">
              <div className="guide-header">
                <Camera size={18} />
                <h3>拍照指导</h3>
              </div>
              <div className="guide-grid">
                <div className="guide-item">
                  <h4>最佳时间</h4>
                  <p>{photoGuide[selectedSpot.name].bestTime}</p>
                </div>
                <div className="guide-item">
                  <h4>构图建议</h4>
                  <p>{photoGuide[selectedSpot.name].composition}</p>
                </div>
                <div className="guide-item">
                  <h4>光线建议</h4>
                  <p>{photoGuide[selectedSpot.name].lighting}</p>
                </div>
                <div className="guide-item">
                  <h4>拍摄角度</h4>
                  <p>{photoGuide[selectedSpot.name].angles}</p>
                </div>
              </div>
            </section>
          )}

          <button className="primary-button full flow-bottom-action" type="button" onClick={closeSpotDetail}>
            回到当前行程
          </button>
        </section>
      </div>
    );
  }

  if (quickStage === "result" && quickAction) {
    const pageTitle =
      quickAction === "meal" ? "附近饭店" : quickAction === "drink" ? "饮品休息" : "拍照接管";

    return (
      <div className="page-stack companion-page companion-mode quick-action-page">
        <div className="companion-bg" aria-hidden="true" />
        <div className="companion-live-topbar">
          <button className="flow-back" type="button" onClick={closeQuickAction} aria-label="返回陪伴页">
            <ArrowLeft size={17} />
          </button>
          <div>
            <span className="eyebrow">快捷需求</span>
            <h2>{pageTitle}</h2>
          </div>
          <span />
        </div>

        {quickAction === "meal" && (
          <section className="quick-result-card">
            <div className="section-title">
              <div>
                <span className="eyebrow">附近饭店</span>
                <h3>适合现在一个人吃的店</h3>
              </div>
            </div>
            <div className="quick-result-list">
              {(mealItems.length ? mealItems : ["一人食海鲜饭", "主街简餐店", "低负担轻食"]).map((item, index) => (
                <article key={item}>
                  <strong>{item}</strong>
                  <span>{index === 0 ? "步行 6-9 分钟 · 有单人位" : "主街附近 · 返程方便"}</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {quickAction === "drink" && (
          <section className="quick-result-card">
            <div className="section-title">
              <div>
                <span className="eyebrow">饮品休息</span>
                <h3>可以坐下缓一缓的地方</h3>
              </div>
            </div>
            <div className="quick-result-list">
              {(drinkItems.length ? drinkItems : ["街角咖啡馆", "安静甜品店", "茶饮补给点"]).map((item, index) => (
                <article key={item}>
                  <strong>{item}</strong>
                  <span>{index === 0 ? "靠窗座位 · 适合整理照片" : "人流稳定 · 适合短暂停留"}</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {quickAction === "photo" && (
          <section className="photo-assist-card">
            <div className="section-title">
              <div>
                <span className="eyebrow">拍照接管</span>
                <h3>{photoSpot?.name ?? "当前位置"} 机位指导</h3>
              </div>
              <Camera size={18} />
            </div>
            <div className="camera-preview" aria-label="相机预览">
              <div className="camera-grid" aria-hidden="true" />
              <span className="camera-stand-point">站这里</span>
              <span className="camera-phone-point">手机放这</span>
            </div>
            <div className="photo-step-list">
              <p>{activePhotoGuide?.composition ?? "把主街或建筑边缘放在画面三分之一处，人物站在亮面一侧。"}</p>
              <p>{activePhotoGuide?.lighting ?? "现在光线偏柔，侧光会更显轮廓，避免背后强反光。"}</p>
              <p>你准备好了告诉我，我就按快门啦。</p>
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="page-stack companion-page companion-mode">
      <div className="companion-bg" aria-hidden="true" />
      <div className="companion-live-topbar">
        <button className="flow-back" type="button" onClick={() => setActiveTripId("")} aria-label="返回行程列表">
          <ArrowLeft size={17} />
        </button>
        <div>
          <span className="eyebrow">当前陪伴</span>
          <h2>{activeTrip.title}</h2>
        </div>
        <button className="icon-button" type="button" onClick={() => setActivePage("buddySettings")} aria-label="搭子设置">
          <Settings size={17} />
        </button>
      </div>

      <section className="companion-buddy-stage" aria-live="polite">
        <BuddyAvatar type={buddyAppearance} className="companion-center-buddy" title={`${buddyName} avatar`} />
        <div className="companion-speech-bubble">
          <p>{spokenLine || activeTrip.buddyLine}</p>
        </div>
        <form className="companion-text-input" onSubmit={submitCompanionInput}>
          <input
            value={companionInput}
            onChange={(event) => setCompanionInput(event.target.value)}
            placeholder={`输入想对${buddyName}说的话`}
            aria-label="输入给搭子的话"
          />
          <button type="submit" aria-label="发送给搭子">
            <Send size={15} />
          </button>
        </form>
        <div className="trip-exit-actions companion-live-actions">
          <button type="button" className="icon-button" onClick={() => exitTrip("safetyOnly", "已退出陪伴", "已退出行程陪伴，安全功能仍然打开")} aria-label="退出行程">
            <X size={15} />
          </button>
          <button type="button" className="icon-button" onClick={() => exitTrip("paused", "已暂停", "行程已暂停，安全功能仍然打开")} aria-label="退出并暂停行程">
            <Pause size={15} />
          </button>
          <button type="button" className="primary-button end-companion" onClick={() => exitTrip("completed", "已结束", "已结束陪伴，旅程已记录")} aria-label="结束陪伴">
            结束
          </button>
        </div>
      </section>

      <section className="companion-map-card">
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
            <p>主路步行约 16 分钟，打车约 8 分钟。安全守护仍在后台运行。</p>
          </div>
          <button type="button" onClick={() => showToast("步行 16 分钟，打车约 8 分钟")}>
            <Route size={14} /> 路段
          </button>
        </div>
      </section>

      <section className="companion-quick-actions" aria-label="快捷需求">
        <button type="button" onClick={() => openQuickAction("meal")}>
          <Utensils size={16} />
          <span>想吃饭</span>
        </button>
        <button type="button" onClick={() => openQuickAction("drink")}>
          <Coffee size={16} />
          <span>想喝点东西</span>
        </button>
        <button type="button" onClick={() => openQuickAction("photo")}>
          <Camera size={16} />
          <span>想拍照</span>
        </button>
      </section>

      {quickStage === "result" && quickAction === "meal" && (
        <section className="quick-result-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">附近饭店</span>
              <h3>适合现在一个人吃的店</h3>
            </div>
          </div>
          <div className="quick-result-list">
            {(mealItems.length ? mealItems : ["一人食海鲜饭", "主街简餐店", "低负担轻食"]).map((item, index) => (
              <article key={item}>
                <strong>{item}</strong>
                <span>{index === 0 ? "步行 6-9 分钟 · 有单人位" : "主街附近 · 返程方便"}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {quickStage === "result" && quickAction === "drink" && (
        <section className="quick-result-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">饮品休息</span>
              <h3>可以坐下缓一缓的地方</h3>
            </div>
          </div>
          <div className="quick-result-list">
            {(drinkItems.length ? drinkItems : ["街角咖啡馆", "安静甜品店", "茶饮补给点"]).map((item, index) => (
              <article key={item}>
                <strong>{item}</strong>
                <span>{index === 0 ? "靠窗座位 · 适合整理照片" : "人流稳定 · 适合短暂停留"}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {quickStage === "result" && quickAction === "photo" && (
        <section className="photo-assist-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">拍照接管</span>
              <h3>{photoSpot?.name ?? "当前位置"} 机位指导</h3>
            </div>
            <Camera size={18} />
          </div>
          <div className="camera-preview" aria-label="相机预览">
            <div className="camera-grid" aria-hidden="true" />
            <span className="camera-stand-point">站这里</span>
            <span className="camera-phone-point">手机放这</span>
          </div>
          <div className="photo-step-list">
            <p>{activePhotoGuide?.composition ?? "把主街或建筑边缘放在画面三分之一处，人物站在亮面一侧。"}</p>
            <p>{activePhotoGuide?.lighting ?? "现在光线偏柔，侧光会更显轮廓，避免背后强反光。"}</p>
            <p>你准备好了告诉我，我就按快门啦。</p>
          </div>
        </section>
      )}

      <section className="live-tips-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">实时提醒</span>
            <h3>天气和节奏</h3>
          </div>
        </div>
        <div className="live-tips-list">
          {activeTrip.liveTips?.map((tip) => (
            <div className="live-tip-item" key={tip}>
              <Info size={16} />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="food-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">附近推荐</span>
            <h3>补给和休息点</h3>
          </div>
        </div>
        <div className="food-list">
          {nearbyFoodItems.map((food) => (
            <div className="food-item" key={food}>
              <Coffee size={15} /> {food}
            </div>
          ))}
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
          {expandedNearbySpots.map((spot) => (
            <button key={spot.name} type="button" onClick={() => openSpotDetail(spot)}>
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

      {quickStage === "loading" && (
        <div className="quick-action-modal" role="status" aria-live="polite">
          <div>
            <Search size={20} />
            <strong>{quickAction === "photo" ? "正在启动拍照指导" : "正在搜索附近推荐"}</strong>
            <span>{buddyName} 正在看你附近的位置和路线</span>
          </div>
        </div>
      )}
    </div>
  );
}
