export const userProfile = {
  name: "小a",
  phone: "10000000000",
  city: "广州",
  travelCount: 6,
  safetyContact: "小b",
};

export const companionOptions = {
  appearance: ["圆滚机器人", "小小狗", "云朵猫", "卡通人形向导"],
  voices: ["温柔", "活泼", "沉稳", "轻快"],
  frequencies: ["高", "中", "低", "仅唤醒"],
};

export const buddyProfile = {
  name: "小旅",
  appearance: "圆滚机器人",
  voice: "温柔",
  mode: "实时陪伴",
  frequency: "中",
};

export const destinations = [
  {
    city: "广州",
    mood: "松弛烟火气",
    score: "96%",
    budget: "¥1680",
    energy: "轻松",
    plan: [
      { title: "沙面岛漫步", desc: "低强度街区路线，适合边走边听讲解" },
      { title: "西关老店晚餐", desc: "一人友好座位，避开排队高峰" },
      { title: "珠江夜风返程", desc: "主干道步行，自动开启夜间守护" },
    ],
  },
  {
    city: "香港",
    mood: "城市逃离",
    score: "92%",
    budget: "¥2380",
    energy: "适中",
    plan: [
      { title: "中环街区探索", desc: "保留自由闲逛时间，减少换乘压力" },
      { title: "海边日落路线", desc: "标记安全观景点和返程交通" },
      { title: "茶餐厅点餐辅助", desc: "准备粤语点餐和菜单翻译卡" },
    ],
  },
  {
    city: "厦门",
    mood: "海风治愈",
    score: "94%",
    budget: "¥1450",
    energy: "轻松",
    plan: [
      { title: "环岛路骑行", desc: "避开夜间偏僻路段，保留拍照点" },
      { title: "老城区小吃", desc: "推荐一人份组合，不用纠结点餐" },
      { title: "海边手帐", desc: "自动整理照片和当日心情片段" },
    ],
  },
];

export const timeline = [
  { time: "15:30", title: "永庆坊咖啡", note: "适合休息和整理照片" },
  { time: "17:10", title: "沙面岛漫步", note: "触发建筑讲解和拍照建议" },
  { time: "19:00", title: "西关晚餐", note: "已筛选一人友好座位" },
];

export const preTripStatus = {
  phase: "before",
  label: "旅途前",
  title: "先和小旅聊聊，你想去哪一种远方？",
  subtitle: "用自然语言说出时间、心情、预算或想避开的事，小旅会先给出目的地大方向，再进入交互式地图细化。",
};

export const planningPrompts = [
  "我想找一个适合独自放空的海边城市，预算不要太高",
  "三天两夜，想吃好一点，也希望晚上安全",
  "帮我从广州出发，找一个拍照和散步都舒服的地方",
];

export const destinationIdeas = [
  {
    city: "厦门",
    fit: "海风治愈",
    days: "3天2夜",
    reason: "海边、老城区、小吃动线紧凑，适合先放松再慢慢探索。",
    highlights: ["环岛路骑行", "沙坡尾街区", "鼓浪屿建筑"],
    attractions: [
      {
        name: "沙坡尾",
        tag: "街区漫游",
        intro: "老港口和新店铺交织，适合下午慢走、拍照、找咖啡坐下。",
      },
      {
        name: "环岛路",
        tag: "海边路线",
        intro: "视野开阔、补给点多，小旅会帮你避开暴晒时段。",
      },
    ],
  },
  {
    city: "杭州",
    fit: "湖边慢行",
    days: "4天3夜",
    reason: "景点密度高但节奏可控，适合把西湖、茶山和夜游拆成轻松几段。",
    highlights: ["西湖外圈", "龙井茶山", "运河夜色"],
    attractions: [
      {
        name: "龙井村",
        tag: "茶山散步",
        intro: "适合上午进入，路线坡度温和，可以预留一段无安排的发呆时间。",
      },
      {
        name: "小河直街",
        tag: "夜间友好",
        intro: "灯光和人流都比较稳定，适合作为晚餐后的轻量散步点。",
      },
    ],
  },
  {
    city: "成都",
    fit: "松弛烟火气",
    days: "4天3夜",
    reason: "吃饭选择丰富，白天可城市漫游，晚上用安全守护控制探索边界。",
    highlights: ["玉林街区", "人民公园", "东郊记忆"],
    attractions: [
      {
        name: "玉林路",
        tag: "烟火街区",
        intro: "适合晚饭前后走走，小旅会提前标记排队少的一人友好小店。",
      },
      {
        name: "人民公园",
        tag: "低强度",
        intro: "可以把茶馆和老街连成半日路线，适合第一天适应城市节奏。",
      },
    ],
  },
];

export const planningModes = [
  {
    id: "simple",
    title: "简约模式",
    desc: "只确定城市、住宿片区和每日大方向，细节到了当地随心调整。",
  },
  {
    id: "detailed",
    title: "详略模式",
    desc: "生成具体到景点、餐厅、交通和预留时间的攻略，适合想提前安心的人。",
  },
];

