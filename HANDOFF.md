# FellowTrip 前端原型协作交接文档

本文档用于把 FellowTrip 原型拆给不同对话或不同成员继续开发。每个页面已有独立文件，建议一个对话只负责一个页面或一个组件，避免互相覆盖。

## 当前项目状态

- 技术栈：React + Vite + lucide-react + 原生 CSS
- 运行命令：`npm.cmd install`，`npm.cmd run dev`
- 本地地址：http://localhost:5173
- 当前 Git 最新提交：`3b2acbb Add auth onboarding and profile page`
- 当前阶段：移动端 SPA 高保真交互原型，不接真实后端、地图、AI、定位、语音接口。

## 关键流程

用户首次进入 App 的流程：

1. 登录/注册页
2. 首次搭子设置
3. 今日旅途陪伴首页
4. 底部导航进入：陪伴、规划、守护、回忆、我的
5. 后续搭子设置入口在“我的”页面中

状态流转主要在 `src/App.jsx` 中控制。

## 目录说明

- `src/main.jsx`：React 入口，只负责挂载 App。
- `src/App.jsx`：全局状态、登录/首次设置流程、页面切换、手机壳布局。
- `src/navigation.js`：底部导航配置。
- `src/data/mockData.js`：所有 mock 数据。
- `src/styles/global.css`：全局样式和设计 token。
- `src/components/`：复用组件。
- `src/pages/`：页面文件，适合分工开发。

## 页面分工建议

### 登录/注册页

文件：`src/pages/AuthPage.jsx`

职责：
- 登录/注册切换
- 表单视觉
- 首次进入 App 的产品氛围

可继续改：
- 增加验证码登录
- 增加第三方登录按钮
- 优化注册字段
- 加入隐私协议勾选

不要改：
- 不要直接改 `App.jsx` 里的登录状态逻辑，除非任务明确要求调整流程。

建议 prompt：

```text
请只修改 FellowTrip 的登录/注册页 src/pages/AuthPage.jsx 和必要 CSS。
目标是让登录页更像真实 App 首次进入体验，加入验证码登录、协议勾选和更清晰的注册流程。
不要修改其他页面逻辑，不接真实后端。
完成后跑 npm.cmd run build。
```

### 首次搭子设置 / 搭子设置页

文件：`src/pages/BuddyPage.jsx`

职责：
- 首次创建搭子
- 从“我的”进入后修改搭子设置
- 形象、声线、陪伴模式、主动频率

可继续改：
- 增加搭子命名
- 增加更多形象卡片
- 增加人格标签，如“安静型”“鼓励型”“效率型”
- 做成多步骤 onboarding

不要改：
- 不要把搭子设置重新放回底部导航。
- 不要删除 `variant`、`submitLabel`、`onComplete` 这些 props，它们支撑首次设置和后续设置复用。

建议 prompt：

```text
请只修改 FellowTrip 的搭子设置页 src/pages/BuddyPage.jsx 和必要 CSS。
目标是把搭子设置做成更完整的首次 onboarding：搭子命名、形象选择、声线选择、陪伴边界、主动频率。
这个页面同时被首次设置和“我的-搭子设置”复用，所以不要破坏 variant / submitLabel / onComplete props。
完成后跑 npm.cmd run build。
```

### 今日陪伴首页

文件：`src/pages/HomePage.jsx`

职责：
- 主界面首页
- 当前行程
- 实时/后台陪伴模式切换
- AI 对话提示
- 今日行程卡片

可继续改：
- 增加实时语音入口
- 增加天气/步数/位置状态
- 增加更完整的行程进度
- 增加拍照指导浮窗

不要改：
- 不要把页面级状态提升到全局，除非多个页面确实需要共享。
- 不要改底部导航配置。

建议 prompt：

```text
请只修改 FellowTrip 的今日陪伴首页 src/pages/HomePage.jsx 和必要 CSS。
目标是增强旅途中实时陪伴感：当前位置状态、AI 主动提醒、景点讲解、拍照指导入口。
保持现有浅色治愈风，不接真实地图或语音接口。
完成后跑 npm.cmd run build。
```

### 智能规划页

文件：`src/pages/PlanPage.jsx`

职责：
- 目的地推荐
- 情绪/预算/偏好输入
- 行程草案
- 住宿、安全、拍照推荐卡

可继续改：
- 增加多轮问答式规划
- 增加预算滑块、日期选择、偏好标签
- 增加行程方案对比
- 增加拖拽排序的静态演示

不要改：
- mock 数据优先放到 `src/data/mockData.js`。
- 页面内只消费数据，不要散落大量硬编码长数据。

建议 prompt：

```text
请只修改 FellowTrip 的智能规划页 src/pages/PlanPage.jsx、src/data/mockData.js 和必要 CSS。
目标是让规划流程更完整：情绪输入、预算/日期/偏好选择、多个方案对比、行程草案详情。
不要接真实地图或后端，只使用 mock 数据。
完成后跑 npm.cmd run build。
```

### 安全守护页

