export const companionOptions = {
  appearance: ["圆滚机器人", "小狐狸", "云朵猫", "人形向导"],
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

export const memories = [
  { title: "你在沙面停了很久", text: "那一段晚风很轻，你拍了 12 张窗边照片。" },
  { title: "第一次独自点完晚餐", text: "从犹豫到坐下，只用了 4 分钟。" },
  { title: "安全返程完成", text: "夜间路线全程未偏航，22:18 回到酒店。" },
];
