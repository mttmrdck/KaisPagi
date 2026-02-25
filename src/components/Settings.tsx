import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Smartphone, Moon, Sun, Trash2, Info, Shield } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
  onDeleteAccount: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onDeleteAccount }) => {
  const toggle = (key: keyof UserSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="max-w-md mx-auto w-full flex flex-col gap-8 p-6 pb-32">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-2xl font-serif font-bold">Settings</h1>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4 mb-2">Preferences</h3>
        
        <SettingToggle 
          icon={settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          label="Sound Effects"
          active={settings.soundEnabled}
          onClick={() => toggle('soundEnabled')}
        />
        
        <SettingToggle 
          icon={<Smartphone size={20} />}
          label="Haptic Feedback"
          active={settings.hapticEnabled}
          onClick={() => toggle('hapticEnabled')}
        />

        <SettingToggle 
          icon={settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
          label="Dark Mode"
          active={settings.darkMode}
          onClick={() => toggle('darkMode')}
        />

        <div className="mt-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4 mb-4">Difficulty</h3>
          <div className="grid grid-cols-3 gap-3">
            {['easy', 'normal', 'hard'].map((d) => (
              <button
                key={d}
                onClick={() => onUpdate({...settings, difficulty: d as any})}
                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  settings.difficulty === d 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' 
                    : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4 mb-2">Account & Legal</h3>
          
          <button className="w-full glass p-6 rounded-[2rem] flex items-center justify-between border-white/5">
            <div className="flex items-center gap-4">
              <Shield size={20} className="text-zinc-400" />
              <span className="text-sm font-bold text-white">Privacy Policy</span>
            </div>
            <Info size={16} className="text-zinc-600" />
          </button>

          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account? All data will be permanently lost.")) {
                onDeleteAccount();
              }
            }}
            className="w-full p-6 rounded-[2rem] flex items-center gap-4 text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={20} />
            <span className="text-sm font-bold">Delete Account</span>
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">KaisPagi v1.0.4</p>
        </div>
      </div>
    </div>
  );
};

const SettingToggle = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full glass p-6 rounded-[2rem] flex items-center justify-between border-white/5 transition-all active:scale-[0.98]"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
        {icon}
      </div>
      <span className="text-sm font-bold text-white">{label}</span>
    </div>
    <div className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
      <motion.div 
        animate={{ x: active ? 24 : 4 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
      />
    </div>
  </button>
);