export const itineraryMapNodes = [
  {
    day: "D1",
    type: "hotel",
    icon: "hotel",
    name: "鹭屿海景酒店",
    time: "14:00 入住",
    meta: "均价 ¥420 / 晚",
    address: "环岛南路主路旁",
    duration: "建议停留：办理入住 35 分钟",
    cost: "预算：¥420 / 晚",
    safety: "返程主路明亮，夜间步行 8 分钟内有便利店",
    tip: "先放行李，再从酒店打车去沙坡尾，避免拖箱走老街。",
    x: 18,
    y: 66,
  },
  {
    day: "D1",
    type: "spot",
    icon: "street",
    name: "沙坡尾",
    time: "16:00 漫游",
    meta: "附近可替换：华新路",
    address: "老港街区入口",
    duration: "建议停留：90 分钟",
    cost: "预算：咖啡/小店 ¥40-80",
    safety: "傍晚人流稳定，建议沿主街进入支巷",
    tip: "适合先拍街景，再找一家靠窗咖啡店休息。",
    x: 38,
    y: 34,
  },
  {
    day: "D1",
    type: "food",
    icon: "seafood",
    name: "阿吉仔海鲜饭",
    time: "18:30 晚餐",
    meta: "评分 4.7，人均 ¥86",
    address: "沙坡尾步行 9 分钟",
    duration: "建议停留：55 分钟",
    cost: "预算：一人套餐 ¥86",
    safety: "门口即主街，饭后可直接叫车回酒店",
    tip: "有吧台位，适合独自旅行者快速用餐。",
    x: 58,
    y: 48,
  },
  {
    day: "D2",
    type: "spot",
    icon: "bike",
    name: "环岛路",
    time: "09:30 骑行",
    meta: "周边设施：租车点、洗手间、补给站",
    address: "黄厝海滩骑行段",
    duration: "建议停留：2 小时",
    cost: "预算：租车 ¥35 起",
    safety: "白天视野开阔，避开正午暴晒",
    tip: "先走海边外侧，回程沿补给点密集的一侧。",
    x: 72,
    y: 26,
  },
  {
    day: "D2",
    type: "food",
    icon: "food",
    name: "黄厝小馆",
    time: "12:40 午餐",
    meta: "套餐：双拼饭 + 汤 ¥58",
    address: "环岛路补给点旁",
    duration: "建议停留：45 分钟",
    cost: "预算：¥58-75",
    safety: "午餐后可直接公交返城，不走偏僻小路",
    tip: "作为骑行后的低负担午餐点，排队少于热门海鲜店。",
    x: 84,
    y: 62,
  },
];

export const trafficSegments = [
  { from: "酒店", to: "沙坡尾", method: "打车 12 分钟", note: "傍晚车流稳定，步行替代约 28 分钟" },
  { from: "沙坡尾", to: "晚餐", method: "步行 9 分钟", note: "沿主街行走，适合夜间安全守护" },
  { from: "酒店", to: "环岛路", method: "公交 24 分钟", note: "可替换为打车 16 分钟，预算增加约 ¥22" },
];

export const bookingOptions = [
  { name: "鹭屿海景酒店", type: "酒店", rating: "4.8", price: "¥420", package: "含早 + 延迟退房", detail: "靠近海边主路，夜间返程更稳定。" },
  { name: "阿吉仔海鲜饭", type: "饭店", rating: "4.7", price: "¥86", package: "一人海鲜套餐", detail: "有吧台位，适合独自旅行者快速用餐。" },
];

export const finalItineraryDays = [
  { day: "Day 1", color: "#7067f5", route: "酒店 - 沙坡尾 - 海鲜饭 - 海边散步" },
  { day: "Day 2", color: "#2e8f7f", route: "环岛路 - 黄厝午餐 - 鼓浪屿外圈" },
  { day: "Day 3", color: "#bf6a00", route: "老城区早餐 - 伴手礼 - 返程" },
];

export const confirmedCompanionTrips = [
  {
    id: "xiamen-2026",
    city: "厦门",
    title: "厦门三天两夜慢行",
    date: "2026.06.02 - 06.04",
    status: "ready",
    statusText: "待进入陪伴",
    safety: "安全守护已开启",
    currentPlace: "鹭屿海景酒店",
    nextPlace: "沙坡尾",
    buddyLine: "我会在你出发前 20 分钟提醒交通，也会帮你盯着晚间返程路线。",
    nearbySpots: [
      {
        name: "沙坡尾",
        tag: "街区漫游",
        distance: "1.2km",
        intro: "老港口和新店铺交织，适合下午慢走、拍照、找咖啡坐下。",
      },
      {
        name: "华新路",
        tag: "替换景点",
        distance: "2.4km",
        intro: "更安静的老别墅街区，适合天气太晒时替换沙坡尾。",
      },
    ],
    route: ["酒店", "沙坡尾", "阿吉仔海鲜饭", "海边散步"],
  },
];

export const safetyCards = [
  { icon: "route", level: "normal", title: "路线明亮度良好", text: "当前路线 82% 位于主干道和商业街" },
  { icon: "phone", level: "normal", title: "联系人可用", text: "小b将在异常停留时收到位置确认" },
  { icon: "moon", level: "warning", title: "21:30 后降低探索强度", text: "建议避免进入未标记小巷和河堤暗段" },
];

export const memories = [
  { title: "你在沙面停了很久", text: "那一段晚风很轻，你拍了 12 张窗边照片。" },
  { title: "第一次独自点完晚餐", text: "从犹豫到坐下，只用了 4 分钟。" },
  { title: "安全返程完成", text: "夜间路线全程未偏航，22:18 回到酒店。" },
];

export const tripHistory = [
  { city: "广州", date: "2026.05.18", mood: "松弛", summary: "沙面、永庆坊、西关晚餐" },
  { city: "厦门", date: "2026.04.26", mood: "治愈", summary: "环岛路、老城区、海边手帐" },
  { city: "香港", date: "2026.03.15", mood: "探索", summary: "中环街区、海边日落、茶餐厅" },
];
