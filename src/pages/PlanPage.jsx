import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  Camera,
  ChevronRight,
  Info,
  MapPinned,
  Pause,
  Play,
  Route,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { destinationIdeas, spotGuide, photoGuide } from "../data/mockData";
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

export default function PlanPage({ confirmedTrips = [], setActivePage, showToast, updateTripStatus, deleteTrip }) {
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
                <div className="trip-card-actions">
                  <button className="primary-button full companion-start-button" type="button" onClick={() => enterTrip(trip)}>
                    <Play size={16} /> 开始陪伴
                  </button>
                  <button className="trip-delete-button" type="button" onClick={() => deleteTrip?.(trip.id)}>
                    <Trash2 size={15} /> 删除行程
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
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

          <button className="primary-button full flow-bottom-action" type="button" onClick={() => setSelectedSpot(null)}>
            回到当前行程
          </button>
        </section>
      </div>
    );
  }

    return (
      <div className="page-stack companion-page companion-mode">
        <div className="companion-bg" aria-hidden="true" />
        <div className="companion-topbar glassmorphism">
          <button className="flow-back" type="button" onClick={() => setActiveTripId("")} aria-label="返回行程列表">
            <ArrowLeft size={17} />
          </button>
          <div>
            <span className="eyebrow">当前陪伴和行程</span>
            <h2>{activeTrip.title}</h2>
            <span className="companion-status">
              <span className="live-dot" aria-hidden="true" />
              <Bot size={14} /> 陪伴中
            </span>
          </div>
          <div className="trip-exit-actions">
            <button type="button" className="icon-button" onClick={() => exitTrip("safetyOnly", "已退出陪伴", "已退出行程陪伴，安全功能仍然打开")} aria-label="退出行程">
              <X size={15} />
            </button>
            <button type="button" className="icon-button" onClick={() => exitTrip("paused", "已暂停", "行程已暂停，安全功能仍然打开")} aria-label="退出并暂停行程">
              <Pause size={15} />
            </button>
            <button type="button" className="primary-button end-companion" onClick={() => exitTrip("completed", "已结束", "已结束陪伴，旅程已记录")} aria-label="结束陪伴">
              结束陪伴
            </button>
          </div>
        </div>

        <section className="companion-live-card glassmorphism">
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
        
        <section className="buddy-speech-card glassmorphism" aria-live="polite">
  <div className="buddy-cartoon" aria-hidden="true">
    <Bot size={40} />
  </div>

  <div className="voice-wave" aria-hidden="true">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>

  <div>
    <span className="eyebrow">搭子转文字</span>
    <p>{activeTrip.buddyLine}</p>
  </div>
</section>

<section className="live-tips-card glassmorphism">
  <div className="section-title">
    <div>
      <span className="eyebrow">实时陪伴</span>
      <h3>小旅正在陪伴你</h3>
    </div>
  </div>

  <div className="live-tips-list">
    {activeTrip.liveTips?.map((tip) => (
      <div className="live-tip-item" key={tip}>
        <Bot size={16} />
        <span>{tip}</span>
      </div>
    ))}
  </div>
</section>

<section className="emotion-card glassmorphism">
  <div className="section-title">
    <div>
      <span className="eyebrow">情绪陪伴</span>
      <h3>小旅想对你说</h3>
    </div>
  </div>

  <div className="emotion-list">
    {activeTrip.emotionCare?.map((item) => (
      <div className="emotion-item" key={item}>
        💛 {item}
      </div>
    ))}
  </div>
</section>

<section className="food-card glassmorphism">
  <div className="section-title">
    <div>
      <span className="eyebrow">附近推荐</span>
      <h3>适合独自旅行的地点</h3>
    </div>
  </div>

  <div className="food-list">
    {activeTrip.nearbyFoods?.map((food) => (
      <div className="food-item" key={food}>
        🍜 {food}
      </div>
    ))}
  </div>
</section>

<section className="nearby-card glassmorphism">
  <div className="section-title"></div>
          <div className="buddy-cartoon" aria-hidden="true">
            <Bot size={40} />
          </div>
          <div className="voice-wave" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>
            <span className="eyebrow">搭子转文字</span>
            <p>{activeTrip.buddyLine}</p>
          </div>
        </section>

        <section className="nearby-card glassmorphism">
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
