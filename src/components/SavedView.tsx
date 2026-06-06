
import { useState, useEffect } from 'react';
import { Search, Bookmark, Clock, Sparkles } from 'lucide-react';
import { PROJECTS, Project } from '../data';
import { motion } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';

export default function SavedView({ onSelectProject }: { onSelectProject: (p: Project) => void }) {
  const { user } = useAuth();
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tutti');

  useEffect(() => {
    if (!user) return;

    const path = `users/${user.uid}/savedProjects`;
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const savedIds = snapshot.docs.map(doc => doc.data().projectId);
      const filtered = PROJECTS.filter(p => savedIds.includes(p.id));
      setSavedProjects(filtered);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [user]);

  const categories = ['Tutti', 'Plastica', 'Legno', 'Vetro'];
  
  const filtered = savedProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'Tutti' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-bg-warm min-h-screen pb-24">
      <header className="px-6 pt-16 pb-8 space-y-6">
        <h1 className="text-4xl font-bold font-serif text-charcoal tracking-tight">I miei progetti <br/>salvati</h1>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-5 flex items-center text-charcoal/30">
            <Search size={22} />
          </div>
          <input 
            type="text" 
            placeholder="Cerca tra i tuoi salvati..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sand/30 border-none rounded-[28px] py-5 pl-14 pr-6 focus:ring-2 focus:ring-olive-dark transition-all placeholder:text-charcoal/30 font-medium shadow-inner"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                        "px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                        activeCategory === cat 
                        ? "bg-olive-dark text-white shadow-lg shadow-olive-dark/20" 
                        : "bg-sand/40 text-charcoal/40 hover:bg-sand/60"
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>
      </header>

      <div className="px-6 grid grid-cols-1 gap-10">
        {filtered.map((project, idx) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[56px] overflow-hidden shadow-2xl shadow-charcoal/5 border border-charcoal/5 group active:scale-[0.98] transition-transform"
            onClick={() => onSelectProject(project)}
          >
            <div className="relative h-64">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <button className="absolute top-6 right-6 bg-olive-dark text-white p-4 rounded-3xl shadow-2xl ring-4 ring-white/20">
                 <Bookmark size={24} fill="currentColor" />
              </button>
            </div>
            <div className="p-8 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-charcoal tracking-tight leading-tight">{project.title}</h3>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-sand/40 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-charcoal/60">
                            <Sparkles size={14} className="text-olive-dark" />
                            {project.difficulty}
                        </div>
                        <div className="flex items-center gap-2 bg-sand/40 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-charcoal/60">
                            <Clock size={14} className="text-olive-dark" />
                            {project.time}
                        </div>
                    </div>
                </div>
                <div className="pt-2">
                    <button className="w-full bg-sand/20 border border-charcoal/5 text-charcoal py-4 rounded-[24px] font-bold text-sm hover:bg-sand/40 transition-colors shadow-sm">
                        Visualizza Progetto
                    </button>
                </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 px-10 bg-sand/20 rounded-[56px] space-y-6 border-2 border-dashed border-charcoal/5">
             <div className="w-20 h-20 bg-sand-dark/20 rounded-full flex items-center justify-center mx-auto text-charcoal/20">
                <Bookmark size={40} />
             </div>
             <div className="space-y-2">
                <p className="text-xl font-bold text-charcoal">Nessun progetto trovato</p>
                <p className="text-sm text-charcoal/40 font-medium">Inizia a scansionare materiali per trovare e salvare progetti!</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
