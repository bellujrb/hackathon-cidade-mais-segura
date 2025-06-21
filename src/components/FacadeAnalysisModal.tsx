import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Brain, Download, Share, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { FacadeAnalysis } from '../types';

interface FacadeAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacadeAnalysisModal: React.FC<FacadeAnalysisModalProps> = ({
  isOpen,
  onClose
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FacadeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysis(null);
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    
    // Simular análise de IA (em produção, seria uma chamada para API de visão computacional)
    setTimeout(() => {
      const mockAnalysis: FacadeAnalysis = {
        id: Date.now().toString(),
        imageUrl: imagePreview!,
        safetyScore: Math.random() * 4 + 3, // Score entre 3-7
        detectedIssues: generateRandomIssues(),
        suggestions: generateRandomSuggestions(),
        analysisDate: new Date().toISOString()
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const generateRandomIssues = (): string[] => {
    const possibleIssues = [
      'Iluminação insuficiente na entrada',
      'Ausência de visibilidade da rua',
      'Barreiras visuais que escondem a entrada',
      'Vegetação densa bloqueando a visão',
      'Falta de sinalização de segurança',
      'Pontos cegos na fachada',
      'Ausência de câmeras de segurança visíveis',
      'Muros muito altos',
      'Falta de manutenção aparente',
      'Áreas escuras próximas à entrada'
    ];
    
    const numIssues = Math.floor(Math.random() * 4) + 1;
    return possibleIssues.sort(() => 0.5 - Math.random()).slice(0, numIssues);
  };

  const generateRandomSuggestions = (): string[] => {
    const possibleSuggestions = [
      'Instalar luminárias direcionadas para a entrada',
      'Podar vegetação para melhorar visibilidade',
      'Adicionar espelhos convexos em pontos cegos',
      'Instalar câmeras de segurança visíveis',
      'Melhorar a iluminação do perímetro',
      'Criar linha de visão clara da rua para a entrada',
      'Adicionar sinalização de segurança',
      'Manter a fachada bem conservada',
      'Instalar sensor de movimento na iluminação',
      'Considerar reduzir altura de muros frontais'
    ];
    
    const numSuggestions = Math.floor(Math.random() * 4) + 2;
    return possibleSuggestions.sort(() => 0.5 - Math.random()).slice(0, numSuggestions);
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return '#22C55E';
    if (score >= 5) return '#EAB308';
    if (score >= 3) return '#F97316';
    return '#EF4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 7) return 'Muito Segura';
    if (score >= 5) return 'Segura';
    if (score >= 3) return 'Moderada';
    return 'Precisa Melhorar';
  };

  const downloadReport = () => {
    if (!analysis) return;
    
    // Em produção, geraria um PDF real
    const reportData = {
      analysis,
      timestamp: new Date().toLocaleString('pt-BR')
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-fachada-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Análise de Fachada com IA</h2>
              <p className="text-sm text-gray-600">Sua casa parece segura?</p>
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
        <div className="p-6">
          {!imagePreview ? (
            /* Upload Section */
            <div className="text-center py-12">
              <div className="mb-6">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Envie uma foto da sua fachada
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Nossa IA analisará sua fachada segundo princípios de segurança ambiental (CPTED) 
                  e fornecerá sugestões personalizadas.
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span>Escolher da Galeria</span>
                </button>
                
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <span>Tirar Foto</span>
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            /* Analysis Section */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Imagem da Fachada</h3>
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Fachada para análise"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <div className="text-sm">Analisando...</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {!analysis && !isAnalyzing && (
                  <button
                    onClick={analyzeImage}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Brain className="h-5 w-5" />
                    <span>Analisar com IA</span>
                  </button>
                )}
              </div>

              {/* Analysis Results */}
              <div className="space-y-6">
                {analysis && (
                  <>
                    {/* Safety Score */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nota de Segurança</h3>
                      <div className="text-center">
                        <div 
                          className="text-4xl font-bold mb-2"
                          style={{ color: getScoreColor(analysis.safetyScore) }}
                        >
                          {analysis.safetyScore.toFixed(1)}/10
                        </div>
                        <div 
                          className="text-lg font-medium"
                          style={{ color: getScoreColor(analysis.safetyScore) }}
                        >
                          {getScoreLabel(analysis.safetyScore)}
                        </div>
                      </div>
                    </div>

                    {/* Detected Issues */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Problemas Detectados</span>
                      </h3>
                      <div className="space-y-2">
                        {analysis.detectedIssues.map((issue, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-red-700 text-sm">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5" />
                        <span>Sugestões de Melhoria</span>
                      </h3>
                      <div className="space-y-3">
                        {analysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700 text-sm">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={downloadReport}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="h-5 w-5" />
                        <span>Baixar Relatório</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: 'Análise de Segurança da Fachada',
                              text: `Minha fachada recebeu nota ${analysis.safetyScore.toFixed(1)}/10 na análise de segurança.`
                            });
                          }
                        }}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Share className="h-5 w-5" />
                        <span>Compartilhar</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <div className="font-semibold mb-2">💡 Sobre a Análise</div>
            <p>
              Nossa IA utiliza princípios de CPTED (Crime Prevention Through Environmental Design) 
              para avaliar fatores como iluminação, visibilidade, manutenção e controle de acesso. 
              As sugestões são baseadas em melhores práticas de segurança ambiental.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};