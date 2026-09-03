import React, { useState, useEffect } from 'react';
import { Building2, Plus, Sparkles, UserCheck, ShieldCheck, CheckCircle2, AlertTriangle, Filter, ChevronRight, Send, Briefcase, BarChart3, Clock, Layers, Award, Check, FileText } from 'lucide-react';
import { API_BASE } from '../config';

export default function CompanyPortal({ companyId = 'usr-company-1' }) {
  const [activeTab, setActiveTab] = useState('candidates'); // candidates | jobs | pipeline | analytics
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('job-1');
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Job Posting Modal state with dedicated Skill Requirements Section
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('Ghaziabad, UP (Hybrid)');
  const [jobType, setJobType] = useState('Full-time / Internship');
  const [jobSalary, setJobSalary] = useState('₹5,00,000 - ₹7,00,000 / year');
  const [jobDesc, setJobDesc] = useState('');
  const [mustHaveSkills, setMustHaveSkills] = useState(['HPLC/HPTLC Spectroscopy', 'Ayurvedic Phytochemistry', 'GMP Standardization']);
  const [niceToHaveSkills, setNiceToHaveSkills] = useState(['Pharmacovigilance', 'ISO 17025 Compliance', 'Herbal Formulation R&D']);
  const [newMustSkill, setNewMustSkill] = useState('');
  const [newNiceSkill, setNewNiceSkill] = useState('');

  const [taxonomySkills, setTaxonomySkills] = useState([]);

  // Shortlist Candidate Stage Modal State
  const [shortlistCandidateModal, setShortlistCandidateModal] = useState(null);
  const [selectedStage, setSelectedStage] = useState('Stage 2: Institutional Skill Credential Verified');

  // Filter controls
  const [filterMinScore, setFilterMinScore] = useState(50);
  const [filterVerificationOnly, setFilterVerificationOnly] = useState(false);

  useEffect(() => {
    fetchCompanyJobs();
    fetchTaxonomy();
  }, [companyId]);

  useEffect(() => {
    if (selectedJobId) {
      fetchRankedCandidates(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchTaxonomy = async () => {
    try {
      const res = await fetch(`${API_BASE}/taxonomy`);
      const json = await res.json();
      if (json.success) setTaxonomySkills(json.skills || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCompanyJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/company/jobs/${companyId}`);
      const json = await res.json();
      if (json.success && json.jobs.length > 0) {
        setJobs(json.jobs);
        setSelectedJobId(json.jobs[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRankedCandidates = async (jobId) => {
    try {
      const res = await fetch(`${API_BASE}/company/candidates/${jobId}`);
      const json = await res.json();
      if (json.success) {
        setRankedCandidates(json.rankedCandidates || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMustSkill = () => {
    if (newMustSkill.trim() && !mustHaveSkills.includes(newMustSkill.trim())) {
      setMustHaveSkills([...mustHaveSkills, newMustSkill.trim()]);
      setNewMustSkill('');
    }
  };

  const handleAddNiceSkill = () => {
    if (newNiceSkill.trim() && !niceToHaveSkills.includes(newNiceSkill.trim())) {
      setNiceToHaveSkills([...niceToHaveSkills, newNiceSkill.trim()]);
      setNewNiceSkill('');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const reqSkillsFormatted = [
        ...mustHaveSkills.map(name => ({ skill_name: name, weight: 2.0, must_have: true })),
        ...niceToHaveSkills.map(name => ({ skill_name: name, weight: 1.0, must_have: false }))
      ];

      const res = await fetch(`${API_BASE}/company/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          company_name: 'Dabur India AYUSH R&D',
          title: jobTitle,
          location: jobLocation,
          type: jobType,
          stipend_salary: jobSalary,
          description: jobDesc,
          required_skills: reqSkillsFormatted,
          filters: { min_experience_years: 0.5, degree_required: 'BAMS' }
        })
      });

      const json = await res.json();
      if (json.success) {
        setShowPostJobModal(false);
        fetchCompanyJobs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShortlistCandidateSubmit = async () => {
    if (!shortlistCandidateModal) return;
    try {
      const res = await fetch(`${API_BASE}/company/shortlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: selectedJobId,
          student_id: shortlistCandidateModal.student_id,
          status: selectedStage
        })
      });
      const json = await res.json();
      if (json.success) {
        alert(`Candidate ${shortlistCandidateModal.name} moved to: ${selectedStage}`);
        setShortlistCandidateModal(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCandidates = rankedCandidates.filter(c => {
    if (c.analysis.compatibility_score < filterMinScore) return false;
    if (filterVerificationOnly) {
      const hasVerified = c.analysis.met_must_have.some(m => m.verification_status === 'Verified');
      if (!hasVerified) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-900 font-extrabold text-2xl flex items-center justify-center shadow">
            🏢
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Dabur India AYUSH R&D</h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                Verified Industry Partner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              AYUSH Talent Acquisition • Explainable Skill Compatibility Matching
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPostJobModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl transition-all shadow flex items-center space-x-2 shrink-0 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Opportunity / Job</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 text-xs font-bold space-x-4">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`pb-3 px-1 border-b-2 flex items-center space-x-1.5 transition-all ${
            activeTab === 'candidates'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>AI Ranked Candidates</span>
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 px-1 border-b-2 flex items-center space-x-1.5 transition-all ${
            activeTab === 'jobs'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Active Postings ({jobs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`pb-3 px-1 border-b-2 flex items-center space-x-1.5 transition-all ${
            activeTab === 'pipeline'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Shortlisting Stage Pipeline</span>
        </button>
      </div>

      {/* TAB 1: AI RANKED CANDIDATES */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-slate-200 gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <label className="font-bold text-slate-700">Select Job Role:</label>
              <select
                value={selectedJobId}
                onChange={e => setSelectedJobId(e.target.value)}
                className="border border-slate-300 rounded-lg p-2 bg-slate-50 font-bold text-slate-800"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title} ({j.location})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterVerificationOnly}
                  onChange={e => setFilterVerificationOnly(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-700">Verified Credentials Only</span>
              </label>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-700">Min Fit Score: {filterMinScore}%</span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={filterMinScore}
                  onChange={e => setFilterMinScore(Number(e.target.value))}
                  className="w-24 accent-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredCandidates.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500 text-xs">
                No candidate matches found matching the applied filter thresholds.
              </div>
            ) : (
              filteredCandidates.map(({ student, analysis }, index) => (
                <div
                  key={student.student_id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900 text-base">{student.name}</h3>
                          <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">
                            {student.degree}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {student.institution_name} • Experience: {student.experience_years} Years
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
                        <div className="text-2xl font-black text-emerald-700">
                          {analysis.compatibility_score}%
                        </div>
                        <div className="text-[10px] uppercase font-bold text-emerald-800">
                          Explainable Fit
                        </div>
                      </div>

                      <button
                        onClick={() => setShortlistCandidateModal({ student_id: student.student_id, name: student.name })}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow flex items-center space-x-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Shortlist Candidate</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>AI Candidate Ranking Criteria</span>
                      </span>
                      <span className="text-slate-500">{analysis.explanation}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {analysis.met_must_have.map(s => (
                        <span key={s.skill_id} className="bg-emerald-100 text-emerald-900 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-emerald-200">
                          ✓ {s.skill_name} ({s.verification_status})
                        </span>
                      ))}
                      {analysis.missed_must_have.map(s => (
                        <span key={s.skill_id} className="bg-amber-100 text-amber-900 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-200">
                          ✗ Missing: {s.skill_name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE JOB POSTINGS */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(j => (
            <div key={j.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-base">{j.title}</h4>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  {j.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">📍 {j.location} • {j.stipend_salary}</p>
              <div className="text-xs space-y-1">
                <p className="font-semibold text-slate-700">Required Skills Section:</p>
                <div className="flex flex-wrap gap-1">
                  {j.required_skills?.map(s => (
                    <span key={s.skill_id} className={`text-[10px] px-2 py-0.5 rounded ${s.must_have ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-700'}`}>
                      {s.skill_name} {s.must_have ? '(Must-Have)' : '(Nice-to-Have)'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PIPELINE WITH EXPLICIT SHORTLISTING STAGES */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900">
            <h3 className="font-bold text-sm">Candidates Shortlisting Progress Stepper</h3>
            <p className="mt-0.5">Track candidate evaluation across 4 explicit shortlisting stages.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: 1, name: 'Stage 1: Applied / AI Match Scored', count: 12, desc: 'Compatible Match Scored' },
              { id: 2, name: 'Stage 2: Skill Credential Verified', count: 4, desc: 'AIIA Institution Verified' },
              { id: 3, name: 'Stage 3: HR Interview Scheduled', count: 2, desc: 'Technical Interview Set' },
              { id: 4, name: 'Stage 4: Offer Letter Issued', count: 1, desc: 'Selection Confirmed' }
            ].map(stage => (
              <div key={stage.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{stage.name}</h4>
                    <p className="text-[10px] text-slate-400">{stage.desc}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {stage.count}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Aarav Sharma</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">82% Fit</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Herbal QC & Standardization Analyst</p>

                  {/* 4-Step Stepper Indicator */}
                  <div className="flex items-center space-x-1 pt-1">
                    <div className={`h-1.5 flex-1 rounded ${stage.id >= 1 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                    <div className={`h-1.5 flex-1 rounded ${stage.id >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                    <div className={`h-1.5 flex-1 rounded ${stage.id >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                    <div className={`h-1.5 flex-1 rounded ${stage.id >= 4 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POST JOB MODAL WITH DEDICATED SKILL REQUIREMENTS SECTION */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Post New Opportunity against Shared Taxonomy</h3>
                <p className="text-xs text-slate-500">Specify skill requirements for AI candidate compatibility matching</p>
              </div>
              <button onClick={() => setShowPostJobModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job / Internship Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Panchakarma Therapist & Clinical Supervisor"
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Description</label>
                <textarea
                  required
                  rows={2}
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder="Detailed role summary and requirements..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
                />
              </div>

              {/* DEDICATED SKILL REQUIREMENTS SECTION */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl space-y-3">
                <h4 className="font-extrabold text-emerald-900 text-xs flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Dedicated Skill Requirements Section</span>
                </h4>

                {/* Must-Have Skills */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Must-Have Required Skills (Weighted 2.0x in AI Fit)</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newMustSkill}
                      onChange={e => setNewMustSkill(e.target.value)}
                      placeholder="Add Must-Have Skill (e.g. HPLC/HPTLC Spectroscopy)"
                      className="flex-1 border border-slate-300 rounded-lg p-2 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddMustSkill}
                      className="bg-emerald-700 text-white font-bold px-3 py-2 rounded-lg text-xs"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mustHaveSkills.map(s => (
                      <span key={s} className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center space-x-1">
                        <span>✓ {s}</span>
                        <button type="button" onClick={() => setMustHaveSkills(mustHaveSkills.filter(item => item !== s))} className="text-emerald-700 font-black ml-1">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nice-to-Have Skills */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nice-to-Have Preferred Skills (Weighted 1.0x)</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newNiceSkill}
                      onChange={e => setNewNiceSkill(e.target.value)}
                      placeholder="Add Preferred Skill (e.g. Pharmacovigilance)"
                      className="flex-1 border border-slate-300 rounded-lg p-2 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddNiceSkill}
                      className="bg-slate-700 text-white font-bold px-3 py-2 rounded-lg text-xs"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {niceToHaveSkills.map(s => (
                      <span key={s} className="bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center space-x-1">
                        <span>○ {s}</span>
                        <button type="button" onClick={() => setNiceToHaveSkills(niceToHaveSkills.filter(item => item !== s))} className="text-slate-600 font-black ml-1">✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2 rounded-xl shadow"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHORTLIST CANDIDATE STAGE SELECTOR MODAL */}
      {shortlistCandidateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900">Specify Shortlisting Stage for {shortlistCandidateModal.name}</h3>
            
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">Select Shortlisting Stage:</label>
              <select
                value={selectedStage}
                onChange={e => setSelectedStage(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 font-bold"
              >
                <option value="Stage 1: Applied / AI Match Scored">Stage 1: Applied / AI Match Scored</option>
                <option value="Stage 2: Institutional Skill Credential Verified">Stage 2: Institutional Skill Credential Verified</option>
                <option value="Stage 3: Technical Screening & HR Interview Scheduled">Stage 3: Technical Screening & HR Interview Scheduled</option>
                <option value="Stage 4: Offer Letter Extended / Selection Confirmed">Stage 4: Offer Letter Extended / Selection Confirmed</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShortlistCandidateModal(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShortlistCandidateSubmit}
                className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow"
              >
                Update Shortlisting Stage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
