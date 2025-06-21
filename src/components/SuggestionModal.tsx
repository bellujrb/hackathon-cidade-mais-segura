import React, { useState } from 'react';
import { X, Send, MessageCircle, MapPin, Lightbulb, CheckCircle } from 'lucide-react';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({
  isOpen,
  onClose
}) => {
  const [suggestion, setSuggestion] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: 'iluminacao', label: 'Iluminação Pública', icon: '💡' },
    { value: 'policiamento', label: 'Policiamento', icon: '👮' },
    { value: 'infraestrutura', label: 'Infraestrutura', icon: '🏗️' },
    { value: 'limpeza', label: 'Limpeza Urbana', icon: '🧹' },
    { value: 'transporte', label: 'Transporte Público', icon: '🚌' },
    { value: 'outros', label: 'Outros', icon: '📝' }
  ];

  const handleSubmit = async () => {
    if (!suggestion.trim() || !category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    
    // Simular envio para a prefeitura
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setSuggestion('');
        setLocation('');
        setCategory('');
        onClose();
      }, 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sugestão à Prefeitura</h2>
              <p className="text-sm text-gray-600">Ajude a melhorar a segurança da cidade</p>
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
          {!isSubmitted ? (
            <div className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Categoria da Sugestão *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium text-left ${
                        category === cat.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{cat.icon}</div>
                      <div className="text-xs">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Local (opcional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Rua das Flores, Ceilândia"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Suggestion */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  <Lightbulb className="inline h-4 w-4 mr-2" />
                  Sua Sugestão *
                </label>
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Descreva sua sugestão de melhoria para aumentar a segurança na região..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <div className="text-xs text-gray-500">
                  {suggestion.length}/500 caracteres
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !suggestion.trim() || !category}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Enviar Sugestão</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sugestão Enviada!
                </h3>
                <p className="text-gray-600">
                  Obrigado por contribuir para melhorar a segurança da nossa cidade. 
                  Sua sugestão foi encaminhada para os órgãos competentes.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm text-green-700">
                  <div className="font-semibold mb-1">📋 Protocolo</div>
                  <div className="text-xs">#{Date.now().toString().slice(-6)}</div>
                  <div className="mt-2 text-xs">
                    Acompanhe o andamento através do portal da transparência
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Footer */}
        {!isSubmitted && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600">
              <div className="font-semibold mb-1">🏛️ Sobre o Processo</div>
              <p>
                Suas sugestões são analisadas pela Secretaria de Segurança Pública e 
                órgãos municipais competentes. Contribuições construtivas ajudam a 
                priorizar investimentos em segurança urbana.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};