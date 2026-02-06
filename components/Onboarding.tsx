import React, { useState } from 'react';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (user: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gradeClass, setGradeClass] = useState('');
  const [weaknessInput, setWeaknessInput] = useState('');
  const [weaknesses, setWeaknesses] = useState<string[]>([]);

  const handleAddWeakness = () => {
    if (weaknessInput.trim() && weaknesses.length < 3) {
      setWeaknesses([...weaknesses, weaknessInput.trim()]);
      setWeaknessInput('');
    }
  };

  const handleRemoveWeakness = (index: number) => {
    setWeaknesses(weaknesses.filter((_, i) => i !== index));
  };

  const finishOnboarding = () => {
    const newUser: UserProfile = {
      name,
      gradeClass,
      weaknesses,
      disciplinePoints: 0,
      mastery: 10, // Start slightly above 0 for encouragement
      badges: ['Novice']
    };
    storageService.saveUser(newUser);
    onComplete(newUser);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-royal-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="w-full max-w-md bg-dark-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
            <div className="mb-8 text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                    <BookOpen className="text-white w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">Bienvenue sur EDUCTOME</h2>
                <p className="text-slate-400 mt-2 text-sm">Ton mentor pédagogique personnel.</p>
            </div>

            {/* Step 1: Name */}
            {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                    <label className="block text-sm font-medium text-slate-300">Comment t'appelles-tu ?</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                        placeholder="Ex: Kouassi Jean"
                        autoFocus
                    />
                    <button 
                        onClick={() => setStep(2)}
                        disabled={!name.trim()}
                        className="w-full bg-royal-600 hover:bg-royal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mt-4 transition-all"
                    >
                        Suivant <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Step 2: Class */}
            {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                    <label className="block text-sm font-medium text-slate-300">Quelle est ta classe ?</label>
                    <select
                        value={gradeClass}
                        onChange={(e) => setGradeClass(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                    >
                        <option value="">Sélectionner...</option>
                        <option value="Terminale C">Terminale C</option>
                        <option value="Terminale D">Terminale D</option>
                        <option value="Terminale A">Terminale A</option>
                        <option value="Première">Première</option>
                        <option value="Troisième">Troisième</option>
                        <option value="Autre">Autre</option>
                    </select>
                    <button 
                        onClick={() => setStep(3)}
                        disabled={!gradeClass}
                        className="w-full bg-royal-600 hover:bg-royal-500 disabled:opacity-50 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mt-4 transition-all"
                    >
                        Suivant <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => setStep(1)} className="w-full text-slate-500 text-sm mt-2 hover:text-slate-300">Retour</button>
                </div>
            )}

            {/* Step 3: Weaknesses */}
            {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                    <label className="block text-sm font-medium text-slate-300">Cite 2 points faibles (Chapitres)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={weaknessInput}
                            onChange={(e) => setWeaknessInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddWeakness()}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                            placeholder="Ex: Barycentres"
                        />
                        <button onClick={handleAddWeakness} className="bg-slate-700 hover:bg-slate-600 px-4 rounded-lg text-white font-bold">+</button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                        {weaknesses.map((w, i) => (
                            <span key={i} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-xs flex items-center gap-1">
                                {w} <button onClick={() => handleRemoveWeakness(i)}><CheckCircle className="w-3 h-3 hover:text-red-400" /></button>
                            </span>
                        ))}
                    </div>

                    <button 
                        onClick={finishOnboarding}
                        disabled={weaknesses.length === 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-3 rounded-lg font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-6 transition-all"
                    >
                        Commencer l'entraînement
                    </button>
                    <button onClick={() => setStep(2)} className="w-full text-slate-500 text-sm mt-2 hover:text-slate-300">Retour</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default Onboarding;