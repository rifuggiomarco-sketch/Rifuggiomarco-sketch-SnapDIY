
import { useState } from 'react';
import { Search, Bookmark, Clock, Sparkles, Leaf } from 'lucide-react';
import { PROJECTS, Project } from '../data';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function ProjectsView({ onSelectProject }: { onSelectProject: (p: Project) => void }) {
  const [filter, setFilter] = useState('Tutti');
  const [search, setSearch] = useState('');
  const categories = ['Tutti', 'Plastica', 'Legno', 'Vetro'];

  const filtered = PROJECTS.filter(p => {
    const matchesFilter = filter === 'Tutti' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-bg-warm min-h-screen pb-24">
      <header className="px-6 pt-16 pb-8 space-y-6">
        <h1 className="text-4xl font-bold font-serif text-charcoal tracking-tight">Esplora <br/>i progetti.</h1>
        
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center text-charcoal/30 group-focus-within:text-olive-dark transition-colors">
            <Search size={22} />
          </div>
          <input 
            type="text" 
            placeholder="Cerca progetti o materiali..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sand/30 border-none rounded-[28px] py-5 pl-14 pr-6 focus:ring-2 focus:ring-olive-dark transition-all placeholder:text-charcoal/30 font-medium shadow-inner"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={cn(
                        "px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                        filter === cat 
                        ? "bg-olive-dark text-white shadow-lg shadow-olive-dark/20" 
                        : "bg-sand/40 text-charcoal/40 hover:bg-sand/60"
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>
      </header>

      {/* Project List */}
      <div className="px-6 grid grid-cols-1 gap-10">
        {filtered.map((project, idx) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[56px] overflow-hidden shadow-2xl shadow-charcoal/5 border border-charcoal/5 group active:scale-[0.98] transition-transform cursor-pointer"
            onClick={() => onSelectProject(project)}
          >
            <div className="relative h-72">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <button className="absolute top-6 right-6 bg-white/20 backdrop-blur-xl p-4 rounded-3xl shadow-2xl ring-2 ring-white/20 text-white">
                 <Bookmark size={24} />
              </button>
              <div className="absolute bottom-6 left-6">
                <div className="bg-bg-warm/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-charcoal shadow-xl border border-white/20">
                    {project.category}
                </div>
              </div>
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
                <div className="flex items-center justify-between pt-4 border-t border-charcoal/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em]">
                        <Leaf size={14} />
                        Eco-Friendly
                    </div>
                    <button className="bg-olive-dark text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-olive-dark/20">
                        Visualizza
                    </button>
                </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 px-10 bg-sand/20 rounded-[56px] space-y-6 border-2 border-dashed border-charcoal/5">
             <div className="w-20 h-20 bg-sand-dark/20 rounded-full flex items-center justify-center mx-auto text-charcoal/20">
                <Search size={40} />
             </div>
             <div className="space-y-2">
                <p className="text-xl font-bold text-charcoal">Nessun progetto trovato</p>
                <p className="text-sm text-charcoal/40 font-medium">Prova con una ricerca diversa!</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
