import React, { useState, useEffect } from 'react'
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditOrder = () => {
  const [receiverName, setReceiverName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(false);
    axios.get(`http://localhost:5555/orders/${id}`)
      .then((response) => {
        setReceiverName(response.data.receiverName);
        setAddress(response.data.address);
        setPhoneNumber(response.data.phoneNumber);
        setStatus(response.data.status);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  }, [])
  const handleSaveOrder = () => {
    if (!receiverName || !address || !phoneNumber || !status) {
      alert("Please fill in all required fields");
      return;
    }

    const data = {
      receiverName,
      address,
      phoneNumber,
      status,
    };

    setLoading(true);
    axios.put(`http://localhost:5555/orders/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/dashboard');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton destination='/dashboard' />
      <h1 className='text-3xl my-4'>Edit Order</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Tên người nhận</label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          <label className='text-xl mr-4 text-gray-500'>Địa chỉ giao hàng</label>
          <input
            type="text"
            value={address}
            placeholder="Nhập mật khẩu bạn muốn sửa"
            onChange={(e) => setAddress(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          <label className='text-xl mr-4 text-gray-500'>Số điện thoại</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          <label className='text-xl mr-4 text-gray-500'>Trạng thái (Pending, Shipping, Done)</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button className='p-2 bg-sky-300' onClick={handleSaveOrder}>
          Lưu
        </button>
      </div>
    </div>
  )
}

export default EditOrder