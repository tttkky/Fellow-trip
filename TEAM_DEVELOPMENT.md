# FellowTrip 团队协作开发文档

本文档给组员使用，说明如何克隆仓库、切换分支、拉取更新、提交代码、推送到 GitHub，以及如何在 GitHub 上合并。

## 1. 准备工作

本项目使用：

- React
- Vite
- Git / GitHub
- Node.js + npm

建议先确认本机环境：

```bash
node --version
npm --version
git --version
```

如果在 Windows PowerShell 中 `npm` 被执行策略拦截，可以把命令里的 `npm` 换成 `npm.cmd`。

## 2. 克隆仓库

推荐使用 SSH：

```bash
git clone git@github.com:tttkky/Fellow-trip.git
cd Fellow-trip
```

如果 SSH 还没配置好，可以先用 HTTPS：

```bash
git clone https://github.com/tttkky/Fellow-trip.git
cd Fellow-trip
```

第一次拉下来后安装依赖：

```bash
npm.cmd install
```

启动本地项目：

```bash
npm.cmd run dev
```

浏览器打开终端里显示的地址，通常是：

```text
http://localhost:5173
```

## 3. 分支说明

我们使用以下分支结构：

```text
main
develop
feature/auth-onboarding
feature/home-planning
feature/trip-companion
feature/safety-guard
feature/profile-memory
```

分支职责：

- `main`：最终稳定版，不直接开发。
- `develop`：团队集成分支，大家的功能最终先合并到这里。
- `feature/auth-onboarding`：登录、注册、首次搭子设置。
- `feature/home-planning`：旅途前规划、目的地推荐、攻略生成。
- `feature/trip-companion`：进入行程后的陪伴体验。
- `feature/safety-guard`：安全守护、SOS、联系人、偏航提醒。
- `feature/profile-memory`：我的页面、历史旅行、旅行回忆。

组员开发时不要直接在 `main` 上写代码。建议先从自己的 `feature/*` 分支开发。

## 4. 切换到自己的分支

先进入项目目录：

```bash
cd Fellow-trip
```

查看当前分支：

```bash
git branch
```

切换到自己的分支，例如负责安全守护：

```bash
git checkout feature/safety-guard
```

如果本地没有该分支，但远程有：

```bash
git fetch origin
git checkout -b feature/safety-guard origin/feature/safety-guard
```

## 5. 开发前先拉取最新代码

每天开始开发前，先更新 `develop`：

```bash
git checkout develop
git pull origin develop
```

再切回自己的功能分支：

```bash
git checkout feature/safety-guard
```

把最新 `develop` 合并进自己的分支：

```bash
git merge develop
```

如果出现冲突，不要慌。先打开冲突文件，保留正确代码，再执行：

```bash
git add .
git commit -m "Resolve merge conflicts with develop"
```

## 6. 开发和本地检查

启动项目：

```bash
npm.cmd run dev
```

开发完成后，先跑构建：

```bash
npm.cmd run build
```

构建通过后再提交。不要把报错代码推到 GitHub。

查看改了哪些文件：

```bash
git status
```

查看具体改动：

```bash
git diff
```

## 7. 提交代码

把改动加入暂存区：

```bash
git add .
```

提交：

```bash
git commit -m "完善安全守护页面"
```

提交信息建议写清楚做了什么，例如：

```text
完善登录注册流程
优化旅途前规划页面
新增安全守护联系人卡片
完善旅行回忆时间线
修复底部导航样式
```

## 8. 推送到 GitHub

第一次推送自己的分支：

```bash
git push -u origin feature/safety-guard
```

之后同一分支继续推送：

```bash
git push
```

如果你负责的不是安全分支，把分支名换成自己的：

```bash
git push -u origin feature/auth-onboarding
git push -u origin feature/home-planning
git push -u origin feature/trip-companion
git push -u origin feature/profile-memory
```

## 9. 在 GitHub 上发起合并请求

开发完成并 push 后，打开 GitHub 仓库：

```text
https://github.com/tttkky/Fellow-trip
```

操作步骤：

1. 点击 `Pull requests`
2. 点击 `New pull request`
3. base 分支选择 `develop`
4. compare 分支选择自己的 `feature/*` 分支
5. 填写标题和说明
6. 点击 `Create pull request`

PR 标题示例：

```text
完善安全守护页面
优化旅途前规划流程
新增我的页面历史旅行模块
```

PR 说明建议写：

```text
本次修改：
- 修改了哪些页面
- 新增了哪些交互
- 是否跑过 npm.cmd run build
- 是否有需要队友注意的地方
```

## 10. 在 GitHub 上合并

合并前检查：

- 页面能正常打开
- `npm.cmd run build` 通过
- 没有明显冲突
- 至少一个组员看过代码或页面效果

确认后：

1. 打开 Pull Request
2. 如果 GitHub 显示可以合并，点击 `Merge pull request`
3. 点击 `Confirm merge`
4. 合并后可以删除远程 feature 分支

注意：所有功能分支先合并到 `develop`，不要直接合并到 `main`。

## 11. develop 合并到 main

当阶段版本稳定、准备展示或提交时，再由负责人操作：

```bash
git checkout main
git pull origin main
git merge develop
npm.cmd run build
git push origin main
```

也可以在 GitHub 上开 PR：

```text
develop -> main
```

这一步建议只由项目负责人做。

## 12. 常见问题

### npm 在 PowerShell 里不能运行

使用：

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

### 不知道自己在哪个分支

```bash
git branch
```

带 `*` 的就是当前分支。

### 开发前忘了拉 develop

可以现在补：

```bash
git checkout develop
git pull origin develop
git checkout 自己的分支
git merge develop
```

### 不小心在 main 上改了代码

先不要提交，找负责人处理。一般可以新建分支把改动带过去：

```bash
git checkout -b feature/your-task
```

### 想重新体验第一次进入 App

项目用浏览器 `localStorage` 模拟用户记忆。打开浏览器开发者工具，清除：

```text
fellowTripPrototypeState
```

然后刷新页面，就会重新进入登录/注册和首次搭子设置流程。

## 13. 推荐工作流总结

每次开发前：

```bash
git checkout develop
git pull origin develop
git checkout 自己的feature分支
git merge develop
npm.cmd install
npm.cmd run dev
```

开发完成后：

```bash
npm.cmd run build
git status
git add .
git commit -m "说明本次修改"
git push
```

然后去 GitHub 创建 PR：

```text
自己的 feature 分支 -> develop
```
