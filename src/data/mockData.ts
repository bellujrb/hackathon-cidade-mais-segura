import { PerceptionData, RegionStats } from '../types';

// Coordenadas reais de Brasília
export const brasiliaCenter = { lat: -15.7801, lng: -47.9292 };

export const brasiliaBounds = {
  north: -15.5,
  south: -16.1,
  east: -47.3,
  west: -48.3
};

// Gerar dados de percepção de medo
const generatePerceptionData = (): PerceptionData[] => {
  const data: PerceptionData[] = [];
  let id = 1;

  // Hotspots com diferentes níveis de medo
  const fearHotspots = [
    { center: { lat: -15.8103, lng: -48.1070 }, radius: 0.02, fearLevel: 8.2, region: 'Ceilândia' },
    { center: { lat: -15.8758, lng: -48.0539 }, radius: 0.015, fearLevel: 7.8, region: 'Samambaia' },
    { center: { lat: -15.8267, lng: -48.0583 }, radius: 0.018, fearLevel: 6.5, region: 'Taguatinga' },
    { center: { lat: -15.6167, lng: -47.6542 }, radius: 0.025, fearLevel: 7.1, region: 'Planaltina' },
    { center: { lat: -15.7801, lng: -47.9292 }, radius: 0.012, fearLevel: 4.2, region: 'Plano Piloto' },
    { center: { lat: -15.8344, lng: -48.0261 }, radius: 0.01, fearLevel: 3.8, region: 'Águas Claras' },
    { center: { lat: -15.8181, lng: -47.8558 }, radius: 0.02, fearLevel: 2.9, region: 'Lago Sul' },
    { center: { lat: -16.0056, lng: -48.0139 }, radius: 0.02, fearLevel: 7.5, region: 'Santa Maria' },
    { center: { lat: -15.9000, lng: -48.0667 }, radius: 0.018, fearLevel: 8.0, region: 'Recanto das Emas' },
  ];

  const timeOfDayOptions = ['manha', 'tarde', 'noite'] as const;
  const genderOptions = ['feminino', 'masculino', 'geral'] as const;
  const ageGroupOptions = ['jovens', 'adultos', 'idosos'] as const;

  const commonCauses = [
    'rua escura', 'baixa movimentação', 'falta de policiamento', 
    'abandono urbano', 'usuários de drogas', 'falta de iluminação',
    'becos escuros', 'terrenos baldios', 'pichações', 'lixo acumulado'
  ];

  fearHotspots.forEach(hotspot => {
    const numPoints = Math.floor(Math.random() * 30) + 20;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * hotspot.radius;
      const lat = hotspot.center.lat + (distance * Math.cos(angle)) / 111;
      const lng = hotspot.center.lng + (distance * Math.sin(angle)) / (111 * Math.cos(hotspot.center.lat * Math.PI / 180));
      
      if (lat >= brasiliaBounds.south && lat <= brasiliaBounds.north && 
          lng >= brasiliaBounds.west && lng <= brasiliaBounds.east) {
        
        // Variação no índice de medo baseado no período e gênero
        let baseFear = hotspot.fearLevel;
        const timeOfDay = timeOfDayOptions[Math.floor(Math.random() * timeOfDayOptions.length)];
        const gender = genderOptions[Math.floor(Math.random() * genderOptions.length)];
        const ageGroup = ageGroupOptions[Math.floor(Math.random() * ageGroupOptions.length)];
        
        // Ajustes realistas
        if (timeOfDay === 'noite') baseFear += 1.5;
        if (gender === 'feminino') baseFear += 1.2;
        if (ageGroup === 'idosos') baseFear += 0.8;
        
        baseFear = Math.min(10, Math.max(0, baseFear + (Math.random() - 0.5) * 2));
        
        const selectedCauses = commonCauses
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1);

        data.push({
          id: id.toString(),
          latitude: lat,
          longitude: lng,
          fearIndex: Math.round(baseFear * 10) / 10,
          timeOfDay,
          gender,
          ageGroup,
          causes: selectedCauses,
          date: new Date(2024, Math.floor(Math.random() * 2), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          region: hotspot.region,
          comment: Math.random() > 0.7 ? generateComment(baseFear, selectedCauses) : undefined
        });
        id++;
      }
    }
  });

  return data;
};

