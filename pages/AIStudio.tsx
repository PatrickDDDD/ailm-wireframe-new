import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ExternalLink, Bot, ArrowLeft, Database, 
  Settings, Key, Link as LinkIcon, FileText, 
  Cpu, Activity 
} from 'lucide-react';
import { ProjectType } from '../types';

export const AIStudio: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve state passed from Dashboard or NewProject
  const projectState = location.state || {};
  const projectName = projectState.projectName || '未命名 Dify 项目';
  
  // Specific URLs requested for the demo
  const projectUrl = 'http://127.0.0.1/chat/q3tbxo2KIuZz9OqT';
  const consoleUrl = 'http://127.0.0.1/apps';
  const datasetsUrl = 'http://127.0.0.1/datasets';

  // Mock description if not passed, or use a default
  const description = projectState.description || '该项目旨在通过集成企业私有知识库，构建专业的垂直领域问答助手。';
  const subProjectName = projectState.subProjectName || '默认知识库';

  return (
    <div className="flex flex-col h-full bg-white text-black font-sans">
      {/* Header */}
      <div className="h-16 border-b-2 border-black flex items-center px-6 justify-between bg-gray-50 shrink-0">
          <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="mr-2 p-1 border-2 border-transparent hover:border-black hover:bg-white transition-all"
                title="返回仪表盘"
              >
                  <ArrowLeft className="w-5 h-5 text-black" />
              </button>
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-black text-white">
                  <Bot className="w-5 h-5" />
              </div>
              <div>
                  <h1 className="text-sm font-black uppercase">AI 工作室 (Dify 管控台)</h1>
                  <p className="text-xs font-mono text-gray-600">Project: {projectName}</p>
              </div>
          </div>
          
          <div className="flex items-center gap-2">
             <span className="px-2 py-1 bg-green-100 border border-black text-[10px] font-bold uppercase text-green-800 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                运行中
             </span>
          </div>
      </div>

      {/* Main Content - Management Dashboard */}
      <div className="flex-1 overflow-auto p-8 max-w-6xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Project Overview */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Description Card */}
                <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-black border-dashed pb-2">
                        <FileText className="w-5 h-5" />
                        <h2 className="font-bold text-lg uppercase">项目描述</h2>
                    </div>
                    <p className="text-gray-700 font-mono text-sm leading-relaxed">
                        {description}
                    </p>
                    <div className="mt-4 flex gap-2">
                        <span className="text-xs font-bold border border-black px-2 py-1 bg-gray-100">LLM</span>
                        <span className="text-xs font-bold border border-black px-2 py-1 bg-gray-100">RAG</span>
                        <span className="text-xs font-bold border border-black px-2 py-1 bg-gray-100">Agent</span>
                    </div>
                </div>

                {/* 2. Knowledge Base Configuration */}
                <div className="border-2 border-black p-6 bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            <h2 className="font-bold text-lg uppercase">关联知识库 (RAG)</h2>
                        </div>
                        <a 
                            href={datasetsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold underline hover:bg-black hover:text-white px-2 py-1 transition-colors flex items-center gap-1"
                        >
                            前往 Dify 管理知识库 <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                    
                    <div className="bg-gray-50 border border-black p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white border border-black flex items-center justify-center">
                                <span className="font-black text-xs">DOC</span>
                            </div>
                            <div>
                                <p className="font-bold text-sm">{subProjectName}</p>
                                <p className="text-xs text-gray-500 font-mono">ID: KB-{Math.floor(Math.random() * 10000)} • 索引状态: 已完成</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-xs font-bold">1,240 分段</p>
                             <p className="text-[10px] text-gray-500">Last updated: 2h ago</p>
                        </div>
                    </div>
                    
                    <a 
                        href={datasetsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 p-4 border border-black border-dashed text-center hover:bg-gray-50 cursor-pointer transition-colors block"
                    >
                        <p className="text-xs font-bold text-gray-500 flex items-center justify-center gap-2">
                            <ExternalLink className="w-3 h-3" />
                            在 Dify 后台添加更多数据集
                        </p>
                    </a>
                </div>

                {/* 3. Model Configuration */}
                <div className="border-2 border-black p-6 bg-white">
                     <div className="flex items-center gap-2 mb-4">
                        <Cpu className="w-5 h-5" />
                        <h2 className="font-bold text-lg uppercase">推理模型配置</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border border-black bg-gray-50">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Base Model</p>
                            <p className="font-bold">Gemini 3 Pro</p>
                        </div>
                        <div className="p-3 border border-black bg-gray-50">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Temperature</p>
                            <p className="font-bold font-mono">0.7</p>
                        </div>
                        <div className="p-3 border border-black bg-gray-50">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Top P</p>
                            <p className="font-bold font-mono">0.85</p>
                        </div>
                        <div className="p-3 border border-black bg-gray-50">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Max Tokens</p>
                            <p className="font-bold font-mono">4096</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column: Connection & Actions */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Integration Card */}
                <div className="border-2 border-black p-6 bg-black text-white relative shadow-[8px_8px_0px_0px_rgba(100,100,100,1)]">
                    <div className="flex items-center gap-2 mb-6">
                        <Settings className="w-5 h-5" />
                        <h3 className="font-bold text-lg uppercase">应用集成</h3>
                    </div>

                    <div className="space-y-4 mb-8">
                         <div>
                             <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Web App URL</label>
                             <div className="flex items-center gap-2 border border-white/30 p-2 bg-white/10">
                                 <LinkIcon className="w-3 h-3 text-gray-400" />
                                 <p className="text-xs font-mono truncate">{projectUrl}</p>
                             </div>
                         </div>
                         
                         <div>
                             <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">API Endpoint</label>
                             <div className="flex items-center gap-2 border border-white/30 p-2 bg-white/10">
                                 <Activity className="w-3 h-3 text-gray-400" />
                                 <p className="text-xs font-mono truncate">https://api.dify.ai/v1...</p>
                             </div>
                         </div>

                         <div>
                             <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">API Key</label>
                             <div className="flex items-center gap-2 border border-white/30 p-2 bg-white/10">
                                 <Key className="w-3 h-3 text-gray-400" />
                                 <p className="text-xs font-mono">sk-••••••••••••••••</p>
                             </div>
                         </div>
                    </div>

                    <div className="space-y-3">
                        <a 
                            href={projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-white text-black font-black py-3 border-2 border-transparent hover:bg-gray-200 transition-colors uppercase text-sm"
                        >
                            <ExternalLink className="w-4 h-4 inline mr-2" />
                            启动对话 WebApp
                        </a>
                        <a 
                            href={consoleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center border-2 border-white text-white font-bold py-3 hover:bg-white hover:text-black transition-colors uppercase text-sm"
                        >
                            前往 Dify 后台编排
                        </a>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="border-2 border-black p-6 bg-white">
                    <h3 className="font-bold uppercase mb-4 text-sm">今日使用统计</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span className="text-xs text-gray-600">对话数</span>
                            <span className="font-mono font-bold">42</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span className="text-xs text-gray-600">Token 消耗</span>
                            <span className="font-mono font-bold">128k</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">平均响应时间</span>
                            <span className="font-mono font-bold text-green-600">1.2s</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};