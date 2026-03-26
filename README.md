# 重力球 IO (Gravity Ball IO)

一个霓虹科幻风格的网页游戏，使用React + Canvas + TypeScript构建。

## 🎮 游戏特色

- **霓虹科幻视觉风格**：发光效果、粒子系统、星空背景
- **AI对战系统**：3个难度级别，智能AI对手
- **技能系统**：
  - ⚡ 加速冲刺（Q键）- 消耗10%质量
  - 🌊 引力波减速（E键）- 消耗20%质量
  - 💫 分裂身体（W键）- 消耗50%质量
- **本地排行榜**：保存最佳成绩
- **响应式设计**：支持桌面和移动端
- **声音系统**：音效和背景音乐（需添加音频文件）

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

游戏将在 http://localhost:5173 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 🎯 如何游玩

### 桌面端

- **移动**：鼠标移动控制方向
- **技能**：
  - Q键：加速冲刺
  - W键：分裂身体
  - E键：引力波减速

### 移动端

- **移动**：触摸屏幕任意位置
- **技能**：使用屏幕底部的技能按钮

### 游戏目标

1. 吞噬小球（能量球）增大质量
2. 避开比你大的AI对手
3. 追击比你小的对手
4. 使用技能逃脱或追击
5. 存活越久，分数越高！

## 🛠️ 技术栈

- **框架**：React 18 + Vite
- **语言**：TypeScript
- **渲染**：Canvas 2D API
- **样式**：Tailwind CSS
- **音频**：Howler.js
- **状态**：React hooks + 自定义游戏引擎

## 📁 项目结构

```
src/
├── core/           # 游戏核心引擎
│   └── GameEngine.ts
├── components/     # React UI组件
│   ├── GameCanvas.tsx
│   ├── Menu.tsx
│   ├── HUD.tsx
│   ├── GameOver.tsx
│   └── MobileControls.tsx
├── hooks/         # React Hooks
│   └── useGame.ts
├── utils/         # 工具函数
│   ├── Leaderboard.ts
│   └── SoundManager.ts
├── types/         # TypeScript类型定义
│   └── game.ts
└── App.tsx        # 主应用
```

## 🔊 添加音频文件

将以下音频文件放置在 `public/sounds/` 目录：

- `eat.mp3` - 吞噬音效
- `skill.mp3` - 技能音效
- `death.mp3` - 死亡音效
- `bgm.mp3` - 背景音乐

详见 `public/sounds/README.md`

## 📱 部署

### Vercel

```bash
npm install -g vercel
vercel
```

### GitHub Pages

1. 构建：`npm run build`
2. 将 `dist` 目录推送到 `gh-pages` 分支

### Netlify

1. 连接GitHub仓库
2. 构建命令：`npm run build`
3. 发布目录：`dist`

## 🎮 游戏机制

### 质量系统

- 质量决定球体大小
- 质量越大，移动越慢
- 大球吃小球（需大20%以上）

### 技能冷却

- 加速冲刺：5秒
- 分裂身体：10秒
- 引力波：8秒

### AI行为

- **简单**：5个AI，反应慢，不用技能
- **中等**：10个AI，正常反应，偶尔用技能
- **困难**：15个AI，快速反应，积极用技能

## 🔧 开发路线图

- [x] 核心游戏引擎
- [x] 基础AI系统
- [x] 霓虹视觉效果
- [x] 本地排行榜
- [x] 移动端支持
- [x] 声音系统框架
- [ ] 高级AI行为（预测、协作）
- [ ] 更多技能
- [ ] 道具系统
- [ ] 成就系统
- [ ] 多人在线模式

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

享受游戏！🎮✨
