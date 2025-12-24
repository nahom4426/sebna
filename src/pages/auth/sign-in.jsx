import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login, sendResetCode, checkResetCode, resetPassword } from '@/pages/admin/api/LoginApi';
import { toasted } from '@/utils/toast';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultRouteForRole } from '@/utils/rbacUtils';
import logo from '@/assets/logo.svg';
import { 
  FiMail, 
  FiLock, 
  FiSmartphone, 
  FiArrowRight, 
  FiArrowLeft, 
  FiX, 
  FiEye, 
  FiEyeOff,
  FiUser,
  FiCheck,
  FiShield,
  FiKey,
  FiRefreshCw
} from 'react-icons/fi';
import { 
  FcGoogle,
  FcFeedback,
  FcAcceptDatabase,
  FcApproval,
  FcExpired
} from 'react-icons/fc';

// Custom Input Component with enhanced animations
const InputField = ({ icon: Icon, type, placeholder, value, onChange, className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isPassword = type === 'password';
  
  return (
    <motion.div 
      className={`relative mb-6 ${className}`}
      animate={{
        y: isHovered ? -2 : 0,
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className={`h-5 w-5 transition-all duration-300 ${
          isFocused ? 'text-sebna-navy scale-110' : 
          isHovered ? 'text-sebna-orange' : 'text-gray-400'
        }`} />
      </div>
      <motion.input
        type={isPassword && showPassword ? 'text' : type}
        className="w-full pl-12 pr-12 py-4 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sebna-navy/20 focus:border-sebna-navy shadow-sm transition-all duration-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
        animate={{
          boxShadow: isFocused 
            ? '0 10px 25px -5px rgba(0, 23, 75, 0.12), 0 10px 10px -5px rgba(0, 23, 75, 0.05)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderColor: isFocused 
            ? '#00174b' 
            : isHovered 
              ? '#f43b11' 
              : '#e5e7eb'
        }}
      />
      {isPassword && (
        <motion.button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showPassword ? (
            <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          ) : (
            <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

// Enhanced OTP Input Component
const OtpInput = ({ value, onChange, disabled = false, loading = false }) => {
  const handleChange = (e, index) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...value];
    newOtp[index] = newValue;
    onChange(newOtp);
    
    if (newValue && index < value.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="flex space-x-4 justify-center">
      {Array.from({ length: value.length }, (_, index) => index).map((index) => (
        <motion.input
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
          className="w-16 h-16 text-center text-3xl font-bold bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-sebna-navy/30 focus:border-sebna-navy outline-none transition-all duration-300"
          disabled={disabled || loading}
          whileFocus={{ scale: 1.05 }}
          whileHover={{ scale: 1.02 }}
        />
      ))}
    </div>
  );
};

// Glass Card Component with gradient border
const GlassCard = ({ children, className = '', hover = true }) => (
  <motion.div 
    className={`relative bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden ${className}`}
    whileHover={hover ? { scale: 1.01 } : {}}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {/* Gradient border effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-sebna-navy via-sebna-orange to-sebna-navy opacity-10 rounded-3xl" />
    <div className="absolute inset-[1px] bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl rounded-3xl" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthStore((state) => state.auth);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  
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
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpInputs, setForgotOtpInputs] = useState(['', '', '', '', '', '']);
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotReqPending, setForgotReqPending] = useState(false);
  
  // Focus states for animations
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    if (auth?.accessToken) {
      const roleDefault = getDefaultRouteForRole(auth?.user?.roleName);
      const redirectPath = location.state?.from?.pathname || roleDefault;
      navigate(redirectPath, { replace: true });
    }
  }, [auth?.accessToken, navigate, location]);

  // Particle background
  const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-sebna-orange/10 to-sebna-navy/10 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-sebna-navy/25 to-sebna-orange/25"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginReqPending) return;
    
    setLoginReqPending(true);
    
    try {
      const response = await login({ email, password });
      
      if (response.success) {
        const initialShareStats =
          response.data?.shareStats ||
          response.data?.shareStatsDto ||
          response.data?.share_stats ||
          response.data?.shareStatsResponse ||
          null;

        // Set auth in store
        setAuth({
          user: {
            ...response.data,
            ...(initialShareStats ? { shareStats: initialShareStats } : {}),
          },
          accessToken: response.data?.token || response.data?.accessToken,
        });
        localStorage.setItem('userDetail', JSON.stringify(response.data));
        const roleDefault = getDefaultRouteForRole(response.data?.roleName);
        const redirectPath = location.state?.from?.pathname || roleDefault;
        
        // Success animation before navigation
        toasted(true, 'Welcome back!', 'Redirecting to dashboard...');
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1000);
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
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toasted(true, 'Verification code sent successfully');
    } catch (err) {
      toasted(false, 'Send Code Failed', 'Verification failed');
    } finally {
      setVerifyReqPending(false);
    }
  };

  const submitVerification = async () => {
    if (!verificationCode.trim() || !phoneNumber.trim()) {
      toasted(false, '', 'Please enter both email and verification code');
      return;
    }
    
    setVerifyReqPending(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
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
    setForgotEmail('');
    setForgotOtp('');
    setForgotOtpInputs(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setForgotStep(1);
  };

  const sendForgotPassword = async () => {
    setForgotReqPending(true);
    
    try {
      const response = await sendResetCode(forgotEmail);
      
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
      const code = forgotOtpInputs.join('');
      setForgotOtp(code);
      const response = await checkResetCode({
        email: forgotEmail,
        verificationCode: code,
      });

      if (response.success) {
        toasted(true, 'OTP verified');
        setForgotStep(3);
      } else {
        toasted(false, '', response?.error || response?.message || 'Invalid OTP');
      }
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
      const response = await resetPassword({
        email: forgotEmail,
        verificationCode: forgotOtp,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
      
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

  const goToSignup = () => {
    navigate('/signUp');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-br from-gray-50 via-sebna-navy/5 to-sebna-orange/5">
      <ParticleBackground />
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #00174b 1px, transparent 1px),
                           linear-gradient(to bottom, #00174b 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>
      
      {/* Back Button */}
      <motion.button 
        onClick={handleBack}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-gray-600 hover:text-sebna-navy hover:bg-white transition-all group border border-white/40 shadow-lg"
        whileHover={{ x: -4, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FiArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
        <span className="hidden sm:inline font-medium text-sm sm:text-base">Back to Home</span>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="w-full max-w-md mx-auto"
      >
        <GlassCard className="p-8 sm:p-10">
          {/* Logo Section with animation */}
          <motion.div 
            className="flex flex-col items-center mb-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <motion.div 
              className="mb-6"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img 
                src={logo} 
                alt="Logo" 
                className="h-12 sm:h-16 w-auto" 
              />
            </motion.div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
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
            {/* Email Input */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email or Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FiMail className={`h-5 w-5 transition-all duration-300 ${
                    isEmailFocused ? 'text-sebna-navy scale-110' : 'text-gray-400'
                  }`} />
                </div>
                <motion.input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder="Enter your email or phone"
                  className="w-full pl-12 pr-4 py-4 bg-white/95 border border-gray-200/80 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sebna-navy/20 focus:border-sebna-navy shadow-sm transition-all duration-500"
                  required
                  animate={{
                    boxShadow: isEmailFocused 
                      ? '0 10px 25px -5px rgba(0, 23, 75, 0.12), 0 10px 10px -5px rgba(0, 23, 75, 0.05)'
                      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    borderColor: isEmailFocused ? '#00174b' : '#e5e7eb'
                  }}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <motion.button
                  type="button"
                  onClick={openForgotPasswordModal}
                  className="text-sm text-sebna-navy hover:text-sebna-orange font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Forgot Password?
                </motion.button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FiLock className={`h-5 w-5 transition-all duration-300 ${
                    isPasswordFocused ? 'text-sebna-navy scale-110' : 'text-gray-400'
                  }`} />
                </div>
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 bg-white/95 border border-gray-200/80 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sebna-navy/20 focus:border-sebna-navy shadow-sm transition-all duration-500"
                  required
                  animate={{
                    boxShadow: isPasswordFocused 
                      ? '0 10px 25px -5px rgba(0, 23, 75, 0.12), 0 10px 10px -5px rgba(0, 23, 75, 0.05)'
                      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    borderColor: isPasswordFocused ? '#00174b' : '#e5e7eb'
                  }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Remember Me */}
            <motion.div 
              className="flex items-center"
              whileHover={{ x: 4 }}
            >
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 text-sebna-navy border-gray-300 rounded focus:ring-2 focus:ring-sebna-navy/30"
              />
              <label htmlFor="remember" className="ml-3 text-sm text-gray-600 cursor-pointer select-none">
                Keep me logged in
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loginReqPending}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sebna-navy via-sebna-orange to-sebna-navy text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-sebna-navy/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-sebna-navy via-sebna-orange to-sebna-navy opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative flex items-center justify-center">
                {loginReqPending ? (
                  <>
                    <motion.div 
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div 
            className="my-8 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex-1 border-t border-gray-200/50"></div>
            <motion.span 
              className="mx-4 text-sm text-gray-400"
              whileHover={{ scale: 1.1 }}
            >
              or continue with
            </motion.span>
            <div className="flex-1 border-t border-gray-200/50"></div>
          </motion.div>

          {/* Social Login */}
          <motion.div 
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              className="flex items-center justify-center py-3 px-4 bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-2xl hover:bg-white transition-all duration-300 group hover:shadow-lg"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FcGoogle className="w-6 h-6 mr-3" />
              <span className="text-sm font-medium text-gray-700">Google</span>
            </motion.button>
            <motion.button 
              className="flex items-center justify-center py-3 px-4 bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-2xl hover:bg-white transition-all duration-300 group hover:shadow-lg"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-6 h-6 mr-3 bg-sebna-navy rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </motion.button>
          </motion.div>

          {/* Signup Link */}
          {/* <motion.div 
            className="text-center pt-6 border-t border-gray-100/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-600">
              Don't have an account?
              <motion.button
                onClick={goToSignup}
                className="ml-2 text-sebna-navy hover:text-sebna-orange font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign up now
              </motion.button>  
            </p>
          </motion.div>*/}  
        </GlassCard>
      </motion.div>

      {/* Modern Verification Modal */}
      <AnimatePresence>
        {showVerificationModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="w-full max-w-md">
              <div className="p-8">
                {/* Header */}
                <motion.div 
                  className="flex justify-between items-center mb-8"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Verify Your Account</h3>
                    <p className="text-gray-500 text-sm mt-1">We've sent a code to your phone</p>
                  </div>
                  <motion.button
                    onClick={closeVerificationModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX className="w-6 h-6" />
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Phone Input */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FiSmartphone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="flex-1 py-3 px-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-sebna-navy/30 focus:border-sebna-navy outline-none transition-all bg-white/95"
                      />
                      <motion.button
                        onClick={sendVerification}
                        disabled={!phoneNumber.trim() || verifyReqPending}
                        className="px-6 py-3 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {verifyReqPending ? 'Sending...' : 'Send'}
                      </motion.button>
                    </div>
                  </div>

                  {/* OTP Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                      Enter Verification Code
                    </label>
                    <OtpInput 
                      value={otpInputs}
                      onChange={setOtpInputs}
                      disabled={verifyReqPending}
                      loading={verifyReqPending}
                    />
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Didn't receive code?
                      <motion.button 
                        className="ml-2 text-sebna-navy hover:text-sebna-orange font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Resend
                      </motion.button>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={closeVerificationModal}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={submitVerification}
                      disabled={otpInputs.join('').length < 4 || verifyReqPending}
                      className="flex-1 py-3 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {verifyReqPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <FiRefreshCw className="w-4 h-4 animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        'Verify Account'
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="w-full max-w-md">
              <div className="p-8">
                {/* Header with Steps */}
                <motion.div 
                  className="flex justify-between items-center mb-8"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Reset Password</h3>
                    <div className="flex items-center mt-4 gap-1">
                      {[1, 2, 3].map((step) => (
                        <React.Fragment key={step}>
                          <motion.div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              forgotStep >= step 
                                ? 'bg-gradient-to-r from-sebna-navy to-sebna-orange text-white' 
                                : 'bg-gray-100 text-gray-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {forgotStep > step ? (
                              <FiCheck className="w-5 h-5" />
                            ) : (
                              step
                            )}
                          </motion.div>
                          {step < 3 && (
                            <div className={`w-12 h-1 ${forgotStep > step ? 'bg-gradient-to-r from-sebna-navy to-sebna-orange' : 'bg-gray-200'}`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    onClick={closeForgotPasswordModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX className="w-6 h-6" />
                  </motion.button>
                </motion.div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  {forgotStep === 1 && (
                    <motion.div 
                      key="step1"
                      className="space-y-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="text-center p-6 bg-gradient-to-br from-sebna-navy/5 to-sebna-orange/5 rounded-2xl">
                        <FcFeedback className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-700">Enter your email</h4>
                        <p className="text-sm text-gray-500 mt-1">We'll send a verification code</p>
                      </div>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-sebna-navy/30 focus:border-sebna-navy outline-none bg-white/95"
                      />
                      <motion.button
                        onClick={sendForgotPassword}
                        disabled={!forgotEmail.trim() || forgotReqPending}
                        className="w-full py-3 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {forgotReqPending ? 'Sending...' : 'Send Verification Code'}
                      </motion.button>
                    </motion.div>
                  )}

                  {forgotStep === 2 && (
                    <motion.div 
                      key="step2"
                      className="space-y-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="text-center p-6 bg-gradient-to-br from-sebna-navy/5 to-sebna-orange/5 rounded-2xl">
                        <FcAcceptDatabase className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-700">Enter Verification Code</h4>
                        <p className="text-sm text-gray-500 mt-1">Check your email for the code</p>
                      </div>
                      <OtpInput
                        value={forgotOtpInputs}
                        onChange={setForgotOtpInputs}
                        disabled={forgotReqPending}
                        loading={forgotReqPending}
                      />
                      <motion.button
                        onClick={verifyForgotOtp}
                        disabled={forgotOtpInputs.join('').length < 6 || forgotReqPending}
                        className="w-full py-3 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {forgotReqPending ? (
                          <span className="flex items-center justify-center gap-2">
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                            Verifying...
                          </span>
                        ) : (
                          'Verify Code'
                        )}
                      </motion.button>
                    </motion.div>
                  )}

                  {forgotStep === 3 && (
                    <motion.div 
                      key="step3"
                      className="space-y-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="text-center p-6 bg-gradient-to-br from-sebna-navy/5 to-sebna-orange/5 rounded-2xl">
                        <FcApproval className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-700">Create New Password</h4>
                        <p className="text-sm text-gray-500 mt-1">Set a new password for your account</p>
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            className="w-full py-3 px-4 pr-12 border border-gray-200 rounded-xl focus:ring-3 focus:ring-sebna-navy/30 focus:border-sebna-navy outline-none bg-white/95"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((v) => !v)}
                            className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>

                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full py-3 px-4 pr-12 border border-gray-200 rounded-xl focus:ring-3 focus:ring-sebna-navy/30 focus:border-sebna-navy outline-none bg-white/95"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>

                      <motion.button
                        onClick={submitResetPassword}
                        disabled={!newPassword.trim() || !confirmPassword.trim() || forgotReqPending}
                        className="w-full py-3 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {forgotReqPending ? (
                          <span className="flex items-center justify-center gap-2">
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                            Resetting...
                          </span>
                        ) : (
                          'Reset Password'
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Note */}
      {/* <motion.div 
        className="absolute bottom-18 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm text-gray-500">
          By signing in, you agree to our 
          <motion.button 
            className="mx-1 text-sebna-navy hover:underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Terms
          </motion.button>
          and 
          <motion.button 
            className="mx-1 text-sebna-navy hover:underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Privacy Policy
          </motion.button>
        </p>
      </motion.div> */}
    </div>
  );
};

export { SignIn };
export default SignIn;