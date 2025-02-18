import React, { useState } from 'react'
import axios from 'axios';
import Spinner from '../components/Spinner';

const RecoveryAccount = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptTermsAndConditions, setAcceptTermsAndConditions] = useState(false);
    const handleRecoveryAccount = () => {
        if (!email) {
            alert("Hãy nhập email của bạn");
            return;
        }
        if (!acceptTermsAndConditions) {
            alert("Bạn chưa đồng ý tuân theo các điều khoản và điều kiện của website");
            return;
        }
        setLoading(true);
        axios.post('http://localhost:5555/accounts/recovery', { email: email })
            .then((result) => {
                console.log(result);
                if (result.data.message === "Account doesn't exist") {
                    alert(`Không có tài khoản nào có email là ${email}`);
                    setLoading(false);
                    return;
                }
                else {
                    alert(`Kiểm tra email của bạn để đặt lại mật khẩu`)
                    setLoading(false);
                    return;
                }
            })
            .catch((error) => {
                alert("Error happened")
                console.log(error)
            })
    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
                    BRAND
                </a>
                <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                    <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Quên mật khẩu?
                    </h1>
                    <p className="font-light text-gray-500 dark:text-gray-400">Đừng lo, nhập email của bạn và chúng tôi sẽ gửi link reset mật khẩu cho bạn</p>

                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nhập email</label>
                        <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                    </div>
                    <br/>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="terms" onChange={(e) => setAcceptTermsAndConditions(e.target.checked)} value={acceptTermsAndConditions} aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                        </div>
                    </div>
                    <br/>
                    {!loading ? (
                        <button type="submit" onClick={handleRecoveryAccount} className="w-full text-white bg-blue-600 hover:bg-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Reset password</button>

                    ) : (   
                        <Spinner/>
                    )}
                    
                </div>
            </div>
        </section>
    )
}

export default RecoveryAccount