const db = require('../db/store');
const { calculateJobCompatibility } = require('./aiMatchingEngine');

/**
 * Computes skill gap for a student against a target job posting and surfaces course recommendations
 */
function getSkillGapAndRecommendations(studentId, jobPostingId) {
  const studentProfile = db.studentProfiles.find(s => s.student_id === studentId);
  const jobPosting = db.jobPostings.find(j => j.id === jobPostingId);

  if (!studentProfile || !jobPosting) {
    return { error: 'Student profile or job posting not found' };
  }

  const matchAnalysis = calculateJobCompatibility(studentProfile, jobPosting);
  
  // Missing skills list
  const missingSkillIds = [
    ...matchAnalysis.missed_must_have.map(s => s.skill_id),
    ...matchAnalysis.missed_nice_to_have.map(s => s.skill_id)
  ];

  // Surface course recommendations that teach missing skills
  const recommendedCourses = [];

  missingSkillIds.forEach(skillId => {
    const skillObj = db.skills.find(s => s.id === skillId) || { name: skillId };
    
    // Find matching courses in system (from Academic Institutions or Third-Party Platforms)
    const matchingCourses = db.courses.filter(c => c.skills_taught && c.skills_taught.includes(skillId));

    matchingCourses.forEach(course => {
      const provider = db.users.find(u => u.id === course.provider_id) || { name: course.provider_name || 'AYUSH Learning Platform', role: 'institution' };
      
      recommendedCourses.push({
        course_id: course.id,
        title: course.title,
        provider_name: provider.name,
        provider_type: provider.role === 'platform' ? 'Third-Party Skill Platform' : 'Academic Institution',
        target_skill_id: skillId,
        target_skill_name: skillObj.name,
        duration: course.duration || '4 Weeks',
        format: course.format || 'Online / Hybrid',
        enroll_url: course.enroll_url || `https://ayush-kaushalsetu.gov.in/courses/${course.id}`,
        rating: course.rating || 4.8
      });
    });
  });

  return {
    student_id: studentId,
    job_posting_id: jobPostingId,
    job_title: jobPosting.title,
    company_name: jobPosting.company_name,
    current_compatibility: matchAnalysis.compatibility_score,
    missing_skills: missingSkillIds.map(id => {
      const s = db.skills.find(sk => sk.id === id);
      const isMustHave = matchAnalysis.missed_must_have.some(m => m.skill_id === id);
      return {
        skill_id: id,
        skill_name: s ? s.name : id,
        category: s ? s.category : 'General',
        importance: isMustHave ? 'Must-Have' : 'Nice-to-Have'
      };
    }),
    recommended_courses: recommendedCourses
  };
}

module.exports = {
  getSkillGapAndRecommendations
};
