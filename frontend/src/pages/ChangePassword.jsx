import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState([]);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    axios.defaults.withCredentials = true;

    //Lấy dữ liệu cho account
    useEffect(() => {
        axios
            .get('http://localhost:5555/accounts/home')
            .then((result) => {
                if (result.data.message === 'Success') {
                    setUser(result.data.decoded);
                }
                else{
                    navigate('/')
                }
            })
            .catch((error) => {
                alert('An error happened. Please check console');
                console.log(error);
            });
    }, []);

    const handleChangePassword = () => {
        if(oldPassword === "" || newPassword === "" || confirmNewPassword === ""){
            alert("Hãy nhập đủ thông tin");
            return;
        }
        if(newPassword !== confirmNewPassword){
            alert("Mật khẩu không trùng khớp")
            return;
        }
        axios.post('http://localhost:5555/accounts/change-password', {accountId: user.id,oldPassword,newPassword})
        .then((result) => {
            console.log(result);
            if (result.data.message === "Old password is incorrect") {
                alert("Mật khẩu cũ không đúng");

            }
            if(result.data.message === "Password updated successfully"){
                alert("Cập nhật mật khẩu thành công");
                navigate('/logout');
            }
        })
        .catch((error) =>{
            console.log(error);
        })
    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
                    BRAND
                </a>
                <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                    <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Change Password
                    </h2>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old Password</label>
                        <input onChange={(e) => setOldPassword(e.target.value)} value={oldPassword} type="password" name="oldpassword" id="oldpassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                        <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                    </div>
                    <br />
                    <div>
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                        <input onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword} type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                    </div>
                    <br />
                    <button
                        onClick={handleChangePassword}
                        className="w-full text-white bg-blue-600 hover:bg-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        Reset password
                    </button>

                </div>
            </div>
        </section>
    )
}

export default ChangePassword