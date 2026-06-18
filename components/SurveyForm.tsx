
import React, { useState } from 'react';
import { SurveyData } from '../types';

interface SurveyFormProps {
  onSubmit: (data: SurveyData) => void;
  isLoading: boolean;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SurveyData>({
    age: '',
    incomeRange: '',
    employmentStatus: '',
    emergencyFund: '',
    debtLevel: '',
    housingCost: '',
    dependents: '',
    insuranceCoverage: '',
    additionalContext: '',
    retirementSavings: '',
    retirementAgeGoal: '',
    retirementContribution: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder:text-slate-500";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1";
  const sectionTitleClasses = "text-blue-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-slate-900/50 p-8 rounded-2xl shadow-xl border border-slate-800 backdrop-blur-sm">
      
      {/* Section Profil */}
      <div>
        <h3 className={sectionTitleClasses}>
          <i className="fas fa-user-circle"></i> Profil de base
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Âge actuel</label>
            <input type="text" name="age" placeholder="Ex: 42" required className={inputClasses} onChange={handleChange} />
          </div>
          <div>
            <label className={labelClasses}>Statut d'emploi</label>
            <select name="employmentStatus" required className={inputClasses} onChange={handleChange}>
              <option value="">Sélectionner</option>
              <option value="Salarié temps plein">Salarié temps plein</option>
              <option value="Entrepreneur / Dirigeant">Entrepreneur / Dirigeant</option>
              <option value="Travailleur autonome">Travailleur autonome</option>
              <option value="Saisonnier / Précaire">Saisonnier / Contrat</option>
              <option value="Sans emploi">Sans emploi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section Finances */}
      <div>
        <h3 className={sectionTitleClasses}>
          <i className="fas fa-wallet"></i> Situation Financière
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Revenu annuel brut</label>
            <select name="incomeRange" required className={inputClasses} onChange={handleChange}>
              <option value="">Sélectionner</option>
              <option value="Moins de 40k">Moins de 40k$</option>
              <option value="40k - 80k">40k$ - 80k$</option>
              <option value="80k - 120k">80k$ - 120k$</option>
              <option value="120k+">120k$ +</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Fonds d'urgence</label>
            <select name="emergencyFund" required className={inputClasses} onChange={handleChange}>
              <option value="">Sélectionner</option>
              <option value="Aucun">Aucun</option>
              <option value="Moins de 1 mois">Moins de 1 mois</option>
              <option value="1 à 3 mois">1 à 3 mois</option>
              <option value="3 mois et plus">3 mois et plus</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Niveau d'endettement</label>
            <select name="debtLevel" required className={inputClasses} onChange={handleChange}>
              <option value="">Sélectionner</option>
              <option value="Faible ou nul">Faible ou nul</option>
              <option value="Gérable">Gérable</option>
              <option value="Élevé (+40% du revenu)">Élevé (+40% du revenu)</option>
              <option value="Critique / Retards">Critique / Retards</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Logement (% du budget)</label>
            <input type="text" name="housingCost" placeholder="Ex: 30%" required className={inputClasses} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* NOUVELLE SECTION : Préparation Retraite */}
      <div>
        <h3 className={sectionTitleClasses}>
          <i className="fas fa-umbrella-beach"></i> Objectif Retraite
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClasses}>Épargne retraite actuelle (REER, CELI, Fonds de pension)</label>
            <select name="retirementSavings" required className={inputClasses} onChange={handleChange}>
              <option value="">Sélectionner</option>
              <option value="0 - 25k">0$ - 25 000$</option>
              <option value="25k - 100k">25 000$ - 100 000$</option>
              <option value="100k - 250k">100 000$ - 250 000$</option>
              <option value="250k - 500k">250 000$ - 500 000$</option>
              <option value="500k+">Plus de 500 000$</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Âge visé pour la retraite</label>
            <input type="number" name="retirementAgeGoal" placeholder="Ex: 65" required className={inputClasses} onChange={handleChange} />
          </div>
          <div>
            <label className={labelClasses}>Épargne mensuelle (%)</label>
            <select name="retirementContribution" required className={inputClasses} onChange={handleChange}>
              <option value="">Sélectionner</option>
              <option value="0%">0% (Aucune épargne)</option>
              <option value="1-5%">1% à 5% du revenu</option>
              <option value="6-10%">6% à 10% du revenu</option>
              <option value="10%+">Plus de 10% du revenu</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClasses}>Contexte additionnel (projets, assurances, etc.)</label>
        <textarea name="additionalContext" rows={2} placeholder="Ex: J'ai deux enfants à charge, je n'ai pas d'assurance invalidité..." className={inputClasses} onChange={handleChange}></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
      >
        {isLoading ? (
          <>
            <i className="fas fa-circle-notch animate-spin"></i>
            Analyse stratégique en cours...
          </>
        ) : (
          <>
            <i className="fas fa-bolt"></i>
            Calculer ma vulnérabilité & ma retraite
          </>
        )}
      </button>
    </form>
  );
};

export default SurveyForm;
