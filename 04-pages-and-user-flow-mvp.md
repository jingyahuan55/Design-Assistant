# 04 Pages and User Flow MVP

## 页面范围

1. `Landing`
2. `Workspace`
3. `Result`

如果时间允许，可补：
4. `History`

## 用户主路径

```text
Landing
-> Workspace
-> Submit
-> Analyze
-> Result
```

## 1. Landing

### 页面目标

让用户快速理解产品价值，并开始一次分析。

### 模块建议

1. Hero 标题
2. 一句话价值主张
3. 支持的输入方式说明
4. 结果页预览缩略图
5. 主按钮：开始分析

### 页面文案重点

强调：
- 支持主题输入
- 支持图片输入
- 输出可落地的视觉建议
- 生成可复制 Tokens

## 2. Workspace

### 页面目标

收集最少输入并触发分析。

### 模块建议

1. 任务标题输入
2. 主题描述输入
3. 风格关键词输入
4. 目标气质输入
5. 单图上传区
6. 提交按钮

### 字段优先级

#### 必填

1. `theme_text`

#### 选填

1. `title`
2. `description_text`
3. `style_keywords`
4. `tone_keywords`
5. `image_asset`

### 体验建议

1. 表单不要太长
2. 给用户一个示例主题
3. 上传后显示图片预览
4. 提交按钮文案可用：`生成设计语言`

## 3. Result

### 页面目标

用一页展示结构化结果。

### 模块建议

#### A. Top Summary

包含：
1. 任务标题
2. 主题摘要
3. 一句话视觉策略

#### B. Moodboard

包含：
1. 视觉关键词
2. 风格标签
3. 图标方向
4. 纹理方向

建议表现：
使用卡片或类瀑布流，而不是纯文本列表。

#### C. Color System

包含：
1. 主色
2. 辅色
3. 强调色
4. 背景色
5. 文本色
6. 各颜色使用说明

#### D. Image Adaptation

如果有图片则展示：
1. 原图
2. 提取色板
3. 遮罩建议
4. 图片上文字建议
5. 描边颜色建议
6. 适合叠字区域
7. 风险区域

#### E. Accessibility

包含：
1. 对比度提醒
2. 图片叠字可读性提醒
3. 状态表达提醒

#### F. Export Snippets

包含：
1. CSS Variables
2. Tailwind 片段
3. 复制按钮

## MVP 结果页优先级

### P0

1. Summary
2. Color System
3. Image Adaptation
4. Export Snippets

### P1

1. Moodboard 视觉增强
2. Accessibility 细化

## 当天不建议做的页面复杂度

1. 多标签页结果布局
2. 复杂动效
3. 侧边面板历史管理
4. 多版本对比

