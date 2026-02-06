import React from 'react';
import { Subject, ChatSession } from '../types';
import { Calculator, Atom, BookOpen, ScrollText, Plus, MessageSquare, Settings } from 'lucide-react';

interface SidebarProps {
  currentSubject: Subject;
  onSelectSubject: (s: Subject) => void;
  sessions: ChatSession[];
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  isOpen: boolean;
  onOpenSettings: () => void;
}

const subjects = [
  { id: Subject.MATH, icon: Calculator, label: 'Maths' },
  { id: Subject.PHYSICS, icon: Atom, label: 'Physique' },
  { id: Subject.SVT, icon: BookOpen, label: 'SVT' },
  { id: Subject.GENERAL, icon: ScrollText, label: 'Méthode' },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  currentSubject, 
  onSelectSubject, 
  sessions, 
  onSelectSession, 
  onNewSession,
  isOpen,
  onOpenSettings
}) => {
  return (
    <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-dark-900 border-r border-slate-800 transition-transform z-10 flex flex-col`}>
      
      {/* Subject Navigation */}
      <div className="p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Matières</p>
        {subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelectSubject(sub.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              currentSubject === sub.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <sub.icon className="w-4 h-4" />
            {sub.label}
          </button>
        ))}
      </div>

      <div className="h-px bg-slate-800 mx-4 my-2"></div>

      {/* History */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-2">
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Historique</p>
             <button onClick={onNewSession} className="p-1 hover:bg-slate-800 rounded">
                <Plus className="w-4 h-4 text-royal-500" />
             </button>
        </div>
       
        <div className="space-y-1">
          {sessions.length === 0 ? (
              <p className="text-xs text-slate-600 italic">Aucune session récente.</p>
          ) : (
              sessions.slice().reverse().map(session => (
                <button
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 text-left truncate"
                >
                    <MessageSquare className="w-3 h-3 min-w-[12px]" />
                    <span className="truncate">{session.messages[session.messages.length - 1]?.content.substring(0, 25) || "Nouvelle session"}...</span>
                </button>
              ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
               <p className="text-xs text-slate-400">Mentor v1.0</p>
               <button onClick={onOpenSettings} className="text-slate-400 hover:text-emerald-400 transition-colors" title="Paramètres">
                 <Settings className="w-4 h-4" />
               </button>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-royal-600 h-full w-[75%]"></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Serveur opérationnel</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;