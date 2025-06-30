import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const {userData,setUserData,token,backendUrl,loadUserProfileData}=useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false);
  const [image,setImage]= useState(false)
  const [resendingVerification, setResendingVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Debug logging
  useEffect(() => {
    console.log("MyProfile Debug Info:", {
      token: !!token,
      userData: userData,
      backendUrl: backendUrl
    });
    
    if (token && !userData) {
      console.log("Token exists but no userData, loading profile...");
      loadUserProfileData().finally(() => setIsLoading(false));
    } else if (!token) {
      console.log("No token found, user not logged in");
      setIsLoading(false);
    } else {
      console.log("User data available");
      setIsLoading(false);
    }
  }, [token, userData, loadUserProfileData, backendUrl]);

  const updateUserProfileData= async()=>{
      try {
        const formData= new FormData()
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if no token
  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load your profile data. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
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
    <div className="max-w-lg flex flex-col gap-4 text-sm">
      {
        isEdit 
        ? <label  htmlFor="">
         <div className="inline-block relative cursor-pointer">
          <img className=" w-36 rounded opacity-75" src={image ? URL.createObjectURL(image): userDataWithDefaults.image} alt="" />
          <img className="w-10 absolute bottom-12 right-12" src={image ? '': assets.upload_icon} alt=""/>

         </div>
         <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" />
        </label>
        :
        <img className="w-36 rounded" src={userDataWithDefaults.image} alt=""/>
      }
    
      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userDataWithDefaults.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userDataWithDefaults.name}
        </p>
      )}
      <hr />
      <div>
        <p className="text-neutral-500 mt-">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2 mt-3 text-neutral-700 pt-2">
          <p className="font-medium">Email id:</p>
          <div className="flex items-center gap-2">
            <p className="text-blue-500">{userDataWithDefaults.email}</p>
            {userDataWithDefaults.isEmailVerified ? (
              <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
                ✓ Verified
              </span>
            ) : (
              <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>
          {/* {!userDataWithDefaults.isEmailVerified && (
            <div className="col-span-2 mt-2">
              <button
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="text-xs text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
              >
                {resendingVerification ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
          )} */}
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={userDataWithDefaults.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setUserData((prev) => ({ ...prev, phone: value }));
                }
              }}
            />
          ) : (
            <p className="text-blue-400">{userDataWithDefaults.phone}</p>
          )}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p>
            <input
              className="bg-gray-50"
              type="text"
              value={userDataWithDefaults.address.line1}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value },
                }))
              }
            />
            <br />
            <input
              className="bg-gray-50 mt-2"
              type="text"
              value={userDataWithDefaults.address.line2}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value },
                }))
              }
            />
            </p>
          ) : (
            <p className="text-gray-500">{userDataWithDefaults.address.line1}
            <br />
            {userDataWithDefaults.address.line2}</p>
          )}
        </div>
      </div>
      <div>
        <p className="text-neutral-500  mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select className="max-w-20 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userDataWithDefaults.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userDataWithDefaults.gender}</p>
          )}
        
        <p className="font-medium">Birthday:</p>
        {isEdit ? (
          <input className="max-w-28 bg-gray-100"
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
          <p className="text-gray-400">{userDataWithDefaults.dob}</p>
        )}
        </div>
      </div>
      <div className="mt-6">
        {isEdit ? (
          <button className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            
            onClick={updateUserProfileData}
          >
            Save Information
          </button>
        ) : (
          <button className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
