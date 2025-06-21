import React from 'react';
import { X, BarChart3, PieChart, TrendingUp, Clock, Users, Activity } from 'lucide-react';
import { PerceptionData, RegionStats } from '../types';
import { timeOfDayColors, genderColors, ageGroupColors } from '../data/mockData';

interface ChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  perceptionData: PerceptionData[];
  regionStats: RegionStats[];
}

export const ChartsModal: React.FC<ChartsModalProps> = ({
  isOpen,
  onClose,
  perceptionData,
  regionStats
}) => {
  if (!isOpen) return null;

  // Calculate statistics
  const timeStats = perceptionData.reduce((acc, data) => {
    acc[data.timeOfDay] = (acc[data.timeOfDay] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderStats = perceptionData.reduce((acc, data) => {
    acc[data.gender] = (acc[data.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ageStats = perceptionData.reduce((acc, data) => {
    acc[data.ageGroup] = (acc[data.ageGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fearLevelStats = perceptionData.reduce((acc, data) => {
    const level = Math.floor(data.fearIndex / 2.5); // 0-3 scale
    const labels = ['Baixo (0-2)', 'Médio (3-5)', 'Alto (6-7)', 'Crítico (8-10)'];
    const label = labels[Math.min(level, 3)];
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEvaluations = perceptionData.length;
  const averageFear = perceptionData.reduce((sum, data) => sum + data.fearIndex, 0) / totalEvaluations;
  const criticalAreas = regionStats.filter(r => r.averageFearIndex >= 8).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Análise Estatística</h2>
              <p className="text-sm text-gray-600">Gráficos de percepção de insegurança urbana</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-blue-600 font-medium">Total de Avaliações</div>
                  <div className="text-2xl font-bold text-blue-900">{totalEvaluations.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-600 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-red-600 font-medium">Áreas Críticas</div>
                  <div className="text-2xl font-bold text-red-900">{criticalAreas}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <PieChart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-yellow-600 font-medium">Média de Medo</div>
                  <div className="text-2xl font-bold text-yellow-900">{averageFear.toFixed(1)}/10</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-purple-600 font-medium">Regiões Analisadas</div>
                  <div className="text-2xl font-bold text-purple-900">{regionStats.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Time of Day Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Avaliações por Horário</span>
              </h3>
              <div className="space-y-4">
                {Object.entries(timeStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([time, count]) => {
                    const percentage = ((count / totalEvaluations) * 100).toFixed(1);
                    const color = timeOfDayColors[time as keyof typeof timeOfDayColors] || '#6B7280';
                    const label = time === 'manha' ? 'Manhã' : time === 'tarde' ? 'Tarde' : 'Noite';
                    return (
                      <div key={time} className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                            <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: color
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Gender Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5 text-pink-600" />
                <span>Avaliações por Gênero</span>
              </h3>
              <div className="space-y-4">
                {Object.entries(genderStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([gender, count]) => {
                    const percentage = ((count / totalEvaluations) * 100).toFixed(1);
                    const color = genderColors[gender as keyof typeof genderColors] || '#6B7280';
                    const label = gender === 'feminino' ? 'Feminino' : gender === 'masculino' ? 'Masculino' : 'Não informado';
                    return (
                      <div key={gender} className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                            <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: color
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Age Group Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span>Avaliações por Faixa Etária</span>
              </h3>
              <div className="space-y-4">
                {Object.entries(ageStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([age, count]) => {
                    const percentage = ((count / totalEvaluations) * 100).toFixed(1);
                    const color = ageGroupColors[age as keyof typeof ageGroupColors] || '#6B7280';
                    const label = age === 'jovens' ? 'Jovens (18-30)' : age === 'adultos' ? 'Adultos (31-59)' : 'Idosos (60+)';
                    return (
                      <div key={age} className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                            <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: color
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Fear Level Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
                <span>Distribuição do Nível de Medo</span>
              </h3>
              <div className="space-y-4">
                {Object.entries(fearLevelStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([level, count]) => {
                    const percentage = ((count / totalEvaluations) * 100).toFixed(1);
                    const getColor = (level: string) => {
                      if (level.includes('Baixo')) return '#22C55E';
                      if (level.includes('Médio')) return '#EAB308';
                      if (level.includes('Alto')) return '#F97316';
                      return '#EF4444';
                    };
                    const color = getColor(level);
                    return (
                      <div key={level} className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{level}</span>
                            <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: color
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Regional Ranking */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span>Ranking Regional por Índice de Medo</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionStats
                .sort((a, b) => b.averageFearIndex - a.averageFearIndex)
                .map((region, index) => {
                  const getFearColor = (level: number) => {
                    if (level >= 8) return '#EF4444';
                    if (level >= 6) return '#F97316';
                    if (level >= 4) return '#EAB308';
                    return '#22C55E';
                  };
                  
                  return (
                    <div key={region.region} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                          <div className="font-semibold text-gray-900">{region.region}</div>
                        </div>
                        <div 
                          className="text-lg font-bold"
                          style={{ color: getFearColor(region.averageFearIndex) }}
                        >
                          {region.averageFearIndex.toFixed(1)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {region.totalEvaluations} avaliações
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(region.averageFearIndex / 10) * 100}%`,
                              backgroundColor: getFearColor(region.averageFearIndex)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};