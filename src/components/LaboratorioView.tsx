
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  PlusCircle, 
  MinusCircle, 
  Settings, 
  Menu, 
  Trash2, 
  Loader2,
  Package,
  Wrench,
  ShoppingCart,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  updateDoc,
  increment 
} from 'firebase/firestore';

interface Material {
  id: string;
  name: string;
  quantity: number;
  category: string;
  lastScanned?: any;
  image?: string;
  unit?: string;
}

interface Tool {
  id: string;
  name: string;
  status: 'possessed' | 'wishlist';
  image: string;
}

const MOCK_TOOLS: Tool[] = [
  { 
    id: '1', 
    name: 'Colla a caldo', 
    status: 'possessed', 
    image: 'https://images.unsplash.com/photo-1510127034890-ba3375936780?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: '2', 
    name: 'Taglierino Precisione', 
    status: 'possessed', 
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: '3', 
    name: 'Levigatrice Bosch', 
    status: 'wishlist', 
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=200&auto=format&fit=crop' 
  },
];

export default function LaboratorioView() {
  const { user, profile } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'Materials' | 'Tools'>('Materials');
  
  // Tag filter logic from mockup
  const popularTags = ['#ecosostenibile', '#legnodirecupero', '#upcycling', '#fattoamano'];

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/inventory`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Material[];
      setMaterials(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/inventory`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateQuantity = async (id: string, delta: number) => {
    if (!user) return;
    const material = materials.find(m => m.id === id);
    if (!material) return;
    
    if (material.quantity + delta < 0) return;

    try {
      const docRef = doc(db, `users/${user.uid}/inventory`, id);
      await updateDoc(docRef, {
        quantity: increment(delta),
        lastScanned: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/inventory/${id}`);
    }
  };

  const handleAddManual = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/inventory`), {
        name: 'Nuovo Materiale',
        quantity: 1,
        category: 'Altro',
        lastScanned: serverTimestamp(),
        unit: 'pz',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=200&auto=format&fit=crop'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/inventory`);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-40">
      {/* TopAppBar */}
      <header className="w-full sticky top-0 z-40 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-sand-dark/20 border-2 border-olive-light/20">
            <img 
              alt="profile" 
              src={profile?.photoURL || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className="text-xl font-bold font-serif text-olive-dark tracking-tight">SnapDIY</h1>
        </div>
        <button className="p-2 text-charcoal/40 hover:bg-sand/30 rounded-full transition-all active:scale-95">
          <Settings size={24} />
        </button>
      </header>

      <main className="px-6 pt-4 max-w-4xl mx-auto space-y-8">
        {/* Page Title & Search */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold font-serif text-charcoal tracking-tight">Il Mio Laboratorio</h2>
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center text-charcoal/30 group-focus-within:text-olive-dark transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Cerca materiali o attrezzi..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-sand/30 border-none rounded-full py-5 pl-14 pr-6 focus:ring-2 focus:ring-olive-dark transition-all placeholder:text-charcoal/30 font-medium shadow-inner"
            />
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-4 p-1.5 bg-sand/20 rounded-full inline-flex">
          <button 
            onClick={() => setActiveTab('Materials')}
            className={cn(
                "px-8 py-3 rounded-full font-bold text-sm transition-all",
                activeTab === 'Materials' 
                ? "bg-olive-dark text-white shadow-lg shadow-olive-dark/20" 
                : "text-charcoal/40 hover:text-charcoal/60"
            )}
          >
            Materiali
          </button>
          <button 
            onClick={() => setActiveTab('Tools')}
            className={cn(
                "px-8 py-3 rounded-full font-bold text-sm transition-all",
                activeTab === 'Tools' 
                ? "bg-olive-dark text-white shadow-lg shadow-olive-dark/20" 
                : "text-charcoal/40 hover:text-charcoal/60"
            )}
          >
            Attrezzi
          </button>
        </div>

        {activeTab === 'Materials' ? (
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold font-serif text-charcoal">Materiali Disponibili</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">{filteredMaterials.length} Categorie</span>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-olive-dark" size={32} />
                    <p className="text-sm font-bold text-charcoal/40 uppercase tracking-widest">Sincronizzazione Lab...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {filteredMaterials.map((material, idx) => (
                        <motion.div 
                          key={material.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white rounded-[32px] p-4 flex flex-col gap-4 shadow-xl shadow-charcoal/5 border border-charcoal/5 group active:scale-[0.98] transition-all"
                        >
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner bg-sand/20">
                                <img src={material.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=200&auto=format&fit=crop'} className="w-full h-full object-cover" alt={material.name} />
                                <div className="absolute top-3 right-3 bg-olive-dark text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                    {material.quantity} {material.unit || 'pz'}
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-charcoal truncate">{material.name}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 truncate">{material.category}</p>
                            </div>

                            <div className="flex items-center justify-between bg-sand/30 rounded-full p-1 border border-charcoal/5">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(material.id, -1); }}
                                  className="w-8 h-8 flex items-center justify-center text-olive-dark hover:bg-olive-light/20 rounded-full transition-colors"
                                >
                                    <MinusCircle size={20} />
                                </button>
                                <span className="font-bold text-sm text-charcoal">{material.quantity}</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(material.id, 1); }}
                                  className="w-8 h-8 flex items-center justify-center bg-olive-dark text-white rounded-full shadow-lg hover:bg-olive-dark/90 active:scale-90 transition-all"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && filteredMaterials.length === 0 && (
                <div className="text-center py-20 px-10 bg-sand/20 rounded-[48px] space-y-6 border-2 border-dashed border-charcoal/5">
                    <div className="w-20 h-20 bg-sand-dark/20 rounded-full flex items-center justify-center mx-auto text-charcoal/20">
                        <Plus size={40} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-bold text-charcoal font-serif">Nessun materiale</p>
                        <p className="text-sm text-charcoal/40 font-medium leading-relaxed">Scansiona o aggiungi manualmente i tuoi scarti per vederli qui.</p>
                    </div>
                </div>
            )}

            {/* Popular Tags */}
            <div className="space-y-4 pt-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Tag Popolari</h3>
                <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                        <button key={tag} className="px-4 py-2 rounded-full bg-sand/20 border border-charcoal/5 text-charcoal/60 text-xs font-bold hover:bg-olive-light/10 transition-colors">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
          </section>
        ) : (
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold font-serif text-charcoal">I Miei Attrezzi</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-olive-dark flex items-center gap-1">
                Gestisci <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {MOCK_TOOLS.map((tool) => (
                <div 
                  key={tool.id}
                  className="bg-white p-4 rounded-[32px] flex items-center gap-5 border border-charcoal/5 shadow-xl shadow-charcoal/5 hover:bg-sand/10 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-sand/20 border border-charcoal/5">
                    <img src={tool.image} className="w-full h-full object-cover" alt={tool.name} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-charcoal">{tool.name}</p>
                    <span className={cn(
                      "inline-block mt-1 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                      tool.status === 'possessed' ? "bg-olive-light text-olive-dark" : "bg-sand/40 text-charcoal/30"
                    )}>
                      {tool.status === 'possessed' ? 'IN POSSESSO' : 'WISHLIST'}
                    </span>
                  </div>
                  <button className="p-2 text-charcoal/20 group-hover:text-olive-dark transition-colors">
                    {tool.status === 'wishlist' ? <ShoppingCart size={20} /> : <MoreVertical size={20} />}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FAB: Add Material */}
      <button 
        onClick={handleAddManual}
        className="fixed bottom-28 right-6 w-16 h-16 bg-olive-dark text-white rounded-[24px] shadow-2xl shadow-olive-dark/40 flex items-center justify-center active:scale-90 transition-all group z-50"
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
      </button>
    </div>
  );
}
