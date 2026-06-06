
import { useState } from 'react';
import { Camera, ChevronLeft, Instagram, Music2, Share2, Save, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function EditProfileView({ onBack }: { onBack: () => void }) {
  const { user, profile, refreshProfile } = useAuth();
  const [materials, setMaterials] = useState(profile?.preferredMaterials || []);
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [userMode, setUserMode] = useState<"Maker" | "Teacher">(profile?.userMode || 'Maker');
  const [saving, setSaving] = useState(false);

  const toggleMaterial = (m: string) => {
    setMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, path), {
        displayName,
        bio,
        userMode,
        preferredMaterials: materials,
      });
      await refreshProfile();
      onBack();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="bg-bg-warm min-h-screen pb-24">
      <header className="px-6 pt-12 pb-6 flex items-center gap-4">
        <button onClick={onBack} disabled={saving} className="p-2 -ml-2 disabled:opacity-50"><ChevronLeft size={24} /></button>
        <h1 className="text-2xl font-bold font-serif grow text-center">Modifica Profilo</h1>
        <div className="w-10" />
      </header>

      <div className="px-6 space-y-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
           <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-olive-light/20 p-1">
                <img src={profile.photoURL || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"} alt="Profile" className="w-full h-full object-cover rounded-full" />
              </div>
              <button className="absolute bottom-0 right-0 bg-olive-dark text-white p-2.5 rounded-full shadow-lg border-4 border-bg-warm">
                <Camera size={18} />
              </button>
           </div>
           <button className="text-olive-dark font-medium text-sm">Cambia foto</button>
        </div>

        {/* Info Form */}
        <div className="space-y-6">
            <div className="space-y-2 px-2">
                <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.25em] pl-4">Nome e Cognome</label>
                <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-sand/30 border-none rounded-[28px] p-6 focus:ring-2 focus:ring-olive-dark transition-all font-bold text-charcoal shadow-inner" 
                />
            </div>
            
            <div className="space-y-2 px-2">
                <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.25em] pl-4">Email</label>
                <input type="email" value={profile.email} disabled className="w-full bg-sand/10 text-charcoal/30 border-none rounded-[28px] p-6 font-bold cursor-not-allowed" />
            </div>

            <div className="space-y-2 px-2">
                <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.25em] pl-4">Username</label>
                <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 font-bold">@</span>
                    <input 
                        type="text" 
                        defaultValue={profile.displayName.toLowerCase().replace(' ', '_')}
                        className="w-full bg-sand/30 border-none rounded-[28px] p-6 pl-10 focus:ring-2 focus:ring-olive-dark transition-all font-bold text-charcoal shadow-inner" 
                    />
                </div>
            </div>

            <div className="space-y-2 px-2">
                <label className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.25em] pl-4">Bio</label>
                <textarea 
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Parlaci di te e dei tuoi progetti..."
                    className="w-full bg-sand/30 border-none rounded-[32px] p-6 focus:ring-2 focus:ring-olive-dark transition-all resize-none font-medium text-charcoal placeholder:text-charcoal/20 shadow-inner"
                />
            </div>

            <div className="space-y-4 px-2 pt-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold font-serif text-charcoal shrink-0">Tipo di Creativo</h3>
                    <div className="h-px grow bg-charcoal/5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { id: 'Maker', label: 'Amatore DIY', desc: 'Focus su tecnica' },
                        { id: 'Teacher', label: 'Educatore', desc: 'Focus didattico' }
                    ].map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => setUserMode(mode.id as any)}
                            className={cn(
                                "p-6 rounded-[32px] text-left border-2 transition-all transition-colors active:scale-95 shadow-sm",
                                userMode === mode.id 
                                ? "bg-olive-light/20 border-olive-dark shadow-olive-dark/10" 
                                : "bg-white border-transparent hover:bg-sand/30"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center",
                                    userMode === mode.id ? "bg-olive-dark text-white shadow-lg" : "bg-sand/40 text-charcoal/30"
                                )}>
                                    <Check size={20} className={cn("transition-transform", userMode === mode.id ? "scale-100" : "scale-0")} />
                                </div>
                            </div>
                            <p className={cn("font-bold", userMode === mode.id ? "text-olive-dark" : "text-charcoal")}>{mode.label}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mt-1">{mode.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Preferred Materials */}
        <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold font-serif text-charcoal shrink-0">Materiali Preferiti</h3>
                <div className="h-px grow bg-charcoal/5" />
            </div>
            <div className="flex flex-wrap gap-3">
                {['Plastica', 'Legno', 'Vetro', 'Tessuto', 'Metallo'].map(m => {
                    const isActive = materials.includes(m);
                    return (
                        <button 
                            key={m} 
                            onClick={() => toggleMaterial(m)}
                            className={cn(
                                "px-8 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 border shadow-sm",
                                isActive 
                                ? "bg-olive-dark text-white border-olive-dark shadow-olive-dark/20" 
                                : "bg-white text-charcoal/40 border-charcoal/5 hover:bg-sand/30"
                            )}
                        >
                             <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
                                isActive ? "bg-white text-olive-dark" : "bg-sand-dark/20 text-transparent"
                            )}>
                                <Check size={12} strokeWidth={4} />
                            </div>
                            {m}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Social Networks */}
        <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold font-serif text-charcoal shrink-0">Social Network</h3>
                <div className="h-px grow bg-charcoal/5" />
            </div>
            <div className="space-y-4">
                {[
                    { icon: Camera, label: 'Instagram', status: 'Non collegato' },
                    { icon: Share2, label: 'Pinterest', status: 'Già collegato', active: true },
                    { icon: Music2, label: 'TikTok', status: 'Non collegato' }
                ].map((item, i) => (
                    <button key={i} className="w-full bg-white p-6 rounded-[32px] flex items-center justify-between group border border-charcoal/5 shadow-sm active:scale-[0.98] transition-all">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                                item.active ? "bg-olive-light/20 text-olive-dark" : "bg-sand/40 text-charcoal/30"
                            )}>
                                <item.icon size={24} />
                            </div>
                            <div className="text-left space-y-0.5">
                                <p className="font-bold text-charcoal">{item.label}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">{item.status}</p>
                            </div>
                        </div>
                        <ChevronLeft className="rotate-180 text-charcoal/20 group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                ))}
            </div>
        </div>

        <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full bg-olive-dark text-white py-6 rounded-[32px] font-black text-lg shadow-[0_20px_40px_rgba(132,147,99,0.3)] hover:bg-olive-dark/90 active:scale-95 transition-all flex items-center justify-center gap-4 mt-12 mb-12"
        >
            {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
            {saving ? 'SALVATAGGIO...' : 'SALVA MODIFICHE'}
        </button>
      </div>
    </div>
  );
}
