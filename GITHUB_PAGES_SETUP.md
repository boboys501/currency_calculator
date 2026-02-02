# GitHub Pages 發佈指南

## 項目結構

本項目已配置為 GitHub Pages 發佈格式：

```
currency_calculator/
├── docs/                 # GitHub Pages 發佈目錄（自動生成）
│   ├── index.html        # 主頁面
│   ├── 404.html          # SPA 路由回退
│   ├── .nojekyll         # 禁用 Jekyll 處理
│   └── assets/           # CSS 和 JS 資源
├── client/               # 源代碼
├── index.html            # 開發用入口
├── vite.config.ts        # Vite 配置
└── package.json
```

## 發佈步驟

### 1. 構建項目

```bash
pnpm build
```

這會生成 `docs/` 目錄，包含所有發佈所需的文件。

### 2. 推送到 GitHub

```bash
git add .
git commit -m "Build for GitHub Pages"
git push origin main
```

### 3. 配置 GitHub Pages

在 GitHub 倉庫設置中：

1. 進入 **Settings** → **Pages**
2. 選擇 **Source** 為 `main` 分支
3. 選擇 **Folder** 為 `/docs`
4. 點擊 **Save**

GitHub 會自動部署 `docs/` 目錄中的內容。

## 關鍵文件說明

- **docs/index.html** - 主入口頁面
- **docs/404.html** - SPA 路由回退（確保所有路由都返回 index.html）
- **docs/.nojekyll** - 告訴 GitHub Pages 不要使用 Jekyll 處理

## 環境變量

如果倉庫不在根域名，需要設置基礎路徑：

```bash
# 例如：https://username.github.io/currency_calculator/
VITE_BASE_PATH=/currency_calculator/ pnpm build
```

## 驗證部署

1. 訪問 `https://username.github.io/currency_calculator/`
2. 確保所有資源正確加載
3. 測試所有功能是否正常

## 常見問題

**Q: 資源 404 錯誤？**
A: 檢查 GitHub Pages 設置中是否選擇了正確的分支和文件夾。

**Q: 頁面加載但功能不工作？**
A: 檢查瀏覽器控制台是否有錯誤，確保 `docs/.nojekyll` 存在。

**Q: 如何更新內容？**
A: 修改源代碼後運行 `pnpm build`，然後提交並推送到 GitHub。
