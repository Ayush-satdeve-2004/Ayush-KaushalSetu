import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Webhook, CheckCircle2, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { API_BASE } from '../config';

export default function PlatformPortal({ platformId = 'usr-platform-1' }) {
  const [courses, setCourses] = useState([]);
  const [webhookSimulated, setWebhookSimulated] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [platformId]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/platform/courses/${platformId}`);
      const json = await res.json();
      if (json.success) setCourses(json.courses || []);
    } catch (e) {
      console.error(e);
    }
  };

  const triggerWebhookSimulation = async () => {
    try {
      const res = await fetch(`${API_BASE}/platform/webhook/completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: 'usr-student-2',
          student_name: 'Priya Nair',
          course_id: 'course-102',
          skill_id: 'skill-8',
          platform_credential_id: 'SWAYAM-ABDM-8819'
        })
      });
      const json = await res.json();
      if (json.success) {
        setWebhookSimulated(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-white text-emerald-800 rounded-2xl flex items-center justify-center font-black text-xl shadow">
            SW
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold">Swayam AYUSH Skill Academy</h2>
              <span className="bg-teal-500/30 border border-teal-300/30 text-teal-100 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Third-Party Skill Provider
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-1">National Online Certification Partner • API Webhook Integration Ready</p>
          </div>
        </div>

        <button
          onClick={triggerWebhookSimulation}
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-2 shrink-0"
        >
          <Webhook className="w-4 h-4" />
          <span>Simulate Auto-Verification Webhook</span>
        </button>
      </div>

      {webhookSimulated && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center space-x-3 text-xs text-emerald-900 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Webhook Event Dispatched & Auto-Verified!</p>
            <p>Completion data for Priya Nair (ABDM Digital Health) pushed directly to KaushalSetu student ledger without manual queue delay.</p>
          </div>
        </div>
      )}

      {/* Courses & Market Gap Signal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Offered Online Certification Courses</span>
          </h3>

          <div className="space-y-3">
            {courses.map(c => (
              <div key={c.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                <p className="text-slate-600">{c.description}</p>
                <p className="text-emerald-700 font-semibold mt-1">Format: {c.format} • {c.duration}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <span>Skill Market-Gap Signal for Providers</span>
          </h3>
          <p className="text-xs text-slate-500">
            Real-time market gap signals indicating skills with high industry job posting demand but low course availability:
          </p>

          <div className="space-y-3 text-xs">
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl space-y-1">
              <span className="bg-amber-200 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded">High Provider Opportunity</span>
              <h4 className="font-bold text-amber-950 text-sm">Herbal HPLC Quality Control & Assay</h4>
              <p className="text-amber-800">Industry Demand: 12 Openings • Provider Course Coverage: 35%</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1">
              <span className="bg-emerald-200 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded">High Enrolment Demand</span>
              <h4 className="font-bold text-emerald-950 text-sm">ABDM Digital Health Integration</h4>
              <p className="text-emerald-800">Industry Demand: 8 Openings • Provider Course Coverage: 80%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
