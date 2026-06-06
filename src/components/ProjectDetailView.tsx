import { useState, useEffect } from 'react';
import { ChevronLeft, Share2, Bookmark, BarChart3, Play, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project } from '../data';
import { doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onStart: () => void;
}

export default function ProjectDetailView({ project, onBack, onStart }: ProjectDetailViewProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const path = `users/${user.uid}/savedProjects/${project.id}`;
    const unsubscribe = onSnapshot(doc(db, path), (docSnap) => {
      setIsSaved(docSnap.exists());
    });
    return () => unsubscribe();
  }, [user, project.id]);

  const toggleSave = async () => {
    if (!user) return;
    const path = `users/${user.uid}/savedProjects/${project.id}`;
    try {
      if (isSaved) {
        await deleteDoc(doc(db, path));
      } else {
        await setDoc(doc(db, path), {
          projectId: project.id,
          projectTitle: project.title,
          projectImage: project.image,
          savedAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return (
    <div className="bg-bg-warm min-h-screen">
      {/* Top Navigation Bar */}
      <header className="bg-bg-warm/80 backdrop-blur-xl flex justify-between items-center w-full px-6 h-16 z-50 fixed top-0 left-0 border-b border-charcoal/5">
        <button 
          onClick={onBack}
          className="hover:bg-sand/30 rounded-full transition-colors p-2 active:scale-95"
        >
          <ChevronLeft className="text-olive-dark" size={24} />
        </button>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-olive-dark">SnapDIY</h1>
        <div className="flex items-center gap-1">
          <button className="hover:bg-sand/30 rounded-full transition-colors p-2 active:scale-95">
            <Share2 size={22} className="text-olive-dark" />
          </button>
          <button 
            onClick={toggleSave}
            className={cn("hover:bg-sand/30 rounded-full transition-colors p-2 active:scale-95", isSaved && "text-olive-dark")}
          >
            <Bookmark size={22} className={cn(isSaved ? "fill-current" : "text-olive-dark")} />
          </button>
        </div>
      </header>

      <main className="pt-20 pb-32">
        {/* Hero Section */}
        <section className="px-6 mt-4">
          <div className="relative w-full aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl shadow-charcoal/10 border border-charcoal/5">
            <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover" 
              src={project.image}
              alt={project.title}
            />
            <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/40 shadow-lg">
              <Sparkles className="text-olive-dark" size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/60">{project.views}</span>
            </div>
          </div>
        </section>

        {/* Project Title & Description */}
        <section className="px-6 mt-10 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-charcoal tracking-tight font-serif leading-tight"
          >
            {project.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base text-charcoal/50 leading-relaxed font-medium"
          >
            {project.description}
          </motion.p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-sand/30 p-5 rounded-[32px] flex items-center gap-4 border border-charcoal/5">
              <div className="w-12 h-12 rounded-2xl bg-olive-light/30 flex items-center justify-center text-olive-dark">
                <BarChart3 size={20} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Difficoltà</p>
                <p className="font-bold text-sm text-charcoal">{project.difficulty}</p>
              </div>
            </div>
            <div className="bg-sand/30 p-5 rounded-[32px] flex items-center gap-4 border border-charcoal/5">
              <div className="w-12 h-12 rounded-2xl bg-olive-light/30 flex items-center justify-center text-olive-dark">
                <Clock size={20} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Tempo</p>
                <p className="font-bold text-sm text-charcoal">{project.time}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Materials Section */}
        <section className="mt-16 px-6">
          <h3 className="text-sm font-black text-charcoal/20 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
            Materiali necessari
            <div className="h-px grow bg-charcoal/5" />
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {project.materials.map((material, idx) => (
              <motion.span 
                key={material}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 + 0.3 }}
                className="px-6 py-3 rounded-full bg-white border border-charcoal/5 text-charcoal/70 font-bold text-[11px] shadow-sm"
              >
                {material}
              </motion.span>
            ))}
          </div>
        </section>

        {/* Step by Step Section */}
        <section className="mt-16 px-6">
          <h3 className="text-sm font-black text-charcoal/20 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
            Step-by-Step
            <div className="h-px grow bg-charcoal/5" />
          </h3>
          <div className="space-y-6">
            {project.steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[48px] relative overflow-hidden group border border-charcoal/5 shadow-xl shadow-charcoal/5"
              >
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 pointer-events-none">
                  <span className="text-[140px] font-black text-olive-dark leading-none font-serif">0{i+1}</span>
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-olive-dark flex items-center justify-center text-white font-black text-lg shadow-2xl shadow-olive-dark/30">
                    {i + 1}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-charcoal leading-tight">{step.title}</h4>
                    <p className="text-charcoal/50 text-sm leading-relaxed font-medium">{step.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Fixed Bottom Action Area */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-bg-warm via-bg-warm/95 to-transparent z-40">
        <button 
          onClick={onStart}
          className="w-full h-20 bg-olive-dark text-white rounded-full font-black text-lg shadow-2xl shadow-olive-dark/40 active:scale-95 transition-all flex items-center justify-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={20} fill="currentColor" />
          </div>
          Inizia Progetto
        </button>
      </div>
    </div>
  );
}
