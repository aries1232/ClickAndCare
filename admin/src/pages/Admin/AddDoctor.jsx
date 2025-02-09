import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {

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

  const {backendUrl,aToken} = useContext(AdminContext);

  const onSubmitHandler = async(e) => {
      e.preventDefault();

      try {
        if(!docImg) {
          return toast.error('no image selected');
        }

        const formData = new FormData();

        formData.append('name',name)
        formData.append('image',docImg)
        formData.append('email',email)
        formData.append('speciality',speciality)
        formData.append('experience',experience)
        formData.append('about',about)
        formData.append('fees',Number(fees))
        formData.append('degree',degree)
        formData.append('address',JSON.stringify({address}))
        formData.append('password',password)

        formData.forEach((value,key)=> {
          //console.log(`${key} : ${value}`);
        })

        const {data} = await axios.post(backendUrl + '/api/admin/add-doctor' ,formData , {headers : {aToken}});

        if(data.success) {
          toast.success(data.message);
          console.log('doctor added');
          setDocImg(false)
          setName('')
          setPassword('')
          setEmail('')
          setDegree('')
          setAbout('')
          setFees('')
          setAddress('')

        } else {
          toast.error(data.message);
        }
        
        
      } catch (error) {
        toast.error(error.message)
        console.log(error);
      }
  }

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-4 text-xl font-semibold text-black">Add Doctor</p>
      <div className="bg-white px-7 py-8 border border-gray-300 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto shadow-md">
         
        <div className="flex items-center gap-4 mb-6 text-gray-700">
          <label htmlFor="doc_image" className="flex items-center gap-2 cursor-pointer border border-gray-400 p-2 rounded-lg">
            <img src={docImg ?  URL.createObjectURL(docImg) : assets.upload_area} alt="Upload" className="w-12 h-12 rounded-full object-cover" />
            <input onChange={(event) => setDocImg(event.target.files[0])} type="file"  id="doc_image" hidden />
            <p className="text-gray-600 font-medium">Upload Picture</p>
          </label>
        </div>

         
        <div className="flex flex-col gap-4">
           
          <div>
            <p className="text-lg font-medium text-black">Doctor Name</p>
            <input onChange={(event) => setName(event.target.value)}  value={name} className="w-full border border-gray-400 rounded-md mt-1 px-3 py-2 outline-none focus:border-primary" type="text" placeholder="Name" required />
          </div>

           
          <div>
            <p className="text-lg font-medium text-black">Doctor Email</p>
            <input onChange={(event) => setEmail(event.target.value)}  value={email} className="w-full border border-gray-400 rounded-md mt-1 px-3 py-2 outline-none focus:border-primary" type="email" placeholder="E-mail" required />
          </div>

           
          <div>
            <p className="text-lg font-medium text-black">Doctor Password</p>
            <input onChange={(event) => setPassword(event.target.value)}  value={password} className="w-full border border-gray-400 rounded-md mt-1 px-3 py-2 outline-none focus:border-primary" type="password" placeholder="Password" required />
          </div>

           
          <div>
            <p className="text-lg font-medium text-black">Speciality</p>
            <select onChange={(event) => setSpeciality(event.target.value)}  value={speciality} className="w-full border border-gray-400 rounded-md mt-1 px-3 py-2 outline-none focus:border-primary">
              <option value="General Physician">General Physician</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
              <option value="Cardiologist">Cardiologist</option>
            </select>
          </div>

           
          <div>
            <p className="text-lg font-medium text-black">Experience</p>
            <select onChange={(event) => setExperience(event.target.value)}  value={experience} className="w-full border border-gray-400 rounded-md mt-1 px-3 py-2 outline-none focus:border-primary">
              <option value="No experience">No experience</option>
              <option value="1+ Years">1+ Years</option>
              <option value="2+ Years">2+ Years</option>
              <option value="5+ Years">5+ Years</option>
              <option value="10+ Years">10+ Years</option>
            </select>
          </div>

           
          <div>
            <p className="text-lg font-medium text-black">Fees</p>
            <input onChange={(event) => setFees(event.target.value)}  value={fees} className="w-full border border-gray-400 rounded-md mt-1 px-3 py-2 outline-none focus:border-primary" type="number" placeholder="Fees" required />
          </div>

           
          <div>
            <p className="text-lg font-medium text-black">Education</p>
            <input onChange={(event) => setDegree(event.target.value)}  value={degree} className="w-full border border-gray-400 rounded-md mt-1 px-3 py-2 outline-none focus:border-primary" type="text" placeholder="Education" required />
          </div>

           
          <div>
            <p className="text-lg font-medium text-black">Address</p>
            <input onChange={(event) => setAddress(event.target.value)}  value={address} className="w-full border border-black rounded-md mt-1 px-3 py-2 outline-none focus:border-primary" type="text" placeholder="Address" required />
          </div>

           
          <div>
            <p className="text-lg font-medium text-black">About Doctor</p>
            <textarea onChange={(event) => setAbout(event.target.value)}  value={about} className="w-full border border-black rounded-md mt-1 px-3 py-2 outline-none focus:border-primary" placeholder="About you" rows={4} required />
          </div>

           
          <button type="submit" className="w-32 bg-primary text-white py-2 rounded-full font-medium text-lg hover:bg-black transition">
            Add Doctor
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
