import React, { useState, useRef } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Mail, Lock, User, Phone, Upload, ArrowRight, Sparkles, Building2, GraduationCap, Award, Settings, AlertCircle, Eye, EyeOff, FileText, Check, KeyRound } from 'lucide-react';
import { API_BASE } from '../config';

// Helper function to validate password format rules
function validatePasswordCriteria(pwd) {
  if (!pwd) return { valid: false, missing: ['Password required'] };

  const uppercaseMatches = (pwd.match(/[A-Z]/g) || []).length;
  const lowercaseMatches = (pwd.match(/[a-z]/g) || []).length;
  const numberMatches = (pwd.match(/[0-9]/g) || []).length;
  const specialMatches = (pwd.match(/[^A-Za-z0-9]/g) || []).length;

  const missing = [];
  if (uppercaseMatches < 1) missing.push('at least 1 Uppercase character (A-Z)');
  if (lowercaseMatches < 4) missing.push('at least 4 Lowercase characters (a-z)');
  if (numberMatches < 3) missing.push('at least 3 Numbers (0-9)');
  if (specialMatches < 1) missing.push('at least 1 Special character (!@#$%...)');

  return {
    valid: missing.length === 0,
    uppercaseCount: uppercaseMatches,
    lowercaseCount: lowercaseMatches,
    numberCount: numberMatches,
    specialCount: specialMatches,
    missing
  };
}

