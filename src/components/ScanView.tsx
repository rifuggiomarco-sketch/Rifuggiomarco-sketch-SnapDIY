
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, X, Lightbulb, Image as ImageIcon, History, ChevronRight, Bookmark, Loader2, Leaf, Clock, Box, Shapes, ChevronLeft, Zap, Info, ArrowUpRight, HelpCircle } from 'lucide-react';
import { PROJECTS, Project } from '../data';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type MatchType = 'DIRECT' | 'CREATIVE' | 'MISSING';

export default function ScanView({ onShowProject }: { onShowProject: (p: Project) => void }) {
  const { user, profile } = useAuth();
  const [state, setState] = useState<'ready' | 'analyzing' | 'results'>('ready');
  const [progress, setProgress] = useState(0);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (state === 'ready') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [state]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasCamera(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    
    if (capabilities.torch) {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !isFlashOn }]
        } as any);
        setIsFlashOn(!isFlashOn);
      } catch (err) {
        console.error("Flash error:", err);
      }
    } else {
      alert("La torcia non è supportata su questo dispositivo.");
    }
  };

  const handleCapture = async () => {
    setState('analyzing');
    // Save to inventory automatically after analysis completes in the effect
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setState('analyzing');
    }
  };

  useEffect(() => {
    if (state === 'analyzing') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              saveToInventory();
              setState('results');
            }, 800);
            return 100;
          }
          return p + 1.5;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [state]);

  const saveToInventory = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/inventory`), {
        name: 'Bottiglia di Plastica',
        quantity: 1,
        category: 'Plastica',
        lastScanned: serverTimestamp(),
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=200&auto=format&fit=crop'
      });
    } catch (error) {
      console.error("Error saving to inventory:", error);
    }
  };

  const getMatchType = (idx: number): MatchType => {
    if (idx === 0) return 'DIRECT';
    if (idx === 1) return 'CREATIVE';
    return 'MISSING';
  };

  if (state === 'ready') {
    return (
      <div className="relative h-full bg-charcoal flex flex-col overflow-hidden">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        
        {/* Camera Header */}
        <div className="absolute top-12 w-full px-6 flex justify-between items-center z-20">
          <button onClick={() => window.location.reload()} className="bg-charcoal/40 backdrop-blur-md p-2 rounded-full text-white active:scale-90 transition-transform">
            <X size={24} />
          </button>
          <div className="bg-charcoal/60 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-white text-sm font-medium tracking-wide shadow-xl">
            {hasCamera === false ? 'Fotocamera non disponibile' : 'Inquadra il materiale'}
          </div>
          <button onClick={toggleFlash} className={`p-2 rounded-full transition-all backdrop-blur-md active:scale-90 ${isFlashOn ? 'bg-olive-light text-charcoal' : 'bg-charcoal/40 text-white'}`}>
            <Lightbulb size={24} />
          </button>
        </div>

        {/* Viewfinder */}
        <div className="flex-1 relative flex items-center justify-center bg-black">
          {hasCamera !== false ? (
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="text-white text-center px-12 space-y-4">
               <Camera size={48} className="mx-auto opacity-20" />
               <p className="text-sm opacity-60">Impossibile accedere alla fotocamera. Assicurati di aver concesso i permessi o carica un'immagine dalla galleria.</p>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
             <div className="w-full aspect-square border-2 border-white/20 rounded-[60px] relative">
                <div className="absolute inset-0 border border-white/10 rounded-[58px] m-1" />
                
                {/* Corner accents */}
                <div className="absolute -top-1 -left-1 w-16 h-16 border-t-[6px] border-l-[6px] border-olive-light/60 rounded-tl-[60px]" />
                <div className="absolute -top-1 -right-1 w-16 h-16 border-t-[6px] border-r-[6px] border-olive-light/60 rounded-tr-[60px]" />
                <div className="absolute -bottom-1 -left-1 w-16 h-16 border-b-[6px] border-l-[6px] border-olive-light/60 rounded-bl-[60px]" />
                <div className="absolute -bottom-1 -right-1 w-16 h-16 border-b-[6px] border-r-[6px] border-olive-light/60 rounded-br-[60px]" />

                {/* Scanning line animation */}
                <motion.div 
                  animate={{ top: ['10%', '90%'], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-olive-light to-transparent blur-sm"
                />
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-max">
                   <div className="bg-bg-warm/90 backdrop-blur-md px-5 py-2.5 rounded-full inline-flex items-center gap-2.5 shadow-2xl border border-white/20">
                     <Lightbulb className="text-olive-dark" size={18} />
                     <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider">Riconoscimento automatico attivo</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="absolute bottom-0 w-full px-8 pt-12 pb-24 z-20 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-between mb-12">
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={handleGalleryClick}
                className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all hover:bg-white/20 shadow-2xl group"
              >
                <ImageIcon size={32} className="group-hover:scale-110 transition-transform" />
              </button>
              <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Galleria</span>
            </div>

            <button onClick={handleCapture} className="relative group">
              <div className="absolute inset-0 bg-olive-light opacity-30 scale-125 rounded-full blur-3xl group-active:scale-150 transition-transform" />
              <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-2.5 relative z-10 transition-transform active:scale-95 shadow-2xl">
                 <div className="w-full h-full rounded-full border-4 border-white flex items-center justify-center bg-olive-dark text-white ring-2 ring-white/20 group-hover:bg-olive-dark/90 px-2 shadow-[0_0_40px_rgba(132,147,99,0.4)]">
                    <div className="w-12 h-12 border-2 border-white/50 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded-full shadow-inner" />
                    </div>
                 </div>
              </div>
            </button>

            <div className="flex flex-col items-center gap-2">
               <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-1 flex items-center justify-center active:scale-90 transition-all overflow-hidden shadow-2xl group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Recenti</span>
            </div>
          </div>

          <div className="flex justify-center gap-8 border-t border-white/10 pt-8">
            {['Scansiona', 'Tutorial', 'Comunità'].map((tab, i) => (
              <button 
                key={tab}
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.2em] transition-all relative pb-2",
                  i === 0 ? "text-olive-light" : "text-white/40 hover:text-white/60"
                )}
              >
                {tab}
                {i === 0 && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-olive-light" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'analyzing') {
    return (
      <div className="h-full bg-bg-warm flex flex-col items-center justify-center px-12 space-y-12 overflow-hidden">
        <div className="relative">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 0 rgba(132,147,99,0)',
                '0 0 0 40px rgba(132,147,99,0.1)',
                '0 0 0 0 rgba(132,147,99,0)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-56 h-56 rounded-full bg-olive-light/20 flex items-center justify-center relative"
          >
            <div className="w-40 h-40 rounded-full bg-olive-light/40 flex items-center justify-center border-2 border-olive-light/20 shadow-inner">
              <Sparkles className="text-olive-dark" size={64} />
            </div>
            
            {/* Pulsing sub-icons */}
            <motion.div 
              animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 right-4 w-14 h-14 bg-white rounded-3xl shadow-xl flex items-center justify-center text-olive-dark rotate-12"
            >
              <Box className="scale-x-[-1]" size={24} />
            </motion.div>

            <motion.div 
              animate={{ x: [-10, 0, -10], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-4 -left-4 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-olive-dark -rotate-12"
            >
              <Shapes size={20} />
            </motion.div>
          </motion.div>
        </div>

        <div className="text-center space-y-3 z-10">
           <h2 className="text-2xl font-bold font-serif text-charcoal">Analizzando i materiali...</h2>
           <p className="text-sm text-charcoal/40 font-medium tracking-wide">Cercando progetti creativi per te...</p>
        </div>

        <div className="w-full max-w-sm space-y-8 z-10">
           <div className="h-3 w-full bg-sand-dark/20 rounded-full overflow-hidden p-0.5 border border-sand/50">
              <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 className="h-full bg-olive-dark rounded-full shadow-[0_0_10px_rgba(132,147,99,0.5)]"
              />
           </div>
           
           <div className="flex flex-wrap justify-center gap-3">
             {[
               { id: 1, label: 'Plastica rilevata', p: 20 },
               { id: 2, label: 'Vetro trasparente', p: 50 },
               { id: 3, label: 'Tappi di sughero', p: 80 }
             ].map(tag => (
               <motion.span 
                 key={tag.id}
                 initial={{ opacity: 0, scale: 0.8, y: 10 }} 
                 animate={progress > tag.p ? { opacity: 1, scale: 1, y: 0 } : {}} 
                 className="bg-sand-dark/30 backdrop-blur-md text-charcoal/60 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider shadow-sm border border-charcoal/5"
               >
                 {tag.label}
               </motion.span>
             ))}
           </div>
        </div>

        <div className="absolute bottom-16 text-[10px] font-bold text-charcoal/20 uppercase tracking-[0.4em] flex items-center gap-4">
          <div className="w-8 h-px bg-charcoal/10" />
          SnapDIY • MakerSpace
          <div className="w-8 h-px bg-charcoal/10" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-olive-light/10 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sand-dark/10 blur-[100px] rounded-full -ml-32 -mb-32" />
      </div>
    );
  }

  return (
    <div className="h-full bg-bg-warm min-h-screen pb-32">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-bg-warm/80 backdrop-blur-md z-30">
        <button onClick={() => setState('ready')} className="p-2 -ml-2 hover:bg-sand/30 rounded-full transition-colors"><ChevronLeft size={24} /></button>
        <span className="font-serif text-2xl font-bold tracking-tight text-charcoal">SnapDIY Engine</span>
        <div className="w-10 h-10 rounded-full border-2 border-olive-light/20 p-0.5 overflow-hidden">
          <img src={profile?.photoURL || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"} className="w-full h-full rounded-full object-cover" />
        </div>
      </header>

      <div className="px-6 pt-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-sand/30 rounded-[48px] p-10 text-center space-y-6 relative overflow-hidden"
        >
           <div className="w-20 h-20 bg-olive-light/40 rounded-full flex items-center justify-center mx-auto text-olive-dark relative z-10 shadow-xl border border-white/20">
              <Zap size={40} className="animate-pulse" />
           </div>
           <div className="relative z-10 space-y-2">
             <p className="text-charcoal/30 uppercase text-[10px] font-bold tracking-[0.3em]">Materiale Rilevato</p>
             <h2 className="text-4xl font-bold font-serif leading-tight text-charcoal">Bottiglia di <br/>Plastica</h2>
           </div>
           <p className="text-charcoal/50 text-sm leading-relaxed max-w-[240px] mx-auto italic">“Abbiamo trovato 12 modi creativi per riutilizzare questo materiale.”</p>
           
           <div className="bg-olive-dark/10 py-2 px-4 rounded-full inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-olive-dark relative z-10 mt-4">
              <Info size={14} />
              Aggiunto al Laboratorio
           </div>

           {/* Abstract shapes in BG */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-olive-light/20 rounded-full -mr-16 -mt-16 blur-3xl" />
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-sand-dark/20 rounded-full -ml-16 -mb-16 blur-3xl" />
        </motion.div>
      </div>

      <div className="px-6 py-10 space-y-12">
        <div className="flex items-center gap-4">
            <h3 className="text-xs font-black text-charcoal/30 uppercase tracking-[0.25em] pl-4 shrink-0">Matching Results</h3>
            <div className="h-px grow bg-charcoal/5" />
        </div>

        {PROJECTS.filter(p => p.category === 'Plastica').map((project, idx) => {
          const matchType = getMatchType(idx);
          
          return (
            <motion.div 
              key={project.id} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[56px] overflow-hidden shadow-2xl shadow-charcoal/5 border border-charcoal/5 group active:scale-[0.98] transition-transform relative"
              onClick={() => onShowProject(project)}
            >
              {/* Match Label */}
              <div className="absolute top-6 left-6 z-20">
                {matchType === 'DIRECT' && (
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/30">
                        <Zap size={14} fill="currentColor" />
                        Realizzabile ora
                    </div>
                )}
                {matchType === 'CREATIVE' && (
                    <div className="bg-amber-500 text-white px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/30">
                        <Shapes size={14} />
                        Creative Swap
                    </div>
                )}
                {matchType === 'MISSING' && (
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/30">
                        <HelpCircle size={14} />
                        Ingrediente Mancante
                    </div>
                )}
              </div>

              <div className="relative h-64">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className="absolute top-6 right-6 bg-white/20 backdrop-blur-xl p-3.5 rounded-3xl text-white hover:bg-white/40 transition-colors border border-white/20 shadow-xl"
                >
                  <Bookmark size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                   <h3 className="text-3xl font-bold text-charcoal tracking-tight leading-tight">{project.title}</h3>
                   
                   {matchType === 'CREATIVE' && (
                       <p className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl inline-block">
                           💡 Suggerimento: Usa il vetro rilevato al posto della plastica per un look minimal.
                       </p>
                   )}
                   {matchType === 'MISSING' && (
                       <p className="text-[10px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl inline-block">
                           ⚠️ Manca: Colla a caldo (Disponibile nel Tab 'Saved')
                       </p>
                   )}

                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-sand/40 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-charcoal/60">
                        <Sparkles size={14} className="text-olive-dark" />
                        {project.difficulty}
                      </div>
                      <div className="flex items-center gap-2 bg-sand/40 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-charcoal/60">
                        <Clock size={14} className="text-olive-dark" />
                        {project.time}
                      </div>
                   </div>
                </div>

                {/* Teacher Mode Integration */}
                {profile?.userMode === 'Teacher' && (
                    <div className="p-4 bg-olive-light/10 rounded-3xl border border-olive-light/20 space-y-2">
                        <p className="text-[10px] font-black text-olive-dark uppercase tracking-widest flex items-center gap-2">
                            <Leaf size={14} />
                            Educational Value
                        </p>
                        <p className="text-[11px] font-medium text-charcoal/70 leading-relaxed">
                            Ottimo per sviluppare la coordinazione fine e discutere il ciclo del riciclo in classe.
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-charcoal/30 uppercase tracking-[0.2em]">
                      <ArrowUpRight size={16} />
                      {project.views} Visual
                   </div>
                   <button className="bg-olive-dark text-white py-4 px-10 rounded-full font-bold text-sm shadow-xl shadow-olive-dark/20 hover:bg-olive-dark/90 active:scale-95 transition-all">
                     Visualizza
                   </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
