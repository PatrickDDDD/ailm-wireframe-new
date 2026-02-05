import React from 'react';
import { Shield, CheckSquare, Square, Lock, Users } from 'lucide-react';

const USERS = [
  { id: 1, email: 'admin@admin.com', role: 'Super Admin' },
  { id: 2, email: 'data_scientist@company.com', role: 'Developer' },
  { id: 3, email: 'manager@company.com', role: 'Viewer' },
  { id: 4, email: 'sales_vp@company.com', role: 'Viewer' },
  { id: 5, email: 'intern@company.com', role: 'Limited' },
];

export const Permissions: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
       <div className="mb-8 border-b-2 border-black pb-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="bg-red-600 text-white p-2 border-2 border-black">
                <Shield className="w-8 h-8" />
             </div>
             <h1 className="text-4xl font-black uppercase">权限管控中心</h1>
          </div>
          <p className="font-mono text-gray-600 border-l-4 border-red-600 pl-3 ml-1">
             仅超级管理员 (admin@admin.com) 可访问。配置企业级数据访问策略与功能授权。
          </p>
       </div>
       
       <div className="bg-white border-2 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
         <div className="p-6 bg-gray-50 border-b-2 border-black flex justify-between items-center">
             <h3 className="font-bold uppercase flex items-center gap-2">
                <Users className="w-5 h-5" /> 用户授权矩阵
             </h3>
             <div className="flex gap-2">
                <button className="px-4 py-2 border-2 border-black bg-white text-xs font-bold uppercase hover:bg-gray-200">添加角色</button>
                <button className="px-4 py-2 border-2 border-black bg-black text-white text-xs font-bold uppercase hover:bg-gray-800">保存变更</button>
             </div>
         </div>

         <div className="overflow-x-auto">
           <table className="w-full text-sm">
             <thead className="bg-black text-white">
               <tr>
                 <th className="p-4 text-left border-r border-gray-700">User Identity</th>
                 <th className="p-4 text-center border-r border-gray-700 w-32">IoT Streams</th>
                 <th className="p-4 text-center border-r border-gray-700 w-32">ML Datasets</th>
                 <th className="p-4 text-center border-r border-gray-700 w-32">Sensitive Docs</th>
                 <th className="p-4 text-center border-r border-gray-700 w-32">Model Registry</th>
                 <th className="p-4 text-center border-r border-gray-700 w-32">System Config</th>
                 <th className="p-4 text-center w-24">Action</th>
               </tr>
             </thead>
             <tbody>
               {USERS.map((user, idx) => (
                 <tr key={user.id} className={`border-b border-black font-mono hover:bg-yellow-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                   <td className="p-4 border-r border-black">
                      <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold text-xs ${user.role === 'Super Admin' ? 'bg-black text-white' : 'bg-white'}`}>
                              {user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-black">{user.email}</p>
                            <p className="text-xs text-gray-500 uppercase flex items-center gap-1">
                                {user.role === 'Super Admin' && <Shield className="w-3 h-3 text-red-600" />}
                                {user.role}
                            </p>
                          </div>
                      </div>
                   </td>
                   
                   {/* IoT */}
                   <td className="p-4 text-center border-r border-black/10">
                      {user.role === 'Limited' ? <Square className="w-5 h-5 mx-auto text-gray-300" /> : <CheckSquare className="w-5 h-5 mx-auto cursor-pointer" />}
                   </td>
                   
                   {/* ML */}
                   <td className="p-4 text-center border-r border-black/10">
                      {user.role === 'Viewer' || user.role === 'Limited' ? <Square className="w-5 h-5 mx-auto text-gray-300" /> : <CheckSquare className="w-5 h-5 mx-auto cursor-pointer" />}
                   </td>
                   
                   {/* Docs */}
                   <td className="p-4 text-center border-r border-black/10">
                      {user.role === 'Super Admin' ? <CheckSquare className="w-5 h-5 mx-auto cursor-pointer" /> : <Lock className="w-4 h-4 mx-auto text-gray-400" />}
                   </td>
                   
                   {/* Models */}
                   <td className="p-4 text-center border-r border-black/10">
                      <CheckSquare className="w-5 h-5 mx-auto cursor-pointer" />
                   </td>

                   {/* System */}
                   <td className="p-4 text-center border-r border-black/10 bg-gray-100">
                      {user.role === 'Super Admin' ? <CheckSquare className="w-5 h-5 mx-auto text-red-600 cursor-pointer" /> : <Square className="w-5 h-5 mx-auto text-gray-300" />}
                   </td>
                   
                   <td className="p-4 text-center">
                      <button className="text-xs font-bold underline hover:bg-black hover:text-white px-2 py-1 transition-colors">Edit</button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         
         <div className="p-4 bg-gray-50 border-t-2 border-black text-xs font-mono text-gray-500 flex justify-between">
            <span>Last audit log: 2 mins ago by admin</span>
            <span>Security Level: High</span>
         </div>
       </div>
    </div>
  );
};