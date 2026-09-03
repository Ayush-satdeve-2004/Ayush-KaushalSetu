const db = require('../db/store');

function seedDatabase() {
  db.reset();

  // 1. Shared Skill Taxonomy
  db.skills = [
    { id: 'skill-1', name: 'Ayurvedic Formulation', category: 'Ayurveda', aliases: ['Ayurvedic Medicine Prep', 'Rasashastra', 'Bhasma Prep'], version: '1.0' },
    { id: 'skill-2', name: 'Panchakarma Therapy', category: 'Therapeutics', aliases: ['Panchakarma Procedures', 'Vamana', 'Virechana', 'Basti'], version: '1.0' },
    { id: 'skill-3', name: 'Herbal Quality Control (HPLC/HPTLC)', category: 'Quality Assurance', aliases: ['Herbal QC', 'HPLC Analysis', 'Standardization'], version: '1.0' },
    { id: 'skill-4', name: 'Wellness Tourism Protocols', category: 'Wellness & Hospitality', aliases: ['Spa Management', 'AYUSH Tourism', 'Wellness Counseling'], version: '1.0' },
    { id: 'skill-5', name: 'Medicinal Plant Extraction', category: 'Pharmacognosy', aliases: ['Solvent Extraction', 'Phytochemical Analysis'], version: '1.0' },
    { id: 'skill-6', name: 'Yoga & Naturopathy Diagnostics', category: 'Yoga & Naturopathy', aliases: ['Asana Prescription', 'Nadi Pariksha', 'Pranayama Therapy'], version: '1.0' },
    { id: 'skill-7', name: 'AYUSH Clinical Trials & GCP', category: 'Clinical Research', aliases: ['Clinical Research', 'Good Clinical Practice', 'Ethical Compliance'], version: '1.0' },
    { id: 'skill-8', name: 'ABDM Digital Health Integration', category: 'Digital Health', aliases: ['ABDM', 'Health Records Management', 'EHR AYUSH'], version: '1.0' },
    { id: 'skill-9', name: 'Good Manufacturing Practices (GMP - AYUSH)', category: 'Regulatory Compliance', aliases: ['AYUSH GMP', 'Manufacturing Quality'], version: '1.0' },
    { id: 'skill-10', name: 'Patient Consultation & Pulse Diagnosis', category: 'Clinical Practice', aliases: ['Nadi Pariksha', 'Ayurvedic Diagnosis'], version: '1.0' }
  ];

  // 2. Users (Role-based)
  db.users = [
    {
      id: 'usr-student-1',
      email: 'aarav.sharma@student.aiia.ac.in',
      name: 'Aarav Sharma',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      institution_name: 'All India Institute of Ayurveda (AIIA), New Delhi'
    },
    {
      id: 'usr-student-2',
      email: 'priya.nair@student.keralaayush.edu.in',
      name: 'Priya Nair',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      institution_name: 'Kerala Ayurved University, Thrissur'
    },
    {
      id: 'usr-company-1',
      email: 'recruitment@daburayush.com',
      name: 'Dabur India AYUSH R&D',
      role: 'company',
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
      industry: 'Pharma & Herbal Manufacturing',
      location: 'Ghaziabad, UP'
    },
    {
      id: 'usr-company-2',
      email: 'careers@kottakkal.org',
      name: 'Kottakkal Arya Vaidya Sala',
      role: 'company',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150',
      industry: 'Ayurvedic Hospitals & Wellness Chain',
      location: 'Kottakkal, Kerala'
    },
    {
      id: 'usr-institution-1',
      email: 'academic@aiia.gov.in',
      name: 'All India Institute of Ayurveda (AIIA)',
      role: 'institution',
      avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150',
      location: 'New Delhi',
      accredited: true
    },
    {
      id: 'usr-platform-1',
      email: 'certification@swayam-ayush.in',
      name: 'Swayam AYUSH Skill Academy',
      role: 'platform',
      avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
      location: 'Online / National',
      partner_type: 'Government Skill Partner'
    },
    {
      id: 'usr-admin-1',
      email: 'admin@ayush.gov.in',
      name: 'Ministry of AYUSH Oversight Admin',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      department: 'National Skill Mapping Directorate'
    }
  ];

  // 3. Student Profiles
  db.studentProfiles = [
    {
      student_id: 'usr-student-1',
      name: 'Aarav Sharma',
      age: 23,
      degree: 'BAMS (Bachelor of Ayurvedic Medicine & Surgery)',
      year: 'Final Year (Internship)',
      institution_id: 'usr-institution-1',
      institution_name: 'All India Institute of Ayurveda (AIIA)',
      experience_years: 1,
      location: 'New Delhi',
      bio: 'Aspiring Ayurvedic physician and clinical researcher specializing in Panchakarma and herbal QC standardization.',
      skills: ['skill-1', 'skill-2', 'skill-10']
    },
    {
      student_id: 'usr-student-2',
      name: 'Priya Nair',
      age: 22,
      degree: 'B.Pharm (AYUSH)',
      year: 'Graduating 2026',
      institution_id: 'usr-institution-1',
      institution_name: 'Kerala Ayurved University',
      experience_years: 0.5,
      location: 'Kochi, Kerala',
      bio: 'Enthusiastic phytochemistry researcher focused on HPLC standardization of traditional Ayurvedic formulations.',
      skills: ['skill-1', 'skill-3', 'skill-5']
    }
  ];

  // 4. Skill Claims
  db.skillClaims = [
    {
      id: 'claim-101',
      student_id: 'usr-student-1',
      skill_id: 'skill-2',
      skill_name: 'Panchakarma Therapy',
      evidence_type: 'Certificate Upload & Logbook',
      evidence_url: 'https://ayush-kaushalsetu.gov.in/certs/panchakarma-aiia-2025.pdf',
      status: 'Verified',
      verified_by: 'usr-institution-1',
      confidence_score: 96,
      submitted_at: '2026-01-15'
    },
    {
      id: 'claim-102',
      student_id: 'usr-student-1',
      skill_id: 'skill-1',
      skill_name: 'Ayurvedic Formulation',
      evidence_type: 'Institutional Course Certificate',
      evidence_url: 'https://ayush-kaushalsetu.gov.in/certs/formulation-cert.pdf',
      status: 'Verified',
      verified_by: 'usr-institution-1',
      confidence_score: 92,
      submitted_at: '2026-02-10'
    },
    {
      id: 'claim-103',
      student_id: 'usr-student-1',
      skill_id: 'skill-3',
      skill_name: 'Herbal Quality Control (HPLC/HPTLC)',
      evidence_type: 'Project Certificate',
      evidence_url: 'https://github.com/aarav-ayush/hplc-phytochem-study',
      status: 'Pending Institution Confirmation',
      verified_by: null,
      confidence_score: 85,
      submitted_at: '2026-08-20'
    },
    {
      id: 'claim-104',
      student_id: 'usr-student-2',
      skill_id: 'skill-3',
      skill_name: 'Herbal Quality Control (HPLC/HPTLC)',
      evidence_type: 'Online Certification',
      evidence_url: 'https://swayam-ayush.in/verify/CERT-98214',
      status: 'Verified',
      verified_by: 'usr-platform-1',
      confidence_score: 99,
      submitted_at: '2026-03-01'
    },
    {
      id: 'claim-105',
      student_id: 'usr-student-2',
      skill_id: 'skill-9',
      skill_name: 'Good Manufacturing Practices (GMP - AYUSH)',
      evidence_type: 'Self-Reported Certificate',
      evidence_url: 'https://drive.google.com/file/d/sample-gmp.pdf',
      status: 'Self-Reported (unverified)',
      verified_by: null,
      confidence_score: 55,
      submitted_at: '2026-08-25'
    }
  ];

  // 5. Job Postings
  db.jobPostings = [
    {
      id: 'job-1',
      company_id: 'usr-company-1',
      company_name: 'Dabur India AYUSH R&D',
      company_logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
      title: 'Herbal Quality Control & Standardization Analyst',
      location: 'Ghaziabad, UP (Hybrid)',
      type: 'Full-time / Internship',
      stipend_salary: '₹4,50,000 - ₹6,00,000 / year',
      description: 'Looking for a skilled AYUSH pharma graduate to conduct HPLC/HPTLC testing, herbal raw material validation, and GMP compliance documentation.',
      required_skills: [
        { skill_id: 'skill-3', skill_name: 'Herbal Quality Control (HPLC/HPTLC)', weight: 2.0, must_have: true },
        { skill_id: 'skill-1', skill_name: 'Ayurvedic Formulation', weight: 1.5, must_have: true },
        { skill_id: 'skill-9', skill_name: 'Good Manufacturing Practices (GMP - AYUSH)', weight: 1.0, must_have: false },
        { skill_id: 'skill-5', skill_name: 'Medicinal Plant Extraction', weight: 1.0, must_have: false }
      ],
      filters: {
        min_experience_years: 0.5,
        degree_required: 'BAMS (Bachelor of Ayurvedic Medicine & Surgery)',
        max_age: 28
      },
      posted_at: '2026-08-15',
      status: 'Active'
    },
    {
      id: 'job-2',
      company_id: 'usr-company-2',
      company_name: 'Kottakkal Arya Vaidya Sala',
      company_logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150',
      title: 'Clinical Supervisor & Panchakarma Specialist',
      location: 'Kottakkal, Kerala',
      type: 'Full-time',
      stipend_salary: '₹6,50,000 - ₹8,50,000 / year',
      description: 'Lead clinical Panchakarma operations, direct patient therapies, and manage digital health integration using ABDM protocols.',
      required_skills: [
        { skill_id: 'skill-2', skill_name: 'Panchakarma Therapy', weight: 2.0, must_have: true },
        { skill_id: 'skill-10', skill_name: 'Patient Consultation & Pulse Diagnosis', weight: 1.5, must_have: true },
        { skill_id: 'skill-8', skill_name: 'ABDM Digital Health Integration', weight: 1.0, must_have: false },
        { skill_id: 'skill-4', skill_name: 'Wellness Tourism Protocols', weight: 1.0, must_have: false }
      ],
      filters: {
        min_experience_years: 1,
        degree_required: 'BAMS (Bachelor of Ayurvedic Medicine & Surgery)',
        max_age: 32
      },
      posted_at: '2026-08-22',
      status: 'Active'
    }
  ];

  // 6. Courses (Academic & Third-Party)
  db.courses = [
    {
      id: 'course-101',
      provider_id: 'usr-institution-1',
      provider_name: 'All India Institute of Ayurveda (AIIA)',
      title: 'Advanced HPLC & Phytochemical Quality Control Certification',
      description: 'Hands-on laboratory training on standardization of Ayurvedic botanicals, heavy metal testing, and high-performance liquid chromatography.',
      skills_taught: ['skill-3', 'skill-5', 'skill-9'],
      format: 'Hybrid (Online + 3 Days Lab)',
      duration: '6 Weeks',
      enroll_url: 'https://aiia.gov.in/courses/hplc-qc-2026',
      rating: 4.9
    },
    {
      id: 'course-102',
      provider_id: 'usr-platform-1',
      provider_name: 'Swayam AYUSH Skill Academy',
      title: 'ABDM Digital Health Standards for AYUSH Practitioners',
      description: 'Master Ayush Grid integration, electronic health records (EHR), and patient data security compliant with DPDP Act 2023.',
      skills_taught: ['skill-8'],
      format: '100% Online (Self-Paced)',
      duration: '3 Weeks',
      enroll_url: 'https://swayam-ayush.in/abdm-digital-health',
      rating: 4.7
    },
    {
      id: 'course-103',
      provider_id: 'usr-platform-1',
      provider_name: 'Swayam AYUSH Skill Academy',
      title: 'AYUSH GMP & International Regulatory Compliance',
      description: 'Comprehensive guide to Schedule T GMP compliance, WHO herbal safety guidelines, and export certification.',
      skills_taught: ['skill-9', 'skill-7'],
      format: 'Online Video Lectures & Case Studies',
      duration: '4 Weeks',
      enroll_url: 'https://swayam-ayush.in/gmp-compliance',
      rating: 4.8
    }
  ];

  // 7. Applications
  db.applications = [
    {
      id: 'app-1',
      job_id: 'job-1',
      student_id: 'usr-student-1',
      student_name: 'Aarav Sharma',
      company_id: 'usr-company-1',
      status: 'Shortlisted',
      compatibility_score: 82,
      applied_at: '2026-08-20',
      score_breakdown: {
        met_must_have: ['Ayurvedic Formulation'],
        missed_must_have: ['Herbal Quality Control (HPLC/HPTLC)'],
        met_nice_to_have: ['Patient Consultation'],
        missed_nice_to_have: ['Good Manufacturing Practices (GMP - AYUSH)']
      }
    }
  ];

  // 8. Verification Requests Queue (for Institutions & Platforms)
  db.verificationRequests = [
    {
      id: 'ver-req-1',
      claim_id: 'claim-103',
      student_id: 'usr-student-1',
      student_name: 'Aarav Sharma',
      skill_id: 'skill-3',
      skill_name: 'Herbal Quality Control (HPLC/HPTLC)',
      issuing_institution_id: 'usr-institution-1',
      issuing_institution_name: 'All India Institute of Ayurveda (AIIA)',
      evidence_type: 'Project Certificate',
      evidence_url: 'https://github.com/aarav-ayush/hplc-phytochem-study',
      ocr_confidence: 85,
      ocr_extracted_details: 'Extracted Student: Aarav Sharma | Credential ID: HPLC-AIIA-8812 | Match Confidence: 85%',
      status: 'Pending',
      requested_at: '2026-08-20'
    }
  ];

  // 9. Faculty Opportunities (FDP, Research, Consultancy)
  db.facultyOpportunities = [
    {
      id: 'fac-1',
      institution_id: 'usr-institution-1',
      title: 'Faculty Development Program (FDP): AI Applications in Pharmacognosy',
      type: 'FDP',
      duration: '1 Week',
      stipend_grant: '₹25,000 Grant',
      description: 'National faculty training program on integrating computer vision and machine learning for herbal raw material identification.',
      deadline: '2026-09-30'
    },
    {
      id: 'fac-2',
      institution_id: 'usr-company-1',
      title: 'Industry-Academia Consultancy: Standardizing Polyherbal Anti-Diabetic Formulations',
      type: 'Research Consultancy',
      duration: '6 Months',
      stipend_grant: '₹5,00,000 Consultancy Budget',
      description: 'Dabur India R&D invites senior AYUSH pharmacology faculty for joint clinical trial design and HPLC assay validation.',
      deadline: '2026-10-15'
    }
  ];

  // 10. Outcomes (Feedback loop data)
  db.outcomes = [
    {
      id: 'out-1',
      type: 'course_completion',
      user_id: 'usr-student-1',
      course_id: 'course-101',
      result: 'completed',
      timestamp: '2026-07-15'
    },
    {
      id: 'out-2',
      type: 'job_hiring',
      application_id: 'app-1',
      result: 'shortlisted',
      timestamp: '2026-08-25'
    }
  ];

  console.log('AYUSH KaushalSetu database successfully seeded with initial AYUSH & Tech data!');
}

seedDatabase();

module.exports = seedDatabase;
