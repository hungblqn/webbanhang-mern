import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleUserLogin = () => {
    if (username === "") {
      alert("Bạn chưa nhập tên tài khoản");
      return;
    }
    if (password === "") {
      alert("Bạn chưa nhập mật khẩu");
      return;
    }
    axios
      .post('http://localhost:5555/accounts/login', { username, password })
      .then((result) => {
        console.log(result);
        if(result.data.message === "Account not found"){
          alert("Tài khoản không tồn tại");
        }
        if(result.data === "Password is incorrect"){
          alert("Mật khẩu không đúng");
        }
        if(result.data.message === "Account is not verified"){
          alert("Vui lòng xác thực tài khoản của bạn")
          return;
        }
        if (result.data.Status === "Success") {
          if (result.data.role === "user") {
            navigate('/');
          }
          else if (result.data.role === "admin") {
            navigate('/dashboard');
          }
        }
      })
      .catch((error) => {
        alert('An error happened. Please check console');
        console.log(error);
      })
  }

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="/logo.png" alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Đăng nhập vào tài khoản của bạn</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Tên tài khoản</label>
              <div className="mt-2">
                <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} name="username" type="username" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">Mật khẩu</label>
                <div className="text-sm">
                  <a href="/recovery" className="font-semibold text-indigo-600 hover:text-indigo-500">Quên mật khẩu?</a>
                </div>
              </div>
              <div className="mt-2">
                <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div>
              <button onClick={handleUserLogin} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
            </div>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            Bạn chưa có tài khoản?
            <a href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Đăng ký</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login