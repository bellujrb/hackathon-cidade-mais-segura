import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MapComponent } from './components/MapComponent';
import { LocationEvaluationModal } from './components/LocationEvaluationModal';
import { FacadeAnalysisModal } from './components/FacadeAnalysisModal';
import { ChartsModal } from './components/ChartsModal';
import { SuggestionModal } from './components/SuggestionModal';
import { mockPerceptionData, regionStats } from './data/mockData';
import { FilterOptions, LocationEvaluation } from './types';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [facadeAnalysisOpen, setFacadeAnalysisOpen] = useState(false);
  const [chartsModalOpen, setChartsModalOpen] = useState(false);
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const [filters, setFilters] = useState<FilterOptions>({
    timeOfDay: [],
    gender: [],
    ageGroup: [],
    regions: []
  });

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality here
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleEvaluateLocation = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setEvaluationModalOpen(true);
  };

  const handleSubmitEvaluation = async (evaluation: LocationEvaluation) => {
    console.log('New evaluation:', evaluation);
    // In production, this would send data to backend
    
    // Show success message
    alert('Obrigado! Sua avaliação ajudará a melhorar políticas públicas de segurança.');
    
    setEvaluationModalOpen(false);
    setSelectedLocation(null);
  };

  const handleSendSuggestion = () => {
    setSuggestionModalOpen(true);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header onSearch={handleSearch} onMenuClick={toggleSidebar} />
      
      <div className="flex-1 flex relative">
        {sidebarOpen && (
          <div className="flex-shrink-0 hidden lg:block">
            <Sidebar
              isOpen={sidebarOpen}
              regionStats={regionStats}
              filters={filters}
              onFilterChange={handleFilterChange}
              onOpenFacadeAnalysis={() => setFacadeAnalysisOpen(true)}
              onOpenCharts={() => setChartsModalOpen(true)}
            />
          </div>
        )}
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black opacity-50" onClick={toggleSidebar}></div>
            <div className="relative">
              <Sidebar
                isOpen={sidebarOpen}
                regionStats={regionStats}
                filters={filters}
                onFilterChange={handleFilterChange}
                onOpenFacadeAnalysis={() => setFacadeAnalysisOpen(true)}
                onOpenCharts={() => setChartsModalOpen(true)}
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 relative">
          <MapComponent
            perceptionData={mockPerceptionData}
            filters={filters}
            onEvaluateLocation={handleEvaluateLocation}
            onSendSuggestion={handleSendSuggestion}
          />
        </div>
      </div>

      {/* Modals */}
      <LocationEvaluationModal
        isOpen={evaluationModalOpen}
        onClose={() => {
          setEvaluationModalOpen(false);
          setSelectedLocation(null);
        }}
        latitude={selectedLocation?.lat || 0}
        longitude={selectedLocation?.lng || 0}
        onSubmit={handleSubmitEvaluation}
      />

      <FacadeAnalysisModal
        isOpen={facadeAnalysisOpen}
        onClose={() => setFacadeAnalysisOpen(false)}
      />

      <ChartsModal
        isOpen={chartsModalOpen}
        onClose={() => setChartsModalOpen(false)}
        perceptionData={mockPerceptionData}
        regionStats={regionStats}
      />

      <SuggestionModal
        isOpen={suggestionModalOpen}
        onClose={() => setSuggestionModalOpen(false)}
      />
    </div>
  );
}

export default App;