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

- 创建搭子：形象、声线、陪伴模式、主动频率
- 智能规划：目的地推荐、偏好输入、路线方案、住宿/美食推荐
- 实时陪伴：首页行程、AI 对话、景点讲解、拍照指导
- 安全守护：夜间模式、异常路线提醒、紧急联系人、一键求助
- 旅行回忆：AI 手帐、照片路线摘要、分享文案、评价反馈

## 协作建议

- 功能页面放在 `src/pages/`
- 通用组件放在 `src/components/`
- mock 数据放在 `src/data/`
- 全局视觉样式放在 `src/styles/`
