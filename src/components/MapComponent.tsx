import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { PerceptionData, FilterOptions } from '../types';
import { brasiliaCenter, fearLevelColors } from '../data/mockData';
import { MapPin, Plus, MessageCircle } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapComponentProps {
  perceptionData: PerceptionData[];
  filters: FilterOptions;
  onEvaluateLocation: (lat: number, lng: number) => void;
  onSendSuggestion: () => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  perceptionData, 
  filters,
  onEvaluateLocation,
  onSendSuggestion
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const heatmapLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);

  const centerOnBrasilia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([brasiliaCenter.lat, brasiliaCenter.lng], 11, {
        animate: true,
        duration: 1.0
      });
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([brasiliaCenter.lat, brasiliaCenter.lng], 11);
    mapInstanceRef.current = map;

    // Tile layers
    const cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    });

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    cartoLight.addTo(map);

    const baseMaps = {
      "Mapa Claro": cartoLight,
      "OpenStreetMap": osmLayer
    };

    L.control.layers(baseMaps).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);

    // Click handler for location selection
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Filter data based on current filters
  const filteredData = React.useMemo(() => {
    return perceptionData.filter(data => {
      if (filters.timeOfDay.length > 0 && !filters.timeOfDay.includes(data.timeOfDay)) return false;
      if (filters.gender.length > 0 && !filters.gender.includes(data.gender)) return false;
      if (filters.ageGroup.length > 0 && !filters.ageGroup.includes(data.ageGroup)) return false;
      if (filters.regions.length > 0 && !filters.regions.includes(data.region)) return false;
      return true;
    });
  }, [perceptionData, filters]);

  // Update heatmap
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (heatmapLayerRef.current) {
      mapInstanceRef.current.removeLayer(heatmapLayerRef.current);
      heatmapLayerRef.current = null;
    }

    if (filteredData.length > 0) {
      const heatmapData = filteredData.map(data => [
        data.latitude, 
        data.longitude, 
        data.fearIndex / 10 // Normalize to 0-1
      ]);

      heatmapLayerRef.current = (L as any).heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 18,
        max: 1.0,
        minOpacity: 0.1,
        gradient: {
          0.0: 'rgba(34, 197, 94, 0)',     // Transparente
          0.1: 'rgba(34, 197, 94, 0.2)',   // Verde
          0.2: 'rgba(132, 204, 22, 0.3)',  // Verde-amarelo
          0.3: 'rgba(163, 230, 53, 0.4)',  // Amarelo-verde
          0.4: 'rgba(234, 179, 8, 0.5)',   // Amarelo
          0.5: 'rgba(245, 158, 11, 0.6)',  // Laranja-amarelo
          0.6: 'rgba(249, 115, 22, 0.7)',  // Laranja
          0.7: 'rgba(239, 68, 68, 0.8)',   // Vermelho
          0.8: 'rgba(220, 38, 38, 0.85)',  // Vermelho escuro
          0.9: 'rgba(153, 27, 27, 0.9)',   // Vermelho muito escuro
          1.0: 'rgba(153, 27, 27, 0.95)'   // Vermelho crítico
        }
      }).addTo(mapInstanceRef.current);
    }
  }, [filteredData]);

  // Update markers for region stats
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Group data by region and create markers
    const regionData = filteredData.reduce((acc, data) => {
      if (!acc[data.region]) {
        acc[data.region] = {
          data: [],
          avgFear: 0,
          lat: data.latitude,
          lng: data.longitude
        };
      }
      acc[data.region].data.push(data);
      return acc;
    }, {} as any);

    Object.entries(regionData).forEach(([region, info]: [string, any]) => {
      const avgFear = info.data.reduce((sum: number, d: any) => sum + d.fearIndex, 0) / info.data.length;
      const mainCauses = info.data.flatMap((d: any) => d.causes)
        .reduce((acc: any, cause: string) => {
          acc[cause] = (acc[cause] || 0) + 1;
          return acc;
        }, {});
      
      const topCauses = Object.entries(mainCauses)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 2)
        .map(([cause]) => cause);

      const color = avgFear >= 7 ? '#DC2626' : avgFear >= 5 ? '#F59E0B' : avgFear >= 3 ? '#84CC16' : '#22C55E';
      
      const customIcon = L.divIcon({
        className: 'region-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 12px;
          ">
            ${avgFear.toFixed(1)}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([info.lat, info.lng], { icon: customIcon });
      
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-lg text-gray-900 mb-2">${region}</h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Índice médio de medo:</span>
              <span class="font-bold text-lg" style="color: ${color}">${avgFear.toFixed(1)}/10</span>
            </div>
            <div class="text-sm">
              <div class="text-gray-600 mb-1">Principais causas:</div>
              <div class="space-y-1">
                ${topCauses.map(cause => `<div class="bg-gray-100 px-2 py-1 rounded text-xs">${cause}</div>`).join('')}
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-2">
              ${info.data.length} avaliações
            </div>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredData]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full cursor-crosshair"
        style={{ minHeight: '400px' }}
      />
      
      {/* Brasília Center Button */}
      <button
        onClick={centerOnBrasilia}
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 shadow-lg border border-blue-500 z-[1000] transition-all duration-200 hover:shadow-xl group"
        title="Centralizar em Brasília"
      >
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span className="font-semibold text-sm">Brasília</span>
        </div>
      </button>
      
      {/* Data info overlay */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 z-[1000]">
        <div className="text-sm">
          <div className="font-semibold text-gray-900 mb-1">Dados Exibidos</div>
          <div className="text-gray-600">
            <div>Total: <span className="font-medium text-blue-600">{filteredData.length}</span> avaliações</div>
            <div className="text-xs mt-1 text-gray-500">
              Mapa de calor da percepção de medo
            </div>
          </div>
        </div>
      </div>

      {/* Selected Location Indicator */}
      {selectedLocation && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-3 shadow-lg border border-gray-200 z-[1000]">
          <div className="text-sm text-center">
            <div className="text-gray-600 mb-2">Local selecionado</div>
            <div className="text-xs text-gray-500 mb-3">
              {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </div>
            <button
              onClick={() => onEvaluateLocation(selectedLocation.lat, selectedLocation.lng)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Avaliar este local
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button - Evaluate Location */}
      <button
        onClick={() => {
          if (selectedLocation) {
            onEvaluateLocation(selectedLocation.lat, selectedLocation.lng);
          } else {
            // Use current center of map
            const center = mapInstanceRef.current?.getCenter();
            if (center) {
              onEvaluateLocation(center.lat, center.lng);
            }
          }
        }}
        className="fixed bottom-24 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg z-[1000] transition-all duration-200 hover:shadow-xl group"
        title="Avaliar Local"
      >
        <Plus className="h-6 w-6" />
        <div className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Avaliar Local
        </div>
      </button>

      {/* CTA Fixed Bottom - Send Suggestion */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-[1000]">
        <button
          onClick={onSendSuggestion}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Enviar sugestão de melhoria à Prefeitura</span>
        </button>
      </div>
    </div>
  );
};