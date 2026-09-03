import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, Clock, AlertTriangle, Sparkles, BookOpen, ExternalLink, Award, FileText, Upload, Plus, ChevronRight, Briefcase, Share2, Eye, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_BASE } from '../config';

export default function StudentPortal({ studentId = 'usr-student-1', onSharePortfolio }) {
  const [activeTab, setActiveTab] = useState('matches'); // matches | profile | skillgap | applications
  const [profileData, setProfileData] = useState(null);
  const [claims, setClaims] = useState([]);
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Skill Claim Modal state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSkillId, setClaimSkillId] = useState('skill-3');
  const [evidenceType, setEvidenceType] = useState('Certificate Upload');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [certNumber, setCertNumber] = useState('AYUSH-VERIFIED-9912');
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  // Pre-loaded Skill Gap Recommender Demo Data
  const [selectedJobForGap, setSelectedJobForGap] = useState(null);
  const [gapData, setGapData] = useState({
    job_title: 'Herbal Quality Control & Phytochemistry Analyst',
    company_name: 'Dabur India AYUSH R&D',
    current_compatibility: 82,
    missing_skills: [
      { skill_id: 'skill-3', skill_name: 'HPLC / HPTLC Spectroscopy & Chromatography', category: 'Quality Control', importance: 'Critical Must-Have' },
      { skill_id: 'skill-5', skill_name: 'GMP Standardization for Herbal Formulations', category: 'Regulatory Compliance', importance: 'Must-Have' },
      { skill_id: 'skill-8', skill_name: 'Herbal Pharmacovigilance & Adverse Drug Reaction Reporting', category: 'Clinical Safety', importance: 'Preferred' }
    ],
    recommended_courses: [
      {
        course_id: 'course-101',
        title: 'Advanced Phytochemical Analysis & HPLC Standardization',
        provider_name: 'All India Institute of Ayurveda (AIIA) & Swayam AYUSH',
        provider_type: 'Statutory AYUSH University',
        target_skill_name: 'HPLC / HPTLC Spectroscopy',
        duration: '4 Weeks (Self-Paced)',
        format: 'Online + Hands-On Lab Workshop',
        rating: '4.9',
        enroll_url: 'https://swayam.gov.in/ayush-hplc-qc'
      },
      {
        course_id: 'course-102',
        title: 'GMP & Pharmacovigilance Certification for AYUSH Formulations',
        provider_name: 'Ministry of AYUSH Skill Academy & Gujarat Ayurved University',
        provider_type: 'Government Skill Board',
        target_skill_name: 'GMP Standardization & Pharmacovigilance',
        duration: '6 Weeks',
        format: 'Hybrid Certification',
        rating: '4.8',
        enroll_url: 'https://ayush.gov.in/skill-academy/gmp-cert'
      }
    ]
  });

  // Taxonomy skills list
  const [taxonomySkills, setTaxonomySkills] = useState([]);

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profRes = await fetch(`${API_BASE}/student/profile/${studentId}`);
      const profJson = await profRes.json();
      if (profJson.success) {
        setProfileData(profJson.profile);
        setClaims(profJson.claims || []);
      }

      const matchRes = await fetch(`${API_BASE}/student/job-matches/${studentId}`);
      const matchJson = await matchRes.json();
      if (matchJson.success) {
        setJobMatches(matchJson.matches || []);
      }

      const taxRes = await fetch(`${API_BASE}/taxonomy`);
      const taxJson = await taxRes.json();
      if (taxJson.success) {
        setTaxonomySkills(taxJson.skills || []);
      }
    } catch (err) {
      console.error('Error loading student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSkillSubmit = async (e) => {
    e.preventDefault();
    setOcrProcessing(true);

    try {
      const res = await fetch(`${API_BASE}/student/claim-skill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          student_name: profileData?.name || 'Aarav Sharma',
          skill_id: claimSkillId,
          evidence_type: evidenceType,
          evidence_url: evidenceUrl || 'https://ayush-kaushalsetu.gov.in/certs/uploaded-cert.pdf',
          issuing_institution_id: 'usr-institution-1',
          certificate_number: certNumber
        })
      });

      const json = await res.json();
      if (json.success) {
        setOcrResult(json.ocr_analysis);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        fetchData();
      }
    } catch (err) {
      console.error('Error submitting skill claim:', err);
    } finally {
      setOcrProcessing(false);
    }
  };

  const loadSkillGap = async (jobId) => {
    try {
      const res = await fetch(`${API_BASE}/student/skill-gap?student_id=${studentId}&job_id=${jobId}`);
      const json = await res.json();
      if (json.success) {
        setGapData(json.data);
        setActiveTab('skillgap');
      }
    } catch (err) {
      console.error('Error calculating skill gap:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified</span>
          </span>
        );
      case 'Pending Institution Confirmation':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Inst. Confirmation</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span>Self-Reported (Unverified)</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <Sparkles className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
        <span>Loading AI Verified Student Profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Student Profile Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 font-black text-2xl flex items-center justify-center shadow">
            AS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{profileData?.name || 'Aarav Sharma'}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {profileData?.degree || 'BAMS 4th Year'} Candidate
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              🏫 {profileData?.institution_name || 'All India Institute of Ayurveda (AIIA), New Delhi'} • Student ID: {profileData?.id || 'AYUSH-2026-9912'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (onSharePortfolio) onSharePortfolio(studentId);
              else alert(`Shareable QR & Portfolio URL generated for ${profileData?.name}`);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all border border-slate-700 text-xs flex items-center space-x-1.5"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Share Verified Skill Card</span>
          </button>
          <button
            onClick={() => setShowClaimModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow text-xs flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill Claim</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold space-x-4">
        <button
          onClick={() => setActiveTab('matches')}
          className={`pb-3 px-1 border-b-2 flex items-center space-x-1.5 transition-all ${
            activeTab === 'matches'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>AI Job Fit ({jobMatches.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-1 border-b-2 flex items-center space-x-1.5 transition-all ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Skill Matrix ({claims.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('skillgap')}
          className={`pb-3 px-1 border-b-2 flex items-center space-x-1.5 transition-all ${
            activeTab === 'skillgap'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Skill-Gap Recommender</span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-1 border-b-2 flex items-center space-x-1.5 transition-all ${
            activeTab === 'applications'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Application Tracker</span>
        </button>
      </div>

      {/* TAB 1: AI JOB MATCHES */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobMatches.map(match => (
              <div key={match.job.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{match.job.title}</h3>
                    <p className="text-xs text-emerald-700 font-semibold">{match.job.company_name}</p>
                    <p className="text-xs text-slate-500 mt-1">📍 {match.job.location} • {match.job.stipend_salary}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
                    <span className="text-xl font-black text-emerald-700">{match?.match_analysis?.compatibility_score ?? 0}%</span>
                    <p className="text-[9px] uppercase font-bold text-emerald-800">Fit Score</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => loadSkillGap(match.job.id)}
                    className="text-emerald-700 hover:underline font-bold flex items-center space-x-1"
                  >
                    <span>View Skill Gap & Recommended Courses</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIED SKILL MATRIX */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Verified Skill Matrix & Certificate Vault</h3>
            <button
              onClick={() => setShowClaimModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-xl text-xs"
            >
              + Add Skill Claim
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {claims.map(c => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{c.skill_name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Evidence: {c.evidence_type}</p>
                  </div>
                  {getStatusBadge(c.status)}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">OCR Authenticity Confidence:</span>
                    <span className="font-bold text-emerald-700">{c.confidence_score}%</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Verified By:</span>
                    <span>All India Institute of Ayurveda</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SKILL-GAP RECOMMENDER DEMO CONTENTS */}
      {activeTab === 'skillgap' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white p-6 rounded-2xl shadow-lg space-y-2">
            <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded">
              Active Skill-Gap Recommender Engine
            </span>
            <h3 className="text-xl font-bold">{gapData.job_title}</h3>
            <p className="text-xs text-teal-100">Target Employer: {gapData.company_name} • Current Compatibility: {gapData.current_compatibility}%</p>
          </div>

          {/* Missing Skill Deltas */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Identified Missing Skill Deltas ({gapData.missing_skills.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {gapData.missing_skills.map(s => (
                <div key={s.skill_id} className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl space-y-1 text-xs">
                  <span className="bg-amber-200 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded">
                    {s.importance}
                  </span>
                  <p className="font-bold text-amber-950 mt-1">{s.skill_name}</p>
                  <p className="text-[10px] text-amber-800">Category: {s.category}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Accredited Courses */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Recommended Accredited Courses to Close Skill Gap</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gapData.recommended_courses.map(course => (
                <div key={course.course_id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="bg-emerald-100 text-emerald-800 font-semibold text-[10px] px-2.5 py-0.5 rounded-full">
                        {course.provider_type}
                      </span>
                      <span className="text-xs font-bold text-amber-600">★ {course.rating}</span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm leading-snug">{course.title}</h5>
                    <p className="text-xs text-emerald-700 font-semibold">{course.provider_name}</p>
                    <p className="text-xs text-slate-500">
                      Teaches: <strong className="text-slate-800">{course.target_skill_name}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      ⏱ {course.duration} • 💻 {course.format}
                    </p>
                  </div>

                  <a
                    href={course.enroll_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow"
                  >
                    <span>Enroll Now to Close Gap</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: APPLICATION TRACKER WITH EXPLICIT SHORTLISTING STAGES */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Active Job Applications & Shortlisting Progress</h3>
            <p className="text-slate-500">Monitor your exact stage reached in institutional shortlisting pipelines.</p>
          </div>

          <div className="space-y-4">
            <div className="border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Herbal Quality Control & Standardization Analyst</h4>
                  <p className="text-xs text-emerald-700 font-semibold">Dabur India AYUSH R&D</p>
                  <p className="text-xs text-slate-500 mt-0.5">Applied on 2026-08-20 • Fit Score: 82%</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs text-center">
                  Stage 3: Technical Screening & HR Interview Scheduled
                </span>
              </div>

              {/* 4-Step Stepper Component */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <p className="font-bold text-slate-700 text-xs">Shortlisting Stage Progression Tracker:</p>
                
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                  <div className="space-y-1">
                    <div className="h-2 rounded bg-emerald-600" />
                    <span className="text-emerald-800">1. Applied / Fit Scored ✓</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 rounded bg-emerald-600" />
                    <span className="text-emerald-800">2. Credential Verified ✓</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 rounded bg-amber-500" />
                    <span className="text-amber-900">3. HR Interview (Active)</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 rounded bg-slate-200" />
                    <span className="text-slate-400">4. Offer Extended</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT SKILL CLAIM WITH AI OCR */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <span>Submit Skill Claim & OCR Evidence</span>
              </h3>
              <button onClick={() => setShowClaimModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleClaimSkillSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Skill from AYUSH Taxonomy</label>
                <select
                  value={claimSkillId}
                  onChange={e => setClaimSkillId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {taxonomySkills.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Certificate / ID Number</label>
                <input
                  type="text"
                  required
                  value={certNumber}
                  onChange={e => setCertNumber(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ocrProcessing}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2 rounded-xl shadow"
                >
                  {ocrProcessing ? 'Processing OCR...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
