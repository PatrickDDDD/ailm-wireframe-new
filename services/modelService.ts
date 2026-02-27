import { v4 as uuidv4 } from 'uuid';

export type ModelStatus = 'Active' | 'Archived' | 'Deprecated';
export type ModelType = 'Classification' | 'Regression' | 'Clustering';
export type DeploymentStatus = 'Running' | 'Stopped' | 'Failed';

export interface ModelVersion {
  id: string;
  version: string;
  createdAt: string;
  createdBy: string;
  trainingTime: string; // e.g., "2h 15m"
  dataVersion: string;
  algorithm: string;
  hyperparameters: Record<string, any>;
  metrics: Record<string, number>; // e.g., { accuracy: 0.95, f1: 0.94 }
  status: 'Production' | 'Staging' | 'Archived';
  description?: string;
  artifactUrl?: string;
}

export interface Model {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  type: ModelType;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: ModelStatus;
  versions: ModelVersion[];
  tags: string[];
}

export interface Deployment {
  id: string;
  modelId: string;
  modelName: string;
  modelVersion: string;
  endpointUrl: string;
  environment: 'Production' | 'Staging' | 'Development';
  deployedBy: string;
  deployedAt: string;
  status: DeploymentStatus;
  description?: string;
}

// Mock Data
const MOCK_MODELS: Model[] = [
  {
    id: 'm-001',
    name: 'Customer Churn Predictor',
    projectId: 'p-001',
    projectName: 'Retail Analytics',
    type: 'Classification',
    description: 'Predicts likelihood of customer churn based on transaction history.',
    createdAt: '2023-10-15T10:00:00Z',
    updatedAt: '2023-11-20T14:30:00Z',
    status: 'Active',
    tags: ['retail', 'churn', 'xgboost'],
    versions: [
      {
        id: 'v-1.2.0',
        version: '1.2.0',
        createdAt: '2023-11-20T14:30:00Z',
        createdBy: 'alice@example.com',
        trainingTime: '45m',
        dataVersion: 'd-20231119',
        algorithm: 'XGBoost',
        hyperparameters: { learning_rate: 0.01, max_depth: 5 },
        metrics: { accuracy: 0.92, f1: 0.89, auc: 0.95 },
        status: 'Production',
        description: 'Retrained with Q3 data.'
      },
      {
        id: 'v-1.1.0',
        version: '1.1.0',
        createdAt: '2023-10-15T10:00:00Z',
        createdBy: 'alice@example.com',
        trainingTime: '40m',
        dataVersion: 'd-20231014',
        algorithm: 'XGBoost',
        hyperparameters: { learning_rate: 0.05, max_depth: 4 },
        metrics: { accuracy: 0.88, f1: 0.85, auc: 0.91 },
        status: 'Archived',
        description: 'Initial release.'
      }
    ]
  },
  {
    id: 'm-002',
    name: 'Product Recommendation Engine',
    projectId: 'p-001',
    projectName: 'Retail Analytics',
    type: 'Clustering',
    description: 'Groups products for cross-selling recommendations.',
    createdAt: '2023-09-01T09:00:00Z',
    updatedAt: '2023-09-01T09:00:00Z',
    status: 'Active',
    tags: ['recommendation', 'kmeans'],
    versions: [
      {
        id: 'v-1.0.0',
        version: '1.0.0',
        createdAt: '2023-09-01T09:00:00Z',
        createdBy: 'bob@example.com',
        trainingTime: '1h 20m',
        dataVersion: 'd-20230830',
        algorithm: 'K-Means',
        hyperparameters: { k: 15 },
        metrics: { silhouette_score: 0.76 },
        status: 'Production',
        description: 'Baseline clustering model.'
      }
    ]
  },
  {
    id: 'm-003',
    name: 'Sales Forecasting',
    projectId: 'p-003',
    projectName: 'Supply Chain Optimization',
    type: 'Regression',
    description: 'Forecasts weekly sales volume for inventory planning.',
    createdAt: '2023-12-10T09:00:00Z',
    updatedAt: '2023-12-15T11:00:00Z',
    status: 'Active',
    tags: ['supply-chain', 'forecasting', 'arima'],
    versions: [
      {
        id: 'v-1.0.0',
        version: '1.0.0',
        createdAt: '2023-12-15T11:00:00Z',
        createdBy: 'david@example.com',
        trainingTime: '30m',
        dataVersion: 'd-20231214',
        algorithm: 'ARIMA',
        hyperparameters: { p: 1, d: 1, q: 1 },
        metrics: { rmse: 150.5, mae: 120.2 },
        status: 'Production',
        description: 'Initial model for Q1 planning.'
      }
    ]
  }
];

const MOCK_DEPLOYMENTS: Deployment[] = [
  {
    id: 'dep-001',
    modelId: 'm-001',
    modelName: 'Customer Churn Predictor',
    modelVersion: '1.2.0',
    endpointUrl: 'https://api.internal.corp/v1/churn-predict',
    environment: 'Production',
    deployedBy: 'devops@example.com',
    deployedAt: '2023-11-21T08:00:00Z',
    status: 'Running',
    description: 'Main production endpoint for CRM integration.'
  },
  {
    id: 'dep-002',
    modelId: 'm-003',
    modelName: 'Sales Forecasting',
    modelVersion: '1.0.0',
    endpointUrl: 'http://10.0.0.5:8000/forecast',
    environment: 'Staging',
    deployedBy: 'david@example.com',
    deployedAt: '2023-12-16T09:30:00Z',
    status: 'Running',
    description: 'Testing endpoint for inventory team.'
  }
];

// Service Functions

export const modelService = {
  getModels: async (): Promise<Model[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_MODELS];
  },

  getModelById: async (id: string): Promise<Model | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_MODELS.find(m => m.id === id);
  },

  getDeployments: async (): Promise<Deployment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_DEPLOYMENTS];
  },

  registerDeployment: async (deployment: Omit<Deployment, 'id' | 'deployedAt' | 'status'>): Promise<Deployment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newDeployment: Deployment = {
      ...deployment,
      id: `dep-${uuidv4().substring(0, 8)}`,
      deployedAt: new Date().toISOString(),
      status: 'Running'
    };
    MOCK_DEPLOYMENTS.push(newDeployment);
    return newDeployment;
  },

  updateModelStatus: async (modelId: string, status: ModelStatus): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const model = MOCK_MODELS.find(m => m.id === modelId);
    if (model) {
      model.status = status;
    }
  },

  publishVersion: async (modelId: string, versionId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const model = MOCK_MODELS.find(m => m.id === modelId);
    if (model) {
        // Set all others to Archived if they were Production
        model.versions.forEach(v => {
            if (v.status === 'Production') v.status = 'Archived';
        });
        // Set target to Production
        const version = model.versions.find(v => v.id === versionId);
        if (version) version.status = 'Production';
    }
  },
  
  downloadModelArtifact: async (modelId: string, versionId: string): Promise<string> => {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate packaging
      return `https://storage.example.com/models/${modelId}/${versionId}/model.tar.gz`;
  }
};
