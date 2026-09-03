# AYUSH-KaushalSetu

> **Smart India Hackathon (SIH) 2026 — Problem Statement SIH26044**  
> **Portal for Academia–Industry Collaboration for Skill Mapping, Internships and Placement (Ministry of AYUSH)**

AYUSH KaushalSetu is an AI-driven, multi-portal digital bridge built to seamlessly connect **Students (BAMS/AYUSH Candidates)**, **AYUSH Industry Employers (Dabur, Himalaya, Baidyanath, Kottakkal)**, **Academic Institutions (AIIA, BHU, NIA, GAU)**, and **Third-Party Skill Platforms (Swayam, Skill India Digital Hub)**.

---

## 🌟 Key Platform Features

1. **Multi-Portal Role-Based Access Control**:
   - **Student Portal**: AI job fit compatibility matching, OCR certificate skill claim submission, skill-gap recommender, application tracker.
   - **Industry / Company Portal**: Job/internship opportunity poster with dedicated skill requirements (Must-Have vs. Nice-to-Have weights), AI explainable candidate ranking, 4-stage shortlisting tracker.
   - **Academic Institution Portal**: Student skill claim verification engine, curriculum skill alignment insights, NIRF ranking showcase.
   - **Skill Platform Portal**: Accredited course integration, digital badge issuance.

2. **AI-Powered Explainable Candidate Fit Matching**:
   - Computes weighted skill compatibility scores (0-100%) against central versioned AYUSH skill taxonomy (`v1.0`).
   - Surfaces transparent criteria explaining why a candidate is ranked #1.

3. **Live API Integrations**:
   - **MongoDB Atlas Cloud Database**: Dynamic document storage for users, skill taxonomy, OCR extractions, and job postings.
   - **Brevo (Sendinblue) Transactional Email API**: Real-time 6-digit OTP verification and password reset emails dispatched directly to user inboxes.
   - **Cloudinary CDN SDK**: High-speed document CDN for uploaded certificate PDFs, ID cards, and user avatars.

4. **Security & Validation**:
   - Enforces strict password complexity rules (1+ Uppercase, 4+ Lowercase, 3+ Numbers, 1+ Special Character).
   - Real-time ID and document verification engine for national student, company (COI/GST), and university statutory recognition numbers.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js, Mongoose (MongoDB ODM)
- **Database**: MongoDB Atlas Cloud Cluster
- **Integrations**: Brevo Transactional Email REST API, Cloudinary SDK
- **Authentication**: Email OTP, Role-Based JWT Auth, Strict Password Pattern Enforcer

---

## 💻 Quick Start & Installation

### 1. Clone Repository
```bash
git clone https://github.com/Ayush-satdeve-2004/Ayush-KaushalSetu.git
cd Ayush-KaushalSetu
```

### 2. Backend Setup
```bash
cd backend
npm install
node src/server.js
```
*Backend runs on `http://localhost:5001`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 📜 License
Developed for Smart India Hackathon (SIH 2026) under Ministry of AYUSH Problem Statement SIH26044.
