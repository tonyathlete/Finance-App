
import React, { useState } from 'react';
import { LeadInfo } from '../types';

interface LeadCaptureModalProps {
  onConfirm: (info: LeadInfo) => void;
  onCancel: () => void;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ onConfirm, onCancel }) => {
  const [info, setInfo] = useState<LeadInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(info);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses = "w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder:text-slate-500 transition";
  const labelClasses = "block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp border border-slate-800">
        {/* Header de la modale */}
        <div className="bg-blue-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30 rotate-3">
            <i className="fas fa-paper-plane text-2xl text-white"></i>
          </div>
          <h3 className="text-2xl font-black italic">DERNIÈRE ÉTAPE</h3>
          <p className="text-blue-100 text-sm mt-1 font-medium">Où devrions-nous envoyer votre rapport ?</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Prénom</label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="Jean"
                value={info.firstName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Nom</label>
              <input
                type="text"
                name="lastName"
                required
                placeholder="Dupont"
                value={info.lastName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Téléphone</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="(514) 000-0000"
              value={info.phone}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Courriel professionnel</label>
            <input
              type="email"
              name="email"
              required
              placeholder="jean.dupont@exemple.ca"
              value={info.email}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full bg-white text-slate-900 font-black py-4 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-3 shadow-xl uppercase text-sm tracking-widest"
            >
              Voir mon analyse
              <i className="fas fa-chevron-right text-[10px]"></i>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-slate-500 text-xs font-bold py-2 hover:text-slate-300 transition uppercase tracking-widest"
            >
              Annuler
            </button>
          </div>
          
          <p className="text-[10px] text-slate-500 text-center leading-relaxed font-medium">
            En continuant, vous acceptez de recevoir votre rapport par courriel et d'être contacté pour un suivi stratégique gratuit.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
