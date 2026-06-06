/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Home, Search, PlusCircle, BookOpen, Heart, User, Sparkles, Camera, MapPin, Settings, ChevronRight, Share2, Bookmark, Play, Bell, Shield, Info, LogOut, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS, Project } from './data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Views
import HomeView from './components/HomeView';
import ScanView from './components/ScanView';
import ProjectsView from './components/ProjectsView';
import SavedView from './components/SavedView';
import ProfileView from './components/ProfileView';
import EditProfileView from './components/EditProfileView';
import LaboratorioView from './components/LaboratorioView';

import { AuthProvider, useAuth } from './lib/AuthContext';
import { seedProjects } from './lib/firebase-utils';

import ProjectDetailView from './components/ProjectDetailView';
import ProjectPlayer from './components/ProjectPlayer';

function AppContent() {
  const { user, profile, loading, signIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'scan' | 'projects' | 'saved' | 'profile' | 'laboratorio'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Seed projects on load
  useState(() => {
    seedProjects();
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-warm">
        <Sparkles className="text-olive-dark animate-pulse" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto bg-bg-warm relative overflow-hidden ring-1 ring-charcoal/5 px-6 pt-20 pb-12">
        <div className="space-y-6 flex-1">
          <div className="w-20 h-20 bg-olive-dark rounded-[32px] flex items-center justify-center text-white">
            <Sparkles size={40} />
          </div>
          <h1 className="text-5xl font-bold font-serif leading-tight">Benvenuto su <br/><span className="text-olive-dark">SnapDIY.</span></h1>
          <p className="text-charcoal/60 leading-relaxed text-lg">
            Inizia il tuo viaggio nel mondo dell'upcycle. Trasforma il vecchio in nuovo con l'aiuto dell'intelligenza artificiale.
          </p>
        </div>
        <div className="space-y-4">
          <button 
            onClick={signIn}
            className="btn-primary w-full py-5 text-lg shadow-xl shadow-olive-dark/20"
          >
            Inizia Ora
          </button>
          <p className="text-center text-xs text-charcoal/40 font-medium uppercase tracking-widest">
            Powered by Google Gemini
          </p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    if (isPlaying && selectedProject) {
      return <ProjectPlayer project={selectedProject} onClose={() => setIsPlaying(false)} />;
    }

    if (selectedProject) {
      return (
        <ProjectDetailView 
          project={selectedProject} 
          onBack={() => setSelectedProject(null)} 
          onStart={() => setIsPlaying(true)}
        />
      );
    }

    if (isEditingProfile) {
      return <EditProfileView onBack={() => setIsEditingProfile(false)} />;
    }

    switch (activeTab) {
      case 'home': return <HomeView onSelectProject={(p: any) => setSelectedProject(p)} onNavigate={(tab: any) => setActiveTab(tab)} />;
      case 'scan': return <ScanView onShowProject={(p) => setSelectedProject(p)} />;
      case 'projects': return <ProjectsView onSelectProject={(p) => setSelectedProject(p)} />;
      case 'laboratorio': return <LaboratorioView />;
      case 'saved': return <SavedView onSelectProject={(p) => setSelectedProject(p)} />;
      case 'profile': return <ProfileView onNavigate={(tab: any) => setActiveTab(tab)} onEditProfile={() => setIsEditingProfile(true)} />;
      default: return <HomeView onSelectProject={(p: any) => setSelectedProject(p)} onNavigate={(tab: any) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-bg-warm relative overflow-hidden ring-1 ring-charcoal/5">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProject ? (isPlaying ? `player-${selectedProject.id}` : selectedProject.id) : (isEditingProfile ? 'edit-profile' : activeTab)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      {!isPlaying && !selectedProject && !isEditingProfile && (
        <nav className="fixed bottom-0 w-full max-w-md bg-bg-warm/80 backdrop-blur-md border-t border-charcoal/5 px-4 py-4 z-50">
          <div className="flex items-center justify-between">
            <button onClick={() => {setActiveTab('home'); setSelectedProject(null); setIsEditingProfile(false);}} className={cn("nav-item px-2", activeTab === 'home' && "active")}>
              <Home size={22} />
              <span className="text-[9px] font-bold">Home</span>
            </button>
            <button onClick={() => {setActiveTab('laboratorio'); setSelectedProject(null); setIsEditingProfile(false);}} className={cn("nav-item px-2", activeTab === 'laboratorio' && "active")}>
              <Package size={22} />
              <span className="text-[9px] font-bold">Lab</span>
            </button>
            <button onClick={() => {setActiveTab('scan'); setSelectedProject(null); setIsEditingProfile(false);}} className={cn("nav-item bg-olive-dark text-white rounded-full p-4 -mt-12 shadow-lg shadow-olive-dark/20 ring-4 ring-bg-warm active:scale-90 transition-transform", activeTab === 'scan' && "scale-110")}>
              <PlusCircle size={28} />
            </button>
            <button onClick={() => {setActiveTab('projects'); setSelectedProject(null); setIsEditingProfile(false);}} className={cn("nav-item px-2", activeTab === 'projects' && "active")}>
              <BookOpen size={22} />
              <span className="text-[9px] font-bold">Esplora</span>
            </button>
            <button onClick={() => {setActiveTab('profile'); setSelectedProject(null); setIsEditingProfile(false);}} className={cn("nav-item px-2", activeTab === 'profile' && "active")}>
              <User size={22} />
              <span className="text-[9px] font-bold">Profilo</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