文件：`src/pages/SafetyPage.jsx`

职责：
- 夜间安全模式
- 安全状态卡片
- 紧急联系人
- 偏航确认示例
- SOS 演示

可继续改：
- 增加安全路线切换流程
- 增加联系人管理弹窗
- 增加风险等级和提醒记录
- 增加“共享实时位置”卡片

不要改：
- 不要做真实拨号、真实定位或真实短信。
- 所有危险操作保持原型演示文案。

建议 prompt：

```text
请只修改 FellowTrip 的安全守护页 src/pages/SafetyPage.jsx、src/data/mockData.js 和必要 CSS。
目标是完善夜间安全守护体验：风险等级、偏航提醒、紧急联系人、共享位置、SOS 演示。
不要调用真实定位、短信或电话。
完成后跑 npm.cmd run build。
```

### 旅行回忆页

文件：`src/pages/MemoryPage.jsx`

职责：
- AI 手帐
- 旅程摘要
- 回忆片段
- 分享文案
- 陪伴评价

可继续改：
- 增加照片时间线
- 增加心情曲线
- 增加不同平台文案
- 增加回忆详情页或弹窗

不要改：
- 不要接真实相册。
- 不要生成真实图片，先用视觉占位即可。

建议 prompt：

```text
请只修改 FellowTrip 的旅行回忆页 src/pages/MemoryPage.jsx、src/data/mockData.js 和必要 CSS。
目标是让旅行结束后的 AI 手帐更完整：照片时间线、心情曲线、路线摘要、社交平台文案和评价反馈。
不接真实相册，只做高保真原型。
完成后跑 npm.cmd run build。
```

### 我的页

文件：`src/pages/ProfilePage.jsx`

职责：
- 用户信息
- 搭子设置入口
- 安全偏好入口
- 历史旅行
- 退出登录

可继续改：
- 增加编辑个人资料
- 增加历史旅行详情
- 增加安全偏好设置页或弹窗
- 增加账号与隐私设置

不要改：
- 搭子设置入口应继续调用 `onEditBuddy`。
- 退出登录应继续调用 `onLogout`。

建议 prompt：

```text
请只修改 FellowTrip 的我的页面 src/pages/ProfilePage.jsx、src/data/mockData.js 和必要 CSS。
目标是完善个人中心：用户信息、搭子设置入口、安全偏好、历史旅行列表、账号与隐私设置。
不要破坏 onEditBuddy 和 onLogout 两个回调。
完成后跑 npm.cmd run build。
```

## 共享组件说明

组件目录：`src/components/`

- `BottomNav.jsx`：底部导航。
- `FloatingBuddy.jsx`：右下角悬浮搭子。
- `InfoTile.jsx`：规划页信息卡。
- `Metric.jsx`：指标卡。
- `MiniMap.jsx`：抽象地图占位。
- `OptionSection.jsx`：选项组。
- `SegmentedControl.jsx`：分段控制器。
- `StatusBar.jsx`：手机状态栏。

改共享组件时要格外小心，因为多个页面会同时受影响。建议单独开一个对话处理共享组件，不要和页面改动混在一起。

## 样式约定

全局样式在 `src/styles/global.css`。

当前视觉关键词：
- 浅色治愈风
- 蓝紫主色
- 薄荷绿和暖橙辅助色
- 手机 App 卡片式布局
- 圆角 14-22px
- 不要做营销落地页风格

新增样式建议：
- 优先复用已有 class。
- 页面专属样式可以加语义化前缀，如 `.profile-`、`.auth-`、`.memory-`。
- 避免覆盖通用元素选择器。
- 改完要检查手机宽度下是否文字溢出。

## Mock 数据约定

mock 数据集中在 `src/data/mockData.js`。

如果页面需要新增数据：
- 优先在 `mockData.js` 增加 export。
- 页面中 import 使用。
- 不要把长列表硬编码在 JSX 里。

## Git 协作建议

建议每个任务单独建分支：

```bash
git checkout -b feature/page-plan
git checkout -b feature/page-safety
git checkout -b feature/page-profile
git checkout -b feature/onboarding-buddy
```

每次修改前：

```bash
git status
```

每次完成后：

```bash
npm.cmd run build
git status
git add <changed-files>
git commit -m "Describe the page change"
```

## 验收清单

每个页面完成后至少检查：

- `npm.cmd run build` 通过。
- 页面在 `http://localhost:5173` 可访问。
- 底部导航能正常切换。
- 手机宽度下无文字溢出、卡片重叠、按钮挤压。
- 没有误改其他页面。
- Git 提交只包含本任务相关文件。

## 给新对话的通用开场 Prompt

```text
这是 FellowTrip React + Vite 移动端原型项目。
请先阅读 HANDOFF.md、README.md 和你负责的页面文件。
本次只负责【填写页面名】页面，尽量不要修改无关页面。
保持现有浅色治愈风格，不接真实后端/地图/AI。
完成后运行 npm.cmd run build，并说明修改了哪些文件。
```
