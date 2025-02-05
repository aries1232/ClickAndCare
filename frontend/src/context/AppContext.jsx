import { createContext, useEffect, useState } from "react";
import { doctors } from "../assets/assets"
import {toast } from 'react-toastify';
import axios from "axios";
export const AppContext = createContext()

const AppContextProvider = (props) => {

  const currencySymbol='$'
  const backendUrl= import.meta.env.VITE_BACKEND_URL

  //const backendUrl="http://localhost:3000"
  const[token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
  const [userData,setUserData]=useState(false);
  const [doctors,setDoctors]=useState([]);


  //api call to get all the doctor data
  const getDoctors = async()=> {
    try {
      const {data} = await axios.post(backendUrl + '/api/doctor/get-doctors',{},{headers:{token}});
      if(data.success){
        setDoctors(data.doctors);

      }else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message);
      
    }
  }

  useEffect(()=> {
    getDoctors()
  },[])


  //api to load the user profile data 
const loadUserProfileData=async()=>{
  try {
    const{data}=await axios.get(backendUrl+'/api/user/get-profile',{headers:{token}})
    if(data.success){
      setUserData(data.userData)
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}

  const value = {
    doctors, 
    token,setToken,
    backendUrl,
    userData,setUserData,
    loadUserProfileData
  };

  useEffect(()=>{
   if(token){
    loadUserProfileData()
   }
   else{
    setUserData(false)
   }
  },[token])
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
