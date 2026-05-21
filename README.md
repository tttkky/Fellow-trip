# FellowTrip 交互原型

FellowTrip 是一款面向独自旅行用户的陪伴式旅行助手原型。本仓库当前阶段聚焦移动端页面与视觉风格验证，不包含真实后端、地图、定位、语音或 AI 接口。

## 技术栈

- React
- Vite
- lucide-react
- 原生 CSS

## 本地运行

```bash
npm install
npm run dev
```

在 Windows PowerShell 如果 `npm` 被执行策略拦截，可以使用：

```bash
npm.cmd install
npm.cmd run dev
```

## 页面模块

- 登录/注册：首次进入 App 的账号入口。
- 首次设置搭子：登录/注册后必须完成搭子设置，再进入主界面。
- 实时陪伴：首页行程、AI 对话、景点讲解、拍照指导。
- 智能规划：目的地推荐、偏好输入、路线方案、住宿/美食推荐。
- 安全守护：夜间模式、异常路线提醒、紧急联系人、一键求助。
- 旅行回忆：AI 手帐、照片/路线摘要、分享文案、评价反馈。
- 我的：用户信息、搭子设置入口、历史旅行、退出登录。

## 原型记忆策略

当前没有后端，使用浏览器 `localStorage` 模拟用户记忆：

- 第一次登录/注册后进入搭子设置。
- 完成搭子设置后会保存登录状态、搭子配置和已加入陪伴的行程。
- 后续在同一浏览器打开会直接进入主界面。
- “我的”页面可以重新进入搭子设置并覆盖本机保存的配置。
- 主动退出登录后会回到登录页，但本机搭子配置仍保留，方便再次登录后恢复。

这只是前端原型方案，换浏览器、清除缓存或换设备后不会同步。

## 协作建议

详细分工、页面认领建议和可复制给其他对话的 prompt 见 [HANDOFF.md](./HANDOFF.md)。

- `src/App.jsx`：应用状态、登录/首次设置流程、页面切换和整体手机壳布局。
- `src/pages/`：按页面拆分，适合团队成员分别认领。
  - `AuthPage.jsx`：登录/注册。
  - `BuddyPage.jsx`：首次创建搭子与后续搭子设置共用表单。
  - `HomePage.jsx`：今日陪伴/行程首页。
  - `PlanPage.jsx`：智能旅行规划。
  - `SafetyPage.jsx`：安全守护。
  - `MemoryPage.jsx`：旅行回忆。
  - `ProfilePage.jsx`：我的页面，包含用户信息、搭子设置入口和历史旅行。
- `src/components/`：底部导航、悬浮搭子、地图占位、指标卡等通用组件。
- `src/data/`：mock 数据，后续接接口时优先从这里替换数据来源。
- `src/styles/`：全局视觉样式和设计 token。

建议后续分支命名：

```bash
feature/page-plan
feature/page-safety
feature/page-profile
feature/component-map
```
