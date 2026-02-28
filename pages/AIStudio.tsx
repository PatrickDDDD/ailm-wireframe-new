import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProjectType } from '../types';
import { 
  ExternalLink, Bot, ArrowLeft, FileText, 
  Cpu, Activity, Plus, Search, MoreHorizontal,
  Workflow, MessageSquare, Sparkles, Settings
} from 'lucide-react';

export const AIStudio: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dify Console URL (Mock)
  const difyConsoleUrl = 'http://127.0.0.1/apps';

  // Filter for LLM projects
  const difyProjects = projects.filter(p => p.type === ProjectType.LLM);

  const filteredProjects = difyProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'Chatbot': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Workflow': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Agent': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = (type: string | undefined) => {
      switch(type) {
          case 'Workflow': return Workflow;
          case 'Agent': return Sparkles;
          case 'Text Generator': return FileText;
          default: return Bot;
      }
  };

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
                  <Cpu className="w-5 h-5" />
              </div>
              <div>
                  <h1 className="text-sm font-black uppercase">AI 工作室 (Dify Projects)</h1>
                  <p className="text-xs font-mono text-gray-600">Orchestration & Management</p>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
             <a 
                href={difyConsoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black font-bold text-xs uppercase hover:bg-white hover:text-black transition-colors"
             >
                <Settings className="w-4 h-4" />
                前往 Dify 后台编排
             </a>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 max-w-7xl mx-auto w-full">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="搜索应用名称或描述..." 
                    className="w-full pl-10 pr-4 py-3 border-2 border-black focus:outline-none focus:bg-gray-50 font-mono text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <a 
                href={difyConsoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-black border-2 border-black font-bold text-sm uppercase hover:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
            >
                <Plus className="w-4 h-4" />
                创建新应用 (Create App)
            </a>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => {
                const Icon = getIcon(project.difyType);
                return (
                <div key={project.id} className="bg-white border-2 border-black p-6 flex flex-col h-full hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 border-2 border-black bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors">
                            <Icon className="w-6 h-6" />
                        </div>
                        <button className="text-gray-400 hover:text-black">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mb-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-black text-lg">{project.name}</h3>
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${getTypeColor(project.difyType)}`}>
                                {project.difyType || 'Chatbot'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                            {project.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                            <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                {project.status}
                            </span>
                            <span>Updated {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t-2 border-black border-dashed grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => navigate(`/ai-studio/${project.id}`, { state: project })}
                            className="py-2 text-xs font-bold uppercase border-2 border-transparent hover:border-black transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-3 h-3" />
                            运行预览
                        </button>
                        <a 
                            href={project.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 text-xs font-bold uppercase bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
                        >
                            <Settings className="w-3 h-3" />
                            编排管理
                        </a>
                    </div>
                </div>
            )})}

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-300 bg-gray-50">
                    <p className="text-gray-500 font-mono mb-4">未找到匹配的应用</p>
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="text-sm font-bold underline hover:text-black"
                    >
                        清除搜索
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};