// 旅行计划保存云函数
const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.getEnv()
});

const db = app.database();

exports.main = async (event, context) => {
  const { action, plan, planId, userId } = event;

  try {
    switch (action) {
      case 'create':
        return await createPlan(plan, userId);
      case 'update':
        return await updatePlan(planId, plan, userId);
      case 'delete':
        return await deletePlan(planId, userId);
      case 'get':
        return await getPlan(planId, userId);
      case 'list':
        return await listPlans(userId);
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

async function createPlan(plan, userId) {
  try {
    const result = await db.collection('Trip').add({
      ...plan,
      userId: userId || 'anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      data: {
        planId: result.id,
        ...plan
      }
    };
  } catch (error) {
    console.error('创建计划失败:', error);
    return {
      success: false,
      error: '创建计划失败: ' + error.message
    };
  }
}

async function updatePlan(planId, plan, userId) {
  try {
    const result = await db.collection('Trip').doc(planId).update({
      ...plan,
      updatedAt: new Date().toISOString()
    });
    
    if (result.updated === 0) {
      return {
        success: false,
        error: '计划不存在或无权限更新'
      };
    }
    
    return {
      success: true,
      data: {
        planId,
        ...plan
      }
    };
  } catch (error) {
    console.error('更新计划失败:', error);
    return {
      success: false,
      error: '更新计划失败: ' + error.message
    };
  }
}

async function deletePlan(planId, userId) {
  try {
    const result = await db.collection('Trip').doc(planId).remove();
    
    if (result.deleted === 0) {
      return {
        success: false,
        error: '计划不存在或无权限删除'
      };
    }
    
    return {
      success: true,
      data: { planId }
    };
  } catch (error) {
    console.error('删除计划失败:', error);
    return {
      success: false,
      error: '删除计划失败: ' + error.message
    };
  }
}

async function getPlan(planId, userId) {
  try {
    const result = await db.collection('Trip').doc(planId).get();
    
    if (!result.data) {
      return {
        success: false,
        error: '计划不存在'
      };
    }
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('获取计划失败:', error);
    return {
      success: false,
      error: '获取计划失败: ' + error.message
    };
  }
}

async function listPlans(userId) {
  try {
    const result = await db.collection('Trip')
      .where({
        userId: userId || 'anonymous'
      })
      .orderBy('createdAt', 'desc')
      .get();
    
    return {
      success: true,
      data: result.data || []
    };
  } catch (error) {
    console.error('获取计划列表失败:', error);
    return {
      success: false,
      error: '获取计划列表失败: ' + error.message
    };
  }
}