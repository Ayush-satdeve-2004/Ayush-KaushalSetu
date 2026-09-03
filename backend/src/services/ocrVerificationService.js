const db = require('../db/store');

/**
 * Simulates AI OCR extraction & authenticity analysis on an uploaded certificate document
 */
function processCertificateOCR(fileBuffer, metadata) {
  const { student_name, skill_id, issuing_institution_id, certificate_number } = metadata;

  const targetSkill = db.skills.find(s => s.id === skill_id);
  const skillName = targetSkill ? targetSkill.name : skill_id;

  const targetInst = db.users.find(u => u.id === issuing_institution_id || u.institution_id === issuing_institution_id);
  const instName = targetInst ? targetInst.name : 'Recognized AYUSH Board / Institution';

  // Check if institution offers a course matching this skill
  const matchingCourse = db.courses.find(c => 
    (c.provider_id === issuing_institution_id || c.provider_name === instName) &&
    c.skills_taught && c.skills_taught.includes(skill_id)
  );

  let confidenceScore = 92;
  let status = 'Pending Institution Confirmation';
  let reasoning = [];

  if (certificate_number && certificate_number.startsWith('AYUSH-VERIFIED')) {
    confidenceScore = 98;
    status = 'Verified';
    reasoning.push('Valid security QR/Digital Hash detected in certificate header.');
    reasoning.push(`Extracted skill matches registered course: ${skillName}`);
  } else if (matchingCourse) {
    confidenceScore = 88;
    reasoning.push(`Extracted skill "${skillName}" matches active course offering at ${instName}.`);
    reasoning.push(`Student name "${student_name}" matched with high optical confidence (94%).`);
  } else {
    confidenceScore = 65;
    reasoning.push(`Certificate text extracted successfully for "${skillName}".`);
    reasoning.push(`Routing to ${instName} manual verification queue for final validation.`);
  }

  const ocrExtractedData = {
    extracted_student_name: student_name,
    extracted_skill: skillName,
    extracted_issuer: instName,
    extracted_date: new Date().toISOString().split('T')[0],
    credential_id: certificate_number || `CERT-${Math.floor(100000 + Math.random() * 900000)}`
  };

  return {
    status,
    confidence_score: confidenceScore,
    ocr_data: ocrExtractedData,
    reasoning,
    auto_verified: status === 'Verified'
  };
}

module.exports = {
  processCertificateOCR
};
