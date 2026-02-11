# AI助手云函数

## 功能说明

该云函数提供AI助手相关的完整功能，包括：

### 1. 模型管理
- `getModels` - 获取模型列表
- `addModel` - 添加新模型
- `updateModel` - 更新模型配置
- `deleteModel` - 删除模型

### 2. 技能管理
- `getSkills` - 获取技能列表
- `addSkill` - 添加新技能
- `updateSkill` - 更新技能配置
- `deleteSkill` - 删除技能

### 3. AI配置管理
- `getAIConfig` - 获取用户AI配置
- `saveAIConfig` - 保存用户AI配置

### 4. 对话管理
- `saveConversation` - 保存对话
- `getConversations` - 获取对话列表
- `getConversation` - 获取单个对话详情

### 5. 消息管理
- `saveMessage` - 保存消息
- `getMessages` - 获取消息列表

### 6. AI对话生成
- `generate` - 生成AI响应

### 7. 计划生成
- `generatePlan` - 生成旅行计划

## 调用示例

### 小程序端调用

```javascript
// 获取模型列表
wx.cloud.callFunction({
  name: 'ai-assistant',
  data: {
    action: 'getModels',
    userId: 'user123'
  },
  success: res => {
    console.log('模型列表:', res.result.data);
  }
});

// 生成AI响应
wx.cloud.callFunction({
  name: 'ai-assistant',
  data: {
    action: 'generate',
    userId: 'user123',
    message: '帮我制定一个旅行计划',
    conversationId: 'conv123',
    modelId: 'model456'
  },
  success: res => {
    console.log('AI响应:', res.result.data.response);
  }
});

// 生成旅行计划
wx.cloud.callFunction({
  name: 'ai-assistant',
  data: {
    action: 'generatePlan',
    destination: '北京',
    startDate: '2024-03-01',
    endDate: '2024-03-05',
    budget: 5000,
    travelers: 2,
    preferences: '历史文化'
  },
  success: res => {
    console.log('旅行计划:', res.result.data);
  }
});
```

### Web端调用

```javascript
const app = tcb.init({ env: 'your-env-id' });

// 获取模型列表
app.callFunction({
  name: 'ai-assistant',
  data: {
    action: 'getModels',
    userId: 'user123'
  }
}).then(res => {
  console.log('模型列表:', res.result.data);
});

// 生成AI响应
app.callFunction({
  name: 'ai-assistant',
  data: {
    action: 'generate',
    userId: 'user123',
    message: '帮我制定一个旅行计划',
    conversationId: 'conv123',
    modelId: 'model456'
  }
}).then(res => {
  console.log('AI响应:', res.result.data.response);
});
```

## 返回格式

所有操作都返回统一格式：

```javascript
{
  success: true,  // 操作是否成功
  data: {...},    // 返回的数据（成功时）
  error: '...'    // 错误信息（失败时）
}
```

## 注意事项

1. 确保已创建相关数据库集合：
   - `llm_models` - 模型配置
   - `Skill` - 技能配置
   - `AIConfig` - AI配置
   - `Conversation` - 对话记录
   - `Message` - 消息记录

2. 部署时请点击「保存并安装依赖」按钮

3. AI响应目前使用模拟数据，实际使用时需要接入真实的AI服务