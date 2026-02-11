# initLLMModels 云函数

## 功能说明

初始化 LLM 模型数据到数据库，支持以下模型：

### OpenAI 系列
- GPT-4
- GPT-4 Turbo
- GPT-3.5 Turbo

### Anthropic 系列
- Claude 3
- Claude 2

### Google 系列
- Gemini Pro

### 阿里云系列
- 通义千问 Max
- 通义千问 Plus
- 通义千问 Turbo

### 百度系列
- 文心一言

### 字节跳动系列
- 豆包 Pro
- 豆包 Lite

### 月之暗面系列
- Kimi 128K
- Kimi 8K

### 智谱AI系列
- GLM-4
- GLM-3 Turbo

### 深度求索系列
- DeepSeek Chat
- DeepSeek Coder

## 调用方式

### 小程序端调用

```javascript
wx.cloud.callFunction({
  name: 'initLLMModels',
  data: {},
  success: res => {
    console.log('初始化结果:', res.result);
    if (res.result.success) {
      wx.showToast({
        title: `成功初始化 ${res.result.count} 个模型`,
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '初始化失败',
        icon: 'error'
      });
    }
  },
  fail: err => {
    console.error('调用失败:', err);
    wx.showToast({
      title: '调用失败',
      icon: 'error'
    });
  }
});
```

### Web 端调用

```javascript
const tcb = require('@cloudbase/node-sdk');
const app = tcb.init({ env: 'your-env-id' });

app.callFunction({
  name: 'initLLMModels',
  data: {}
}).then(res => {
  console.log('初始化结果:', res.result);
  if (res.result.success) {
    console.log(`成功初始化 ${res.result.count} 个模型`);
    console.log('模型列表:', res.result.models);
  }
}).catch(err => {
  console.error('调用失败:', err);
});
```

## 返回结果

### 成功响应

```json
{
  "success": true,
  "message": "LLM 模型数据初始化成功",
  "count": 18,
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "OpenAI"
    },
    {
      "id": "doubao-pro",
      "name": "豆包 Pro",
      "provider": "字节跳动"
    }
    // ... 更多模型
  ]
}
```

### 已存在时的响应

```json
{
  "success": true,
  "message": "LLM 模型数据已存在",
  "count": 18
}
```

### 失败响应

```json
{
  "success": false,
  "error": "错误信息"
}
```

## 注意事项

1. **幂等性**：该函数可以多次调用，如果数据已存在则不会重复插入
2. **数据库集合**：需要确保 `llm_models` 集合已创建
3. **权限**：确保云函数有数据库写入权限
4. **API Key**：初始化时所有模型的 `apiKey` 为空，需要后续配置

## 部署说明

1. 在云开发控制台中，进入 `initLLMModels` 云函数
2. 点击「保存并安装依赖」按钮进行部署
3. 部署完成后，调用函数进行初始化

## 错误处理

函数会捕获以下错误：
- 数据库连接错误
- 集合不存在错误
- 数据插入错误
- 其他运行时错误

所有错误都会在返回结果中包含 `error` 字段。