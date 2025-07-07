import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorSignup = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('No Experience');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General Physician');
  const [degree, setDegree] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const { backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailVerified(false);
    setOtpSent(false);
    setOtp('');
  };

  const sendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }

    setVerifyingEmail(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/send-signup-otp', { email });
      
      if (data.success) {
        toast.success(data.message);
        setOtpSent(true);
        setCountdown(60); // 60 seconds countdown
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("OTP sending failed:", error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setVerifyingEmail(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/verify-signup-otp', { email, otp });
      
      if (data.success) {
        toast.success(data.message);
        setEmailVerified(true);
        setOtpSent(false);
        setOtp('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const resendOTP = () => {
    if (countdown > 0) return;
    sendOTP();
  };

  const onSubmitHandler = async(e) => {
      e.preventDefault();
      
      // Check if email is verified
      if (!emailVerified) {
        toast.error('Please verify your email first');
        return;
      }

      setLoading(true);

      try {
        const formData = new FormData();

        formData.append('name',name)
        if(docImg) {
          formData.append('image',docImg)
        }
        formData.append('email',email)
        formData.append('speciality',speciality)
        formData.append('experience',experience)
        formData.append('about',about)
        formData.append('fees',Number(fees))
        formData.append('degree',degree)
        formData.append('address',JSON.stringify({address}))
        formData.append('password',password)

        const {data} = await axios.post(backendUrl + '/api/doctor/signup' ,formData);

        if(data.success) {
          toast.success(data.message);
          console.log('doctor registered');
          setDocImg(false)
          setName('')
          setPassword('')
          setEmail('')
          setDegree('')
          setAbout('')
          setFees('')
          setAddress('')
          setEmailVerified(false)
          setOtpSent(false)
          setOtp('')
          navigate('/doctor-login');
        } else {
          toast.error(data.message);
        }
        
        
      } catch (error) {
        toast.error(error.message)
        console.log(error);
      } finally {
        setLoading(false);
      }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/25">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Doctor Registration
          </h2>
          <p className="text-gray-300">
            Register as a doctor and wait for admin approval
          </p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Email Verification Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                <div className="flex gap-2">
                  <input 
                    onChange={handleEmailChange}  
                    value={email} 
                    className="flex-1 px-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                    type="email" 
                    placeholder="doctor@example.com" 
                    required 
                    disabled={emailVerified}
                  />
                  {!emailVerified && (
                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={!email || verifyingEmail}
                      className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {verifyingEmail ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  )}
                </div>
                {emailVerified && (
                  <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Email verified successfully
                  </p>
                )}
              </div>

              {/* OTP Input Section */}
              {otpSent && !emailVerified && (
                <div className="space-y-3 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Enter OTP</label>
                    <div className="flex gap-2">
                      <input 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)}
                        className="flex-1 px-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest" 
                        type="text" 
                        placeholder="000000"
                        maxLength={6}
                        disabled={verifyingEmail}
                      />
                      <button
                        type="button"
                        onClick={verifyOTP}
                        disabled={otp.length !== 6 || verifyingEmail}
                        className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        {verifyingEmail ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          'Verify'
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Enter the 6-digit code sent to {email}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <button 
                      type="button"
                      onClick={resendOTP}
                      disabled={countdown > 0}
                      className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative">
                <img 
                  src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                  alt="Profile Preview" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-500/50 shadow-lg"
                />
                {!docImg && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                )}
              </div>
              
              <label htmlFor="doc_image" className="flex items-center gap-2 cursor-pointer bg-purple-900/30 hover:bg-purple-900/50 px-4 py-2 rounded-lg transition-colors border border-purple-500/30">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-purple-400 font-medium">Upload Profile Picture (Optional)</span>
                <input onChange={(event) => setDocImg(event.target.files[0])} type="file" id="doc_image" hidden accept="image/*" />
              </label>
              
              <p className="text-xs text-gray-400 text-center max-w-sm">
                You can add your profile picture later in your dashboard. Profile picture is required to appear in admin panel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
                <input 
                  onChange={(event) => setName(event.target.value)}  
                  value={name} 
                  className="w-full px-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                  type="text" 
                  placeholder="Dr. John Doe" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                <input 
                  onChange={(event) => setPassword(event.target.value)}  
                  value={password} 
                  className="w-full px-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                  type="password" 
                  placeholder="Create a strong password" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Speciality</label>
                <select 
                  onChange={(event) => setSpeciality(event.target.value)}  
                  value={speciality} 
                  className="w-full px-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="General Physician">General Physician</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="ENT Specialist">ENT Specialist</option>
                  <option value="Pulmonologist">Pulmonologist</option>
                  <option value="Endocrinologist">Endocrinologist</option>
                  <option value="Oncologist">Oncologist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Experience</label>
                <select 
                  onChange={(event) => setExperience(event.target.value)}  
                  value={experience} 
                  className="w-full px-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="No experience">No experience</option>
                  <option value="1+ Years">1+ Years</option>
                  <option value="2+ Years">2+ Years</option>
                  <option value="5+ Years">5+ Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Consultation Fees (₹)</label>
                <input 
                  onChange={(event) => setFees(event.target.value)}  
                  value={fees} 
                  className="w-full px-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                  type="number" 
                  placeholder="500" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Education/Degree</label>
                <input 
                  onChange={(event) => setDegree(event.target.value)}  
                  value={degree} 
                  className="w-full px-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                  type="text" 
                  placeholder="MBBS, MD, etc." 
                  required 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-200 mb-2">Address</label>
                <input 
                  onChange={(event) => setAddress(event.target.value)}  
                  value={address} 
                  className="w-full px-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                  type="text" 
                  placeholder="Complete address" 
                  required 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-200 mb-2">About You</label>
                <textarea 
                  onChange={(event) => setAbout(event.target.value)}  
                  value={about} 
                  className="w-full px-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none" 
                  placeholder="Tell us about your expertise, experience, and what makes you unique..." 
                  rows={4} 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !emailVerified}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl shadow-purple-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </div>
              ) : !emailVerified ? (
                'Verify Email First'
              ) : (
                'Register as Doctor'
              )}
            </button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                Already have an account? <span onClick={() => navigate('/doctor-login')} className="text-purple-400 cursor-pointer hover:text-purple-300 font-medium transition-colors">Login here</span>
              </p>
              <p className="text-sm text-gray-400">
                <span onClick={() => navigate('/')} className="text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">← Back to home</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup; 