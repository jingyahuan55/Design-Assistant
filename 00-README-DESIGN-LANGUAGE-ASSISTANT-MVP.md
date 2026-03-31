# Design Language Assistant MVP Docs

这组文档用于支持在 1 天内完成 `Design Language Assistant` 的 MVP 版本开发。

文档目标：
- 明确 1 天 MVP 的范围，避免过度开发
- 固定结果结构，先打通主链路
- 按开发顺序拆解页面、接口、数据和任务
- 保证当天结束时至少有一个可演示版本

建议阅读顺序：
1. [01-one-day-mvp-scope.md](/D:/VibeProjects/01-one-day-mvp-scope.md)
2. [02-system-architecture-mvp.md](/D:/VibeProjects/02-system-architecture-mvp.md)
3. [03-data-model-and-api-mvp.md](/D:/VibeProjects/03-data-model-and-api-mvp.md)
4. [04-pages-and-user-flow-mvp.md](/D:/VibeProjects/04-pages-and-user-flow-mvp.md)
5. [05-development-path-one-day.md](/D:/VibeProjects/05-development-path-one-day.md)
6. [06-build-checklist-and-demo.md](/D:/VibeProjects/06-build-checklist-and-demo.md)

1 天 MVP 的核心原则：
- 不做完整设计工具，只做最小可演示闭环
- 不追求复杂工作流，先追求输入到结果的端到端可用
- AI 负责提出建议，规则层只做最必要的校验
- 输出必须结构化，便于前端稳定渲染
- 页面数量尽量少，避免把时间花在外围系统

当天必须跑通的最小主链路：
1. 用户进入首页
2. 输入主题文字并可选上传一张图片
3. 提交分析任务
4. 后端返回结构化建议
5. 结果页展示主题摘要、配色、图片适配、可访问性提醒和 Token 导出

建议当天交付标准：
- 有一个可以访问的 Web 页面
- 支持文字输入
- 支持单张图片上传
- 能返回可展示的结构化结果
- 结果页有基础视觉层次
- 能复制 CSS Variables 或 Tailwind 片段

