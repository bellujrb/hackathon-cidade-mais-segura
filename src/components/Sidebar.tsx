import React, { useState } from 'react';
import { 
  Filter, 
  BarChart3, 
  Clock, 
  Users, 
  MapPin,
  ChevronDown,
  ChevronRight,
  Activity,
  AlertTriangle,
  Camera,
  Brain
} from 'lucide-react';
import { RegionStats, FilterOptions } from '../types';
import { timeOfDayColors, genderColors, ageGroupColors } from '../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  regionStats: RegionStats[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onOpenFacadeAnalysis: () => void;
  onOpenCharts: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  regionStats,
  filters,
  onFilterChange,
  onOpenFacadeAnalysis,
  onOpenCharts
}) => {
  const [activeSection, setActiveSection] = useState<string>('stats');

  const getFearColor = (level: number) => {
    if (level >= 8) return 'bg-red-100 text-red-800 border-red-200';
    if (level >= 6) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (level >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getFearIcon = (level: number) => {
    if (level >= 8) return '😰';
    if (level >= 6) return '😟';
    if (level >= 4) return '😐';
    return '😌';
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  const totalEvaluations = regionStats.reduce((sum, stat) => sum + stat.totalEvaluations, 0);
  const criticalAreas = regionStats.filter(stat => stat.averageFearIndex >= 8).length;
  const averageFear = regionStats.reduce((sum, stat) => sum + stat.averageFearIndex, 0) / regionStats.length;

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white shadow-xl border-r border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Análise de Percepção</h2>
        <p className="text-sm text-gray-600">Medo do Crime - Brasília DF</p>
        
        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-xs text-gray-500">Avaliações</div>
                <div className="font-bold text-blue-600">{totalEvaluations}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-xs text-gray-500">Média Geral</div>
                <div className="font-bold text-red-600">{averageFear.toFixed(1)}/10</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button
            onClick={onOpenCharts}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Ver Gráficos</span>
          </button>
          
          <button
            onClick={onOpenFacadeAnalysis}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
          >
            <Camera className="h-4 w-4" />
            <span>Análise de Fachada IA</span>
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('stats')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <div>
              <span className="font-semibold text-gray-900">Estatísticas por Região</span>
              <div className="text-xs text-gray-500">Índices de medo por área</div>
            </div>
          </div>
          {activeSection === 'stats' ? 
            <ChevronDown className="h-4 w-4 text-gray-400" /> : 
            <ChevronRight className="h-4 w-4 text-gray-400" />
          }
        </button>
        
        {activeSection === 'stats' && (
          <div className="px-4 pb-4 space-y-3">
            {regionStats
              .sort((a, b) => b.averageFearIndex - a.averageFearIndex)
              .map((stat) => (
              <div key={stat.region} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm text-gray-900 flex items-center space-x-2">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span>{stat.region}</span>
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getFearColor(stat.averageFearIndex)}`}>
                    {getFearIcon(stat.averageFearIndex)} {stat.averageFearIndex.toFixed(1)}/10
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white rounded-lg p-2 border border-gray-100">
                    <div className="text-gray-500">Avaliações</div>
                    <div className="font-bold text-lg text-gray-900">{stat.totalEvaluations}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-gray-100">
                    <div className="text-gray-500">Causa Principal</div>
                    <div className="font-semibold text-gray-700 capitalize">{stat.mainCauses[0]}</div>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  <div>Principais causas: {stat.mainCauses.slice(0, 2).join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('filters')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <div>
              <span className="font-semibold text-gray-900">Camadas Ajustáveis</span>
              <div className="text-xs text-gray-500">Filtrar por horário, gênero e idade</div>
            </div>
          </div>
          {activeSection === 'filters' ? 
            <ChevronDown className="h-4 w-4 text-gray-400" /> : 
            <ChevronRight className="h-4 w-4 text-gray-400" />
          }
        </button>
        
        {activeSection === 'filters' && (
          <div className="px-4 pb-4 space-y-6">
            {/* Time of Day */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="inline h-4 w-4 mr-2" />
                Horário
              </label>
              <div className="space-y-3">
                {Object.entries(timeOfDayColors).map(([time, color]) => (
                  <label key={time} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.timeOfDay.includes(time)}
                      onChange={(e) => {
                        const newTimes = e.target.checked
                          ? [...filters.timeOfDay, time]
                          : filters.timeOfDay.filter(t => t !== time);
                        onFilterChange({ ...filters, timeOfDay: newTimes });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-gray-700 capitalize font-medium">
                        {time === 'manha' ? 'Manhã' : time === 'tarde' ? 'Tarde' : 'Noite'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Users className="inline h-4 w-4 mr-2" />
                Gênero da Percepção
              </label>
              <div className="space-y-3">
                {Object.entries(genderColors).map(([gender, color]) => (
                  <label key={gender} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.gender.includes(gender)}
                      onChange={(e) => {
                        const newGenders = e.target.checked
                          ? [...filters.gender, gender]
                          : filters.gender.filter(g => g !== gender);
                        onFilterChange({ ...filters, gender: newGenders });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-gray-700 capitalize font-medium">
                        {gender === 'feminino' ? 'Feminina' : gender === 'masculino' ? 'Masculina' : 'Geral'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Age Group */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Activity className="inline h-4 w-4 mr-2" />
                Faixa Etária
              </label>
              <div className="space-y-3">
                {Object.entries(ageGroupColors).map(([age, color]) => (
                  <label key={age} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.ageGroup.includes(age)}
                      onChange={(e) => {
                        const newAges = e.target.checked
                          ? [...filters.ageGroup, age]
                          : filters.ageGroup.filter(a => a !== age);
                        onFilterChange({ ...filters, ageGroup: newAges });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-gray-700 capitalize font-medium">
                        {age === 'jovens' ? 'Jovens' : age === 'adultos' ? 'Adultos' : 'Idosos'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-red-500 rounded"></div>
          <span>Legenda - Índice de Medo</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded-lg border border-green-200">
            <span className="text-green-700 font-medium flex items-center space-x-2">
              <span>😌</span>
              <span>Baixo (0-3)</span>
            </span>
            <div className="w-6 h-4 rounded bg-gradient-to-r from-green-300 to-green-400 border border-green-300"></div>
          </div>
          <div className="flex items-center justify-between text-sm p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-yellow-700 font-medium flex items-center space-x-2">
              <span>😐</span>
              <span>Médio (4-5)</span>
            </span>
            <div className="w-6 h-4 rounded bg-gradient-to-r from-yellow-300 to-yellow-400 border border-yellow-300"></div>
          </div>
          <div className="flex items-center justify-between text-sm p-2 bg-orange-50 rounded-lg border border-orange-200">
            <span className="text-orange-700 font-medium flex items-center space-x-2">
              <span>😟</span>
              <span>Alto (6-7)</span>
            </span>
            <div className="w-6 h-4 rounded bg-gradient-to-r from-orange-400 to-orange-500 border border-orange-300"></div>
          </div>
          <div className="flex items-center justify-between text-sm p-2 bg-red-50 rounded-lg border border-red-200">
            <span className="text-red-700 font-medium flex items-center space-x-2">
              <span>😰</span>
              <span>Crítico (8-10)</span>
            </span>
            <div className="w-6 h-4 rounded bg-gradient-to-r from-red-500 to-red-600 border border-red-300"></div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-700">
            <div className="font-semibold mb-1">💡 Como usar</div>
            <div>Clique no mapa para selecionar um local e avaliá-lo. O mapa de calor mostra a intensidade do medo do crime por região.</div>
          </div>
        </div>
      </div>
    </div>
  );
};