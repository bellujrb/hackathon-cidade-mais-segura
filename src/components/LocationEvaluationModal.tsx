import React, { useState, useRef } from 'react';
import { X, MapPin, Camera, Upload, Send, Clock, Users, Activity } from 'lucide-react';
import { LocationEvaluation } from '../types';

interface LocationEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  onSubmit: (evaluation: LocationEvaluation) => void;
}

export const LocationEvaluationModal: React.FC<LocationEvaluationModalProps> = ({
  isOpen,
  onClose,
  latitude,
  longitude,
  onSubmit
}) => {
  const [fearLevel, setFearLevel] = useState(5);
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [gender, setGender] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!timeOfDay || !gender || !ageGroup) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    
    const evaluation: LocationEvaluation = {
      latitude,
      longitude,
      fearLevel,
      comment,
      imageFile: imageFile || undefined,
      timeOfDay,
      gender,
      ageGroup
    };

    try {
      await onSubmit(evaluation);
      onClose();
      // Reset form
      setFearLevel(5);
      setComment('');
      setImageFile(null);
      setTimeOfDay('');
      setGender('');
      setAgeGroup('');
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFearEmoji = (level: number) => {
    if (level <= 2) return '😌';
    if (level <= 4) return '🙂';
    if (level <= 6) return '😐';
    if (level <= 8) return '😟';
    return '😰';
  };

  const getFearColor = (level: number) => {
    if (level <= 2) return '#22C55E';
    if (level <= 4) return '#84CC16';
    if (level <= 6) return '#EAB308';
    if (level <= 8) return '#F97316';
    return '#EF4444';
  };

  const getFearLabel = (level: number) => {
    if (level <= 2) return 'Muito seguro';
    if (level <= 4) return 'Seguro';
    if (level <= 6) return 'Neutro';
    if (level <= 8) return 'Inseguro';
    return 'Muito inseguro';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Avaliar Local</h2>
              <p className="text-sm text-gray-600">Como você se sente neste lugar?</p>
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
        <div className="p-6 space-y-6">
          {/* Location Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">
              <div className="font-medium">Localização:</div>
              <div className="text-xs mt-1">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </div>
            </div>
          </div>

          {/* Fear Level Slider */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Como você se sente neste lugar agora?
            </label>
            
            <div className="text-center">
              <div className="text-6xl mb-2">{getFearEmoji(fearLevel)}</div>
              <div 
                className="text-lg font-bold mb-2"
                style={{ color: getFearColor(fearLevel) }}
              >
                {fearLevel}/10 - {getFearLabel(fearLevel)}
              </div>
            </div>

            <div className="relative">
              <input
                type="range"
                min="0"
                max="10"
                value={fearLevel}
                onChange={(e) => setFearLevel(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #22C55E 0%, #84CC16 25%, #EAB308 50%, #F97316 75%, #EF4444 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>😌 Seguro</span>
                <span>😰 Inseguro</span>
              </div>
            </div>
          </div>

          {/* Time of Day */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              <Clock className="inline h-4 w-4 mr-2" />
              Período do dia *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'manha', label: 'Manhã', icon: '🌅' },
                { value: 'tarde', label: 'Tarde', icon: '☀️' },
                { value: 'noite', label: 'Noite', icon: '🌙' }
              ].map((time) => (
                <button
                  key={time.value}
                  onClick={() => setTimeOfDay(time.value)}
                  className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                    timeOfDay === time.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{time.icon}</div>
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              <Users className="inline h-4 w-4 mr-2" />
              Gênero *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'feminino', label: 'Feminino', icon: '👩' },
                { value: 'masculino', label: 'Masculino', icon: '👨' },
                { value: 'geral', label: 'Prefiro não informar', icon: '👤' }
              ].map((genderOption) => (
                <button
                  key={genderOption.value}
                  onClick={() => setGender(genderOption.value)}
                  className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                    gender === genderOption.value
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{genderOption.icon}</div>
                  {genderOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              <Activity className="inline h-4 w-4 mr-2" />
              Faixa etária *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'jovens', label: 'Jovens', icon: '🧒', desc: '18-30' },
                { value: 'adultos', label: 'Adultos', icon: '🧑', desc: '31-59' },
                { value: 'idosos', label: 'Idosos', icon: '👴', desc: '60+' }
              ].map((age) => (
                <button
                  key={age.value}
                  onClick={() => setAgeGroup(age.value)}
                  className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                    ageGroup === age.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{age.icon}</div>
                  <div>{age.label}</div>
                  <div className="text-xs text-gray-500">{age.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              O que torna esse lugar inseguro ou seguro? (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descreva os fatores que influenciam sua percepção de segurança neste local..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              <Camera className="inline h-4 w-4 mr-2" />
              Foto do local (opcional)
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {imageFile ? imageFile.name : 'Escolher foto'}
                </span>
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
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !timeOfDay || !gender || !ageGroup}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="h-5 w-5" />
            <span>{isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Sua avaliação ajudará a melhorar políticas públicas de segurança
          </p>
        </div>
      </div>
    </div>
  );
};