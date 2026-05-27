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
      if (reset) {
        // Wait briefly for images/layout to settle so scrolling to 0 lands at the top
        window.setTimeout(() => scroller.scrollTo({ top: 0, left: 0 }), 60);
      } else {
        scroller.scrollTo({ top: (flowScrollPositionsRef.current[nextFlow] ?? 0), left: 0 });
      }
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
      ... (truncated for brevity)