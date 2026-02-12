import React, { useState } from 'react';
import { 
  Shield, CheckSquare, Square, Lock, Users, 
  Search, Plus, MoreHorizontal, Edit, Trash2, 
  RefreshCw, Power, X, Save, AlertCircle, Key
} from 'lucide-react';

// --- Types ---
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'disabled';
  lastLogin: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean; // Cannot delete system roles
  permissions: {
    dashboard: boolean;
    dataSpace: boolean;
    autoML: boolean;
    aiStudio: boolean;
    systemSettings: boolean;
  };
}

// --- Mock Data ---
const MOCK_USERS: User[] = [
  { id: 1, email: 'admin@admin.com', name: 'System Admin', role: 'Super Admin', status: 'active', lastLogin: 'Just now' },
  { id: 2, email: 'dev_lead@company.com', name: 'Alex Chen', role: 'Developer', status: 'active', lastLogin: '2 hours ago' },
  { id: 3, email: 'manager@company.com', name: 'Sarah Jones', role: 'Viewer', status: 'active', lastLogin: '1 day ago' },
  { id: 4, email: 'intern@company.com', name: 'Mike Ross', role: 'Viewer', status: 'disabled', lastLogin: '1 week ago' },
];

const MOCK_ROLES: Role[] = [
  { 
    id: 'r1', name: 'Super Admin', description: '系统最高权限，所有模块可见', isSystem: true,
    permissions: { dashboard: true, dataSpace: true, autoML: true, aiStudio: true, systemSettings: true }
  },
  { 
    id: 'r2', name: 'Developer', description: '算法工程师，负责模型训练与应用构建', isSystem: false,
    permissions: { dashboard: true, dataSpace: true, autoML: true, aiStudio: true, systemSettings: false }
  },
  { 
    id: 'r3', name: 'Viewer', description: '业务方，仅查看报表与结果', isSystem: false,
    permissions: { dashboard: true, dataSpace: true, autoML: false, aiStudio: false, systemSettings: false }
  },
];

