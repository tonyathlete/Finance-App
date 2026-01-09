
import React, { useState } from 'react';
import { SurveyData, AnalysisResult, LeadInfo } from './types';
import SurveyForm from './components/SurveyForm';
import ResultView from './components/ResultView';
import LeadCaptureModal from './components/LeadCaptureModal';
import { analyzeFinancialVulnerability } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [tempSurveyData, setTempSurveyData] = useState<SurveyData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSurveySubmit = (data: SurveyData) => {
    setTempSurveyData(data);
    setIsModalOpen(true);
  };

  const handleLeadConfirm = async (leadInfo: LeadInfo) => {
    if (!tempSurveyData) return;
    
    setIsModalOpen(false);
    setLoading(true);
    setError(null);
    
    try {
      const fullData: SurveyData = { ...tempSurveyData, leadInfo };
      const analysis = await analyzeFinancialVulnerability(fullData);
      setResult(analysis);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("Une erreur est survenue lors de l'analyse. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
    setTempSurveyData(null);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 py-6 px-4 mb-8 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
              <i className="fas fa-chart-pie text-white"></i>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              VULNERA<span className="text-blue-500">CAN</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            <span>Guide Canadien</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span>Prévention IA</span>
          </div>
        </div>
      </header>

      <main className="px-4 max-w-6xl mx-auto">
        {!result ? (
          <div className="space-y-10">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Évaluez votre solidité financière
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Identifiez vos zones de vulnérabilité grâce à notre analyseur intelligent basé sur les standards économiques canadiens.
              </p>
            </div>
            
            {error && (
              <div className="max-w-2xl mx-auto bg-rose-950/30 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
                <i className="fas fa-exclamation-circle text-rose-500"></i>
                {error}
              </div>
            )}

            <SurveyForm onSubmit={handleSurveySubmit} isLoading={loading} />
          </div>
        ) : (
          <ResultView result={result} onReset={resetAnalysis} />
        )}
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <LeadCaptureModal 
          onConfirm={handleLeadConfirm} 
          onCancel={() => setIsModalOpen(false)} 
        />
      )}

      {/* Footer Disclaimer */}
      <footer className="mt-20 border-t border-slate-900 pt-10 px-4">
        <div className="max-w-3xl mx-auto text-center text-xs text-slate-500 space-y-4">
          <p className="leading-relaxed">
            Avertissement : Cet outil est fourni à titre informatif et pédagogique uniquement. Il ne constitue pas un conseil financier professionnel, fiscal ou juridique.
          </p>
          <p className="font-bold text-slate-600 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} VulneraCan • Analyste Financier Digital
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
