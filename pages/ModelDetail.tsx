import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Box, 
  GitBranch, 
  Clock, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Database, 
  Cpu, 
  Settings,
  FileText,
  Activity
} from 'lucide-react';
import { modelService, Model, ModelVersion } from '../services/modelService';

export const ModelDetail: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'versions' | 'lineage' | 'settings'>('versions');
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    if (modelId) {
      fetchModel();
    }
  }, [modelId]);

  const fetchModel = async () => {
    setLoading(true);
    try {
      const data = await modelService.getModelById(modelId!);
      setModel(data || null);
    } catch (error) {
      console.error("Failed to fetch model", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (versionId: string) => {
    setPublishing(versionId);
    try {
      await modelService.publishVersion(model!.id, versionId);
      await fetchModel(); // Refresh to see status changes
    } catch (error) {
      console.error("Failed to publish version", error);
    } finally {
      setPublishing(null);
    }
  };

  const handleDownload = async (versionId: string) => {
    try {
      const url = await modelService.downloadModelArtifact(model!.id, versionId);
      // Mock download
      alert(`Downloading artifact from: ${url}`);
    } catch (error) {
      console.error("Failed to download artifact", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Model Not Found</h2>
        <Link to="/model-registry" className="text-blue-600 hover:underline">Return to Registry</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Link to="/model-registry" className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        返回模型仓库
      </Link>

      {/* Header */}
      <div className="bg-white border-2 border-black p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 border-2 border-black">
              <Box className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{model.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200">ID: {model.id}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Updated {new Date(model.updatedAt).toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 text-xs font-bold border ${
                  model.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {model.status}
                </span>
              </div>
              <p className="text-gray-600 max-w-2xl">{model.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Header Actions */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-black mb-6">
        <button
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-4 transition-colors flex items-center gap-2 ${
            activeTab === 'versions' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('versions')}
        >
          <GitBranch className="w-4 h-4" />
          版本历史
        </button>
        <button
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-4 transition-colors flex items-center gap-2 ${
            activeTab === 'lineage' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('lineage')}
        >
          <Activity className="w-4 h-4" />
          血缘溯源
        </button>
        <button
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-4 transition-colors flex items-center gap-2 ${
            activeTab === 'settings' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="w-4 h-4" />
          设置与审计
        </button>
      </div>

      {/* Content */}
      {activeTab === 'versions' && (
        <div className="space-y-4">
          {model.versions.map((version) => (
            <div key={version.id} className="bg-white border-2 border-gray-200 p-6 hover:border-black transition-colors relative">
              {version.status === 'Production' && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 border-l-2 border-b-2 border-black">
                  PRODUCTION
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold font-mono">{version.version}</h3>
                    <span className="text-sm text-gray-500">ID: {version.id}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{version.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-50 p-2 border border-gray-200">
                      <span className="block text-gray-500 text-xs uppercase mb-1">Algorithm</span>
                      <span className="font-bold">{version.algorithm}</span>
                    </div>
                    <div className="bg-gray-50 p-2 border border-gray-200">
                      <span className="block text-gray-500 text-xs uppercase mb-1">Training Time</span>
                      <span className="font-bold">{version.trainingTime}</span>
                    </div>
                    <div className="bg-gray-50 p-2 border border-gray-200">
                      <span className="block text-gray-500 text-xs uppercase mb-1">Created By</span>
                      <span className="font-bold">{version.createdBy}</span>
                    </div>
                    <div className="bg-gray-50 p-2 border border-gray-200">
                      <span className="block text-gray-500 text-xs uppercase mb-1">Created At</span>
                      <span className="font-bold">{new Date(version.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {version.status !== 'Production' && (
                    <button 
                      onClick={() => handlePublish(version.id)}
                      disabled={publishing === version.id}
                      className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 min-w-[140px]"
                    >
                      {publishing === version.id ? 'Publishing...' : '发布为生产版'}
                    </button>
                  )}
                  <button 
                    onClick={() => handleDownload(version.id)}
                    className="px-4 py-2 border-2 border-gray-300 hover:border-black text-gray-600 hover:text-black font-bold text-sm transition-colors flex items-center justify-center gap-2 min-w-[140px]"
                  >
                    <Download className="w-4 h-4" />
                    下载模型包
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Evaluation Metrics</h4>
                <div className="flex gap-6">
                  {Object.entries(version.metrics).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase mb-1">{key}</span>
                      <span className="text-2xl font-mono font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'lineage' && (
        <div className="bg-white border-2 border-black p-8">
          <div className="flex flex-col items-center max-w-3xl mx-auto">
            {/* Data Source */}
            <div className="w-full bg-blue-50 border-2 border-blue-200 p-6 rounded-lg relative">
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white border-2 border-blue-200 rounded-full p-2">
                <Database className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-blue-800 mb-2 ml-6">Source Data</h3>
              <div className="ml-6 space-y-2 text-sm text-blue-700">
                <div className="flex justify-between border-b border-blue-200 pb-1">
                  <span>Dataset:</span>
                  <span className="font-mono font-bold">retail_transactions_v2</span>
                </div>
                <div className="flex justify-between border-b border-blue-200 pb-1">
                  <span>Version:</span>
                  <span className="font-mono font-bold">{model.versions[0]?.dataVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-mono font-bold">2.4 GB (1.2M rows)</span>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="h-12 w-0.5 bg-gray-300 my-2"></div>

            {/* Training Job */}
            <div className="w-full bg-purple-50 border-2 border-purple-200 p-6 rounded-lg relative">
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white border-2 border-purple-200 rounded-full p-2">
                <Cpu className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-purple-800 mb-2 ml-6">Training Job</h3>
              <div className="ml-6 space-y-2 text-sm text-purple-700">
                <div className="flex justify-between border-b border-purple-200 pb-1">
                  <span>Algorithm:</span>
                  <span className="font-mono font-bold">{model.versions[0]?.algorithm}</span>
                </div>
                <div className="flex justify-between border-b border-purple-200 pb-1">
                  <span>Compute:</span>
                  <span className="font-mono font-bold">Standard_NC6 (GPU)</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-mono font-bold">{model.versions[0]?.trainingTime}</span>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="h-12 w-0.5 bg-gray-300 my-2"></div>

            {/* Model Artifact */}
            <div className="w-full bg-green-50 border-2 border-green-200 p-6 rounded-lg relative">
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white border-2 border-green-200 rounded-full p-2">
                <Box className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2 ml-6">Model Artifact</h3>
              <div className="ml-6 space-y-2 text-sm text-green-700">
                <div className="flex justify-between border-b border-green-200 pb-1">
                  <span>Format:</span>
                  <span className="font-mono font-bold">ONNX / Pickle</span>
                </div>
                <div className="flex justify-between border-b border-green-200 pb-1">
                  <span>Size:</span>
                  <span className="font-mono font-bold">450 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Checksum:</span>
                  <span className="font-mono font-bold">sha256:e3b0c442...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              审计日志 (Audit Log)
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 font-bold text-gray-600">Time</th>
                    <th className="px-4 py-2 font-bold text-gray-600">User</th>
                    <th className="px-4 py-2 font-bold text-gray-600">Action</th>
                    <th className="px-4 py-2 font-bold text-gray-600">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 text-gray-500">2023-11-21 08:00:00</td>
                    <td className="px-4 py-2 font-medium">devops@example.com</td>
                    <td className="px-4 py-2">Deployment</td>
                    <td className="px-4 py-2 text-gray-600">Deployed v1.2.0 to Production</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-500">2023-11-20 14:35:00</td>
                    <td className="px-4 py-2 font-medium">alice@example.com</td>
                    <td className="px-4 py-2">Publish</td>
                    <td className="px-4 py-2 text-gray-600">Published v1.2.0</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-500">2023-11-20 14:30:00</td>
                    <td className="px-4 py-2 font-medium">System</td>
                    <td className="px-4 py-2">Registration</td>
                    <td className="px-4 py-2 text-gray-600">Registered new version v1.2.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-200 p-6">
            <h3 className="text-xl font-bold text-red-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-red-700 mb-4">
              Deleting this model will remove all versions, artifacts, and metadata. This action cannot be undone.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">
              Delete Model
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
