# Poise

Poise 是抖音工作台与小红书工作台的宣传站点。单页视觉叙事，由 Vite + Three.js + GSAP 构建。

## 本地开发

```bash
npm install
npm run dev
```

默认运行在 `http://127.0.0.1:5173`。

## 构建预览

```bash
npm run build
npm run preview
```

## 目录结构

- `index.html`：页面入口与元信息
- `src/main.js`：页面结构、章节切换、自定义光标与交互
- `src/blob-scene.js`：Three.js 点云场景与形变
- `src/data.js`：页面数据
- `src/styles.css`：样式、主题与响应式布局
- `public/assets`：字体与本地视觉素材

页面在标签页隐藏时暂停动画，并在系统开启「减少动态效果」时渲染静态场景。
