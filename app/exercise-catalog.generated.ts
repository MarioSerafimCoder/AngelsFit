// Generated from base_exercicios_academia_182.xlsx. Do not edit manually.
export type GymExerciseRow = {
  id: string;
  group: string;
  subgroup: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  pattern: string;
  jointClassification: string;
  category: string;
  equipment: string;
  laterality: string;
  minimumLevel: string;
  complexity: number;
  instructions: string;
  substitutes: string[];
  attention: string;
  goals: string[];
};

export const gymExerciseRows: GymExerciseRow[] = [
  {
    "id": "ex0001",
    "group": "Quadríceps",
    "subgroup": "Agachamento",
    "name": "Agachamento livre",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores",
      "core"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Peso corporal",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Flexione quadris, joelhos e tornozelos mantendo os pés apoiados e retorne à posição ereta.",
    "substitutes": [
      "Goblet squat",
      "leg press"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0002",
    "group": "Quadríceps",
    "subgroup": "Agachamento",
    "name": "Goblet squat",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores",
      "core"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halter ou kettlebell",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Segure a carga junto ao peito, agache com controle e suba estendendo joelhos e quadris.",
    "substitutes": [
      "Agachamento livre",
      "hack squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0003",
    "group": "Quadríceps",
    "subgroup": "Agachamento",
    "name": "Back squat high-bar",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores",
      "eretores da coluna"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra e rack",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Apoie a barra no trapézio, agache mantendo controle do tronco e suba empurrando o chão.",
    "substitutes": [
      "Front squat",
      "hack squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0004",
    "group": "Quadríceps",
    "subgroup": "Agachamento",
    "name": "Back squat low-bar",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "adutores",
      "eretores da coluna"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra e rack",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Apoie a barra mais baixa nas costas, faça hinge moderado e agache mantendo a barra sobre o meio do pé.",
    "substitutes": [
      "High-bar squat",
      "safety bar squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0005",
    "group": "Quadríceps",
    "subgroup": "Agachamento",
    "name": "Front squat",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores",
      "core"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra e rack",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Apoie a barra à frente dos ombros, mantenha cotovelos altos, agache e retorne sem perder o tronco firme.",
    "substitutes": [
      "Goblet squat",
      "hack squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0006",
    "group": "Quadríceps",
    "subgroup": "Agachamento",
    "name": "Safety bar squat",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores",
      "core"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Safety bar",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Apoie a barra de segurança nos ombros, desça em agachamento e retorne mantendo o tronco controlado.",
    "substitutes": [
      "High-bar squat",
      "hack squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0007",
    "group": "Quadríceps",
    "subgroup": "Agachamento",
    "name": "Zercher squat",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores",
      "core"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Segure a barra na dobra dos cotovelos, agache mantendo-a próxima ao tronco e suba com controle.",
    "substitutes": [
      "Goblet squat",
      "front squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0008",
    "group": "Quadríceps",
    "subgroup": "Agachamento",
    "name": "Box squat",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "adutores",
      "eretores da coluna"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra; banco ou caixa",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Agache até tocar a caixa com controle e retorne sem relaxar completamente o tronco.",
    "substitutes": [
      "Back squat",
      "smith squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0009",
    "group": "Quadríceps",
    "subgroup": "Máquinas",
    "name": "Hack squat",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Hack squat",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Com costas apoiadas, desça a plataforma flexionando joelhos e quadris e pressione para subir.",
    "substitutes": [
      "Leg press 45°",
      "smith squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0010",
    "group": "Quadríceps",
    "subgroup": "Máquinas",
    "name": "Pendulum squat",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Pendulum squat",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 2,
    "instructions": "Acompanhe a trajetória pendular, desça até a amplitude tolerada e estenda joelhos e quadris.",
    "substitutes": [
      "Hack squat",
      "leg press"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0011",
    "group": "Quadríceps",
    "subgroup": "Máquinas",
    "name": "Smith squat",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores"
    ],
    "pattern": "Agachar",
    "jointClassification": "Multiarticular",
    "category": "Smith",
    "equipment": "Smith machine",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Posicione os pés de forma compatível com a trajetória guiada, agache e suba sem perder o apoio plantar.",
    "substitutes": [
      "Hack squat",
      "goblet squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0012",
    "group": "Quadríceps",
    "subgroup": "Máquinas",
    "name": "Leg press 45°",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores"
    ],
    "pattern": "Empurrar com membros inferiores",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Leg press 45°",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Desça a plataforma flexionando joelhos e quadris sem perder o contato lombar e pressione de volta.",
    "substitutes": [
      "Hack squat",
      "leg press horizontal"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0013",
    "group": "Quadríceps",
    "subgroup": "Máquinas",
    "name": "Leg press horizontal",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteo máximo",
      "adutores"
    ],
    "pattern": "Empurrar com membros inferiores",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Leg press horizontal",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Flexione joelhos e quadris de forma controlada e empurre a plataforma até retornar.",
    "substitutes": [
      "Leg press 45°",
      "hack squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0014",
    "group": "Quadríceps",
    "subgroup": "Isolamento",
    "name": "Cadeira extensora",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [],
    "pattern": "Extensão de joelho",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Cadeira extensora",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Alinhe o joelho ao eixo da máquina, estenda os joelhos e retorne lentamente.",
    "substitutes": [
      "Extensora unilateral",
      "sissy squat assistido"
    ],
    "attention": "Ajustar amplitude e carga conforme tolerância patelofemoral. Dor anterior no joelho persistente exige regressão da carga e avaliação da causa.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0015",
    "group": "Quadríceps",
    "subgroup": "Isolamento",
    "name": "Extensora unilateral",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [],
    "pattern": "Extensão de joelho",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Cadeira extensora",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Estenda um joelho por vez contra a resistência e retorne sem soltar a carga.",
    "substitutes": [
      "Cadeira extensora",
      "extensão no cabo"
    ],
    "attention": "Ajustar amplitude e carga conforme tolerância patelofemoral. Dor anterior no joelho persistente exige regressão da carga e avaliação da causa.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0016",
    "group": "Posteriores de coxa",
    "subgroup": "Hinge",
    "name": "Romanian deadlift com barra",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Glúteo máximo",
      "eretores da coluna",
      "adutores"
    ],
    "pattern": "Hinge de quadril",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Com joelhos levemente flexionados, leve o quadril para trás mantendo a barra próxima às pernas e retorne.",
    "substitutes": [
      "RDL com halteres",
      "good morning"
    ],
    "attention": "Exige controle lombopélvico e do quadril. Reduzir carga/amplitude se houver dor lombar; interromper se reproduzir dor irradiada, dormência ou perda de força.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0017",
    "group": "Posteriores de coxa",
    "subgroup": "Hinge",
    "name": "Romanian deadlift com halteres",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Glúteo máximo",
      "eretores da coluna"
    ],
    "pattern": "Hinge de quadril",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Leve o quadril para trás mantendo halteres próximos às pernas e retorne contraindo glúteos.",
    "substitutes": [
      "RDL com barra",
      "cable pull-through"
    ],
    "attention": "Exige controle lombopélvico e do quadril. Reduzir carga/amplitude se houver dor lombar; interromper se reproduzir dor irradiada, dormência ou perda de força.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0018",
    "group": "Posteriores de coxa",
    "subgroup": "Hinge",
    "name": "RDL unilateral",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Glúteo máximo",
      "glúteo médio",
      "core"
    ],
    "pattern": "Hinge de quadril",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halter ou kettlebell",
    "laterality": "Unilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Faça hinge sobre uma perna enquanto a outra se projeta para trás, mantendo pelve controlada.",
    "substitutes": [
      "RDL bilateral",
      "single-leg back extension"
    ],
    "attention": "Exige controle lombopélvico e do quadril. Reduzir carga/amplitude se houver dor lombar; interromper se reproduzir dor irradiada, dormência ou perda de força.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0019",
    "group": "Posteriores de coxa",
    "subgroup": "Hinge",
    "name": "Stiff-leg deadlift",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Glúteo máximo",
      "eretores da coluna"
    ],
    "pattern": "Hinge de quadril",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Desça a barra com pequena flexão dos joelhos e grande flexão do quadril, mantendo a coluna controlada.",
    "substitutes": [
      "Romanian deadlift",
      "good morning"
    ],
    "attention": "Exige controle lombopélvico e do quadril. Reduzir carga/amplitude se houver dor lombar; interromper se reproduzir dor irradiada, dormência ou perda de força.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0020",
    "group": "Posteriores de coxa",
    "subgroup": "Hinge",
    "name": "Good morning",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Glúteo máximo",
      "eretores da coluna"
    ],
    "pattern": "Hinge de quadril",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Com barra nas costas, leve o quadril para trás e incline o tronco mantendo a carga equilibrada.",
    "substitutes": [
      "RDL",
      "back extension"
    ],
    "attention": "Exige controle lombopélvico e do quadril. Reduzir carga/amplitude se houver dor lombar; interromper se reproduzir dor irradiada, dormência ou perda de força.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0021",
    "group": "Posteriores de coxa",
    "subgroup": "Hinge",
    "name": "Cable pull-through",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Isquiotibiais",
      "adutores"
    ],
    "pattern": "Hinge de quadril",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia baixa e corda",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Passe a corda entre as pernas, leve o quadril para trás e estenda-o contra a polia.",
    "substitutes": [
      "Hip thrust",
      "RDL com halteres"
    ],
    "attention": "Exige controle lombopélvico e do quadril. Reduzir carga/amplitude se houver dor lombar; interromper se reproduzir dor irradiada, dormência ou perda de força.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0022",
    "group": "Posteriores de coxa",
    "subgroup": "Flexão de joelho",
    "name": "Mesa flexora",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Gastrocnêmio"
    ],
    "pattern": "Flexão de joelho",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Mesa flexora",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Flexione os joelhos trazendo os calcanhares em direção aos glúteos e retorne devagar.",
    "substitutes": [
      "Cadeira flexora",
      "flexora em pé"
    ],
    "attention": "Progredir carga e amplitude gradualmente. Em lesão recente de posteriores, evitar carga excêntrica alta sem progressão específica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0023",
    "group": "Posteriores de coxa",
    "subgroup": "Flexão de joelho",
    "name": "Cadeira flexora",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Gastrocnêmio"
    ],
    "pattern": "Flexão de joelho",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Cadeira flexora",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Sentado e estabilizado, flexione os joelhos contra o rolo e retorne controladamente.",
    "substitutes": [
      "Mesa flexora",
      "flexora unilateral"
    ],
    "attention": "Progredir carga e amplitude gradualmente. Em lesão recente de posteriores, evitar carga excêntrica alta sem progressão específica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0024",
    "group": "Posteriores de coxa",
    "subgroup": "Flexão de joelho",
    "name": "Flexora em pé unilateral",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Gastrocnêmio"
    ],
    "pattern": "Flexão de joelho",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Flexora em pé",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Flexione um joelho por vez mantendo o quadril estável.",
    "substitutes": [
      "Cadeira flexora",
      "leg curl no cabo"
    ],
    "attention": "Progredir carga e amplitude gradualmente. Em lesão recente de posteriores, evitar carga excêntrica alta sem progressão específica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0025",
    "group": "Posteriores de coxa",
    "subgroup": "Flexão de joelho",
    "name": "Leg curl no cabo",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Gastrocnêmio"
    ],
    "pattern": "Flexão de joelho",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia baixa e tornozeleira",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Com tornozeleira presa à polia, flexione o joelho sem movimentar excessivamente o quadril.",
    "substitutes": [
      "Flexora em pé",
      "cadeira flexora"
    ],
    "attention": "Progredir carga e amplitude gradualmente. Em lesão recente de posteriores, evitar carga excêntrica alta sem progressão específica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0026",
    "group": "Posteriores de coxa",
    "subgroup": "Flexão de joelho",
    "name": "Sliding leg curl",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Glúteo máximo",
      "core"
    ],
    "pattern": "Flexão de joelho",
    "jointClassification": "Uniarticular",
    "category": "Peso corporal",
    "equipment": "Discos deslizantes ou toalha",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Eleve o quadril e deslize os calcanhares para perto do corpo mantendo a pelve estável.",
    "substitutes": [
      "Leg curl bola suíça",
      "cadeira flexora"
    ],
    "attention": "Progredir carga e amplitude gradualmente. Em lesão recente de posteriores, evitar carga excêntrica alta sem progressão específica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0027",
    "group": "Posteriores de coxa",
    "subgroup": "Flexão de joelho",
    "name": "Nordic hamstring curl",
    "primaryMuscle": "Isquiotibiais",
    "secondaryMuscles": [
      "Glúteos",
      "gastrocnêmio"
    ],
    "pattern": "Flexão de joelho",
    "jointClassification": "Uniarticular",
    "category": "Peso corporal",
    "equipment": "Apoio para tornozelos",
    "laterality": "Bilateral",
    "minimumLevel": "Avançado",
    "complexity": 5,
    "instructions": "Com tornozelos fixos, incline o corpo à frente controlando a descida com os posteriores e use apoio se necessário.",
    "substitutes": [
      "Mesa flexora",
      "sliding leg curl"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0028",
    "group": "Glúteos",
    "subgroup": "Extensão de quadril",
    "name": "Hip thrust com barra",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Isquiotibiais",
      "adutores",
      "core"
    ],
    "pattern": "Extensão de quadril",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Barra e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Apoie as costas no banco, eleve o quadril até extensão confortável e desça controladamente.",
    "substitutes": [
      "Glute bridge",
      "hip thrust máquina"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0029",
    "group": "Glúteos",
    "subgroup": "Extensão de quadril",
    "name": "Hip thrust máquina",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Isquiotibiais",
      "adutores"
    ],
    "pattern": "Extensão de quadril",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Hip thrust machine",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Ajuste o apoio sobre o quadril e estenda-o contra a resistência guiada.",
    "substitutes": [
      "Hip thrust com barra",
      "glute bridge"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0030",
    "group": "Glúteos",
    "subgroup": "Extensão de quadril",
    "name": "Hip thrust no Smith",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Isquiotibiais",
      "adutores"
    ],
    "pattern": "Extensão de quadril",
    "jointClassification": "Uniarticular",
    "category": "Smith",
    "equipment": "Smith machine e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Apoie as costas no banco e eleve a barra guiada pela extensão do quadril.",
    "substitutes": [
      "Hip thrust máquina",
      "glute bridge"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0031",
    "group": "Glúteos",
    "subgroup": "Extensão de quadril",
    "name": "Glute bridge",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Isquiotibiais",
      "core"
    ],
    "pattern": "Extensão de quadril",
    "jointClassification": "Uniarticular",
    "category": "Peso corporal",
    "equipment": "Peso corporal",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Deitado com joelhos flexionados, eleve a pelve contraindo os glúteos e retorne.",
    "substitutes": [
      "Hip thrust",
      "frog pump"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0032",
    "group": "Glúteos",
    "subgroup": "Extensão de quadril",
    "name": "Glute bridge unilateral",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Isquiotibiais",
      "glúteo médio",
      "core"
    ],
    "pattern": "Extensão de quadril",
    "jointClassification": "Uniarticular",
    "category": "Peso corporal",
    "equipment": "Peso corporal",
    "laterality": "Unilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Eleve a pelve apoiando uma perna e mantenha a bacia nivelada.",
    "substitutes": [
      "Glute bridge bilateral",
      "hip thrust unilateral"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0033",
    "group": "Glúteos",
    "subgroup": "Extensão de quadril",
    "name": "Frog pump",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Glúteo médio"
    ],
    "pattern": "Extensão de quadril",
    "jointClassification": "Uniarticular",
    "category": "Peso corporal",
    "equipment": "Peso corporal ou halter",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Una as plantas dos pés, mantenha joelhos abertos e realize repetições de extensão do quadril.",
    "substitutes": [
      "Glute bridge",
      "hip thrust"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0034",
    "group": "Glúteos",
    "subgroup": "Extensão de quadril",
    "name": "Cable kickback",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Isquiotibiais"
    ],
    "pattern": "Extensão de quadril",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia baixa e tornozeleira",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Leve a perna para trás pela extensão do quadril sem hiperestender a lombar.",
    "substitutes": [
      "Kickback máquina",
      "glute bridge unilateral"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0035",
    "group": "Glúteos",
    "subgroup": "Extensão de quadril",
    "name": "Kickback máquina",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Isquiotibiais"
    ],
    "pattern": "Extensão de quadril",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Máquina de glúteo",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Empurre o apoio para trás estendendo o quadril e retorne com controle.",
    "substitutes": [
      "Cable kickback",
      "hip thrust"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0036",
    "group": "Glúteos",
    "subgroup": "Unilateral",
    "name": "Bulgarian split squat",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "adutores",
      "glúteo médio"
    ],
    "pattern": "Agachar unilateral",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halteres e banco",
    "laterality": "Unilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Apoie o pé traseiro, desça controlando o joelho da frente e suba pela perna de apoio.",
    "substitutes": [
      "Split squat",
      "reverse lunge"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0037",
    "group": "Glúteos",
    "subgroup": "Unilateral",
    "name": "Split squat",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "adutores"
    ],
    "pattern": "Agachar unilateral",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Peso corporal ou halteres",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Mantenha os pés em base dividida, desça verticalmente e retorne sem mudar a posição dos pés.",
    "substitutes": [
      "Bulgarian split squat",
      "lunge reverso"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0038",
    "group": "Glúteos",
    "subgroup": "Unilateral",
    "name": "Reverse lunge",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "adutores",
      "glúteo médio"
    ],
    "pattern": "Avanço unilateral",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Peso corporal ou halteres",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Dê um passo para trás, flexione os dois joelhos e empurre o chão para voltar.",
    "substitutes": [
      "Split squat",
      "walking lunge"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0039",
    "group": "Glúteos",
    "subgroup": "Unilateral",
    "name": "Walking lunge",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "adutores",
      "glúteo médio"
    ],
    "pattern": "Avanço unilateral",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Peso corporal ou halteres",
    "laterality": "Alternado",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Realize afundos avançando, estabilizando a pelve a cada passo.",
    "substitutes": [
      "Reverse lunge",
      "step-up"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0040",
    "group": "Glúteos",
    "subgroup": "Unilateral",
    "name": "Step-up",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "glúteo médio"
    ],
    "pattern": "Subida unilateral",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Caixa ou banco; halteres opcionais",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Suba na plataforma usando principalmente a perna apoiada e desça de forma controlada.",
    "substitutes": [
      "Split squat",
      "reverse lunge"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0041",
    "group": "Glúteos",
    "subgroup": "Unilateral",
    "name": "Step-down",
    "primaryMuscle": "Glúteo médio",
    "secondaryMuscles": [
      "Quadríceps",
      "glúteo máximo"
    ],
    "pattern": "Descida unilateral",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Caixa ou step",
    "laterality": "Unilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Desça lentamente de uma plataforma controlando o alinhamento do joelho e retorne.",
    "substitutes": [
      "Step-up",
      "split squat"
    ],
    "attention": "Ajustar amplitude à mobilidade e tolerância do joelho/quadril. Evitar progressão de carga quando houver dor aguda, inchaço ou perda de controle do joelho.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0042",
    "group": "Glúteos",
    "subgroup": "Abdução",
    "name": "Abdução na máquina",
    "primaryMuscle": "Glúteo médio",
    "secondaryMuscles": [
      "Glúteo mínimo"
    ],
    "pattern": "Abdução de quadril",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Cadeira abdutora",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Afaste as coxas contra a resistência mantendo o tronco estável.",
    "substitutes": [
      "Abdução no cabo",
      "lateral band walk"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0043",
    "group": "Adutores e abdutores",
    "subgroup": "Abdução",
    "name": "Abdução no cabo",
    "primaryMuscle": "Glúteo médio",
    "secondaryMuscles": [
      "Glúteo mínimo"
    ],
    "pattern": "Abdução de quadril",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia baixa e tornozeleira",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Afaste a perna lateralmente sem inclinar o tronco para compensar.",
    "substitutes": [
      "Cadeira abdutora",
      "abdução deitado"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0044",
    "group": "Adutores e abdutores",
    "subgroup": "Abdução",
    "name": "Abdução lateral deitado",
    "primaryMuscle": "Glúteo médio",
    "secondaryMuscles": [
      "Glúteo mínimo"
    ],
    "pattern": "Abdução de quadril",
    "jointClassification": "Uniarticular",
    "category": "Peso corporal",
    "equipment": "Colchonete",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Deitado de lado, eleve a perna superior mantendo a pelve estável.",
    "substitutes": [
      "Abdução no cabo",
      "lateral band walk"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0045",
    "group": "Adutores e abdutores",
    "subgroup": "Abdução",
    "name": "Lateral band walk",
    "primaryMuscle": "Glúteo médio",
    "secondaryMuscles": [
      "Glúteo mínimo",
      "glúteo máximo"
    ],
    "pattern": "Abdução/estabilização de quadril",
    "jointClassification": "Multiarticular",
    "category": "Elástico",
    "equipment": "Miniband",
    "laterality": "Alternado",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Com elástico tensionado, dê passos laterais curtos mantendo joelhos e quadris controlados.",
    "substitutes": [
      "Monster walk",
      "cadeira abdutora"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0046",
    "group": "Adutores e abdutores",
    "subgroup": "Abdução",
    "name": "Monster walk",
    "primaryMuscle": "Glúteo médio",
    "secondaryMuscles": [
      "Glúteo máximo",
      "quadríceps"
    ],
    "pattern": "Abdução/estabilização de quadril",
    "jointClassification": "Multiarticular",
    "category": "Elástico",
    "equipment": "Miniband",
    "laterality": "Alternado",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Caminhe diagonalmente mantendo tensão no elástico e joelhos alinhados.",
    "substitutes": [
      "Lateral band walk",
      "abdução máquina"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0047",
    "group": "Adutores e abdutores",
    "subgroup": "Adução",
    "name": "Cadeira adutora",
    "primaryMuscle": "Adutores",
    "secondaryMuscles": [],
    "pattern": "Adução de quadril",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Cadeira adutora",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Aproxime as coxas contra a resistência e retorne de forma controlada.",
    "substitutes": [
      "Adução no cabo",
      "Copenhagen curto"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0048",
    "group": "Adutores e abdutores",
    "subgroup": "Adução",
    "name": "Adução no cabo",
    "primaryMuscle": "Adutores",
    "secondaryMuscles": [
      "Grácil",
      "pectíneo"
    ],
    "pattern": "Adução de quadril",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia baixa e tornozeleira",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Puxe a perna em direção à linha média sem girar o tronco.",
    "substitutes": [
      "Cadeira adutora",
      "adução deitado"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0049",
    "group": "Adutores e abdutores",
    "subgroup": "Adução",
    "name": "Adução lateral deitado",
    "primaryMuscle": "Adutores",
    "secondaryMuscles": [],
    "pattern": "Adução de quadril",
    "jointClassification": "Uniarticular",
    "category": "Peso corporal",
    "equipment": "Colchonete",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Deitado de lado, eleve a perna inferior em direção à perna de cima.",
    "substitutes": [
      "Adução no cabo",
      "cadeira adutora"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0050",
    "group": "Adutores e abdutores",
    "subgroup": "Adução",
    "name": "Copenhagen plank curto",
    "primaryMuscle": "Adutores",
    "secondaryMuscles": [
      "Core",
      "glúteos"
    ],
    "pattern": "Adução isométrica",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Peso corporal",
    "equipment": "Banco",
    "laterality": "Unilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Apoie o joelho superior no banco e sustente a pelve elevada mantendo o corpo alinhado.",
    "substitutes": [
      "Prancha lateral",
      "cadeira adutora"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0051",
    "group": "Panturrilhas e tibial",
    "subgroup": "Panturrilha",
    "name": "Standing calf raise máquina",
    "primaryMuscle": "Gastrocnêmio",
    "secondaryMuscles": [
      "Sóleo"
    ],
    "pattern": "Flexão plantar",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Panturrilha em pé",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Eleve os calcanhares até a ponta dos pés e desça em amplitude controlada.",
    "substitutes": [
      "Calf raise no Smith",
      "calf press"
    ],
    "attention": "Evitar compensar com balanço. Reduzir amplitude/carga em dor aguda no tornozelo, tendão de Aquiles ou pé.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0052",
    "group": "Panturrilhas e tibial",
    "subgroup": "Panturrilha",
    "name": "Seated calf raise",
    "primaryMuscle": "Sóleo",
    "secondaryMuscles": [
      "Gastrocnêmio"
    ],
    "pattern": "Flexão plantar",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Panturrilha sentado",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Com joelhos flexionados, eleve os calcanhares contra a resistência e retorne.",
    "substitutes": [
      "Standing calf raise",
      "calf press"
    ],
    "attention": "Evitar compensar com balanço. Reduzir amplitude/carga em dor aguda no tornozelo, tendão de Aquiles ou pé.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0053",
    "group": "Panturrilhas e tibial",
    "subgroup": "Panturrilha",
    "name": "Calf raise no Smith",
    "primaryMuscle": "Gastrocnêmio",
    "secondaryMuscles": [
      "Sóleo"
    ],
    "pattern": "Flexão plantar",
    "jointClassification": "Uniarticular",
    "category": "Smith",
    "equipment": "Smith e step",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Com antepés apoiados, eleve e abaixe os calcanhares sob a barra guiada.",
    "substitutes": [
      "Standing calf raise",
      "calf raise com halteres"
    ],
    "attention": "Evitar compensar com balanço. Reduzir amplitude/carga em dor aguda no tornozelo, tendão de Aquiles ou pé.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0054",
    "group": "Panturrilhas e tibial",
    "subgroup": "Panturrilha",
    "name": "Calf raise com halteres",
    "primaryMuscle": "Gastrocnêmio",
    "secondaryMuscles": [
      "Sóleo"
    ],
    "pattern": "Flexão plantar",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Segure halteres e eleve os calcanhares mantendo equilíbrio e controle.",
    "substitutes": [
      "Smith calf raise",
      "unilateral calf raise"
    ],
    "attention": "Evitar compensar com balanço. Reduzir amplitude/carga em dor aguda no tornozelo, tendão de Aquiles ou pé.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0055",
    "group": "Panturrilhas e tibial",
    "subgroup": "Panturrilha",
    "name": "Unilateral calf raise",
    "primaryMuscle": "Gastrocnêmio",
    "secondaryMuscles": [
      "Sóleo"
    ],
    "pattern": "Flexão plantar",
    "jointClassification": "Uniarticular",
    "category": "Peso corporal",
    "equipment": "Step opcional",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Realize flexão plantar em uma perna, usando apoio apenas para equilíbrio.",
    "substitutes": [
      "Calf raise bilateral",
      "Smith calf raise"
    ],
    "attention": "Evitar compensar com balanço. Reduzir amplitude/carga em dor aguda no tornozelo, tendão de Aquiles ou pé.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0056",
    "group": "Panturrilhas e tibial",
    "subgroup": "Panturrilha",
    "name": "Calf press no leg press",
    "primaryMuscle": "Gastrocnêmio",
    "secondaryMuscles": [
      "Sóleo"
    ],
    "pattern": "Flexão plantar",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Leg press",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Mantenha joelhos quase fixos e mova apenas os tornozelos empurrando a plataforma com o antepé.",
    "substitutes": [
      "Standing calf raise",
      "seated calf raise"
    ],
    "attention": "Evitar compensar com balanço. Reduzir amplitude/carga em dor aguda no tornozelo, tendão de Aquiles ou pé.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0057",
    "group": "Panturrilhas e tibial",
    "subgroup": "Panturrilha",
    "name": "Donkey calf raise",
    "primaryMuscle": "Gastrocnêmio",
    "secondaryMuscles": [
      "Sóleo"
    ],
    "pattern": "Flexão plantar",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Máquina ou carga externa",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 2,
    "instructions": "Com tronco inclinado e quadris flexionados, eleve os calcanhares e retorne.",
    "substitutes": [
      "Standing calf raise",
      "Smith calf raise"
    ],
    "attention": "Evitar compensar com balanço. Reduzir amplitude/carga em dor aguda no tornozelo, tendão de Aquiles ou pé.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0058",
    "group": "Panturrilhas e tibial",
    "subgroup": "Tibial anterior",
    "name": "Tibialis raise",
    "primaryMuscle": "Tibial anterior",
    "secondaryMuscles": [
      "Extensores dos dedos"
    ],
    "pattern": "Dorsiflexão",
    "jointClassification": "Uniarticular",
    "category": "Peso corporal",
    "equipment": "Parede ou máquina específica",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Mantenha calcanhares apoiados e eleve as pontas dos pés em direção às canelas.",
    "substitutes": [
      "Dorsiflexão com faixa",
      "tibial machine"
    ],
    "attention": "Evitar compensar com balanço. Reduzir amplitude/carga em dor aguda no tornozelo, tendão de Aquiles ou pé.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0059",
    "group": "Peito",
    "subgroup": "Press horizontal",
    "name": "Supino reto com barra",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Desça a barra em direção ao peito com escápulas estáveis e pressione até estender os cotovelos.",
    "substitutes": [
      "Supino com halteres",
      "chest press"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0060",
    "group": "Peito",
    "subgroup": "Press horizontal",
    "name": "Supino reto com halteres",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halteres e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Desça os halteres ao lado do peito e pressione para cima mantendo controle escapular.",
    "substitutes": [
      "Chest press",
      "supino com barra"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0061",
    "group": "Peito",
    "subgroup": "Press inclinado",
    "name": "Supino inclinado com barra",
    "primaryMuscle": "Peitoral maior porção clavicular",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar inclinado",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra e banco inclinado",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Desça a barra à parte superior do peito e pressione mantendo o banco moderadamente inclinado.",
    "substitutes": [
      "Supino inclinado halteres",
      "incline chest press"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0062",
    "group": "Peito",
    "subgroup": "Press inclinado",
    "name": "Supino inclinado com halteres",
    "primaryMuscle": "Peitoral maior porção clavicular",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar inclinado",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halteres e banco inclinado",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Desça os halteres ao lado do tórax superior e pressione para cima.",
    "substitutes": [
      "Incline chest press",
      "supino inclinado barra"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0063",
    "group": "Peito",
    "subgroup": "Press declinado",
    "name": "Supino declinado com barra",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar declinado",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra e banco declinado",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Desça a barra ao peito em banco declinado e pressione mantendo o corpo estabilizado.",
    "substitutes": [
      "Decline chest press",
      "paralelas"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0064",
    "group": "Peito",
    "subgroup": "Press horizontal",
    "name": "Floor press com barra",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 2,
    "instructions": "Deitado no chão, desça a barra até os braços tocarem suavemente o solo e pressione.",
    "substitutes": [
      "Supino reto",
      "floor press halteres"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0065",
    "group": "Peito",
    "subgroup": "Press horizontal",
    "name": "Floor press com halteres",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Deitado no chão, abaixe os halteres até os braços encostarem no solo e pressione.",
    "substitutes": [
      "Supino halteres",
      "chest press"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0066",
    "group": "Peito",
    "subgroup": "Máquina",
    "name": "Chest press convergente",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Chest press",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Ajuste o banco, empurre as alças à frente e retorne até alongamento confortável.",
    "substitutes": [
      "Supino halteres",
      "chest press articulado"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0067",
    "group": "Peito",
    "subgroup": "Máquina",
    "name": "Incline chest press",
    "primaryMuscle": "Peitoral maior porção clavicular",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar inclinado",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Chest press inclinado",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Empurre as alavancas em trajetória inclinada e retorne com controle.",
    "substitutes": [
      "Supino inclinado halteres",
      "Smith inclinado"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0068",
    "group": "Peito",
    "subgroup": "Máquina",
    "name": "Decline chest press",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar declinado",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Chest press declinado",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Empurre as alavancas em trajetória levemente descendente e retorne.",
    "substitutes": [
      "Supino declinado",
      "paralelas assistidas"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0069",
    "group": "Peito",
    "subgroup": "Smith",
    "name": "Supino reto no Smith",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Smith",
    "equipment": "Smith e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Ajuste o banco à trajetória da barra guiada, desça ao peito e pressione.",
    "substitutes": [
      "Chest press",
      "supino barra"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0070",
    "group": "Peito",
    "subgroup": "Smith",
    "name": "Supino inclinado no Smith",
    "primaryMuscle": "Peitoral maior porção clavicular",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar inclinado",
    "jointClassification": "Multiarticular",
    "category": "Smith",
    "equipment": "Smith e banco inclinado",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Desça a barra guiada à parte superior do peito e pressione sem deslocar o banco.",
    "substitutes": [
      "Incline chest press",
      "supino inclinado halteres"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0071",
    "group": "Peito",
    "subgroup": "Peso corporal",
    "name": "Flexão de braços",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior",
      "core"
    ],
    "pattern": "Empurrar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Peso corporal",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Mantenha o corpo alinhado, aproxime o peito do chão e empurre até retornar.",
    "substitutes": [
      "Chest press",
      "flexão inclinada"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0072",
    "group": "Peito",
    "subgroup": "Peso corporal",
    "name": "Flexão inclinada",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Banco ou barra",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Apoie as mãos em superfície elevada, desça o peito e empurre mantendo alinhamento corporal.",
    "substitutes": [
      "Flexão tradicional",
      "chest press"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0073",
    "group": "Peito",
    "subgroup": "Peso corporal",
    "name": "Flexão declinada",
    "primaryMuscle": "Peitoral maior porção clavicular",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Banco ou caixa",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 2,
    "instructions": "Eleve os pés e execute a flexão mantendo o tronco rígido.",
    "substitutes": [
      "Flexão tradicional",
      "supino inclinado"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0074",
    "group": "Peito",
    "subgroup": "Peso corporal",
    "name": "Paralelas com ênfase no peito",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Tríceps",
      "deltoide anterior"
    ],
    "pattern": "Empurrar vertical/declinado",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Barras paralelas",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Incline levemente o tronco, desça dentro da amplitude confortável e empurre para subir.",
    "substitutes": [
      "Decline chest press",
      "flexão"
    ],
    "attention": "Requer amplitude confortável do ombro e controle de costelas/pelve. Reduzir amplitude/carga se houver dor no ombro; evitar compensação lombar.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0075",
    "group": "Peito",
    "subgroup": "Isolamento",
    "name": "Crucifixo com halteres",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Deltoide anterior"
    ],
    "pattern": "Adução horizontal do ombro",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Com cotovelos levemente flexionados, abra os braços e feche-os sobre o peito sem transformar em press.",
    "substitutes": [
      "Pec deck",
      "cable fly"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0076",
    "group": "Peito",
    "subgroup": "Isolamento",
    "name": "Crucifixo inclinado com halteres",
    "primaryMuscle": "Peitoral maior porção clavicular",
    "secondaryMuscles": [
      "Deltoide anterior"
    ],
    "pattern": "Adução horizontal do ombro",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres e banco inclinado",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 2,
    "instructions": "Abra os braços em banco inclinado e feche-os mantendo cotovelos quase fixos.",
    "substitutes": [
      "Cable fly baixo-alto",
      "pec deck"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0077",
    "group": "Peito",
    "subgroup": "Isolamento",
    "name": "Pec deck",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Deltoide anterior"
    ],
    "pattern": "Adução horizontal do ombro",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Pec deck",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Aproxime os braços à frente contra a resistência e retorne sem perder o apoio do tronco.",
    "substitutes": [
      "Cable fly",
      "crucifixo halteres"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0078",
    "group": "Peito",
    "subgroup": "Isolamento",
    "name": "Cable fly médio",
    "primaryMuscle": "Peitoral maior",
    "secondaryMuscles": [
      "Deltoide anterior"
    ],
    "pattern": "Adução horizontal do ombro",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Cross-over",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Una as mãos à frente do tronco mantendo cotovelos levemente flexionados e retorne.",
    "substitutes": [
      "Pec deck",
      "crucifixo halteres"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0079",
    "group": "Peito",
    "subgroup": "Isolamento",
    "name": "Cable fly baixo para alto",
    "primaryMuscle": "Peitoral maior porção clavicular",
    "secondaryMuscles": [
      "Deltoide anterior"
    ],
    "pattern": "Adução/flexão do ombro",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Cross-over",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 2,
    "instructions": "Traga as mãos de baixo para cima e para dentro mantendo tensão contínua.",
    "substitutes": [
      "Crucifixo inclinado",
      "incline press"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0080",
    "group": "Costas",
    "subgroup": "Puxada vertical",
    "name": "Lat pulldown pronado",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Bíceps",
      "braquial",
      "redondo maior",
      "trapézio inferior"
    ],
    "pattern": "Puxar vertical",
    "jointClassification": "Multiarticular",
    "category": "Cabo",
    "equipment": "Pulley alto",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Puxe a barra em direção ao tórax superior mantendo o tronco estável e retorne controladamente.",
    "substitutes": [
      "Puxada neutra",
      "barra fixa assistida"
    ],
    "attention": "Ajustar pegada e amplitude se houver desconforto no ombro/cotovelo. Evitar puxadas atrás da nuca e balanço excessivo.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0081",
    "group": "Costas",
    "subgroup": "Puxada vertical",
    "name": "Lat pulldown neutro",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Bíceps",
      "braquial",
      "redondo maior"
    ],
    "pattern": "Puxar vertical",
    "jointClassification": "Multiarticular",
    "category": "Cabo",
    "equipment": "Pulley alto e pegador neutro",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Puxe o pegador neutro em direção ao peito sem transformar o movimento em remada.",
    "substitutes": [
      "Pulldown pronado",
      "chin-up assistido"
    ],
    "attention": "Ajustar pegada e amplitude se houver desconforto no ombro/cotovelo. Evitar puxadas atrás da nuca e balanço excessivo.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0082",
    "group": "Costas",
    "subgroup": "Puxada vertical",
    "name": "Lat pulldown supinado",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Bíceps",
      "braquial"
    ],
    "pattern": "Puxar vertical",
    "jointClassification": "Multiarticular",
    "category": "Cabo",
    "equipment": "Pulley alto",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Puxe a barra com pegada supinada até a região superior do peito e retorne lentamente.",
    "substitutes": [
      "Puxada neutra",
      "chin-up"
    ],
    "attention": "Ajustar pegada e amplitude se houver desconforto no ombro/cotovelo. Evitar puxadas atrás da nuca e balanço excessivo.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0083",
    "group": "Costas",
    "subgroup": "Puxada vertical",
    "name": "Pulldown unilateral",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Bíceps",
      "redondo maior"
    ],
    "pattern": "Puxar vertical",
    "jointClassification": "Multiarticular",
    "category": "Cabo",
    "equipment": "Polia alta e alça",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Puxe a alça para baixo em direção à lateral do tronco mantendo a escápula controlada.",
    "substitutes": [
      "Pulldown bilateral",
      "máquina unilateral"
    ],
    "attention": "Ajustar pegada e amplitude se houver desconforto no ombro/cotovelo. Evitar puxadas atrás da nuca e balanço excessivo.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0084",
    "group": "Costas",
    "subgroup": "Puxada vertical",
    "name": "Barra fixa pronada",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Bíceps",
      "braquial",
      "redondo maior",
      "core"
    ],
    "pattern": "Puxar vertical",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Barra fixa",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Parta suspenso, puxe o corpo até aproximar o tórax da barra e desça com controle.",
    "substitutes": [
      "Barra assistida",
      "lat pulldown"
    ],
    "attention": "Ajustar pegada e amplitude se houver desconforto no ombro/cotovelo. Evitar puxadas atrás da nuca e balanço excessivo.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0085",
    "group": "Costas",
    "subgroup": "Puxada vertical",
    "name": "Chin-up supinado",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Bíceps",
      "braquial",
      "redondo maior"
    ],
    "pattern": "Puxar vertical",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Barra fixa",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Com pegada supinada, puxe o corpo até o queixo superar a barra e desça controladamente.",
    "substitutes": [
      "Puxada supinada",
      "chin-up assistido"
    ],
    "attention": "Ajustar pegada e amplitude se houver desconforto no ombro/cotovelo. Evitar puxadas atrás da nuca e balanço excessivo.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0086",
    "group": "Costas",
    "subgroup": "Puxada vertical",
    "name": "Barra fixa pegada neutra",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Bíceps",
      "braquial",
      "redondo maior"
    ],
    "pattern": "Puxar vertical",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Barra neutra",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Puxe o corpo com pegada neutra mantendo o tronco estável e retorne à suspensão.",
    "substitutes": [
      "Puxada neutra",
      "barra assistida"
    ],
    "attention": "Ajustar pegada e amplitude se houver desconforto no ombro/cotovelo. Evitar puxadas atrás da nuca e balanço excessivo.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0087",
    "group": "Costas",
    "subgroup": "Puxada vertical",
    "name": "Barra fixa assistida",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Bíceps",
      "braquial",
      "redondo maior"
    ],
    "pattern": "Puxar vertical",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Máquina assistida",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Use a assistência necessária para executar a puxada completa com controle.",
    "substitutes": [
      "Lat pulldown",
      "barra fixa"
    ],
    "attention": "Ajustar pegada e amplitude se houver desconforto no ombro/cotovelo. Evitar puxadas atrás da nuca e balanço excessivo.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0088",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "Remada baixa no cabo",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio médio",
      "romboides",
      "bíceps",
      "deltoide posterior"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Cabo",
    "equipment": "Polia baixa",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Puxe o pegador em direção ao abdômen mantendo o tronco estável e retorne estendendo os braços.",
    "substitutes": [
      "Remada máquina",
      "chest-supported row"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0089",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "Remada baixa unilateral",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio médio",
      "romboides",
      "bíceps"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Cabo",
    "equipment": "Polia baixa e alça",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Puxe uma alça por vez em direção ao quadril sem girar excessivamente o tronco.",
    "substitutes": [
      "Remada unilateral halter",
      "remada máquina"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0090",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "Remada curvada com barra",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio",
      "romboides",
      "bíceps",
      "eretores da coluna"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Incline o tronco por hinge, mantenha a coluna estável e puxe a barra ao abdômen.",
    "substitutes": [
      "Chest-supported row",
      "T-bar row"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0091",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "Pendlay row",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio",
      "romboides",
      "bíceps",
      "eretores da coluna"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Avançado",
    "complexity": 5,
    "instructions": "Parta com a barra no chão a cada repetição e puxe-a ao tronco mantendo posição firme do quadril.",
    "substitutes": [
      "Remada curvada",
      "seal row"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0092",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "Yates row",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Bíceps",
      "trapézio médio",
      "romboides"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Com tronco menos inclinado e pegada geralmente supinada, puxe a barra em direção ao abdômen.",
    "substitutes": [
      "Remada curvada",
      "remada baixa"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0093",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "Remada unilateral com halter",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio médio",
      "romboides",
      "bíceps"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halter e banco",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Com apoio, puxe o halter em direção ao quadril mantendo a escápula controlada.",
    "substitutes": [
      "Remada unilateral cabo",
      "máquina unilateral"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0094",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "Chest-supported row com halteres",
    "primaryMuscle": "Trapézio médio",
    "secondaryMuscles": [
      "Latíssimo",
      "romboides",
      "bíceps",
      "deltoide posterior"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halteres e banco inclinado",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Apoie o peito no banco e puxe os halteres ao tronco sem tirar o peito do apoio.",
    "substitutes": [
      "Seal row",
      "remada máquina"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0095",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "Seal row",
    "primaryMuscle": "Trapézio médio",
    "secondaryMuscles": [
      "Latíssimo",
      "romboides",
      "bíceps",
      "deltoide posterior"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra ou halteres e banco elevado",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Deitado de bruços em banco elevado, puxe a carga até o tronco e retorne.",
    "substitutes": [
      "Chest-supported row",
      "máquina articulada"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0096",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "T-bar row",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio médio",
      "romboides",
      "bíceps"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "T-bar ou landmine",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Incline o tronco e puxe o pegador em direção ao abdômen mantendo estabilidade lombopélvica.",
    "substitutes": [
      "Remada máquina",
      "remada curvada"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0097",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "Landmine row unilateral",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio",
      "romboides",
      "bíceps"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Landmine",
    "equipment": "Barra e landmine",
    "laterality": "Unilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Em posição estável, puxe a extremidade da barra em direção ao quadril de um lado.",
    "substitutes": [
      "Meadows row",
      "remada halter"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0098",
    "group": "Costas",
    "subgroup": "Remada horizontal",
    "name": "Meadows row",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio",
      "romboides",
      "bíceps"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Landmine",
    "equipment": "Barra e landmine",
    "laterality": "Unilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Posicione-se ao lado da barra e puxe sua extremidade em arco em direção ao quadril.",
    "substitutes": [
      "Landmine row",
      "remada halter"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0099",
    "group": "Costas",
    "subgroup": "Máquina",
    "name": "Remada articulada convergente",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio médio",
      "romboides",
      "bíceps"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Remada articulada",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Ajuste o peito ao apoio e puxe as alavancas em direção ao corpo.",
    "substitutes": [
      "Remada baixa cabo",
      "chest-supported row"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0100",
    "group": "Costas",
    "subgroup": "Máquina",
    "name": "Remada unilateral máquina",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio",
      "romboides",
      "bíceps"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Remada unilateral",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Puxe uma alavanca por vez mantendo o tórax estabilizado no apoio.",
    "substitutes": [
      "Remada halter",
      "remada cabo unilateral"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0101",
    "group": "Costas",
    "subgroup": "Máquina",
    "name": "High row máquina",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Trapézio",
      "romboides",
      "bíceps",
      "deltoide posterior"
    ],
    "pattern": "Puxar diagonal",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "High row",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Puxe as alavancas de uma posição alta em direção às laterais do tronco.",
    "substitutes": [
      "Pulldown neutro",
      "remada articulada"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0102",
    "group": "Costas",
    "subgroup": "Peso corporal",
    "name": "Inverted row",
    "primaryMuscle": "Trapézio médio",
    "secondaryMuscles": [
      "Latíssimo",
      "romboides",
      "bíceps",
      "core"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Barra fixa baixa",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Mantenha o corpo alinhado sob a barra e puxe o peito em direção a ela.",
    "substitutes": [
      "TRX row",
      "remada baixa"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0103",
    "group": "Costas",
    "subgroup": "Peso corporal",
    "name": "TRX row",
    "primaryMuscle": "Trapézio médio",
    "secondaryMuscles": [
      "Latíssimo",
      "romboides",
      "bíceps",
      "core"
    ],
    "pattern": "Puxar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Suspensão",
    "equipment": "TRX ou argolas",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Incline o corpo para trás e puxe-o em direção às alças mantendo o corpo rígido.",
    "substitutes": [
      "Inverted row",
      "remada cabo"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0104",
    "group": "Costas",
    "subgroup": "Isolamento",
    "name": "Straight-arm pulldown",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Redondo maior",
      "tríceps cabeça longa"
    ],
    "pattern": "Extensão do ombro",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia alta e barra ou corda",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Com cotovelos quase fixos, leve os braços de cima para baixo até junto ao corpo.",
    "substitutes": [
      "Pullover máquina",
      "pullover no cabo"
    ],
    "attention": "Usar amplitude sem dor e evitar elevação compensatória excessiva do ombro. Priorizar controle escapular.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0105",
    "group": "Costas",
    "subgroup": "Isolamento",
    "name": "Pullover máquina",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Peitoral maior",
      "redondo maior",
      "tríceps cabeça longa"
    ],
    "pattern": "Extensão do ombro",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Pullover machine",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Empurre as alavancas de cima para baixo mantendo os cotovelos em posição quase fixa.",
    "substitutes": [
      "Straight-arm pulldown",
      "pullover halter"
    ],
    "attention": "Usar amplitude sem dor e evitar elevação compensatória excessiva do ombro. Priorizar controle escapular.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0106",
    "group": "Costas",
    "subgroup": "Isolamento",
    "name": "Pullover com halter",
    "primaryMuscle": "Latíssimo do dorso",
    "secondaryMuscles": [
      "Peitoral maior",
      "serrátil",
      "tríceps cabeça longa"
    ],
    "pattern": "Extensão do ombro",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halter e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Leve o halter atrás da cabeça com cotovelos pouco flexionados e retorne pela extensão do ombro.",
    "substitutes": [
      "Pullover máquina",
      "cabo"
    ],
    "attention": "Usar amplitude sem dor e evitar elevação compensatória excessiva do ombro. Priorizar controle escapular.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0107",
    "group": "Costas",
    "subgroup": "Trapézio",
    "name": "Encolhimento com halteres",
    "primaryMuscle": "Trapézio superior",
    "secondaryMuscles": [
      "Elevador da escápula"
    ],
    "pattern": "Elevação escapular",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Eleve os ombros verticalmente sem girá-los e desça de forma controlada.",
    "substitutes": [
      "Shrug barra",
      "shrug máquina"
    ],
    "attention": "Usar amplitude sem dor e evitar elevação compensatória excessiva do ombro. Priorizar controle escapular.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0108",
    "group": "Costas",
    "subgroup": "Trapézio",
    "name": "Encolhimento com barra",
    "primaryMuscle": "Trapézio superior",
    "secondaryMuscles": [
      "Elevador da escápula"
    ],
    "pattern": "Elevação escapular",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Segure a barra e eleve os ombros em direção às orelhas sem flexionar os cotovelos.",
    "substitutes": [
      "Shrug halteres",
      "Smith shrug"
    ],
    "attention": "Usar amplitude sem dor e evitar elevação compensatória excessiva do ombro. Priorizar controle escapular.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0109",
    "group": "Costas",
    "subgroup": "Trapézio",
    "name": "Shrug no Smith",
    "primaryMuscle": "Trapézio superior",
    "secondaryMuscles": [
      "Elevador da escápula"
    ],
    "pattern": "Elevação escapular",
    "jointClassification": "Uniarticular",
    "category": "Smith",
    "equipment": "Smith machine",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Eleve e abaixe os ombros sob a barra guiada mantendo braços estendidos.",
    "substitutes": [
      "Shrug máquina",
      "halteres"
    ],
    "attention": "Usar amplitude sem dor e evitar elevação compensatória excessiva do ombro. Priorizar controle escapular.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0110",
    "group": "Ombros",
    "subgroup": "Press vertical",
    "name": "Overhead press com barra",
    "primaryMuscle": "Deltoide anterior",
    "secondaryMuscles": [
      "Deltoide lateral",
      "tríceps",
      "trapézio",
      "core"
    ],
    "pattern": "Empurrar vertical",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Pressione a barra da altura dos ombros até acima da cabeça mantendo o tronco firme.",
    "substitutes": [
      "Shoulder press halteres",
      "máquina"
    ],
    "attention": "Requer amplitude confortável do ombro e controle de costelas/pelve. Reduzir amplitude/carga se houver dor no ombro; evitar compensação lombar.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0111",
    "group": "Ombros",
    "subgroup": "Press vertical",
    "name": "Shoulder press com halteres",
    "primaryMuscle": "Deltoide anterior",
    "secondaryMuscles": [
      "Deltoide lateral",
      "tríceps"
    ],
    "pattern": "Empurrar vertical",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Pressione os halteres acima da cabeça e retorne até uma amplitude confortável.",
    "substitutes": [
      "Shoulder press máquina",
      "landmine press"
    ],
    "attention": "Requer amplitude confortável do ombro e controle de costelas/pelve. Reduzir amplitude/carga se houver dor no ombro; evitar compensação lombar.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0112",
    "group": "Ombros",
    "subgroup": "Press vertical",
    "name": "Arnold press",
    "primaryMuscle": "Deltoide anterior",
    "secondaryMuscles": [
      "Deltoide lateral",
      "tríceps"
    ],
    "pattern": "Empurrar vertical com rotação",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Inicie com halteres à frente e gire os braços enquanto pressiona acima da cabeça.",
    "substitutes": [
      "Shoulder press halteres",
      "máquina"
    ],
    "attention": "Requer amplitude confortável do ombro e controle de costelas/pelve. Reduzir amplitude/carga se houver dor no ombro; evitar compensação lombar.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0113",
    "group": "Ombros",
    "subgroup": "Press vertical",
    "name": "Push press",
    "primaryMuscle": "Deltoide anterior",
    "secondaryMuscles": [
      "Tríceps",
      "quadríceps",
      "glúteos",
      "core"
    ],
    "pattern": "Empurrar vertical explosivo",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra",
    "laterality": "Bilateral",
    "minimumLevel": "Avançado",
    "complexity": 5,
    "instructions": "Use pequena flexão e extensão das pernas para impulsionar a barra acima da cabeça.",
    "substitutes": [
      "Overhead press",
      "landmine press"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Potência",
      "Condicionamento"
    ]
  },
  {
    "id": "ex0114",
    "group": "Ombros",
    "subgroup": "Press vertical",
    "name": "Landmine press bilateral",
    "primaryMuscle": "Deltoide anterior",
    "secondaryMuscles": [
      "Peitoral superior",
      "tríceps",
      "serrátil"
    ],
    "pattern": "Empurrar diagonal",
    "jointClassification": "Multiarticular",
    "category": "Landmine",
    "equipment": "Barra e landmine",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Pressione a extremidade da barra para cima e à frente mantendo costelas controladas.",
    "substitutes": [
      "Shoulder press máquina",
      "incline press"
    ],
    "attention": "Requer amplitude confortável do ombro e controle de costelas/pelve. Reduzir amplitude/carga se houver dor no ombro; evitar compensação lombar.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0115",
    "group": "Ombros",
    "subgroup": "Press vertical",
    "name": "Landmine press unilateral",
    "primaryMuscle": "Deltoide anterior",
    "secondaryMuscles": [
      "Peitoral superior",
      "tríceps",
      "serrátil",
      "core"
    ],
    "pattern": "Empurrar diagonal",
    "jointClassification": "Multiarticular",
    "category": "Landmine",
    "equipment": "Barra e landmine",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Pressione a barra diagonalmente com um braço sem girar excessivamente o tronco.",
    "substitutes": [
      "Landmine bilateral",
      "cable press"
    ],
    "attention": "Requer amplitude confortável do ombro e controle de costelas/pelve. Reduzir amplitude/carga se houver dor no ombro; evitar compensação lombar.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0116",
    "group": "Ombros",
    "subgroup": "Máquina",
    "name": "Shoulder press máquina",
    "primaryMuscle": "Deltoide anterior",
    "secondaryMuscles": [
      "Deltoide lateral",
      "tríceps"
    ],
    "pattern": "Empurrar vertical",
    "jointClassification": "Multiarticular",
    "category": "Máquina",
    "equipment": "Shoulder press",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Ajuste o banco e pressione as alavancas acima da cabeça sem elevar excessivamente os ombros.",
    "substitutes": [
      "Press halteres",
      "landmine press"
    ],
    "attention": "Requer amplitude confortável do ombro e controle de costelas/pelve. Reduzir amplitude/carga se houver dor no ombro; evitar compensação lombar.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0117",
    "group": "Ombros",
    "subgroup": "Smith",
    "name": "Shoulder press no Smith",
    "primaryMuscle": "Deltoide anterior",
    "secondaryMuscles": [
      "Deltoide lateral",
      "tríceps"
    ],
    "pattern": "Empurrar vertical",
    "jointClassification": "Multiarticular",
    "category": "Smith",
    "equipment": "Smith e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Ajuste o banco à trajetória e pressione a barra guiada acima da cabeça.",
    "substitutes": [
      "Máquina",
      "halteres"
    ],
    "attention": "Requer amplitude confortável do ombro e controle de costelas/pelve. Reduzir amplitude/carga se houver dor no ombro; evitar compensação lombar.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0118",
    "group": "Ombros",
    "subgroup": "Deltoide lateral",
    "name": "Elevação lateral com halteres",
    "primaryMuscle": "Deltoide lateral",
    "secondaryMuscles": [
      "Supraespinal",
      "trapézio"
    ],
    "pattern": "Abdução do ombro",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Eleve os braços lateralmente com cotovelos levemente flexionados e desça controladamente.",
    "substitutes": [
      "Elevação lateral cabo",
      "máquina"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0119",
    "group": "Ombros",
    "subgroup": "Deltoide lateral",
    "name": "Elevação lateral unilateral no cabo",
    "primaryMuscle": "Deltoide lateral",
    "secondaryMuscles": [
      "Supraespinal"
    ],
    "pattern": "Abdução do ombro",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia baixa",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Afaste o braço lateralmente contra a polia mantendo o tronco estável.",
    "substitutes": [
      "Elevação lateral halter",
      "máquina"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0120",
    "group": "Ombros",
    "subgroup": "Deltoide lateral",
    "name": "Elevação lateral máquina",
    "primaryMuscle": "Deltoide lateral",
    "secondaryMuscles": [
      "Supraespinal"
    ],
    "pattern": "Abdução do ombro",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Máquina lateral raise",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Eleve os braços contra os apoios da máquina e retorne devagar.",
    "substitutes": [
      "Elevação lateral cabo",
      "halteres"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0121",
    "group": "Ombros",
    "subgroup": "Deltoide lateral",
    "name": "Elevação lateral inclinada",
    "primaryMuscle": "Deltoide lateral",
    "secondaryMuscles": [
      "Supraespinal"
    ],
    "pattern": "Abdução do ombro",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halter e apoio",
    "laterality": "Unilateral",
    "minimumLevel": "Intermediário",
    "complexity": 2,
    "instructions": "Incline o corpo usando apoio e eleve o braço lateralmente em amplitude controlada.",
    "substitutes": [
      "Cabo unilateral",
      "halteres"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0122",
    "group": "Ombros",
    "subgroup": "Deltoide anterior",
    "name": "Elevação frontal com halteres",
    "primaryMuscle": "Deltoide anterior",
    "secondaryMuscles": [
      "Peitoral clavicular"
    ],
    "pattern": "Flexão do ombro",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Eleve os braços à frente até aproximadamente a linha dos ombros e retorne.",
    "substitutes": [
      "Elevação frontal cabo",
      "landmine press"
    ],
    "attention": "Usar amplitude sem dor e evitar elevação compensatória excessiva do ombro. Priorizar controle escapular.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0123",
    "group": "Ombros",
    "subgroup": "Deltoide posterior",
    "name": "Crucifixo inverso com halteres",
    "primaryMuscle": "Deltoide posterior",
    "secondaryMuscles": [
      "Trapézio médio",
      "romboides"
    ],
    "pattern": "Abdução horizontal do ombro",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Incline o tronco ou apoie-o e abra os braços para trás mantendo cotovelos pouco flexionados.",
    "substitutes": [
      "Reverse pec deck",
      "reverse cable fly"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0124",
    "group": "Ombros",
    "subgroup": "Deltoide posterior",
    "name": "Reverse pec deck",
    "primaryMuscle": "Deltoide posterior",
    "secondaryMuscles": [
      "Trapézio médio",
      "romboides"
    ],
    "pattern": "Abdução horizontal do ombro",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Pec deck reverso",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Com o peito apoiado, abra os braços para trás contra a resistência.",
    "substitutes": [
      "Crucifixo inverso",
      "face pull"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0125",
    "group": "Ombros",
    "subgroup": "Deltoide posterior",
    "name": "Reverse cable fly",
    "primaryMuscle": "Deltoide posterior",
    "secondaryMuscles": [
      "Trapézio médio",
      "romboides"
    ],
    "pattern": "Abdução horizontal do ombro",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Cross-over",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Cruze os cabos e abra os braços para trás mantendo o tronco estável.",
    "substitutes": [
      "Reverse pec deck",
      "crucifixo inverso"
    ],
    "attention": "Evitar compensação do tronco e amplitude forçada. Reduzir carga se houver dor no quadril ou virilha.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0126",
    "group": "Ombros",
    "subgroup": "Escápula/rotadores",
    "name": "Face pull",
    "primaryMuscle": "Deltoide posterior",
    "secondaryMuscles": [
      "Trapézio médio",
      "rotadores externos",
      "romboides"
    ],
    "pattern": "Puxar horizontal + rotação externa",
    "jointClassification": "Multiarticular",
    "category": "Cabo",
    "equipment": "Polia alta e corda",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Puxe a corda em direção ao rosto abrindo os cotovelos e finalizando com rotação externa confortável.",
    "substitutes": [
      "Reverse pec deck",
      "cable external rotation"
    ],
    "attention": "Manter controle escapular e lombopélvico. Em remadas sem apoio, reduzir carga se a lombar limitar a técnica.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0127",
    "group": "Bíceps",
    "subgroup": "Rosca",
    "name": "Rosca direta com barra",
    "primaryMuscle": "Bíceps braquial",
    "secondaryMuscles": [
      "Braquial",
      "braquiorradial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Barra reta",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Flexione os cotovelos levando a barra para cima sem balançar o tronco e desça com controle.",
    "substitutes": [
      "Rosca EZ",
      "cable curl"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0128",
    "group": "Bíceps",
    "subgroup": "Rosca",
    "name": "Rosca direta barra EZ",
    "primaryMuscle": "Bíceps braquial",
    "secondaryMuscles": [
      "Braquial",
      "braquiorradial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Barra EZ",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Flexione os cotovelos mantendo os braços próximos ao corpo e retorne lentamente.",
    "substitutes": [
      "Rosca barra reta",
      "máquina"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0129",
    "group": "Bíceps",
    "subgroup": "Rosca",
    "name": "Rosca alternada com halteres",
    "primaryMuscle": "Bíceps braquial",
    "secondaryMuscles": [
      "Braquial",
      "braquiorradial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Alternado",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Flexione um cotovelo por vez mantendo o ombro estável.",
    "substitutes": [
      "Rosca simultânea",
      "cable curl unilateral"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0130",
    "group": "Bíceps",
    "subgroup": "Rosca",
    "name": "Rosca simultânea com halteres",
    "primaryMuscle": "Bíceps braquial",
    "secondaryMuscles": [
      "Braquial",
      "braquiorradial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Flexione os dois cotovelos simultaneamente sem projetar os ombros à frente.",
    "substitutes": [
      "Rosca alternada",
      "EZ curl"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0131",
    "group": "Bíceps",
    "subgroup": "Rosca",
    "name": "Rosca inclinada com halteres",
    "primaryMuscle": "Bíceps braquial cabeça longa",
    "secondaryMuscles": [
      "Braquial",
      "braquiorradial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres e banco inclinado",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 2,
    "instructions": "Com braços ligeiramente atrás do tronco, flexione os cotovelos sem avançar os ombros.",
    "substitutes": [
      "Bayesian curl",
      "rosca alternada"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0132",
    "group": "Bíceps",
    "subgroup": "Rosca",
    "name": "Rosca Scott com barra EZ",
    "primaryMuscle": "Bíceps braquial",
    "secondaryMuscles": [
      "Braquial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Banco Scott e barra EZ",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Apoie os braços no banco, flexione os cotovelos e retorne sem perder o apoio.",
    "substitutes": [
      "Scott máquina",
      "spider curl"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0133",
    "group": "Bíceps",
    "subgroup": "Rosca",
    "name": "Rosca Scott máquina",
    "primaryMuscle": "Bíceps braquial",
    "secondaryMuscles": [
      "Braquial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Máquina Scott",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Mantenha os braços apoiados e flexione os cotovelos contra a resistência guiada.",
    "substitutes": [
      "Scott EZ",
      "máquina de bíceps"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0134",
    "group": "Bíceps",
    "subgroup": "Rosca",
    "name": "Spider curl",
    "primaryMuscle": "Bíceps braquial",
    "secondaryMuscles": [
      "Braquial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres ou barra e banco inclinado",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 2,
    "instructions": "Apoie o peito no banco inclinado e flexione os cotovelos com os braços pendentes.",
    "substitutes": [
      "Scott curl",
      "cable curl"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0135",
    "group": "Bíceps",
    "subgroup": "Rosca",
    "name": "Rosca concentrada",
    "primaryMuscle": "Bíceps braquial",
    "secondaryMuscles": [
      "Braquial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halter",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Apoie o braço na coxa e flexione o cotovelo sem usar impulso.",
    "substitutes": [
      "Scott unilateral",
      "cable curl"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0136",
    "group": "Bíceps",
    "subgroup": "Rosca neutra",
    "name": "Rosca martelo",
    "primaryMuscle": "Braquial",
    "secondaryMuscles": [
      "Braquiorradial",
      "bíceps braquial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Flexione os cotovelos mantendo as palmas voltadas uma para a outra.",
    "substitutes": [
      "Cross-body hammer",
      "rope curl"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0137",
    "group": "Bíceps",
    "subgroup": "Rosca neutra",
    "name": "Cross-body hammer curl",
    "primaryMuscle": "Braquial",
    "secondaryMuscles": [
      "Braquiorradial",
      "bíceps"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres",
    "laterality": "Alternado",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Leve o halter em direção ao ombro oposto mantendo pegada neutra.",
    "substitutes": [
      "Rosca martelo",
      "rope curl"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0138",
    "group": "Bíceps",
    "subgroup": "Cabo",
    "name": "Bayesian cable curl",
    "primaryMuscle": "Bíceps braquial cabeça longa",
    "secondaryMuscles": [
      "Braquial"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia baixa e alça",
    "laterality": "Unilateral",
    "minimumLevel": "Intermediário",
    "complexity": 2,
    "instructions": "De costas para a polia, mantenha o braço atrás do tronco e flexione o cotovelo.",
    "substitutes": [
      "Rosca inclinada",
      "cable curl"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0139",
    "group": "Tríceps",
    "subgroup": "Extensão de cotovelo",
    "name": "Triceps pushdown com barra",
    "primaryMuscle": "Tríceps braquial",
    "secondaryMuscles": [
      "Ancôneo"
    ],
    "pattern": "Extensão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia alta e barra",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Mantenha os braços junto ao tronco e estenda os cotovelos até baixo sem mover os ombros.",
    "substitutes": [
      "Pushdown corda",
      "máquina"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0140",
    "group": "Tríceps",
    "subgroup": "Extensão de cotovelo",
    "name": "Triceps pushdown com corda",
    "primaryMuscle": "Tríceps braquial",
    "secondaryMuscles": [
      "Ancôneo"
    ],
    "pattern": "Extensão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia alta e corda",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Estenda os cotovelos e separe levemente as pontas da corda no final.",
    "substitutes": [
      "Pushdown barra",
      "unilateral"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0141",
    "group": "Tríceps",
    "subgroup": "Extensão de cotovelo",
    "name": "Pushdown unilateral",
    "primaryMuscle": "Tríceps braquial",
    "secondaryMuscles": [
      "Ancôneo"
    ],
    "pattern": "Extensão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia alta e alça",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Estenda um cotovelo por vez mantendo o braço próximo ao corpo.",
    "substitutes": [
      "Pushdown corda",
      "kickback cabo"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0142",
    "group": "Tríceps",
    "subgroup": "Acima da cabeça",
    "name": "Overhead cable extension",
    "primaryMuscle": "Tríceps cabeça longa",
    "secondaryMuscles": [
      "Demais cabeças do tríceps"
    ],
    "pattern": "Extensão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia e corda",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Com os braços elevados, flexione e estenda os cotovelos mantendo o tronco estável.",
    "substitutes": [
      "French press",
      "skull crusher"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0143",
    "group": "Tríceps",
    "subgroup": "Acima da cabeça",
    "name": "French press com halter",
    "primaryMuscle": "Tríceps cabeça longa",
    "secondaryMuscles": [
      "Demais cabeças do tríceps"
    ],
    "pattern": "Extensão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halter",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Segure o halter acima da cabeça, flexione os cotovelos e estenda-os novamente.",
    "substitutes": [
      "Overhead cabo",
      "testa"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0144",
    "group": "Tríceps",
    "subgroup": "Extensão de cotovelo",
    "name": "Tríceps testa barra EZ",
    "primaryMuscle": "Tríceps braquial",
    "secondaryMuscles": [
      "Ancôneo"
    ],
    "pattern": "Extensão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Barra EZ e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Flexione os cotovelos levando a barra em direção à testa ou atrás da cabeça e estenda.",
    "substitutes": [
      "Overhead cabo",
      "máquina"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0145",
    "group": "Tríceps",
    "subgroup": "Extensão de cotovelo",
    "name": "Tríceps testa com halteres",
    "primaryMuscle": "Tríceps braquial",
    "secondaryMuscles": [
      "Ancôneo"
    ],
    "pattern": "Extensão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halteres e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Mantenha os braços estáveis e flexione os cotovelos até a amplitude confortável antes de estender.",
    "substitutes": [
      "Skull crusher EZ",
      "overhead cabo"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0146",
    "group": "Tríceps",
    "subgroup": "Extensão de cotovelo",
    "name": "Tríceps coice com halter",
    "primaryMuscle": "Tríceps braquial",
    "secondaryMuscles": [
      "Ancôneo"
    ],
    "pattern": "Extensão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halter",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Com o braço atrás do tronco, estenda o cotovelo sem mover o ombro.",
    "substitutes": [
      "Cable kickback",
      "pushdown unilateral"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0147",
    "group": "Tríceps",
    "subgroup": "Extensão de cotovelo",
    "name": "Cable kickback",
    "primaryMuscle": "Tríceps braquial",
    "secondaryMuscles": [
      "Ancôneo"
    ],
    "pattern": "Extensão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia baixa e alça",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Leve o braço para trás e estenda o cotovelo mantendo tensão contínua.",
    "substitutes": [
      "Kickback halter",
      "pushdown"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0148",
    "group": "Tríceps",
    "subgroup": "Máquina",
    "name": "Tríceps máquina",
    "primaryMuscle": "Tríceps braquial",
    "secondaryMuscles": [
      "Ancôneo"
    ],
    "pattern": "Extensão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Máquina de tríceps",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Ajuste o apoio e estenda os cotovelos contra a resistência guiada.",
    "substitutes": [
      "Pushdown",
      "testa"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0149",
    "group": "Tríceps",
    "subgroup": "Composto",
    "name": "Supino pegada fechada",
    "primaryMuscle": "Tríceps braquial",
    "secondaryMuscles": [
      "Peitoral maior",
      "deltoide anterior"
    ],
    "pattern": "Empurrar horizontal",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra e banco",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Use pegada moderadamente fechada, desça a barra ao peito e pressione priorizando extensão dos cotovelos.",
    "substitutes": [
      "Chest press fechado",
      "paralelas"
    ],
    "attention": "Manter escápulas e ombros em posição confortável. Evitar amplitude que provoque dor anterior no ombro; ajustar pegada e banco quando necessário.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0150",
    "group": "Tríceps",
    "subgroup": "Composto",
    "name": "Paralelas com ênfase no tríceps",
    "primaryMuscle": "Tríceps braquial",
    "secondaryMuscles": [
      "Peitoral maior",
      "deltoide anterior"
    ],
    "pattern": "Empurrar vertical/declinado",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Barras paralelas",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Mantenha o tronco mais vertical, desça dentro da amplitude tolerada e empurre estendendo os cotovelos.",
    "substitutes": [
      "Máquina assistida",
      "supino fechado"
    ],
    "attention": "Requer amplitude confortável do ombro e controle de costelas/pelve. Reduzir amplitude/carga se houver dor no ombro; evitar compensação lombar.",
    "goals": [
      "Hipertrofia",
      "Força",
      "Composição corporal"
    ]
  },
  {
    "id": "ex0151",
    "group": "Antebraços e pegada",
    "subgroup": "Punho",
    "name": "Wrist curl",
    "primaryMuscle": "Flexores do punho",
    "secondaryMuscles": [
      "Flexores dos dedos"
    ],
    "pattern": "Flexão do punho",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Barra ou halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Apoie os antebraços e flexione os punhos elevando a carga sem mover os cotovelos.",
    "substitutes": [
      "Cable wrist curl",
      "wrist roller"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0152",
    "group": "Antebraços e pegada",
    "subgroup": "Punho",
    "name": "Reverse wrist curl",
    "primaryMuscle": "Extensores do punho",
    "secondaryMuscles": [
      "Extensores dos dedos"
    ],
    "pattern": "Extensão do punho",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Barra ou halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Apoie os antebraços e estenda os punhos contra a resistência.",
    "substitutes": [
      "Cable reverse curl",
      "wrist roller"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0153",
    "group": "Antebraços e pegada",
    "subgroup": "Antebraço",
    "name": "Rosca inversa",
    "primaryMuscle": "Braquiorradial",
    "secondaryMuscles": [
      "Braquial",
      "extensores do antebraço",
      "bíceps"
    ],
    "pattern": "Flexão do cotovelo",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Barra EZ ou reta",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Flexione os cotovelos com pegada pronada mantendo os punhos neutros.",
    "substitutes": [
      "Rosca martelo",
      "cable reverse curl"
    ],
    "attention": "Manter punho e cotovelo alinhados. Reduzir carga/volume se houver dor no cotovelo, punho ou tendões.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0154",
    "group": "Antebraços e pegada",
    "subgroup": "Rotação",
    "name": "Pronação com halter",
    "primaryMuscle": "Pronadores do antebraço",
    "secondaryMuscles": [
      "Flexores do punho"
    ],
    "pattern": "Pronação do antebraço",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halter leve",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Com cotovelo apoiado, gire o antebraço levando a palma para baixo.",
    "substitutes": [
      "Supinação com halter",
      "cabo"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0155",
    "group": "Antebraços e pegada",
    "subgroup": "Rotação",
    "name": "Supinação com halter",
    "primaryMuscle": "Supinador",
    "secondaryMuscles": [
      "Bíceps braquial"
    ],
    "pattern": "Supinação do antebraço",
    "jointClassification": "Uniarticular",
    "category": "Peso livre",
    "equipment": "Halter leve",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Com cotovelo apoiado, gire o antebraço levando a palma para cima.",
    "substitutes": [
      "Pronação com halter",
      "cabo"
    ],
    "attention": "Executar em amplitude confortável e com técnica estável. Reduzir carga ou interromper se surgir dor aguda, tontura ou perda de controle.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0156",
    "group": "Antebraços e pegada",
    "subgroup": "Pegada",
    "name": "Farmer carry",
    "primaryMuscle": "Flexores dos dedos",
    "secondaryMuscles": [
      "Trapézio",
      "core",
      "glúteos"
    ],
    "pattern": "Carregada/locomoção",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Peso livre",
    "equipment": "Halteres ou farmer handles",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Caminhe ereto segurando cargas ao lado do corpo sem deixar os ombros colapsarem.",
    "substitutes": [
      "Suitcase carry",
      "dead hang"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0157",
    "group": "Antebraços e pegada",
    "subgroup": "Pegada",
    "name": "Suitcase carry",
    "primaryMuscle": "Flexores dos dedos",
    "secondaryMuscles": [
      "Oblíquos",
      "quadrado lombar",
      "trapézio"
    ],
    "pattern": "Carregada unilateral",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Peso livre",
    "equipment": "Halter ou kettlebell",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Caminhe com carga em um lado mantendo o tronco vertical e estável.",
    "substitutes": [
      "Farmer carry",
      "Pallof press"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0158",
    "group": "Antebraços e pegada",
    "subgroup": "Pegada",
    "name": "Dead hang",
    "primaryMuscle": "Flexores dos dedos",
    "secondaryMuscles": [
      "Latíssimo",
      "trapézio",
      "músculos do ombro"
    ],
    "pattern": "Suspensão isométrica",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Peso corporal",
    "equipment": "Barra fixa",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Pendure-se na barra mantendo pegada firme e ombros em posição confortável.",
    "substitutes": [
      "Farmer carry",
      "assisted hang"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0159",
    "group": "Core",
    "subgroup": "Anti-extensão",
    "name": "Prancha frontal",
    "primaryMuscle": "Reto abdominal",
    "secondaryMuscles": [
      "Oblíquos",
      "transverso",
      "glúteos"
    ],
    "pattern": "Anti-extensão",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Peso corporal",
    "equipment": "Colchonete",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Mantenha cabeça, tronco e pelve alinhados resistindo à extensão lombar.",
    "substitutes": [
      "Dead bug",
      "body saw"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0160",
    "group": "Core",
    "subgroup": "Anti-extensão",
    "name": "Prancha frontal com carga",
    "primaryMuscle": "Reto abdominal",
    "secondaryMuscles": [
      "Oblíquos",
      "transverso",
      "glúteos"
    ],
    "pattern": "Anti-extensão",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Peso livre",
    "equipment": "Anilha e colchonete",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Mantenha a prancha com carga externa sobre o tronco sem perder alinhamento.",
    "substitutes": [
      "Prancha",
      "ab wheel"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0161",
    "group": "Core",
    "subgroup": "Anti-extensão",
    "name": "Dead bug",
    "primaryMuscle": "Transverso do abdome",
    "secondaryMuscles": [
      "Reto abdominal",
      "oblíquos",
      "flexores do quadril"
    ],
    "pattern": "Anti-extensão",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Peso corporal",
    "equipment": "Colchonete",
    "laterality": "Contralateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Mova braço e perna opostos mantendo costelas e pelve controladas.",
    "substitutes": [
      "Prancha",
      "bird dog"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0162",
    "group": "Core",
    "subgroup": "Anti-extensão",
    "name": "Ab wheel rollout",
    "primaryMuscle": "Reto abdominal",
    "secondaryMuscles": [
      "Latíssimo",
      "serrátil",
      "oblíquos",
      "flexores do quadril"
    ],
    "pattern": "Anti-extensão dinâmica",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Roda abdominal",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Role a roda para frente mantendo o tronco rígido e retorne sem deixar a lombar ceder.",
    "substitutes": [
      "Barbell rollout",
      "body saw"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0163",
    "group": "Core",
    "subgroup": "Anti-extensão",
    "name": "Barbell rollout",
    "primaryMuscle": "Reto abdominal",
    "secondaryMuscles": [
      "Latíssimo",
      "serrátil",
      "oblíquos"
    ],
    "pattern": "Anti-extensão dinâmica",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra e anilhas",
    "laterality": "Bilateral",
    "minimumLevel": "Avançado",
    "complexity": 4,
    "instructions": "Role a barra à frente sob controle e retorne mantendo pelve e caixa torácica alinhadas.",
    "substitutes": [
      "Ab wheel",
      "prancha"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0164",
    "group": "Core",
    "subgroup": "Anti-rotação",
    "name": "Pallof press",
    "primaryMuscle": "Oblíquos",
    "secondaryMuscles": [
      "Transverso",
      "reto abdominal",
      "glúteos"
    ],
    "pattern": "Anti-rotação",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Cabo",
    "equipment": "Polia e alça",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Pressione a alça à frente resistindo à rotação gerada pela polia.",
    "substitutes": [
      "Pallof hold",
      "suitcase carry"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0165",
    "group": "Core",
    "subgroup": "Anti-rotação",
    "name": "Pallof hold",
    "primaryMuscle": "Oblíquos",
    "secondaryMuscles": [
      "Transverso",
      "reto abdominal"
    ],
    "pattern": "Anti-rotação",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Cabo",
    "equipment": "Polia e alça",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Sustente os braços estendidos à frente sem permitir que o tronco gire.",
    "substitutes": [
      "Pallof press",
      "cable chop"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0166",
    "group": "Core",
    "subgroup": "Anti-rotação",
    "name": "Bird dog",
    "primaryMuscle": "Multífidos",
    "secondaryMuscles": [
      "Glúteos",
      "transverso",
      "eretores da coluna"
    ],
    "pattern": "Estabilidade lombopélvica",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Peso corporal",
    "equipment": "Colchonete",
    "laterality": "Contralateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Em quatro apoios, estenda braço e perna opostos sem girar a pelve.",
    "substitutes": [
      "Dead bug",
      "plank"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0167",
    "group": "Core",
    "subgroup": "Lateral",
    "name": "Prancha lateral",
    "primaryMuscle": "Oblíquos",
    "secondaryMuscles": [
      "Quadrado lombar",
      "glúteo médio"
    ],
    "pattern": "Anti-inclinação lateral",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Peso corporal",
    "equipment": "Colchonete",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Sustente o corpo lateralmente mantendo quadril elevado e alinhado.",
    "substitutes": [
      "Suitcase carry",
      "Copenhagen curto"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0168",
    "group": "Core",
    "subgroup": "Lateral",
    "name": "Suitcase march",
    "primaryMuscle": "Oblíquos",
    "secondaryMuscles": [
      "Quadrado lombar",
      "flexores do quadril",
      "glúteos"
    ],
    "pattern": "Anti-inclinação lateral",
    "jointClassification": "Isométrico/Estabilidade",
    "category": "Peso livre",
    "equipment": "Halter ou kettlebell",
    "laterality": "Unilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Marcha estacionária com carga em um lado mantendo o tronco vertical.",
    "substitutes": [
      "Suitcase carry",
      "Pallof"
    ],
    "attention": "Priorizar alinhamento e respiração. Encerrar a série quando houver perda clara de posição ou dor.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0169",
    "group": "Core",
    "subgroup": "Flexão",
    "name": "Crunch",
    "primaryMuscle": "Reto abdominal",
    "secondaryMuscles": [
      "Oblíquos"
    ],
    "pattern": "Flexão do tronco",
    "jointClassification": "Uniarticular",
    "category": "Peso corporal",
    "equipment": "Colchonete",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Aproxime as costelas da pelve elevando a parte superior do tronco sem puxar o pescoço.",
    "substitutes": [
      "Cable crunch",
      "máquina"
    ],
    "attention": "Evitar usar impulso. Se flexão da coluna agravar sintomas lombares, substituir por exercícios de estabilidade/anti-movimento.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0170",
    "group": "Core",
    "subgroup": "Flexão",
    "name": "Cable crunch",
    "primaryMuscle": "Reto abdominal",
    "secondaryMuscles": [
      "Oblíquos"
    ],
    "pattern": "Flexão do tronco",
    "jointClassification": "Uniarticular",
    "category": "Cabo",
    "equipment": "Polia alta e corda",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Ajoelhado, flexione o tronco aproximando costelas e pelve sem transformar em hinge de quadril.",
    "substitutes": [
      "Crunch",
      "máquina abdominal"
    ],
    "attention": "Evitar usar impulso. Se flexão da coluna agravar sintomas lombares, substituir por exercícios de estabilidade/anti-movimento.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0171",
    "group": "Core",
    "subgroup": "Flexão",
    "name": "Crunch máquina",
    "primaryMuscle": "Reto abdominal",
    "secondaryMuscles": [
      "Oblíquos"
    ],
    "pattern": "Flexão do tronco",
    "jointClassification": "Uniarticular",
    "category": "Máquina",
    "equipment": "Máquina abdominal",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 1,
    "instructions": "Flexione o tronco contra a resistência guiada e retorne com controle.",
    "substitutes": [
      "Cable crunch",
      "crunch"
    ],
    "attention": "Evitar usar impulso. Se flexão da coluna agravar sintomas lombares, substituir por exercícios de estabilidade/anti-movimento.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0172",
    "group": "Core",
    "subgroup": "Flexão",
    "name": "Reverse crunch",
    "primaryMuscle": "Reto abdominal",
    "secondaryMuscles": [
      "Oblíquos",
      "flexores do quadril"
    ],
    "pattern": "Flexão posterior da pelve",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Colchonete ou banco",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 2,
    "instructions": "Leve os joelhos em direção ao peito elevando levemente a pelve sem usar balanço.",
    "substitutes": [
      "Knee raise",
      "crunch"
    ],
    "attention": "Evitar usar impulso. Se flexão da coluna agravar sintomas lombares, substituir por exercícios de estabilidade/anti-movimento.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0173",
    "group": "Core",
    "subgroup": "Elevação de pernas",
    "name": "Hanging knee raise",
    "primaryMuscle": "Reto abdominal",
    "secondaryMuscles": [
      "Flexores do quadril",
      "oblíquos",
      "pegada"
    ],
    "pattern": "Flexão de quadril + controle pélvico",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Barra fixa",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 3,
    "instructions": "Suspenso, eleve os joelhos em direção ao tronco evitando balanço.",
    "substitutes": [
      "Captain chair",
      "reverse crunch"
    ],
    "attention": "Evitar usar impulso. Se flexão da coluna agravar sintomas lombares, substituir por exercícios de estabilidade/anti-movimento.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0174",
    "group": "Core",
    "subgroup": "Elevação de pernas",
    "name": "Hanging leg raise",
    "primaryMuscle": "Reto abdominal",
    "secondaryMuscles": [
      "Flexores do quadril",
      "oblíquos",
      "pegada"
    ],
    "pattern": "Flexão de quadril + controle pélvico",
    "jointClassification": "Multiarticular",
    "category": "Peso corporal",
    "equipment": "Barra fixa",
    "laterality": "Bilateral",
    "minimumLevel": "Avançado",
    "complexity": 5,
    "instructions": "Suspenso, eleve as pernas estendidas sem usar impulso e controle a descida.",
    "substitutes": [
      "Hanging knee raise",
      "captain chair"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Estabilidade",
      "Preparação esportiva"
    ]
  },
  {
    "id": "ex0175",
    "group": "Corpo inteiro e potência",
    "subgroup": "Levantamento terra",
    "name": "Deadlift convencional",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Isquiotibiais",
      "quadríceps",
      "eretores",
      "trapézio",
      "pegada"
    ],
    "pattern": "Hinge + extensão de joelho",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra e anilhas",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Parta com a barra próxima às canelas e fique ereto estendendo joelhos e quadris sem perder a coluna estável.",
    "substitutes": [
      "Trap-bar deadlift",
      "RDL"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Potência",
      "Condicionamento"
    ]
  },
  {
    "id": "ex0176",
    "group": "Corpo inteiro e potência",
    "subgroup": "Levantamento terra",
    "name": "Deadlift sumô",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Adutores",
      "quadríceps",
      "isquiotibiais",
      "eretores"
    ],
    "pattern": "Hinge + extensão de joelho",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra e anilhas",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Use base ampla, segure a barra entre as pernas e estenda quadris e joelhos mantendo a barra próxima.",
    "substitutes": [
      "Trap-bar deadlift",
      "convencional"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Potência",
      "Condicionamento"
    ]
  },
  {
    "id": "ex0177",
    "group": "Corpo inteiro e potência",
    "subgroup": "Levantamento terra",
    "name": "Trap-bar deadlift",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "isquiotibiais",
      "trapézio",
      "pegada"
    ],
    "pattern": "Hinge + extensão de joelho",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Trap bar",
    "laterality": "Bilateral",
    "minimumLevel": "Básico",
    "complexity": 3,
    "instructions": "Dentro da barra hexagonal, empurre o chão e estenda joelhos e quadris mantendo o tronco estável.",
    "substitutes": [
      "Deadlift convencional",
      "rack pull"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Potência",
      "Condicionamento"
    ]
  },
  {
    "id": "ex0178",
    "group": "Corpo inteiro e potência",
    "subgroup": "Potência",
    "name": "Kettlebell swing",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Isquiotibiais",
      "eretores",
      "core"
    ],
    "pattern": "Hinge explosivo",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Kettlebell",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Faça hinge e projete o kettlebell à frente com extensão explosiva do quadril, não com elevação ativa dos braços.",
    "substitutes": [
      "Cable pull-through",
      "deadlift leve"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Potência",
      "Condicionamento"
    ]
  },
  {
    "id": "ex0179",
    "group": "Corpo inteiro e potência",
    "subgroup": "Levantamento olímpico",
    "name": "Power clean",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "trapézio",
      "isquiotibiais",
      "deltoides",
      "core"
    ],
    "pattern": "Extensão tripla explosiva",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra olímpica",
    "laterality": "Bilateral",
    "minimumLevel": "Avançado",
    "complexity": 5,
    "instructions": "Acelere a barra do chão e receba-a nos ombros em agachamento parcial com técnica coordenada.",
    "substitutes": [
      "Hang clean",
      "high pull"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Potência",
      "Condicionamento"
    ]
  },
  {
    "id": "ex0180",
    "group": "Corpo inteiro e potência",
    "subgroup": "Levantamento olímpico",
    "name": "Hang clean",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "trapézio",
      "isquiotibiais",
      "deltoides"
    ],
    "pattern": "Extensão tripla explosiva",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra olímpica",
    "laterality": "Bilateral",
    "minimumLevel": "Avançado",
    "complexity": 5,
    "instructions": "Parta com a barra acima do chão, estenda explosivamente e receba-a na posição de rack.",
    "substitutes": [
      "Power clean",
      "high pull"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Potência",
      "Condicionamento"
    ]
  },
  {
    "id": "ex0181",
    "group": "Corpo inteiro e potência",
    "subgroup": "Levantamento olímpico",
    "name": "Power snatch",
    "primaryMuscle": "Glúteo máximo",
    "secondaryMuscles": [
      "Quadríceps",
      "trapézio",
      "deltoides",
      "core"
    ],
    "pattern": "Extensão tripla + recepção overhead",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra olímpica",
    "laterality": "Bilateral",
    "minimumLevel": "Avançado",
    "complexity": 5,
    "instructions": "Acelere a barra e receba-a acima da cabeça em agachamento parcial com braços estendidos.",
    "substitutes": [
      "High pull",
      "snatch técnico"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Potência",
      "Condicionamento"
    ]
  },
  {
    "id": "ex0182",
    "group": "Corpo inteiro e potência",
    "subgroup": "Complexo",
    "name": "Thruster",
    "primaryMuscle": "Quadríceps",
    "secondaryMuscles": [
      "Glúteos",
      "deltoides",
      "tríceps",
      "core"
    ],
    "pattern": "Agachar + empurrar vertical",
    "jointClassification": "Multiarticular",
    "category": "Peso livre",
    "equipment": "Barra ou halteres",
    "laterality": "Bilateral",
    "minimumLevel": "Intermediário",
    "complexity": 4,
    "instructions": "Faça um front squat e use a subida para continuar em um press acima da cabeça.",
    "substitutes": [
      "Goblet squat + press",
      "push press"
    ],
    "attention": "Alta exigência técnica e/ou excêntrica. Progredir gradualmente; usar supervisão quando a técnica ainda não estiver consolidada. Interromper se houver dor aguda.",
    "goals": [
      "Hipertrofia",
      "Potência",
      "Condicionamento"
    ]
  }
];
