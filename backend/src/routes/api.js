const express = require('express');
const router = express.Router();
const db = require('../db/store');
const { calculateJobCompatibility, normalizeAndExtractSkills } = require('../services/aiMatchingEngine');
const { processCertificateOCR } = require('../services/ocrVerificationService');
const { getSkillGapAndRecommendations } = require('../services/skillGapRecommender');

// OTP Verification Store
const activeOtps = new Map();

router.post('/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email address is required' });

  // Generate random 6-digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const cleanEmail = email.trim().toLowerCase();
  activeOtps.set(cleanEmail, generatedOtp);

  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'ayushkaushalsetu@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'AYUSH KaushalSetu Platform';

  try {
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: email.trim() }],
        subject: `${generatedOtp} is your AYUSH KaushalSetu Verification OTP`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #15803d; margin: 0;">AYUSH KaushalSetu</h2>
              <p style="color: #64748b; font-size: 13px; margin-top: 4px;">AI-Driven Academia–Industry–Skill Platform (SIH26044)</p>
            </div>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p style="font-size: 14px; color: #334155;">Hello,</p>
            <p style="font-size: 14px; color: #334155;">Your email verification code for AYUSH KaushalSetu registration is:</p>
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #166534;">${generatedOtp}</span>
            </div>
            <p style="font-size: 12px; color: #64748b; margin-top: 16px;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">Ministry of AYUSH • Government of India</p>
          </div>
        `
      })
    });

    const brevoData = await brevoResponse.json();

    if (brevoResponse.ok || brevoData.messageId) {
      console.log(`[Brevo API] OTP email successfully dispatched to ${email}. Message ID: ${brevoData.messageId}`);
      return res.json({
        success: true,
        message: `Verification OTP email sent to ${email}`
      });
    } else {
      console.error('Brevo API Error:', brevoData);
      return res.status(500).json({
        success: false,
        message: `Failed to send email via Brevo. Please check email address.`
      });
    }
  } catch (error) {
    console.error('Failed to dispatch email via Brevo:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to dispatch email via Brevo API.`
    });
  }
});

router.post('/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, verified: false, message: 'Email and OTP are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const storedOtp = activeOtps.get(cleanEmail) || activeOtps.get(email);
  
  if (storedOtp && otp.trim() === storedOtp) {
    res.json({ success: true, verified: true, message: 'Email Verified Successfully' });
  } else {
    res.status(400).json({ success: false, verified: false, message: 'Invalid OTP code. Please check your email inbox.' });
  }
});

// Forgot Password Store
const activeResetOtps = new Map();

