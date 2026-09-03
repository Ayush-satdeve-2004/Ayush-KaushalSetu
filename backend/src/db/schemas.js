const mongoose = require('mongoose');

// 1. User Schema (Student, Company, Institution, Platform, Admin)
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: {
    type: String,
    enum: ['student', 'company', 'institution', 'platform', 'admin'],
    required: true
  },
  document_number: { type: String },
  file_attached: { type: String },
  avatar: { type: String },
  verified_status: { type: Boolean, default: false },
  institution_name: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 2. Skill Taxonomy Schema (Central Shared Skill Vocabulary v1.0)
const SkillTaxonomySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  skill_name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  ayush_domain: { type: String },
  description: { type: String },
  standardized_code: { type: String },
  version: { type: String, default: '1.0' }
});

// 3. Student Profile & Skill Claims Schema
const StudentProfileSchema = new mongoose.Schema({
  user_id: { type: String, required: true, ref: 'User' },
  degree: { type: String },
  specialization: { type: String },
  graduation_year: { type: Number },
  verified_skills: [{ type: String }],
  unverified_skills: [{ type: String }],
  ocr_extracted_certificates: [{
    certificate_id: String,
    title: String,
    issuer: String,
    ocr_confidence: Number,
    extracted_text: String,
    verification_status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    issued_date: Date
  }]
});

// 4. Job Posting Schema (Industry Requirements)
const JobPostingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  company_id: { type: String, required: true, ref: 'User' },
  company_name: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String },
  salary_range: { type: String },
  job_type: { type: String },
  must_have_skills: [{ type: String }],
  nice_to_have_skills: [{ type: String }],
  description: { type: String },
  posted_date: { type: Date, default: Date.now }
});

// 5. Skill Gap Course Recommendation Schema
const CourseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  provider_platform: { type: String, required: true },
  skills_covered: [{ type: String }],
  duration_weeks: { type: Number },
  enrollment_url: { type: String },
  certification_badge: { type: String }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  SkillTaxonomy: mongoose.model('SkillTaxonomy', SkillTaxonomySchema),
  StudentProfile: mongoose.model('StudentProfile', StudentProfileSchema),
  JobPosting: mongoose.model('JobPosting', JobPostingSchema),
  Course: mongoose.model('Course', CourseSchema)
};
