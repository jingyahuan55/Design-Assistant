# 03 Data Model and API MVP

## 数据模型策略

1 天 MVP 优先保证开发速度和可演示性，所以数据库结构应尽量少、边界清晰。

建议最少保留 4 张核心表：
1. `tasks`
2. `task_inputs`
3. `assets`
4. `analysis_results`

如时间允许，再补：
5. `task_runs`
6. `task_refinements`

## 表结构草案

### tasks

用途：
记录一次分析任务。

字段建议：
- `id`
- `title`
- `status`
- `input_mode`
- `created_at`
- `updated_at`

状态建议：
- `draft`
- `processing`
- `completed`
- `failed`

### task_inputs

用途：
记录任务输入文本。

字段建议：
- `id`
- `task_id`
- `theme_text`
- `description_text`
- `style_keywords`
- `tone_keywords`
- `raw_prompt`
- `created_at`

### assets

用途：
记录上传图片及基础分析信息。

字段建议：
- `id`
- `task_id`
- `type`
- `url`
- `mime_type`
- `width`
- `height`
- `file_size`
- `palette`
- `subject_meta_json`
- `created_at`

说明：
- `palette` 用于快速展示色板
- `subject_meta_json` 用于记录主体与安全叠字区域信息

### analysis_results

用途：
保存结构化结果。

字段建议：
- `id`
- `task_id`
- `version`
- `summary_json`
- `moodboard_json`
- `color_system_json`
- `image_adaptation_json`
- `accessibility_json`
- `export_snippets_json`
- `raw_model_output_json`
- `created_at`

## 结构化结果建议

```json
{
  "summary": {},
  "moodboard": {},
  "colorSystem": [],
  "imageAdaptation": {},
  "accessibility": {},
  "exportSnippets": {}
}
```

## ColorSystem 建议结构

```json
[
  {
    "label": "Primary",
    "token_name": "--color-primary",
    "hex": "#F97316",
    "role": "primary",
    "usage_guidelines": "用于主按钮和品牌强调"
  }
]
```

## API 清单

### POST /api/tasks

作用：
创建任务。

请求体建议：
```json
{
  "title": "Singapore Hawker App",
  "input_mode": "mixed",
  "theme_text": "新加坡食阁",
  "description_text": "做一个社区导向的餐饮体验 demo",
  "style_keywords": ["warm", "urban", "friendly"],
  "tone_keywords": ["inclusive", "vibrant"]
}
```

返回建议：
```json
{
  "task_id": "task_123",
  "status": "draft"
}
```

### POST /api/tasks/:taskId/assets

作用：
上传图片。

返回建议：
```json
{
  "asset_id": "asset_123",
  "url": "/uploads/asset_123.png"
}
```

### POST /api/tasks/:taskId/analyze

作用：
触发分析并返回结构化结果。

说明：
1 天 MVP 可直接同步返回结果，降低轮询和状态管理复杂度。

返回建议：
```json
{
  "task_id": "task_123",
  "status": "completed",
  "result": {
    "summary": {},
    "moodboard": {},
    "colorSystem": [],
    "imageAdaptation": {},
    "accessibility": {},
    "exportSnippets": {}
  }
}
```

## 当天可预留但不一定实现的接口

1. `GET /api/tasks`
2. `GET /api/tasks/:taskId`
3. `POST /api/tasks/:taskId/refine`
4. `POST /api/tasks/:taskId/regenerate`

## 当天 API 设计建议

1. 保持接口少
2. 优先打通同步分析
3. 先固定返回结构，再优化内容质量
4. 优先保证前后端字段一致

