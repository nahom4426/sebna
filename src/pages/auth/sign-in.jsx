import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login, forgotPassword, resetPassword, verifyResetCode } from '@/pages/admin/api/LoginApi';
import { toasted } from '@/utils/toast';
import logo from '@/assets/logo.svg';
import { FiMail, FiLock, FiSmartphone, FiArrowRight, FiArrowLeft, FiX, FiEye, FiEyeOff } from 'react-icons/fi';

// Custom Input Component
const InputField = ({ icon: Icon, type, placeholder, value, onChange, className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  
  return (
    <div className={`relative mb-6 ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 transition-colors duration-300" />
      </div>
      <input
        type={isPassword && showPassword ? 'text' : type}
        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm transition-all duration-300"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
};

// OTP Input Component
const OtpInput = ({ value, onChange, disabled = false }) => {
  const handleChange = (e, index) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...value];
    newOtp[index] = newValue;
    onChange(newOtp);
    
    if (newValue && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="flex space-x-4 justify-center">
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[index] && index > 0) {
              document.getElementById(`otp-${index - 1}`)?.focus();
            }
          }}
          className="w-16 h-16 text-center text-2xl font-bold bg-white/90 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-300"
          disabled={disabled}
        />
      ))}
    </div>
  );
};

// Glass Card Component
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl ${className}`}>
    {children}
  </div>
);

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginReqPending, setLoginReqPending] = useState(false);
  
  // Verification modal state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '']);
  const [pendingLoginData, setPendingLoginData] = useState(null);
  const [verifyReqPending, setVerifyReqPending] = useState(false);
  
  // Forgot password modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtpInputs, setForgotOtpInputs] = useState(['', '', '', '']);
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotReqPending, setForgotReqPending] = useState(false);
  
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const userDetail = localStorage.getItem('userDetail');
    if (userDetail) {
      const redirectPath = location.state?.from?.pathname || '/dashboard/home';
      navigate(redirectPath);
    }
  }, [navigate, location]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginReqPending) return;
    
    setLoginReqPending(true);
    
    try {
      const response = await login({ email, password });
      
      if (response.success) {
        localStorage.setItem('userDetail', JSON.stringify(response.data));
        const redirectPath = location.state?.from?.pathname || '/dashboard/home';
        navigate(redirectPath);
      } else {
        const errorMsg = response?.error?.toLowerCase?.() || '';
        if (response.status === 404 && errorMsg.includes('not active')) {
          setPendingLoginData({ email, password });
          setShowVerificationModal(true);
          toasted(false, '', 'Account verification required');
          return;
        }
        toasted(false, 'Login failed', response.error || response.message || 'Something went wrong');
      }
    } catch (err) {
      toasted(false, 'Login failed', 'Something went wrong');
    } finally {
      setLoginReqPending(false);
    }
  };

  // Verification modal handlers
  const sendVerification = async () => {
    setVerifyReqPending(true);
    
    try {
      // TODO: Replace with actual API call
      toasted(true, 'Verification code sent successfully');
    } catch (err) {
      toasted(false, 'Send Code Failed', 'Verification failed');
    } finally {
      setVerifyReqPending(false);
    }
  };

  const submitVerification = async () => {
    if (!verificationCode.trim() || !phoneNumber.trim()) {
      toasted(false, '', 'Please enter both phone number and verification code');
      return;
    }
    
    setVerifyReqPending(true);
    
    try {
      // TODO: Replace with actual API call
      toasted(true, 'Account verified successfully');
      closeVerificationModal();
      if (pendingLoginData) {
        handleLogin({ preventDefault: () => {} });
      }
    } catch (err) {
      toasted(false, '', 'Verification failed');
    } finally {
      setVerifyReqPending(false);
    }
  };

  const closeVerificationModal = () => {
    setShowVerificationModal(false);
    setPhoneNumber('');
    setVerificationCode('');
    setOtpInputs(['', '', '', '']);
    setPendingLoginData(null);
  };

  // Forgot password modal handlers
  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
    setForgotStep(1);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPhone('');
    setForgotOtp('');
    setForgotOtpInputs(['', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setForgotStep(1);
  };

  const sendForgotPassword = async () => {
    setForgotReqPending(true);
    
    try {
      const response = await forgotPassword(forgotPhone);
      
      if (response.success) {
        toasted(true, 'OTP sent successfully');
        setForgotStep(2);
      } else {
        const msg = response.message || response.error || '';
        
        if (msg.toLowerCase().includes('otp has already been sent')) {
          toasted(true, 'OTP already sent. Please enter the last received OTP');
          setForgotStep(2);
        } else {
          toasted(false, '', msg || 'Failed to send OTP');
        }
      }
    } catch (err) {
      toasted(false, '', 'Failed to send OTP');
    } finally {
      setForgotReqPending(false);
    }
  };

  const verifyForgotOtp = async () => {
    setForgotReqPending(true);
    
    try {
      // TODO: Replace with actual API call
      toasted(true, 'OTP verified');
      setForgotStep(3);
    } catch (err) {
      toasted(false, '', 'Invalid OTP');
    } finally {
      setForgotReqPending(false);
    }
  };

  const submitResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toasted(false, '', 'Passwords do not match');
      return;
    }
    
    setForgotReqPending(true);
    
    try {
      const data = {
        passwordResetOtp: forgotOtp,
        userName: forgotPhone,
        confirmPassword: confirmPassword,
        newPassword: newPassword,
      };
      
      const response = await resetPassword(data);
      
      if (response.success) {
        toasted(true, 'Password reset successfully');
        closeForgotPasswordModal();
      } else {
        toasted(false, '', response.error || 'Reset failed');
      }
    } catch (err) {
      toasted(false, '', 'Reset failed');
    } finally {
      setForgotReqPending(false);
    }
  };

  const focusNext = (index) => {
    const newOtpInputs = [...otpInputs];
    if (newOtpInputs[index].length === 1 && index < 3) {
      const inputs = document.querySelectorAll('input[type="text"]');
      const next = inputs[index + 1];
      next?.focus();
    }
    setVerificationCode(newOtpInputs.join(''));
  };

  const focusNextForgotOtp = (index) => {
    const newOtpInputs = [...forgotOtpInputs];
    if (newOtpInputs[index].length === 1 && index < 3) {
      const inputs = document.querySelectorAll('input[type="text"]');
      const next = inputs[index + 1];
      next?.focus();
    }
    setForgotOtp(newOtpInputs.join(''));
  };

  const goToSignup = () => {
    navigate('/signUp');
  };

  const handleBack = () => {
    navigate('/');
  };

  // Floating particles for background
  const Particle = ({ delay, duration, left, size }) => (
    <motion.div
      className="absolute rounded-full bg-white/10"
      style={{
        left: `${left}%`,
        width: size,
        height: size,
      }}
      animate={{
        y: ['0%', '100%'],
        opacity: [0, 0.5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    />
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle
            key={i}
            delay={Math.random() * 5}
            duration={15 + Math.random() * 10}
            left={Math.random() * 100}
            size={2 + Math.random() * 4}
          />
        ))}
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      {/* Back Button */}
      <motion.button 
        onClick={handleBack}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20 flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
        <span className="font-medium text-sm sm:text-base">Back to Home</span>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md mx-auto"
      >
        <GlassCard className="p-8 sm:p-10">
          {/* Logo Section */}
          <motion.div 
            className="flex flex-col items-center mb-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-12 sm:h-16 w-auto filter brightness-0 invert" 
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.form 
            onSubmit={handleLogin} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email or Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className={`h-5 w-5 transition-colors duration-300 ${isFocused.email ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(prev => ({ ...prev, email: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, email: false }))}
                  placeholder="Enter your email or phone"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm transition-all duration-300 group-hover:border-blue-300"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={openForgotPasswordModal}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className={`h-5 w-5 transition-colors duration-300 ${isFocused.password ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm transition-all duration-300 group-hover:border-blue-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-3 text-sm text-gray-600 cursor-pointer">
                Keep me logged in
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={loginReqPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loginReqPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Sign In</span>
                  <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="mx-4 text-sm text-gray-400">or continue with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Login (Optional) */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
              <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
              <svg className="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>

          {/* Signup Link */}
          <motion.div 
            className="text-center pt-4 border-t border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-600">
              Don't have an account?
              <button
                onClick={goToSignup}
                className="ml-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
              >
                Sign up now
              </button>
            </p>
          </motion.div>
        </GlassCard>
      </motion.div>

      {/* Modern Account Verification Modal */}
      <AnimatePresence>
        {showVerificationModal && (
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Verify Your Account</h3>
                    <p className="text-gray-500 text-sm mt-1">We've sent a code to your phone</p>
                  </div>
                  <button
                    onClick={closeVerificationModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="flex-1 py-3 px-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
                      />
                      <button
                        onClick={sendVerification}
                        disabled={!phoneNumber.trim() || verifyReqPending}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verifyReqPending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                      Enter Verification Code
                    </label>
                    <OtpInput 
                      value={otpInputs}
                      onChange={setOtpInputs}
                      disabled={verifyReqPending}
                    />
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Didn't receive code? 
                      <button className="ml-2 text-blue-600 hover:text-blue-800 font-medium">
                        Resend
                      </button>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={closeVerificationModal}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitVerification}
                      disabled={otpInputs.join('').length < 4 || verifyReqPending}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifyReqPending ? 'Verifying...' : 'Verify Account'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Reset Password</h3>
                    <div className="flex items-center mt-2">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${forgotStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            {step}
                          </div>
                          {step < 3 && (
                            <div className={`w-12 h-1 mx-2 ${forgotStep > step ? 'bg-blue-500' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={closeForgotPasswordModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Step 1: Phone */}
                {forgotStep === 1 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="text-center p-4 bg-blue-50 rounded-2xl">
                      <FiSmartphone className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-700">Enter your phone number</h4>
                      <p className="text-sm text-gray-500 mt-1">We'll send a verification code</p>
                    </div>
                    <input
                      type="text"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={sendForgotPassword}
                      disabled={!forgotPhone.trim() || forgotReqPending}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {forgotReqPending ? 'Sending OTP...' : 'Send Verification Code'}
                    </button>
                  </motion.div>
                )}

                {/* Step 2: OTP */}
                {forgotStep === 2 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="text-center p-4 bg-blue-50 rounded-2xl">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">OTP</span>
                      </div>
                      <h4 className="font-medium text-gray-700">Enter Verification Code</h4>
                      <p className="text-sm text-gray-500 mt-1">Check your messages</p>
                    </div>
                    <OtpInput 
                      value={forgotOtpInputs}
                      onChange={setForgotOtpInputs}
                      disabled={forgotReqPending}
                    />
                    <button
                      onClick={verifyForgotOtp}
                      disabled={forgotOtpInputs.join('').length < 4 || forgotReqPending}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {forgotReqPending ? 'Verifying...' : 'Verify Code'}
                    </button>
                  </motion.div>
                )}

                {/* Step 3: Reset Password */}
                {forgotStep === 3 && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="text-center p-4 bg-green-50 rounded-2xl">
                      <FiLock className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-700">Create New Password</h4>
                      <p className="text-sm text-gray-500 mt-1">Make it strong and secure</p>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <button
                      onClick={submitResetPassword}
                      disabled={!newPassword.trim() || !confirmPassword.trim() || forgotReqPending}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {forgotReqPending ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Note */}
      <motion.div 
        className="absolute bottom-6 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm text-gray-500">
          By signing in, you agree to our 
          <button className="mx-1 text-blue-600 hover:underline">Terms</button>
          and 
          <button className="mx-1 text-blue-600 hover:underline">Privacy Policy</button>
        </p>
      </motion.div>
    </div>
  );
};

export { SignIn };
export default SignIn;