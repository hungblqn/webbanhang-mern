import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfo, BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';


const ShowAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [acc, setAcc] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/accounts')
      .then((response) => {
        setAccounts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleDeleteAccount = (id) => {
    axios
      .delete(`http://localhost:5555/accounts/${id}`)
      .then((response) => {
        setAcc(response.data);
        setAccounts(accounts.filter(account => account._id !== id));
        setLoading(false);
      })
      .catch((error) =>{
        console.log(error);
        setLoading(false);
      })
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Danh sách tài khoản</h1>
      </div>
      {loading ? (
        <Spinner/>
      ) : (
        <table className='w-full border-separate border-spacing-2'>
          <thead>
            <tr>
              <th className='border border-slate-600 rounded-md'>STT</th>
              <th className='border border-slate-600 rounded-md'>Tên tài khoản</th>
              <th className='border border-slate-600 rounded-md'>Email</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>Vai trò</th>
              <th className='border border-slate-600 rounded-md'>Tình trạng</th>
              <th className='border border-slate-600 rounded-md'>Xử lý</th>
              
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={account._id} className='h-8'>
                <td className='border border-slate-700 rounded-md text-center'>{index + 1}</td>
                <td className='border border-slate-700 rounded-md text-center'>{account.username}</td>
                <td className='border border-slate-700 rounded-md text-center'>{account.email}</td>
                <td className='border border-slate-700 rounded-md text-center'>{account.role}</td>
                <td className='border border-slate-700 rounded-md text-center'>{account.verified ? "Đã xác thực" : "Chưa xác thực"}</td>
                <td className='border border-slate-700 rounded-md text-center'>
                  <div className='flex justify-center gap-x-4'>
                    <Link to={`/accounts/edit/${account._id}`}>
                      <AiOutlineEdit className='text-2xl text-yellow-800'/>
                    </Link>
                    <button onClick={() => handleDeleteAccount(account._id)}>
                      <MdOutlineDelete className='text-2xl text-red-800'/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ShowAccount