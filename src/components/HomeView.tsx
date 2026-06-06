
import { motion } from 'framer-motion';
import { Sparkles, Search, Clock, Leaf, BookOpen, ShieldCheck, Download, ChevronRight } from 'lucide-react';
import { PROJECTS, Project } from '../data';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';

export default function HomeView({ onSelectProject, onNavigate }: { 
  onSelectProject: (p: Project) => void;
  onNavigate: (tab: string) => void;
}) {
  const { profile } = useAuth();
  const featured = PROJECTS[0];
  const others = PROJECTS.slice(1, 4);

  return (
    <div className="flex flex-col h-full bg-bg-warm min-h-screen pb-32">
      <header className="px-6 pt-16 pb-8 flex items-center justify-between sticky top-0 bg-bg-warm/80 backdrop-blur-md z-30">
        <span className="font-serif text-3xl font-bold tracking-tight text-charcoal">SnapDIY</span>
        <button 
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-full border-2 border-olive-light/20 p-0.5 overflow-hidden active:scale-95 transition-transform shadow-lg shadow-olive-dark/5"
        >
          <img src={profile?.photoURL || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"} className="w-full h-full rounded-full object-cover" />
        </button>
      </header>

      <div className="px-6 space-y-8">
        <div className="space-y-6">
           <h1 className="text-4xl font-bold font-serif leading-tight text-charcoal pr-8">
             {profile?.userMode === 'Teacher' ? (
               <>Risorse didattiche <br/><span className="text-olive-dark italic">per la tua classe.</span></>
             ) : (
               <>Scopri i Progetti più amati <br/><span className="text-olive-dark italic">dalla community.</span></>
             )}
           </h1>
           
           <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-charcoal/30 group-focus-within:text-olive-dark transition-colors">
                <Search size={22} />
              </div>
              <input 
                type="text" 
                placeholder={profile?.userMode === 'Teacher' ? "Cerca piani di lezione, materiali..." : "Cerca progetti, materiali..."}
                className="w-full bg-sand/30 border-none rounded-[28px] py-5 pl-14 pr-6 focus:ring-2 focus:ring-olive-dark transition-all placeholder:text-charcoal/30 font-medium shadow-inner"
              />
           </div>
        </div>

        {/* Teacher Mode Dashboard */}
        {profile?.userMode === 'Teacher' && (
            <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-2 gap-4"
            >
                <div className="bg-olive-dark p-6 rounded-[40px] text-white space-y-4 shadow-xl shadow-olive-dark/20 relative overflow-hidden group cursor-pointer active:scale-95 transition-transform">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-lg leading-tight">Piani di Lezione</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">12 Risorse</p>
                    </div>
                    <ChevronRight className="absolute bottom-6 right-6 opacity-40" />
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl" />
                </div>

                <div className="bg-white p-6 rounded-[40px] border border-charcoal/5 space-y-4 shadow-xl shadow-charcoal/5 group cursor-pointer active:scale-95 transition-transform">
                    <div className="w-10 h-10 bg-sand/40 rounded-2xl flex items-center justify-center text-olive-dark">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-lg leading-tight text-charcoal">Certificati Sicurezza</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">PDF Scaricabili</p>
                    </div>
                    <Download className="absolute bottom-6 right-6 text-charcoal/20" size={18} />
                </div>
            </motion.section>
        )}

        {/* Featured Card */}
        <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectProject(featured)}
            className="relative h-[480px] rounded-[64px] overflow-hidden shadow-2xl shadow-charcoal/20 group cursor-pointer"
        >
            <img src={featured.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute top-8 left-8">
                <div className="bg-olive-light/90 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-charcoal shadow-xl">
                    <Sparkles size={14} className="text-olive-dark" />
                    In Evidenza
                </div>
            </div>

            <div className="absolute bottom-10 left-10 right-10 space-y-4 text-white">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold font-serif leading-tight">{featured.title}</h2>
                    <div className="flex items-center gap-4 text-white/60 text-xs font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Leaf size={14} className="text-olive-light" /> {featured.difficulty}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-olive-light" /> {featured.time}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-white/20 p-0.5">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <span className="text-sm font-medium">di @francesco_maker</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {featured.views} Views
                    </div>
                </div>
            </div>
        </motion.div>

        {/* More Projects */}
        <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-bold font-serif text-charcoal">Progetti per te</h3>
                <button 
                  onClick={() => onNavigate('projects')}
                  className="text-xs font-black uppercase tracking-widest text-olive-dark hover:underline"
                >
                  Vedi tutti
                </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {others.map((project, i) => (
                    <motion.div 
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => onSelectProject(project)}
                        className="bg-white p-4 rounded-[40px] flex items-center gap-5 border border-charcoal/5 shadow-xl shadow-charcoal/10 cursor-pointer active:scale-95 transition-all group"
                    >
                        <div className="h-28 w-28 shrink-0 rounded-[32px] overflow-hidden group-hover:rotate-3 transition-transform duration-500">
                            <img src={project.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-2 py-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-olive-dark/60">{project.category}</p>
                            <h4 className="text-xl font-bold text-charcoal leading-tight group-hover:text-olive-dark transition-colors">{project.title}</h4>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-charcoal/30">
                                <span className="flex items-center gap-1"><Clock size={12} /> {project.time}</span>
                                <span>•</span>
                                <span>{project.views} Visual</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}
