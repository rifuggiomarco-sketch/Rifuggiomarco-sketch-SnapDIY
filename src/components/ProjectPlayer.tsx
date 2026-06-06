import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../data';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export default function ProjectPlayer({ project, onClose }: { project: Project; onClose: () => void }) {
  const { user, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = project.steps;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setIsCompleting(true);
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, path), {
        completedCount: increment(1),
        recycledCount: increment(1),
        bioPoints: increment(50)
      });
      await refreshProfile();
      onClose();
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, path);
    } finally {
      setIsCompleting(false);
    }
  };

  if (isFinished) {
    return (
      <div className="h-screen bg-olive-dark flex flex-col items-center justify-center p-12 text-center text-white space-y-8">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center relative shadow-2xl"
        >
          <Trophy size={64} className="text-white" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white rounded-full -z-10 blur-xl"
          />
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold font-serif italic">Ottimo lavoro!</h2>
          <p className="text-white/80 leading-relaxed">
            Hai completato con successo "{project.title}". <br/>
            Hai guadagnato 50 Punti Bio e ridotto il tuo impatto ambientale.
          </p>
        </div>

        <div className="w-full space-y-4 pt-12">
           <button 
             onClick={handleFinish}
             disabled={isCompleting}
             className="w-full bg-white text-olive-dark py-5 rounded-full font-bold text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
           >
             {isCompleting ? <span className="animate-pulse">Salvataggio...</span> : (
               <>
                 <CheckCircle2 size={24} />
                 Fine
               </>
             )}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-bg-warm flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between">
        <button onClick={onClose} className="p-2 -ml-2"><X size={24} /></button>
        <div className="flex-1 px-4">
           <div className="h-1.5 w-full bg-sand rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-olive-dark rounded-full"
              />
           </div>
        </div>
        <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest leading-none">
          Step {currentStep + 1}/{steps.length}
        </span>
      </header>

      {/* Step Content */}
      <main className="flex-1 px-8 py-12 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12 flex-1 flex flex-col"
          >
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 text-olive-dark font-bold uppercase tracking-widest text-[10px] bg-olive-light/10 px-4 py-2 rounded-full">
                  <Sparkles size={14} />
                  <span>Tutorial Attivo</span>
               </div>
               <h2 className="text-4xl font-bold font-serif leading-tight">{steps[currentStep].title}</h2>
               <p className="text-xl text-charcoal/60 leading-relaxed font-sans">
                 {steps[currentStep].content}
               </p>
            </div>

            <div className="mt-auto relative aspect-video rounded-[40px] overflow-hidden bg-sand-dark/20 shadow-inner group">
               <img src={project.image} className="w-full h-full object-cover grayscale-[0.5] opacity-50 transition-all group-hover:grayscale-0 group-hover:opacity-100" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-full text-olive-dark shadow-xl">
                    <CheckCircle2 size={40} />
                  </div>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="pt-12 flex gap-4">
           <button 
             disabled={currentStep === 0}
             onClick={() => setCurrentStep(s => s - 1)}
             className="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center text-charcoal/40 disabled:opacity-30 transition-all active:scale-90"
           >
             <ChevronLeft size={32} />
           </button>
           <button 
             onClick={handleNext}
             className="flex-1 bg-olive-dark text-white rounded-full font-bold text-xl flex items-center justify-center gap-2 shadow-xl shadow-olive-dark/20 active:scale-95 transition-all"
           >
             <span>Continua</span>
             <ChevronRight size={24} />
           </button>
        </div>
      </main>
    </div>
  );
}
