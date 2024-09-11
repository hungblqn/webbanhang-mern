import React,{ useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogout = async () =>{
    try{
        await axios.post('http://localhost:5555/accounts/logout');
        navigate('/');
    }
    catch(error){
        console.log(error);
    }
  }
  useEffect(() => {
    handleLogout();
  },[])
  return (
    <div>Logout Page</div>
  )
}

export default Logout