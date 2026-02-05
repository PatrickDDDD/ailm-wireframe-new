import React, { useState } from 'react';
import { 
  Database, FileText, Cpu, UploadCloud, 
  Layers, Settings, Search, CheckSquare, Square,
  Activity, Play, FileSpreadsheet, Box, 
  Wifi, WifiOff, RefreshCw, FlaskConical, Send, ArrowRight,
  Plus, Trash2, ExternalLink, Check, MoreHorizontal,
  Link as LinkIcon, Copy, X, Key, ShieldCheck, Loader2
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useApp } from '../context/AppContext';

// --- MOCK DATA ---

const IOT_DATA = Array.from({ length: 20 }, (_, i) => ({
  time: `10:${i < 10 ? '0' + i : i}`,
  temperature: 60 + Math.random() * 20,
  vibration: 20 + Math.random() * 10,
  pressure: 100 + Math.random() * 50
}));

const IOT_DEVICES = [
    { id: 'd1', name: 'Factory_Sensor_A1', location: 'Assembly Line 1', status: 'connected' },
    { id: 'd2', name: 'Factory_Sensor_B2', location: 'Assembly Line 2', status: 'connected' },
    { id: 'd3', name: 'Warehouse_Temp_01', location: 'Warehouse North', status: 'disconnected' },
    { id: 'd4', name: 'Energy_Meter_Main', location: 'Utility Room', status: 'disconnected' },
];

const INITIAL_LOCAL_FILES = [
  { id: 1, name: 'sales_q3_2023.csv', size: '2.4 MB', type: 'CSV', date: '2023-10-01' },
  { id: 2, name: 'customer_churn_v2.xlsx', size: '4.1 MB', type: 'EXCEL', date: '2023-10-05' },
];

const INITIAL_DOC_FILES = [
  { id: 1, name: '员工手册_2024版.pdf', pages: 45, status: 'Indexed' },
  { id: 2, name: '采购合同模板.docx', pages: 12, status: 'Pending' },
];

const INITIAL_KBS = [
    { id: 'kb-1', name: '企业财务制度库', docCount: 4, status: 'Active', difyId: 'ext-fin-001', lastUpdate: '2023-12-10' },
    { id: 'kb-2', name: 'IT运维故障排查', docCount: 12, status: 'Active', difyId: 'ext-ops-022', lastUpdate: '2023-12-15' },
    { id: 'kb-3', name: '产品技术规格书', docCount: 8, status: 'Active', difyId: null, lastUpdate: '2023-12-20' },
];

const MODELS = [
  { id: 'm1', name: 'XGBoost_Sales_V3', type: 'Regression', acc: '94.2%', format: '.pkl', status: 'Ready' },
  { id: 'm2', name: 'ResNet50_Defect_Det', type: 'Vision', acc: '89.5%', format: '.onnx', status: 'Ready' },
];

// --- COMPONENTS ---

const TabButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string;
}> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 font-bold uppercase text-sm border-r-2 border-b-2 transition-all flex-shrink-0
      ${active 
        ? 'bg-black text-white border-black' 
        : 'bg-white text-black border-gray-200 hover:bg-gray-50'
      }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export const DataSpace: React.FC = () => {
  const { user } = useApp();
  const isAdmin = user?.email === 'admin@admin.com';
  
  const [activeTab, setActiveTab] = useState<'assets' | 'kb' | 'iot' | 'models'>('assets');
  
  // -- Assets State --
  const [localFiles, setLocalFiles] = useState(INITIAL_LOCAL_FILES);
  const [docFiles, setDocFiles] = useState(INITIAL_DOC_FILES);

  // -- KB Factory State --
  const [kbMode, setKbMode] = useState<'list' | 'create'>('list');
  const [existingKBs, setExistingKBs] = useState(INITIAL_KBS);
  const [isCreatingKb, setIsCreatingKb] = useState(false);
  
  // KB Creation Wizard State
  const [kbStep, setKbStep] = useState(1);
  const [newKbName, setNewKbName] = useState('');
  const [newKbFiles, setNewKbFiles] = useState<File[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);
  const [chunkSize, setChunkSize] = useState(512);

  // Connection Modal State
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedKb, setSelectedKb] = useState<typeof INITIAL_KBS[0] | null>(null);

  // Model Lab State
  const [testInput, setTestInput] = useState('{"feature1": 20, "feature2": 0.5}');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  // IoT State
  const [devices, setDevices] = useState(IOT_DEVICES);

  // --- HANDLERS ---

  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'struct' | 'doc') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const newEntry = {
              id: Date.now(),
              name: file.name,
              size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
              type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
              date: new Date().toLocaleDateString(),
              pages: Math.floor(Math.random() * 50) + 1, // Mock
              status: 'Uploaded'
          };

          if (type === 'struct') {
              setLocalFiles(prev => [newEntry, ...prev]);
          } else {
              setDocFiles(prev => [newEntry, ...prev]);
          }
      }
  };

  const handleKbFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const filesArray = Array.from(e.target.files);
          setNewKbFiles(prev => [...prev, ...filesArray]);
      }
  };

  const removeKbFile = (idx: number) => {
      setNewKbFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleAssetSelection = (id: number) => {
      setSelectedAssetIds(prev => 
          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
  };

  const createKnowledgeBase = () => {
      setIsCreatingKb(true);
      
      // 1. Simulate API delay
      setTimeout(() => {
          const newKB = {
              id: `kb-${Date.now()}`,
              name: newKbName || '未命名知识库',
              docCount: newKbFiles.length + selectedAssetIds.length,
              status: 'Indexing', // Initial status
              difyId: null,
              lastUpdate: 'Just now'
          };
          
          setExistingKBs(prev => [newKB, ...prev]);
          
          // 2. Reset UI and go back to list
          setIsCreatingKb(false);
          setKbMode('list');
          setKbStep(1);
          setNewKbName('');
          setNewKbFiles([]);
          setSelectedAssetIds([]);

          // 3. Simulate Async Indexing Completion (e.g., after 3 seconds)
          setTimeout(() => {
             setExistingKBs(prev => prev.map(kb => 
                 kb.id === newKB.id ? { ...kb, status: 'Active' } : kb
             ));
          }, 3000);

      }, 1500);
  };

  const openConnectModal = (kb: typeof INITIAL_KBS[0]) => {
      setSelectedKb(kb);
      setConnectModalOpen(true);
  };

  const toggleDevice = (id: string) => {
      if (!isAdmin) return; // Only admin
      setDevices(prev => prev.map(d => 
          d.id === id ? { ...d, status: d.status === 'connected' ? 'disconnected' : 'connected' } : d
      ));
  };

  const runInference = () => {
      setTesting(true);
      setTestResult(null);
      setTimeout(() => {
          setTesting(false);
          setTestResult(`{ "prediction": 4520.50, "confidence": 0.92 }`);
      }, 1000);
  };

  // --- SUB-VIEWS ---

  const renderConnectionModal = () => {
      if (!connectModalOpen || !selectedKb) return null;

      const endpoint = `https://api.ailm.tech/v1/kbs/${selectedKb.id}/retrieve`;
      const apiKey = `ailm-sk-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

      return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white border-2 border-black w-full max-w-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center p-4 border-b-2 border-black bg-gray-50">
                      <div className="flex items-center gap-2">
                          <LinkIcon className="w-5 h-5 text-black" />
                          <h3 className="font-black uppercase">连接 Dify 外部知识库</h3>
                      </div>
                      <button onClick={() => setConnectModalOpen(false)} className="hover:bg-gray-200 p-1">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                      <div className="bg-blue-50 border border-blue-200 p-4 text-xs font-mono text-blue-800 mb-4">
                          <p className="font-bold mb-1 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" /> External Knowledge API 模式
                          </p>
                          请在 Dify 知识库设置中选择 "External API" 类型，并填入以下凭证信息。
                      </div>

                      <div>
                          <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Knowledge Base Name</label>
                          <div className="font-bold text-lg border-b-2 border-gray-100 pb-2">{selectedKb.name}</div>
                      </div>

                      <div>
                          <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">API Endpoint URL</label>
                          <div className="flex">
                              <input 
                                readOnly 
                                value={endpoint} 
                                className="flex-1 bg-gray-100 border-2 border-black border-r-0 p-3 font-mono text-sm text-gray-600 focus:outline-none"
                              />
                              <button 
                                className="bg-black text-white px-4 border-2 border-black hover:bg-gray-800 transition-colors"
                                title="Copy"
                              >
                                  <Copy className="w-4 h-4" />
                              </button>
                          </div>
                      </div>

                      <div>
                          <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">API Key</label>
                          <div className="flex">
                              <div className="flex-1 bg-gray-100 border-2 border-black border-r-0 p-3 font-mono text-sm flex items-center gap-2">
                                  <Key className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{apiKey}</span>
                              </div>
                              <button 
                                className="bg-black text-white px-4 border-2 border-black hover:bg-gray-800 transition-colors"
                                title="Copy"
                              >
                                  <Copy className="w-4 h-4" />
                              </button>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-2 font-mono">* This key grants read-only access to this specific KB.</p>
                      </div>
                  </div>

                  <div className="p-4 border-t-2 border-black bg-gray-50 flex justify-end">
                      <button 
                        onClick={() => setConnectModalOpen(false)}
                        className="bg-black text-white px-6 py-2 font-bold uppercase hover:bg-white hover:text-black border-2 border-black transition-colors"
                      >
                          完成 (Done)
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  const renderDataAssets = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Structured Data Section */}
        <div className="flex flex-col gap-4">
            <label className="bg-white border-2 border-black p-6 flex flex-col items-center justify-center min-h-[200px] border-dashed hover:bg-gray-50 transition-colors cursor-pointer group">
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={(e) => handleAssetUpload(e, 'struct')} />
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                    <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg uppercase">上传结构化数据</h3>
                <p className="text-xs text-gray-500 font-mono mt-2">点击上传 CSV / Excel</p>
                <p className="text-[10px] text-gray-400 font-mono mt-1">用于 AutoML 机器学习任务</p>
            </label>
            
            <div className="bg-white border-2 border-black p-6 flex-1">
                <h3 className="font-bold border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
                    <Database className="w-4 h-4" /> 本地数据集列表
                </h3>
                <div className="max-h-[300px] overflow-auto">
                    <table className="w-full text-sm font-mono">
                        <tbody>
                        {localFiles.map(f => (
                            <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 truncate max-w-[150px]">{f.name}</td>
                            <td className="py-2 text-right"><span className="border border-black px-1 text-[10px]">{f.type}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Document Library Section */}
        <div className="flex flex-col gap-4">
            <label className="bg-white border-2 border-black p-6 flex flex-col items-center justify-center min-h-[200px] border-dashed hover:bg-gray-50 transition-colors cursor-pointer group">
                <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => handleAssetUpload(e, 'doc')} />
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg uppercase">上传非结构化文档</h3>
                <p className="text-xs text-gray-500 font-mono mt-2">点击上传 PDF / Docx</p>
                <p className="text-[10px] text-gray-400 font-mono mt-1">用于构建 RAG 知识库</p>
            </label>

            <div className="bg-white border-2 border-black p-6 flex-1">
                <h3 className="font-bold border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> 文档库列表
                </h3>
                <div className="max-h-[300px] overflow-auto">
                    <table className="w-full text-sm font-mono">
                        <tbody>
                        {docFiles.map(f => (
                            <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 truncate max-w-[150px]">{f.name}</td>
                            <td className="py-2 text-right">
                                <span className={`border px-1 text-[10px] font-bold ${f.status === 'Indexed' ? 'border-black bg-black text-white' : 'border-gray-400 text-gray-400'}`}>
                                {f.status}
                                </span>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const renderIoTHub = () => (
    <div className="animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Device Management List */}
            <div className="bg-white border-2 border-black p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-lg uppercase flex items-center gap-2">
                        <Settings className="w-5 h-5" /> 设备接入管理
                    </h3>
                    {!isAdmin && <span className="text-[10px] bg-gray-200 px-2 py-1 font-bold">Read Only</span>}
                </div>
                
                <div className="space-y-4">
                    {devices.map(device => (
                        <div key={device.id} className="border border-black p-4 flex items-center justify-between bg-gray-50">
                            <div>
                                <p className="font-bold text-sm">{device.name}</p>
                                <p className="text-xs text-gray-500 font-mono">{device.location}</p>
                            </div>
                            <button 
                                onClick={() => toggleDevice(device.id)}
                                disabled={!isAdmin}
                                className={`flex items-center gap-2 px-3 py-1 text-xs font-bold border-2 transition-all
                                    ${device.status === 'connected' 
                                        ? 'bg-green-100 text-green-800 border-green-600' 
                                        : 'bg-white text-gray-400 border-gray-300'
                                    }
                                    ${isAdmin ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-80'}
                                `}
                            >
                                {device.status === 'connected' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                                {device.status === 'connected' ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-6 p-4 border border-dashed border-black text-center text-xs font-bold text-gray-400">
                    + Add MQTT Endpoint (Admin Only)
                </div>
            </div>

            {/* Live Data Chart */}
            <div className="lg:col-span-2 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2 border-dashed">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-black" />
                        <h3 className="font-black text-lg uppercase">实时数据流 (ML Ready)</h3>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 border border-green-200 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div> Receiving
                    </span>
                </div>
                <div className="flex-1 w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={IOT_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" tick={{fontSize: 10}} />
                        <YAxis tick={{fontSize: 10}} />
                        <Tooltip contentStyle={{border: '2px solid black', borderRadius: '0px'}} />
                        <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} name="温度 (Temp)" />
                        <Line type="monotone" dataKey="vibration" stroke="#3b82f6" strokeWidth={2} dot={false} name="震动 (Vib)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex gap-4 text-xs font-mono text-gray-500">
                    <span>Sampling Rate: 100ms</span>
                    <span>Buffer: 2048 pts</span>
                    <span>ML Pipeline: Active</span>
                </div>
            </div>
        </div>
    </div>
  );

  const renderModelRegistry = () => (
    <div className="animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Model List */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {MODELS.map(model => (
                    <div key={model.id} className="bg-white border-2 border-black p-6 relative hover:bg-gray-50">
                        <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 border border-black rounded-full"></div>
                        <h3 className="text-lg font-black mb-1">{model.name}</h3>
                        <p className="text-xs font-mono text-gray-500 mb-4">ID: {model.id} • {model.type}</p>
                        
                        <div className="space-y-2 border-t-2 border-black pt-4 border-dashed mb-6">
                            <div className="flex justify-between text-sm">
                            <span className="font-bold">Accuracy</span>
                            <span className="font-mono">{model.acc}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                            <span className="font-bold">Format</span>
                            <span className="font-mono">{model.format}</span>
                            </div>
                        </div>

                        <button className="w-full bg-black text-white py-2 font-bold text-xs uppercase hover:opacity-80 flex items-center justify-center gap-2">
                             <FlaskConical className="w-4 h-4" /> Load to Lab
                        </button>
                    </div>
                ))}
            </div>

            {/* Inference Lab */}
            <div className="bg-black text-white p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(100,100,100,1)] flex flex-col">
                <div className="flex items-center gap-2 mb-6 border-b border-white/20 pb-4">
                     <FlaskConical className="w-6 h-6 text-yellow-400" />
                     <h3 className="font-bold text-xl uppercase">模型推理实验室</h3>
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Test Input (JSON)</label>
                        <textarea 
                            value={testInput}
                            onChange={(e) => setTestInput(e.target.value)}
                            className="w-full bg-white/10 border border-white/30 p-3 font-mono text-sm text-white focus:outline-none focus:border-white h-32" 
                        />
                    </div>
                    
                    <button 
                        onClick={runInference}
                        disabled={testing}
                        className="w-full bg-white text-black font-black py-3 border-2 border-transparent hover:bg-yellow-400 transition-colors uppercase text-sm flex items-center justify-center gap-2"
                    >
                        {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {testing ? 'Inferencing...' : 'Run Prediction'}
                    </button>

                    <div className="mt-4 border-t border-white/20 pt-4">
                         <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Result</label>
                         <div className="bg-black border border-green-500/50 p-3 min-h-[60px] font-mono text-green-400 text-sm">
                             {testResult || (testing ? "Computing..." : "// Result will appear here")}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderKbList = () => (
      <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase">所有知识库</h2>
              <button 
                onClick={() => setKbMode('create')}
                className="bg-black text-white px-6 py-2 border-2 border-black font-bold flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
              >
                  <Plus className="w-5 h-5" /> 新建知识库
              </button>
          </div>

          <div className="bg-white border-2 border-black overflow-hidden">
             <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 border-b-2 border-black uppercase text-xs">
                     <tr>
                         <th className="p-4">知识库名称 (KB Name)</th>
                         <th className="p-4 text-center">文档数</th>
                         <th className="p-4 text-center">状态</th>
                         <th className="p-4">Last Update</th>
                         <th className="p-4 text-right">Action</th>
                     </tr>
                 </thead>
                 <tbody>
                     {existingKBs.map(kb => (
                         <tr key={kb.id} className="border-b border-gray-100 hover:bg-gray-50 font-mono">
                             <td className="p-4 font-bold text-black">{kb.name}</td>
                             <td className="p-4 text-center">{kb.docCount}</td>
                             <td className="p-4 text-center">
                                 {kb.status === 'Active' ? (
                                     <span className="bg-green-100 text-green-800 border border-green-600 px-2 py-0.5 text-[10px] font-bold uppercase flex items-center justify-center gap-1 w-fit mx-auto">
                                         <Check className="w-3 h-3" /> Active
                                     </span>
                                 ) : (
                                     <span className="bg-yellow-100 text-yellow-800 border border-yellow-600 px-2 py-0.5 text-[10px] font-bold uppercase flex items-center justify-center gap-1 w-fit mx-auto">
                                         <RefreshCw className="w-3 h-3 animate-spin" /> {kb.status}
                                     </span>
                                 )}
                             </td>
                             <td className="p-4 text-gray-500">{kb.lastUpdate}</td>
                             <td className="p-4 text-right flex justify-end gap-2">
                                <button 
                                  onClick={() => openConnectModal(kb)}
                                  className="flex items-center gap-1 px-3 py-1 border border-black text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-colors"
                                  title="Get Connection Details"
                                >
                                    <LinkIcon className="w-3 h-3" /> 连接配置
                                </button>
                                 <button className="p-2 border border-transparent hover:border-black text-gray-400 hover:text-red-600">
                                     <Trash2 className="w-4 h-4" />
                                 </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
             {existingKBs.length === 0 && (
                 <div className="p-12 text-center text-gray-500 font-mono">
                     暂无知识库，请点击新建。
                 </div>
             )}
          </div>
      </div>
  );

  const renderKbWizard = () => (
    <div className="bg-white border-2 border-black p-0 min-h-[600px] flex animate-in fade-in duration-500 relative">
        <button 
          onClick={() => { setKbMode('list'); setKbStep(1); }}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 border border-transparent hover:border-black z-10"
        >
            <MoreHorizontal className="w-5 h-5" />
        </button>

       {/* Sidebar Steps */}
       <div className="w-64 border-r-2 border-black bg-gray-50 p-6 space-y-8">
          <h3 className="font-black text-xl uppercase mb-6">新建知识库</h3>
          {[
            { step: 1, label: '资料上传 & 命名', icon: FileText },
            { step: 2, label: 'Embedding 配置', icon: Cpu },
            { step: 3, label: '向量库 & Rerank', icon: Database },
          ].map(s => (
            <div 
              key={s.step} 
              onClick={() => setKbStep(s.step)}
              className={`flex items-center gap-3 cursor-pointer transition-opacity ${kbStep === s.step ? 'opacity-100' : 'opacity-40'}`}
            >
              <div className={`w-8 h-8 flex items-center justify-center border-2 border-black font-bold text-sm ${kbStep === s.step ? 'bg-black text-white' : 'bg-white'}`}>
                 {s.step}
              </div>
              <div>
                 <p className="font-bold text-sm uppercase">{s.label}</p>
              </div>
            </div>
          ))}
       </div>

       {/* Content Area */}
       <div className="flex-1 p-8">
          {kbStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                 <FileText className="w-6 h-6" /> 资料预处理 (Indexing/Chunking)
               </h2>
               <div className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-sm font-bold mb-2">知识库名称 (KB Name)</label>
                    <input 
                      type="text" 
                      value={newKbName}
                      onChange={(e) => setNewKbName(e.target.value)}
                      className="w-full border-2 border-black p-3 font-mono text-sm bg-white focus:outline-none focus:bg-gray-50"
                      placeholder="例如：产品技术文档库_V1"
                    />
                  </div>

                  {/* Section: Select from Existing Assets */}
                  <div>
                      <label className="block text-sm font-bold mb-2">从资产库选择文档 ({docFiles.length})</label>
                      <div className="border-2 border-black max-h-40 overflow-y-auto bg-gray-50 mb-4">
                          {docFiles.length === 0 ? (
                              <div className="p-4 text-center text-xs text-gray-500 font-mono">
                                  暂无文档资产，请先上传或使用下方直接上传。
                              </div>
                          ) : (
                              docFiles.map(doc => {
                                  const isSelected = selectedAssetIds.includes(doc.id);
                                  return (
                                      <div 
                                          key={doc.id}
                                          onClick={() => toggleAssetSelection(doc.id)}
                                          className={`flex items-center gap-3 p-3 border-b border-gray-200 last:border-0 cursor-pointer transition-colors hover:bg-gray-200 ${isSelected ? 'bg-black text-white hover:bg-gray-800' : ''}`}
                                      >
                                          <div className={`w-4 h-4 border border-current flex items-center justify-center ${isSelected ? 'bg-white' : 'bg-transparent'}`}>
                                              {isSelected && <Check className="w-3 h-3 text-black" />}
                                          </div>
                                          <div className="flex-1 truncate text-xs font-mono">{doc.name}</div>
                                          <div className="text-[10px] opacity-70">{doc.pages} Pages</div>
                                      </div>
                                  );
                              })
                          )}
                      </div>
                  </div>
                  
                  {/* Section: Upload New Files */}
                  <div>
                    <label className="block text-sm font-bold mb-2">或 直接上传新文件</label>
                    <label className="block w-full border-2 border-black border-dashed p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="file" multiple className="hidden" accept=".pdf,.docx,.txt,.md" onChange={handleKbFileUpload} />
                        <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <span className="text-xs font-bold uppercase text-gray-500">点击添加文件</span>
                    </label>

                    {/* File List for New Uploads */}
                    {newKbFiles.length > 0 && (
                        <div className="mt-4 border border-black max-h-40 overflow-auto">
                            {newKbFiles.map((f, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 text-xs font-mono">
                                    <span className="truncate">{f.name}</span>
                                    <button onClick={() => removeKbFile(idx)} className="text-red-500 hover:underline px-2">Remove</button>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">分段长度 (Chunk Size): <span className="font-mono bg-gray-100 px-1">{chunkSize} tokens</span></label>
                    <input 
                      type="range" min="128" max="2048" step="128" 
                      value={chunkSize} onChange={(e) => setChunkSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
               </div>
            </div>
          )}

          {kbStep === 2 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <Cpu className="w-6 h-6" /> Embedding Model
                </h2>
                <div className="grid grid-cols-2 gap-4">
                   <div className="border-2 border-black p-4 bg-black text-white cursor-pointer relative">
                      <div className="absolute top-2 right-2 bg-white text-black text-[10px] font-bold px-1">SELECTED</div>
                      <h4 className="font-bold text-lg">Text-Embedding-3-Small</h4>
                      <p className="text-sm opacity-80 mt-1">OpenAI • 1536 dim</p>
                      <p className="text-xs mt-4 font-mono">Performance: High <br/> Cost: Low</p>
                   </div>
                   <div className="border-2 border-black p-4 bg-white hover:bg-gray-50 cursor-pointer opacity-50">
                      <h4 className="font-bold text-lg">BGE-M3 (Local)</h4>
                      <p className="text-sm text-gray-600 mt-1">BAAI • 1024 dim</p>
                      <p className="text-xs mt-4 font-mono">Privacy: High <br/> Speed: Medium</p>
                   </div>
                </div>
             </div>
          )}

          {kbStep === 3 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <Database className="w-6 h-6" /> 向量库 & Reranking
                </h2>
                <div className="space-y-6 max-w-lg">
                   <div>
                      <label className="block text-sm font-bold mb-2">Target Vector DB</label>
                      <div className="flex gap-4">
                         <button className="flex-1 py-3 border-2 border-black bg-black text-white font-bold">Milvus</button>
                         <button className="flex-1 py-3 border-2 border-black bg-white hover:bg-gray-50 font-bold">Chroma</button>
                         <button className="flex-1 py-3 border-2 border-black bg-white hover:bg-gray-50 font-bold">PGVector</button>
                      </div>
                   </div>
                   <div className="border-t-2 border-black pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold">启用 Rerank (重排序)</label>
                        <div className="w-10 h-5 bg-black rounded-full relative cursor-pointer">
                           <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">使用 Cross-Encoder 对召回结果进行二次精排，提升准确率。</p>
                      <select className="w-full border-2 border-black p-3 font-mono text-sm">
                         <option>BGE-Reranker-Large</option>
                         <option>Cohere Rerank V3</option>
                      </select>
                   </div>
                </div>
             </div>
          )}

          <div className="mt-12 pt-6 border-t-2 border-black flex justify-between">
             <button 
                onClick={() => setKbStep(p => Math.max(1, p - 1))}
                disabled={kbStep === 1 || isCreatingKb}
                className="px-6 py-2 border-2 border-black font-bold disabled:opacity-30"
             >
                上一步
             </button>
             {kbStep < 3 ? (
                <button 
                  onClick={() => setKbStep(p => Math.min(3, p + 1))}
                  className="px-6 py-2 bg-black text-white border-2 border-black font-bold"
                >
                  下一步
                </button>
             ) : (
                <button 
                  onClick={createKnowledgeBase}
                  disabled={!newKbName || (newKbFiles.length === 0 && selectedAssetIds.length === 0) || isCreatingKb}
                  className="px-6 py-2 bg-black text-white border-2 border-black font-bold flex items-center gap-2 disabled:opacity-50"
                >
                   {isCreatingKb ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                   {isCreatingKb ? '提交中...' : '开始构建索引'}
                </button>
             )}
          </div>
       </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase mb-2">数据空间</h1>
        <p className="font-mono text-gray-600">统一数据资产管理、知识库构建工厂与模型推理中心</p>
      </div>

      {renderConnectionModal()}

      {/* Main Tabs */}
      <div className="flex flex-wrap border-2 border-black bg-white mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <TabButton active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} icon={Database} label="数据资产 (Upload)" />
        <TabButton active={activeTab === 'kb'} onClick={() => setActiveTab('kb')} icon={Layers} label="知识库工厂" />
        <TabButton active={activeTab === 'iot'} onClick={() => setActiveTab('iot')} icon={Wifi} label="工业物联 (IoT Hub)" />
        <TabButton active={activeTab === 'models'} onClick={() => setActiveTab('models')} icon={Box} label="模型仓库 (Registry)" />
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'assets' && renderDataAssets()}
        {activeTab === 'kb' && (kbMode === 'list' ? renderKbList() : renderKbWizard())}
        {activeTab === 'iot' && renderIoTHub()}
        {activeTab === 'models' && renderModelRegistry()}
      </div>
    </div>
  );
};