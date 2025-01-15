import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';

const Login = () => {
    const [state, setState] = useState('Admin');
    const [setAToken,backendUrl] = useContext(AdminContext);

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();

        try{
            if(state === 'Admin') {

            }else {
                
            }

        }catch(err){


        }

         
    }

    return (
        <form  onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center '>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[350px] sm:min-w-[24rem] border border-slate-300 rounded-xl   text-lg shadow-xl bg-slate-50'>
                <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
                <div className='w-full'>
                    <p className=''>Email</p>
                    <input onChange={(e)=>(e.target.value)} value={email} className='w-full border border-[#DADADA] rounded p-1 ' type="email" required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input onChange={(e)=>(e.target.value)} value={password} className='w-full border border-[#DADADA] rounded p-1 ' type="password" required />
                </div>
                <button  className='bg-primary text-white w-full border-none rounded-md p-1' type='submit'>Login</button>
                {
                    state === 'Admin' 
                    ? <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-sm text-primary cursor-pointer underline' >Click Here</span></p>
                    : <p>Admin Login? <span  onClick={() => setState('Admin')} className='text-sm text-primary cursor-pointer underline'  >Click Here</span></p>
                }
            </div>
        </form>
    );
};

export default Login;