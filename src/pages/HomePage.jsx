import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bike,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Compass,
  History,
  Hotel,
  Info,
  MapPinned,
  Mic,
  Plus,
  Route,
  Send,
  Shell,
  Utensils,
  Wand2,
  X,
} from "lucide-react";
import {
  bookingOptions,
  cityPlanningOverrides,
  detailedRoutePathByDay,
  destinationIdeas,
  itineraryMapNodes,
  mapOptionCatalog,
  mapOptionDetails,
  planningDays,
  planningModes,
  preTripStatus,
  simpleMapRegions,
  simpleRoutePathByDay,
  trafficDetailDays,
  trafficSegments,
} from "../data/mockData.js";
import BuddyAvatar from "../components/BuddyAvatar.jsx";
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

const screenScroller = () => document.querySelector(".screen");

const flowTitles = {
  chat: "和小旅聊方向",
  spots: "主要景点",
  spotDetail: "景点介绍",
  strategy: "细节攻略制定",
  map: "交互地图攻略",
  booking: "酒店饭店评价",
  bookingDetail: "详情预定",
  transportDetail: "交通详情",
  optionList: "全部选择",
  final: "最终行程",
};

const nodeIcons = {
  bike: Bike,
  food: Utensils,
  hotel: Hotel,
  seafood: Shell,
  spot: MapPinned,
  street: Compass,
};

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

const getSpotImageUrl = (spotName, city) => {
  return spotImages[spotName] ?? cityFallbackImages[city] ?? cityFallbackImages.厦门;
};

const simpleChoiceKey = (region, place) => `${region.id}::${place.name}`;

function BuddyChatAvatar({ appearance = "round-bot" }) {
  return <BuddyAvatar type={appearance} className="chat-buddy-avatar" title="buddy chat avatar" />;
}

