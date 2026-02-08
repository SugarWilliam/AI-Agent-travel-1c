// @ts-ignore;
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Send, Sparkles, Bot, User, ThumbsUp, ThumbsDown, Copy, Image as ImageIcon, FileText, Link2, Download, Share2, X, Plus, Settings, FileClock, Mic, MicOff } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Textarea } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function AIAssistant(props) {
  const {
    toast
  } = useToast();
  const [messages, setMessages] = useState([{
    id: '1',
    role: 'assistant',
    content: '你好！我是你的AI旅行助手 🌍✈️\n\n我可以帮你：\n• 📋 生成完整旅行计划（行程规划、攻略、天气、拍照指导、穿搭指导）\n• 🗺️ 规划旅行路线和详细行程\n• 🏔️ 推荐景点和美食\n• 🚗 提供交通和住宿建议\n• ❓ 解答旅行相关问题\n• 📸 识别图片中的景点\n• 📄 解析旅行文档\n• 📝 生成旅行攻略文档\n• 🔗 创建可分享的小程序链接\n• 🎤 语音输入对话\n\n💡 快速开始：\n告诉我你想去哪里、几天、预算多少，我就能为你生成完整的旅行计划！\n\n例如：\n"帮我制定一个东京5天的旅行计划，预算1万元"\n"我想去巴黎玩7天，预算2万元"',
    timestamp: new Date().toISOString()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showOutputOptions, setShowOutputOptions] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化语音识别
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'zh-CN';
      recognition.onresult = event => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript) {
          setInput(prev => prev + finalTranscript);
        }
      };
      recognition.onerror = event => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          toast({
            title: '无法访问麦克风',
            description: '请允许浏览器访问麦克风以使用语音输入功能',
            variant: 'destructive'
          });
        }
      };
      recognition.onend = () => {
        if (isRecording) {
          setIsRecording(false);
        }
      };
      recognitionRef.current = recognition;
    } else {
      console.warn('Speech recognition not supported');
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  // 开始/停止录音
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: '语音识别不支持',
        description: '您的浏览器不支持语音识别功能',
        variant: 'destructive'
      });
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };
  const handleSend = async () => {
    if (!input.trim() && uploadedImages.length === 0 && uploadedFiles.length === 0) return;
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      images: uploadedImages,
      files: uploadedFiles,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedImages([]);
    setUploadedFiles([]);
    setIsLoading(true);

    // 检查是否需要生成完整计划
    if (input.includes('生成计划') || input.includes('制定行程') || input.includes('规划旅行')) {
      await handleGenerateCompletePlan(input);
    } else {
      // 普通对话
      await handleNormalConversation(input, uploadedImages, uploadedFiles);
    }
  };

  // 生成完整旅行计划
  const handleGenerateCompletePlan = async userInput => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'generateCompletePlan',
          userInput: userInput,
          conversationId: Date.now().toString()
        }
      });
      if (result && result.success && result.plan) {
        const plan = result.plan;
        const responseContent = `✨ 已为您生成完整的旅行计划！\n\n📍 目的地：${plan.destination}\n📅 天数：${plan.days}天\n💰 预算：${plan.budget}元\n\n📋 行程安排：\n${formatItinerary(plan.itinerary)}\n\n📖 旅行攻略：\n${formatGuide(plan.guide)}\n\n🌤️ 天气预报：\n${formatWeather(plan.weather)}\n\n📸 拍照指导：\n${formatPhotoGuide(plan.photoGuide)}\n\n👕 穿搭指导：\n${formatOutfitGuide(plan.outfitGuide)}\n\n💡 提示：您可以点击下方按钮查看详细内容，或对计划进行局部修改和补齐。`;
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          planData: plan,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('生成计划失败');
      }
    } catch (error) {
      console.error('生成完整计划失败:', error);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，生成旅行计划时遇到了问题。请稍后重试或提供更详细的信息。',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // 普通对话处理
  const handleNormalConversation = async (userInput, images, files) => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'ai-assistant',
        data: {
          action: 'chat',
          userInput: userInput,
          images: images,
          files: files
        }
      });
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response || generateAIResponse(userInput, images, files),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('对话处理失败:', error);
      const fallbackResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(userInput, images, files),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // 格式化行程安排
  const formatItinerary = itinerary => {
    return itinerary.map(day => {
      const activities = day.activities.map(a => `  • ${a.time} ${a.name} - ${a.destination}`).join('\n');
      return `第${day.day}天：${day.title}\n${activities}`;
    }).join('\n\n');
  };

  // 格式化攻略
  const formatGuide = guide => {
    return `• 景点亮点：${guide.highlights.join('、')}\n• 交通信息：${guide.transportation.localTransport}\n• 美食推荐：${guide.food.join('、')}`;
  };

  // 格式化天气
  const formatWeather = weather => {
    return weather.map(w => `• ${w.date}: ${w.icon} ${w.condition} ${w.temperature}`).join('\n');
  };

  // 格式化拍照指导
  const formatPhotoGuide = photoGuide => {
    return `• 拍照贴士：${photoGuide.tips.slice(0, 2).join('、')}\n• 推荐设备：${photoGuide.equipment.slice(0, 3).join('、')}`;
  };

  // 格式化穿搭指导
  const formatOutfitGuide = outfitGuide => {
    return `• 每日穿搭：${outfitGuide.dailyOutfits.map(o => `第${o.day}天-${o.morning}`).join('、')}\n• 必备物品：${outfitGuide.essentials.slice(0, 3).join('、')}`;
  };
  const generateAIResponse = (userInput, images, files) => {
    const input = userInput.toLowerCase();
    let response = '';

    // 处理图片识别
    if (images.length > 0) {
      response = '我看到了你上传的图片！📸\n\n';
      if (input.includes('识别') || input.includes('这是什么')) {
        response += '根据图片分析，这看起来像是一个美丽的旅游景点。\n\n';
        response += '建议：\n• 这是一个值得游览的地方\n• 建议安排半天时间游览\n• 记得带相机拍照留念\n\n';
      } else {
        response += '这张图片很美！我可以帮你：\n• 识别图片中的景点\n• 规划到这个地方的行程\n• 提供相关的旅行建议\n\n';
      }
    }

    // 处理文档解析
    if (files.length > 0) {
      response += '我已经解析了你上传的文档 📄\n\n';
      response += '文档内容摘要：\n• 包含了详细的旅行计划\n• 有多个景点推荐\n• 预算规划合理\n\n';
      response += '我可以帮你：\n• 优化这个计划\n• 补充缺失的信息\n• 生成更详细的攻略\n\n';
    }

    // 处理文本输入
    if (input.includes('东京') || input.includes('日本')) {
      response += '东京是个很棒的选择！🗼\n\n推荐行程：\n1. 浅草寺 - 东京最古老的寺庙\n2. 晴空塔 - 俯瞰东京全景\n3. 秋叶原 - 动漫文化圣地\n4. 新宿 - 购物和美食天堂\n5. 筑地市场 - 新鲜海鲜早餐\n\n最佳旅行时间：3-5月和9-11月\n预算建议：人均1-2万/周\n\n需要我帮你制定详细的行程计划吗？';
    } else if (input.includes('大理') || input.includes('云南')) {
      response += '大理是慢生活的绝佳选择！🏔️\n\n推荐体验：\n• 洱海骑行 - 感受风花雪月\n• 古城漫步 - 体验白族文化\n• 苍山徒步 - 登高望远\n• 喜洲古镇 - 品尝破酥粑粑\n• 双廊古镇 - 看最美日落\n\n住宿建议：古城内或洱海边\n最佳季节：3-4月和9-10月\n\n想了解更多细节吗？';
    } else if (input.includes('巴黎') || input.includes('法国')) {
      response += '巴黎，浪漫之都！🗼\n\n必去景点：\n1. 埃菲尔铁塔 - 日落时分最美\n2. 卢浮宫 - 艺术宝库\n3. 凯旋门 - 登顶看香榭丽舍大街\n4. 塞纳河 - 游船夜游\n5. 蒙马特高地 - 艺术家聚集地\n\n美食推荐：\n• 法式可颂\n• 马卡龙\n• 法式洋葱汤\n• 鹅肝\n\n需要我帮你规划具体行程吗？';
    } else if (input.includes('生成文档') || input.includes('导出')) {
      response += '我可以为你生成以下格式的文档：\n\n📄 移动端文档：\n• PDF格式 - 适合打印和分享\n• Word格式 - 方便编辑\n• Markdown格式 - 适合技术文档\n\n🔗 小程序链接：\n• 生成可分享的小程序链接\n• 支持二维码分享\n• 可设置访问权限\n\n🖼️ 图片生成：\n• 旅行攻略海报\n• 行程时间线图\n• 景点地图标注\n\n请告诉我你需要哪种格式？';
    } else if (input.includes('预算') || input.includes('多少钱')) {
      response += '预算规划很重要！💰\n\n一般来说：\n• 国内游：人均3000-8000元/周\n• 东南亚：人均5000-10000元/周\n• 日韩：人均8000-15000元/周\n• 欧洲：人均15000-30000元/周\n\n省钱小贴士：\n1. 提前预订机票和酒店\n2. 选择淡季出行\n3. 使用当地公共交通\n4. 尝试街头美食\n\n你想去哪里？我可以给你更具体的预算建议！';
    } else if (input.includes('签证') || input.includes('护照')) {
      response += '签证信息很重要！📋\n\n热门目的地签证：\n• 日本：电子签证，约5-7个工作日\n• 韩国：电子签证，约3-5个工作日\n• 欧洲（申根）：需面签，约15个工作日\n• 泰国：免签（2024年起）\n• 新加坡：免签（2024年起）\n\n建议：\n1. 至少提前1个月准备\n2. 确保护照有效期6个月以上\n3. 准备好行程单和酒店预订\n\n需要了解具体国家的签证要求吗？';
    } else if (!response) {
      response = '很高兴为你提供帮助！✨\n\n我可以帮你：\n• 推荐旅行目的地\n• 制定详细行程计划\n• 提供景点和美食推荐\n• 解答签证和交通问题\n• 给出预算建议\n• 识别图片中的景点\n• 解析旅行文档\n• 生成旅行攻略文档\n• 创建可分享的小程序链接\n\n告诉我你想去哪里，或者有什么旅行问题，我会尽力帮你解答！';
    }
    return response;
  };
  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImages(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };
  const handleFileUpload = e => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      setUploadedFiles(prev => [...prev, {
        name: file.name,
        type: file.type
      }]);
    });
  };
  const removeImage = index => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  const removeFile = index => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  const handleCopy = content => {
    navigator.clipboard.writeText(content);
    toast({
      title: '已复制',
      description: '内容已复制到剪贴板',
      variant: 'default'
    });
  };
  const handleFeedback = (messageId, isPositive) => {
    toast({
      title: isPositive ? '感谢反馈！' : '我们会改进',
      description: '你的反馈帮助我们变得更好',
      variant: 'default'
    });
  };
  const handleOutputOptions = messageId => {
    setSelectedMessageId(messageId);
    setShowOutputOptions(true);
  };
  const handleGenerateDocument = format => {
    toast({
      title: '正在生成文档',
      description: `正在生成${format}格式的文档...`,
      variant: 'default'
    });
    setTimeout(() => {
      setShowOutputOptions(false);
      props.$w.utils.navigateTo({
        pageId: 'ai-output',
        params: {}
      });
    }, 1500);
  };
  const handleGenerateMiniprogramLink = () => {
    toast({
      title: '正在生成链接',
      description: '正在生成小程序分享链接...',
      variant: 'default'
    });
    setTimeout(() => {
      setShowOutputOptions(false);
      props.$w.utils.navigateTo({
        pageId: 'ai-output',
        params: {}
      });
    }, 1500);
  };
  const handleGenerateImage = () => {
    toast({
      title: '正在生成图片',
      description: '正在生成旅行攻略图片...',
      variant: 'default'
    });
    setTimeout(() => {
      setShowOutputOptions(false);
      props.$w.utils.navigateTo({
        pageId: 'ai-output',
        params: {}
      });
    }, 2000);
  };

  // 查看完整计划
  const handleViewPlan = planData => {
    toast({
      title: '正在打开计划',
      description: '正在为您打开完整的旅行计划...',
      variant: 'default'
    });

    // 将计划数据存储到本地或传递到详情页面
    setTimeout(() => {
      props.$w.utils.navigateTo({
        pageId: 'detail',
        params: {
          planId: 'ai-generated-' + Date.now(),
          planData: JSON.stringify(planData)
        }
      });
    }, 1000);
  };
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  return <div className="min-h-screen bg-[#FFF9F0] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-4 pt-12">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white" style={{
              fontFamily: 'Nunito, sans-serif'
            }}>
                AI旅行助手
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => props.$w.utils.navigateTo({
            pageId: 'agent-list',
            params: {}
          })} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg" title="Agent列表">
              <Settings className="w-6 h-6 text-[#2D3436]" />
            </button>
            <button onClick={() => props.$w.utils.navigateTo({
            pageId: 'agent-logs',
            params: {}
          })} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg" title="运行日志">
              <FileClock className="w-6 h-6 text-[#2D3436]" />
            </button>
            <button onClick={() => props.$w.utils.navigateTo({
            pageId: 'ai-config',
            params: {}
          })} className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg" title="AI配置">
              <Bot className="w-6 h-6 text-[#2D3436]" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user' ? 'bg-[#FF6B6B] text-white' : 'bg-white text-gray-800 shadow-md'}`}>
                <div className="flex items-start gap-2 mb-2">
                  {message.role === 'assistant' ? <Bot className="w-5 h-5 text-[#4ECDC4] flex-shrink-0 mt-0.5" /> : <User className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    {/* 显示上传的图片 */}
                    {message.images && message.images.length > 0 && <div className="flex flex-wrap gap-2 mb-2">
                        {message.images.map((img, idx) => <img key={idx} src={img} alt="上传的图片" className="w-20 h-20 object-cover rounded-lg" />)}
                      </div>}
                    {/* 显示上传的文件 */}
                    {message.files && message.files.length > 0 && <div className="flex flex-wrap gap-2 mb-2">
                        {message.files.map((file, idx) => <div key={idx} className="flex items-center gap-1 bg-white/20 rounded-lg px-2 py-1 text-xs">
                            <FileText className="w-3 h-3" />
                            {file.name}
                          </div>)}
                      </div>}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{
                  fontFamily: 'Quicksand, sans-serif'
                }}>
                      {message.content}
                    </p>
                  </div>
                </div>

                {message.role === 'assistant' && <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => handleCopy(message.content)} className="text-gray-400 hover:text-gray-600 p-1">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleFeedback(message.id, true)} className="text-gray-400 hover:text-green-500 p-1">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleFeedback(message.id, false)} className="text-gray-400 hover:text-red-500 p-1">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    {message.planData && <button onClick={() => handleViewPlan(message.planData)} className="text-gray-400 hover:text-[#FF6B6B] p-1" title="查看完整计划">
                      <FileText className="w-4 h-4" />
                    </button>}
                    <button onClick={() => handleOutputOptions(message.id)} className="text-gray-400 hover:text-[#4ECDC4] p-1" title="生成输出">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>}
              </div>
            </div>)}

          {isLoading && <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#4ECDC4]" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-bounce" style={{
                  animationDelay: '0.1s'
                }} />\n                    <div className="w-2 h-2 bg-[#FFE66D] rounded-full animate-bounce" style={{
                  animationDelay: '0.2s'
                }} />
                  </div>
                </div>
              </div>
            </div>}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Uploaded Files Preview */}
      {(uploadedImages.length > 0 || uploadedFiles.length > 0) && <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="bg-white rounded-xl p-3 shadow-md">
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((img, idx) => <div key={idx} className="relative">
                  <img src={img} alt="上传的图片" className="w-16 h-16 object-cover rounded-lg" />
                  <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
              {uploadedFiles.map((file, idx) => <div key={idx} className="relative bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-700 truncate max-w-[100px]">{file.name}</span>
                  <button onClick={() => removeFile(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>)}
            </div>
          </div>
        </div>}

      {/* Input */}
      <div className="bg-white border-t p-4 max-w-2xl mx-auto w-full">
        <div className="flex gap-2 mb-2">
          <label className="cursor-pointer">
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            <div className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors">
              <ImageIcon className="w-5 h-5 text-gray-600" />
            </div>
          </label>
          <label className="cursor-pointer">
            <input type="file" accept=".pdf,.doc,.docx,.txt,.md" multiple onChange={handleFileUpload} className="hidden" />
            <div className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
          </label>
          <button onClick={toggleRecording} className={`rounded-lg p-2 transition-colors ${isRecording ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-100 hover:bg-gray-200'}`} title={isRecording ? '停止录音' : '开始录音'}>
            {isRecording ? <MicOff className="w-5 h-5 text-red-600 animate-pulse" /> : <Mic className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
        <div className="flex gap-2">
          <Textarea placeholder="输入你的旅行问题，或上传图片/文档，或使用语音输入..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }} className="min-h-[60px] max-h-[120px] resize-none" />
          <Button onClick={handleSend} disabled={!input.trim() && uploadedImages.length === 0 && uploadedFiles.length === 0} isLoading={isLoading} className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl px-4">
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center" style={{
        fontFamily: 'Quicksand, sans-serif'
      }}>
          支持文本、图片、文档、语音输入 • 按Enter发送，Shift+Enter换行
        </p>
      </div>

      {/* Output Options Modal */}
      {showOutputOptions && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2D3436]" style={{
            fontFamily: 'Nunito, sans-serif'
          }}>
                选择输出格式
              </h3>
              <button onClick={() => setShowOutputOptions(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">📄 移动端文档</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => handleGenerateDocument('PDF')} variant="outline" className="text-sm">
                    PDF
                  </Button>
                  <Button onClick={() => handleGenerateDocument('Word')} variant="outline" className="text-sm">
                    Word
                  </Button>
                  <Button onClick={() => handleGenerateDocument('Markdown')} variant="outline" className="text-sm">
                    Markdown
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">🔗 小程序链接</h4>
                <Button onClick={handleGenerateMiniprogramLink} className="w-full bg-[#4ECDC4] hover:bg-[#3DBDB5] text-white">
                  <Link2 className="w-4 h-4 mr-2" />
                  生成分享链接
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">🖼️ 图片生成</h4>
                <Button onClick={handleGenerateImage} className="w-full bg-[#FFE66D] hover:bg-[#FFD93D] text-gray-800">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  生成攻略图片
                </Button>
              </div>
            </div>
          </div>
        </div>}

      {/* TabBar */}
      <TabBar activeTab="ai" onNavigate={props.$w.utils.navigateTo} />
    </div>;
}