const db = require('../db/store');

/**
 * Normalizes free text input to find matching skills from the shared taxonomy
 */
function normalizeAndExtractSkills(text) {
  if (!text) return [];
  const textLower = text.toLowerCase();
  const matchedSkills = [];

  for (const skill of db.skills) {
    const nameMatch = textLower.includes(skill.name.toLowerCase());
    const aliasMatch = skill.aliases && skill.aliases.some(alias => textLower.includes(alias.toLowerCase()));
    
    if (nameMatch || aliasMatch) {
      if (!matchedSkills.some(s => s.id === skill.id)) {
        matchedSkills.push(skill);
      }
    }
  }

  return matchedSkills;
}

/**
 * Calculates Explainable Compatibility Score between a Student and a Job Posting
 */
function calculateJobCompatibility(studentProfile, jobPosting) {
  const studentClaims = db.skillClaims.filter(c => c.student_id === studentProfile.student_id);
  const claimMap = new Map();

  studentClaims.forEach(claim => {
    // Weight multiplier based on verification status
    let weight = 0.3; // Default self-reported
    if (claim.status === 'Verified') weight = 1.0;
    else if (claim.status === 'Pending Institution Confirmation') weight = 0.6;
    else if (claim.status === 'Flagged') weight = 0.0;

    claimMap.set(claim.skill_id, {
      status: claim.status,
      confidence_score: claim.confidence_score || 80,
      weight
    });
  });

  const requiredSkills = jobPosting.required_skills || [];
  let totalWeightPossible = 0;
  let achievedWeight = 0;

  const metMustHave = [];
  const missedMustHave = [];
  const metNiceToHave = [];
  const missedNiceToHave = [];

  requiredSkills.forEach(req => {
    const skillObj = db.skills.find(s => s.id === req.skill_id) || { name: req.skill_name || req.skill_id };
    const skillWeight = req.must_have ? 2.0 : 1.0;
    totalWeightPossible += skillWeight;

    const claim = claimMap.get(req.skill_id);
    if (claim && claim.status !== 'Flagged') {
      const earned = skillWeight * claim.weight;
      achievedWeight += earned;

      const item = {
        skill_id: req.skill_id,
        skill_name: skillObj.name,
        verification_status: claim.status,
        earned_weight: Math.round(earned * 100) / 100
      };

      if (req.must_have) metMustHave.push(item);
      else metNiceToHave.push(item);
    } else {
      const item = {
        skill_id: req.skill_id,
        skill_name: skillObj.name,
        verification_status: claim ? claim.status : 'Not Possessed'
      };

      if (req.must_have) missedMustHave.push(item);
      else missedNiceToHave.push(item);
    }
  });

  // Filter checks (Experience, Qualification, Location)
  const filters = jobPosting.filters || {};
  const filterResults = {
    experience_met: true,
    qualification_met: true,
    location_met: true
  };

  if (filters.min_experience_years && (studentProfile.experience_years || 0) < filters.min_experience_years) {
    filterResults.experience_met = false;
  }
  if (filters.degree_required && studentProfile.degree !== filters.degree_required) {
    filterResults.qualification_met = false;
  }

  // Calculate percentage
  const rawScore = totalWeightPossible > 0 ? (achievedWeight / totalWeightPossible) * 100 : 0;
  // Apply minor penalty if hard filter missed
  let finalScore = rawScore;
  if (!filterResults.experience_met) finalScore *= 0.85;
  if (!filterResults.qualification_met) finalScore *= 0.90;

  const compatibilityScore = Math.min(100, Math.round(finalScore));

  const explanation = `${metMustHave.length}/${metMustHave.length + missedMustHave.length} Must-Have skills met. ${metNiceToHave.length}/${metNiceToHave.length + missedNiceToHave.length} Nice-to-Have skills met. (${metMustHave.filter(m => m.verification_status === 'Verified').length} skills officially verified).`;

  return {
    compatibility_score: compatibilityScore,
    total_skills_required: requiredSkills.length,
    skills_matched_count: metMustHave.length + metNiceToHave.length,
    met_must_have: metMustHave,
    missed_must_have: missedMustHave,
    met_nice_to_have: metNiceToHave,
    missed_nice_to_have: missedNiceToHave,
    filter_results: filterResults,
    explanation
  };
}

module.exports = {
  normalizeAndExtractSkills,
  calculateJobCompatibility
};
