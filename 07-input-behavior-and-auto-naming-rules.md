# 07 Input Behavior and Auto Naming Rules

## 文档目标

这份文档用于明确 Workspace 输入区的交互规则，解决以下问题：

1. 用户不填任务名称时，系统如何自动命名
2. 输入框中的示例文本应作为占位词，而不是默认真实值
3. 用户只上传图片、不填任何文字时，系统如何进入图片驱动分析模式
4. Demo preset、占位词、真实输入三者之间的边界如何区分

这份规则文档优先服务于 MVP 阶段的表单交互、任务创建接口和结果页命名逻辑。

---

## 1. 总体输入原则

### 1.1 最低提交门槛

用户至少满足以下条件之一，才允许提交分析：

1. 填写了任意文本输入
2. 上传了一张图片

如果文本和图片都为空，则：

1. 不触发分析请求
2. 在表单底部展示明确提示
3. 提示文案建议为：`请至少输入一个主题，或上传一张参考图片。`

### 1.2 实际输入与视觉提示分离

所有输入框中的示例内容默认都应是 placeholder，而不是字段真实值。

这意味着：

1. 页面初始进入时，文本字段值应为空字符串
2. 灰色示例文案仅用于提示用户如何填写
3. placeholder 不应进入提交 payload
4. placeholder 不应参与自动命名
5. placeholder 不应被后端当作真实输入分析

---

## 2. 字段级规则

## 2.1 Task Name / 任务名称

### 规则定位

任务名称应改为：`可选字段`

建议标签文案：
`Task name (optional)`
或中文版本：
`任务名称（可选）`

### 提交规则

1. 如果用户填写了任务名称，则优先使用用户输入值
2. 如果用户没有填写任务名称，则由系统自动生成任务名称

### 自动命名原则

系统自动命名时，遵循以下优先级：

#### A. 文本主导命名
当用户填写了 `theme_text` 时：

命名优先取：
1. `theme_text` 的核心短语
2. 如果有风格词或项目语义，可补一个轻量后缀

命名格式建议：
1. `Singapore Hawker Direction`
2. `Inclusive Care System`
3. `Night Transit Board`
4. `Community Health Visual Study`

规则要求：
1. 名称长度尽量控制在 2 到 5 个词
2. 不直接整段复制 description
3. 不把 style keywords 全部堆进标题
4. 标题应偏“任务名”而不是“完整说明句”

#### B. 图片主导命名
当没有任何文字输入、只有图片时：

系统进入图片驱动命名模式。

命名建议格式：
1. `Image-led Color Study`
2. `Reference Image Direction`
3. `Image Moodboard Draft`
4. `Visual Adaptation Study`

如果后续希望增强，也可以基于文件名做轻量辅助，但 MVP 阶段不建议直接使用原始文件名作为最终标题，因为通常不美观，也不稳定。

#### C. 冲突与重复命名
如果后面需要历史记录去重，可在同名任务后追加时间或序号，例如：

1. `Singapore Hawker Direction 01`
2. `Image-led Color Study 02`

MVP 阶段如果没有历史页强约束，可以暂不处理重名。

### 数据层建议

任务数据建议新增一个标记字段：

1. `isAutoNamed: boolean`

作用：
1. 方便结果页识别当前标题是否由系统生成
2. 方便历史记录页后续展示“自动命名任务”
3. 方便后续加“重命名任务”能力

---

## 2.2 Theme / 主题输入

### 字段定位

这是文本分析最重要的语义输入，但不再是唯一必填项。

### placeholder 行为

示例 placeholder：
1. `例如：Singapore hawker culture`
2. `例如：Inclusive community care service`
3. `例如：Urban night transit information system`

交互规则：
1. 页面初始显示为灰色 placeholder
2. 用户点击输入框进入编辑态时，placeholder 可保留为浏览器默认行为，或在 focus 时淡出
3. 一旦用户输入真实内容，placeholder 自动消失
4. 如果用户删空输入框，则 placeholder 再次出现

### 提交规则

1. 若用户未输入，则 `theme_text` 传空值
2. 空值不参与分析
3. 若同时上传图片，则系统仍允许提交，进入“仅图片模式”或“图片主导模式”

---

## 2.3 Project Context / 项目描述

### 字段定位

这是补充语义，不是必须输入。

### placeholder 行为

示例 placeholder：
`例如：A polished community-first food discovery experience with warmth, modular cards, and city texture.`

规则：
1. 仅作为灰色提示显示
2. 不自动写入 textarea 的 value
3. 如果用户没有输入，提交时应为空
4. 不允许 placeholder 文案误发送到后端

---

## 2.4 Style Keywords / Tone Keywords

### 字段定位

这是可选增强项，用于帮助系统更快锁定设计方向。

### placeholder 行为

示例 placeholder：
1. `例如：warm, urban, friendly`
2. `例如：accessible, supportive`

规则：
1. 初始为空
2. placeholder 为灰色提示
3. 不作为默认值参与提交
4. 用户只输入部分词时，仅提交真实输入部分

---

## 2.5 Reference Image / 参考图片

### 字段定位

图片应升级为可以单独触发分析的核心输入，而不是只能作为文字输入的附属项。

### 提交规则

1. 用户只上传图片，也允许提交
2. 用户上传图片 + 文字，也允许提交
3. 用户只输入文字，也允许提交
4. 用户文字和图片都没有，禁止提交

---

## 3. 输入模式判定规则

系统应根据真实输入内容，而不是根据表单初始状态判定 input mode。

