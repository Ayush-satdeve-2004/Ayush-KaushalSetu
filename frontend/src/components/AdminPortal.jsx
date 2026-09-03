import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Plus, AlertTriangle, Users, BookOpen, Briefcase, FileCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../config';

export default function AdminPortal() {
  const [overview, setOverview] = useState(null);
  const [taxonomy, setTaxonomy] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newCategory, setNewCategory] = useState('Ayurveda');
  const [newAliases, setNewAliases] = useState('');

  useEffect(() => {
    fetchAdminOverview();
    fetchTaxonomy();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/overview`);
      const json = await res.json();
      if (json.success) setOverview(json.metrics);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTaxonomy = async () => {
    try {
      const res = await fetch(`${API_BASE}/taxonomy`);
      const json = await res.json();
      if (json.success) setTaxonomy(json.skills || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTaxonomySkill = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/taxonomy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSkillName,
          category: newCategory,
          aliases: newAliases
        })
      });
      const json = await res.json();
      if (json.success) {
        setNewSkillName('');
        setNewAliases('');
        fetchTaxonomy();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow">
            GOI
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold">Ministry of AYUSH Oversight Layer</h2>
              <span className="bg-amber-400 text-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Platform Moderator
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">National Skill Mapping, Audit Trail & Shared Skill Vocabulary Control</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <p className="text-slate-500">Total Users</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{overview?.total_users || 7}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <p className="text-slate-500">Shared Skills</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{taxonomy.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <p className="text-slate-500">Verified Claims</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{overview?.total_verified_claims || 3}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <p className="text-slate-500">Pending Inst.</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{overview?.total_pending_verifications || 1}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <p className="text-slate-500">Active Jobs</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{overview?.total_jobs || 2}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <p className="text-slate-500">Accredited Courses</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{overview?.total_courses || 3}</p>
        </div>
      </div>

      {/* Shared Skill Taxonomy CRUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-1">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            <span>Add Skill to Taxonomy</span>
          </h3>

          <form onSubmit={handleAddTaxonomySkill} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Skill Name</label>
              <input
                type="text"
                required
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                placeholder="e.g. Siddha Pharmacology Assays"
                className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category Domain</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
              >
                <option value="Ayurveda">Ayurveda</option>
                <option value="Therapeutics">Therapeutics</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Yoga & Naturopathy">Yoga & Naturopathy</option>
                <option value="Siddha & Unani">Siddha & Unani</option>
                <option value="Digital Health">Digital Health</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Aliases (Comma Separated)</label>
              <input
                type="text"
                value={newAliases}
                onChange={e => setNewAliases(e.target.value)}
                placeholder="e.g. Siddha Prep, Maruthuvam"
                className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl transition-all shadow"
            >
              Save to Central Taxonomy
            </button>
          </form>
        </div>

        {/* Taxonomy List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Central Versioned Skill Vocabulary (v1.0)</span>
          </h3>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-2 text-xs">
            {taxonomy.map(skill => (
              <div key={skill.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{skill.name}</p>
                  <p className="text-slate-500">Category: {skill.category} • Aliases: {skill.aliases?.join(', ') || 'None'}</p>
                </div>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-1 rounded">
                  {skill.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
