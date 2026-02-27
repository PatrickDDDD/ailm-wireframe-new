import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  MoreHorizontal, 
  Box, 
  Clock, 
  Tag, 
  Activity,
  Server,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { modelService, Model, Deployment, ModelStatus, ModelType } from '../services/modelService';

export const ModelRegistry: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'models' | 'deployments'>('models');
  const [models, setModels] = useState<Model[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ModelStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<ModelType | 'All'>('All');

  // New Deployment Form State
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [newDeployment, setNewDeployment] = useState<Partial<Deployment>>({
    environment: 'Staging',
    endpointUrl: '',
    modelId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [modelsData, deploymentsData] = await Promise.all([
        modelService.getModels(),
        modelService.getDeployments()
      ]);
      setModels(modelsData);
      setDeployments(deploymentsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          model.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || model.status === statusFilter;
    const matchesType = typeFilter === 'All' || model.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRegisterDeployment = async () => {
    if (!newDeployment.modelId || !newDeployment.endpointUrl) return;
    
    const selectedModel = models.find(m => m.id === newDeployment.modelId);
    if (!selectedModel) return;

    // Default to latest version for simplicity in this mock
    const latestVersion = selectedModel.versions[0]?.version || 'v1.0';

    try {
      await modelService.registerDeployment({
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        modelVersion: latestVersion,
        endpointUrl: newDeployment.endpointUrl!,
        environment: newDeployment.environment as any,
        deployedBy: 'current_user', // Mock user
        description: newDeployment.description
      });
      setShowDeployModal(false);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to register deployment", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Deprecated': return 'bg-red-100 text-red-800 border-red-200';
      case 'Running': return 'bg-green-100 text-green-800 border-green-200';
      case 'Stopped': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">模型仓库</h1>
          <p className="text-gray-600">管理已训练的机器学习模型及其版本，追踪外部部署状态。</p>
        </div>
        <div className="flex gap-2">
            {/* Action buttons could go here */}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-black mb-6">
        <button
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-4 transition-colors ${
            activeTab === 'models' 
              ? 'border-black text-black' 
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('models')}
        >
          模型列表
        </button>
        <button
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-4 transition-colors ${
            activeTab === 'deployments' 
              ? 'border-black text-black' 
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('deployments')}
        >
          外部部署登记
        </button>
      </div>

      {activeTab === 'models' && (
        <>
          {/* Filters */}
          <div className="bg-white border-2 border-black p-4 mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索模型名称或项目..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                className="border border-gray-300 py-2 px-3 focus:outline-none focus:border-black bg-white"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
              >
                <option value="All">所有类型</option>
                <option value="Classification">分类 (Classification)</option>
                <option value="Regression">回归 (Regression)</option>
                <option value="Clustering">聚类 (Clustering)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select 
                className="border border-gray-300 py-2 px-3 focus:outline-none focus:border-black bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All">所有状态</option>
                <option value="Active">活跃 (Active)</option>
                <option value="Archived">归档 (Archived)</option>
                <option value="Deprecated">弃用 (Deprecated)</option>
              </select>
            </div>
          </div>

          {/* Model Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-500">加载模型中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <Link 
                  key={model.id} 
                  to={`/model-registry/${model.id}`}
                  className="block group"
                >
                  <div className="bg-white border-2 border-black p-6 h-full transition-transform transform group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-2 py-1 text-xs font-bold border ${getStatusColor(model.status)}`}>
                        {model.status}
                      </div>
                      <Box className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-1 group-hover:underline decoration-2 underline-offset-4">
                      {model.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 font-mono">
                      {model.projectName}
                    </p>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 h-10">
                      {model.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {model.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{model.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(model.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {filteredModels.length === 0 && (
                <div className="col-span-full text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300">
                  <Box className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">未找到匹配的模型</p>
                  <p className="text-sm text-gray-400">尝试调整筛选条件或搜索关键词</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'deployments' && (
        <>
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setShowDeployModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              登记新部署
            </button>
          </div>

          <div className="bg-white border-2 border-black overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-black">
                  <th className="p-4 font-bold text-sm uppercase tracking-wider border-r border-gray-200">模型名称</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider border-r border-gray-200">版本</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider border-r border-gray-200">环境</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider border-r border-gray-200">Endpoint URL</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider border-r border-gray-200">状态</th>
                  <th className="p-4 font-bold text-sm uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((dep) => (
                  <tr key={dep.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 border-r border-gray-200 font-medium">
                      <Link to={`/model-registry/${dep.modelId}`} className="hover:underline">
                        {dep.modelName}
                      </Link>
                    </td>
                    <td className="p-4 border-r border-gray-200 font-mono text-sm">{dep.modelVersion}</td>
                    <td className="p-4 border-r border-gray-200">
                      <span className={`px-2 py-1 text-xs font-bold border ${
                        dep.environment === 'Production' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {dep.environment}
                      </span>
                    </td>
                    <td className="p-4 border-r border-gray-200 font-mono text-xs text-gray-600 truncate max-w-xs" title={dep.endpointUrl}>
                      {dep.endpointUrl}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        {dep.status === 'Running' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {dep.status === 'Stopped' && <XCircle className="w-4 h-4 text-gray-400" />}
                        {dep.status === 'Failed' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <span className="text-sm">{dep.status}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button className="text-gray-400 hover:text-black">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {deployments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      暂无外部部署记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Deployment Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-2 border-black p-6 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-bold mb-4">登记外部部署</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">选择模型</label>
                <select 
                  className="w-full border-2 border-gray-200 p-2 focus:border-black outline-none"
                  value={newDeployment.modelId}
                  onChange={(e) => setNewDeployment({...newDeployment, modelId: e.target.value})}
                >
                  <option value="">请选择模型...</option>
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">部署环境</label>
                <select 
                  className="w-full border-2 border-gray-200 p-2 focus:border-black outline-none"
                  value={newDeployment.environment}
                  onChange={(e) => setNewDeployment({...newDeployment, environment: e.target.value as any})}
                >
                  <option value="Development">Development</option>
                  <option value="Staging">Staging</option>
                  <option value="Production">Production</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Endpoint URL</label>
                <input 
                  type="text"
                  className="w-full border-2 border-gray-200 p-2 focus:border-black outline-none"
                  placeholder="https://api.example.com/v1/predict"
                  value={newDeployment.endpointUrl}
                  onChange={(e) => setNewDeployment({...newDeployment, endpointUrl: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">描述 (可选)</label>
                <textarea 
                  className="w-full border-2 border-gray-200 p-2 focus:border-black outline-none h-24"
                  placeholder="部署用途说明..."
                  value={newDeployment.description || ''}
                  onChange={(e) => setNewDeployment({...newDeployment, description: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowDeployModal(false)}
                className="px-4 py-2 text-gray-600 font-bold hover:text-black"
              >
                取消
              </button>
              <button 
                onClick={handleRegisterDeployment}
                disabled={!newDeployment.modelId || !newDeployment.endpointUrl}
                className="px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认登记
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
