import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useEffect , useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { DoctorContext } from "../../context/DoctorContext.jsx";

const DoctorProfile = () => {
  const currency = "₹";
  const { dToken, setProfileData, profileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const [isEdit , setisEdit] = useState(false);
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


  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="w-full">
        <div className="flex flex-col gap-5 m-5">
          <div className="flex justify-center items-center" >
            <img className="bg-primary w-full sm:max-w-64  rounded-lg " src={profileData.image} alt="" />
          </div>

          <div className="flex-1 border border-gray-200 rounded-lg p-7  bg-gray-50">
            <p className="flex items-center gap-2 text-3xl font-bold text-gray-700">{profileData.name}</p>
            <div className="flex items-center gap-2 mb-4">
              <p className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 text-sm text-gray-600 border broder-gray-400 rounded-xl">{profileData.experience}</button>
            </div>

              {/* about the dcotor  */}
            <div>
              <p className="flex items-center  text-xl font-bold text-gray-600" >About:</p>
              {isEdit ? (
  <textarea 
    onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
    value={profileData.about} 
    className="text-sm text-gray-600 w-full max-w-[700px] p-2 border border-gray-300 rounded-md resize-none"
    rows="4"
  />
) : (
  profileData.about
)}

            </div>
            <p className="text-gray-800 font-bold mt-4">
              Appointment fees:{" "}
              <span className="text-gray-600  ">
                {currency}
                {isEdit ? <input type="number" onChange={(e)=>setProfileData(prev => ({...prev,fees:e.target.value}))} value={profileData.fees}/>: profileData.fees}
              </span>
            </p>

            <div className="flex gap-2 py-2">
              <p className="text-gray-800 font-bold">Address:</p>
              <p className="text-gray-600">{isEdit ? <input type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, address: e.target.value } }))} value={profileData.address.address} /> : profileData.address.address}</p>
            </div>


            <div className="flex gap-1 pt-2">
              <input onChange={()=>{
                isEdit ? setProfileData(prev => ({ ...prev, available: !prev.available })) : null
              }} checked={profileData.available} type="checkbox" name="" id="" />
              <label htmlFor="">Available</label>
            </div>

            {
              !isEdit
              ?<button onClick={()=>{setisEdit(true)}} className="px-4 py-1 border border-gray-700  rounded-full mt-5 hover:bg-primary hover:text-white transition-all hover:border-white ">Edit</button>
              :<button onClick={()=>updateProfile()} className="px-4 py-1 border border-gray-700  rounded-full mt-5 hover:bg-primary hover:text-white transition-all hover:border-white ">Save</button>
            }

            
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
