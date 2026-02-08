const tcb = require('@cloudbase/node-sdk');
const app = tcb.init({
  env: tcb.getCurrentEnv()
});

exports.main = async (event, context) => {
  const { action, planId, planData } = event;
  
  if (action === 'generateMiniProgramCode') {
    try {
      // 生成小程序码
      const result = await generateMiniProgramCode(planId, planData);
      
      return {
        success: true,
        codeUrl: result.codeUrl,
        shareUrl: result.shareUrl
      };
    } catch (error) {
      console.error('生成小程序码失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  if (action === 'getShareInfo') {
    try {
      // 获取分享信息
      const shareInfo = await getShareInfo(planId, planData);
      
      return {
        success: true,
        shareInfo: shareInfo
      };
    } catch (error) {
      console.error('获取分享信息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  if (action === 'recordShare') {
    try {
      // 记录分享行为
      await recordShareAction(planId, event.userId);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('记录分享失败:', error);
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

// 生成小程序码
async function generateMiniProgramCode(planId, planData) {
  try {
    // 在实际应用中，这里应该调用微信API生成小程序码
    // 这里使用模拟数据
    const mockCodeUrl = `https://api.weixin.qq.com/wxa/getwxacode?path=pages/detail?id=${planId}`;
    const mockShareUrl = `https://your-app.com/detail?id=${planId}`;
    
    return {
      codeUrl: mockCodeUrl,
      shareUrl: mockShareUrl
    };
  } catch (error) {
    throw new Error('生成小程序码失败');
  }
}

// 获取分享信息
async function getShareInfo(planId, planData) {
  try {
    const shareInfo = {
      title: planData?.title || '我的旅行计划',
      description: `${planData?.destination || ''} ${planData?.days || ''}日游 - 预算${planData?.budget || 0}元`,
      imageUrl: planData?.coverImage || 'https://via.placeholder.com/400x300',
      path: `pages/detail?id=${planId}`
    };
    
    return shareInfo;
  } catch (error) {
    throw new Error('获取分享信息失败');
  }
}

// 记录分享行为
async function recordShareAction(planId, userId) {
  try {
    const db = app.database();
    const shareRecord = {
      planId: planId,
      userId: userId,
      shareTime: new Date().toISOString(),
      shareType: 'wechat'
    };
    
    await db.collection('share_records').add(shareRecord);
    
    return true;
  } catch (error) {
    console.error('记录分享失败:', error);
    // 不抛出错误，避免影响用户体验
    return false;
  }
}