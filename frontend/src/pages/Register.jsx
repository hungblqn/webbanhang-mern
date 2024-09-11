import { Routes, Route} from 'react-router-dom';
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTermsAndConditions, setAcceptTermsAndConditions] = useState(false);
  const [loading, setLoading] = useState('');
  const navigate = useNavigate();
  const handleAccountRegistration = () => {
    const data = {
      username,
      email,
      password
    };
    if(username === ""){
      alert("Hãy nhập tên tài khoản");
      return;
    }
    if(email === ""){
      alert("Hãy nhập email của bạn")
      return;
    }
    else if(password === ""){
      alert("Hãy nhập mật khẩu");
      return;
    }
    else if(confirmPassword === ""){
      alert("Hãy nhập lại mật khẩu");
      return;
    }
    if(password.trim() !== confirmPassword.trim()){
      alert('Mật khẩu bạn đã nhập không trùng khớp');
      return;
    }
    if(!acceptTermsAndConditions){
      alert("Bạn chưa đồng ý tuân theo các điều khoản và điều kiện của website");
      return;
    }
    axios
      .post('http://localhost:5555/accounts',data)
      .then((result) => {
        console.log(result.data);
        if(result.data.message === "Email is already in use."){
          alert("Email đã được sử dụng để đăng ký, vui lòng sử dụng email khác")
        }
        else if(result.data.message === "Username is already in use."){
          alert("Tên tài khoản đã được sử dụng, vui lòng chọn tên khác")
        }
        else{
          setLoading(false);
          alert("Vui lòng kiểm tra email để xác thực tài khoản")
          navigate('/login');
        }
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      })
  }

  return (
    <div className=''>
      <section className='bg-gray-50'>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo"/>
            BRAND
          </a>
          <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
                Tạo tài khoản
              </h1>
              
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Tên tài khoản</label>
                  <input type='text' onChange={(e) => setUsername(e.target.value)} value={username} name='username' placeholder='Nhập tên tài khoản' className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                </div>
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Email</label>
                  <input type='text' onChange={(e) => setEmail(e.target.value)} value={email} name='email' placeholder='Nhập email' className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                </div>
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Mật khẩu</label>
                  <input type='password' onChange={(e) => setPassword(e.target.value)} value={password} name='password' placeholder='Nhập mật khẩu' className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                </div>
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Xác nhận mật khẩu</label>
                  <input type='password' onChange={(e) => setConfirmPassword(e.target.value)} value = {confirmPassword} name='confirm-password' placeholder='Nhập lại mật khẩu' className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
                </div>
                <div className='flex items-start'>
                  <div className='flex items-center h-5'>
                    <input type='checkbox' onChange={(e) => setAcceptTermsAndConditions(e.target.checked)} className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800' />
                  </div>
                  <div className='ml-3 text-sm'>
                  <label className="font-light text-gray-500 dark:text-gray-300">Tôi chấp nhận tuân theo <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">các điều khoản và điều kiện</a> của website</label>
                  </div>
                </div>
                <button onClick={handleAccountRegistration} className='w-full text-white bg-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800' >Tạo tài khoản</button>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Register