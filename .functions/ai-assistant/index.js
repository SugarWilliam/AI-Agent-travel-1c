// @ts-ignore
const cloud = require('@cloudbase/node-sdk');

// @ts-ignore
const tcb = cloud.init({
  env: cloud.getCurrentEnv()
});

exports.main = async (event, context) => {
  const { action, date, location } = event;
  
  if (action === 'getWeather') {
    try {
      // 模拟AI获取天气信息
      // 在实际应用中，这里可以调用真实的天气API或AI服务
      const weatherData = await getWeatherFromAI(date, location);
      
      return {
        success: true,
        weather: weatherData
      };
    } catch (error) {
      console.error('获取天气失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  if (action === 'suggestTimeAdjustment') {
    try {
      const { dayId, activities } = event;
      const suggestion = await generateTimeAdjustmentSuggestion(activities);
      
      return {
        success: true,
        suggestion: suggestion
      };
    } catch (error) {
      console.error('生成时间调整建议失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  return {
    success: false,
    error: '未知的操作类型'
  };
};

// 模拟AI获取天气信息
async function getWeatherFromAI(date, location) {
  // 模拟天气数据
  const weatherConditions = [
    { condition: '晴', icon: '☀️' },
    { condition: '多云', icon: '⛅' },
    { condition: '阴', icon: '☁️' },
    { condition: '小雨', icon: '🌧️' },
    { condition: '大雨', icon: '⛈️' },
    { condition: '雪', icon: '❄️' },
    { condition: '雾', icon: '🌫️' }
  ];
  
  // 根据日期生成伪随机天气
  const dateHash = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const weatherIndex = dateHash % weatherConditions.length;
  const temperature = Math.floor(Math.random() * 15) + 5; // 5-20度
  
  return {
    condition: weatherConditions[weatherIndex].condition,
    icon: weatherConditions[weatherIndex].icon,
    temperature: `${temperature}°C`,
    lastUpdated: new Date().toISOString()
  };
}

// 生成时间调整建议
async function generateTimeAdjustmentSuggestion(activities) {
  // 简单的建议生成逻辑
  if (activities.length < 2) {
    return '当前行程安排合理，无需调整。';
  }
  
  const suggestions = [
    '建议将第一个活动提前30分钟，避免人流高峰',
    '建议在两个活动之间增加15分钟休息时间',
    '建议将户外活动安排在上午，避开下午的高温',
    '建议预留更多时间用于交通和意外情况',
    '当前时间安排合理，可以按计划进行'
  ];
  
  const randomIndex = Math.floor(Math.random() * suggestions.length);
  return suggestions[randomIndex];
}