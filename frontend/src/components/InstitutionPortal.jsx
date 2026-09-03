import React, { useState, useEffect } from 'react';
import { GraduationCap, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Plus, BookOpen, Users, BarChart3, Award, ExternalLink, Sparkles } from 'lucide-react';
import { API_BASE } from '../config';

export default function InstitutionPortal({ instId = 'usr-institution-1' }) {
  const [activeTab, setActiveTab] = useState('verification'); // verification | courses | faculty | analytics
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [courses, setCourses] = useState([]);
  const [gapAnalytics, setGapAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Course Modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(['skill-3']);
  const [taxonomySkills, setTaxonomySkills] = useState([]);

  useEffect(() => {
    fetchData();
  }, [instId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Verification Queue
      const queueRes = await fetch(`${API_BASE}/institution/verification-queue/${instId}`);
      const queueJson = await queueRes.json();
      if (queueJson.success) setVerificationQueue(queueJson.queue || []);

      // 2. Fetch Courses
      const courseRes = await fetch(`${API_BASE}/institution/courses/${instId}`);
      const courseJson = await courseRes.json();
      if (courseJson.success) setCourses(courseJson.courses || []);

      // 3. Fetch Skill-Gap Analytics
      const gapRes = await fetch(`${API_BASE}/institution/skill-gap-analytics`);
      const gapJson = await gapRes.json();
      if (gapJson.success) setGapAnalytics(gapJson.analytics || []);

      // 4. Fetch Taxonomy
      const taxRes = await fetch(`${API_BASE}/taxonomy`);
      const taxJson = await taxRes.json();
      if (taxJson.success) setTaxonomySkills(taxJson.skills || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAction = async (requestId, action) => {
    try {
      const res = await fetch(`${API_BASE}/institution/verify-claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          action, // 'approve' | 'reject' | 'flag'
          reviewed_by: instId
        })
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/institution/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: instId,
          provider_name: 'All India Institute of Ayurveda (AIIA)',
          title: courseTitle,
          description: courseDesc,
          skills_taught: selectedSkills,
          format: 'Hybrid (Laboratory + Online)',
          duration: '6 Weeks'
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowCourseModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-amber-400 text-slate-900 rounded-2xl flex items-center justify-center font-black text-xl shadow">
            AIIA
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold">All India Institute of Ayurveda (AIIA)</h2>
              <span className="bg-amber-400 text-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                AYUSH Accredited University
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-1">Ministry of AYUSH Premier Institution • New Delhi</p>
          </div>
        </div>

        <button
          onClick={() => setShowCourseModal(true)}
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Course / Skill Program</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        {[
          { id: 'verification', label: 'Certificate Verification Queue', icon: ShieldCheck, badge: verificationQueue.filter(q => q.status === 'Pending').length },
          { id: 'courses', label: 'Published Programs & Skills', icon: BookOpen },
          { id: 'faculty', label: 'Faculty Opportunities (FDP/Research)', icon: Users },
          { id: 'analytics', label: 'Curriculum Skill-Gap Analytics', icon: BarChart3 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
                isActive
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: VERIFICATION QUEUE */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Student Certificate Verification Desk</p>
              <p>
                When students claim a skill supported by your institution, AI runs OCR checks and routes low-confidence or high-impact claims to this manual queue. Confirming flips the student's status from <strong>Pending</strong> to <strong>Verified</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {verificationQueue.map(item => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-900 text-base">{item.student_name}</h3>
                      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded font-medium">
                        Student ID: {item.student_id}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold mt-1">
                      Claimed Skill: <span className="underline">{item.skill_name}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Submitted Date: {item.requested_at}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleVerifyAction(item.id, 'approve')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Flip to Verified</span>
                    </button>
                    <button
                      onClick={() => handleVerifyAction(item.id, 'flag')}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold px-3 py-2 rounded-xl text-xs flex items-center space-x-1"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Flag for Moderation</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>AI OCR Extraction Audit Trail</span>
                    </span>
                    <span className="font-bold text-emerald-700">OCR Confidence: {item.ocr_confidence}%</span>
                  </div>
                  <p className="text-slate-600">{item.ocr_extracted_details}</p>
                  <a
                    href={item.evidence_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-semibold pt-1"
                  >
                    <span>Inspect Evidence Document</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COURSES */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(c => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <span className="bg-emerald-100 text-emerald-800 font-semibold text-[10px] px-2.5 py-0.5 rounded-full">
                  Accredited Academic Program
                </span>
                <span className="text-xs font-bold text-amber-600">★ {c.rating}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">{c.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
              <p className="text-xs text-slate-500">⏱ {c.duration} • 💻 {c.format}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FACULTY OPPORTUNITIES */}
      {activeTab === 'faculty' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Faculty Development Programs (FDP) & Industry Consultancy</h3>
            <p className="text-xs text-slate-500">AYUSH faculty members can participate in joint industry research and FDP grants.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded">FDP Grant</span>
                <h4 className="font-bold text-slate-900 text-sm">FDP: AI Applications in Pharmacognosy</h4>
                <p className="text-xs text-slate-600">National faculty training on computer vision for herbal raw material identification.</p>
                <p className="text-xs font-bold text-purple-800">💰 ₹25,000 Grant</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">Industry Consultancy</span>
                <h4 className="font-bold text-slate-900 text-sm">Standardizing Polyherbal Anti-Diabetic Formulations</h4>
                <p className="text-xs text-slate-600">Joint clinical trial design and HPLC assay validation with Dabur India R&D.</p>
                <p className="text-xs font-bold text-emerald-800">💰 ₹5,00,000 Budget</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CURRICULUM SKILL-GAP ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Curriculum Skill-Gap Analytics Dashboard</h3>
            <p className="text-slate-500">Aggregate comparison of student verified skill supply vs real-time industry job posting demand.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                  <th className="p-3">Taxonomy Skill</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Industry Job Demand</th>
                  <th className="p-3">Verified Student Supply</th>
                  <th className="p-3">Curriculum Gap Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gapAnalytics.map(row => (
                  <tr key={row.skill_id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{row.skill_name}</td>
                    <td className="p-3 text-slate-500">{row.category}</td>
                    <td className="p-3 font-semibold text-emerald-700">{row.industry_demand_count} Postings</td>
                    <td className="p-3 font-semibold text-slate-700">{row.verified_student_supply_count} Verified</td>
                    <td className="p-3">
                      {row.gap_index > 0 ? (
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                          Gap: +{row.gap_index} Demand Delta
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                          Balanced Supply
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Publish Accredited Course / Skill Program</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  placeholder="e.g. Advanced HPLC & Quality Control Certification"
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={courseDesc}
                  onChange={e => setCourseDesc(e.target.value)}
                  placeholder="Course curriculum and hands-on laboratory modules..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowCourseModal(false)} className="px-4 py-2 rounded-xl text-slate-600 font-semibold">
                  Cancel
                </button>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-5 py-2 rounded-xl">
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
