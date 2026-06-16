# 海底世界探索 - 3D 海洋体验

一个基于 Three.js 和 React Three Fiber 的沉浸式 3D 海底世界探索项目。

## 功能特性

- **3D 海底场景**: 包含珊瑚礁、水草、沉船、海底遗迹、巨岩等丰富环境元素
- **海洋生物**: 小丑鱼、蓝唐王鱼、鲸鲨、灰鲭鲨、绿海龟、玳瑁、月亮水母、桃花水母、狮鬃水母、蝠鲼、宽吻海豚、中华白海豚等 18 种海洋生物
- **自由探索**: WASD/方向键控制前进后退，鼠标控制视角方向，Space 上浮，Shift 下潜
- **深度效果**: 随着深度增加，光线逐渐变暗，雾气浓度变化，模拟真实水下光线衰减
- **信息卡片**: 靠近海洋生物自动弹出信息卡片，显示物种名称、体型、生活习性和保护等级
- **物体查看**: 点击沉船、珊瑚礁、海底遗迹等特殊物体查看详细介绍
- **深度计 HUD**: 右上角实时显示当前深度和 3D 坐标位置
- **自动巡航**: 开启自动巡航模式，沿预设路线浏览海底世界，可随时切回自由探索
- **气泡粒子**: 海底气泡向上漂浮的粒子效果
- **光线束**: 从海面射入的动态光束效果

## 技术栈

- **Vite** - 快速构建工具
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **@react-three/fiber** - React 的 Three.js 渲染器
- **@react-three/drei** - Three.js 实用组件库
- **Three.js** - 3D 图形库

## 操作说明

| 操作 | 说明 |
|------|------|
| W / ↑ | 向前移动 |
| S / ↓ | 向后移动 |
| A / ← | 向左移动 |
| D / → | 向右移动 |
| Space | 上浮 |
| Shift | 下潜 |
| 鼠标移动 | 控制视角方向 |
| 鼠标左键 | 点击画布进入指针锁定模式 |
| 自动巡航按钮 | 开启/关闭巡航模式 |

## 安装运行

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:3000

## 项目结构

```
├── index.html                  # 入口 HTML（含所有样式）
├── package.json               # 依赖配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
└── src/
    ├── main.tsx               # React 入口
    ├── App.tsx                # 主应用组件
    ├── vite-env.d.ts          # Vite 类型声明
    ├── data/
    │   └── creatures.ts       # 生物数据、环境物体数据、巡航路线
    └── components/
        ├── OceanScene.tsx     # 主 3D 场景、相机控制、灯光系统
        ├── Fish.tsx           # 小型鱼类组件
        ├── Shark.tsx          # 鲨鱼组件
        ├── Turtle.tsx         # 海龟组件
        ├── Jellyfish.tsx      # 水母组件
        ├── Ray.tsx            # 蝠鲼组件
        ├── Dolphin.tsx        # 海豚组件
        ├── CoralGroup.tsx     # 珊瑚礁组件
        ├── Shipwreck.tsx      # 沉船组件
        ├── Rock.tsx           # 海底岩石组件
        ├── Ruins.tsx          # 海底遗迹组件
        ├── SeaFloor.tsx       # 海底地面
        ├── Seaweed.tsx        # 水草组件
        ├── Bubbles.tsx        # 气泡粒子系统
        ├── LightRays.tsx      # 水中光线效果
        ├── HUD.tsx            # 深度计和坐标显示
        ├── InfoCard.tsx       # 信息卡片弹窗
        └── ControlsHint.tsx   # 操作提示
```

## 生物信息

所有海洋生物均包含详细的科普信息，涵盖物种名称、体型数据、栖息环境、饮食习惯、行为特征和 IUCN 保护等级（无危、近危、易危、濒危、极危）。
