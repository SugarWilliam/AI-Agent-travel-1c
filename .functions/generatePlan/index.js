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
  try {
    const { destination, startDate, endDate, days, budget, travelers, preferences } = input;
    
    const itinerary = {
      title: `${destination}行程安排`,
      days: []
    };
    
    for (let i = 1; i <= days; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i - 1);
      
      itinerary.days.push({
        day: i,
        date: dayDate.toISOString().split('T')[0],
        activities: [
          {
            id: `node-${i}-1`,
            time: '09:00',
            activity: '早餐',
            location: '酒店餐厅',
            duration: '1小时',
            notes: '享用当地特色早餐'
          },
          {
            id: `node-${i}-2`,
            time: '10:30',
            activity: `游览${destination}景点${i}`,
            location: `${destination}景点${i}`,
            duration: '3小时',
            notes: '参观主要景点，拍照留念'
          },
          {
            id: `node-${i}-3`,
            time: '14:00',
            activity: '午餐',
            location: '当地餐厅',
            duration: '1.5小时',
            notes: '品尝当地特色美食'
          },
          {
            id: `node-${i}-4`,
            time: '16:00',
            activity: '自由活动',
            location: '市中心',
            duration: '2小时',
            notes: '购物、休息或探索周边'
          }
        ]
      });
    }
    
    const weather = {
      title: `${destination}天气预报`,
      location: destination,
      forecast: []
    };
    
    for (let i = 0; i < days; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);
      
      weather.forecast.push({
        date: dayDate.toISOString().split('T')[0],
        temperature: '18°C - 25°C',
        condition: i % 2 === 0 ? '晴' : '多云',
        humidity: '60%',
        wind: '东北风 3级',
        advice: '适合户外活动'
      });
    }
    
    const guide = {
      overview: `${destination}是一个充满魅力的旅游目的地，拥有丰富的历史文化和自然景观。建议安排${days}天的行程，充分体验当地的风土人情。`,
      highlights: [
        `${destination}市中心：感受城市的脉搏`,
        `国家博物馆：了解历史文化`,
        `美食街：品尝当地特色美食`,
        `自然公园：享受自然风光`
      ],
      tips: [
        '建议提前预订热门景点门票',
        '注意当地天气变化，携带合适衣物',
        '学习几句当地语言，方便交流',
        '尊重当地文化和习俗'
      ]
    };
    
    const photoTips = {
      bestSpots: [
        {
          location: `${destination}市中心`,
          bestTime: '早晨 7-9 点',
          tips: '利用早晨柔和的光线，拍摄城市全景',
          equipment: '广角镜头'
        },
        {
          location: '国家博物馆',
          bestTime: '下午 2-4 点',
          tips: '利用侧光拍摄建筑细节',
          equipment: '标准镜头'
        },
        {
          location: '自然公园',
          bestTime: '傍晚 5-7 点',
          tips: '利用黄金时刻拍摄自然风光',
          equipment: '长焦镜头'
        }
      ]
    };
    
    const outfitTips = {
      recommendations: []
    };
    
    for (let i = 0; i < days; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);
      
      outfitTips.recommendations.push({
        day: i + 1,
        date: dayDate.toISOString().split('T')[0],
        weather: i % 2 === 0 ? '晴' : '多云',
        temperature: '18°C - 25°C',
        suggestions: '轻薄长袖 + 长裤，舒适运动鞋',
        accessories: '太阳帽、墨镜'
      });
    }
    
    const plan = {
      title: `${destination}旅行计划`,
      destination: destination,
      startDate: startDate,
      endDate: endDate,
      days: days,
      budget: budget,
      travelers: travelers,
      preferences: preferences,
      description: guide.overview,
      itinerary: itinerary.days,
      weather: weather.forecast,
      guide: guide,
      photoTips: photoTips,
      outfitTips: outfitTips,
      userId: userId || 'anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      plan: plan
    };
  } catch (error) {
    console.error('生成计划失败:', error);
    return {
      success: false,
      error: error.message || '生成计划失败'
    };
  }
}