export default function AuthModal({ isOpen, initialMode = 'login', onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Eye Icon Password Visibility Toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('aarav.sharma@student.aiia.ac.in');
  const [loginPassword, setLoginPassword] = useState('Pass1234!');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form State (Role-First Layout)
  const [selectedRole, setSelectedRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [platformName, setPlatformName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReNewPassword, setShowReNewPassword] = useState(false);

  // File Upload State & Ref
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Email OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);

  // Document Verification State
  const [docVerificationState, setDocVerificationState] = useState(null);

  if (!isOpen) return null;

  const pwdCriteria = validatePasswordCriteria(password);
  const newPwdCriteria = validatePasswordCriteria(newPassword);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      alert('Please enter your email address first.');
      return;
    }
    setSendingOtp(true);
    setOtpError('');
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const json = await res.json();
      if (json.success) {
        setOtpSent(true);
        setOtpInput('');
      } else {
        alert(json.message || 'Failed to send OTP email.');
      }
    } catch (e) {
      console.error(e);
      alert('Server communication error.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpInput })
      });
      const json = await res.json();
      if (json.success && json.verified) {
        setEmailVerified(true);
        setOtpError('');
      } else {
        setOtpError('Invalid OTP entered');
      }
    } catch (e) {
      setOtpError('Verification failed');
    }
  };

  const handleVerifyDocument = async () => {
    if (!documentNumber) {
      alert('Please enter your Certificate or ID Number.');
      return;
    }
    setDocVerificationState('verifying');
    try {
      const res = await fetch(`${API_BASE}/auth/verify-id-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          document_number: documentNumber
        })
      });
      const json = await res.json();
      setDocVerificationState(json);
    } catch (e) {
      setDocVerificationState({ valid: false, message: 'Verification API Error' });
    }
  };

  const getRoleDocLabel = () => {
    switch (selectedRole) {
      case 'student': return 'Student ID / Enrolment Registration Number';
      case 'company': return 'Company Incorporation (COI) / GST Registration Number';
      case 'institution': return 'UGC / Statutory Recognition Affiliation Number';
      case 'platform': return 'NSDC / SSC / SIDH Unique Partner ID';
      default: return 'Certificate / Verification ID';
    }
  };

  const getPrimaryNameLabel = () => {
    switch (selectedRole) {
      case 'company': return 'Company / Enterprise Name';
      case 'institution': return 'University / Academic Institution Name';
      case 'platform': return 'Platform / Academy Organization Name';
      default: return 'Student Full Name';
    }
  };

  const getEmailLabel = () => {
    switch (selectedRole) {
      case 'company': return 'Corporate / Official HR Email';
      case 'institution': return 'Institutional Email (.ac.in / .edu.in / .gov.in)';
      case 'platform': return 'Platform Official Email';
      default: return 'Student Email Address';
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    const checkPwd = validatePasswordCriteria(password);
    if (!checkPwd.valid) {
      setRegisterError(`Invalid Password Format: Must contain ${checkPwd.missing.join(', ')}.`);
      return;
    }

    if (password !== rePassword) {
      setRegisterError('Passwords do not match.');
      return;
    }

    const registrationName = selectedRole === 'company' ? companyName
      : selectedRole === 'institution' ? institutionName
      : selectedRole === 'platform' ? platformName
      : fullName;

    setRegisterLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registrationName || fullName,
          email,
          phone,
          role: selectedRole,
          document_number: documentNumber,
          file_attached: selectedFile ? selectedFile.name : null,
          password
        })
      });
      const json = await res.json();
      if (json.success) {
        alert(`Registration Successful! Welcome ${json.user.name}.`);
        onLoginSuccess(json.user);
        onClose();
      } else {
        setRegisterError(json.message || 'Registration failed.');
      }
    } catch (e) {
      setRegisterError('Server communication error.');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const json = await res.json();

      if (json.success && json.user) {
        onLoginSuccess(json.user);
        onClose();
      } else {
        setLoginError(json.message || 'Invalid login credentials.');
      }
    } catch (e) {
      setLoginError('Could not connect to server.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    if (!forgotEmail) {
      setForgotError('Please enter your email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const json = await res.json();
      if (json.success) {
        setForgotSuccess(`Reset code sent to ${forgotEmail}. Please check your email inbox!`);
        setForgotStep(2);
      } else {
        setForgotError(json.message || 'Failed to send reset email.');
      }
    } catch (e) {
      setForgotError('Server communication error.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const checkPwd = validatePasswordCriteria(newPassword);
    if (!checkPwd.valid) {
      setForgotError(`Invalid Password Format: Must contain ${checkPwd.missing.join(', ')}.`);
      return;
    }

    if (newPassword !== reNewPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          reset_code: resetCode,
          new_password: newPassword
        })
      });
      const json = await res.json();
      if (json.success) {
        alert('Password reset successfully! You can now sign in with your new password.');
        setMode('login');
        setLoginEmail(forgotEmail);
        setLoginPassword(newPassword);
      } else {
        setForgotError(json.message || 'Failed to reset password.');
      }
    } catch (e) {
      setForgotError('Server communication error.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 my-4 relative flex flex-col max-h-[90vh]">
        {/* Sticky Header with Permanent Cut Close Button */}
        <div className="sticky top-0 z-30 gradient-ayush p-4 px-6 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 font-black text-xl flex items-center justify-center shadow">
              KS
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">
                {mode === 'forgot' ? 'Reset Password' : mode === 'register' ? 'Register Account' : 'AYUSH KaushalSetu Auth'}
              </h2>
              <p className="text-[11px] text-emerald-100 font-medium">SIH Problem Statement SIH26044</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="bg-white/20 hover:bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-black text-lg shadow-md transition-all shrink-0 hover:scale-110"
            title="Close & Return to Home Page"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center space-x-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotEmail(loginEmail);
                      setForgotStep(1);
                      setForgotError('');
                      setForgotSuccess('');
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 pr-10 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-all shadow flex items-center justify-center space-x-2"
              >
                <span>{loginLoading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Prompt Link to Register */}
              <div className="text-center pt-3 border-t border-slate-100">
                <p className="text-slate-600 font-medium">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setLoginError('');
                      setRegisterError('');
                    }}
                    className="text-emerald-700 hover:underline font-bold"
                  >
                    Register Here
                  </button>
                </p>
              </div>
            </form>
          ) : mode === 'forgot' ? (
            /* FORGOT PASSWORD FORM */
            <div className="space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center space-x-2 text-amber-900">
                <KeyRound className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs">Reset Your Password</h4>
                  <p className="text-[11px]">We will send a 6-digit verification code to your registered email address.</p>
                </div>
              </div>

              {forgotError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center space-x-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center space-x-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleSendResetCode} className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Enter Registered Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder="e.g. aarav.sharma@student.aiia.ac.in"
                        className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 bg-slate-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-all shadow flex items-center justify-center space-x-2"
                  >
                    <span>{forgotLoading ? 'Sending Reset Code...' : 'Send Reset Code to Email'}</span>
                    <Mail className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Enter 6-Digit Reset Code (Check Inbox)</label>
                    <input
                      type="text"
                      required
                      value={resetCode}
                      onChange={e => setResetCode(e.target.value)}
                      placeholder="Enter 6-digit reset code"
                      className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 font-bold tracking-widest text-center"
                      maxLength={6}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new password (e.g. Pass1234!)"
                        className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 pr-10 bg-slate-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                      <p className="font-bold text-slate-600 mb-1">Required Password Format Rules:</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <span className={`flex items-center space-x-1 font-semibold ${newPwdCriteria.uppercaseCount >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
                          <span>{newPwdCriteria.uppercaseCount >= 1 ? '✓' : '○'}</span>
                          <span>At least 1 Uppercase ({newPwdCriteria.uppercaseCount}/1)</span>
                        </span>
                        <span className={`flex items-center space-x-1 font-semibold ${newPwdCriteria.lowercaseCount >= 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
                          <span>{newPwdCriteria.lowercaseCount >= 4 ? '✓' : '○'}</span>
                          <span>At least 4 Lowercase ({newPwdCriteria.lowercaseCount}/4)</span>
                        </span>
                        <span className={`flex items-center space-x-1 font-semibold ${newPwdCriteria.numberCount >= 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
                          <span>{newPwdCriteria.numberCount >= 3 ? '✓' : '○'}</span>
                          <span>At least 3 Numbers ({newPwdCriteria.numberCount}/3)</span>
                        </span>
                        <span className={`flex items-center space-x-1 font-semibold ${newPwdCriteria.specialCount >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
                          <span>{newPwdCriteria.specialCount >= 1 ? '✓' : '○'}</span>
                          <span>At least 1 Special Char ({newPwdCriteria.specialCount}/1)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Re-enter New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showReNewPassword ? "text" : "password"}
                        required
                        value={reNewPassword}
                        onChange={e => setReNewPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 pr-10 bg-slate-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowReNewPassword(!showReNewPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showReNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-all shadow flex items-center justify-center space-x-2"
                  >
                    <span>{forgotLoading ? 'Updating Password...' : 'Reset Password & Sign In'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Remembered your password? <strong className="text-emerald-700">Back to Sign In</strong>
                </button>
              </div>
            </div>
          ) : (
            /* REGISTER FORM (ROLE-FIRST AT THE VERY TOP) */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              {registerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center space-x-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              {/* STEP 1: SELECT USER ROLE AT THE VERY TOP */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl space-y-1">
                <label className="block font-extrabold text-emerald-900 text-xs">
                  Step 1: Select Your User Role Portal
                </label>
                <select
                  value={selectedRole}
                  onChange={e => {
                    setSelectedRole(e.target.value);
                    setDocVerificationState(null);
                  }}
                  className="w-full border border-emerald-300 rounded-xl p-2.5 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                >
                  <option value="student">1. Student (BAMS / AYUSH Candidate)</option>
                  <option value="company">2. Company / AYUSH Industry Partner</option>
                  <option value="institution">3. Academic Institution / University</option>
                  <option value="platform">4. Third-Party Skill Platform</option>
                </select>
              </div>

              {/* STEP 2: ROLE-SPECIFIC CORRESPONDING INFO */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {getPrimaryNameLabel()}
                </label>
                <div className="relative">
                  {selectedRole === 'company' ? <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" /> :
                   selectedRole === 'institution' ? <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" /> :
                   selectedRole === 'platform' ? <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" /> :
                   <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />}
                  <input
                    type="text"
                    required
                    value={selectedRole === 'company' ? companyName : selectedRole === 'institution' ? institutionName : selectedRole === 'platform' ? platformName : fullName}
                    onChange={e => {
                      if (selectedRole === 'company') setCompanyName(e.target.value);
                      else if (selectedRole === 'institution') setInstitutionName(e.target.value);
                      else if (selectedRole === 'platform') setPlatformName(e.target.value);
                      else setFullName(e.target.value);
                    }}
                    placeholder={`Enter ${getPrimaryNameLabel()}`}
                    className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 bg-slate-50"
                  />
                </div>
              </div>

              {/* STEP 3: EMAIL + BREVO OTP VERIFICATION */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{getEmailLabel()}</label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 bg-slate-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={emailVerified || sendingOtp}
                    className={`px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
                      emailVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }`}
                  >
                    {emailVerified ? 'Verified ✓' : sendingOtp ? 'Sending...' : 'Verify'}
                  </button>
                </div>

                {emailVerified && (
                  <div className="mt-1.5 flex items-center space-x-1 font-bold text-emerald-600 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified</span>
                  </div>
                )}

                {otpSent && !emailVerified && (
                  <div className="mt-2 bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-2">
                    <p className="text-[11px] text-emerald-900 font-semibold flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>OTP sent to <strong>{email}</strong>. Please check your email inbox!</span>
                    </p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={otpInput}
                        onChange={e => setOtpInput(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="border border-slate-300 rounded-lg p-2 text-xs w-36 bg-white font-bold tracking-widest text-center"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg font-bold"
                      >
                        Submit OTP
                      </button>
                    </div>
                    {otpError && <p className="text-[11px] text-red-600 font-bold">{otpError}</p>}
                  </div>
                )}
              </div>

              {/* STEP 4: CONTACT PHONE NUMBER */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 bg-slate-50"
                  />
                </div>
              </div>

              {/* STEP 5: ROLE-BASED VERIFICATION ID & DOCUMENT */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Upload & Verify: {getRoleDocLabel()}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={documentNumber}
                      onChange={e => setDocumentNumber(e.target.value)}
                      placeholder={`Enter ${getRoleDocLabel()}`}
                      className="flex-1 border border-slate-300 rounded-xl p-2.5 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyDocument}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl transition-all"
                    >
                      Verify ID
                    </button>
                  </div>
                </div>

                {/* File Upload Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                    selectedFile
                      ? 'border-emerald-500 bg-emerald-50/60'
                      : 'border-slate-300 bg-white hover:border-emerald-500 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                  
                  {selectedFile ? (
                    <div className="flex items-center justify-center space-x-2 text-emerald-800 font-semibold">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-1" />
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <p className="font-semibold text-slate-700">Click to Select & Upload {selectedRole === 'company' ? 'Company License / COI' : selectedRole === 'institution' ? 'UGC Recognition Certificate' : 'Role Certificate File'}</p>
                      <p className="text-[10px] text-slate-400">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </div>

                {/* API Verification Result */}
                {docVerificationState && docVerificationState !== 'verifying' && (
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    docVerificationState.valid
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-red-50 border-red-300 text-red-700'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {docVerificationState.valid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                      <span>
                        {docVerificationState.valid ? 'Verified' : 'Invalid ID / Unrecognized Document'}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${docVerificationState.valid ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'}`}>
                      {docVerificationState.message}
                    </span>
                  </div>
                )}
              </div>

              {/* STEP 6: PASSWORD & RE-ENTER PASSWORD */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="e.g. Pass1234!"
                    className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 pr-10 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                  <p className="font-bold text-slate-600 mb-1">Required Password Format Rules:</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <span className={`flex items-center space-x-1 font-semibold ${pwdCriteria.uppercaseCount >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <span>{pwdCriteria.uppercaseCount >= 1 ? '✓' : '○'}</span>
                      <span>At least 1 Uppercase ({pwdCriteria.uppercaseCount}/1)</span>
                    </span>
                    <span className={`flex items-center space-x-1 font-semibold ${pwdCriteria.lowercaseCount >= 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <span>{pwdCriteria.lowercaseCount >= 4 ? '✓' : '○'}</span>
                      <span>At least 4 Lowercase ({pwdCriteria.lowercaseCount}/4)</span>
                    </span>
                    <span className={`flex items-center space-x-1 font-semibold ${pwdCriteria.numberCount >= 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <span>{pwdCriteria.numberCount >= 3 ? '✓' : '○'}</span>
                      <span>At least 3 Numbers ({pwdCriteria.numberCount}/3)</span>
                    </span>
                    <span className={`flex items-center space-x-1 font-semibold ${pwdCriteria.specialCount >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <span>{pwdCriteria.specialCount >= 1 ? '✓' : '○'}</span>
                      <span>At least 1 Special Char ({pwdCriteria.specialCount}/1)</span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Re-enter Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showRePassword ? "text" : "password"}
                    required
                    value={rePassword}
                    onChange={e => setRePassword(e.target.value)}
                    placeholder="Re-enter Password"
                    className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 pr-10 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRePassword(!showRePassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showRePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-all shadow flex items-center justify-center space-x-2"
              >
                <span>{registerLoading ? 'Submitting Registration...' : 'Submit Registration'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setLoginError('');
                    setRegisterError('');
                  }}
                  className="text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Already have an account? <strong className="text-emerald-700">Sign In</strong>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
