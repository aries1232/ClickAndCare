import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useEffect , useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { assets } from "../../assets/assets";

const DoctorProfile = () => {
  const currency = "₹";
  const { dToken, setProfileData, profileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const [isEdit , setisEdit] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const updateProfile = async () => {
    try {
      
      const updataData={
        about:profileData.about,
        address:profileData.address,
        fees:profileData.fees,
        available:profileData.available
      }

      const {data} = await axios.post(backendUrl + '/api/doctor/update-profile',updataData,{headers:{dToken}})
      
      if(data.success){
        toast.success(data.message)
        getProfileData()
        setisEdit(false)
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const updateProfilePicture = async () => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('docId', profileData._id);

      const {data} = await axios.post(backendUrl + '/api/doctor/update-profile-picture', formData, {
        headers: { dToken }
      });
      
      if(data.success){
        toast.success(data.message);
        setSelectedImage(null);
        getProfileData(); // Refresh profile data to show new image
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsUploadingImage(false);
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your professional profile and settings</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Picture
                </h3>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img 
                      className="w-48 h-48 rounded-full object-cover border-4 border-gray-600" 
                      src={profileData.image || assets.upload_area} 
                      alt="Profile" 
                    />
                    {!profileData.image && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <p className="text-white text-center text-sm px-2">No profile picture</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Profile Picture Upload */}
                  <div className="w-full">
                    <label htmlFor="profile_image" className="flex items-center justify-center gap-2 cursor-pointer border border-gray-600 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-300">Upload New Picture</span>
                      <input 
                        onChange={(event) => setSelectedImage(event.target.files[0])} 
                        type="file" 
                        id="profile_image" 
                        hidden 
                        accept="image/*"
                      />
                    </label>
                    
                    {selectedImage && (
                      <div className="mt-4 flex items-center gap-3">
                        <img 
                          src={URL.createObjectURL(selectedImage)} 
                          alt="Preview" 
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                        />
                        <button 
                          onClick={updateProfilePicture}
                          disabled={isUploadingImage}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUploadingImage ? (
                            <div className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </div>
                          ) : (
                            'Save Picture'
                          )}
                        </button>
                      </div>
                    )}
                    
                    {!profileData.image && (
                      <p className="text-xs text-red-400 text-center mt-2">
                        Profile picture is required to appear in admin panel
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Professional Information
                  </h3>
                  <button
                    onClick={() => setisEdit(!isEdit)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    {isEdit ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                </div>

                {/* Basic Info */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-white mb-2">{profileData.name}</h4>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm text-gray-300">{profileData.degree} - {profileData.speciality}</span>
                    <span className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">{profileData.experience}</span>
                  </div>
                </div>

                {/* About Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">About</label>
                  {isEdit ? (
                    <textarea 
                      onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                      value={profileData.about} 
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows="4"
                      placeholder="Tell patients about your expertise and experience..."
                    />
                  ) : (
                    <p className="text-gray-300 bg-gray-700/50 p-4 rounded-lg">{profileData.about}</p>
                  )}
                </div>

                {/* Fees and Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Consultation Fees</label>
                    {isEdit ? (
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">₹</span>
                        <input 
                          type="number" 
                          onChange={(e) => setProfileData(prev => ({...prev, fees: e.target.value}))} 
                          value={profileData.fees}
                          className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="500"
                        />
                      </div>
                    ) : (
                      <p className="text-white font-medium text-lg">₹{profileData.fees}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                    {isEdit ? (
                      <input 
                        type="text" 
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, address: e.target.value } }))} 
                        value={profileData.address.address} 
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Hospital/Clinic address"
                      />
                    ) : (
                      <p className="text-gray-300">{profileData.address.address}</p>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      onChange={() => {
                        isEdit ? setProfileData(prev => ({ ...prev, available: !prev.available })) : null
                      }} 
                      checked={profileData.available} 
                      type="checkbox" 
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                      disabled={!isEdit}
                    />
                    <span className="text-sm font-medium text-gray-300">Available for appointments</span>
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    {profileData.available ? 'Patients can book appointments with you' : 'You are currently not accepting new appointments'}
                  </p>
                </div>

                {/* Save Button */}
                {isEdit && (
                  <div className="flex gap-4 pt-6 border-t border-gray-700">
                    <button 
                      onClick={updateProfile}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setisEdit(false)}
                      className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
