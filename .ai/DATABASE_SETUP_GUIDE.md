# 数据模型创建指南

## 概述

本指南详细说明了AI助手应用中使用的所有数据模型，包括表结构、字段说明和创建步骤。

## 数据模型列表

1. **AIConfig** - AI配置表
2. **Skill** - 技能表
3. **Rule** - 规则表
4. **Message** - 消息表
5. **ai_multimodal_inputs** - 多模态输入记录表

## 1. AIConfig 表

### 用途
存储AI Agent的配置信息，包括使用的模型、启用的技能、规则等。

### 字段结构

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | String | 是 | 主键 |
| name | String | 是 | Agent名称 |
| description | String | 否 | Agent描述 |
| model | String | 是 | 使用的AI模型 |
| skills | Array | 否 | 启用的技能ID列表 |
| rules | Array | 否 | 启用的规则ID列表 |
| ragEnabled | Boolean | 否 | 是否启用RAG检索 |
| ragSources | Array | 否 | RAG数据源列表 |
| mcpServers | Array | 否 | MCP服务器列表 |
| enabled | Boolean | 是 | 是否启用 |
| usageCount | Number | 否 | 使用次数 |
| createdAt | String | 是 | 创建时间 |
| updatedAt | String | 是 | 更新时间 |

### 创建步骤

1. 在云开发控制台创建集合 `AIConfig`
2. 设置字段类型和默认值
3. 配置权限规则
4. 创建索引（可选）

### 权限设置

- 读取：所有用户可读
- 创建：仅管理员可创建
- 更新：仅管理员可更新
- 删除：仅管理员可删除

## 2. Skill 表

### 用途
存储AI Agent可用的技能信息。

### 字段结构

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | String | 是 | 主键 |
| name | String | 是 | 技能名称 |
| description | String | 否 | 技能描述 |
| type | String | 是 | 技能类型 |
| config | Object | 否 | 技能配置 |
| enabled | Boolean | 是 | 是否启用 |
| createdAt | String | 是 | 创建时间 |

### 创建步骤

1. 在云开发控制台创建集合 `Skill`
2. 设置字段类型和默认值
3. 配置权限规则

## 3. Rule 表

### 用途
存储AI Agent的规则信息。

### 字段结构

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | String | 是 | 主键 |
| name | String | 是 | 规则名称 |
| description | String | 否 | 规则描述 |
| type | String | 是 | 规则类型 |
| config | Object | 否 | 规则配置 |
| enabled | Boolean | 是 | 是否启用 |
| createdAt | String | 是 | 创建时间 |

### 创建步骤

1. 在云开发控制台创建集合 `Rule`
2. 设置字段类型和默认值
3. 配置权限规则

## 4. Message 表

### 用途
存储用户与AI助手的对话消息。

### 字段结构

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | String | 是 | 主键 |
| conversationId | String | 是 | 对话ID |
| role | String | 是 | 角色（user/assistant） |
| content | String | 是 | 消息内容 |
| images | Array | 否 | 图片列表 |
| files | Array | 否 | 文件列表 |
| model | String | 否 | 使用的模型 |
| tokens | Number | 否 | Token使用量 |
| cost | Number | 否 | 成本 |
| duration | Number | 否 | 处理时长（毫秒） |
| status | String | 是 | 状态 |
| createdAt | String | 是 | 创建时间 |

### 创建步骤

1. 在云开发控制台创建集合 `Message`
2. 设置字段类型和默认值
3. 配置权限规则
4. 创建索引（conversationId, createdAt）

## 5. ai_multimodal_inputs 表

### 用途
存储多模态输入记录，包括文本、图片、文档、语音等。

### 字段结构

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | String | 是 | 主键 |
| conversationId | String | 是 | 关联的对话ID |
| messageId | String | 是 | 关联的消息ID |
| inputType | String | 是 | 输入类型（text/image/document/voice） |
| fileInfo | Object | 否 | 文件信息 |
| content | String | 否 | 文本内容 |
| voiceDuration | Number | 否 | 语音时长（秒） |
| status | String | 是 | 处理状态 |
| analysisResult | Object | 否 | 分析结果 |
| createdAt | String | 是 | 创建时间 |

### 创建步骤

1. 在云开发控制台创建集合 `ai_multimodal_inputs`
2. 设置字段类型和默认值
3. 配置权限规则
4. 创建索引（conversationId, messageId, inputType）

### 权限设置

- 读取：所有用户可读
- 创建：所有用户可创建
- 更新：仅管理员可更新
- 删除：仅管理员可删除

## 索引创建建议

### AIConfig 表
```javascript
// 按启用状态和使用次数排序
db.collection('AIConfig').createIndex({ enabled: 1, usageCount: -1 })
```

### Message 表
```javascript
// 按对话ID和时间排序
db.collection('Message').createIndex({ conversationId: 1, createdAt: 1 })
```

### ai_multimodal_inputs 表
```javascript
// 按对话ID和输入类型排序
db.collection('ai_multimodal_inputs').createIndex({ conversationId: 1, inputType: 1 })
```

## 常见问题

### Q: 如何创建数据表？

A: 请按照以下步骤操作：
1. 登录云开发控制台
2. 进入"数据库"页面
3. 点击"新建集合"
4. 输入集合名称
5. 添加字段并设置类型
6. 配置权限规则
7. 点击"确定"创建

### Q: 如何导入示例数据？

A: 可以通过以下方式导入：
1. 在控制台选择集合
2. 点击"导入数据"
3. 选择JSON文件
4. 点击"确定"导入

### Q: 如何修改字段类型？

A: 注意事项：
1. 修改字段类型可能会影响现有数据
2. 建议先备份数据
3. 某些类型转换可能需要手动处理

## 总结

按照本指南创建所有数据表后，AI助手应用就可以正常使用了。如果遇到问题，请检查：
1. 表名是否正确
2. 字段类型是否匹配
3. 权限设置是否正确
4. 索引是否创建
