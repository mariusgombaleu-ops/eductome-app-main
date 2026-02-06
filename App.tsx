import React, { useState, useEffect } from 'react';
import { UserProfile, ChatSession, Subject, Message } from './types';
import { storageService } from './services/storageService';
import Onboarding from './components/Onboarding';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import SettingsModal from './components/SettingsModal';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentSubject, setCurrentSubject] = useState<Subject>(Subject.MATH);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load User & Sessions on Mount
  useEffect(() => {
    const loadedUser = storageService.getUser();
    if (loadedUser) {
      setUser(loadedUser);
    }
    const loadedSessions = storageService.getSessions();
    setSessions(loadedSessions);
  }, []);

  // Handler: User completes onboarding
  const handleOnboardingComplete = (newUser: UserProfile) => {
    setUser(newUser);
    createNewSession(Subject.MATH, newUser);
  };

  // Handler: Create New Session
  const createNewSession = (subject: Subject = currentSubject, currentUser = user) => {
    if (!currentUser) return;
    
    // Initial welcome message from the mentor
    const welcomeMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        content: `Enchanté ${currentUser.name}. On s'attaque à tes points faibles (${currentUser.weaknesses.join(', ')}) ? Choisis une matière ou pose ta question.`,
        timestamp: Date.now()
    };

    const newSession: ChatSession = {
        id: Date.now().toString(),
        subject: subject,
        messages: [welcomeMsg],
        lastUpdated: Date.now()
    };

    const newSessions = [...sessions, newSession];
    setSessions(newSessions);
    setCurrentSessionId(newSession.id);
    setCurrentSubject(subject);
    storageService.saveSession(newSession);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  // Handler: Update Current Session
  const handleSessionUpdate = (updatedSession: ChatSession) => {
    const updatedSessions = sessions.map(s => s.id === updatedSession.id ? updatedSession : s);
    setSessions(updatedSessions);
    // Don't need to save here, ChatInterface saves to storage, but we sync state
  };

  // Handler: Update Points
  const handlePointsUpdate = (pointsAdded: number) => {
      const updatedUser = storageService.updatePoints(pointsAdded);
      if (updatedUser) setUser(updatedUser);
  };

  // Handler: Update User Profile from Settings
  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    storageService.saveUser(updatedUser);
    setIsSettingsOpen(false);
  };

  // Routing Logic
  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const activeSession = sessions.find(s => s.id === currentSessionId) || sessions[sessions.length - 1];

  return (
    <div className="flex h-screen w-full bg-dark-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-800 rounded-lg text-slate-200 shadow-lg">
             {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
      </div>

      <Sidebar 
         currentSubject={currentSubject}
         onSelectSubject={(subj) => {
             setCurrentSubject(subj);
             createNewSession(subj);
         }}
         sessions={sessions}
         onSelectSession={(id) => {
             setCurrentSessionId(id);
             setIsSidebarOpen(false);
         }}
         onNewSession={() => createNewSession()}
         isOpen={isSidebarOpen}
         onOpenSettings={() => {
            setIsSettingsOpen(true);
            setIsSidebarOpen(false);
         }}
      />

      <div className="flex-1 flex flex-col h-full w-full relative min-h-0">
         <Header 
            user={user} 
            onOpenSettings={() => setIsSettingsOpen(true)}
         />
         
         {activeSession ? (
             <ChatInterface 
                user={user}
                currentSubject={currentSubject}
                session={activeSession}
                onSessionUpdate={handleSessionUpdate}
                onPointsUpdate={handlePointsUpdate}
             />
         ) : (
             <div className="flex-1 flex items-center justify-center">
                 <button onClick={() => createNewSession()} className="bg-emerald-600 px-6 py-3 rounded-lg text-white font-bold">
                    Démarrer une session
                 </button>
             </div>
         )}
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onSave={handleUpdateProfile}
      />
    </div>
  );
};

export default App;