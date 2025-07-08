import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import DefaultAvatar from "../components/DefaultAvatar.jsx";

const MyProfile = () => {
  const {userData,setUserData,token,backendUrl,loadUserProfileData}=useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false);
  const [image,setImage]= useState(false)
  const [resendingVerification, setResendingVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (token && !userData) {
      loadUserProfileData().finally(() => setIsLoading(false));
    } else if (!token) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [token, userData, loadUserProfileData, backendUrl]);

  const updateUserProfileData= async()=>{
      setIsSaving(true)
      try {
        const formData= new FormData()
        formData.append('userId',userData._id)
        formData.append('name',userData.name)
        formData.append('phone',userData.phone)
        formData.append('address',JSON.stringify(userData.address || { line1: '', line2: '' }))
        formData.append('gender',userData.gender || 'Not Selected')
        formData.append('dob',userData.dob || 'Not Selected')

        image && formData.append('image',image)

        const{data}=await axios.post(backendUrl+'/api/user/update-profile',formData,{headers:{token}})
        if(data.success){
           toast.success(data.message)
          await loadUserProfileData()
          setIsEdit(false)
          setImage(false)
        }
        else{
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      } finally {
        setIsSaving(false)
      }
  }

  const handleResendVerification = async () => {
    setResendingVerification(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/resend-otp', {}, {
        headers: { token }
      })
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to resend OTP')
    } finally {
      setResendingVerification(false)
    }
  }

  // Function to render profile image or default avatar
  const renderProfileImage = (size = 'w-24 h-24 md:w-32 md:h-32') => {
    if (userData?.image && userData.image !== '') {
      return (
        <img 
          className={`${size} rounded-full object-cover`} 
          src={userData.image} 
          alt="Profile"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    return <DefaultAvatar name={userData?.name} size={size} />;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if no token
  if (!token) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Please Login</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You need to be logged in to view and manage your profile.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show error state if token exists but no user data
  if (!userData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Unable to load your profile data. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-200"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Ensure userData has required fields with defaults
  const userDataWithDefaults = {
    ...userData,
    address: userData.address || { line1: '', line2: '' },
    gender: userData.gender || 'Not Selected',
    dob: userData.dob || 'Not Selected',
    phone: userData.phone || 'Not Provided',
    image: userData.image || 'https://via.placeholder.com/150'
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your personal information and account settings</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-primary px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              {isEdit ? (
                <label className="cursor-pointer">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden">
                      {image ? (
                        <img 
                          className="w-full h-full object-cover" 
                          src={URL.createObjectURL(image)} 
                          alt="Profile"
                        />
                      ) : userData?.image && userData.image !== '' ? (
                        <img 
                          className="w-full h-full object-cover" 
                          src={userData.image} 
                          alt="Profile"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <DefaultAvatar name={userData?.name} size="w-full h-full" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
         </div>
                  <input 
                    onChange={(e) => setImage(e.target.files[0])} 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                  />
        </label>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden">
                  {renderProfileImage()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
      {isEdit ? (
        <input
                  className="bg-white/20 text-2xl md:text-3xl font-bold text-white placeholder-white/80 border-0 rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-white/50"
          type="text"
          value={userDataWithDefaults.name}
                  onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
        />
      ) : (
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {userDataWithDefaults.name}
                </h2>
      )}
              <p className="text-white/90 text-lg mb-4">Patient Account</p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isEdit ? (
                  <>
                    <button 
                      onClick={updateUserProfileData}
                      disabled={isSaving}
                      className="bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                          Saving...
                        </>
            ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
            )}
                    </button>
                    <button 
                      onClick={() => {
                        setIsEdit(false)
                        setImage(false)
                        loadUserProfileData()
                      }}
                      className="bg-white/20 text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
              <button
                    onClick={() => setIsEdit(true)}
                    className="bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
              >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
              </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>

              {/* Email */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="flex items-center gap-3">
                  <p className="text-gray-900 dark:text-white font-medium">{userDataWithDefaults.email}</p>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
          {isEdit ? (
            <input
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    type="tel"
              value={userDataWithDefaults.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setUserData((prev) => ({ ...prev, phone: value }));
                }
              }}
                    placeholder="Enter phone number"
            />
          ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{userDataWithDefaults.phone}</p>
          )}
              </div>

              {/* Address */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
          {isEdit ? (
                  <div className="space-y-2">
            <input
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              type="text"
              value={userDataWithDefaults.address.line1}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value },
                }))
              }
                      placeholder="Address Line 1"
            />
            <input
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              type="text"
              value={userDataWithDefaults.address.line2}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value },
                }))
              }
                      placeholder="Address Line 2 (Optional)"
            />
                  </div>
          ) : (
                  <div className="text-gray-900 dark:text-white">
                    <p className="font-medium">{userDataWithDefaults.address.line1 || 'Not provided'}</p>
                    {userDataWithDefaults.address.line2 && (
                      <p className="text-gray-600 dark:text-gray-300">{userDataWithDefaults.address.line2}</p>
                    )}
                  </div>
          )}
        </div>
      </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>

              {/* Gender */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
          {isEdit ? (
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={userDataWithDefaults.gender}
                    onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
            >
                    <option value="Not Selected">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
                    <option value="Other">Other</option>
            </select>
          ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{userDataWithDefaults.gender}</p>
          )}
              </div>
        
              {/* Date of Birth */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
        {isEdit ? (
                  <input
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            type="date"
            value={userDataWithDefaults.dob}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                dob: e.target.value,
              }))
            }
          />
        ) : (
                  <p className="text-gray-900 dark:text-white font-medium">
                    {userDataWithDefaults.dob === 'Not Selected' ? 'Not provided' : userDataWithDefaults.dob}
                  </p>
        )}
              </div>

              {/* Account Status */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Status</label>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
