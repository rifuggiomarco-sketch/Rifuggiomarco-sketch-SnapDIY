
export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Facile' | 'Medio' | 'Difficile';
  time: string;
  materials: string[];
  steps: { title: string; content: string }[];
  image: string;
  views: string;
  category: string;
}

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Portapiante in Legno Recuperato',
    description: 'Un progetto semplice ed elegante per dare nuova vita a vecchi scarti di legno. Perfetto per aggiungere un tocco di verde naturale ai tuoi spazi minimalisti.',
    difficulty: 'Medio',
    time: '2 Ore',
    materials: ['Legno di Recupero', 'Viti 40mm', 'Colla Vinilica', 'Carta Vetrata', 'Vernice Ecologica', 'Trapano'],
    steps: [
      { title: 'Preparazione del legno', content: 'Inizia pulendo bene le assi di legno. Utilizza la carta vetrata per rimuovere eventuali schegge e rendere la superficie liscia e uniforme.' },
      { title: 'Taglio e Assemblaggio', content: 'Taglia le assi secondo le misure desiderate. Applica la colla sui bordi e fissa le parti utilizzando il trapano e le viti per una struttura solida.' },
      { title: 'Finitura Finale', content: 'Passa un\'ultima mano di carta vetrata fine e applica la vernice ecologica. Lascia asciugare per almeno 24 ore prima di posizionare le tue piante.' }
    ],
    image: 'https://images.unsplash.com/photo-1598501020033-5690b201f9d6?q=80&w=800&auto=format&fit=crop',
    views: '1.2k views',
    category: 'Legno'
  },
  {
    id: '2',
    title: 'Vaso Minimalista',
    description: 'Trasforma una semplice bottiglia in un pezzo d\'arredo dal design moderno.',
    difficulty: 'Facile',
    time: '15 min',
    materials: ['Bottiglia di Plastica', 'Vernice Spray', 'Corda di Juta'],
    steps: [
      { title: 'Pulizia', content: 'Rimuovi etichette e residui di colla dalla bottiglia.' },
      { title: 'Taglio', content: 'Taglia la parte superiore se desideri un vaso più basso.' }
    ],
    image: 'https://images.unsplash.com/photo-1582531644341-38cb46a9e145?q=80&w=800&auto=format&fit=crop',
    views: '800 views',
    category: 'Plastica'
  },
  {
    id: '3',
    title: 'Lampada Sospesa',
    description: 'Un\'illuminazione d\'atmosfera creata con materiali di riciclo.',
    difficulty: 'Medio',
    time: '45 min',
    materials: ['Vetro Trasparente', 'Kit Lampadina', 'Filo di Rame'],
    steps: [
      { title: 'Foratura', content: 'Fora il tappo del barattolo con cura.' }
    ],
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop',
    views: '2.5k views',
    category: 'Vetro'
  },
  {
    id: '4',
    title: 'Orto Verticale',
    description: 'Coltiva le tue erbe aromatiche in poco spazio usando bottiglie di plastica.',
    difficulty: 'Medio',
    time: '30 min',
    materials: ['Bottiglie di Plastica', 'Terriccio', 'Semi', 'Supporto in Legno'],
    steps: [
      { title: 'Taglio Bottiglie', content: 'Crea delle aperture laterali nelle bottiglie.' }
    ],
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop',
    views: '3.1k views',
    category: 'Plastica'
  }
];