export default function HomePage({ setActivePage, showToast, onConfirmTrip, buddySettings }) {
  const [flow, setFlow] = useState("chat");
  const [selectedCity, setSelectedCity] = useState(destinationIdeas[0].city);
  const [selectedAttraction, setSelectedAttraction] = useState(destinationIdeas[0].attractions[0]);
  const [planMode, setPlanMode] = useState("");
  const [selectedDay, setSelectedDay] = useState("D1");
  const [selectedNode, setSelectedNode] = useState(itineraryMapNodes[1]);
  const [selectedRegion, setSelectedRegion] = useState(simpleMapRegions[0]);
  const [selectedSegment, setSelectedSegment] = useState(trafficSegments[0]);
  const [selectedBooking, setSelectedBooking] = useState(bookingOptions[0]);
  const [reservedItem, setReservedItem] = useState("");
  const [buddyPanelOpen, setBuddyPanelOpen] = useState(false);
  const [buddyInput, setBuddyInput] = useState("");
  const [buddyResponseStage, setBuddyResponseStage] = useState("idle");
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const [isRebuildingPlan, setIsRebuildingPlan] = useState(false);
  const [chosenSimplePlaces, setChosenSimplePlaces] = useState([]);
  const [chosenDetailedSpots, setChosenDetailedSpots] = useState(() =>
    itineraryMapNodes.filter((node) => node.type === "spot").map((node) => node.name),
  );
  const [selectedOptionListType, setSelectedOptionListType] = useState("spot");
  const [spotDetailReturnFlow, setSpotDetailReturnFlow] = useState("spots");
  const flowScrollPositionsRef = useRef({});

  const cityOptions = destinationIdeas.slice(0, 2);
  const buddyName = buddySettings?.name ?? "小旅";

  const selectedDestination = useMemo(
    () => destinationIdeas.find((item) => item.city === selectedCity) ?? destinationIdeas[0],
    [selectedCity],
  );
  const activePlanning = cityPlanningOverrides[selectedDestination.city] ?? {};
  const activeItineraryMapNodes = activePlanning.itineraryMapNodes ?? itineraryMapNodes;
  const activeSimpleMapRegions = activePlanning.simpleMapRegions ?? simpleMapRegions;
  const activeTrafficSegments = activePlanning.trafficSegments ?? trafficSegments;
  const activeTrafficDetailDays = activePlanning.trafficDetailDays ?? trafficDetailDays;
  const activeDetailedRoutePathByDay = activePlanning.detailedRoutePathByDay ?? detailedRoutePathByDay;
  const activeMapOptionCatalog = activePlanning.mapOptionCatalog ?? mapOptionCatalog;
  const activeMapOptionDetails = activePlanning.mapOptionDetails ?? mapOptionDetails;
  const allAttractions = useMemo(
    () => destinationIdeas.flatMap((destination) => destination.attractions.map((spot) => ({ ...spot, city: destination.city }))),
    [],
  );

  const selectedNodeBooking = useMemo(
    () => {
      const booking = bookingOptions.find((item) => item.name === selectedNode.name);
      if (booking) return booking;
      const detail = activeMapOptionDetails[selectedNode.name];
      return detail?.type === "酒店" || detail?.type === "饭店" ? { name: selectedNode.name, ...detail } : null;
    },
    [activeMapOptionDetails, selectedNode],
  );

  const selectedNodeType = selectedNode.type === "hotel" ? "hotel" : selectedNode.type === "food" ? "food" : "spot";

  const dayNodes = useMemo(
    () => activeItineraryMapNodes.filter((node) => node.day === selectedDay),
    [activeItineraryMapNodes, selectedDay],
  );

  const finalRouteDays = useMemo(
    () =>
      planningDays.map((day, index) => {
        const nodes = activeItineraryMapNodes.filter((node) => node.day === day.id);
        const route = nodes.map((node) => node.name).join(" - ");
        return {
          ...day,
          color: ["#7067f5", "#2e8f7f", "#bf6a00", "#d9a24c"][index % 4],
          route,
          nodes,
          path: activeDetailedRoutePathByDay[day.id],
        };
      }),
    [activeDetailedRoutePathByDay, activeItineraryMapNodes],
  );
  const simpleFinalPlan = useMemo(() => {
    const chosenItems = activeSimpleMapRegions.flatMap((region) =>
      region.places
        .filter((place) => chosenSimplePlaces.includes(simpleChoiceKey(region, place)))
        .map((place) => ({ ...place, region })),
    );

    const staying = chosenItems
      .filter((item) => item.region.id.includes("hotel") || item.region.tone.includes("住宿"))
      .map((item) => item.name);
    const eating = chosenItems
      .filter((item) => item.region.tone.includes("吃饭") || item.region.tone.includes("补给"))
      .map((item) => item.name);
    const visiting = chosenItems
      .filter((item) => !item.region.tone.includes("住宿") && !item.region.tone.includes("吃饭") && !item.region.tone.includes("补给"))
      .map((item) => item.name);

    const cityFallback =
      selectedDestination.city === "杭州"
        ? {
            stay: "目前没有明确偏好的住宿方向，推荐优先住湖滨/武林这类交通稳定的酒店区",
            visit: "目前没有明确偏好的游玩方向，推荐前往西湖外圈、灵隐寺、龙井茶山和小河直街等杭州特色打卡点",
            eat: "目前没有明确偏好的吃饭方向，推荐尝试杭帮菜、知味观小吃和龙井茶园简餐等特色美食",
          }
        : {
            stay: "目前没有明确偏好的住宿方向，推荐优先住交通稳定的岛内主路酒店区",
            visit: "目前没有明确偏好的游玩方向，推荐前往沙坡尾街区、环岛路骑行、鼓浪屿建筑等厦门特色打卡点",
            eat: "目前没有明确偏好的吃饭方向，推荐尝试八市海鲜小炒、沙茶面和老街甜汤等特色美食",
          };

    return {
      stay: staying.length ? staying.join("、") : cityFallback.stay,
      visit: visiting.length ? visiting.join("、") : cityFallback.visit,
      eat: eating.length ? eating.join("、") : cityFallback.eat,
      chosenCount: chosenItems.length,
    };
  }, [activeSimpleMapRegions, chosenSimplePlaces, selectedDestination.city]);

  const dayRegions = useMemo(
    () => activeSimpleMapRegions.filter((region) => region.day === selectedDay),
    [activeSimpleMapRegions, selectedDay],
  );

  const daySegments = useMemo(
    () => activeTrafficSegments.filter((segment) => segment.day === selectedDay),
    [activeTrafficSegments, selectedDay],
  );

  const selectedTrafficDay = useMemo(
    () => activeTrafficDetailDays.find((day) => day.id === selectedDay),
    [activeTrafficDetailDays, selectedDay],
  );

  useEffect(() => {
    const firstDay = planningDays[0]?.id ?? "D1";
    const firstNode = activeItineraryMapNodes.find((node) => node.day === firstDay) ?? activeItineraryMapNodes[0];
    const firstRegion = activeSimpleMapRegions.find((region) => region.day === firstDay) ?? activeSimpleMapRegions[0];
    const firstSegment = activeTrafficSegments.find((segment) => segment.day === firstDay) ?? activeTrafficSegments[0];

    setSelectedDay(firstDay);
    if (firstNode) setSelectedNode(firstNode);
    if (firstRegion) setSelectedRegion(firstRegion);
    if (firstSegment) setSelectedSegment(firstSegment);
    setChosenSimplePlaces([]);
    setChosenDetailedSpots(activeItineraryMapNodes.filter((node) => node.type === "spot").map((node) => node.name));
    setReservedItem("");
  }, [selectedDestination.city]);

  const rememberFlowScroll = (flowName = flow) => {
    const scroller = screenScroller();
    if (scroller) flowScrollPositionsRef.current[flowName] = scroller.scrollTop;
  };

  const goToFlow = (nextFlow, { reset = false } = {}) => {
    setFlow(nextFlow);
    window.requestAnimationFrame(() => {
      const scroller = screenScroller();
      if (!scroller) return;
      scroller.scrollTo({ top: reset ? 0 : (flowScrollPositionsRef.current[nextFlow] ?? 0), left: 0 });
    });
  };

  useEffect(() => {
    const nextNode = activeItineraryMapNodes.find((node) => node.day === selectedDay);
    const nextRegion = activeSimpleMapRegions.find((region) => region.day === selectedDay);
    const nextSegment = activeTrafficSegments.find((segment) => segment.day === selectedDay);

    if (nextNode) setSelectedNode(nextNode);
    if (nextRegion) setSelectedRegion(nextRegion);
    if (nextSegment) setSelectedSegment(nextSegment);
  }, [activeItineraryMapNodes, activeSimpleMapRegions, activeTrafficSegments, selectedDay]);

  const openCitySpots = (city) => {
    const destination = destinationIdeas.find((item) => item.city === city) ?? destinationIdeas[0];
    setSelectedCity(destination.city);
    setSelectedAttraction(destination.attractions[0]);
    goToFlow("spots", { reset: true });
  };

  const openStrategy = (city) => {
    const destination = destinationIdeas.find((item) => item.city === city) ?? destinationIdeas[0];
    setSelectedCity(destination.city);
    setSelectedAttraction(destination.attractions[0]);
    setPlanMode("");
    goToFlow("strategy", { reset: true });
  };

  const selectMapNode = (node) => {
    setSelectedNode(node);
    const booking = bookingOptions.find((item) => item.name === node.name);
    if (booking) setSelectedBooking(booking);
  };

  const handleBuddyRequest = () => {
    if (!buddyInput.trim()) {
      showToast("先告诉小旅你想怎么改攻略");
      return;
    }

    setBuddyResponseStage("planning");
    setIsRebuildingPlan(true);
    window.setTimeout(() => {
      setMapRefreshKey((key) => key + 1);
      setBuddyResponseStage("done");
      setBuddyPanelOpen(false);
      setIsRebuildingPlan(false);
      showToast("已经重构攻略，看看这次满意吗~");
    }, 1200);
  };

  const handleRemoveArea = () => {
    setIsRebuildingPlan(true);
    window.setTimeout(() => {
      setMapRefreshKey((key) => key + 1);
      setIsRebuildingPlan(false);
      showToast("已避开这一块，重新整理攻略方向");
    }, 1200);
  };

  const findAttractionDetail = (item) => {
    return allAttractions.find((spot) => spot.name === item.name);
  };

  const enrichSpotCard = (item, fallbackTag = "景点") => {
    const attraction = findAttractionDetail(item);
    return {
      ...item,
      tag: attraction?.tag ?? item.tag ?? fallbackTag,
      intro: attraction?.intro ?? item.meta ?? "适合放进当天路线，实际停留时间可以按体力调整。",
      stay: attraction?.stay ?? "60-90 分钟",
      bestTime: attraction?.bestTime ?? selectedNode.time?.replace(/^\d{2}:\d{2}\s*/, "") ?? "当天顺路时段",
      detail: attraction?.detail ?? item.meta,
    };
  };

  const openOptionDetail = (item, returnFlow = flow) => {
    const attraction = findAttractionDetail(item);
    if (attraction) {
      rememberFlowScroll(returnFlow);
      setSelectedCity(attraction.city);
      setSelectedAttraction({
        ...attraction,
        tag: attraction.tag ?? item.tag,
        intro: attraction.intro ?? item.meta,
      });
      setSpotDetailReturnFlow(returnFlow);
      goToFlow("spotDetail", { reset: true });
      return;
    }

    const detail = activeMapOptionDetails[item.name] ?? {
      type: selectedNodeType === "hotel" ? "酒店" : selectedNodeType === "food" ? "饭店" : "景点",
      rating: "4.5",
      price: item.meta?.split("·")[0]?.trim() ?? "视选择而定",
      package: item.tag,
      detail: item.meta,
    };

    rememberFlowScroll(returnFlow);
    setSelectedBooking({
      name: item.name,
      ...detail,
    });
    goToFlow("bookingDetail", { reset: true });
  };

  const chooseDetailedOption = (item) => {
    const detail = activeMapOptionDetails[item.name] ?? {};
    setSelectedNode((node) => ({
      ...node,
      name: item.name,
      meta: detail.nodeMeta ?? item.meta,
      address: detail.address ?? node.address,
      duration: detail.duration ?? node.duration,
      cost: detail.price ? `预算：${detail.price}` : node.cost,
      safety: detail.safety ?? node.safety,
      tip: detail.tip ?? detail.detail ?? node.tip,
    }));
    if (detail.type) {
      setSelectedBooking({
        name: item.name,
        ...detail,
      });
    }
  };

  const chooseOptionAndReturnToMap = (item) => {
    chooseDetailedOption(item);
    goToFlow("map");
    showToast(`已换成${item.name}`);
  };

  const toggleDetailedSpot = (item) => {
    setChosenDetailedSpots((spots) => {
      if (spots.includes(item.name)) {
        return spots.filter((name) => name !== item.name);
      }

      return [...spots, item.name];
    });
  };

  const renderDetailedOptionAction = (item) => {
    if (selectedNodeType === "spot") {
      const isChosen = chosenDetailedSpots.includes(item.name);
      return (
        <button className={isChosen ? "active" : ""} type="button" onClick={() => toggleDetailedSpot(item)}>
          {isChosen ? "从路线移除" : "加入路线"}
        </button>
      );
    }

    return (
      <button type="button" onClick={() => chooseDetailedOption(item)}>
        换成这个
      </button>
    );
  };

  const toggleSimplePlace = (place, region) => {
    const key = simpleChoiceKey(region, place);
    const isHotelChoice = region.id.includes("hotel") || region.tone.includes("住宿");
    setChosenSimplePlaces((places) => {
      const exists = places.includes(key);
      if (exists) return places.filter((name) => name !== key);
      showToast(`已加入攻略~旅程中会去${place.name}的~`);
      const nextPlaces = isHotelChoice
        ? places.filter((name) => {
            const [regionId] = name.split("::");
            const existingRegion = activeSimpleMapRegions.find((item) => item.id === regionId);
            return !(existingRegion?.day === region.day && (existingRegion.id.includes("hotel") || existingRegion.tone.includes("住宿")));
          })
        : places;
      return [...nextPlaces, key];
    });
  };

  const goBack = () => {
    const backMap = {
      spots: "chat",
      spotDetail: spotDetailReturnFlow,
      strategy: "chat",
      map: "strategy",
      booking: "map",
      bookingDetail: "map",
      transportDetail: "map",
      optionList: "map",
      final: "map",
    };
    goToFlow(backMap[flow] ?? "chat");
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
            <p className="destination-card-hint">点击城市卡片可以先看具体景点列表，确定城市后再进入攻略制定。</p>
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
                  rememberFlowScroll("spots");
                  setSelectedAttraction(spot);
                  setSpotDetailReturnFlow("spots");
                  goToFlow("spotDetail", { reset: true });
                }}
              >
                <span>{spot.tag}</span>
                <strong>{spot.name}</strong>
                <small>{spot.intro}</small>
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
          <div
            className="spot-detail-hero"
            style={{ backgroundImage: `url("${getSpotImageUrl(selectedAttraction.name, selectedDestination.city)}")` }}
            aria-label={`${selectedAttraction.name} 图片`}
          >
            <span className="pill dark">{selectedAttraction.tag}</span>
            <div>
              <strong>{selectedAttraction.name}</strong>
              <p>{selectedAttraction.intro}</p>
            </div>
          </div>
          <div className="spot-detail-grid">
            <div>
              <span>建议停留</span>
              <strong>{selectedAttraction.stay ?? "60-120 分钟"}</strong>
            </div>
            <div>
              <span>适合时段</span>
              <strong>{selectedAttraction.bestTime ?? "上午或傍晚"}</strong>
            </div>
            <div>
              <span>独行友好</span>
              <strong>{selectedAttraction.solo ?? "路线清楚，补给方便"}</strong>
            </div>
            <div>
              <span>替换方向</span>
              <strong>{selectedAttraction.backup ?? "天气不好可换室内/商圈"}</strong>
            </div>
          </div>
          <div className="spot-detail-note">
            <Info size={16} />
            <p>{selectedAttraction.detail ?? "这个点适合放进半日路线，不建议把前后节点排得太紧，留一点现场调整空间会更舒服。"}</p>
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
                className={`mode-choice mode-choice-${item.id}${item.id === planMode ? " active" : ""}`}
                key={item.id}
                type="button"
                onClick={() => setPlanMode(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </button>
            ))}
          </div>
          
          <button
            className="primary-button full"
            type="button"
            disabled={!planMode}
            onClick={() => {
              if (!planMode) return;
              showToast("攻略已生成，进入地图调整");
              goToFlow("map", { reset: true });
            }}
          >
            <Wand2 size={17} /> 生成攻略并进入地图
          </button>
        </section>
      </div>
    );
  }

  if (flow === "map") {
    const isSimpleMode = planMode === "simple";
    const spotAreaTitle =
      selectedDay === "D1" ? "老城和港口一带" : selectedDay === "D2" ? "海边和环岛路一带" : "鼓浪屿和轮渡一带";
    const spotAreaSummary =
      selectedDay === "D1"
        ? "这片区域适合街区慢走、咖啡休息和老城小吃，具体去哪些点可以在下面逐个加入。"
        : selectedDay === "D2"
          ? "这片区域适合看海、骑行和轻量散步，按当天体力选择几个点就好。"
          : "这片区域适合建筑散步和海边慢走，返程日不要把点排得太满。";
    const spotAreaOptions =
      selectedNodeType === "spot"
        ? [
            {
              name: selectedNode.name,
              tag: "当前推荐",
              meta: selectedNode.meta,
            },
            ...selectedNode.alternatives,
          ].map((item) => enrichSpotCard(item, "路线景点"))
        : [];
    const visibleRouteSpots = spotAreaOptions.filter((item) => chosenDetailedSpots.includes(item.name));
    const availableRouteSpots =
      selectedNodeType === "spot"
        ? spotAreaOptions.filter((item) => !chosenDetailedSpots.includes(item.name))
        : selectedNode.alternatives;

    return (
      <div className="page-stack pretrip-page">
        <PageHeader />
        <section className="interactive-map-card flow-page-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">{selectedDestination.days} · {isSimpleMode ? "简约方向" : "详细攻略"}</span>
              <h3>{isSimpleMode ? "先确定想活动的区域" : "点击节点或路段调整"}</h3>
            </div>
            <label className="day-select">
              <span>日期</span>
              <select value={selectedDay} onChange={(event) => setSelectedDay(event.target.value)}>
                {planningDays.map((day) => (
                  <option value={day.id} key={day.id}>
                    {day.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isSimpleMode ? (
            <>
              <div className={`planner-map simple-planner-map map-refresh-${mapRefreshKey}`} aria-label="简约路线地图">
                <svg viewBox="0 0 320 230" role="presentation">
                  <path className="simple-route" d={simpleRoutePathByDay[selectedDay]} />
                </svg>
                {dayRegions.map((region) => (
                  <button
                    className={`simple-region-node${selectedRegion.id === region.id ? " active" : ""}`}
                    key={region.id}
                    style={{ left: `${region.x}%`, top: `${region.y}%` }}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    aria-label={region.title}
                  />
                ))}
              </div>
              <section className="simple-region-card">
                <span className="eyebrow">{selectedRegion.tone}</span>
                <h3>{selectedRegion.title}</h3>
                <p>{selectedRegion.summary}</p>
                <div className="simple-place-grid">
                  {selectedRegion.places.map((place) => {
                    const choiceKey = simpleChoiceKey(selectedRegion, place);
                    const isChosen = chosenSimplePlaces.includes(choiceKey);
                    const isHotelRegion = selectedRegion.id.includes("hotel") || selectedRegion.tone.includes("住宿");
                    return (
                      <article key={place.name} className="simple-place-card">
                        <span>{place.tag}</span>
                        <strong>{place.name}</strong>
                        <small>{place.meta}</small>
                        <div className="option-card-actions">
                          <button type="button" onClick={() => openOptionDetail(place, "map")}>
                            详情
                          </button>
                          <button
                            className={isChosen ? "active" : ""}
                            type="button"
                            onClick={() => toggleSimplePlace(place, selectedRegion)}
                          >
                            {isChosen ? (isHotelRegion ? "取消这个区域" : "不想去了") : (isHotelRegion ? "选这个区域" : "想去这里")}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <div className="node-card-actions simple-region-actions">
                  <button className="area-remove-button" type="button" onClick={handleRemoveArea}>
                    <X size={14} /> 这一块都不想去
                  </button>
                </div>
              </section>
            </>
          ) : (
            <>
              <div className={`planner-map planner-map-detailed map-refresh-${mapRefreshKey}`} aria-label="详细路线地图">
                <svg viewBox="0 0 320 230" role="presentation">
                  <path className="map-water" d="M235 0 C250 52, 216 88, 247 129 S278 194, 236 230 L320 230 L320 0 Z" />
                  <path className="map-neighborhood" d="M18 182 C54 134, 88 154, 122 104 S190 56, 252 88" />
                  <path className="map-street secondary" d="M34 48 C78 78, 110 74, 150 44 S214 22, 284 52" />
                  <path className="map-street secondary" d="M44 206 C94 178, 136 186, 180 154 S236 130, 292 158" />
                  <path className={`route-day-${selectedDay.toLowerCase()}`} d={activeDetailedRoutePathByDay[selectedDay]} />
                </svg>
                {daySegments.map((segment) => (
                  <button
                    className={`map-route-hit map-route-hit-${segment.id}`}
                    key={segment.id}
                    type="button"
                    onClick={() => setSelectedSegment(segment)}
                    aria-label={`${segment.from} 到 ${segment.to}`}
                  />
                ))}
                {dayNodes.map((node, index) => {
                  const Icon = nodeIcons[node.icon] ?? nodeIcons[node.type] ?? MapPinned;
                  return (
                    <button
                      className={`planner-node planner-node-${node.type}${selectedNode.name === node.name ? " active" : ""}`}
                      key={node.name}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      type="button"
                      onClick={() => selectMapNode(node)}
                      aria-label={node.name}
                    >
                      <Icon size={14} />
                      <span>{index + 1}</span>
                    </button>
                  );
                })}
              </div>
              <div className={`node-detail map-node-card node-detail-${selectedNode.type}`}>
                <div className="map-node-card-main">
                  <div>
                    <span>{selectedNode.day} · {selectedNode.time}</span>
                    <strong>{selectedNodeType === "spot" ? spotAreaTitle : selectedNode.name}</strong>
                    <p>{selectedNodeType === "spot" ? spotAreaSummary : selectedNode.meta}</p>
                  </div>
                  <span className="map-node-type">
                    {selectedNode.type === "hotel" ? "住宿" : selectedNode.type === "food" ? "餐饮" : "景点"}
                  </span>
                </div>
                {selectedNodeType !== "spot" && (
                  <>
                    <div className="node-info-grid">
                      <div>
                        <span>位置</span>
                        <strong>{selectedNode.address}</strong>
                      </div>
                      <div>
                        <span>时间</span>
                        <strong>{selectedNode.duration}</strong>
                      </div>
                      <div>
                        <span>预算</span>
                        <strong>{selectedNode.cost}</strong>
                      </div>
                      <div>
                        <span>安全</span>
                        <strong>{selectedNode.safety}</strong>
                      </div>
                    </div>
                    <div className="node-tip-row">
                      <Info size={15} />
                      <p>{selectedNode.tip}</p>
                    </div>
                    {selectedNodeBooking && (
                      <button
                        className="secondary-button node-current-detail-button"
                        type="button"
                        onClick={() => {
                          rememberFlowScroll("map");
                          setSelectedBooking(selectedNodeBooking);
                          goToFlow("bookingDetail", { reset: true });
                        }}
                      >
                        查看当前选择详情
                      </button>
                    )}
                  </>
                )}
                {selectedNodeType === "spot" && (
                  <div className="selected-spot-strip">
                    <span>这一带已加入路线的地点</span>
                    <div>
                      {visibleRouteSpots.map((item) => {
                        const isChosen = chosenDetailedSpots.includes(item.name);
                        return (
                          <article key={item.name} className={`route-spot-card${isChosen ? " selected" : ""}`}>
                            <div>
                              <span>{item.tag}</span>
                              <strong>{item.name}</strong>
                              <p>{item.intro}</p>
                              <small>建议停留：{item.stay} · {item.bestTime}</small>
                            </div>
                            <div className="route-spot-actions">
                              <button type="button" onClick={() => openOptionDetail(item, "map")}>
                                详情
                              </button>
                              <button className={isChosen ? "active" : ""} type="button" onClick={() => toggleDetailedSpot(item)}>
                                {isChosen ? "从路线移除" : "加入路线"}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="alternative-strip">
                  <span>{selectedNode.alternativesTitle}</span>
                  <div>
                    {availableRouteSpots.map((item) => {
                      const enrichedItem = selectedNodeType === "spot" ? enrichSpotCard(item, "路线景点") : item;
                      return (
                        <article key={item.name}>
                          <strong>{enrichedItem.name}</strong>
                          <small>{enrichedItem.tag} · {enrichedItem.meta}</small>
                          <div className="option-card-actions">
                            <button type="button" onClick={() => openOptionDetail(enrichedItem, "map")}>
                              详情
                            </button>
                            {renderDetailedOptionAction(enrichedItem)}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
                <div className="node-card-actions">
                  <button className="area-remove-button" type="button" onClick={handleRemoveArea}>
                    <X size={14} /> 这一块都不想去
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      rememberFlowScroll("map");
                      setSelectedOptionListType(selectedNodeType);
                      goToFlow("optionList", { reset: true });
                    }}
                  >
                    查看全部
                  </button>
                </div>
              </div>
              <button className="route-summary-card" type="button" onClick={() => goToFlow("transportDetail", { reset: true })}>
                <div>
                  <span className="eyebrow">当前路段</span>
                  <strong>{selectedSegment.from} → {selectedSegment.to}</strong>
                  <p>{selectedSegment.method} · {selectedSegment.note}</p>
                </div>
                <ChevronRight size={18} />
              </button>
              <div className="traffic-list">
                {daySegments.map((segment) => (
                  <button
                    key={segment.id}
                    type="button"
                    onClick={() => setSelectedSegment(segment)}
                  >
                    <Route size={15} />
                    <span>{segment.from} → {segment.to}</span>
                    <strong>{segment.method}</strong>
                  </button>
                ))}
                <button className="traffic-detail-entry" type="button" onClick={() => goToFlow("transportDetail", { reset: true })}>
                  <ChevronRight size={15} />
                  <span>查看每天的交通详情</span>
                  <strong>站点/费用/时间</strong>
                </button>
              </div>
            </>
          )}
          <button className="primary-button full flow-bottom-action" type="button" onClick={() => goToFlow("final", { reset: true })}>
            确定攻略，查看最终行程
          </button>
        </section>
        <div className="planner-buddy-assistant">
          {buddyPanelOpen && (
            <section className="planner-buddy-panel">
              <div>
                <span className="eyebrow">{buddyName}</span>
                <strong>想怎么重构这版攻略？</strong>
                <p>可以直接说偏好，比如少走路、酒店换到中山路、第二天不要骑行、想多留鼓浪屿时间。</p>
              </div>
              <div className="buddy-confirm-list">
                <span>我会先确认：</span>
                <button type="button">住宿范围</button>
                <button type="button">每日强度</button>
                <button type="button">交通偏好</button>
              </div>
              <div className="buddy-chat-box">
                <input
                  value={buddyInput}
                  onChange={(event) => setBuddyInput(event.target.value)}
                  placeholder="例如：第二天少骑车，多安排海边咖啡"
                  aria-label="输入攻略修改需求"
                />
                <button type="button" onClick={handleBuddyRequest}>
                  发送
                </button>
              </div>
              {buddyResponseStage === "planning" && (
                <p className="buddy-reply">好的，我会按照你的需求重构攻略。先把路线强度、住宿范围和交通方式一起调整。</p>
              )}
              {buddyResponseStage === "done" && (
                <p className="buddy-reply done">已经重构攻略，看看这次满意吗~</p>
              )}
            </section>
          )}
          <button className="planner-buddy-button" type="button" onClick={() => setBuddyPanelOpen((open) => !open)}>
            <BuddyChatAvatar appearance={buddySettings?.appearance} />
            <strong>{buddyPanelOpen ? "收起" : "找小旅改"}</strong>
          </button>
        </div>
        {isRebuildingPlan && (
          <div className="planner-rebuild-overlay" role="status" aria-live="polite">
            <div>
              <span className="rebuild-spinner" />
              <strong>重新规划中……</strong>
            </div>
          </div>
        )}
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
          <button className="primary-button full flow-bottom-action" type="button" onClick={() => goToFlow("bookingDetail", { reset: true })}>
            查看详情并预定
          </button>
        </section>
      </div>
    );
  }

  if (flow === "transportDetail") {
    return (
      <div className="page-stack pretrip-page">
        <PageHeader />
        <section className="transport-detail-card flow-page-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">每天怎么走</span>
              <h3>交通方式、站点和预算</h3>
            </div>
          </div>
          <div className="transport-day-list">
            {[selectedTrafficDay].filter(Boolean).map((day) => (
              <article className="transport-day" key={day.day}>
                <span>{day.day}</span>
                <h3>{day.title}</h3>
                <div className="transport-segment-list">
                  {day.segments.map((segment) => (
                    <div className="transport-segment" key={`${day.day}-${segment.from}-${segment.to}`}>
                      <div>
                        <strong>{segment.from} → {segment.to}</strong>
                        <small>{segment.method} · {segment.time} · {segment.cost}</small>
                      </div>
                      <ol>
                        {segment.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (flow === "optionList") {
    const optionList = activeMapOptionCatalog[selectedOptionListType] ?? [];
    const optionTitle = selectedOptionListType === "hotel" ? "可选酒店" : selectedOptionListType === "food" ? "可选饭店" : "可选景点";

    return (
      <div className="page-stack pretrip-page">
        <PageHeader />
        <section className="option-list-card flow-page-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">{selectedDestination.city}</span>
              <h3>{optionTitle}</h3>
            </div>
          </div>
          <div className="option-list">
            {optionList.map((item) => (
              <article key={item.name} className="option-list-item">
                <div>
                  <span>{item.tag}</span>
                  <strong>{item.name}</strong>
                  <p>{item.meta}</p>
                </div>
                <div className="option-card-actions">
                  <button type="button" onClick={() => openOptionDetail(item, "optionList")}>
                    详情
                  </button>
                  {selectedOptionListType === "hotel" || selectedOptionListType === "food" ? (
                    <button type="button" onClick={() => chooseOptionAndReturnToMap(item)}>
                      换成这个
                    </button>
                  ) : (
                    renderDetailedOptionAction(item)
                  )}
                </div>
              </article>
            ))}
          </div>
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
              if (reservedItem === selectedBooking.name) {
                setReservedItem("");
                showToast("已取消预订");
                return;
              }

              setReservedItem(selectedBooking.name);
              showToast("预定成功，已同步到攻略");
            }}
          >
            {reservedItem === selectedBooking.name ? "取消预订" : "一键预定"}
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
            <h3>{planMode === "simple" ? "简约攻略确认" : "每天一条路线，节点按类型标注"}</h3>
          </div>
        </div>
        {planMode === "simple" ? (
          <div className="simple-final-summary">
            <p>这版攻略保留大方向，具体顺序可以旅途中再由小旅按天气、体力和营业状态微调。</p>
            <div>
              <article>
                <span>住宿方向</span>
                <strong>旅途中我们会住在：{simpleFinalPlan.stay}</strong>
              </article>
              <article>
                <span>想去的地方</span>
                <strong>会去你想去的：{simpleFinalPlan.visit}</strong>
              </article>
              <article>
                <span>吃饭方向</span>
                <strong>会安排吃：{simpleFinalPlan.eat}</strong>
              </article>
            </div>
            <small>
              {simpleFinalPlan.chosenCount > 0
                ? `已纳入 ${simpleFinalPlan.chosenCount} 个你在简约攻略里选择的偏好。`
                : "你还没有明确偏好，我先按厦门特色方向兜底推荐；进入陪伴后可以随时调整。"}
            </small>
          </div>
        ) : (
          <>
            <div className="planner-map final-map" aria-label="最终行程地图">
              <svg viewBox="0 0 320 230" role="presentation">
                {finalRouteDays.map((day) => (
                  <path key={day.id} stroke={day.color} d={day.path} />
                ))}
              </svg>
              {finalRouteDays.flatMap((day) =>
                day.nodes.map((node, index) => (
                  <span
                    className={`final-map-node final-map-node-${node.type}`}
                    key={`${day.id}-${node.name}`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    aria-label={`${day.label} ${node.name}`}
                  />
                )),
              )}
            </div>
            <div className="final-map-legend" aria-label="地图图例">
              <span><i className="final-map-node-hotel" />酒店</span>
              <span><i className="final-map-node-food" />饭店</span>
              <span><i className="final-map-node-spot" />景点/打卡点</span>
            </div>
            <div className="final-route-map">
              {finalRouteDays.map((day) => (
                <div className="final-day" key={day.id}>
                  <span style={{ background: day.color }} />
                  <div>
                    <strong>{day.label}</strong>
                    <p>{day.route}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <button className="primary-button full" type="button" onClick={() => onConfirmTrip?.(selectedDestination)}>
          保存最终攻略并加入陪伴列表
        </button>
      </section>
    </div>
  );
}
