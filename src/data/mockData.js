export const userProfile = {
  name: "杨彤",
  phone: "138 0000 2026",
  city: "广州",
  travelCount: 6,
  safetyContact: "罗悦",
};

export const companionOptions = {
  appearance: ["圆滚机器人", "小狐狸", "云朵猫", "人形向导"],
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

export const safetyCards = [
  { icon: "route", level: "normal", title: "路线明亮度良好", text: "当前路线 82% 位于主干道和商业街" },
  { icon: "phone", level: "normal", title: "联系人可用", text: "罗悦将在异常停留时收到位置确认" },
  { icon: "moon", level: "warning", title: "21:30 后降低探索强度", text: "建议避免进入未标记小巷和河堤暗段" },
];

// === 陪伴反馈评价核心数据 ===
export const evaluationTags = [
  { id: "1", text: "安全感爆棚", type: "safety" },
  { id: "2", text: "边界感恰到好处", type: "mood" },
  { id: "3", text: "路线规划靠谱", type: "route" },
  { id: "4", text: "解说治愈有趣", type: "chat" },
  { id: "5", text: "不打扰、很安静", type: "mood" },
  { id: "6", text: "夜间守护很安心", type: "safety" }
];

export const defaultCommentPlaceholder = "写下你对 FellowTrip 的悄悄话吧，比如：谢谢你昨晚在黑暗的小巷里亮起守护，让我的独旅不再孤单...";

export const moodCurveData = {
  points: "10,80 70,30 140,60 210,15 270,45",
  labels: [
    { x: 10, y: 95, text: "出发" },
    { x: 70, y: 20, text: "惬意" },
    { x: 140, y: 75, text: "稍累" },
    { x: 210, y: 10, text: "惊艳" },
    { x: 270, y: 60, text: "安稳" }
  ]
};

// === 三天完整的足迹照片流数据 (已绑定真实图片 Class) ===
export const photoTimelineData = {
  1: [
    { time: "10:15", tag: "出发路上", desc: "飞机窗外的风景，第一缕治愈的晨光", imgClass: "img-day1-1" },
    { time: "15:40", tag: "永庆坊", desc: "复古红砖墙与斑驳老榕树的完美光影", imgClass: "img-day1-2" },
    { time: "17:45", tag: "沙面江边", desc: "金色的晚风，那一刻找到了久违的平静", imgClass: "img-day1-3" },
  ],
  2: [
    { time: "09:30", tag: "早茶时光", desc: "一个人在点都德排队，虾饺是给自己的奖励", imgClass: "img-day2-1" },
    { time: "14:20", tag: "东山口", desc: "洋房转角遇到的涂鸦，FellowTrip 提醒这里适合自拍", imgClass: "img-day2-2" },
    { time: "20:10", tag: "珠江夜游", desc: "两岸灯火通明，即便是一个人也不觉得孤独", imgClass: "img-day2-3" },
  ],
  3: [
    { time: "11:00", tag: "圣心大教堂", desc: "庄严的石室，在光影里坐着听了很久的钟声", imgClass: "img-day3-1" },
    { time: "14:15", tag: "西关老街", desc: "漫步在旧建筑下，FellowTrip 为我播放粤地历史讲解", imgClass: "img-day3-2" },
    { time: "18:20", tag: "离别车站", desc: "FellowTrip 播报：3天独旅安全达成，期待下次出发", imgClass: "img-day3-3" },
  ]
};

export const sharePlatforms = {
  pyq: "一个人走过的路，也可以被好好记住。今天在沙面吹到晚风，在老街吃到热汤，FellowTrip 一直安静地陪我确认方向。✨",
  xhs: "独自去广州被治愈了！码住这份一人独旅手帐 📸\n\n原以为一个人旅行会手忙脚乱，多亏了有 FellowTrip 全程守护。去永庆坊喝咖啡、沙面吹晚风、西关吃热汤。避开了偏僻路段，给足了安全感，体验了一把真正的松弛感！\n\n#独自旅行 #广州打卡 #FellowTrip #治愈系风景 #旅行手帐",
};

// === 陪伴回忆片段数据 (已绑定真实图片 Class) ===
export const memories = [
  { 
    title: "你在沙面停了很久", 
    text: "那一段晚风很轻，你拍了 12 张窗边照片。",
    imgClass: "img-mem-1",
    details: "17:10-18:30 在沙面历史街区。你偏离了主干道 2 次，FellowTrip 监测到整体灯光环境良好，转为“轻声建筑讲解”模式。由于你在江边驻留超过 20 分钟，系统自动帮你生成了拍照机位推荐。"
  },
  { 
    title: "第一次独自点完晚餐", 
    text: "从犹豫到坐下，只用了 4 分钟。",
    imgClass: "img-mem-2",
    details: "19:00 步入西关老店。FellowTrip 检测到店内有“单人友好无压力面壁座”，并帮你自动智能过滤了需要多人分食的大菜，为你生成了最地道的一人食银丝面+艇仔粥组合卡片。"
  },
  { 
    title: "安全返程完成", 
    text: "夜间路线全程未偏航，22:18 回到酒店。",
    imgClass: "img-mem-3",
    details: "21:30 后广州探索度降低。返程路线 94% 位于高亮主干道，期间 FellowTrip 将震动提升为主动夜间守护模式，与你的紧急联系人保持信号联动，全程安心无虞。"
  },
];

export const tripHistory = [
  { city: "广州", date: "2026.05.18", mood: "松弛", summary: "沙面、永庆坊、西关晚餐" },
  { city: "厦门", date: "2026.04.26", mood: "治愈", summary: "环岛路、老城区、海边手帐" },
  { city: "香港", date: "2026.03.15", mood: "探索", summary: "中环街区、海边日落、茶餐厅" },
];