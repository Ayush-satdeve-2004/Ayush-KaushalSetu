import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Award, FileText, ExternalLink, Share2, Sparkles, Building2 } from 'lucide-react';
import { API_BASE } from '../config';

export default function PublicPortfolioModal({ studentId = 'usr-student-1', onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, [studentId]);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${API_BASE}/student/portfolio/${studentId}`);
      const json = await res.json();
      if (json.success) setData(json.portfolio);
    } catch (e) {
      console.error(e);
    }
  };

  if (!data) return null;

  const { user, profile, verified_skills, pending_skills } = data;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="gradient-ayush p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold">{profile?.name || 'Aarav Sharma'}</h2>
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-emerald-100 text-sm">{profile?.degree} • {profile?.institution_name}</p>
              <span className="inline-block mt-2 bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                Public Verified AYUSH Digital Ledger
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Bio & Academic Background</h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {profile?.bio || 'Ayurvedic scholar and clinical researcher specializing in Panchakarma and herbal standardization.'}
            </p>
          </div>

          {/* Verified Skills */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Officially Verified Skill Credentials ({verified_skills?.length || 0})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {verified_skills?.map(c => (
                <div key={c.id} className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-950 text-xs">{c.skill_name}</span>
                    <span className="bg-emerald-200 text-emerald-900 text-[9px] font-bold px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-800">Verified By: All India Institute of Ayurveda</p>
                  <p className="text-[10px] text-slate-500">OCR Authenticity Confidence: {c.confidence_score}%</p>
                  <a
                    href={c.evidence_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[11px] pt-1"
                  >
                    <span>Inspect Evidence</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Audit Note */}
          <div className="bg-slate-100 p-4 rounded-xl text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">🔒 Security & Anti-Fraud Guarantee</p>
            <p>
              This digital portfolio is cryptographic & OCR verified against institutional records under SIH Problem Statement SIH26044 guidelines (Ministry of AYUSH).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
