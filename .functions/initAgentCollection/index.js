// 初始化 Agent 集合
const cloud = require('@cloudbase/node-sdk');

exports.main = async (event, context) => {
  const app = cloud.init({
    env: cloud.getEnv()
  });
  
  const db = app.database();
  
  try {
    // 检查集合是否存在
    const collections = await db.listCollections();
    const agentCollectionExists = collections.some(col => col.name === 'Agent');
    
    if (!agentCollectionExists) {
      // 创建 Agent 集合
      await db.createCollection('Agent');
      console.log('Agent 集合创建成功');
      
      // 插入示例数据
      const sampleAgents = [
        {
          name: '规划助手',
          description: '专业的行程规划助手，根据用户需求生成详细的旅行行程安排',
          icon: 'Route',
          color: 'from-orange-500 to-pink-500',
          agentType: 'built-in',
          model: 'gpt-4',
          skills: [
            { name: '行程规划', enabled: true },
            { name: '路线优化', enabled: true },
            { name: '时间安排', enabled: true }
          ],
          rules: [
            { name: '安全优先', enabled: true },
            { name: '时间合理', enabled: true }
          ],
          ragEnabled: true,
          ragSources: [
            { name: '旅行攻略数据库', enabled: true },
            { name: '景点数据库', enabled: true }
          ],
          mcpServers: [],
          usageCount: 156,
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
          status: 'active',
          outputFormats: [],
          isBuiltIn: true,
          capabilities: [],
          systemPrompt: '',
          temperature: 0.7,
          maxTokens: 4096,
          priority: 0,
          config: {}
        },
        {
          name: '解说助手',
          description: '提供景点解说和文化背景，让旅行更有深度',
          icon: 'BookOpen',
          color: 'from-blue-500 to-cyan-500',
          agentType: 'built-in',
          model: 'gpt-4',
          skills: [
            { name: '景点解说', enabled: true },
            { name: '文化背景', enabled: true },
            { name: '历史介绍', enabled: true }
          ],
          rules: [
            { name: '准确无误', enabled: true },
            { name: '生动有趣', enabled: true }
          ],
          ragEnabled: true,
          ragSources: [
            { name: '景点数据库', enabled: true },
            { name: '文化数据库', enabled: true }
          ],
          mcpServers: [],
          usageCount: 89,
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
          status: 'active',
          outputFormats: [],
          isBuiltIn: true,
          capabilities: [],
          systemPrompt: '',
          temperature: 0.7,
          maxTokens: 4096,
          priority: 0,
          config: {}
        },
        {
          name: '拍照助手',
          description: '提供拍照建议和技巧，记录美好瞬间',
          icon: 'Camera',
          color: 'from-purple-500 to-pink-500',
          agentType: 'built-in',
          model: 'gpt-4',
          skills: [
            { name: '拍照建议', enabled: true },
            { name: '构图技巧', enabled: true },
            { name: '光线分析', enabled: true }
          ],
          rules: [
            { name: '实用优先', enabled: true },
            { name: '简单易懂', enabled: true }
          ],
          ragEnabled: false,
          ragSources: [],
          mcpServers: [],
          usageCount: 67,
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
          status: 'active',
          outputFormats: [],
          isBuiltIn: true,
          capabilities: [],
          systemPrompt: '',
          temperature: 0.7,
          maxTokens: 4096,
          priority: 0,
          config: {}
        },
        {
          name: '推荐助手',
          description: '推荐旅行目的地和活动，发现更多精彩',
          icon: 'Sparkles',
          color: 'from-green-500 to-teal-500',
          agentType: 'built-in',
          model: 'gpt-4',
          skills: [
            { name: '目的地推荐', enabled: true },
            { name: '活动推荐', enabled: true },
            { name: '个性化建议', enabled: true }
          ],
          rules: [
            { name: '用户偏好', enabled: true },
            { name: '季节考虑', enabled: true }
          ],
          ragEnabled: true,
          ragSources: [
            { name: '旅行攻略数据库', enabled: true },
            { name: '活动数据库', enabled: true }
          ],
          mcpServers: [],
          usageCount: 124,
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: new Date().toISOString(),
          status: 'active',
          outputFormats: [],
          isBuiltIn: true,
          capabilities: [],
          systemPrompt: '',
          temperature: 0.7,
          maxTokens: 4096,
          priority: 0,
          config: {}
        }
      ];
      
      await db.collection('Agent').add(sampleAgents);
      console.log('示例数据插入成功');
      
      return {
        success: true,
        message: 'Agent 集合创建成功，已插入 4 个示例 Agent'
      };
    } else {
      return {
        success: true,
        message: 'Agent 集合已存在'
      };
    }
  } catch (error) {
    console.error('初始化失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
};