export const Permissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  
  // -- User State --
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', role: 'Developer' });

  // -- Role State --
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });

  // -- Handlers --

  // User Handlers
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Date.now(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      status: 'active',
      lastLogin: 'Never'
    };
    setUsers([...users, user]);
    setIsUserModalOpen(false);
    setNewUser({ email: '', name: '', role: 'Developer' });
  };

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u));
  };

  const resetPassword = (email: string) => {
    alert(`密码重置邮件已发送至 ${email}`);
  };

  // Role Handlers
  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    const role: Role = {
      id: `r-${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      isSystem: false,
      permissions: { dashboard: true, dataSpace: false, autoML: false, aiStudio: false, systemSettings: false }
    };
    setRoles([...roles, role]);
    setIsRoleModalOpen(false);
    setNewRole({ name: '', description: '' });
  };

  const togglePermission = (roleId: string, key: keyof Role['permissions']) => {
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        // Prevent removing system settings from Super Admin
        if (r.id === 'r1' && key === 'systemSettings') return r;
        return {
          ...r,
          permissions: { ...r.permissions, [key]: !r.permissions[key] }
        };
      }
      return r;
    }));
  };

  const deleteRole = (id: string) => {
    if (confirm('确认删除此角色？关联用户将失去权限。')) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
       {/* Header */}
       <div className="mb-8 border-b-2 border-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-red-600 text-white p-2 border-2 border-black">
                    <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-black uppercase">权限管控中心</h1>
            </div>
            <p className="font-mono text-gray-600 border-l-4 border-red-600 pl-3 ml-1 text-sm">
                System Administration & RBAC Configuration
            </p>
          </div>
          
          <div className="flex border-2 border-black bg-white">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-bold uppercase flex items-center gap-2 ${activeTab === 'users' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
            >
              <Users className="w-4 h-4" /> 用户管理
            </button>
            <button 
              onClick={() => setActiveTab('roles')}
              className={`px-6 py-3 font-bold uppercase flex items-center gap-2 ${activeTab === 'roles' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
            >
              <Lock className="w-4 h-4" /> 角色权限
            </button>
          </div>
       </div>

       {/* --- TAB: USER MANAGEMENT --- */}
       {activeTab === 'users' && (
         <div className="animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="搜索用户 (姓名/邮箱)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-black font-mono text-sm focus:outline-none focus:bg-gray-50"
                  />
               </div>
               <button 
                 onClick={() => setIsUserModalOpen(true)}
                 className="bg-black text-white px-6 py-2 font-bold uppercase border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center gap-2"
               >
                 <Plus className="w-4 h-4" /> 新增用户
               </button>
            </div>

            {/* Users Table */}
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 border-b-2 border-black uppercase text-xs">
                   <tr>
                     <th className="p-4 border-r border-gray-200">User Profile</th>
                     <th className="p-4 border-r border-gray-200">Role</th>
                     <th className="p-4 border-r border-gray-200">Status</th>
                     <th className="p-4 border-r border-gray-200">Last Login</th>
                     <th className="p-4 text-center">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredUsers.map(user => (
                     <tr key={user.id} className="border-b border-gray-100 hover:bg-yellow-50 transition-colors">
                       <td className="p-4 border-r border-gray-100">
                          <div>
                            <p className="font-bold">{user.name}</p>
                            <p className="font-mono text-xs text-gray-500">{user.email}</p>
                          </div>
                       </td>
                       <td className="p-4 border-r border-gray-100">
                          <span className={`px-2 py-1 text-xs font-bold border border-black ${user.role === 'Super Admin' ? 'bg-red-100' : 'bg-gray-100'}`}>
                            {user.role}
                          </span>
                       </td>
                       <td className="p-4 border-r border-gray-100">
                          {user.status === 'active' ? (
                            <span className="flex items-center gap-1 text-green-600 font-bold text-xs uppercase">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400 font-bold text-xs uppercase">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div> Disabled
                            </span>
                          )}
                       </td>
                       <td className="p-4 border-r border-gray-100 font-mono text-xs text-gray-500">
                         {user.lastLogin}
                       </td>
                       <td className="p-4">
                          <div className="flex justify-center gap-2">
                             <button onClick={() => resetPassword(user.email)} className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors" title="Reset Password">
                                <Key className="w-4 h-4" />
                             </button>
                             <button className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors" title="Edit User">
                                <Edit className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => toggleUserStatus(user.id)}
                               className={`p-1 border border-transparent hover:border-black transition-colors ${user.status === 'active' ? 'text-green-600 hover:bg-red-50 hover:text-red-600' : 'text-gray-400 hover:bg-green-50 hover:text-green-600'}`} 
                               title={user.status === 'active' ? 'Disable User' : 'Enable User'}
                             >
                                <Power className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {filteredUsers.length === 0 && (
                 <div className="p-8 text-center text-gray-500 font-mono">No users found.</div>
               )}
            </div>
         </div>
       )}

       {/* --- TAB: ROLE MANAGEMENT --- */}
       {activeTab === 'roles' && (
         <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-black uppercase">角色与权限配置</h2>
               <button 
                 onClick={() => setIsRoleModalOpen(true)}
                 className="bg-white text-black px-6 py-2 font-bold uppercase border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center gap-2"
               >
                 <Plus className="w-4 h-4" /> 新增角色
               </button>
            </div>

            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-black text-white uppercase text-xs">
                    <tr>
                      <th className="p-4 border-r border-gray-700 w-64">Role Definition</th>
                      <th className="p-4 text-center border-r border-gray-700 w-24">Dashboard</th>
                      <th className="p-4 text-center border-r border-gray-700 w-24">Data Space</th>
                      <th className="p-4 text-center border-r border-gray-700 w-24">AutoML</th>
                      <th className="p-4 text-center border-r border-gray-700 w-24">AI Studio</th>
                      <th className="p-4 text-center border-r border-gray-700 w-24 bg-red-900">System</th>
                      <th className="p-4 text-center w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role, idx) => (
                      <tr key={role.id} className={`border-b border-black font-mono ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-4 border-r border-black">
                           <div className="font-bold flex items-center gap-2">
                              {role.name}
                              {role.isSystem && <Lock className="w-3 h-3 text-red-500" title="System Role" />}
                           </div>
                           <div className="text-xs text-gray-500 truncate max-w-[200px]">{role.description}</div>
                        </td>
                        <td className="p-4 text-center border-r border-black/10">
                           <button onClick={() => togglePermission(role.id, 'dashboard')}>
                             {role.permissions.dashboard ? <CheckSquare className="w-5 h-5 mx-auto text-black" /> : <Square className="w-5 h-5 mx-auto text-gray-300" />}
                           </button>
                        </td>
                        <td className="p-4 text-center border-r border-black/10">
                           <button onClick={() => togglePermission(role.id, 'dataSpace')}>
                             {role.permissions.dataSpace ? <CheckSquare className="w-5 h-5 mx-auto text-black" /> : <Square className="w-5 h-5 mx-auto text-gray-300" />}
                           </button>
                        </td>
                        <td className="p-4 text-center border-r border-black/10">
                           <button onClick={() => togglePermission(role.id, 'autoML')}>
                             {role.permissions.autoML ? <CheckSquare className="w-5 h-5 mx-auto text-black" /> : <Square className="w-5 h-5 mx-auto text-gray-300" />}
                           </button>
                        </td>
                        <td className="p-4 text-center border-r border-black/10">
                           <button onClick={() => togglePermission(role.id, 'aiStudio')}>
                             {role.permissions.aiStudio ? <CheckSquare className="w-5 h-5 mx-auto text-black" /> : <Square className="w-5 h-5 mx-auto text-gray-300" />}
                           </button>
                        </td>
                        <td className="p-4 text-center border-r border-black/10 bg-black/5">
                           <button onClick={() => togglePermission(role.id, 'systemSettings')} disabled={role.id === 'r1'} className="disabled:opacity-50 disabled:cursor-not-allowed">
                             {role.permissions.systemSettings ? <CheckSquare className="w-5 h-5 mx-auto text-red-600" /> : <Square className="w-5 h-5 mx-auto text-gray-300" />}
                           </button>
                        </td>
                        <td className="p-4 text-center">
                           {!role.isSystem && (
                             <button onClick={() => deleteRole(role.id)} className="text-xs text-red-600 hover:bg-red-50 p-1 border border-transparent hover:border-red-200">
                                <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-2 text-xs text-gray-500 font-mono items-center">
               <AlertCircle className="w-4 h-4" />
               Changes are saved automatically to the local permission cache.
            </div>
         </div>
       )}

       {/* --- MODAL: ADD USER --- */}
       {isUserModalOpen && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white border-2 border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-50">
               <h3 className="font-black uppercase">新增用户</h3>
               <button onClick={() => setIsUserModalOpen(false)}><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleAddUser} className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-bold mb-1">Full Name</label>
                 <input required className="w-full border-2 border-black p-2 text-sm" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="e.g. John Doe" />
               </div>
               <div>
                 <label className="block text-sm font-bold mb-1">Email</label>
                 <input required type="email" className="w-full border-2 border-black p-2 text-sm" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="user@company.com" />
               </div>
               <div>
                 <label className="block text-sm font-bold mb-1">Role</label>
                 <select className="w-full border-2 border-black p-2 text-sm bg-white" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                   {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                 </select>
               </div>
               <div className="pt-4 flex justify-end gap-2">
                 <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 font-bold hover:bg-gray-100">取消</button>
                 <button type="submit" className="px-4 py-2 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black">保存用户</button>
               </div>
             </form>
           </div>
         </div>
       )}

       {/* --- MODAL: ADD ROLE --- */}
       {isRoleModalOpen && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white border-2 border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-50">
               <h3 className="font-black uppercase">新增角色</h3>
               <button onClick={() => setIsRoleModalOpen(false)}><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleAddRole} className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-bold mb-1">Role Name</label>
                 <input required className="w-full border-2 border-black p-2 text-sm" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} placeholder="e.g. Data Analyst" />
               </div>
               <div>
                 <label className="block text-sm font-bold mb-1">Description</label>
                 <textarea required className="w-full border-2 border-black p-2 text-sm" rows={3} value={newRole.description} onChange={e => setNewRole({...newRole, description: e.target.value})} placeholder="Describe what this role can do..." />
               </div>
               <div className="pt-4 flex justify-end gap-2">
                 <button type="button" onClick={() => setIsRoleModalOpen(false)} className="px-4 py-2 font-bold hover:bg-gray-100">取消</button>
                 <button type="submit" className="px-4 py-2 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black">创建角色</button>
               </div>
             </form>
           </div>
         </div>
       )}

    </div>
  );
};