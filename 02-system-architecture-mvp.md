# 02 System Architecture MVP

## 核心架构原则

1. `Task-Centric`
   所有动作围绕分析任务展开。
2. `Structured Output First`
   不返回松散文本，优先返回结构化结果。
3. `AI Proposes, Rules Refine`
   AI 负责提出语义和视觉方向，规则负责做最小校验和修正。
4. `Web First`
   当天只做网页，不做 Figma 插件。

## 当天的最小模块划分

### 1. Web Client

职责：
1. 收集文字输入
2. 支持上传单张图片
3. 提交分析请求
4. 展示结构化结果
5. 提供 Token 复制入口

### 2. Task API

职责：
1. 创建任务
2. 接收上传内容
3. 触发分析
4. 返回结果

### 3. AI Analysis Layer

职责：
1. 理解主题文字
2. 理解图片内容和氛围
3. 输出设计语言建议
4. 输出固定结构 JSON

### 4. Rule Layer

职责：
1. 读取图片调色板
2. 做基础对比度判断
3. 补充图片叠字可读性提示
4. 生成基础 CSS Variables

说明：
当天不追求完整规则引擎，只做最必要的计算和修正。

### 5. Persistence

职责：
1. 保存任务输入
2. 保存图片地址
3. 保存最终结果

说明：
如果当天时间非常紧，可以先只保存最少数据；如果更紧，可以先不做数据库，先以内存或本地 JSON 方式跑通原型，但推荐至少保留数据库接口抽象。

## 请求链路

```text
User
-> Workspace Form
-> POST /api/tasks
-> POST /api/tasks/:taskId/assets
-> POST /api/tasks/:taskId/analyze
-> AI Analysis Layer
-> Rule Layer
-> Structured Result
-> Result Page
```

## 当天建议的 AI 工作流

### Step 1: Input Understanding

输入：
1. theme_text
2. description_text
3. style_keywords
4. image_url

输出：
1. 主题摘要
2. 风格关键词
3. 图片氛围判断

### Step 2: Design Language Proposal

输出：
1. 配色建议
2. 图标风格建议
3. 图片适配建议
4. 组件气质建议

### Step 3: Rules Refine

输出：
1. 基础调色板
2. 对比度提醒
3. 图片叠字风险提醒
4. CSS Variables
5. Tailwind 片段

## 当天建议的结果渲染模块

1. `SummaryCard`
2. `MoodboardCard`
3. `ColorSystemCard`
4. `ImageAdaptationCard`
5. `AccessibilityCard`
6. `ExportSnippetsCard`

## 当天不建议引入的复杂度

1. 消息队列
2. 多阶段异步 worker
3. 复杂缓存
4. 多模型编排
5. 精细权限系统

