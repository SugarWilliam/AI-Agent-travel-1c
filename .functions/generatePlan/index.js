// @ts-nocheck
const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.getEnv()
});

const db = app.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, input, userId } = event;

  try {
    switch (action) {
      case 'generate':
        return await generatePlan(input, userId);
      default:
        return {
          success: false,
          error: '未知的操作类型'
        };
    }
  } catch (error) {
    console.error('云函数执行错误:', error);
    return {
      success: false,
      error: error.message || '云函数执行失败'
    };
  }
};

async function generatePlan(input, userId) {
  const { destination, startDate, endDate, days, budget, travelers, preferences } = input;

  // 模拟生成计划（实际应该调用 AI Agent）
  const plan = {
    title: `${destination}${days}日游`,
    destination,
    startDate,
    endDate,
    days,
    budget,
    travelers,
    preferences,
    description: `这是一份为您精心设计的${destination}${days}日游计划。\n\n## 行程概览\n\n我们将带您探索${destination}的精华景点，体验当地文化，品尝特色美食。\n\n## 每日安排\n\n### 第1天：抵达与探索\n- 上午：抵达${destination}，入住酒店\n- 下午：游览市中心，熟悉环境\n- 晚上：品尝当地特色美食\n\n### 第2天：深度游览\n- 上午：参观著名景点\n- 下午：体验当地文化活动\n- 晚上：自由活动\n\n### 第3天：返程\n- 上午：购买纪念品\n- 下午：前往机场，结束愉快的旅程\n\n## 注意事项\n\n- 请提前准备好身份证件\n- 注意当地天气变化\n- 保持手机畅通，方便联系`,
    itinerary: [
      {
        day: 1,
        date: startDate,
        title: '抵达与探索',
        activities: [
          { time: '09:00', title: '抵达机场', location: '机场', type: 'transport' },
          { time: '10:00', title: '入住酒店', location: '酒店', type: 'accommodation' },
          { time: '14:00', title: '游览市中心', location: '市中心', type: 'sightseeing' },
          { time: '18:00', title: '晚餐', location: '餐厅', type: 'dining' }
        ]
      },
      {
        day: 2,
        date: getNextDay(startDate, 1),
        title: '深度游览',
        activities: [
          { time: '08:00', title: '早餐', location: '酒店', type: 'dining' },
          { time: '09:00', title: '参观著名景点', location: '景点', type: 'sightseeing' },
          { time: '12:00', title: '午餐', location: '景点附近', type: 'dining' },
          { time: '14:00', title: '体验当地文化', location: '文化中心', type: 'culture' },
          { time: '18:00', title: '自由活动', location: '市区', type: 'free' }
        ]
      },
      {
        day: 3,
        date: getNextDay(startDate, 2),
        title: '返程',
        activities: [
          { time: '09:00', title: '早餐', location: '酒店', type: 'dining' },
          { time: '10:00', title: '购买纪念品', location: '商店', type: 'shopping' },
          { time: '14:00', title: '前往机场', location: '机场', type: 'transport' }
        ]
      }
    ],
    weather: [
      { date: startDate, temperature: '25°C', condition: '晴', icon: '☀️' },
      { date: getNextDay(startDate, 1), temperature: '24°C', condition: '多云', icon: '⛅' },
      { date: getNextDay(startDate, 2), temperature: '23°C', condition: '小雨', icon: '🌧️' }
    ],
    guide: {
      overview: `${destination}是一个充满魅力的旅游目的地，拥有丰富的历史文化和自然景观。`,
      highlights: ['著名景点', '特色美食', '文化体验'],
      tips: ['注意防晒', '保持环保', '尊重当地文化']
    },
    photoTips: {
      bestSpots: ['景点A', '景点B', '景点C'],
      tips: ['最佳拍摄时间：早晨和傍晚', '使用广角镜头拍摄风景', '注意构图和光线']
    },
    outfitTips: {
      recommendations: [
        { day: 1, outfit: '休闲装', items: ['T恤', '牛仔裤', '运动鞋'] },
        { day: 2, outfit: '舒适装', items: ['衬衫', '长裤', '休闲鞋'] },
        { day: 3, outfit: '轻便装', items: ['T恤', '短裤', '凉鞋'] }
      ]
    },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return {
    success: true,
    plan
  };
}

function getNextDay(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
