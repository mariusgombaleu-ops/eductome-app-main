import React from 'react';
import { UserProfile } from '../types';
import { Award, Zap, BrainCircuit } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface HeaderProps {
  user: UserProfile;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onOpenSettings }) => {
  // Mock data for the tiny chart
  const masteryData = [
    { name: 'Prev', val: Math.max(0, user.mastery - 10) },
    { name: 'Curr', val: user.mastery },
  ];

  return (
    <header className="h-16 shrink-0 bg-dark-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-emerald-500 to-royal-600 p-2 rounded-lg">
          <BrainCircuit className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">EDUCTOME</h1>
          <p className="text-xs text-emerald-400 font-medium">{user.gradeClass}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Discipline Points */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
          <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-slate-200">{user.disciplinePoints} pts</span>
        </div>

        {/* Mastery Progress */}
        <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Maîtrise</p>
                <p className="text-sm font-bold text-emerald-400">{user.mastery}%</p>
            </div>
            {/* Increased min-w to 120px to prevent Recharts console errors during resize/init */}
            <div className="w-32 h-8 hidden sm:block min-w-[120px] min-h-[32px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={masteryData}>
                        <Bar dataKey="val" fill="#10b981" radius={[2, 2, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
            </div>
        </div>

        {/* Avatar/Badges */}
        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
          title="Modifier le profil"
        >
            <div className="w-8 h-8 rounded-full bg-royal-600 flex items-center justify-center text-xs font-bold ring-2 ring-slate-700">
                {user.name.charAt(0).toUpperCase()}
            </div>
            {user.badges.length > 0 && (
                 <Award className="w-5 h-5 text-amber-500" />
            )}
        </button>
      </div>
    </header>
  );
};

export default Header;