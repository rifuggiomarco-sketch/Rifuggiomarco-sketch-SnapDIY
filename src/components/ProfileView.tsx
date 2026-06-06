
import { motion } from 'framer-motion';
import { User as LucideUser, ChevronRight, Settings, Bell, Shield, HelpCircle, LogOut, Leaf, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';

export default function ProfileView({ onNavigate, onEditProfile }: { onNavigate: (tab: string) => void, onEditProfile: () => void }) {
  const { profile, logout } = useAuth();

  if (!profile) return null;

  return (
        <div className="bg-bg-warm min-h-screen pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-olive-light/20 p-0.5 bg-white shadow-2xl">
            <img src={profile.photoURL || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"} alt="Profile" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="absolute bottom-1 right-1 bg-olive-dark text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white">
            PRO
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold font-serif text-charcoal tracking-tight">Marco Rossi</h1>
          <div className="flex items-center justify-center">
            <div className="bg-olive-light/20 px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-olive-dark border border-olive-dark/10">
                <Leaf size={16} fill="currentColor" />
                <span className="text-xs font-bold font-sans">Membro Green</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bento Section */}
      <div className="px-6 space-y-4 mb-12">
         {[
           { label: 'Progetti completati', val: profile.completedCount || 12, bg: 'bg-sand/30' },
           { label: 'Materiali riciclati', val: profile.recycledCount || 5, bg: 'bg-olive-dark', text: 'text-white' },
           { label: 'Punti Bio', val: profile.bioPoints || 450, bg: 'bg-sand/30' }
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className={cn(
                "w-full py-8 rounded-[32px] text-center space-y-1 shadow-sm border border-charcoal/5",
                stat.bg,
                stat.text || "text-charcoal"
             )}
           >
              <p className="text-4xl font-bold font-serif">{stat.val}</p>
              <p className={cn("text-xs font-medium opacity-80", !stat.text && "text-charcoal/60")}>{stat.label}</p>
           </motion.div>
         ))}
      </div>

      {/* Settings Menu */}
      <div className="px-6 space-y-6">
         <div className="px-4">
            <h3 className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.2em]">IMPOSTAZIONI ACCOUNT</h3>
         </div>
         <div className="space-y-2">
            {[
              { icon: LucideUser, label: 'Modifica Profilo', action: onEditProfile },
              { icon: Bell, label: 'Notifiche' },
              { icon: Settings, label: 'Preferenze Materiali' },
              { icon: Shield, label: 'Privacy e Sicurezza' },
              { icon: HelpCircle, label: 'Aiuto & FAQ' },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={item.action}
                className="w-full bg-sand/20 p-5 rounded-[24px] flex items-center justify-between group active:scale-[0.99] transition-all hover:bg-sand/40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand-dark/20 flex items-center justify-center text-charcoal/60">
                    <item.icon size={22} />
                  </div>
                  <span className="font-bold text-charcoal">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-charcoal/20" />
              </button>
            ))}
         </div>
      </div>

      {/* Logout */}
      <div className="px-6 mt-12 pb-12 flex justify-center">
          <button 
              onClick={logout}
              className="px-10 py-4 rounded-full border-2 border-charcoal/10 text-charcoal/60 font-bold flex items-center gap-3 active:scale-95 transition-all hover:bg-red-50 hover:border-red-100 hover:text-red-500"
          >
              <LogOut size={20} />
              Logout
          </button>
      </div>
    </div>
  );
}
