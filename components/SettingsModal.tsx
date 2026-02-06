import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { X, Save, CheckCircle, Award, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [name, setName] = useState(user.name);
  const [gradeClass, setGradeClass] = useState(user.gradeClass);
  const [weaknesses, setWeaknesses] = useState<string[]>(user.weaknesses);
  const [weaknessInput, setWeaknessInput] = useState('');

  // Sync state with user prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setGradeClass(user.gradeClass);
      setWeaknesses(user.weaknesses);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleAddWeakness = () => {
    if (weaknessInput.trim() && !weaknesses.includes(weaknessInput.trim())) {
      setWeaknesses([...weaknesses, weaknessInput.trim()]);
      setWeaknessInput('');
    }
  };

  const handleRemoveWeakness = (index: number) => {
    setWeaknesses(weaknesses.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim() || !gradeClass) return;
    
    const updatedUser: UserProfile = {
      ...user,
      name,
      gradeClass,
      weaknesses
    };
    onSave(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100">Paramètres & Profil</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Personal Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider">Informations</h3>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Prénom / Nom</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Classe</label>
              <select
                value={gradeClass}
                onChange={(e) => setGradeClass(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
              >
                <option value="Terminale C">Terminale C</option>
                <option value="Terminale D">Terminale D</option>
                <option value="Terminale A">Terminale A</option>
                <option value="Première">Première</option>
                <option value="Troisième">Troisième</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Weaknesses Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider">Points Faibles (Objectifs)</h3>
            <p className="text-xs text-slate-500">Ajoute les chapitres que tu veux travailler en priorité.</p>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={weaknessInput}
                onChange={(e) => setWeaknessInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddWeakness()}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-emerald-500 outline-none"
                placeholder="Ex: Nombres complexes"
              />
              <button onClick={handleAddWeakness} className="bg-slate-700 hover:bg-slate-600 px-3 rounded-lg text-white font-bold">+</button>
            </div>

            <div className="flex flex-wrap gap-2">
              {weaknesses.map((w, i) => (
                <span key={i} className="bg-royal-900/40 text-royal-300 border border-royal-700/50 px-3 py-1.5 rounded-full text-xs flex items-center gap-2">
                  {w} 
                  <button onClick={() => handleRemoveWeakness(i)} className="hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {weaknesses.length === 0 && <span className="text-slate-600 text-xs italic">Aucun point faible défini.</span>}
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Badges Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                 <Award className="w-4 h-4" /> Badges Acquis
               </h3>
               <span className="text-xs text-slate-500">{user.badges.length} badges</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {user.badges.map((badge, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Award className="w-5 h-5" />
                   </div>
                   <span className="text-sm font-medium text-slate-200">{badge}</span>
                </div>
              ))}
              {user.badges.length === 0 && (
                <p className="col-span-2 text-center text-slate-500 text-xs py-4">Continue tes efforts pour débloquer des badges !</p>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-dark-900 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;