const generateComment = (fearLevel: number, causes: string[]): string => {
  const comments = {
    high: [
      "Tenho muito medo de passar aqui, especialmente à noite",
      "Local muito perigoso, evito sempre que possível",
      "Já presenciei situações assustadoras aqui",
      "Não me sinto segura neste lugar"
    ],
    medium: [
      "Fico alerta quando passo por aqui",
      "Não é o lugar mais seguro, mas dá para passar",
      "Prefiro não andar sozinho(a) aqui",
      "Poderia ter mais policiamento"
    ],
    low: [
      "Me sinto relativamente seguro aqui",
      "Local tranquilo, mas sempre bom ficar atento",
      "Boa movimentação de pessoas durante o dia",
      "Poderia melhorar a iluminação"
    ]
  };

  let category = 'medium';
  if (fearLevel >= 7) category = 'high';
  else if (fearLevel <= 4) category = 'low';

  const baseComments = comments[category as keyof typeof comments];
  return baseComments[Math.floor(Math.random() * baseComments.length)];
};

export const mockPerceptionData: PerceptionData[] = generatePerceptionData();

export const regionStats: RegionStats[] = [
  { region: 'Ceilândia', averageFearIndex: 8.2, totalEvaluations: 156, mainCauses: ['rua escura', 'baixa movimentação', 'falta de policiamento'], lastEvaluation: '2024-01-15', riskLevel: 'critico' },
  { region: 'Recanto das Emas', averageFearIndex: 8.0, totalEvaluations: 134, mainCauses: ['abandono urbano', 'usuários de drogas'], lastEvaluation: '2024-01-16', riskLevel: 'critico' },
  { region: 'Samambaia', averageFearIndex: 7.8, totalEvaluations: 142, mainCauses: ['falta de iluminação', 'becos escuros'], lastEvaluation: '2024-01-14', riskLevel: 'alto' },
  { region: 'Santa Maria', averageFearIndex: 7.5, totalEvaluations: 98, mainCauses: ['terrenos baldios', 'pichações'], lastEvaluation: '2024-01-17', riskLevel: 'alto' },
  { region: 'Planaltina', averageFearIndex: 7.1, totalEvaluations: 87, mainCauses: ['baixa movimentação', 'falta de policiamento'], lastEvaluation: '2024-01-12', riskLevel: 'alto' },
  { region: 'Taguatinga', averageFearIndex: 6.5, totalEvaluations: 203, mainCauses: ['rua escura', 'lixo acumulado'], lastEvaluation: '2024-01-13', riskLevel: 'medio' },
  { region: 'Plano Piloto', averageFearIndex: 4.2, totalEvaluations: 167, mainCauses: ['baixa movimentação'], lastEvaluation: '2024-01-10', riskLevel: 'medio' },
  { region: 'Águas Claras', averageFearIndex: 3.8, totalEvaluations: 89, mainCauses: ['falta de iluminação'], lastEvaluation: '2024-01-08', riskLevel: 'baixo' },
  { region: 'Lago Sul', averageFearIndex: 2.9, totalEvaluations: 45, mainCauses: ['baixa movimentação'], lastEvaluation: '2024-01-07', riskLevel: 'baixo' },
];

export const fearLevelColors = {
  0: '#22C55E', 1: '#34D399', 2: '#4ADE80', 3: '#84CC16',
  4: '#A3E635', 5: '#EAB308', 6: '#F59E0B', 7: '#F97316',
  8: '#EF4444', 9: '#DC2626', 10: '#991B1B'
};

export const timeOfDayColors = {
  manha: '#3B82F6',
  tarde: '#F59E0B', 
  noite: '#6366F1'
};

export const genderColors = {
  feminino: '#EC4899',
  masculino: '#3B82F6',
  geral: '#6B7280'
};

export const ageGroupColors = {
  jovens: '#10B981',
  adultos: '#F59E0B',
  idosos: '#8B5CF6'
};