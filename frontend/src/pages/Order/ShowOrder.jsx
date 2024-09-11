import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfo, BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';


const ShowOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/orders')
      .then((response) => {
        setOrders(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleDeleteOrder = (id) => {
    axios
      .delete(`http://localhost:5555/orders/${id}`)
      .then((response) => {
        setOrders(orders.filter(order => order._id !== id));
        setLoading(false);
      })
      .catch((error) =>{
        console.log(error);
        setLoading(false);
      })
  }

  return (
    <div className='p-4 overflow-auto bg-gray-100'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Danh sách đơn hàng</h1>
      </div>
      {loading ? (
        <Spinner/>
      ) : (
        <div className='overflow-x-auto overflow-y-auto'>
        <table className='w-full border-separate border-spacing-2'>
          <thead>
            <tr>
              <th className='border border-slate-600 rounded-md'>STT</th>
              <th className='border border-slate-600 rounded-md'>Tài khoản đặt hàng</th>
              <th className='border border-slate-600 rounded-md'>Tên người nhận</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>Địa chỉ</th>
              <th className='border border-slate-600 rounded-md'>Số điện thoại</th>
              <th className='border border-slate-600 rounded-md'>Tổng tiền</th>
              <th className='border border-slate-600 rounded-md'>Trạng thái</th>
              <th className='border border-slate-600 rounded-md'>Xử lý</th>
              
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className='h-8'>
                <td className='border border-slate-700 rounded-md text-center'>{index + 1}</td>
                <td className='border border-slate-700 rounded-md text-center'>{order.account.username}</td>
                <td className='border border-slate-700 rounded-md text-center'>{order.receiverName}</td>
                <td className='border border-slate-700 rounded-md text-center'>{order.address}</td>
                <td className='border border-slate-700 rounded-md text-center'>0{order.phoneNumber}</td>
                <td className='border border-slate-700 rounded-md text-center'>{order.totalMoney}</td>
                <td className='border border-slate-700 rounded-md text-center'>{order.status === "Pending" ? "Đang chờ xử lý" : (order.status === "Shipping" ? "Đang giao hàng" : "Đã hoàn thành")}</td>
                <td className='border border-slate-700 rounded-md text-center'>
                  <div className='flex justify-center gap-x-4'>
                    <Link to={`/orders/edit/${order._id}`}>
                      <AiOutlineEdit className='text-2xl text-yellow-800'/>
                    </Link>
                    <button onClick={() => handleDeleteOrder(order._id)}>
                      <MdOutlineDelete className='text-2xl text-red-800'/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}

export default ShowOrder