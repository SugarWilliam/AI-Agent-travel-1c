# 旅行计划生成云函数

## 功能说明

该云函数用于生成详细的旅行计划，包括：

- 每日行程安排
- 天气预报
- 旅行攻略
- 拍照建议
- 穿搭建议

## 调用示例

### 小程序端调用

```javascript
wx.cloud.callFunction({
  name: 'generatePlan',
  data: {
    action: 'generate',
    input: {
      destination: '北京',
      startDate: '2024-03-01',
      endDate: '2024-03-05',
      days: 5,
      budget: 5000,
      travelers: 2,
      preferences: '历史文化'
    },
    userId: 'user123'
  },
  success: res => {
    if (res.result.success) {
      console.log('旅行计划:', res.result.plan);
      // 处理返回的计划数据
    }
  },
  fail: err => {
    console.error('调用失败:', err);
  }
});
```

### Web端调用

```javascript
const app = tcb.init({ env: 'your-env-id' });

app.callFunction({
  name: 'generatePlan',
  data: {
    action: 'generate',
    input: {
      destination: '北京',
      startDate: '2024-03-01',
      endDate: '2024-03-05',
      days: 5,
      budget: 5000,
      travelers: 2,
      preferences: '历史文化'
    },
    userId: 'user123'
  }
}).then(res => {
  if (res.result.success) {
    console.log('旅行计划:', res.result.plan);
  }
}).catch(err => {
  console.error('调用失败:', err);
});
```

## 返回数据结构

```javascript
{
  success: true,
  plan: {
    title: '北京旅行计划',
    destination: '北京',
    startDate: '2024-03-01',
    endDate: '2024-03-05',
    days: 5,
    budget: 5000,
    travelers: 2,
    preferences: '历史文化',
    description: '...',
    itinerary: [
      {
        day: 1,
        date: '2024-03-01',
        activities: [
          {
            id: 'node-1-1',
            time: '09:00',
            activity: '早餐',
            location: '酒店餐厅',
            duration: '1小时',
            notes: '享用当地特色早餐'
          },
          // 更多活动...
        ]
      },
      // 更多天数...
    ],
    weather: [
      {
        date: '2024-03-01',
        temperature: '18°C - 25°C',
        condition: '晴',
        humidity: '60%',
        wind: '东北风 3级',
        advice: '适合户外活动'
      },
      // 更多天气...
    ],
    guide: {
      overview: '...',
      highlights: [...],
      tips: [...]
    },
    photoTips: {
      bestSpots: [...]
    },
    outfitTips: {
      recommendations: [...]
    },
    userId: 'user123',
    createdAt: '2024-02-20T10:00:00.000Z',
    updatedAt: '2024-02-20T10:00:00.000Z'
  }
}
```

## 参数说明

### input 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| destination | string | 是 | 目的地 |
| startDate | string | 是 | 开始日期 (YYYY-MM-DD) |
| endDate | string | 是 | 结束日期 (YYYY-MM-DD) |
| days | number | 是 | 天数 |
| budget | number | 否 | 预算 |
| travelers | number | 否 | 旅行人数 |
| preferences | string | 否 | 偏好（如：历史文化、自然风光等） |

### userId 参数

用户ID，用于标识计划归属者。

## 注意事项

1. 部署时请点击「保存并安装依赖」按钮

2. 当前生成的计划为模拟数据，实际使用时可以：
   - 接入真实的天气API
   - 接入AI服务生成个性化内容
   - 从数据库获取真实的景点和餐厅信息

3. 生成的计划可以配合 `saveTravelPlan` 云函数保存到数据库