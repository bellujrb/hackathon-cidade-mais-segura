import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, MessageCircle, Sparkles } from 'lucide-react';
import { IncidentData, RegionStats } from '../types';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: IncidentData[];
  regionStats: RegionStats[];
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const ChatBot: React.FC<ChatBotProps> = ({
  isOpen,
  onClose,
  incidents,
  regionStats
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Olá! Sou o assistente de análise de segurança de Brasília. Posso ajudá-lo com informações sobre incidentes, estatísticas regionais e tendências de criminalidade. Como posso ajudar?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Análise de dados para respostas inteligentes
    const totalIncidents = incidents.length;
    const criticalAreas = regionStats.filter(r => r.riskLevel === 'critico');
    const mostDangerousRegion = regionStats.sort((a, b) => b.totalIncidents - a.totalIncidents)[0];
    const safestRegion = regionStats.sort((a, b) => a.totalIncidents - b.totalIncidents)[0];
    
    const typeStats = incidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonCrime = Object.entries(typeStats).sort(([,a], [,b]) => b - a)[0];

    // Respostas baseadas em palavras-chave
    if (message.includes('total') || message.includes('quantos incidentes')) {
      return `Atualmente temos ${totalIncidents.toLocaleString()} incidentes registrados no sistema. Este número representa todos os tipos de ocorrências criminais mapeadas em Brasília.`;
    }
    
    if (message.includes('mais perigosa') || message.includes('região perigosa') || message.includes('área crítica')) {
      return `A região mais perigosa atualmente é ${mostDangerousRegion?.region} com ${mostDangerousRegion?.totalIncidents} incidentes registrados. Temos ${criticalAreas.length} áreas classificadas como críticas no total.`;
    }
    
    if (message.includes('mais segura') || message.includes('região segura') || message.includes('área segura')) {
      return `A região mais segura é ${safestRegion?.region} com apenas ${safestRegion?.totalIncidents} incidentes registrados. Esta área apresenta nível de risco ${safestRegion?.riskLevel}.`;
    }
    
    if (message.includes('crime mais comum') || message.includes('tipo mais frequente')) {
      return `O tipo de crime mais comum é ${mostCommonCrime?.[0]} com ${mostCommonCrime?.[1]} ocorrências registradas, representando ${((mostCommonCrime?.[1] || 0) / totalIncidents * 100).toFixed(1)}% do total.`;
    }
    
    if (message.includes('ceilândia')) {
      const ceilandia = regionStats.find(r => r.region.toLowerCase().includes('ceilândia'));
      return `Ceilândia tem ${ceilandia?.totalIncidents} incidentes registrados e está classificada como área de risco ${ceilandia?.riskLevel}. O tipo mais comum na região é ${ceilandia?.mostCommonType}.`;
    }
    
    if (message.includes('plano piloto')) {
      const planoPiloto = regionStats.find(r => r.region.toLowerCase().includes('plano piloto'));
      return `O Plano Piloto tem ${planoPiloto?.totalIncidents} incidentes registrados e está classificado como área de risco ${planoPiloto?.riskLevel}. O tipo mais comum na região é ${planoPiloto?.mostCommonType}.`;
    }
    
    if (message.includes('estatística') || message.includes('dados') || message.includes('números')) {
      return `Aqui estão algumas estatísticas importantes:
      
📊 Total de incidentes: ${totalIncidents.toLocaleString()}
🔴 Áreas críticas: ${criticalAreas.length}
🏆 Região com mais incidentes: ${mostDangerousRegion?.region} (${mostDangerousRegion?.totalIncidents})
🛡️ Região mais segura: ${safestRegion?.region} (${safestRegion?.totalIncidents})
⚠️ Crime mais comum: ${mostCommonCrime?.[0]} (${mostCommonCrime?.[1]} casos)`;
    }
    
    if (message.includes('tendência') || message.includes('evolução')) {
      return `Com base nos dados disponíveis, observamos que as regiões periféricas como Ceilândia, Samambaia e Recanto das Emas concentram a maior parte dos incidentes. O Plano Piloto e áreas centrais apresentam índices menores, principalmente furtos. Recomendo monitorar as áreas críticas com mais atenção.`;
    }
    
    if (message.includes('recomendação') || message.includes('sugestão') || message.includes('conselho')) {
      return `Com base na análise dos dados, recomendo:

🎯 Focar recursos de segurança nas ${criticalAreas.length} áreas críticas
📍 Aumentar patrulhamento em ${mostDangerousRegion?.region}
🔍 Implementar estratégias específicas para combater ${mostCommonCrime?.[0]}
📊 Monitorar tendências mensais para identificar padrões sazonais
🚨 Criar alertas automáticos para regiões com aumento súbito de incidentes`;
    }
    
    if (message.includes('obrigado') || message.includes('valeu') || message.includes('thanks')) {
      return `Fico feliz em ajudar! Estou aqui para fornecer insights sobre segurança em Brasília sempre que precisar. Há mais alguma análise específica que gostaria de ver?`;
    }
    
    // Resposta padrão
    return `Entendo sua pergunta sobre "${userMessage}". Posso ajudar com informações sobre:

🔍 Estatísticas gerais de criminalidade
📍 Análise por região específica
📊 Tipos de crimes mais comuns
📈 Tendências e padrões
🎯 Recomendações de segurança

Que tipo de análise você gostaria de ver?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular delay de digitação
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Qual região é mais perigosa?",
    "Quantos incidentes temos no total?",
    "Qual crime é mais comum?",
    "Como está Ceilândia?",
    "Região mais segura?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Assistente IA</h2>
              <p className="text-sm text-gray-600">Análise de Segurança Brasília</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`p-3 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <div className="text-xs text-gray-500 mb-2 flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>Perguntas sugeridas:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(question)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre segurança..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};