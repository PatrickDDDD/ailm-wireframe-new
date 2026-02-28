export const GEMINI_MODEL_CHAT = 'gemini-3-flash-preview';

export const MOCK_PROJECTS = [
  {
    id: '1',
    name: '酒鬼酒销售预测 (2024 Q4)',
    description: '基于历史销售数据和市场投放预测下一季度销售额 (回归任务)',
    subProjectName: '特征工程 V2',
    type: 'ML',
    createdAt: new Date('2023-10-15'),
    status: 'deployed', // Mapped to "已完成"
    accuracy: 94.2
  },
  {
    id: 'app-001',
    name: '企业知识库助手',
    description: '基于公司内部文档（HR手册、IT规范）的智能问答助手，支持引用溯源。',
    subProjectName: 'Chatbot',
    difyType: 'Chatbot',
    type: 'LLM',
    createdAt: new Date('2023-11-02'),
    status: 'active',
    modelName: 'gemini-3-pro-preview',
    externalUrl: 'http://127.0.0.1/app/app-001/configuration'
  },
  {
    id: 'app-002',
    name: '合同生成工作流',
    description: '自动化生成标准销售合同，包含审批流与风险合规检查步骤。',
    subProjectName: 'Workflow',
    difyType: 'Workflow',
    type: 'LLM',
    createdAt: new Date('2023-12-10'),
    status: 'draft',
    modelName: 'gemini-3-flash',
    externalUrl: 'http://127.0.0.1/app/app-002/workflow'
  },
  {
    id: 'app-003',
    name: '数据分析 Agent',
    description: '具备 Python 代码执行能力的数据分析智能体，可处理 CSV/Excel 文件。',
    subProjectName: 'Agent',
    difyType: 'Agent',
    type: 'LLM',
    createdAt: new Date('2023-12-15'),
    status: 'active',
    modelName: 'gemini-3-pro',
    externalUrl: 'http://127.0.0.1/app/app-003/agent'
  },
  {
    id: 'app-004',
    name: '周报生成器',
    description: '根据输入的项目进展要点，自动扩写并格式化为标准周报模版。',
    subProjectName: 'Text Generator',
    difyType: 'Text Generator',
    type: 'LLM',
    createdAt: new Date('2023-12-20'),
    status: 'active', // Stopped mapped to active or draft? Let's use active for now or add 'stopped' to types if needed. Using active.
    modelName: 'gemini-3-flash',
    externalUrl: 'http://127.0.0.1/app/app-004/configuration'
  }
] as const;