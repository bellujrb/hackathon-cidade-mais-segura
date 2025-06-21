export interface PerceptionData {
  id: string;
  latitude: number;
  longitude: number;
  fearIndex: number; // 0-10
  timeOfDay: 'manha' | 'tarde' | 'noite';
  gender: 'feminino' | 'masculino' | 'geral';
  ageGroup: 'jovens' | 'adultos' | 'idosos';
  comment?: string;
  causes: string[];
  date: string;
  region: string;
  imageUrl?: string;
}

export interface RegionStats {
  region: string;
  averageFearIndex: number;
  totalEvaluations: number;
  mainCauses: string[];
  lastEvaluation: string;
  riskLevel: 'baixo' | 'medio' | 'alto' | 'critico';
}

export interface FilterOptions {
  timeOfDay: string[];
  gender: string[];
  ageGroup: string[];
  regions: string[];
}

export interface FacadeAnalysis {
  id: string;
  imageUrl: string;
  safetyScore: number;
  detectedIssues: string[];
  suggestions: string[];
  analysisDate: string;
}

export interface LocationEvaluation {
  latitude: number;
  longitude: number;
  fearLevel: number;
  comment: string;
  imageFile?: File;
  timeOfDay: string;
  gender: string;
  ageGroup: string;
}