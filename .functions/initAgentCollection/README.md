# initAgentCollection 云函数

## 功能说明

初始化 Agent 集合并插入示例数据。该函数会：
1. 检查 Agent 集合是否存在
2. 如果不存在，创建 Agent 集合
3. 插入 4 个内置的示例 Agent（规划助手、解说助手、拍照助手、推荐助手）

## 使用方法

### 在小程序中调用

```javascript
// 调用云函数
wx.cloud.callFunction({
  name: 'initAgentCollection',
  data: {},
  success: res => {
    console.log('初始化结果:', res.result);
    if (res.result.success) {
      wx.showToast({
        title: res.result.message,
        icon: 'success'
      });
    }
  },
  fail: err => {
    console.error('调用失败:', err);
    wx.showToast({
      title: '初始化失败',
      icon: 'error'
    });
  }
});
```

### 在 Web 端调用

```javascript
// 使用 cloudbase-js-sdk
const app = tcb.init({
  env: 'your-env-id'
});

app.callFunction({
  name: 'initAgentCollection',
  data: {}
}).then(res => {
  console.log('初始化结果:', res.result);
  if (res.result.success) {
    alert(res.result.message);
  }
}).catch(err => {
  console.error('调用失败:', err);
  alert('初始化失败');
});
```

## 返回结果

### 成功
```json
{
  "success": true,
  "message": "Agent 集合创建成功，已插入 4 个示例 Agent"
}
```

或
```json
{
  "success": true,
  "message": "Agent 集合已存在"
}
```

### 失败
```json
{
  "success": false,
  "message": "错误信息"
}
```

## 示例 Agent 数据结构

每个 Agent 包含以下字段：
- `name`: Agent 名称
- `description`: 描述
- `icon`: 图标名称
- `color`: 渐变色样式
- `type`: 类型（built-in/custom）
- `model`: 使用的模型
- `skills`: 技能列表
- `rules`: 规则列表
- `ragEnabled`: 是否启用 RAG
- `ragSources`: RAG 数据源
- `mcpServers`: MCP 服务器列表
- `usageCount`: 使用次数
- `createdAt`: 创建时间
- `updatedAt`: 更新时间
- `status`: 状态（active/inactive）

## 注意事项

1. 该函数幂等，多次调用不会重复创建集合或插入数据
2. 首次调用会创建集合并插入示例数据
3. 后续调用会返回"Agent 集合已存在"
4. 需要确保云函数有数据库操作权限