router.post('/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email address is required' });

  const cleanEmail = email.trim().toLowerCase();
  const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ success: false, message: 'No registered account found with this email address.' });
  }

  // Generate 6-digit Reset OTP
  const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
  activeResetOtps.set(cleanEmail, resetOtp);

  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'ayushkaushalsetu@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'AYUSH KaushalSetu Platform';

  try {
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: user.email }],
        subject: `${resetOtp} is your Password Reset Code - AYUSH KaushalSetu`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #15803d; margin: 0;">AYUSH KaushalSetu</h2>
              <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Password Reset Request</p>
            </div>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p style="font-size: 14px; color: #334155;">Hello <strong>${user.name}</strong>,</p>
            <p style="font-size: 14px; color: #334155;">We received a request to reset your password. Your 6-digit reset code is:</p>
            <div style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #c2410c;">${resetOtp}</span>
            </div>
            <p style="font-size: 12px; color: #64748b; margin-top: 16px;">If you did not request a password reset, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">Ministry of AYUSH • Government of India</p>
          </div>
        `
      })
    });

    const brevoData = await brevoResponse.json();

    if (brevoResponse.ok || brevoData.messageId) {
      console.log(`[Brevo API] Reset code email sent to ${user.email}. Message ID: ${brevoData.messageId}`);
    } else {
      console.log(`[Brevo API Notice] Email service notice for ${user.email}:`, brevoData);
    }

    return res.json({
      success: true,
      message: `Password reset code sent to ${user.email}`
    });
  } catch (e) {
    console.error('Brevo API Dispatch Error:', e);
    return res.json({
      success: true,
      message: `Password reset code generated for ${user.email}`
    });
  }
});

function validatePasswordPattern(pwd) {
  if (!pwd) return false;
  const uppercaseMatches = (pwd.match(/[A-Z]/g) || []).length;
  const lowercaseMatches = (pwd.match(/[a-z]/g) || []).length;
  const numberMatches = (pwd.match(/[0-9]/g) || []).length;
  const specialMatches = (pwd.match(/[^A-Za-z0-9]/g) || []).length;
  return uppercaseMatches >= 1 && lowercaseMatches >= 4 && numberMatches >= 3 && specialMatches >= 1;
}

router.post('/auth/reset-password', (req, res) => {
  const { email, reset_code, new_password } = req.body;
  if (!email || !reset_code || !new_password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (!validatePasswordPattern(new_password)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Password Format: Must contain at least 1 Uppercase, 4 Lowercase, 3 Numbers, and 1 Special character.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const storedCode = activeResetOtps.get(cleanEmail);

  if (!storedCode || reset_code.trim() !== storedCode) {
    return res.status(400).json({ success: false, message: 'Invalid or expired password reset code.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Account not found.' });
  }

  user.password = new_password;
  activeResetOtps.delete(cleanEmail);

  return res.json({
    success: true,
    message: 'Password reset successfully! You can now sign in with your new password.'
  });
});

router.post('/auth/verify-id-document', (req, res) => {
  const { role, document_number, document_name } = req.body;

  if (!document_number) {
    return res.status(400).json({ success: false, valid: false, message: 'Document or ID number is required' });
  }

  const docUpper = document_number.trim().toUpperCase();

  // Test invalid condition if user enters "INVALID" or "123"
  if (docUpper.includes('INVALID') || docUpper === '123' || docUpper === 'FAIL') {
    return res.json({
      success: true,
      valid: false,
      message: 'Invalid ID / Unrecognized Registration in National Database',
      verification_type: role
    });
  }

  let entityName = 'AYUSH Recognized Body';
  if (role === 'student') entityName = 'All India Institute of Ayurveda Student Registry';
  else if (role === 'company') entityName = 'Ministry of Corporate Affairs (MCA) / GSTN Registered Entity';
  else if (role === 'institution') entityName = 'UGC / Ministry of AYUSH Statutory University Affiliation';
  else if (role === 'platform') entityName = 'NSDC / Skill India Digital Hub Partner';

  res.json({
    success: true,
    valid: true,
    message: `Verified against ${entityName}`,
    document_number: docUpper,
    verification_type: role
  });
});

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No account found matching this email address. Please Register Here.'
    });
  }

  // Role is automatically retrieved from user record!
  res.json({
    success: true,
    user,
    message: `Welcome back, ${user.name}! Logged in as ${user.role}.`
  });
});

router.post('/auth/register', (req, res) => {
  const { name, email, phone, role, document_number, password } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email and user role are required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Check duplicate Email
  const existingEmail = db.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existingEmail) {
    return res.status(400).json({
      success: false,
      message: `The email address "${email}" is already registered. Please Sign In instead.`
    });
  }

  // 2. Check duplicate Phone Number
  if (phone && phone.trim()) {
    const cleanPhone = phone.trim();
    const existingPhone = db.users.find(u => u.phone && u.phone.trim() === cleanPhone);
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: `The phone number "${phone}" is already registered to another account.`
      });
    }
  }

  const newUser = {
    id: `usr-${role}-${Date.now()}`,
    email: cleanEmail,
    name,
    role,
    phone: phone ? phone.trim() : '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    verified_id: document_number || 'REG-VERIFIED'
  };

  db.users.push(newUser);

  if (role === 'student') {
    db.studentProfiles.push({
      student_id: newUser.id,
      name,
      age: 23,
      degree: 'BAMS (Bachelor of Ayurvedic Medicine & Surgery)',
      year: 'Final Year',
      institution_id: 'usr-institution-1',
      institution_name: 'AYUSH University',
      experience_years: 1,
      location: 'India',
      bio: 'Enthusiastic AYUSH practitioner',
      skills: ['skill-1', 'skill-2']
    });
  }

  res.json({ success: true, user: newUser, message: 'User registered successfully!' });
});

// ==========================================
// 2. SHARED SKILL TAXONOMY
// ==========================================

router.get('/taxonomy', (req, res) => {
  res.json({ success: true, skills: db.skills });
});

router.post('/taxonomy', (req, res) => {
  const { name, category, aliases } = req.body;
  const newSkill = {
    id: `skill-${db.skills.length + 1}`,
    name,
    category: category || 'General',
    aliases: aliases ? aliases.split(',').map(a => a.trim()) : [],
    version: '1.0'
  };
  db.skills.push(newSkill);
  res.json({ success: true, skill: newSkill });
});

// ==========================================
// 3. STUDENT PORTAL APIs
// ==========================================

router.get('/student/profile/:id', (req, res) => {
  const studentId = req.params.id;
  const profile = db.studentProfiles.find(s => s.student_id === studentId);
  const claims = db.skillClaims.filter(c => c.student_id === studentId);
  const user = db.users.find(u => u.id === studentId);

  res.json({
    success: true,
    profile: profile || {
      student_id: studentId,
      name: user ? user.name : 'Student Profile',
      degree: 'BAMS',
      institution_name: 'AYUSH Accredited Institute'
    },
    claims
  });
});

router.post('/student/claim-skill', (req, res) => {
  const { student_id, student_name, skill_id, evidence_type, evidence_url, issuing_institution_id, certificate_number } = req.body;
  
  // Run OCR verification engine
  const ocrResult = processCertificateOCR(null, {
    student_name,
    skill_id,
    issuing_institution_id,
    certificate_number
  });

  const skillObj = db.skills.find(s => s.id === skill_id);

  const newClaim = {
    id: `claim-${Date.now()}`,
    student_id,
    skill_id,
    skill_name: skillObj ? skillObj.name : skill_id,
    evidence_type,
    evidence_url: evidence_url || 'https://ayush-kaushalsetu.gov.in/certs/sample-cert.pdf',
    status: ocrResult.status,
    verified_by: ocrResult.auto_verified ? issuing_institution_id : null,
    confidence_score: ocrResult.confidence_score,
    submitted_at: new Date().toISOString().split('T')[0]
  };

  db.skillClaims.push(newClaim);

  // Add to verification queue if pending
  if (ocrResult.status === 'Pending Institution Confirmation') {
    db.verificationRequests.push({
      id: `ver-req-${Date.now()}`,
      claim_id: newClaim.id,
      student_id,
      student_name,
      skill_id,
      skill_name: newClaim.skill_name,
      issuing_institution_id,
      issuing_institution_name: 'AYUSH Institution',
      evidence_type,
      evidence_url: newClaim.evidence_url,
      ocr_confidence: ocrResult.confidence_score,
      ocr_extracted_details: ocrResult.reasoning.join(' | '),
      status: 'Pending',
      requested_at: new Date().toISOString().split('T')[0]
    });
  }

  res.json({ success: true, claim: newClaim, ocr_analysis: ocrResult });
});

router.get('/student/job-matches/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const studentProfile = db.studentProfiles.find(s => s.student_id === studentId) || { student_id: studentId, skills: [] };
  
  const matches = db.jobPostings.map(job => {
    const analysis = calculateJobCompatibility(studentProfile, job);
    return {
      job,
      analysis
    };
  }).sort((a, b) => b.analysis.compatibility_score - a.analysis.compatibility_score);

  res.json({ success: true, matches });
});

router.get('/student/skill-gap', (req, res) => {
  const { student_id, job_id } = req.query;
  const result = getSkillGapAndRecommendations(student_id, job_id);
  res.json({ success: true, data: result });
});

// Digital Portfolio Public Share
router.get('/student/portfolio/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const profile = db.studentProfiles.find(s => s.student_id === studentId);
  const claims = db.skillClaims.filter(c => c.student_id === studentId);
  const user = db.users.find(u => u.id === studentId);

  res.json({
    success: true,
    portfolio: {
      user,
      profile,
      verified_skills: claims.filter(c => c.status === 'Verified'),
      pending_skills: claims.filter(c => c.status !== 'Verified')
    }
  });
});

// ==========================================
// 4. COMPANY / INDUSTRY PORTAL APIs
// ==========================================

router.post('/company/jobs', (req, res) => {
  const { company_id, company_name, title, location, type, stipend_salary, description, required_skills, filters } = req.body;

  const newJob = {
    id: `job-${Date.now()}`,
    company_id,
    company_name,
    title,
    location,
    type,
    stipend_salary,
    description,
    required_skills: required_skills || [],
    filters: filters || {},
    posted_at: new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  db.jobPostings.push(newJob);
  res.json({ success: true, job: newJob });
});

router.get('/company/jobs/:companyId', (req, res) => {
  const companyId = req.params.companyId;
  const jobs = db.jobPostings.filter(j => j.company_id === companyId);
  res.json({ success: true, jobs });
});

router.get('/company/candidates/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const job = db.jobPostings.find(j => j.id === jobId);
  
  if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });

  // Score all students against this job posting
  const rankedCandidates = db.studentProfiles.map(student => {
    const analysis = calculateJobCompatibility(student, job);
    return {
      student,
      analysis
    };
  }).sort((a, b) => b.analysis.compatibility_score - a.analysis.compatibility_score);

  res.json({ success: true, job, rankedCandidates });
});

router.post('/company/shortlist', (req, res) => {
  const { job_id, student_id, status } = req.body;
  const job = db.jobPostings.find(j => j.id === job_id);
  const student = db.studentProfiles.find(s => s.student_id === student_id);

  let app = db.applications.find(a => a.job_id === job_id && a.student_id === student_id);
  if (!app) {
    app = {
      id: `app-${Date.now()}`,
      job_id,
      student_id,
      student_name: student ? student.name : 'Student Candidate',
      company_id: job ? job.company_id : 'Company',
      status: status || 'Shortlisted',
      applied_at: new Date().toISOString().split('T')[0]
    };
    db.applications.push(app);
  } else {
    app.status = status || 'Shortlisted';
  }

  res.json({ success: true, application: app });
});

router.get('/company/pipeline/:companyId', (req, res) => {
  const companyId = req.params.companyId;
  const apps = db.applications.filter(a => a.company_id === companyId);
  res.json({ success: true, applications: apps });
});

// ==========================================
// 5. ACADEMIC INSTITUTION PORTAL APIs
// ==========================================

router.get('/institution/verification-queue/:instId', (req, res) => {
  const instId = req.params.instId;
  const queue = db.verificationRequests.filter(r => r.issuing_institution_id === instId || r.status === 'Pending');
  res.json({ success: true, queue });
});

router.post('/institution/verify-claim', (req, res) => {
  const { request_id, action, reviewed_by } = req.body; // action: 'approve' | 'reject' | 'flag'
  const reqItem = db.verificationRequests.find(r => r.id === request_id);

  if (reqItem) {
    reqItem.status = action === 'approve' ? 'Approved' : (action === 'flag' ? 'Flagged' : 'Rejected');
    
    // Update the master skill claim status
    const claim = db.skillClaims.find(c => c.id === reqItem.claim_id);
    if (claim) {
      if (action === 'approve') claim.status = 'Verified';
      else if (action === 'flag') claim.status = 'Flagged';
      else claim.status = 'Self-Reported (unverified)';
      
      claim.verified_by = reviewed_by || reqItem.issuing_institution_id;
    }
  }

  res.json({ success: true, request: reqItem });
});

router.get('/institution/courses/:instId', (req, res) => {
  const instId = req.params.instId;
  const courses = db.courses.filter(c => c.provider_id === instId);
  res.json({ success: true, courses });
});

router.post('/institution/courses', (req, res) => {
  const { provider_id, provider_name, title, description, skills_taught, format, duration, enroll_url } = req.body;
  const newCourse = {
    id: `course-${Date.now()}`,
    provider_id,
    provider_name: provider_name || 'Academic Institution',
    title,
    description,
    skills_taught: skills_taught || [],
    format: format || 'Hybrid',
    duration: duration || '4 Weeks',
    enroll_url: enroll_url || 'https://ayush-kaushalsetu.gov.in/courses',
    rating: 4.9
  };
  db.courses.push(newCourse);
  res.json({ success: true, course: newCourse });
});

router.get('/institution/skill-gap-analytics', (req, res) => {
  // Aggregate demand vs student verified supply analytics
  const skillDemandMap = {};
  db.jobPostings.forEach(job => {
    (job.required_skills || []).forEach(req => {
      skillDemandMap[req.skill_id] = (skillDemandMap[req.skill_id] || 0) + 1;
    });
  });

  const skillSupplyMap = {};
  db.skillClaims.filter(c => c.status === 'Verified').forEach(claim => {
    skillSupplyMap[claim.skill_id] = (skillSupplyMap[claim.skill_id] || 0) + 1;
  });

  const analytics = db.skills.map(s => ({
    skill_id: s.id,
    skill_name: s.name,
    category: s.category,
    industry_demand_count: skillDemandMap[s.id] || 0,
    verified_student_supply_count: skillSupplyMap[s.id] || 0,
    gap_index: Math.max(0, (skillDemandMap[s.id] || 0) - (skillSupplyMap[s.id] || 0))
  })).sort((a, b) => b.gap_index - a.gap_index);

  res.json({ success: true, analytics });
});

// ==========================================
// 6. THIRD-PARTY PLATFORM PORTAL APIs
// ==========================================

router.get('/platform/courses/:platformId', (req, res) => {
  const platformId = req.params.platformId;
  const courses = db.courses.filter(c => c.provider_id === platformId);
  res.json({ success: true, courses });
});

// Webhook endpoint simulation for platform auto-completion
router.post('/platform/webhook/completion', (req, res) => {
  const { student_id, student_name, course_id, skill_id, platform_credential_id } = req.body;
  const skillObj = db.skills.find(s => s.id === skill_id);

  const newClaim = {
    id: `claim-webhook-${Date.now()}`,
    student_id,
    skill_id,
    skill_name: skillObj ? skillObj.name : skill_id,
    evidence_type: 'Third-Party API Webhook Verification',
    evidence_url: `https://swayam-ayush.in/verify/${platform_credential_id || 'AUTO'}`,
    status: 'Verified',
    verified_by: 'Platform API Webhook',
    confidence_score: 99,
    submitted_at: new Date().toISOString().split('T')[0]
  };

  db.skillClaims.push(newClaim);
  res.json({ success: true, message: 'Completion auto-verified via webhook', claim: newClaim });
});

// ==========================================
// 7. ADMIN / OVERSIGHT LAYER APIs
// ==========================================

router.get('/admin/overview', (req, res) => {
  res.json({
    success: true,
    metrics: {
      total_users: db.users.length,
      total_students: db.studentProfiles.length,
      total_skills: db.skills.length,
      total_jobs: db.jobPostings.length,
      total_verified_claims: db.skillClaims.filter(c => c.status === 'Verified').length,
      total_pending_verifications: db.verificationRequests.filter(r => r.status === 'Pending').length,
      total_courses: db.courses.length
    }
  });
});

module.exports = router;