## 3.1 Text Mode

满足条件：
1. 有文字输入
2. 没有图片上传

输出重点：
1. 主题摘要
2. 设计语言方向
3. 配色建议
4. 图标与纹理建议
5. token 输出

## 3.2 Mixed Mode

满足条件：
1. 有文字输入
2. 有图片上传

输出重点：
1. 主题方向
2. 图片适配建议
3. 配色系统
4. overlay 与 readability 建议
5. token 输出

## 3.3 Image-only Mode

满足条件：
1. 没有任何文字输入
2. 上传了图片

输出重点：
1. 图片主色提取
2. 图片氛围判断
3. 配色发散建议
4. overlay 建议
5. 文字叠加建议
6. 适合的组件气质建议
7. 基础 token 输出

注意：

在 Image-only Mode 下：
1. 所有 placeholder 都视为无效提示，不参与请求
2. 后端不能因为空的 theme_text 而报错
3. 分析逻辑应自动切换到“图片主导规则”
4. 自动命名也应切换到图片主导命名规则

---

## 4. Placeholder 与 Demo Preset 的区别

这是当前交互里必须明确区分的一点。

## 4.1 Placeholder

placeholder 的性质是：
1. 灰色示例提示
2. 不属于真实输入
3. 不会进入 payload
4. 不会用于自动命名
5. 不会参与分析

## 4.2 Demo Preset

preset 的性质是：
1. 用户主动点击后才会生效
2. 生效后会把内容真实写入字段
3. 写入后的内容属于真实输入
4. 会参与分析
5. 会参与自动命名（如果 title 为空）

### 设计建议

为了避免混淆：
1. 默认打开 Workspace 时，表单应为空，不自动填入 preset
2. Demo preset 应作为右侧“快捷示例入口”存在
3. 用户点击 preset 后，才将相应内容写入表单
4. 最好增加一个 `Clear form` 或 `Reset` 按钮，恢复为空白输入状态

---

## 5. 前端交互规则

## 5.1 初始状态

页面初始进入时：
1. `title = ""`
2. `theme_text = ""`
3. `description_text = ""`
4. `style_keywords = ""`
5. `tone_keywords = ""`
6. `file = null`
7. 所有示例文案通过 placeholder 展示

## 5.2 Focus 状态

用户点击输入框时：
1. 输入框进入 focus 样式
2. placeholder 保持提示属性即可，不作为真实内容
3. 如果需要更强视觉体验，可在 focus 时降低 placeholder opacity

## 5.3 Filled 状态

用户输入内容后：
1. 显示真实输入值
2. placeholder 消失
3. 提交时仅发送真实值

## 5.4 Empty Reset 状态

如果用户把内容删空：
1. 字段恢复为空字符串
2. placeholder 再次显示
3. 提交时该字段为空，不参与分析

---

## 6. 后端提交与清洗规则

## 6.1 发送前清洗

前端在发送 payload 前应做 trim 和空值清洗。

规则：
1. 去掉首尾空格
2. 仅发送真实输入值
3. 空字符串按空值处理
4. placeholder 文案永远不进入 payload

## 6.2 创建任务接口规则

`POST /api/tasks` 需要从“必须有 theme_text”改为：

至少满足一项：
1. 有任意文本输入
2. 有图片上传意图

更稳的实现方式建议是：
1. 任务先允许创建为空文本任务
2. 在最终 analyze 前再统一检查：是否文本和图片都为空

## 6.3 Analyze 接口规则

`POST /api/tasks/:taskId/analyze` 应改为：

### 允许分析的条件
1. 有文字输入
2. 或有图片 asset

### 禁止分析的条件
1. 没有文字输入
2. 且没有图片 asset

错误文案建议：
`This task has no text input or image asset to analyze.`

---

## 7. 结果生成规则补充

## 7.1 文本驱动结果

当存在 `theme_text` 时：
1. summary 主要围绕主题生成
2. moodboard 以语义方向为主
3. 图片建议作为补充

## 7.2 图片驱动结果

当只有图片时：
1. summary 应说明这是 image-led analysis
2. 结果重点放在 palette、overlay、text-on-image、style spread
3. 视觉策略应更多基于图片氛围，而不是虚构主题

建议 summary 文案风格：
1. `This image suggests a warm editorial direction with strong card contrast and soft overlays.`
2. `This reference image supports a calm service palette with restrained surfaces and readable text layering.`

---

## 8. MVP 实现优先级

## P0 必做

1. 去掉默认真实填充值，改成 placeholder
2. `title` 改为可选
3. 增加自动命名逻辑
4. 支持 image-only 提交
5. 分析接口改为“文字或图片至少其一”
6. placeholder 不进入 payload

## P1 建议做

1. `isAutoNamed` 标记
2. `Clear form` 按钮
3. 更精细的 image-only summary 文案
4. focus 时 placeholder 视觉优化

## P2 后续增强

1. 基于文件名做更智能的图片任务命名
2. 历史记录中的自动命名重命名能力
3. image-only 模式下更强的视觉语义识别

---

## 9. 推荐实施顺序

1. 先改 Workspace 表单初始状态
2. 再改 placeholder 与 preset 逻辑
3. 再改自动命名逻辑
4. 再改 task / analyze 接口校验
5. 最后调整 result 文案，让 image-only 模式输出更自然

---

## 10. 一句话结论

Workspace 的输入系统应从“带预填内容的 demo 表单”升级为“默认空白、支持 placeholder 提示、支持自动命名、支持仅图片分析的真实输入工作台”。
