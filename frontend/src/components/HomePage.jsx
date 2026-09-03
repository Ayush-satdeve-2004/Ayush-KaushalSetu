import React, { useState } from 'react';
import { ShieldCheck, Building2, GraduationCap, Users, Award, Briefcase, Sparkles, CheckCircle2, ArrowRight, ExternalLink, TrendingUp, Trophy, MapPin, BookOpen, Star, LogIn, UserPlus } from 'lucide-react';

export default function HomePage({ onOpenAuth }) {
  // Top 10 Academic Institutions based on NIRF AYUSH Rankings
  const top10Institutions = [
    { rank: 1, name: 'All India Institute of Ayurveda (AIIA)', location: 'New Delhi', score: '94.8', accredited: 'Ministry of AYUSH Apex Body', verifiedStudents: '3,450+' },
    { rank: 2, name: 'Gujarat Ayurved University (ITRA)', location: 'Jamnagar, Gujarat', score: '91.2', accredited: 'Institute of National Importance', verifiedStudents: '2,890+' },
    { rank: 3, name: 'Banaras Hindu University (Faculty of Ayurveda)', location: 'Varanasi, UP', score: '89.5', accredited: 'Central University Affiliation', verifiedStudents: '2,410+' },
    { rank: 4, name: 'National Institute of Ayurveda (NIA)', location: 'Jaipur, Rajasthan', score: '87.9', accredited: 'Deemed University (AYUSH)', verifiedStudents: '2,150+' },
    { rank: 5, name: 'Kerala Ayurved University & KAVS Center', location: 'Thrissur, Kerala', score: '86.4', accredited: 'State Autonomous University', verifiedStudents: '1,980+' },
    { rank: 6, name: 'Government Ayurvedic Medical College', location: 'Mysuru, Karnataka', score: '84.7', accredited: 'Government Accredited Body', verifiedStudents: '1,720+' },
    { rank: 7, name: 'Maharashtra University of Health Sciences (MUHS)', location: 'Nashik, Maharashtra', score: '83.1', accredited: 'State Health Sciences Board', verifiedStudents: '1,560+' },
    { rank: 8, name: 'State Ayurvedic College & Hospital', location: 'Lucknow, Uttar Pradesh', score: '81.9', accredited: 'State Medical Board', verifiedStudents: '1,340+' },
    { rank: 9, name: 'R.A. Podar Ayurved Medical College', location: 'Mumbai, Maharashtra', score: '80.5', accredited: 'MUHS Affiliated College', verifiedStudents: '1,180+' },
    { rank: 10, name: 'Dr. Sarvepalli Radhakrishnan Rajasthan Ayurved University', location: 'Jodhpur, Rajasthan', score: '79.2', accredited: 'State Statutory University', verifiedStudents: '1,050+' }
  ];

  // Registered Industry Partners & Companies
  const registeredCompanies = [
    { name: 'Dabur India AYUSH R&D', category: 'Pharma & Herbal Manufacturing', location: 'Ghaziabad, UP', logo: 'D', activeOpenings: 14 },
    { name: 'Kottakkal Arya Vaidya Sala', category: 'Ayurvedic Hospitals & Wellness Chain', location: 'Kottakkal, Kerala', logo: 'K', activeOpenings: 18 },
    { name: 'Himalaya Wellness Company', category: 'Phytomedicine & R&D Labs', location: 'Bengaluru, Karnataka', logo: 'H', activeOpenings: 22 },
    { name: 'Baidyanath Ayurveda', category: 'Herbal Formulations & Quality Control', location: 'Kolkata, WB', logo: 'B', activeOpenings: 9 },
    { name: 'Patanjali Research Foundation', category: 'Clinical Trials & Botanical Studies', location: 'Haridwar, Uttarakhand', logo: 'P', activeOpenings: 15 },
    { name: 'Zandu Healthcare (Emami)', category: 'Herbal Wellness & Formulations', location: 'Mumbai, Maharashtra', logo: 'Z', activeOpenings: 11 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        {/* Top Ministry Banner */}
        <div className="gradient-ayush text-white px-3 sm:px-4 py-1.5 text-xs font-medium flex flex-wrap justify-between items-center gap-1.5 w-full">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">
              SIH Problem Statement SIH26044
            </span>
            <span className="hidden md:inline">Ministry of AYUSH • Government of India</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-100 text-[11px]">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>AI Matching Engine Active</span>
            </span>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 w-full">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-ayush flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-md shrink-0">
              KS
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 truncate">
                  AYUSH <span className="text-emerald-700">KaushalSetu</span>
                </h1>
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                AI-Driven Academia–Industry–Skill Platform
              </p>
            </div>
          </div>

          {/* Top Most Right Corner: Single Unified Sign In / Register Button */}
          <div className="shrink-0">
            <button
              onClick={() => onOpenAuth('login')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs shadow-md transition-all whitespace-nowrap"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative gradient-ayush text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-100">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>National Academia–Industry Collaboration & Placement Portal</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Matching Verified AYUSH Skills to Real Industry Demand
          </h2>

          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto font-normal leading-relaxed">
            AYUSH KaushalSetu connects Students, AYUSH Companies, Academic Institutions, and Skill Platforms in a closed-loop system using Explainable AI Candidate Ranking and OCR Certificate Verification.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg flex items-center space-x-2"
            >
              <span>Get Started & Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-2xl text-sm border border-white/20 transition-all flex items-center space-x-2"
            >
              <span>Sign In to Your Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* Real-Time Platform Impact Metrics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center space-y-1">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold">
              <Building2 className="w-5 h-5 text-emerald-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">1,250+</p>
            <p className="text-xs font-semibold text-slate-500">Registered AYUSH Companies</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center space-y-1">
            <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold">
              <Trophy className="w-5 h-5 text-amber-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700">18,450+</p>
            <p className="text-xs font-semibold text-slate-500">Students Placed via Website</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center space-y-1">
            <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold">
              <GraduationCap className="w-5 h-5 text-teal-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">450+</p>
            <p className="text-xs font-semibold text-slate-500">Connected Universities & Institutions</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center space-y-1">
            <div className="w-10 h-10 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold">
              <Users className="w-5 h-5 text-purple-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-purple-700">42,800+</p>
            <p className="text-xs font-semibold text-slate-500">Active Users on Platform</p>
          </div>
        </div>
      </section>

      {/* Main Public Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 flex-1">
        {/* Section 1: Registered Companies & Industry Partners */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                Industry Network
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Registered AYUSH Industry Partners</h3>
              <p className="text-xs text-slate-500">Leading pharma companies, R&D labs, and hospital chains hiring verified talent.</p>
            </div>
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>View All 1,250+ Registered Companies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {registeredCompanies.map((c, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center font-black text-xl shadow">
                    {c.logo}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                    <p className="text-[11px] text-emerald-700 font-semibold">{c.category}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">📍 {c.location}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Active Job Openings:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {c.activeOpenings} Roles
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Top 10 Academic Institutions (NIRF AYUSH Ranking) */}
        <section className="space-y-6">
          <div>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              Academic Excellence
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">Top 10 Connected Institutions (NIRF AYUSH Ranking)</h3>
            <p className="text-xs text-slate-500">Premier accredited universities and apex bodies confirming student skill credentials.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">NIRF Rank</th>
                    <th className="p-4">Institution Name</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Accreditation Category</th>
                    <th className="p-4">NIRF Score</th>
                    <th className="p-4 text-right">Verified Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {top10Institutions.map(inst => (
                    <tr key={inst.rank} className="hover:bg-slate-50 transition-all">
                      <td className="p-4 font-black text-slate-900">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                          inst.rank === 1 ? 'bg-amber-400 text-slate-900 font-black shadow-sm' :
                          inst.rank <= 3 ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-100 text-slate-700 font-semibold'
                        }`}>
                          #{inst.rank}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900 text-sm">
                        {inst.name}
                      </td>
                      <td className="p-4 text-slate-500">📍 {inst.location}</td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                          {inst.accredited}
                        </span>
                      </td>
                      <td className="p-4 font-black text-emerald-700 text-sm">
                        {inst.score} / 100
                      </td>
                      <td className="p-4 text-right font-bold text-slate-800">
                        {inst.verifiedStudents}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3: Core AI Closed-Loop System Overview */}
        <section className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              SIH Problem Statement SIH26044 Architecture
            </span>
            <h3 className="text-2xl font-bold">How AYUSH KaushalSetu Works</h3>
            <p className="text-xs text-slate-300">
              Not a job board and not a course catalog. A closed-loop system connecting students, industry, universities, and platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 text-xs">
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-white">Verified Skill Profile</h4>
              <p className="text-slate-300">Students build a verified profile with supporting OCR certificate & project evidence.</p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-white">Explainable Matching</h4>
              <p className="text-slate-300">Companies specify required skills from shared taxonomy and get explainable candidate rankings.</p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-400 text-slate-900 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-white">Institutional Queue</h4>
              <p className="text-slate-300">Universities & platforms confirm certificates, flipping claims from Pending to Verified.</p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-400 text-slate-900 font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h4 className="font-bold text-sm text-white">Skill-Gap Loop</h4>
              <p className="text-slate-300">Unmatched students are told exact missing skill deltas and surface direct course links.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-slate-800">AYUSH KaushalSetu • Ministry of AYUSH</p>
            <p className="text-[11px] text-slate-500">Portal for Academia–Industry Collaboration (SIH26044)</p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <button onClick={() => onOpenAuth('login')} className="hover:text-emerald-700">Sign In</button>
            <span>•</span>
            <button onClick={() => onOpenAuth('register')} className="hover:text-emerald-700">Register</button>
            <span>•</span>
            <span className="text-slate-400">DPDP Act 2023 Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
