# 企业级AI平台营销落地页

> High-Performance Landing Page for Enterprise AI Platform

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)]()

---

## 🎯 项目概述

专为 AI 服务类企业打造的高转化营销落地页系统。聚焦 **3 秒首屏吸引力**、**高质量线索收集** 与 **品牌信任感建立**，实现营销转化全链路闭环。

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────┐
│                     用户浏览器                        │
│  ┌─────────────────────────────────────────────┐    │
│  │          HTML5 + CSS3 + Vanilla JS           │    │
│  │              单文件 ~50KB 首屏                │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │   Google Sheets   │
              │   / Airtable      │
              │   (表单数据接入)   │
              └──────────────────┘
```

---

## 📦 功能模块

| 模块 | 功能描述 |
|------|---------|
| **NavBar** | 固定顶部导航，Logo + 锚点跳转 + CTA 按钮 |
| **Hero** | 首屏主视觉，主标题 + 副标题 + 转化按钮 |
| **Features** | 三大核心卖点卡片（多模态生成 / 企业安全 / 私有化部署） |
| **How It Works** | 产品运作流程可视化（输入 → 处理 → 输出） |
| **Security** | 安全资质展示（等保三级 / ISO 27001 / 架构图） |
| **Cases** | 客户案例展示（2 个真实场景） |
| **Pricing** | 双套餐方案（SaaS 版 / 企业版） |
| **Lead Form** | 完整线索收集表单，含隐私声明 |

---

## ⚡ 技术亮点

### 极致性能
- **零依赖框架**：纯 HTML + CSS + Vanilla JS，无任何外部库
- **首屏加载 < 50KB**：HTML 23.8KB + CSS 18.5KB + JS 7.3KB
- **零外部图片**：所有视觉元素使用 CSS / SVG 内联
- **首屏加载 ≤ 3 秒**：真机测试通过

### 响应式设计
- **三断点适配**：Mobile < 768px / Tablet 768-1024px / Desktop > 1024px
- **全设备覆盖**：主流手机、平板、桌面浏览器测试通过

### 表单安全
- **实时校验**：blur 事件触发 + 提交前全字段校验
- **企业邮箱检测**：拒绝免费邮箱（QQ/163/Gmail 等），只收企业邮箱
- **防重复提交**：提交时按钮置灰，localStorage 标记拦截
- **防恶意注入**：输入内容转义处理

### SEO 优化
- **语义化标签**：全站使用 nav / main / section / article / header / footer
- **Meta 完整**：title / description / keywords / Open Graph
- **可访问性**：所有图片含 alt 属性，按钮含 aria-label

---

## 📁 目录结构

```
landing-page/
├── index.html          # 主页面（单文件，包含所有区块）
├── css/
│   └── styles.css      # 样式表
├── js/
│   ├── main.js         # 核心交互逻辑
│   ├── form-handler.js # 表单处理与校验
│   └── data-service.js # 数据服务层
└── assets/
    └── images/         # 图片资源（预留）
```

---

## 🚀 快速开始

```bash
# 直接用浏览器打开
open index.html

# 或使用任意静态服务器
npx serve .
python -m http.server 8080
```

---

## 🔌 后端对接

当前为**模拟提交模式**，生产环境替换 `js/form-handler.js` 中的 `submitForm` 方法即可：

```javascript
// 替换这行
// console.log('Form submitted:', formData);

// 改为
const response = await fetch('YOUR_API_ENDPOINT', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

---

## 📐 设计规范

| 属性 | 值 |
|------|-----|
| 主色调 | `#0072f5` |
| 强调色 | `#10b981` |
| 主文字 | `#171717` |
| 辅助文字 | `#4d4d4d` |
| 背景色 | `#ffffff` |
| 圆角 | `6px` / `8px` |
| 最大宽度 | `1200px` |
| 基准间距 | `8px` |

---

## 👤 作者

**yiye** · [GitHub](https://github.com/yiye237605)

---

## 📄 License

MIT License · 欢迎 Star ⭐
